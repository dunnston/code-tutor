import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { LootItem, ItemType } from '../../types/dungeonEditor';

interface LootItemOption {
  id: string;
  name: string;
  description?: string;
  category: string; // "equipment" or "consumable"
  itemType: string;
  tier: string;
  icon?: string;
}

interface ItemSelectorProps {
  onClose: () => void;
  onSelectItem: (item: LootItem) => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({ onClose, onSelectItem }) => {
  const [items, setItems] = useState<LootItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const loadedItems: LootItemOption[] = await invoke('list_all_loot_items');
      setItems(loadedItems);
    } catch (error) {
      console.error('Failed to load items:', error);
      alert('Failed to load items: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterTier && item.tier !== filterTier) return false;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (item: LootItemOption) => {
    // Map ItemType based on category and itemType
    let type: ItemType;
    if (item.category === 'equipment') {
      if (item.itemType === 'weapon') {
        type = ItemType.WEAPON;
      } else {
        type = ItemType.ARMOR;
      }
    } else {
      // consumable
      if (item.itemType === 'health_potion' || item.itemType === 'mana_potion' || item.itemType === 'buff_potion') {
        type = ItemType.POTION;
      } else {
        type = ItemType.SCROLL;
      }
    }

    const lootItem: LootItem = {
      itemSource: 'database',
      itemId: item.id,
      itemCategory: item.category as 'equipment' | 'consumable',
      type,
      name: item.name,
      quantity: 1,
      description: item.description,
    };

    onSelectItem(lootItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎁</span>
            Select Item
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                     transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="equipment">Equipment</option>
              <option value="consumable">Consumable</option>
            </select>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tiers</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <button
              onClick={() => {
                setFilterCategory('');
                setFilterTier('');
                setSearchTerm('');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <p className="text-gray-400 text-center">Loading items...</p>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500
                           transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{item.icon || '📦'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium mb-1">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</div>
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            item.tier === 'common'
                              ? 'bg-gray-600'
                              : item.tier === 'uncommon'
                              ? 'bg-green-600'
                              : item.tier === 'rare'
                              ? 'bg-blue-600'
                              : item.tier === 'epic'
                              ? 'bg-purple-600'
                              : 'bg-orange-600'
                          }`}
                        >
                          {item.tier}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.category === 'equipment' ? item.itemType : item.itemType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
