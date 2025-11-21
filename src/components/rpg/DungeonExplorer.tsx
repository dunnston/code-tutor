import React, { useState, useEffect } from 'react';
import {
  getDungeonFloor,
  getUserDungeonProgress,
  getRandomEnemyForFloor,
  getBossForFloor,
  updateDungeonFloor,
  getCharacterStats,
  restoreHealthAndMana,
  getRandomEncounter,
} from '../../lib/rpg';
import type {
  DungeonFloor,
  UserDungeonProgress,
  EnemyType,
  BossEnemy,
  CharacterStats,
  DungeonEncounter,
} from '../../types/rpg';
import { CharacterStatsDisplay } from './CharacterStats';
import { CombatModal } from './CombatModal';
import type { CombatRewards } from '../../lib/rpg';

interface DungeonExplorerProps {
  userId: number;
  onClose: () => void;
}

type ExplorationPhase = 'exploring' | 'encounter' | 'combat' | 'rest' | 'boss-warning';

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
  const [phase, setPhase] = useState<ExplorationPhase>('exploring');
  const [encounter, setEncounter] = useState<EncounterState | null>(null);
  const [loading, setLoading] = useState(true);
  const [narrativeText, setNarrativeText] = useState<string>('');

  useEffect(() => {
    loadDungeonState();
  }, [userId]);

  async function loadDungeonState() {
    try {
      setLoading(true);
      const [userProgress, characterStats] = await Promise.all([
        getUserDungeonProgress(userId),
        getCharacterStats(userId),
      ]);

      const currentFloor = await getDungeonFloor(userProgress.currentFloor);

      setProgress(userProgress);
      setStats(characterStats);
      setFloor(currentFloor);
      setNarrativeText(
        `You stand at the entrance of ${currentFloor.name}. ${currentFloor.description}`
      );
    } catch (err) {
      console.error('Failed to load dungeon state:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExplore() {
    if (!floor || !stats) return;

    setPhase('exploring');
    setNarrativeText('You venture deeper into the dungeon...');

    // Wait for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Randomly determine encounter type
    const roll = Math.random();

    if (roll < 0.6) {
      // 60% chance for enemy encounter
      await handleEnemyEncounter();
    } else if (roll < 0.75) {
      // 15% chance for special encounter
      await handleSpecialEncounter();
    } else if (roll < 0.85) {
      // 10% chance for treasure
      await handleTreasureEncounter();
    } else {
      // 15% chance for rest spot
      await handleRestEncounter();
    }
  }

  async function handleEnemyEncounter() {
    if (!floor) return;

    try {
      const enemy = await getRandomEnemyForFloor(floor.floorNumber);
      setEncounter({ type: 'enemy', enemy, isBoss: false });
      setNarrativeText(
        `A ${enemy.name} blocks your path! ${enemy.description}`
      );
      setPhase('encounter');
    } catch (err) {
      console.error('Failed to generate enemy:', err);
      setNarrativeText('The passage ahead is clear.');
      setPhase('exploring');
    }
  }

  async function handleBossEncounter() {
    if (!floor) return;

    try {
      const boss = await getBossForFloor(floor.floorNumber);
      setEncounter({ type: 'boss', enemy: boss, isBoss: true });
      setNarrativeText(
        `${boss.name} emerges! ${boss.description}`
      );
      setPhase('boss-warning');
    } catch (err) {
      console.error('Failed to load boss:', err);
    }
  }

  async function handleSpecialEncounter() {
    if (!floor) return;

    try {
      const specialEncounter = await getRandomEncounter(floor.floorNumber, 'skill_check');
      setEncounter({
        type: 'trap',
        encounter: specialEncounter,
        description: specialEncounter.descriptionPrompt,
      });
      setNarrativeText(specialEncounter.descriptionPrompt);
      setPhase('encounter');
    } catch (err) {
      console.error('Failed to generate encounter:', err);
      setNarrativeText('You find nothing of interest.');
      setPhase('exploring');
    }
  }

  async function handleTreasureEncounter() {
    setEncounter({ type: 'treasure', description: 'You discover a hidden chest!' });
    setNarrativeText(
      'You discover a chest filled with gold and items! Your adventure has paid off.'
    );
    setPhase('encounter');
  }

  async function handleRestEncounter() {
    setEncounter({ type: 'rest', description: 'You find a safe place to rest.' });
    setNarrativeText(
      'You find a quiet alcove with a small fire still burning. You can rest here safely.'
    );
    setPhase('rest');
  }

  async function handleRest() {
    if (!stats) return;

    try {
      const restoredStats = await restoreHealthAndMana(userId);
      setStats(restoredStats);
      setNarrativeText('You rest and recover your strength. HP and Mana fully restored!');
      setTimeout(() => {
        setPhase('exploring');
        setEncounter(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to rest:', err);
    }
  }

  function handleStartCombat() {
    setPhase('combat');
  }

  function handleCombatVictory(rewards: CombatRewards) {
    setNarrativeText(
      `Victory! You earned ${rewards.xpGained} XP and ${rewards.goldGained} gold!`
    );
    setPhase('exploring');
    setEncounter(null);
    // Reload stats to reflect rewards
    loadDungeonState();
  }

  function handleCombatDefeat() {
    setNarrativeText('You have been defeated and must retreat...');
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  function handleFlee() {
    setNarrativeText('You flee from combat!');
    setPhase('exploring');
    setEncounter(null);
  }

  async function handleDescendFloor() {
    if (!progress || !floor) return;

    try {
      const nextFloor = floor.floorNumber + 1;
      await updateDungeonFloor(userId, nextFloor);
      setNarrativeText(`Descending to Floor ${nextFloor}...`);
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
                🗺️ {floor.name} - Floor {floor.floorNumber}
              </h2>
              <p className="text-sm text-gray-400">Difficulty: {floor.difficultyRating}/10</p>
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
                      <span className="text-gray-400">Deepest Floor:</span>
                      <span className="text-white">{progress.deepestFloorReached}</span>
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
              </div>

              {/* Right Column - Narrative & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Narrative Panel */}
                <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 min-h-[200px]">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">{narrativeText}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {phase === 'exploring' && !encounter && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleExplore}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        🔍 Explore
                      </button>
                      <button
                        onClick={handleBossEncounter}
                        disabled={floor.floorNumber > progress.deepestFloorReached}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        👹 Face Boss
                      </button>
                      <button
                        onClick={handleDescendFloor}
                        disabled={progress.deepestFloorReached < floor.floorNumber + 1}
                        className="bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        ⬇️ Descend
                      </button>
                      <button
                        onClick={onClose}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        🚪 Leave Dungeon
                      </button>
                    </div>
                  )}

                  {phase === 'encounter' && encounter?.type === 'enemy' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleStartCombat}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        ⚔️ Fight
                      </button>
                      <button
                        onClick={handleFlee}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-lg transition-colors"
                      >
                        🏃 Flee
                      </button>
                    </div>
                  )}

                  {phase === 'boss-warning' && (
                    <div className="space-y-4">
                      <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 text-center">
                        <p className="text-red-400 font-bold">⚠️ WARNING: BOSS ENCOUNTER ⚠️</p>
                        <p className="text-gray-300 text-sm mt-2">
                          Prepare yourself. This will be a difficult fight!
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={handleStartCombat}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors"
                        >
                          ⚔️ Accept Challenge
                        </button>
                        <button
                          onClick={() => {
                            setPhase('exploring');
                            setEncounter(null);
                            setNarrativeText('You decide to explore more before facing the boss.');
                          }}
                          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-lg transition-colors"
                        >
                          ← Retreat
                        </button>
                      </div>
                    </div>
                  )}

                  {phase === 'rest' && (
                    <button
                      onClick={handleRest}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                      🔥 Rest & Recover
                    </button>
                  )}

                  {phase === 'encounter' && encounter?.type === 'treasure' && (
                    <button
                      onClick={() => {
                        setPhase('exploring');
                        setEncounter(null);
                        setNarrativeText('You continue your exploration...');
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                      💰 Claim Treasure & Continue
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
          floorNumber={floor.floorNumber}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onFlee={handleFlee}
        />
      )}
    </>
  );
}
