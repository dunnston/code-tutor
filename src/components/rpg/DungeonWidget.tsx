import React, { useEffect, useState } from 'react';
import { getCharacterStats, getUserDungeonProgress } from '../../lib/rpg';
import type { CharacterStats, UserDungeonProgress } from '../../types/rpg';

interface DungeonWidgetProps {
  userId: number;
  onEnterDungeon: () => void;
}

export function DungeonWidget({ userId, onEnterDungeon }: DungeonWidgetProps) {
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [progress, setProgress] = useState<UserDungeonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDungeonData();
  }, [userId]);

  async function loadDungeonData() {
    try {
      setLoading(true);
      const [characterStats, dungeonProgress] = await Promise.all([
        getCharacterStats(userId),
        getUserDungeonProgress(userId),
      ]);
      setStats(characterStats);
      setProgress(dungeonProgress);
    } catch (err) {
      console.error('Failed to load dungeon data:', err);
      setError('Failed to load dungeon data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-32 mb-4" />
        <div className="h-20 bg-slate-700 rounded" />
      </div>
    );
  }

  if (error || !stats || !progress) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-400 mb-2">⚔️ Dungeon Crawler</h3>
        <p className="text-gray-400 text-sm">{error || 'Unable to load dungeon'}</p>
      </div>
    );
  }

  const healthPercent = (stats.currentHealth / stats.maxHealth) * 100;
  const inCombat = progress.inCombat;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-orange-500/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-400">⚔️ Dungeon Crawler</h3>
        {inCombat && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse">
            IN COMBAT
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {/* Character Quick Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Level {stats.level}</span>
          <span className="text-gray-400">
            Floor {progress.currentFloor}
          </span>
        </div>

        {/* Health Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">HP</span>
            <span className="text-gray-300 font-mono">
              {stats.currentHealth}/{stats.maxHealth}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-700/50 rounded p-2">
            <div className="text-orange-400 font-bold">{progress.totalEnemiesDefeated}</div>
            <div className="text-gray-500">Enemies</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <div className="text-purple-400 font-bold">{progress.totalBossesDefeated}</div>
            <div className="text-gray-500">Bosses</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <div className="text-green-400 font-bold">{progress.deepestFloorReached}</div>
            <div className="text-gray-500">Deepest</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onEnterDungeon}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {inCombat ? (
          <>
            <span>⚔️</span>
            <span>Continue Battle</span>
          </>
        ) : (
          <>
            <span>🗡️</span>
            <span>Enter Dungeon</span>
          </>
        )}
      </button>

      {/* Quick Stats Footer */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-gray-500">
        <span>💰 {progress.totalGoldEarned.toLocaleString()} earned</span>
        <span>💀 {progress.totalDeaths} deaths</span>
      </div>
    </div>
  );
}
