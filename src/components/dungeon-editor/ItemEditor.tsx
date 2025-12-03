import React, { useState, useEffect } from 'react';
import { ItemType } from '../../types/dungeonEditor';

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: string; // weapon, shield, helmet, chest, boots, armor, accessory
  tier: string;
  requiredLevel: number;
  damageBonus: number;
  defenseBonus: number;
  hpBonus: number;
  manaBonus: number;
  icon: string;
  value: number;
}

interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  consumableType: string; // health_potion, mana_potion, buff_potion, scroll
  healthRestore: number;
  manaRestore: number;
  buffType: string;
  buffValue: number;
  buffDurationTurns: number;
  buyPrice: number;
  sellPrice: number;
  icon: string;
  tier: string;
}

type EditableItem = Partial<EquipmentItem | ConsumableItem>;

interface ItemEditorProps {
  item: EditableItem | null;
  onSave: (item: EditableItem, itemType: 'equipment' | 'consumable') => void;
  onCancel: () => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({ item, onSave, onCancel }) => {
  const [itemCategory, setItemCategory] = useState<'equipment' | 'consumable'>(
    item && 'slot' in item ? 'equipment' : 'consumable'
  );

  const [formData, setFormData] = useState<EditableItem>(
    item || {
      id: '',
      name: '',
      description: '',
      icon: '📦',
      tier: 'common',
    }
  );

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Generate ID if creating new item
    if (!formData.id) {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      formData.id = `${itemCategory}_${timestamp}_${randomStr}`;
    }

    // Set defaults based on item category
    if (itemCategory === 'equipment') {
      const equipment: Partial<EquipmentItem> = {
        ...formData,
        slot: (formData as any).slot || 'weapon',
        requiredLevel: (formData as any).requiredLevel || 1,
        damageBonus: (formData as any).damageBonus || 0,
        defenseBonus: (formData as any).defenseBonus || 0,
        hpBonus: (formData as any).hpBonus || 0,
        manaBonus: (formData as any).manaBonus || 0,
        value: (formData as any).value || 10,
      };
      onSave(equipment, 'equipment');
    } else {
      const consumable: Partial<ConsumableItem> = {
        ...formData,
        consumableType: (formData as any).consumableType || 'scroll',
        healthRestore: (formData as any).healthRestore || 0,
        manaRestore: (formData as any).manaRestore || 0,
        buffType: (formData as any).buffType || '',
        buffValue: (formData as any).buffValue || 0,
        buffDurationTurns: (formData as any).buffDurationTurns || 0,
        buyPrice: (formData as any).buyPrice || 10,
        sellPrice: (formData as any).sellPrice || 5,
      };
      onSave(consumable, 'consumable');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✏️</span>
            {item ? 'Edit Item' : 'Create New Item'}
          </h2>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                     transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Item Category (only for new items) */}
            {!item && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Item Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setItemCategory('equipment')}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      itemCategory === 'equipment'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-blue-500'
                    }`}
                  >
                    ⚔️ Equipment (Weapons/Armor)
                  </button>
                  <button
                    onClick={() => setItemCategory('consumable')}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      itemCategory === 'consumable'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-blue-500'
                    }`}
                  >
                    🧪 Consumable (Potions/Scrolls/Keys)
                  </button>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rusty Sword"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Icon</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => updateField('icon', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="⚔️"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="A worn blade, still sharp enough to be useful"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Tier</label>
              <select
                value={formData.tier || 'common'}
                onChange={(e) => updateField('tier', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>

            {/* Equipment-specific fields */}
            {itemCategory === 'equipment' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Equipment Slot</label>
                    <select
                      value={(formData as any).slot || 'weapon'}
                      onChange={(e) => updateField('slot', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="weapon">Weapon</option>
                      <option value="shield">Shield</option>
                      <option value="helmet">Helmet</option>
                      <option value="chest">Chest Armor</option>
                      <option value="boots">Boots</option>
                      <option value="armor">Full Armor</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Required Level</label>
                    <input
                      type="number"
                      value={(formData as any).requiredLevel || 1}
                      onChange={(e) => updateField('requiredLevel', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Stat Bonuses</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Damage Bonus</label>
                      <input
                        type="number"
                        value={(formData as any).damageBonus || 0}
                        onChange={(e) => updateField('damageBonus', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Defense Bonus</label>
                      <input
                        type="number"
                        value={(formData as any).defenseBonus || 0}
                        onChange={(e) => updateField('defenseBonus', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">HP Bonus</label>
                      <input
                        type="number"
                        value={(formData as any).hpBonus || 0}
                        onChange={(e) => updateField('hpBonus', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mana Bonus</label>
                      <input
                        type="number"
                        value={(formData as any).manaBonus || 0}
                        onChange={(e) => updateField('manaBonus', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gold Value</label>
                  <input
                    type="number"
                    value={(formData as any).value || 10}
                    onChange={(e) => updateField('value', parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Consumable-specific fields */}
            {itemCategory === 'consumable' && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Consumable Type</label>
                  <select
                    value={(formData as any).consumableType || 'scroll'}
                    onChange={(e) => updateField('consumableType', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="health_potion">Health Potion</option>
                    <option value="mana_potion">Mana Potion</option>
                    <option value="buff_potion">Buff Potion</option>
                    <option value="scroll">Scroll/Key/Special</option>
                  </select>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Effects</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Health Restore</label>
                      <input
                        type="number"
                        value={(formData as any).healthRestore || 0}
                        onChange={(e) => updateField('healthRestore', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="50 (or 999 for full heal)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mana Restore</label>
                      <input
                        type="number"
                        value={(formData as any).manaRestore || 0}
                        onChange={(e) => updateField('manaRestore', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="30 (or 999 for full restore)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Buff Type (optional)</label>
                      <input
                        type="text"
                        value={(formData as any).buffType || ''}
                        onChange={(e) => updateField('buffType', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="strength, defense, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Buff Value</label>
                      <input
                        type="number"
                        value={(formData as any).buffValue || 0}
                        onChange={(e) => updateField('buffValue', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Buff Duration (turns)</label>
                      <input
                        type="number"
                        value={(formData as any).buffDurationTurns || 0}
                        onChange={(e) => updateField('buffDurationTurns', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                                 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Buy Price (Gold)</label>
                    <input
                      type="number"
                      value={(formData as any).buyPrice || 10}
                      onChange={(e) => updateField('buyPrice', parseInt(e.target.value) || 10)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Sell Price (Gold)</label>
                    <input
                      type="number"
                      value={(formData as any).sellPrice || 5}
                      onChange={(e) => updateField('sellPrice', parseInt(e.target.value) || 5)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 p-4 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                     transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700
                     disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            {item ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>
  );
};
