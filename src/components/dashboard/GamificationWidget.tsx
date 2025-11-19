import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function GamificationWidget() {
  const { setCurrentView, userCurrency, refreshCurrency } = useAppStore();

  // Load currency on mount
  useEffect(() => {
    if (!userCurrency) {
      refreshCurrency(1); // TODO: Use actual user ID
    }
  }, [userCurrency, refreshCurrency]);

  return (
    <div className="bg-gradient-to-br from-[#1a1d29] to-[#252837] rounded-lg p-6 border border-[#2a2f42] shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💰</span>
          <span>Rewards & Shop</span>
        </h2>

        {/* Currency Display */}
        {userCurrency && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0f1117] rounded-lg">
              <span className="text-xl">🪙</span>
              <span className="text-sm font-bold text-yellow-500">
                {userCurrency.gold.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0f1117] rounded-lg">
              <span className="text-xl">💎</span>
              <span className="text-sm font-bold text-blue-400">
                {userCurrency.gems.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-400 mb-6">
        Earn gold and gems by completing lessons and puzzles. Use them to buy helpful items, cosmetics, and power-ups!
      </p>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shop */}
        <button
          onClick={() => setCurrentView('shop')}
          className="group bg-[#1a1d29] hover:bg-[#252837] border-2 border-[#2a2f42] hover:border-[#fb923c] rounded-lg p-6 transition-all text-left"
        >
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#fb923c] transition-colors">
            Item Shop
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Browse and purchase helpful items, boosts, and cosmetics
          </p>
          <div className="flex items-center gap-2 text-[#fb923c] font-bold text-sm">
            <span>Visit Shop</span>
            <span>→</span>
          </div>
        </button>

        {/* Inventory */}
        <button
          onClick={() => setCurrentView('inventory')}
          className="group bg-[#1a1d29] hover:bg-[#252837] border-2 border-[#2a2f42] hover:border-[#fb923c] rounded-lg p-6 transition-all text-left"
        >
          <div className="text-4xl mb-3">🎒</div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#fb923c] transition-colors">
            Inventory
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            View and use your collected items and power-ups
          </p>
          <div className="flex items-center gap-2 text-[#fb923c] font-bold text-sm">
            <span>Open Inventory</span>
            <span>→</span>
          </div>
        </button>

        {/* Quests */}
        <button
          onClick={() => setCurrentView('quests')}
          className="group bg-[#1a1d29] hover:bg-[#252837] border-2 border-[#2a2f42] hover:border-[#fb923c] rounded-lg p-6 transition-all text-left"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#fb923c] transition-colors">
            Quest Board
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Complete daily and weekly quests for bonus rewards
          </p>
          <div className="flex items-center gap-2 text-[#fb923c] font-bold text-sm">
            <span>View Quests</span>
            <span>→</span>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      {userCurrency && (
        <div className="mt-6 pt-6 border-t border-[#2a2f42]">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {userCurrency.lifetimeGoldEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total Gold Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {userCurrency.lifetimeGemsEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total Gems Earned</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
