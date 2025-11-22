import React, { useState, useEffect } from 'react';
import { getTownState, setTownState, getCharacterStats, restoreHealthAndMana, updateDungeonFloor } from '../../lib/rpg';
import { ShopWidget } from './ShopWidget';
import { DungeonExplorer } from './DungeonExplorer';
import { CharacterSheet } from './CharacterSheet';
import type { CharacterStats } from '../../types/rpg';

interface TownHubProps {
  userId: number;
  onClose: () => void;
}

type ViewMode = 'town' | 'shop' | 'character' | 'dungeon';

export function TownHub({ userId, onClose }: TownHubProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('town');
  const [inTown, setInTown] = useState(true);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReturnWarning, setShowReturnWarning] = useState(false);

  useEffect(() => {
    loadTownState();
  }, [userId]);

  async function loadTownState() {
    try {
      setLoading(true);
      const [townState, characterStats] = await Promise.all([
        getTownState(userId),
        getCharacterStats(userId),
      ]);
      setInTown(townState);
      setStats(characterStats);

      // If player is in dungeon, show dungeon immediately
      if (!townState) {
        setViewMode('dungeon');
      }
    } catch (err) {
      console.error('Failed to load town state:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnterDungeon() {
    try {
      await setTownState(userId, false);
      setInTown(false);
      setViewMode('dungeon');
    } catch (err) {
      console.error('Failed to enter dungeon:', err);
    }
  }

  async function handleReturnToTown() {
    try {
      // Reset dungeon progress to floor 1
      await updateDungeonFloor(userId, 1);
      await setTownState(userId, true);
      setInTown(true);
      setViewMode('town');
      setShowReturnWarning(false);
      await loadTownState(); // Refresh stats
    } catch (err) {
      console.error('Failed to return to town:', err);
    }
  }

  function handleReturnToTownClick() {
    setShowReturnWarning(true);
  }

  function handleCancelReturn() {
    setShowReturnWarning(false);
  }

  function handleShopPurchase() {
    // Refresh stats after purchase
    loadTownState();
  }

  async function handleRestAtInn() {
    try {
      await restoreHealthAndMana(userId);
      await loadTownState();
      // Visual feedback - we could add a toast notification system later
      console.log('Rested at inn - health and mana restored!');
    } catch (err) {
      console.error('Failed to rest:', err);
    }
  }

  // If in dungeon, show dungeon explorer with return button
  if (viewMode === 'dungeon') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
        {/* Return to Town Button - Fixed at top */}
        <div className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-700 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleReturnToTownClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span>🏰</span>
              <span className="font-medium">Return to Town</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl px-4"
            >
              ×
            </button>
          </div>
        </div>

        <DungeonExplorer
          userId={userId}
          onClose={handleReturnToTownClick}
        />

        {/* Return to Town Warning Modal */}
        {showReturnWarning && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
            <div className="bg-slate-800 rounded-lg border-2 border-orange-500 max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">⚠️ Return to Town?</h3>
              <p className="text-gray-300 mb-6">
                Returning to town will reset your dungeon progress back to <strong className="text-red-400">Floor 1</strong>.
                You will keep all gold, items, and experience you've earned, but you'll have to start over from the beginning.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReturnToTown}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Yes, Return to Town
                </button>
                <button
                  onClick={handleCancelReturn}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show character sheet in modal - CharacterSheet has its own modal wrapper
  if (viewMode === 'character') {
    return (
      <CharacterSheet userId={userId} isOpen={true} onClose={() => setViewMode('town')} />
    );
  }

  // Show shop in modal
  if (viewMode === 'shop') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
        <div className="min-h-screen p-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setViewMode('town')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>Back to Town</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl px-4"
              >
                ×
              </button>
            </div>
            <ShopWidget userId={userId} onPurchase={handleShopPurchase} />
          </div>
        </div>
      </div>
    );
  }

  // Town view - Main hub
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading town...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-orange-400 mb-2">🏰 Town</h1>
              <p className="text-gray-400">A safe haven for adventurers</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl px-4"
            >
              ×
            </button>
          </div>

          {/* Player Stats Bar */}
          {stats && (
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Level</div>
                  <div className="text-2xl font-bold text-orange-400">{stats.level}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Health</div>
                  <div className="text-2xl font-bold text-red-400">
                    {stats.currentHealth}/{stats.maxHealth}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Mana</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.currentMana}/{stats.maxMana}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Gold</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {stats.currentGold} 🪙
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Stat Points</div>
                  <div className="text-2xl font-bold text-green-400">
                    {stats.statPointsAvailable}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Town Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enter Dungeon */}
            <button
              onClick={handleEnterDungeon}
              className="bg-gradient-to-br from-red-900 to-slate-800 hover:from-red-800 hover:to-slate-700 p-8 rounded-lg border-2 border-red-700 hover:border-red-500 transition-all text-left group"
            >
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2 group-hover:text-red-300">
                Enter Dungeon
              </h2>
              <p className="text-gray-400">
                Face dangerous enemies and powerful bosses. Earn gold, equipment, and experience.
              </p>
            </button>

            {/* Visit Shop */}
            <button
              onClick={() => setViewMode('shop')}
              className="bg-gradient-to-br from-orange-900 to-slate-800 hover:from-orange-800 hover:to-slate-700 p-8 rounded-lg border-2 border-orange-700 hover:border-orange-500 transition-all text-left group"
            >
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-2xl font-bold text-orange-400 mb-2 group-hover:text-orange-300">
                Visit Shop
              </h2>
              <p className="text-gray-400">
                Buy weapons, armor, and potions. Sell unwanted equipment for gold.
              </p>
            </button>

            {/* Character Sheet */}
            <button
              onClick={() => setViewMode('character')}
              className="bg-gradient-to-br from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 p-8 rounded-lg border-2 border-blue-700 hover:border-blue-500 transition-all text-left group"
            >
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-blue-400 mb-2 group-hover:text-blue-300">
                Character Sheet
              </h2>
              <p className="text-gray-400">
                View your stats, equipment, abilities, and spend stat points.
              </p>
            </button>

            {/* Rest (Heal) */}
            <button
              onClick={handleRestAtInn}
              className="bg-gradient-to-br from-green-900 to-slate-800 hover:from-green-800 hover:to-slate-700 p-8 rounded-lg border-2 border-green-700 hover:border-green-500 transition-all text-left group"
            >
              <div className="text-6xl mb-4">🛏️</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2 group-hover:text-green-300">
                Rest at Inn
              </h2>
              <p className="text-gray-400">
                Fully restore your health and mana. Prepare for your next adventure.
              </p>
              <div className="mt-3 text-xs text-green-300 bg-green-900/30 px-3 py-1 rounded inline-block">
                Free
              </div>
            </button>
          </div>

          {/* Town Flavor Text */}
          <div className="mt-8 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-gray-300 italic text-center">
              "Welcome to the town, adventurer. Rest your weary bones, stock up on supplies,
              and prepare for the dangers that await in the depths below..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
