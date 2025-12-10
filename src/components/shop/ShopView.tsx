import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getShopItems, purchaseItem, canAffordItem } from '@/lib/gamification';
import type { ShopItem, ShopItemCategory } from '@/types/gamification';
import { ShopItemCard } from './ShopItemCard';
import { PurchaseModal } from './PurchaseModal';

const CATEGORIES: { id: ShopItemCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '🛍️' },
  { id: 'consumable', label: 'Consumables', icon: '🧪' },
  { id: 'boost', label: 'Boosts', icon: '⚡' },
  { id: 'cosmetic', label: 'Cosmetics', icon: '✨' },
  { id: 'utility', label: 'Utilities', icon: '🔧' },
];

export function ShopView() {
  const { userCurrency, refreshCurrency, refreshInventory, progress, setCurrentView } = useAppStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ShopItemCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  // Load shop items
  useEffect(() => {
    loadShopItems();
  }, []);

  // Load currency
  useEffect(() => {
    if (!userCurrency) {
      refreshCurrency(1); // TODO: Use actual user ID
    }
  }, [userCurrency, refreshCurrency]);

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const loadShopItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const shopItems = await getShopItems(undefined, progress.level);
      setItems(shopItems);
      setFilteredItems(shopItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shop items');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem || !userCurrency) return;

    try {
      setPurchasing(true);
      await purchaseItem(1, selectedItem.id, purchaseQuantity); // TODO: Use actual user ID

      // Refresh currency and inventory
      await refreshCurrency(1);
      await refreshInventory(1);

      // Close modal and reset
      setSelectedItem(null);
      setPurchaseQuantity(1);

      // Show success notification
      // TODO: Add toast notification
      alert(`Successfully purchased ${purchaseQuantity}x ${selectedItem.name}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const openPurchaseModal = (item: ShopItem) => {
    setSelectedItem(item);
    setPurchaseQuantity(1);
  };

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
          <h1 className="text-3xl font-bold text-white">🛒 Item Shop</h1>
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

      {/* Category Filter */}
      <div className="flex gap-2 px-8 py-4 bg-[#1a1d29] border-b border-[#2a2f42] overflow-x-auto">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-[#fb923c] text-white'
                : 'bg-[#252837] text-gray-300 hover:bg-[#2a2f42] hover:text-white'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
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
              onClick={loadShopItems}
              className="px-6 py-2 bg-[#fb923c] hover:bg-[#f59e0b] text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">No items available in this category</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                userCurrency={userCurrency}
                userLevel={progress.level}
                onPurchase={openPurchaseModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedItem && userCurrency && (
        <PurchaseModal
          item={selectedItem}
          userCurrency={userCurrency}
          userLevel={progress.level}
          quantity={purchaseQuantity}
          onQuantityChange={setPurchaseQuantity}
          onConfirm={handlePurchase}
          onCancel={() => setSelectedItem(null)}
          purchasing={purchasing}
        />
      )}
    </div>
  );
}
