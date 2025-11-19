import React from 'react';
import type { UserQuestProgress } from '@/types/gamification';

interface QuestCardProps {
  questProgress: UserQuestProgress & { progressPercentage: number };
}

export function QuestCard({ questProgress }: QuestCardProps) {
  const { quest, progress, completed, progressPercentage } = questProgress;

  return (
    <div
      className={`bg-[#1a1d29] border-2 rounded-lg p-6 transition-all ${
        completed
          ? 'border-green-600 opacity-75'
          : 'border-[#2a2f42] hover:border-[#fb923c]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">{quest.icon || '📋'}</div>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {quest.title}
              {completed && <span className="text-green-400">✓</span>}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                completed
                  ? 'bg-green-900 bg-opacity-50 text-green-400'
                  : 'bg-[#252837] text-gray-300'
              }`}
            >
              {completed ? 'Completed' : 'In Progress'}
            </span>
          </div>

          {/* Description */}
          {quest.description && (
            <p className="text-gray-400 mb-4">{quest.description}</p>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-bold text-white">
                {progress} / {quest.objectiveTarget}
              </span>
            </div>
            <div className="h-3 bg-[#252837] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  completed ? 'bg-green-500' : 'bg-[#fb923c]'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              {/* XP Reward */}
              {quest.rewardXp > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="text-xs text-gray-400">XP</div>
                    <div className="text-sm font-bold text-purple-400">
                      +{quest.rewardXp.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Gold Reward */}
              {quest.rewardGold > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <div>
                    <div className="text-xs text-gray-400">Gold</div>
                    <div className="text-sm font-bold text-yellow-500">
                      +{quest.rewardGold.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Gems Reward */}
              {quest.rewardGems > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <div>
                    <div className="text-xs text-gray-400">Gems</div>
                    <div className="text-sm font-bold text-blue-400">
                      +{quest.rewardGems.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Item Reward */}
              {quest.rewardItemId && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <div>
                    <div className="text-xs text-gray-400">Bonus</div>
                    <div className="text-sm font-bold text-green-400">Item</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Completion Message */}
          {completed && questProgress.completedAt && (
            <div className="mt-3 pt-3 border-t border-[#2a2f42]">
              <p className="text-xs text-gray-500">
                ✨ Completed on {new Date(questProgress.completedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
