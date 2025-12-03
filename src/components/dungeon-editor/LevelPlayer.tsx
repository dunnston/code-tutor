import React, { useState, useEffect } from 'react';
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
} from '../../types/dungeonEditor';

/**
 * Level Player - Test/Play through designed levels
 *
 * This component interprets the node graph and provides an interactive playthrough
 */

interface LevelPlayerProps {
  level: DungeonLevel | null;
  onComplete?: (rewards: any) => void;
  onExit?: () => void;
}

interface PlayerState {
  currentNodeId: string;
  visitedNodes: string[];
  inventory: any[];
  health: number;
  maxHealth: number;
  totalXp: number;
  totalGold: number;
}

export const LevelPlayer: React.FC<LevelPlayerProps> = ({ level, onComplete, onExit }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentNodeId: '',
    visitedNodes: [],
    inventory: [],
    health: 100,
    maxHealth: 100,
    totalXp: 0,
    totalGold: 0,
  });

  const [output, setOutput] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<any[]>([]);

  // Initialize - find start node
  useEffect(() => {
    if (level) {
      const startNode = level.nodes.find((n) => n.type === DungeonNodeType.START);
      if (startNode) {
        setPlayerState((prev) => ({ ...prev, currentNodeId: startNode.id }));
        processNode(startNode);
      } else {
        addOutput('ERROR: No start node found in level!');
      }
    }
  }, [level]);

  const addOutput = (text: string) => {
    setOutput((prev) => [...prev, text]);
  };

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

  const processNode = (node: DungeonNode) => {
    // Mark as visited
    setPlayerState((prev) => ({
      ...prev,
      visitedNodes: [...prev.visitedNodes, node.id],
    }));

    addOutput(''); // Blank line for readability
    addOutput(`=== ${node.data.label} ===`);

    switch (node.data.nodeType) {
      case DungeonNodeType.START:
        const startData = node.data as any;
        addOutput(startData.welcomeMessage || 'Your adventure begins...');
        autoProgress(node);
        break;

      case DungeonNodeType.STORY:
        const storyData = node.data as StoryNodeData;
        addOutput(storyData.storyText);
        if (storyData.autoProgress) {
          setTimeout(() => autoProgress(node), 2000);
        } else {
          setAvailableActions([{ label: 'Continue', action: () => autoProgress(node) }]);
        }
        break;

      case DungeonNodeType.COMBAT:
        handleCombat(node);
        break;

      case DungeonNodeType.BOSS:
        handleBoss(node);
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

      case DungeonNodeType.LOOT:
        handleLoot(node);
        break;

      case DungeonNodeType.END:
        handleEnd(node);
        break;

      default:
        addOutput('Unknown node type');
        autoProgress(node);
    }
  };

  const autoProgress = (node: DungeonNode) => {
    const nextNodes = getNextNodes(node.id);
    if (nextNodes.length === 1) {
      setTimeout(() => {
        setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
        processNode(nextNodes[0]);
      }, 500);
    } else if (nextNodes.length === 0) {
      addOutput('You have reached a dead end!');
    }
  };

  const handleCombat = (node: DungeonNode) => {
    const data = node.data as CombatNodeData;
    const totalEnemies = data.enemies.reduce((sum, e) => sum + e.count, 0);

    addOutput(data.flavorText || `You encounter ${totalEnemies} enemies!`);
    data.enemies.forEach((enemy) => {
      addOutput(`- ${enemy.count}x ${enemy.type} (Level ${enemy.level})`);
    });

    setAvailableActions([
      {
        label: '⚔️ Fight!',
        action: () => {
          // Simulate combat
          const damage = Math.floor(Math.random() * 20) + 5;
          addOutput(`You take ${damage} damage during the fight!`);

          setPlayerState((prev) => ({
            ...prev,
            health: Math.max(0, prev.health - damage),
            totalXp: prev.totalXp + data.rewardXp,
            totalGold: prev.totalGold + data.rewardGold,
          }));

          addOutput(`Victory! You gain ${data.rewardXp} XP and ${data.rewardGold} gold!`);
          autoProgress(node);
        },
      },
      {
        label: '🏃 Flee',
        action: () => {
          addOutput('You flee from combat!');
          // Could add flee logic here
        },
      },
    ]);
  };

  const handleBoss = (node: DungeonNode) => {
    const data = node.data as BossNodeData;

    if (data.introDialog) {
      addOutput(`"${data.introDialog}"`);
    }

    addOutput(data.flavorText);
    addOutput(`${data.bossName} (Level ${data.bossLevel}) - ${data.health} HP`);
    addOutput(`Special Abilities: ${data.abilities.join(', ')}`);

    setAvailableActions([
      {
        label: '⚔️ Fight the Boss!',
        action: () => {
          const damage = Math.floor(Math.random() * 30) + 10;
          addOutput('An epic battle ensues!');
          addOutput(`You take ${damage} damage!`);

          setPlayerState((prev) => ({
            ...prev,
            health: Math.max(0, prev.health - damage),
            totalXp: prev.totalXp + data.rewardXp,
            totalGold: prev.totalGold + data.rewardGold,
            inventory: [...prev.inventory, ...data.rewardItems],
          }));

          addOutput(`VICTORY! You gain ${data.rewardXp} XP and ${data.rewardGold} gold!`);
          data.rewardItems.forEach((item) => {
            addOutput(`  + ${item.name} x${item.quantity}`);
          });

          autoProgress(node);
        },
      },
    ]);
  };

  const handleChoice = (node: DungeonNode) => {
    const data = node.data as ChoiceNodeData;
    addOutput(data.prompt);

    const actions = data.options.map((option) => ({
      label: option.text,
      action: () => {
        if (option.resultText) {
          addOutput(option.resultText);
        }

        // Find next node via this specific choice handle
        const nextNodes = getNextNodes(node.id, option.id);
        if (nextNodes.length > 0) {
          setTimeout(() => {
            setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
            processNode(nextNodes[0]);
          }, 500);
        } else {
          addOutput('This path leads nowhere...');
        }
      },
    }));

    setAvailableActions(actions);
  };

  const handleAbilityCheck = (node: DungeonNode) => {
    const data = node.data as AbilityCheckNodeData;
    addOutput(`${data.ability} Check (DC ${data.dc})`);

    setAvailableActions([
      {
        label: `🎲 Roll ${data.ability} Check`,
        action: () => {
          const roll = Math.floor(Math.random() * 20) + 1;
          addOutput(`You rolled: ${roll}`);

          const success = roll >= data.dc;
          addOutput(success ? `✅ ${data.successText}` : `❌ ${data.failureText}`);

          const nextNodes = getNextNodes(node.id, success ? 'success' : 'failure');
          if (nextNodes.length > 0) {
            setTimeout(() => {
              setPlayerState((prev) => ({ ...prev, currentNodeId: nextNodes[0].id }));
              processNode(nextNodes[0]);
            }, 1000);
          }
        },
      },
    ]);
  };

  const handleTrap = (node: DungeonNode) => {
    const data = node.data as TrapNodeData;
    addOutput(data.description);
    addOutput(`Trap Type: ${data.trapType} (${data.damage} damage)`);

    if (data.avoidCheck) {
      setAvailableActions([
        {
          label: `🎲 ${data.avoidCheck.ability} Check (DC ${data.avoidCheck.dc})`,
          action: () => {
            const roll = Math.floor(Math.random() * 20) + 1;
            const success = roll >= data.avoidCheck!.dc;

            if (success) {
              addOutput(`Rolled ${roll} - You avoid the trap!`);
            } else {
              addOutput(`Rolled ${roll} - You trigger the trap!`);
              setPlayerState((prev) => ({
                ...prev,
                health: Math.max(0, prev.health - data.damage),
              }));
              addOutput(`You take ${data.damage} damage!`);
            }

            autoProgress(node);
          },
        },
      ]);
    } else {
      addOutput(`You trigger the trap! -${data.damage} HP`);
      setPlayerState((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - data.damage),
      }));
      setTimeout(() => autoProgress(node), 1500);
    }
  };

  const handleLoot = (node: DungeonNode) => {
    const data = node.data as LootNodeData;
    addOutput(data.description);
    addOutput('You found:');
    data.items.forEach((item) => {
      addOutput(`  + ${item.name} x${item.quantity} - ${item.description || ''}`);
    });
    if (data.gold > 0) addOutput(`  + ${data.gold} gold`);
    if (data.xp > 0) addOutput(`  + ${data.xp} XP`);

    setPlayerState((prev) => ({
      ...prev,
      totalXp: prev.totalXp + data.xp,
      totalGold: prev.totalGold + data.gold,
      inventory: [...prev.inventory, ...data.items],
    }));

    setAvailableActions([{ label: 'Take Loot', action: () => autoProgress(node) }]);
  };

  const handleEnd = (node: DungeonNode) => {
    const data = node.data as EndNodeData;
    addOutput(data.completionMessage);

    if (data.finalRewards) {
      addOutput('\nFinal Rewards:');
      if (data.finalRewards.xp) addOutput(`  + ${data.finalRewards.xp} XP`);
      if (data.finalRewards.gold) addOutput(`  + ${data.finalRewards.gold} gold`);
      data.finalRewards.items.forEach((item) => {
        addOutput(`  + ${item.name} x${item.quantity}`);
      });
    }

    addOutput('\n=== LEVEL COMPLETE ===');
    addOutput(`Total XP Earned: ${playerState.totalXp}`);
    addOutput(`Total Gold Earned: ${playerState.totalGold}`);

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
        action: () => {
          if (onExit) onExit();
        },
      },
    ]);
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <p>No level loaded</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">{level.metadata.name}</h1>
            <p className="text-gray-400">{level.metadata.description}</p>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
            >
              Exit Playtest
            </button>
          )}
        </div>

        {/* Player Stats */}
        <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400">Health</div>
            <div className="text-lg font-bold">
              {playerState.health}/{playerState.maxHealth}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(playerState.health / playerState.maxHealth) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Total XP</div>
            <div className="text-lg font-bold text-green-400">{playerState.totalXp}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Gold</div>
            <div className="text-lg font-bold text-yellow-400">{playerState.totalGold}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Items</div>
            <div className="text-lg font-bold text-cyan-400">{playerState.inventory.length}</div>
          </div>
        </div>
      </div>

      {/* Game Output */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6 min-h-[400px] mb-4">
          <div className="font-mono text-sm space-y-2">
            {output.map((line, index) => (
              <div
                key={index}
                className={line.startsWith('===') ? 'text-orange-400 font-bold text-lg mt-4' : ''}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {availableActions.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-3">Choose your action:</div>
            <div className="grid gap-2">
              {availableActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAvailableActions([]);
                    action.action();
                  }}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-left font-semibold"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
