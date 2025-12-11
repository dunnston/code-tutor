import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getCharacterStats, distributeStatPoints, restoreHealthAndMana } from '@/lib/rpg';
import { invoke } from '@tauri-apps/api/core';
import type { CharacterStats } from '@/types/rpg';
import { xpForNextLevel, loadProgress, saveProgress } from '@/lib/storage';

// Simple icon components
const XIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CoinsIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" /></svg>;
const ZapIcon = () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TrendingUpIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const PackageIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const ChevronDownIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ChevronUpIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;

interface DevPanelProps {
  onClose: () => void;
}

type TabType = 'currency' | 'level' | 'stats' | 'loot';

export function DevPanel({ onClose }: DevPanelProps) {
  const currentUserId = useAppStore((state) => state.currentUserId);
  const refreshCurrency = useAppStore((state) => state.refreshCurrency);
  const refreshProgress = useAppStore((state) => state.refreshProgress);
  const progress = useAppStore((state) => state.progress);
  const [activeTab, setActiveTab] = useState<TabType>('currency');
  const [characterStats, setCharacterStats] = useState<CharacterStats | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Currency controls
  const [mainGoldAmount, setMainGoldAmount] = useState(100);
  const [gemsAmount, setGemsAmount] = useState(10);
  const [dungeonGoldAmount, setDungeonGoldAmount] = useState(100);
  const [skillPointsAmount, setSkillPointsAmount] = useState(5);

  // Level controls
  const [levelAmount, setLevelAmount] = useState(1);
  const [xpAmount, setXpAmount] = useState(100);

  // Stat controls
  const [strAmount, setStrAmount] = useState(1);
  const [intAmount, setIntAmount] = useState(1);
  const [dexAmount, setDexAmount] = useState(1);
  const [chaAmount, setChaAmount] = useState(1);

  // Loot controls
  const [selectedItemTier, setSelectedItemTier] = useState<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('common');
  const [lootQuantity, setLootQuantity] = useState(1);

  useEffect(() => {
    loadCharacterStats();
  }, [currentUserId]);

  const loadCharacterStats = async () => {
    if (!currentUserId) return;
    try {
      const stats = await getCharacterStats(currentUserId);
      setCharacterStats(stats);
    } catch (error) {
      console.error('Failed to load character stats:', error);
    }
  };

  const handleAddMainGold = async () => {
    if (!currentUserId) return;
    try {
      // Add gold to main gamification system only
      const { addCurrency } = await import('@/lib/gamification');
      await addCurrency(currentUserId, 'gold', mainGoldAmount, 'dev_panel', null);
      await refreshCurrency();
    } catch (error) {
      console.error('Failed to add main gold:', error);
    }
  };

  const handleAddDungeonGold = async () => {
    if (!currentUserId) return;
    try {
      await invoke('dev_add_gold', { userId: currentUserId, amount: dungeonGoldAmount });
      await loadCharacterStats();
    } catch (error) {
      console.error('Failed to add dungeon gold:', error);
    }
  };

  const handleAddGems = async () => {
    if (!currentUserId) return;
    try {
      await invoke('dev_add_gems', { userId: currentUserId, amount: gemsAmount });
      await refreshCurrency();
    } catch (error) {
      console.error('Failed to add gems:', error);
    }
  };

  const handleAddSkillPoints = async () => {
    if (!currentUserId) return;
    try {
      await invoke('dev_add_skill_points', { userId: currentUserId, amount: skillPointsAmount });
      await loadCharacterStats();
    } catch (error) {
      console.error('Failed to add skill points:', error);
    }
  };

  const handleLevelUp = async () => {
    if (!currentUserId) return;
    try {
      console.log('Calling dev_add_levels with:', { userId: currentUserId, levels: levelAmount });
      await invoke('dev_add_levels', { userId: currentUserId, levels: levelAmount });
      console.log('Successfully added levels');

      // Also update the main app progress (localStorage)
      const currentProgress = loadProgress();
      const newLevel = currentProgress.level + levelAmount;
      const newXP = xpForNextLevel(newLevel - 1); // Set XP to start of new level

      currentProgress.level = newLevel;
      currentProgress.xpEarned = newXP;
      saveProgress(currentProgress);

      await loadCharacterStats();
      await refreshCurrency();
      await refreshProgress();
    } catch (error) {
      console.error('Failed to level up:', error);
      alert(`Failed to level up: ${error}`);
    }
  };

  const handleAddXP = async () => {
    if (!currentUserId) return;
    try {
      console.log('Calling dev_add_xp with:', { userId: currentUserId, xp: xpAmount });

      // Update the main app progress (localStorage) with XP
      const currentProgress = loadProgress();
      currentProgress.xpEarned = (currentProgress.xpEarned || 0) + xpAmount;
      saveProgress(currentProgress);

      await invoke('dev_add_xp', { userId: currentUserId, xp: xpAmount });
      console.log('Successfully added XP');
      await loadCharacterStats();
      await refreshProgress();
    } catch (error) {
      console.error('Failed to add XP:', error);
      alert(`Failed to add XP: ${error}`);
    }
  };

  const handleAddStats = async () => {
    if (!currentUserId) return;
    try {
      await distributeStatPoints(currentUserId, strAmount, intAmount, dexAmount);
      // Handle charisma separately if needed
      if (chaAmount > 0) {
        await invoke('dev_add_charisma', { userId: currentUserId, amount: chaAmount });
      }
      await loadCharacterStats();
    } catch (error) {
      console.error('Failed to add stats:', error);
    }
  };

  const handleFullRestore = async () => {
    if (!currentUserId) return;
    try {
      await restoreHealthAndMana(currentUserId);
      await loadCharacterStats();
    } catch (error) {
      console.error('Failed to restore health/mana:', error);
    }
  };

  const handleGenerateLoot = async () => {
    if (!currentUserId) return;
    try {
      await invoke('dev_generate_loot', {
        userId: currentUserId,
        tier: selectedItemTier,
        quantity: lootQuantity
      });
      await loadCharacterStats();
    } catch (error) {
      console.error('Failed to generate loot:', error);
    }
  };

  const handleResetCharacter = async () => {
    if (!currentUserId) return;
    if (!confirm('Are you sure you want to reset your character? This will reset level, stats, and gold to defaults.')) {
      return;
    }
    try {
      await invoke('dev_reset_character', { userId: currentUserId });
      await loadCharacterStats();
      await refreshCurrency();
    } catch (error) {
      console.error('Failed to reset character:', error);
    }
  };

  const handleClearInventory = async () => {
    if (!currentUserId) return;
    if (!confirm('Are you sure you want to clear your inventory? All items and equipment will be removed.')) {
      return;
    }
    try {
      await invoke('dev_clear_inventory', { userId: currentUserId });
      await loadCharacterStats();
      alert('Inventory cleared!');
    } catch (error) {
      console.error('Failed to clear inventory:', error);
      alert(`Failed to clear inventory: ${error}`);
    }
  };

  const handleExportCleanDatabase = async () => {
    try {
      const result = await invoke<string>('dev_export_clean_database');
      alert(result);
    } catch (error) {
      console.error('Failed to export database:', error);
      alert(`Failed to export database: ${error}`);
    }
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 border-2 border-accent-500 rounded-lg shadow-2xl max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-t-lg border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-accent-500"><ZapIcon /></span>
          <h3 className="text-lg font-bold text-accent-500">Dev Tools</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-700 rounded transition-colors text-gray-400"
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors text-gray-400"
          >
            <XIcon />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Character Stats Summary */}
          {characterStats && (
            <div className="p-3 bg-slate-900/50 border-b border-slate-700 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>Level: <span className="text-accent-500 font-bold">{characterStats.level}</span></div>
                <div>Gold: <span className="text-yellow-500 font-bold">{characterStats.currentGold}</span></div>
                <div>HP: <span className="text-green-500 font-bold">{characterStats.currentHealth}/{characterStats.maxHealth}</span></div>
                <div>Mana: <span className="text-blue-500 font-bold">{characterStats.currentMana}/{characterStats.maxMana}</span></div>
                <div>Stat Points: <span className="text-purple-500 font-bold">{characterStats.statPointsAvailable}</span></div>
                <div className="col-span-2 text-gray-400">
                  STR:{characterStats.strength} INT:{characterStats.intelligence} DEX:{characterStats.dexterity} CHA:{characterStats.charisma}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-900/30">
            <button
              onClick={() => setActiveTab('currency')}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'currency'
                  ? 'bg-slate-800 text-accent-500 border-b-2 border-accent-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="inline-block mr-1"><CoinsIcon /></span>
              Currency
            </button>
            <button
              onClick={() => setActiveTab('level')}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'level'
                  ? 'bg-slate-800 text-accent-500 border-b-2 border-accent-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="inline-block mr-1"><TrendingUpIcon /></span>
              Level
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-slate-800 text-accent-500 border-b-2 border-accent-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="inline-block mr-1"><ZapIcon /></span>
              Stats
            </button>
            <button
              onClick={() => setActiveTab('loot')}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'loot'
                  ? 'bg-slate-800 text-accent-500 border-b-2 border-accent-500'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="inline-block mr-1"><PackageIcon /></span>
              Loot
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {/* Currency Tab */}
            {activeTab === 'currency' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-400 pb-2 border-b border-slate-700">
                  Main App Currency
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add Gold (Main)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={mainGoldAmount}
                      onChange={(e) => setMainGoldAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleAddMainGold}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For shop & main app features</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add Gems (Main)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={gemsAmount}
                      onChange={(e) => setGemsAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleAddGems}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Premium currency for main app</p>
                </div>

                <div className="text-xs text-gray-400 pb-2 border-b border-slate-700 mt-4">
                  RPG Dungeon Currency
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add Dungeon Gold</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={dungeonGoldAmount}
                      onChange={(e) => setDungeonGoldAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleAddDungeonGold}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For RPG shop & dungeon features</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add Skill Points</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={skillPointsAmount}
                      onChange={(e) => setSkillPointsAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleAddSkillPoints}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For character stat distribution</p>
                </div>
              </div>
            )}

            {/* Level Tab */}
            {activeTab === 'level' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add Levels</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={levelAmount}
                      onChange={(e) => setLevelAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleLevelUp}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Level Up
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Awards stat points per level</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Add XP</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={xpAmount}
                      onChange={(e) => setXpAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                      min="1"
                    />
                    <button
                      onClick={handleAddXP}
                      className="px-4 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">May trigger level ups automatically</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleFullRestore}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Full HP/Mana Restore
                  </button>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Strength</label>
                  <input
                    type="number"
                    value={strAmount}
                    onChange={(e) => setStrAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Intelligence</label>
                  <input
                    type="number"
                    value={intAmount}
                    onChange={(e) => setIntAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Dexterity</label>
                  <input
                    type="number"
                    value={dexAmount}
                    onChange={(e) => setDexAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Charisma</label>
                  <input
                    type="number"
                    value={chaAmount}
                    onChange={(e) => setChaAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                    min="1"
                  />
                </div>

                <button
                  onClick={handleAddStats}
                  className="w-full px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                >
                  Add Stats
                </button>
                <p className="text-xs text-gray-500">Adds specified amounts to each stat</p>
              </div>
            )}

            {/* Loot Tab */}
            {activeTab === 'loot' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Item Tier</label>
                  <select
                    value={selectedItemTier}
                    onChange={(e) => setSelectedItemTier(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={lootQuantity}
                    onChange={(e) => setLootQuantity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                    min="1"
                    max="10"
                  />
                </div>

                <button
                  onClick={handleGenerateLoot}
                  className="w-full px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded text-sm font-medium transition-colors"
                >
                  Generate Loot
                </button>
                <p className="text-xs text-gray-500">Adds random items to inventory</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 bg-slate-900 border-t border-slate-700 rounded-b-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleClearInventory}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition-colors"
              >
                Clear Inventory
              </button>
              <button
                onClick={handleResetCharacter}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
              >
                Reset Character
              </button>
            </div>
            <button
              onClick={handleExportCleanDatabase}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Export Clean DB (for Alpha Build)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
