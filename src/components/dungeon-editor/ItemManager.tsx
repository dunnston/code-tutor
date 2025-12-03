import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ItemEditor } from './ItemEditor';

interface LootItemOption {
  id: string;
  name: string;
  description: string | null;
  category: string; // "equipment" or "consumable"
  itemType: string;
  tier: string;
  icon: string | null;
}

interface EquipmentItem {
  id: string;
  name: string;
  description: string | null;
  slot: string;
  tier: string;
  requiredLevel: number;
  damageBonus: number;
  defenseBonus: number;
  hpBonus: number;
  manaBonus: number;
  icon: string | null;
  value: number;
}

interface ConsumableItem {
  id: string;
  name: string;
  description: string | null;
  consumableType: string;
  healthRestore: number;
  manaRestore: number;
  buffType: string | null;
  buffValue: number;
  buffDurationTurns: number;
  buyPrice: number;
  sellPrice: number;
  icon: string | null;
  tier: string;
}

interface ItemManagerProps {
  onClose: () => void;
  onSelectItem?: (item: LootItemOption) => void;
}

export const ItemManager: React.FC<ItemManagerProps> = ({ onClose, onSelectItem }) => {
  const [items, setItems] = useState<LootItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
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

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  const handleEdit = async (item: LootItemOption) => {
    try {
      if (item.category === 'equipment') {
        const equipment: EquipmentItem = await invoke('get_equipment_item', { itemId: item.id });
        setEditingItem(equipment);
      } else {
        const consumable: ConsumableItem = await invoke('get_consumable_item', { itemId: item.id });
        setEditingItem(consumable);
      }
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to load item for editing:', error);
      alert('Failed to load item: ' + error);
    }
  };

  const handleSave = async (item: any, itemType: 'equipment' | 'consumable') => {
    try {
      if (itemType === 'equipment') {
        await invoke('save_custom_equipment', { item });
      } else {
        await invoke('save_custom_consumable', { item });
      }
      setShowEditor(false);
      setEditingItem(null);
      loadItems();
      alert('✅ Item saved successfully!');
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('❌ Failed to save item: ' + error);
    }
  };

  const handleDelete = async (item: LootItemOption) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      if (item.category === 'equipment') {
        await invoke('delete_equipment_item', { itemId: item.id });
      } else {
        await invoke('delete_consumable_item', { itemId: item.id });
      }
      loadItems();
      alert('✅ Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('❌ Failed to delete item: ' + error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterTier && item.tier !== filterTier) return false;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (showEditor) {
    return (
      <ItemEditor
        item={editingItem}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎁</span>
            Item Manager
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Create Item
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
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
              <p className="text-gray-400 mb-4">
                {searchTerm || filterCategory || filterTier
                  ? 'No items match your filters.'
                  : 'No items yet. Create your first item!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500
                           transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{item.icon || '📦'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium mb-1 truncate">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
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
                        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.itemType ? item.itemType.replace('_', ' ') : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {onSelectItem && (
                      <button
                        onClick={() => {
                          onSelectItem(item);
                          onClose();
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded
                                 transition-colors text-sm"
                      >
                        Select
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded
                               transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded
                               transition-colors text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
