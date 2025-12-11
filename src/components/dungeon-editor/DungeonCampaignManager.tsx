import React, { useState, useEffect } from 'react';
import { invoke } from '@/lib/tauri';
import { LevelPlayerEnhanced } from './LevelPlayerEnhanced';
import {
  getCampaignProgress,
  getNextLevel,
  loadLevel,
  completeLevel,
  getPublishedLevels,
} from '../../lib/dungeonLevelProgression';
import type { DungeonLevel } from '../../types/dungeonEditor';
import { getCharacterStats } from '../../lib/rpg';
import type { CharacterStats } from '../../types/rpg';

/**
 * Dungeon Campaign Manager - Orchestrates the dungeon level progression
 *
 * This component manages the flow through the sequence of dungeon levels:
 * 1. Loads levels in the order specified by the Level Sequencer
 * 2. Shows the LevelPlayerEnhanced for interactive gameplay
 * 3. Handles level completion and rewards
 * 4. Updates progression tracking
 * 5. Loads the next level or returns to town
 */

interface DungeonCampaignManagerProps {
  userId: number;
  onReturnToTown: () => void;
}

type ViewState = 'loading' | 'playing' | 'victory' | 'no-levels' | 'all-complete';

export const DungeonCampaignManager: React.FC<DungeonCampaignManagerProps> = ({
  userId,
  onReturnToTown,
}) => {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [currentLevel, setCurrentLevel] = useState<DungeonLevel | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completionRewards, setCompletionRewards] = useState<any>(null);

  useEffect(() => {
    loadCurrentLevel();
  }, [userId]);

  async function loadCurrentLevel() {
    try {
      setViewState('loading');

      // Get next level based on sequence and progression
      const nextLevelId = await getNextLevel(userId);

      if (!nextLevelId) {
        // Check if there are any levels in the sequence
        const sequencedLevels = await getPublishedLevels();
        if (sequencedLevels.length === 0) {
          setViewState('no-levels');
        } else {
          setViewState('all-complete');
        }
        return;
      }

      // Load the level
      const level = await loadLevel(nextLevelId);
      if (!level) {
        console.error('Failed to load level:', nextLevelId);
        setViewState('no-levels');
        return;
      }

      // Load character stats
      const characterStats = await getCharacterStats(userId);

      setCurrentLevel(level);
      setCurrentLevelId(nextLevelId);
      setStats(characterStats);
      setStartTime(Date.now());
      setViewState('playing');
    } catch (error) {
      console.error('Failed to load dungeon level:', error);
      setViewState('no-levels');
    }
  }

  async function handleLevelComplete(rewards: {
    xp: number;
    gold: number;
    inventory: any[];
  }) {
    if (!currentLevelId) return;

    try {
      // Calculate time taken
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      // Mark level as completed
      await completeLevel(userId, currentLevelId, timeTaken);

      // Award rewards
      if (rewards.xp > 0) {
        await invoke('dev_add_xp', { userId, xp: rewards.xp });
      }
      if (rewards.gold > 0) {
        await invoke('dev_add_gold', { userId, amount: rewards.gold });
      }

      // TODO: Award items to inventory (needs item system integration)

      // Reload character stats
      const updatedStats = await getCharacterStats(userId);
      setStats(updatedStats);

      // Store rewards for victory screen
      setCompletionRewards(rewards);
      setViewState('victory');
    } catch (error) {
      console.error('Failed to complete level:', error);
    }
  }

  async function handleContinueToNextLevel() {
    // Load the next level in sequence
    await loadCurrentLevel();
  }

  function handleExitDungeon() {
    onReturnToTown();
  }

  // Loading state
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="text-xl font-bold mb-2">Loading Dungeon...</div>
          <div className="text-gray-400">Preparing your adventure</div>
        </div>
      </div>
    );
  }

  // No levels available
  if (viewState === 'no-levels') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🏗️</div>
          <h2 className="text-2xl font-bold mb-4 text-orange-400">
            No Dungeon Levels Available
          </h2>
          <p className="text-gray-400 mb-6">
            There are no levels in the campaign sequence yet. Use the Level Sequencer in the
            Dungeon Editor to add levels to the campaign!
          </p>
          <button
            onClick={handleExitDungeon}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Return to Town
          </button>
        </div>
      </div>
    );
  }

  // All levels completed
  if (viewState === 'all-complete') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            Congratulations, Champion!
          </h2>
          <p className="text-gray-400 mb-6">
            You've completed all levels in the campaign sequence! You are a true hero. More
            challenges await in future updates!
          </p>
          <button
            onClick={handleExitDungeon}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Return to Town
          </button>
        </div>
      </div>
    );
  }

  // Victory screen
  if (viewState === 'victory') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-yellow-900/30 to-slate-800 border-2 border-yellow-500 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Level Complete!</h2>
              <p className="text-gray-400">{currentLevel?.metadata.name}</p>
            </div>

            {completionRewards && (
              <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center">Rewards Earned</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-400">
                      {completionRewards.xp}
                    </div>
                    <div className="text-sm text-gray-400">Experience Points</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">
                      {completionRewards.gold}
                    </div>
                    <div className="text-sm text-gray-400">Gold</div>
                  </div>
                </div>

                {completionRewards.inventory.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Items Found:</div>
                    <div className="space-y-1">
                      {completionRewards.inventory.map((item: any, index: number) => (
                        <div key={index} className="text-sm text-gray-300">
                          • {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {stats && (
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <div className="text-center text-sm text-gray-400 mb-2">Your Progress</div>
                <div className="flex justify-center gap-6">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{stats.level}</div>
                    <div className="text-xs text-gray-500">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.currentGold}</div>
                    <div className="text-xs text-gray-500">Total Gold</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleContinueToNextLevel}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Continue to Next Level
              </button>
              <button
                onClick={handleExitDungeon}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Return to Town
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing state - show level player
  return (
    <LevelPlayerEnhanced
      level={currentLevel}
      userId={userId}
      onComplete={handleLevelComplete}
      onExit={handleExitDungeon}
      skipTownPhase={true} // Skip the town preparation screen when coming from Town Hub
    />
  );
};
