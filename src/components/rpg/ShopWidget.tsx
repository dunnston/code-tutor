import React, { useEffect, useState } from 'react';
import { getShopItems, purchaseShopItem, getCharacterStats, getShopRefreshState, forceShopRefresh, type ShopRefreshState } from '../../lib/rpg';
import type { ShopItemDisplay, CharacterStats, EquipmentItem, ConsumableItem } from '../../types/rpg';

interface ShopWidgetProps {
  userId: number;
  onPurchase?: () => void;
}

type TabType = 'all' | 'weapons' | 'armor' | 'potions';

export function ShopWidget({ userId, onPurchase }: ShopWidgetProps) {
  const [items, setItems] = useState<ShopItemDisplay[]>([]);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [refreshState, setRefreshState] = useState<ShopRefreshState | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadShopData();
  }, [userId]);

  // Update countdown timer
  useEffect(() => {
    if (!refreshState) return;

    const updateTimer = () => {
      const now = new Date();
      const nextRefresh = new Date(refreshState.nextRefreshTime);
      const diff = nextRefresh.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilRefresh('Refreshing...');
        // Reload shop when time is up
        loadShopData();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilRefresh(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [refreshState]);

  async function loadShopData() {
    try {
      setLoading(true);
      setError(null);
      const [shopItems, characterStats, shopRefreshState] = await Promise.all([
        getShopItems(userId),
        getCharacterStats(userId),
        getShopRefreshState(),
      ]);
      setItems(shopItems);
      setStats(characterStats);
      setRefreshState(shopRefreshState);
    } catch (err) {
      console.error('Failed to load shop data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shop');
    } finally {
      setLoading(false);
    }
  }

  async function handleForceRefresh() {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      setError(null);
      await forceShopRefresh();
      await loadShopData();
    } catch (err) {
      console.error('Failed to refresh shop:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh shop');
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handlePurchase(item: ShopItemDisplay, quantity: number = 1) {
    if (!stats || purchasing !== null) return;

    try {
      setPurchasing(item.shopId);
      setError(null);
      const updatedStats = await purchaseShopItem(
        userId,
        item.shopId,
        item.itemType,
        item.itemId,
        quantity
      );
      setStats(updatedStats);
      await loadShopData(); // Reload shop items
      onPurchase?.();
    } catch (err) {
      console.error('Failed to purchase item:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase item');
    } finally {
      setPurchasing(null);
    }
  }

  function canAfford(item: ShopItemDisplay): boolean {
    return stats ? stats.currentGold >= item.price : false;
  }

  function meetsRequirements(item: ShopItemDisplay): boolean {
    if (!stats) return false;
    if (stats.level < item.requiredLevel) return false;

    if (item.itemType === 'equipment') {
      const equipment = item.item as EquipmentItem;
      if (stats.strength < equipment.requiredStrength) return false;
      if (stats.intelligence < equipment.requiredIntelligence) return false;
      if (stats.dexterity < equipment.requiredDexterity) return false;
    }

    return true;
  }

  function getFilteredItems(): ShopItemDisplay[] {
    if (activeTab === 'all') return items;
    if (activeTab === 'potions') {
      return items.filter(item => item.itemType === 'consumable');
    }
    if (activeTab === 'weapons') {
      return items.filter(item =>
        item.itemType === 'equipment' &&
        (item.item as EquipmentItem).slot === 'weapon'
      );
    }
    if (activeTab === 'armor') {
      return items.filter(item =>
        item.itemType === 'equipment' &&
        ['shield', 'helmet', 'chest', 'boots', 'armor'].includes((item.item as EquipmentItem).slot)
      );
    }
    return items;
  }

  function getTierColor(tier: string): string {
    switch (tier) {
      case 'legendary': return 'text-orange-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }

  function getItemStats(item: ShopItemDisplay): string[] {
    const statsLines: string[] = [];

    if (item.itemType === 'equipment') {
      const eq = item.item as EquipmentItem;
      if (eq.damageBonus > 0) statsLines.push(`+${eq.damageBonus} Damage`);
      if (eq.defenseBonus > 0) statsLines.push(`+${eq.defenseBonus} Defense`);
      if (eq.hpBonus > 0) statsLines.push(`+${eq.hpBonus} HP`);
      if (eq.manaBonus > 0) statsLines.push(`+${eq.manaBonus} Mana`);
      if (eq.strengthBonus > 0) statsLines.push(`+${eq.strengthBonus} STR`);
      if (eq.intelligenceBonus > 0) statsLines.push(`+${eq.intelligenceBonus} INT`);
      if (eq.dexterityBonus > 0) statsLines.push(`+${eq.dexterityBonus} DEX`);
      if (eq.criticalChanceBonus > 0) statsLines.push(`+${(eq.criticalChanceBonus * 100).toFixed(0)}% Crit`);
      if (eq.dodgeChanceBonus > 0) statsLines.push(`+${(eq.dodgeChanceBonus * 100).toFixed(0)}% Dodge`);
    } else {
      const consumable = item.item as ConsumableItem;
      if (consumable.healthRestore > 0) {
        statsLines.push(consumable.healthRestore === 999
          ? 'Fully restores health'
          : `Restores ${consumable.healthRestore} HP`
        );
      }
      if (consumable.manaRestore > 0) {
        statsLines.push(consumable.manaRestore === 999
          ? 'Fully restores mana'
          : `Restores ${consumable.manaRestore} Mana`
        );
      }
      if (consumable.buffType) {
        statsLines.push(`+${consumable.buffValue} ${consumable.buffType} (${consumable.buffDurationTurns} turns)`);
      }
    }

    return statsLines;
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-orange-400">🏪 Town Shop</h2>
            {refreshState && (
              <div className="flex items-center gap-2 mt-2">
                <div className="text-xs text-gray-400">
                  Next refresh: <span className="text-blue-400 font-mono">{timeUntilRefresh}</span>
                </div>
                <button
                  onClick={handleForceRefresh}
                  disabled={isRefreshing}
                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-gray-300 disabled:opacity-50"
                  title="Force refresh (for testing)"
                >
                  {isRefreshing ? '⚙️' : '🔄'}
                </button>
              </div>
            )}
          </div>
          {stats && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Your Gold</div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.currentGold} <span className="text-sm">🪙</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'weapons', 'armor', 'potions'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              {tab === 'all' && '🛒 All Items'}
              {tab === 'weapons' && '⚔️ Weapons'}
              {tab === 'armor' && '🛡️ Armor'}
              {tab === 'potions' && '🧪 Potions'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Items List */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📦</div>
            <p>No items available in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => {
              const affordable = canAfford(item);
              const hasRequirements = meetsRequirements(item);
              const canBuy = affordable && hasRequirements && item.inStock;
              const isPurchasing = purchasing === item.shopId;

              return (
                <div
                  key={item.shopId}
                  className={`p-4 rounded-lg border transition-all ${
                    canBuy
                      ? 'bg-slate-700/50 border-slate-600 hover:border-orange-500/50'
                      : 'bg-slate-700/20 border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className={`font-bold ${getTierColor(item.tier)}`}>
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 uppercase">{item.tier}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 mb-2">{item.description}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {getItemStats(item).map((stat, idx) => (
                          <span key={idx} className="text-xs bg-slate-600/50 text-gray-300 px-2 py-1 rounded">
                            {stat}
                          </span>
                        ))}
                      </div>

                      {/* Requirements */}
                      {item.requiredLevel > 1 && (
                        <div className={`text-xs ${stats && stats.level >= item.requiredLevel ? 'text-gray-500' : 'text-red-400'}`}>
                          Requires Level {item.requiredLevel}
                        </div>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {item.price} 🪙
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canBuy || isPurchasing}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          canBuy
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-slate-600 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isPurchasing ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⚙️</span>
                            Buying...
                          </span>
                        ) : !affordable ? (
                          'Not enough gold'
                        ) : !hasRequirements ? (
                          'Requirements not met'
                        ) : !item.inStock ? (
                          'Out of stock'
                        ) : (
                          'Buy'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
