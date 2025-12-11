import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  DungeonLevel,
  DungeonNode,
  DungeonNodeType,
  CombatNodeData,
  ChoiceNodeData,
  AbilityCheckNodeData,
  TrapNodeData,
  LootNodeData,
  StoryNodeData,
  BossNodeData,
  EndNodeData,
  LootItem,
  QuestionNodeData,
} from '../../types/dungeonEditor';
import { CharacterStatsDisplay } from '../rpg/CharacterStats';
import { CombatModal } from '../rpg/CombatModal';
import type { CharacterStats, EnemyType, BossEnemy, DungeonChallenge } from '../../types/rpg';
import type { CombatRewards } from '../../lib/rpg';
import { getCharacterStats, getEnemyById, getCustomEnemyById, getChallengeForAction, recordChallengeAttempt, restoreHealthAndMana } from '../../lib/rpg';
import { getCurrentProfile } from '../../lib/profiles';

interface LevelPlayerEnhancedProps {
  level: DungeonLevel | null;
  userId: number;
  onComplete?: (rewards: any) => void;
  onExit?: () => void;
  skipTownPhase?: boolean; // If true, skip the town preparation screen and start immediately
}

type GamePhase = 'town' | 'narrative' | 'choice' | 'ability-check' | 'combat' | 'challenge' | 'outcome' | 'loot';

interface PlayerState {
  currentNodeId: string;
  visitedNodes: string[];
  health: number;
  maxHealth: number;
  totalXp: number;
  totalGold: number;
  inventory: LootItem[];
}

interface ActiveChoice {
  node: DungeonNode;
  selectedOption?: any;
}

