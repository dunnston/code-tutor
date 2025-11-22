import React from 'react';
import type { CharacterStats } from '../../types/rpg';

interface CharacterStatsProps {
  stats: CharacterStats;
  compact?: boolean;
}

export function CharacterStatsDisplay({ stats, compact = false }: CharacterStatsProps) {
  const healthPercent = (stats.currentHealth / stats.maxHealth) * 100;
  const manaPercent = (stats.currentMana / stats.maxMana) * 100;

  if (compact) {
    return (
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300">HP</span>
            <span className="text-gray-300 font-mono">
              {stats.currentHealth}/{stats.maxHealth}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300">MP</span>
            <span className="text-gray-300 font-mono">
              {stats.currentMana}/{stats.maxMana}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-4">
      {/* Level */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <h3 className="text-lg font-bold text-orange-400">Level {stats.level}</h3>
        {stats.statPointsAvailable > 0 && (
          <span className="text-sm bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
            {stats.statPointsAvailable} points available
          </span>
        )}
      </div>

      {/* Health and Mana */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-red-400 font-semibold">❤️ Health</span>
            <span className="text-gray-300 font-mono">
              {stats.currentHealth}/{stats.maxHealth}
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-blue-400 font-semibold">💙 Mana</span>
            <span className="text-gray-300 font-mono">
              {stats.currentMana}/{stats.maxMana}
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
          Primary Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded p-2 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.strength}</div>
            <div className="text-xs text-gray-400">💪 STR</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.intelligence}</div>
            <div className="text-xs text-gray-400">🧠 INT</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.dexterity}</div>
            <div className="text-xs text-gray-400">⚡ DEX</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2 text-center">
            <div className="text-2xl font-bold text-pink-400">{stats.charisma}</div>
            <div className="text-xs text-gray-400">✨ CHA</div>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
          Combat Stats
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">⚔️ Damage:</span>
            <span className="text-gray-200 font-mono">{stats.baseDamage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">🛡️ Defense:</span>
            <span className="text-gray-200 font-mono">{stats.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">💥 Critical:</span>
            <span className="text-gray-200 font-mono">
              {(stats.criticalChance * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">🌀 Dodge:</span>
            <span className="text-gray-200 font-mono">
              {(stats.dodgeChance * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
