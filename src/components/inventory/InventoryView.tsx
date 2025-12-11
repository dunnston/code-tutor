import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useInventoryItem, getInventoryByCategory } from '@/lib/gamification';
import type { InventoryItem } from '@/types/gamification';
import { InventoryItemCard } from './InventoryItemCard';
import { UseItemModal } from './UseItemModal';

type TabType = 'all' | 'consumables' | 'boosts' | 'cosmetics' | 'utilities';

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '📦' },
  { id: 'consumables', label: 'Consumables', icon: '🧪' },
  { id: 'boosts', label: 'Boosts', icon: '⚡' },
  { id: 'cosmetics', label: 'Cosmetics', icon: '✨' },
  { id: 'utilities', label: 'Utilities', icon: '🔧' },
];

export function InventoryView() {
  const { inventory, refreshInventory, userCurrency, refreshCurrency, setCurrentView, currentUserId } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [using, setUsing] = useState(false);

  // Load inventory
  useEffect(() => {
    if (currentUserId) {
      loadInventory();
    }
  }, [currentUserId]);

  // Load currency
  useEffect(() => {
    if (!userCurrency && currentUserId) {
      refreshCurrency(currentUserId);
    }
  }, [userCurrency, refreshCurrency, currentUserId]);

  // Filter items by tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredItems(inventory);
    } else {
      const categoryMap = {
        consumables: 'consumable',
        boosts: 'boost',
        cosmetics: 'cosmetic',
        utilities: 'utility',
      };
      const category = categoryMap[activeTab];
      setFilteredItems(inventory.filter((item) => item.item.category === category));
    }
  }, [activeTab, inventory]);

  const loadInventory = async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      await refreshInventory(currentUserId);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseItem = async () => {
    if (!selectedItem || !currentUserId) return;

    try {
      setUsing(true);
      await useInventoryItem(currentUserId, selectedItem.itemId);

      // Refresh inventory
      await refreshInventory(currentUserId);

      // Close modal
      setSelectedItem(null);

      // Show success notification
      alert(`Used ${selectedItem.item.name}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to use item');
    } finally {
      setUsing(false);
    }
  };

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

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
          <h1 className="text-3xl font-bold text-white">🎒 Inventory</h1>
          <span className="px-3 py-1 bg-[#252837] text-gray-300 rounded-lg text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
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
      <div className="flex gap-2 px-8 py-4 bg-[#1a1d29] border-b border-[#2a2f42] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#fb923c] text-white'
                : 'bg-[#252837] text-gray-300 hover:bg-[#2a2f42] hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c]"></div>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-400 text-lg">Your inventory is empty</p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3 bg-[#fb923c] hover:bg-[#f59e0b] text-white rounded-lg font-bold transition-colors"
            >
              🛒 Visit the Shop
            </button>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <InventoryItemCard
                key={item.id}
                item={item}
                onUse={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Use Item Modal */}
      {selectedItem && (
        <UseItemModal
          item={selectedItem}
          onConfirm={handleUseItem}
          onCancel={() => setSelectedItem(null)}
          using={using}
        />
      )}
    </div>
  );
}