export const LevelPlayerEnhanced: React.FC<LevelPlayerEnhancedProps> = ({
  level,
  userId,
  onComplete,
  onExit,
  skipTownPhase = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [playerAvatar, setPlayerAvatar] = useState<string>('');

  const [phase, setPhase] = useState<GamePhase>('town');
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentNodeId: '',
    visitedNodes: [],
    health: 100,
    maxHealth: 100,
    totalXp: 0,
    totalGold: 0,
    inventory: [],
  });

  const [narrativeText, setNarrativeText] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<any[]>([]);
  const [activeChoice, setActiveChoice] = useState<ActiveChoice | null>(null);

  // Combat state
  const [combatEnemy, setCombatEnemy] = useState<EnemyType | BossEnemy | null>(null);
  const [isBossFight, setIsBossFight] = useState(false);

  // Challenge state
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<DungeonChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [checkResult, setCheckResult] = useState<{passed: boolean; total: number; dc: number} | null>(null);

  // Outcome state
  const [outcomeMessage, setOutcomeMessage] = useState<string>('');

  useEffect(() => {
    initializePlayer();
  }, [userId, level]);

  async function initializePlayer() {
    try {
      setLoading(true);

      // Load character stats
      const characterStats = await getCharacterStats(userId);
      setStats(characterStats);

      // Load player avatar
      const currentProfile = getCurrentProfile();
      if (currentProfile) {
        setPlayerAvatar(currentProfile.avatar);
      }

      // Set initial health based on character stats
      setPlayerState(prev => ({
        ...prev,
        health: characterStats.currentHealth,
        maxHealth: characterStats.maxHealth,
      }));

      // If skipTownPhase is true, start directly at the dungeon entrance
      if (skipTownPhase && level) {
        const startNode = level.nodes.find((n) => n.type === DungeonNodeType.START);
        if (startNode) {
          // Set phase to narrative immediately to prevent town screen flash
          setPhase('narrative');
          setPlayerState((prev) => ({
            ...prev,
            currentNodeId: startNode.id,
            visitedNodes: [],
          }));
          // Process the start node immediately
          setTimeout(() => processNode(startNode), 100);
        } else {
          setPhase('town'); // Fallback to town if no start node
        }
      } else {
        // Start at town preparation screen
        setPhase('town');
      }
    } catch (error) {
      console.error('Failed to initialize player:', error);
      setNarrativeText(['Failed to load character data']);
    } finally {
      setLoading(false);
    }
  }

  const getCurrentNode = (): DungeonNode | undefined => {
    return level?.nodes.find((n) => n.id === playerState.currentNodeId);
  };

  const getNextNodes = (currentNodeId: string, sourceHandle?: string): DungeonNode[] => {
    if (!level) return [];

    const edges = level.edges.filter(
      (e) => e.source === currentNodeId && (!sourceHandle || e.sourceHandle === sourceHandle)
    );

    return edges
      .map((e) => level.nodes.find((n) => n.id === e.target))
      .filter((n) => n !== undefined) as DungeonNode[];
  };

  const addNarrative = (text: string) => {
    setNarrativeText((prev) => [...prev, text]);
  };

  const clearNarrative = () => {
    setNarrativeText([]);
  };

  const processNode = (node: DungeonNode) => {
    // Mark as visited
    setPlayerState((prev) => ({
      ...prev,
      visitedNodes: [...prev.visitedNodes, node.id],
    }));

    setPhase('narrative');
    clearNarrative();
    addNarrative(node.data.label);

    switch (node.data.nodeType) {
      case DungeonNodeType.START:
        const startData = node.data as any;
        addNarrative(startData.welcomeMessage || 'Your adventure begins...');
        autoProgress(node);
        break;

      case DungeonNodeType.STORY:
        handleStory(node);
        break;

      case DungeonNodeType.CHOICE:
        handleChoice(node);
        break;

      case DungeonNodeType.ABILITY_CHECK:
        handleAbilityCheck(node);
        break;

      case DungeonNodeType.TRAP:
        handleTrap(node);
        break;

      case DungeonNodeType.COMBAT:
        handleCombat(node);
        break;

      case DungeonNodeType.BOSS:
        handleBoss(node);
        break;

      case DungeonNodeType.LOOT:
        handleLoot(node);
        break;

      case DungeonNodeType.QUESTION:
        handleQuestionNode(node);
        break;

      case DungeonNodeType.END:
        handleEnd(node);
        break;

      default:
        autoProgress(node);
    }
  };

  const autoProgress = (node: DungeonNode) => {
    const nextNodes = getNextNodes(node.id);
    if (nextNodes.length === 1) {
      setTimeout(() => {
        setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
        processNode(nextNodes[0]);
      }, 800);
    } else if (nextNodes.length === 0) {
      addNarrative('You have reached a dead end!');
      setAvailableActions([{ label: '← Return to Editor', action: () => onExit?.() }]);
    }
  };

  const handleStory = (node: DungeonNode) => {
    const data = node.data as StoryNodeData;
    addNarrative(data.storyText);

    setAvailableActions([{
      label: 'Continue',
      action: () => autoProgress(node),
    }]);
  };

  const handleChoice = (node: DungeonNode) => {
    const data = node.data as ChoiceNodeData;
    setPhase('choice');
    addNarrative(data.prompt);

    const actions = data.options.map((option) => ({
      label: option.text,
      action: () => {
        if (option.resultText) {
          addNarrative(option.resultText);
        }

        const nextNodes = getNextNodes(node.id, option.id);
        if (nextNodes.length > 0) {
          setTimeout(() => {
            setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
            processNode(nextNodes[0]);
          }, 500);
        } else {
          addNarrative('This path leads nowhere...');
        }
      },
    }));

    setAvailableActions(actions);
  };

  const handleAbilityCheck = async (node: DungeonNode) => {
    const data = node.data as AbilityCheckNodeData;

    // Check if this ability check uses MCQ
    if (data.useMcq) {
      // MCQ-based ability check
      setPhase('challenge');
      addNarrative(`${data.ability} Check (DC ${data.dc})`);
      addNarrative('Answer the question to gain a bonus to your roll!');

      try {
        let challengeData;

        // If question ID is provided, use that specific question
        // Otherwise, get a random question
        if (data.mcqQuestionId && data.mcqQuestionId.trim() !== '') {
          challengeData = await invoke('load_mcq_question', { questionId: data.mcqQuestionId }) as any;
        } else {
          challengeData = await invoke('get_smart_mcq_question', {
            userId,
            difficulty: null,
            language: null,
            topic: null,
          }) as any;
        }

        console.log('Challenge data from backend:', challengeData);

        const parsedChallenge = {
          ...challengeData,
          choices: JSON.parse(challengeData.options),
          correctAnswer: String.fromCharCode(65 + challengeData.correctAnswerIndex), // camelCase from Rust
          question_text: challengeData.questionText, // Map camelCase to snake_case for compatibility
        };

        console.log('Parsed challenge:', parsedChallenge);
        console.log('Question text (camelCase):', challengeData.questionText);
        console.log('Question text type:', typeof challengeData.questionText);

        setChallenge(parsedChallenge);

        // Display the question text
        if (challengeData.questionText && challengeData.questionText.trim()) {
          addNarrative('');
          addNarrative(challengeData.questionText);
        } else {
          addNarrative('');
          addNarrative('[Question text missing from database]');
          console.error('Question text is empty or null:', challengeData.questionText);
        }

        // Store the ability check data for after the question is answered
        (window as any)._pendingAbilityCheck = {
          node,
          data,
        };

      } catch (error) {
        console.error('Failed to load question:', error);
        addNarrative('Failed to load challenge question - proceeding with normal roll');
        // Fall back to normal dice roll
        handleAbilityCheckRoll(node, data, false, 0);
      }
    } else {
      // Standard dice roll ability check (no MCQ)
      setPhase('ability-check');
      addNarrative(`${data.ability} Check (DC ${data.dc})`);
      addNarrative('Roll the dice to test your abilities!');

      setAvailableActions([{
        label: `🎲 Roll ${data.ability} Check`,
        action: () => handleAbilityCheckRoll(node, data, false, 0),
      }]);
    }
  };

  const handleAbilityCheckRoll = (node: DungeonNode, data: AbilityCheckNodeData, useMcqModifier: boolean, mcqModifier: number) => {
    const roll = Math.floor(Math.random() * 20) + 1;

    // Get raw stat value for non-MCQ mode instead of D&D modifier
    let rawStatValue = 0;
    if (!useMcqModifier) {
      switch (data.ability.toLowerCase()) {
        case 'str':
        case 'strength':
          rawStatValue = stats?.strength || 0;
          break;
        case 'int':
        case 'intelligence':
          rawStatValue = stats?.intelligence || 0;
          break;
        case 'dex':
        case 'dexterity':
          rawStatValue = stats?.dexterity || 0;
          break;
        case 'cha':
        case 'charisma':
          rawStatValue = stats?.charisma || 0;
          break;
      }
    }

    const modifier = useMcqModifier ? mcqModifier : rawStatValue;
    const total = roll + modifier;
    const success = total >= data.dc;

    setDiceRoll(roll);
    setCheckResult({ passed: success, total, dc: data.dc });
    setPhase('outcome');

    clearNarrative();
    addNarrative(`You rolled: ${roll} + ${modifier} (${data.ability}) = ${total}`);
    addNarrative(success ? `✅ Success!` : `❌ Failed!`);
    addNarrative(success ? data.successText : data.failureText);

    setAvailableActions([{
      label: 'Continue',
      action: () => {
        const nextNodes = getNextNodes(node.id, success ? 'success' : 'failure');
        if (nextNodes.length > 0) {
          setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
          processNode(nextNodes[0]);
        }
      },
    }]);
  };

  const handleTrap = (node: DungeonNode) => {
    const data = node.data as TrapNodeData;
    addNarrative(data.description);
    addNarrative(`Trap: ${data.trapType} (${data.damage} damage)`);

    if (data.avoidCheck) {
      setAvailableActions([{
        label: `🎲 ${data.avoidCheck.ability} Check (DC ${data.avoidCheck.dc})`,
        action: () => {
          const roll = Math.floor(Math.random() * 20) + 1;
          const modifier = getStatModifier(data.avoidCheck!.ability, stats);
          const total = roll + modifier;
          const success = total >= data.avoidCheck!.dc;

          if (success) {
            addNarrative(`Rolled ${total} - You avoid the trap!`);
          } else {
            addNarrative(`Rolled ${total} - You trigger the trap!`);
            const newHealth = Math.max(0, playerState.health - data.damage);
            setPlayerState((prev) => ({
              ...prev,
              health: newHealth,
            }));
            setStats((prev) => prev ? ({
              ...prev,
              currentHealth: newHealth,
            }) : prev);
            addNarrative(`You take ${data.damage} damage!`);
          }

          autoProgress(node);
        },
      }]);
    } else {
      addNarrative(`You trigger the trap! -${data.damage} HP`);
      const newHealth = Math.max(0, playerState.health - data.damage);
      setPlayerState((prev) => ({
        ...prev,
        health: newHealth,
      }));
      setStats((prev) => prev ? ({
        ...prev,
        currentHealth: newHealth,
      }) : prev);
      setTimeout(() => autoProgress(node), 1500);
    }
  };

  const handleCombat = async (node: DungeonNode) => {
    const data = node.data as CombatNodeData;
    addNarrative(data.flavorText || 'Enemies appear!');

    // Load enemy details to show proper names
    const enemyPromises = data.enemies.map(async (enemyRef) => {
      if (enemyRef.customEnemyId) {
        try {
          const enemy = await getCustomEnemyById(enemyRef.customEnemyId);
          return { ...enemyRef, name: enemy.name };
        } catch {
          return { ...enemyRef, name: 'Unknown Enemy' };
        }
      }
      return { ...enemyRef, name: enemyRef.type || 'Unknown' };
    });

    const enemiesWithNames = await Promise.all(enemyPromises);

    // Flatten enemy groups (e.g., 3x Giant Rat becomes 3 separate combats)
    const flattenedEnemies: Array<{ customEnemyId: string; name: string; level: number }> = [];
    enemiesWithNames.forEach((enemyGroup) => {
      for (let i = 0; i < enemyGroup.count; i++) {
        flattenedEnemies.push({
          customEnemyId: enemyGroup.customEnemyId!,
          name: enemyGroup.name,
          level: enemyGroup.level,
        });
      }
    });

    addNarrative(`Total enemies: ${flattenedEnemies.length}`);
    enemiesWithNames.forEach((enemy) => {
      addNarrative(`- ${enemy.count}x ${enemy.name} (Level ${enemy.level})`);
    });

    // Start combat sequence
    let currentEnemyIndex = 0;

    const startNextCombat = async () => {
      if (currentEnemyIndex >= flattenedEnemies.length) {
        // All enemies defeated
        clearNarrative();
        addNarrative('🎉 Victory! All enemies defeated!');
        addNarrative(`You earned ${data.rewardXp} XP and ${data.rewardGold} gold!`);

        setPlayerState((prev) => ({
          ...prev,
          totalXp: prev.totalXp + data.rewardXp,
          totalGold: prev.totalGold + data.rewardGold,
        }));

        setAvailableActions([{
          label: 'Continue',
          action: () => autoProgress(node),
        }]);
        return;
      }

      const currentEnemy = flattenedEnemies[currentEnemyIndex];

      try {
        const enemy = await getCustomEnemyById(currentEnemy.customEnemyId);
        setCombatEnemy(enemy);
        setIsBossFight(false);
        setPhase('combat');
      } catch (error) {
        console.error('Failed to load enemy:', error);
        addNarrative(`ERROR: Could not load enemy with ID: ${currentEnemy.customEnemyId}`);
        addNarrative('Please ensure the enemy exists in the Enemy Manager.');
      }
    };

    setAvailableActions([{
      label: `⚔️ Enter Combat (${flattenedEnemies.length} enemies)`,
      action: startNextCombat,
    }]);

    // Override handleCombatVictory to continue the sequence
    const originalHandleCombatVictory = handleCombatVictory;
    window._dungeonCombatSequence = {
      enemies: flattenedEnemies,
      currentIndex: 0,
      onVictory: (rewards: CombatRewards) => {
        currentEnemyIndex++;
        const remaining = flattenedEnemies.length - currentEnemyIndex;

        clearNarrative();
        addNarrative(`Defeated ${flattenedEnemies[currentEnemyIndex - 1].name}!`);
        addNarrative(`Enemies remaining: ${remaining}`);

        if (remaining > 0) {
          setAvailableActions([{
            label: `⚔️ Fight Next Enemy (${remaining} left)`,
            action: startNextCombat,
          }]);
        } else {
          // Final enemy defeated
          addNarrative('🎉 All enemies defeated!');
          addNarrative(`Total rewards: ${data.rewardXp} XP and ${data.rewardGold} gold!`);

          setPlayerState((prev) => ({
            ...prev,
            totalXp: prev.totalXp + data.rewardXp,
            totalGold: prev.totalGold + data.rewardGold,
          }));

          setAvailableActions([{
            label: 'Continue',
            action: () => autoProgress(node),
          }]);
        }
      },
    };
  };

  const handleBoss = async (node: DungeonNode) => {
    const data = node.data as BossNodeData;

    if (data.introDialog) {
      addNarrative(`"${data.introDialog}"`);
    }

    addNarrative(data.flavorText);
    addNarrative(`${data.bossName} (Level ${data.bossLevel}) - ${data.health} HP`);

    setAvailableActions([{
      label: '⚔️ Fight the Boss!',
      action: async () => {
        // Check if we have a valid enemy ID
        if (!data.customEnemyId) {
          console.error('Boss node missing customEnemyId. Please configure boss in the Enemy Manager.');
          addNarrative('ERROR: No boss enemy configured for this encounter.');
          addNarrative('Please configure the boss using the Enemy Manager.');
          return;
        }

        try {
          const enemy = await getCustomEnemyById(data.customEnemyId);
          setCombatEnemy(enemy);
          setIsBossFight(true);
          setPhase('combat');
        } catch (error) {
          console.error('Failed to load boss:', error);
          addNarrative(`ERROR: Could not load boss with ID: ${data.customEnemyId}`);
          addNarrative('Please ensure the boss exists in the Enemy Manager.');
        }
      },
    }]);
  };

  const handleLoot = (node: DungeonNode) => {
    const data = node.data as LootNodeData;
    setPhase('loot');

    addNarrative(data.description);
    addNarrative('You found:');

    data.items.forEach((item) => {
      addNarrative(`  + ${item.name} x${item.quantity} - ${item.description || ''}`);
    });

    if (data.gold > 0) addNarrative(`  + ${data.gold} gold`);
    if (data.xp > 0) addNarrative(`  + ${data.xp} XP`);

    setPlayerState((prev) => ({
      ...prev,
      totalXp: prev.totalXp + data.xp,
      totalGold: prev.totalGold + data.gold,
      inventory: [...prev.inventory, ...data.items],
    }));

    setAvailableActions([{
      label: 'Take Loot',
      action: async () => {
        try {
          // Add items to actual inventory in database
          if (data.items.length > 0) {
            await invoke('add_dungeon_loot_to_inventory', {
              userId,
              lootItems: data.items
            });
            addNarrative('✅ Items added to your inventory!');
          }
        } catch (error) {
          console.error('Failed to add loot to inventory:', error);
          addNarrative('⚠️ Warning: Failed to save items to inventory');
        }
        autoProgress(node);
      },
    }]);
  };

  const handleQuestionNode = async (node: DungeonNode) => {
    const data = node.data as QuestionNodeData;
    setPhase('challenge');

    try {
      const challengeData = await invoke('load_mcq_question', { questionId: data.questionId }) as any;
      const parsedChallenge = {
        ...challengeData,
        choices: JSON.parse(challengeData.options),
        correctAnswer: String.fromCharCode(65 + challengeData.correct_answer_index), // 0 -> 'A', 1 -> 'B', etc.
      };

      setChallenge(parsedChallenge);
      addNarrative(parsedChallenge.question_text);

    } catch (error) {
      console.error('Failed to load question:', error);
      addNarrative('Failed to load challenge question');
      autoProgress(node);
    }
  };

  const handleChallengeSubmit = (node: DungeonNode) => {
    if (!challenge || !selectedAnswer) return;

    const correct = selectedAnswer === challenge.correctAnswer;

    // Check if this is an ability check with MCQ
    const pendingCheck = (window as any)._pendingAbilityCheck;
    if (pendingCheck) {
      // This is an ability check - show result and proceed to dice roll
      clearNarrative();

      // Get the raw stat value (not the D&D modifier)
      let statValue = 0;
      switch (pendingCheck.data.ability.toLowerCase()) {
        case 'str':
        case 'strength':
          statValue = stats?.strength || 0;
          break;
        case 'int':
        case 'intelligence':
          statValue = stats?.intelligence || 0;
          break;
        case 'dex':
        case 'dexterity':
          statValue = stats?.dexterity || 0;
          break;
        case 'cha':
        case 'charisma':
          statValue = stats?.charisma || 0;
          break;
      }

      const modifier = correct ? statValue : -2;
      addNarrative(correct ? `✅ Correct! Your modifier is +${statValue}` : '❌ Incorrect - your modifier is -2');

      // Clear the pending check
      (window as any)._pendingAbilityCheck = null;
      setChallenge(null);
      setSelectedAnswer('');

      setAvailableActions([{
        label: `🎲 Roll ${pendingCheck.data.ability} Check`,
        action: () => handleAbilityCheckRoll(pendingCheck.node, pendingCheck.data, true, modifier),
      }]);
    } else {
      // Regular question node - use correct/incorrect paths
      setPhase('outcome');

      clearNarrative();
      addNarrative(correct ? '✅ Correct!' : '❌ Incorrect');

      const nextNodes = getNextNodes(node.id, correct ? 'correct' : 'incorrect');

      setAvailableActions([{
        label: 'Continue',
        action: () => {
          if (nextNodes.length > 0) {
            setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
            processNode(nextNodes[0]);
          }
        },
      }]);
    }
  };

  const handleEnd = (node: DungeonNode) => {
    const data = node.data as EndNodeData;
    setPhase('outcome');

    clearNarrative();
    addNarrative(data.completionMessage);

    if (data.finalRewards) {
      addNarrative('\nFinal Rewards:');
      if (data.finalRewards.xp) addNarrative(`  + ${data.finalRewards.xp} XP`);
      if (data.finalRewards.gold) addNarrative(`  + ${data.finalRewards.gold} gold`);
      data.finalRewards.items.forEach((item) => {
        addNarrative(`  + ${item.name} x${item.quantity}`);
      });
    }

    addNarrative('\n=== LEVEL COMPLETE ===');
    addNarrative(`Total XP Earned: ${playerState.totalXp}`);
    addNarrative(`Total Gold Earned: ${playerState.totalGold}`);

    if (onComplete) {
      onComplete({
        xp: playerState.totalXp,
        gold: playerState.totalGold,
        inventory: playerState.inventory,
      });
    }

    setAvailableActions([
      {
        label: '🏆 Finish',
        action: () => onExit?.(),
      },
    ]);
  };

  const simulateCombat = (xp: number, gold: number, node: DungeonNode, items: LootItem[] = []) => {
    const damage = Math.floor(Math.random() * 20) + 10;
    addNarrative('Combat ensues!');
    addNarrative(`You take ${damage} damage!`);

    setPlayerState((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - damage),
      totalXp: prev.totalXp + xp,
      totalGold: prev.totalGold + gold,
      inventory: [...prev.inventory, ...items],
    }));

    addNarrative(`Victory! You gain ${xp} XP and ${gold} gold!`);

    setTimeout(() => autoProgress(node), 1500);
  };

  const handleCombatVictory = (rewards: CombatRewards) => {
    const node = getCurrentNode();
    if (!node) return;

    setCombatEnemy(null);
    setPhase('narrative');

    // Check if this is part of a multi-enemy sequence
    const sequence = (window as any)._dungeonCombatSequence;
    if (sequence && sequence.onVictory) {
      sequence.onVictory(rewards);
      return;
    }

    // Single enemy victory (default behavior)
    clearNarrative();
    addNarrative(`Victory! You defeated the enemy!`);
    addNarrative(`Earned ${rewards.xpGained} XP and ${rewards.goldGained} gold!`);

    setPlayerState((prev) => ({
      ...prev,
      totalXp: prev.totalXp + rewards.xpGained,
      totalGold: prev.totalGold + rewards.goldGained,
    }));

    setAvailableActions([{
      label: 'Continue',
      action: () => autoProgress(node),
    }]);
  };

  const handleCombatDefeat = () => {
    setPhase('outcome');
    clearNarrative();
    addNarrative('You have been defeated!');
    addNarrative('Your adventure ends here...');

    setCombatEnemy(null);

    setAvailableActions([{
      label: 'Return to Editor',
      action: () => onExit?.(),
    }]);
  };

  const handleFlee = () => {
    setPhase('outcome');
    clearNarrative();
    addNarrative('You flee from combat!');
    addNarrative('You escape back to the safety of town.');

    setCombatEnemy(null);

    setAvailableActions([{
      label: 'Return to Town',
      action: () => onExit?.(),
    }]);
  };

  const handleEnterDungeon = () => {
    if (!level) return;

    // Find start node
    const startNode = level.nodes.find((n) => n.type === DungeonNodeType.START);
    if (startNode) {
      setPlayerState((prev) => ({
        ...prev,
        currentNodeId: startNode.id,
        visitedNodes: [], // Reset visited nodes when entering
      }));
      processNode(startNode);
    } else {
      setNarrativeText(['ERROR: No start node found in level!']);
    }
  };

  const handleRestAtInn = async () => {
    try {
      await restoreHealthAndMana(userId);

      // Reload character stats
      const characterStats = await getCharacterStats(userId);
      setStats(characterStats);
      setPlayerState(prev => ({
        ...prev,
        health: characterStats.currentHealth,
        maxHealth: characterStats.maxHealth,
      }));

      console.log('Rested at inn - health and mana restored!');
    } catch (err) {
      console.error('Failed to rest:', err);
    }
  };

  const returnToTown = () => {
    setPhase('town');
    clearNarrative();
    setAvailableActions([]);
    setCombatEnemy(null);

    // Reset player position but keep earned rewards
    setPlayerState(prev => ({
      ...prev,
      currentNodeId: '',
      visitedNodes: [],
    }));
  };

  function getStatModifier(ability: string, stats: CharacterStats | null): number {
    if (!stats) return 0;

    switch (ability.toLowerCase()) {
      case 'str':
      case 'strength':
        return Math.floor((stats.strength - 10) / 2);
      case 'int':
      case 'intelligence':
        return Math.floor((stats.intelligence - 10) / 2);
      case 'dex':
      case 'dexterity':
        return Math.floor((stats.dexterity - 10) / 2);
      case 'cha':
      case 'charisma':
        return Math.floor((stats.charisma - 10) / 2);
      default:
        return 0;
    }
  }

  if (loading || !level || !stats) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full mx-4 animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-32 bg-slate-700 rounded" />
            <div className="h-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-slate-800 rounded-lg max-w-6xl w-full my-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 p-6">
            <div>
              <h2 className="text-2xl font-bold text-orange-400">
                🗺️ {level.metadata.name}
              </h2>
              <p className="text-sm text-gray-400">{level.metadata.description}</p>
            </div>
            <button
              onClick={onExit}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Town View */}
            {phase === 'town' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-orange-400 mb-2">🏰 Town</h3>
                  <p className="text-gray-400">Prepare for your dungeon adventure</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Character Stats Card */}
                  <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6">
                    <CharacterStatsDisplay stats={stats} compact />
                  </div>

                  {/* Progress Card */}
                  <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Adventure Progress</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">XP Earned:</span>
                        <span className="text-green-400 font-semibold">{playerState.totalXp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gold Earned:</span>
                        <span className="text-yellow-400 font-semibold">{playerState.totalGold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Items Collected:</span>
                        <span className="text-cyan-400 font-semibold">{playerState.inventory.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Town Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleEnterDungeon}
                    className="w-full bg-orange-500 hover:bg-orange-600 border-2 border-orange-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                  >
                    ⚔️ Enter Dungeon
                  </button>

                  <button
                    onClick={handleRestAtInn}
                    className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    🛏️ Rest at Inn (Restore Health & Mana)
                  </button>

                  <button
                    onClick={onExit}
                    className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    ← Return to Editor
                  </button>
                </div>
              </div>
            )}

            {/* Dungeon View */}
            {phase !== 'town' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Character Stats */}
              <div className="lg:col-span-1">
                <CharacterStatsDisplay stats={stats} />

                <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Progress
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Health:</span>
                      <span className="text-white">{playerState.health}/{playerState.maxHealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">XP Earned:</span>
                      <span className="text-green-400">{playerState.totalXp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gold Earned:</span>
                      <span className="text-yellow-400">{playerState.totalGold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Items:</span>
                      <span className="text-cyan-400">{playerState.inventory.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Narrative & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Narrative Panel */}
                <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 min-h-[300px]">
                  <div className="prose prose-invert max-w-none">
                    {narrativeText.map((line, index) => (
                      <p key={index} className="text-gray-300 leading-relaxed mb-3">
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Challenge Display */}
                  {phase === 'challenge' && challenge && (
                    <div className="mt-6">
                      <div className="space-y-3">
                        {challenge.choices?.map((choice: string, index: number) => {
                          const letter = choice.charAt(0);
                          const isSelected = selectedAnswer === letter;
                          return (
                            <button
                              key={index}
                              onClick={() => setSelectedAnswer(letter)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'bg-orange-500 border-orange-400 text-white'
                                  : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-orange-500'
                              }`}
                            >
                              {choice}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => {
                          const node = getCurrentNode();
                          if (node) handleChallengeSubmit(node);
                        }}
                        disabled={!selectedAnswer}
                        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {availableActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAvailableActions([]);
                        action.action();
                      }}
                      className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-orange-500 hover:border-orange-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-left"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Combat Modal */}
      {phase === 'combat' && combatEnemy && stats && (
        <CombatModal
          userId={userId}
          enemy={combatEnemy}
          isBoss={isBossFight}
          playerStats={stats}
          playerAvatar={playerAvatar}
          floorNumber={1}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onFlee={handleFlee}
        />
      )}
    </>
  );
};
