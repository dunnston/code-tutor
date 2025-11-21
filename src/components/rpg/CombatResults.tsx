import React from 'react';
import type { CombatRewards } from '../../lib/rpg';

interface VictoryScreenProps {
  rewards: CombatRewards;
  enemyName: string;
  isBoss: boolean;
  onContinue: () => void;
}

export function VictoryScreen({ rewards, enemyName, isBoss, onContinue }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-8 text-center animate-fadeIn">
        {/* Victory Header */}
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold text-green-400 mb-2">Victory!</h2>
          <p className="text-xl text-gray-300">
            You defeated {enemyName}!
            {isBoss && <span className="block text-orange-400 mt-2">💀 BOSS DEFEATED 💀</span>}
          </p>
        </div>

        {/* Rewards Section */}
        <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Rewards</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* XP Reward */}
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-purple-400">{rewards.xpGained}</div>
              <div className="text-sm text-gray-400">Experience</div>
            </div>

            {/* Gold Reward */}
            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-yellow-400">{rewards.goldGained}</div>
              <div className="text-sm text-gray-400">Gold</div>
            </div>
          </div>

          {/* Items Looted */}
          {rewards.itemsLooted && rewards.itemsLooted.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                Items Looted
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {rewards.itemsLooted.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-600 px-3 py-1 rounded text-sm text-orange-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
        >
          Continue Adventure
        </button>
      </div>
    </div>
  );
}

interface DefeatScreenProps {
  enemyName: string;
  onRetry?: () => void;
  onRetreat: () => void;
}

export function DefeatScreen({ enemyName, onRetry, onRetreat }: DefeatScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-8 text-center animate-fadeIn">
        {/* Defeat Header */}
        <div className="mb-6">
          <div className="text-8xl mb-4">💀</div>
          <h2 className="text-4xl font-bold text-red-400 mb-2">Defeated</h2>
          <p className="text-xl text-gray-300">You were defeated by {enemyName}...</p>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">What Happened?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your health reached zero during combat. Don't give up! Each defeat makes you stronger.
            Learn from this battle and try again.
          </p>
        </div>

        {/* Consequences */}
        <div className="bg-red-900/20 border-2 border-red-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Penalties</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• No XP or gold earned</li>
            <li>• Returned to dungeon entrance</li>
            <li>• Health and mana restored</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onRetreat}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            {onRetry ? 'Return to Town' : 'Leave Dungeon'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface LevelUpScreenProps {
  oldLevel: number;
  newLevel: number;
  statPointsGained: number;
  onContinue: () => void;
}

export function LevelUpScreen({
  oldLevel,
  newLevel,
  statPointsGained,
  onContinue,
}: LevelUpScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-8 text-center animate-fadeIn">
        {/* Level Up Header */}
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-pulse">✨</div>
          <h2 className="text-4xl font-bold text-orange-400 mb-2">Level Up!</h2>
          <p className="text-2xl text-gray-300">
            Level {oldLevel} → {newLevel}
          </p>
        </div>

        {/* New Benefits */}
        <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">New Abilities Unlocked</h3>
          <div className="space-y-3">
            <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-xl font-bold text-orange-400">{statPointsGained}</div>
              <div className="text-sm text-gray-400">Stat Points Available</div>
              <p className="text-xs text-gray-500 mt-2">
                Visit your character sheet to distribute points
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-600/50 p-3 rounded">
                <div className="text-red-400 font-semibold">+10 Max HP</div>
                <div className="text-gray-400">More survivability</div>
              </div>
              <div className="bg-slate-600/50 p-3 rounded">
                <div className="text-blue-400 font-semibold">+5 Max MP</div>
                <div className="text-gray-400">More abilities</div>
              </div>
              <div className="bg-slate-600/50 p-3 rounded">
                <div className="text-purple-400 font-semibold">+2 Damage</div>
                <div className="text-gray-400">Stronger attacks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
