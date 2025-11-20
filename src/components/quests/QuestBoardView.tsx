import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getQuestProgressWithPercentage, initializeQuestProgress } from '@/lib/gamification';
import type { QuestType, UserQuestProgress } from '@/types/gamification';
import { QuestCard } from './QuestCard';

type QuestProgressWithPercentage = UserQuestProgress & { progressPercentage: number };

export function QuestBoardView() {
  const { dailyQuests, weeklyQuests, refreshQuests, userCurrency, refreshCurrency, setCurrentView, currentUserId } = useAppStore();
  const [activeTab, setActiveTab] = useState<QuestType>('daily');
  const [quests, setQuests] = useState<QuestProgressWithPercentage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load currency
  useEffect(() => {
    if (!userCurrency && currentUserId) {
      refreshCurrency(currentUserId);
    }
  }, [userCurrency, refreshCurrency, currentUserId]);

  // Load quests
  useEffect(() => {
    if (currentUserId) {
      loadQuests();
    }
  }, [currentUserId]);

  // Update displayed quests when tab changes or quests are refreshed
  useEffect(() => {
    if (currentUserId) {
      loadQuestProgress();
    }
  }, [activeTab, dailyQuests, weeklyQuests, currentUserId]);

  const loadQuests = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setError(null);

      // Initialize quest progress for the user
      await initializeQuestProgress(currentUserId, 'daily');
      await initializeQuestProgress(currentUserId, 'weekly');

      // Refresh quest data
      await refreshQuests(currentUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestProgress = async () => {
    if (!currentUserId) return;

    try {
      const progress = await getQuestProgressWithPercentage(currentUserId, activeTab);
      setQuests(progress);
    } catch (err) {
      console.error('Failed to load quest progress:', err);
    }
  };

  const completedCount = quests.filter((q) => q.completed).length;
  const totalQuests = quests.length;

  return (
    <div className="flex flex-col h-screen bg-[#0f1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-[#1a1d29] border-b border-[#2a2f42]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#252837] rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white">📋 Quest Board</h1>
          <span className="px-3 py-1 bg-[#252837] text-gray-300 rounded-lg text-sm">
            {completedCount}/{totalQuests} completed
          </span>
        </div>

        {/* Currency Display */}
        {userCurrency && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252837] rounded-lg">
              <span className="text-2xl">🪙</span>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Gold</span>
                <span className="text-lg font-bold text-yellow-500">{userCurrency.gold.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252837] rounded-lg">
              <span className="text-2xl">💎</span>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Gems</span>
                <span className="text-lg font-bold text-blue-400">{userCurrency.gems.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-8 py-4 bg-[#1a1d29] border-b border-[#2a2f42]">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
            activeTab === 'daily'
              ? 'bg-[#fb923c] text-white'
              : 'bg-[#252837] text-gray-300 hover:bg-[#2a2f42] hover:text-white'
          }`}
        >
          <span>☀️</span>
          <span>Daily Quests</span>
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
            activeTab === 'weekly'
              ? 'bg-[#fb923c] text-white'
              : 'bg-[#252837] text-gray-300 hover:bg-[#2a2f42] hover:text-white'
          }`}
        >
          <span>📅</span>
          <span>Weekly Quests</span>
        </button>
      </div>

      {/* Quest List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c]"></div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={loadQuests}
              className="px-6 py-2 bg-[#fb923c] hover:bg-[#f59e0b] text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && quests.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">No quests available</p>
          </div>
        )}

        {!loading && !error && quests.length > 0 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {quests.map((quest) => (
              <QuestCard key={quest.id} questProgress={quest} />
            ))}
          </div>
        )}

        {/* Reset Info */}
        {!loading && !error && quests.length > 0 && (
          <div className="mt-8 p-4 bg-[#1a1d29] border border-[#2a2f42] rounded-lg max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 text-center">
              {activeTab === 'daily' ? (
                <>
                  ⏰ Daily quests reset at midnight. Complete them before they're gone!
                </>
              ) : (
                <>
                  📆 Weekly quests reset every Monday. You have all week to complete them!
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
