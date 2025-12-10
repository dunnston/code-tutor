import React, { useState, useEffect } from 'react';
import {
  getDungeonFloor,
  getUserDungeonProgress,
  getRandomEnemyForFloor,
  getBossForFloor,
  getEnemyById,
  updateDungeonFloor,
  getCharacterStats,
  restoreHealthAndMana,
  getRandomEncounter,
  // Narrative system
  startNarrativeDungeon,
  getNarrativeLocation,
  getLocationChoices,
  rollD20,
  resolveSkillCheck,
  makeSimpleChoice,
  getChallengeForAction,
  recordChallengeAttempt,
  getOutcomeByType,
  // Consumables
  getConsumableInventory,
  useConsumable,
} from '../../lib/rpg';
import type {
  DungeonFloor,
  UserDungeonProgress,
  EnemyType,
  BossEnemy,
  CharacterStats,
  DungeonEncounter,
  NarrativeLocation,
  NarrativeChoice,
  NarrativeOutcome,
  SkillCheckResult,
  DungeonChallenge,
  SkillType,
  UserConsumableInventoryItem,
} from '../../types/rpg';
import { convertNarrativeOutcome } from '../../types/rpg';
import { CharacterStatsDisplay } from './CharacterStats';
import { CombatModal } from './CombatModal';
import type { CombatRewards } from '../../lib/rpg';
import { getCurrentProfile } from '../../lib/profiles';
import { useAchievements } from '../../hooks/useAchievements';

interface DungeonExplorerProps {
  userId: number;
  onClose: () => void;
}

type ExplorationPhase = 'narrative' | 'skill-check' | 'challenge' | 'outcome' | 'combat';

interface EncounterState {
  type: 'enemy' | 'boss' | 'treasure' | 'trap' | 'rest';
  enemy?: EnemyType | BossEnemy;
  isBoss?: boolean;
  encounter?: DungeonEncounter;
  description?: string;
}

export function DungeonExplorer({ userId, onClose }: DungeonExplorerProps) {
  const [floor, setFloor] = useState<DungeonFloor | null>(null);
  const [progress, setProgress] = useState<UserDungeonProgress | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [phase, setPhase] = useState<ExplorationPhase>('narrative');
  const [encounter, setEncounter] = useState<EncounterState | null>(null);
  const [loading, setLoading] = useState(true);

  // Narrative system state
  const [currentLocation, setCurrentLocation] = useState<NarrativeLocation | null>(null);
  const [availableChoices, setAvailableChoices] = useState<NarrativeChoice[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<NarrativeChoice | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<DungeonChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [skillCheckResult, setSkillCheckResult] = useState<SkillCheckResult | null>(null);
  const [currentOutcome, setCurrentOutcome] = useState<NarrativeOutcome | null>(null);
  const [combatChoiceId, setCombatChoiceId] = useState<string | null>(null);

  // Consumables inventory state
  const [consumables, setConsumables] = useState<UserConsumableInventoryItem[]>([]);
  const [showPotions, setShowPotions] = useState(false);

  // Player avatar
  const [playerAvatar, setPlayerAvatar] = useState<string>('');

  // Achievement tracking
  const { trackEnemyDefeated, trackBossDefeated, trackFloorCleared, trackGoldEarned, trackXpEarned } = useAchievements();

  useEffect(() => {
    loadDungeonState();
  }, [userId]);

  async function loadDungeonState() {
    try {
      setLoading(true);
      const [userProgress, characterStats, consumableInventory] = await Promise.all([
        getUserDungeonProgress(userId),
        getCharacterStats(userId),
        getConsumableInventory(userId),
      ]);

      const currentFloor = await getDungeonFloor(userProgress.currentFloor);

      setProgress(userProgress);
      setStats(characterStats);
      setFloor(currentFloor);
      setConsumables(consumableInventory);

      // Load player avatar from profile
      const currentProfile = getCurrentProfile();
      if (currentProfile) {
        setPlayerAvatar(currentProfile.avatar);
      }

      // Start narrative dungeon - this gets the starting location
      console.log('Starting narrative dungeon for user', userId);
      const { location, progress: narrativeProgress } = await startNarrativeDungeon(userId, 1);
      console.log('Loaded location:', location);
      setCurrentLocation(location);

      // Load choices for this location
      const choices = await getLocationChoices(location.id, userId);
      console.log('Loaded choices:', choices);
      setAvailableChoices(choices);
      setPhase('narrative');
    } catch (err) {
      console.error('Failed to load dungeon state:', err);
      alert(`Failed to load dungeon: ${err}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  }

  async function handleUsePotion(consumableId: string) {
    try {
      const updatedStats = await useConsumable(userId, consumableId);
      setStats(updatedStats);

      // Reload consumables inventory
      const updatedConsumables = await getConsumableInventory(userId);
      setConsumables(updatedConsumables);

      console.log(`Used potion ${consumableId}`);
    } catch (err) {
      console.error('Failed to use potion:', err);
      alert(`Failed to use potion: ${err}`);
    }
  }

  // Handle selecting a choice
  async function handleChoiceSelect(choice: NarrativeChoice) {
    setSelectedChoice(choice);

    if (choice.requiresSkillCheck && choice.skillType && choice.skillDc) {
      // This is a skill check - roll the dice!
      const roll = await rollD20();
      setDiceRoll(roll);
      setPhase('skill-check');
    } else {
      // Simple choice - execute immediately
      try {
        console.log('Making simple choice:', choice.id);
        const { outcome, progress: narrativeProgress } = await makeSimpleChoice(userId, choice.id);
        console.log('Got outcome:', outcome);
        console.log('Outcome triggers combat?', outcome.triggersCombat);
        console.log('Outcome enemy ID:', outcome.enemyId);

        // IMPORTANT: Store choice ID BEFORE handling outcome in case combat is triggered
        if (outcome.triggersCombat && outcome.enemyId) {
          console.log('PRE-STORING combat choice ID:', choice.id);
          setCombatChoiceId(choice.id);
        }

        await handleOutcome(outcome);
      } catch (err) {
        console.error('Failed to make choice:', err);
        alert(`Failed to make choice: ${err}`);
      }
    }
  }

  // After dice roll, load the coding challenge
  async function handleStartChallenge() {
    if (!selectedChoice || !selectedChoice.challengeActionType) return;

    try {
      const challengeData = await getChallengeForAction(
        selectedChoice.challengeActionType,
        floor?.floorNumber || 1,
        undefined,
        userId
      );
      setChallenge(challengeData);
      setSelectedAnswer('');
      setPhase('challenge');
    } catch (err) {
      console.error('Failed to load challenge:', err);
    }
  }

  // Submit the challenge answer and resolve the skill check
  async function handleChallengeSubmit() {
    if (!selectedChoice || !challenge || !selectedAnswer || !stats || diceRoll === null) return;

    try {
      // Check if answer is correct
      const challengeSuccess = selectedAnswer === challenge.correctAnswer;

      // Record the challenge attempt
      await recordChallengeAttempt(userId, challenge.id, challengeSuccess, 1);

      // Get the stat modifier based on skill type
      const statModifier = getStatModifier(selectedChoice.skillType, stats);

      // Resolve the skill check
      const result = await resolveSkillCheck(
        userId,
        selectedChoice.id,
        diceRoll,
        statModifier,
        challengeSuccess
      );

      // Convert the outcome from snake_case (Rust) to camelCase (TypeScript)
      const convertedOutcome = convertNarrativeOutcome(result.outcome);

      setSkillCheckResult(result);
      await handleOutcome(convertedOutcome);
    } catch (err) {
      console.error('Failed to submit challenge:', err);
    }
  }

  // Handle the outcome of a choice
  async function handleOutcome(outcome: any) {
    console.log('Handling outcome:', outcome);
    setCurrentOutcome(outcome);
    setPhase('outcome');

    // Check if combat is triggered - preload the enemy but don't start combat yet
    if (outcome.triggersCombat && outcome.enemyId) {
      console.log('Combat will be triggered! Loading enemy:', outcome.enemyId);
      // Store the choice ID that triggered combat so we can apply the success outcome later
      if (selectedChoice) {
        setCombatChoiceId(selectedChoice.id);
        console.log('Stored combat choice ID:', selectedChoice.id);
      }
      try {
        const enemy = await getEnemyById(outcome.enemyId);
        console.log('Loaded enemy:', enemy);
        setEncounter({ type: 'enemy', enemy, isBoss: false });
        // Don't auto-start combat - wait for Continue button
      } catch (err) {
        console.error('Failed to load enemy:', err);
      }
    }

    // Don't auto-continue - wait for user to click Continue button
  }

  async function handleContinueFromOutcome() {
    if (!currentOutcome) return;

    console.log('Continue from outcome:', currentOutcome);

    // Handle combat defeat - close the dungeon
    if (currentOutcome.id === 'combat_defeat') {
      onClose();
      return;
    }

    // Handle combat victory or flee - reload dungeon state
    if (currentOutcome.id === 'combat_victory' || currentOutcome.id === 'combat_flee') {
      setCurrentOutcome(null);
      setSelectedChoice(null);
      setDiceRoll(null);
      setChallenge(null);
      setSelectedAnswer('');
      setSkillCheckResult(null);
      await loadDungeonState();
      return;
    }

    // Check if this outcome should trigger combat
    if (currentOutcome.triggersCombat && encounter) {
      console.log('Starting combat from Continue button!');
      setPhase('combat');
      return;
    }

    // Handle narrative outcomes - ALWAYS move to next location if provided
    if (currentOutcome.nextLocationId) {
      console.log('Moving to next location:', currentOutcome.nextLocationId);
      try {
        // Reload character stats to reflect any damage/healing/rewards
        const updatedStats = await getCharacterStats(userId);
        setStats(updatedStats);
        console.log('Reloaded character stats after outcome');

        const nextLocation = await getNarrativeLocation(currentOutcome.nextLocationId);
        console.log('Loaded next location:', nextLocation);
        setCurrentLocation(nextLocation);
        const choices = await getLocationChoices(nextLocation.id, userId);
        console.log('Loaded next choices:', choices);
        setAvailableChoices(choices);
        setPhase('narrative');
        // Reset state
        setSelectedChoice(null);
        setDiceRoll(null);
        setChallenge(null);
        setSelectedAnswer('');
        setSkillCheckResult(null);
        setCurrentOutcome(null);
      } catch (err) {
        console.error('Failed to load next location:', err);
        // Fallback to reloading dungeon state
        await loadDungeonState();
      }
    } else {
      console.warn('No nextLocationId in outcome! This might be a data issue.');
      console.log('Current outcome:', currentOutcome);
      console.log('nextLocationId value:', currentOutcome.nextLocationId);
      console.log('Type of nextLocationId:', typeof currentOutcome.nextLocationId);
      console.log('All outcome keys:', Object.keys(currentOutcome));
      // This shouldn't happen - reload dungeon state as fallback
      await loadDungeonState();
    }
  }

  function getStatModifier(skillType: SkillType | null, stats: CharacterStats): number {
    if (!skillType) return 0;

    // Simple 1:1 mapping - stat value is the modifier
    switch (skillType) {
      case 'strength':
        return stats.strength;
      case 'intelligence':
        return stats.intelligence;
      case 'dexterity':
        return stats.dexterity;
      case 'charisma':
        return stats.charisma;
      default:
        return 0;
    }
  }

  function handleStartCombat() {
    setPhase('combat');
  }

  async function handleCombatVictory(rewards: CombatRewards) {
    console.log('Combat victory! Rewards:', rewards);

    // Track achievement progress
    try {
      await trackEnemyDefeated();
      if (rewards.xpGained > 0) {
        await trackXpEarned(rewards.xpGained);
      }
      if (rewards.goldGained > 0) {
        await trackGoldEarned(rewards.goldGained);
      }
      // Check if it was a boss (you might want to add a flag in rewards for this)
      if (encounter?.enemy && 'isBoss' in encounter.enemy) {
        await trackBossDefeated();
      }
    } catch (error) {
      console.error('Failed to track combat achievements:', error);
    }

    // If we have the combat choice ID, get the success outcome
    if (combatChoiceId) {
      console.log('Fetching success outcome for combat choice:', combatChoiceId);
      try {
        const { outcome } = await getOutcomeByType(userId, combatChoiceId, 'success');
        console.log('Got success outcome:', outcome);

        // Apply the proper success outcome (with rewards message appended)
        setCurrentOutcome({
          ...outcome,
          description: `${outcome.description}\n\nYou earned ${rewards.xpGained} XP and ${rewards.goldGained} gold!`,
        });
        setPhase('outcome');
        setEncounter(null);
        setCombatChoiceId(null); // Clear the stored choice ID
        return;
      } catch (err) {
        console.error('Failed to get success outcome, using fallback:', err);
        // Fall through to fallback behavior
      }
    }

    // Fallback: Show victory message as a generic outcome
    console.warn('No combat choice ID found or failed to fetch outcome, using fallback');
    setCurrentOutcome({
      id: 'combat_victory',
      choiceId: '',
      outcomeType: 'success',
      description: `Victory! You defeated the enemies and earned ${rewards.xpGained} XP and ${rewards.goldGained} gold!`,
      nextLocationId: currentLocation?.id || null,
      triggersCombat: false,
      enemyId: null,
      enemyCount: 0,
      createdAt: new Date(),
    } as NarrativeOutcome);

    setPhase('outcome');
    setEncounter(null);
    // Don't auto-continue, wait for Continue button
  }

  function handleCombatDefeat() {
    console.log('Combat defeat!');

    setCurrentOutcome({
      id: 'combat_defeat',
      choiceId: '',
      outcomeType: 'failure',
      description: 'You have been defeated! Your wounds are grievous and you must retreat from the dungeon...',
      nextLocationId: null,
      triggersCombat: false,
      enemyId: null,
      enemyCount: 0,
      createdAt: new Date(),
    } as NarrativeOutcome);

    setPhase('outcome');
    setEncounter(null);
    // Don't auto-continue, wait for Continue button (or close if defeat)
  }

  function handleFlee() {
    console.log('Fled from combat!');

    setCurrentOutcome({
      id: 'combat_flee',
      choiceId: '',
      outcomeType: 'default',
      description: 'You flee from combat! You manage to escape back to safety.',
      nextLocationId: currentLocation?.id || null,
      triggersCombat: false,
      enemyId: null,
      enemyCount: 0,
      createdAt: new Date(),
    } as NarrativeOutcome);

    setPhase('outcome');
    setEncounter(null);
    // Don't auto-continue, wait for Continue button
  }

  async function handleDescendFloor() {
    if (!progress || !floor) return;

    try {
      const nextFloor = floor.floorNumber + 1;
      await updateDungeonFloor(userId, nextFloor);
      console.log(`Descending to Floor ${nextFloor}...`);
      setTimeout(() => {
        loadDungeonState();
      }, 1500);
    } catch (err) {
      console.error('Failed to descend floor:', err);
    }
  }

  if (loading || !floor || !stats || !progress) {
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
                🗺️ {floor.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
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
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white">{stats.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Enemies Defeated:</span>
                      <span className="text-white">{progress.totalEnemiesDefeated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bosses Defeated:</span>
                      <span className="text-white">{progress.totalBossesDefeated}</span>
                    </div>
                  </div>
                </div>

                {/* Potions/Consumables Panel */}
                <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase">
                      🧪 Potions
                    </h4>
                    <button
                      onClick={() => setShowPotions(!showPotions)}
                      className="text-xs text-orange-400 hover:text-orange-300"
                    >
                      {showPotions ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showPotions && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {consumables.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No potions available</p>
                      ) : (
                        consumables.map((item) => (
                          <div
                            key={item.id}
                            className="bg-slate-800 rounded p-2 flex items-start gap-2"
                          >
                            <span className="text-xl">{item.consumable.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-white truncate">
                                  {item.consumable.name}
                                </span>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  x{item.quantity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                {item.consumable.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {item.consumable.healthRestore > 0 && (
                                  <span className="text-xs text-green-400">
                                    +{item.consumable.healthRestore === 999 ? 'Full' : item.consumable.healthRestore} HP
                                  </span>
                                )}
                                {item.consumable.manaRestore > 0 && (
                                  <span className="text-xs text-blue-400">
                                    +{item.consumable.manaRestore === 999 ? 'Full' : item.consumable.manaRestore} MP
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleUsePotion(item.consumable.id)}
                                disabled={phase === 'combat'}
                                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-xs font-semibold py-1 px-2 rounded transition-colors"
                              >
                                Use
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Narrative & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Narrative Panel */}
                <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 min-h-[200px]">
                  <div className="prose prose-invert max-w-none">
                    {currentLocation && phase === 'narrative' && (
                      <>
                        <h3 className="text-xl font-bold text-orange-400 mb-3">
                          {currentLocation.icon} {currentLocation.name}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">{currentLocation.description}</p>
                      </>
                    )}

                    {phase === 'skill-check' && selectedChoice && diceRoll !== null && (
                      <>
                        <h3 className="text-xl font-bold text-orange-400 mb-3">🎲 Skill Check</h3>
                        <p className="text-gray-300 mb-4">{selectedChoice.choiceText}</p>
                        <div className="bg-slate-800 border-2 border-orange-500 rounded-lg p-4 mb-4">
                          <p className="text-center text-4xl font-bold text-orange-400 mb-2">
                            {diceRoll}
                          </p>
                          <p className="text-center text-sm text-gray-400">
                            You rolled a d20! DC: {selectedChoice.skillDc}
                          </p>
                          <p className="text-center text-sm text-gray-300 mt-2">
                            Answer the coding challenge correctly to add your {selectedChoice.skillType?.toUpperCase()} modifier!
                          </p>
                        </div>
                      </>
                    )}

                    {phase === 'challenge' && challenge && (
                      <>
                        <h3 className="text-xl font-bold text-orange-400 mb-3">{challenge.title}</h3>
                        <p className="text-gray-300 whitespace-pre-line mb-4">{challenge.description}</p>
                      </>
                    )}

                    {phase === 'outcome' && (skillCheckResult || currentOutcome) && (
                      <>
                        <h3 className="text-xl font-bold text-orange-400 mb-3">
                          {skillCheckResult ? 'Result' : 'Outcome'}
                        </h3>
                        {skillCheckResult && (
                          <div className={`p-4 rounded-lg mb-4 ${
                            skillCheckResult.check_passed
                              ? 'bg-green-900/50 border-2 border-green-500'
                              : 'bg-red-900/50 border-2 border-red-500'
                          }`}>
                            <p className="font-bold mb-2">
                              {skillCheckResult.check_passed ? '✅ Success!' : '❌ Failure'}
                            </p>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-gray-400">d20 Roll:</span> <span className="font-bold">{skillCheckResult.dice_roll}</span>
                              </p>
                              <p>
                                <span className="text-gray-400">Modifier Applied:</span>{' '}
                                <span className={`font-bold ${skillCheckResult.applied_modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {skillCheckResult.applied_modifier >= 0 ? '+' : ''}{skillCheckResult.applied_modifier}
                                </span>
                                {skillCheckResult.applied_modifier === 0 && skillCheckResult.dice_roll !== skillCheckResult.total_roll && (
                                  <span className="text-yellow-400 ml-2">(Challenge failed - no bonus)</span>
                                )}
                              </p>
                              <p>
                                <span className="text-gray-400">Total:</span> <span className="font-bold">{skillCheckResult.total_roll}</span>
                                {' '}<span className="text-gray-400">vs DC</span> <span className="font-bold">{skillCheckResult.dc}</span>
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="text-gray-300 leading-relaxed">
                          {skillCheckResult ? skillCheckResult.outcome.description : currentOutcome?.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {phase === 'narrative' && availableChoices.length > 0 && (
                    <div className="space-y-3">
                      {availableChoices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoiceSelect(choice)}
                          className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-orange-500 hover:border-orange-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-left"
                        >
                          <span className="mr-2">{choice.icon || '➤'}</span>
                          {choice.choiceText}
                          {choice.requiresSkillCheck && choice.skillType && (
                            <span className="ml-3 text-xs bg-orange-500 px-2 py-1 rounded">
                              {choice.skillType.toUpperCase()} DC {choice.skillDc}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {phase === 'skill-check' && (
                    <button
                      onClick={handleStartChallenge}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                      💻 Start Coding Challenge
                    </button>
                  )}

                  {phase === 'challenge' && challenge && (
                    <div>
                      {challenge.choices && (
                        <div className="space-y-3 mb-6">
                          {challenge.choices.map((choice, index) => {
                            const letter = choice.charAt(0);
                            const isSelected = selectedAnswer === letter;
                            return (
                              <button
                                key={`${challenge.id}-${index}`}
                                onClick={() => setSelectedAnswer(letter)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'bg-orange-500 border-orange-400 text-white'
                                    : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-orange-500 hover:bg-slate-600'
                                }`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={handleChallengeSubmit}
                        disabled={!selectedAnswer}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        Submit & Resolve
                      </button>
                    </div>
                  )}

                  {phase === 'outcome' && (
                    <button
                      onClick={handleContinueFromOutcome}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Modal */}
      {phase === 'combat' && encounter?.enemy && stats && (
        <CombatModal
          userId={userId}
          enemy={encounter.enemy}
          isBoss={encounter.isBoss || false}
          playerStats={stats}
          playerAvatar={playerAvatar}
          floorNumber={floor.floorNumber}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onFlee={handleFlee}
        />
      )}
    </>
  );
}
