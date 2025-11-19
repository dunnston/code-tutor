import React from 'react';
import type { InventoryItem } from '@/types/gamification';

interface InventoryItemCardProps {
  item: InventoryItem;
  onUse: () => void;
}

const RARITY_COLORS = {
  common: 'border-gray-600',
  uncommon: 'border-green-600',
  rare: 'border-blue-600',
  epic: 'border-purple-600',
  legendary: 'border-yellow-600',
};

export function InventoryItemCard({ item, onUse }: InventoryItemCardProps) {
  const rarityColor = item.item.rarity
    ? RARITY_COLORS[item.item.rarity]
    : RARITY_COLORS.common;

  const isConsumable = item.item.isConsumable;
  const isCosmetic = item.item.category === 'cosmetic';

  return (
    <div
      className={`bg-[#1a1d29] border-2 ${rarityColor} rounded-lg p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow relative`}
    >
      {/* Quantity Badge */}
      {item.quantity > 1 && (
        <div className="absolute top-2 right-2 bg-[#fb923c] text-white text-xs font-bold px-2 py-1 rounded-full">
          ×{item.quantity}
        </div>
      )}

      {/* Item Icon */}
      <div className="flex items-start justify-between">
        <div className="text-4xl">{item.item.icon || '📦'}</div>
        {item.item.rarity && (
          <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-[#252837] text-gray-300">
            {item.item.rarity}
          </span>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-lg font-bold text-white">{item.item.name}</h3>

      {/* Item Description */}
      <p className="text-sm text-gray-400 line-clamp-3 flex-1">
        {item.item.description || 'No description available'}
      </p>

      {/* Item Properties */}
      <div className="flex flex-col gap-2 text-sm text-gray-400">
        <div className="capitalize">{item.item.category}</div>
        {isConsumable && <div className="text-xs">• Can be used</div>}
        {isCosmetic && <div className="text-xs">• Cosmetic item</div>}
      </div>

      {/* Acquired Date */}
      <div className="text-xs text-gray-500 pt-2 border-t border-[#2a2f42]">
        Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
      </div>

      {/* Action Button */}
      {isConsumable && (
        <button
          onClick={onUse}
          className="w-full py-2 mt-2 bg-[#fb923c] hover:bg-[#f59e0b] text-white rounded-lg font-bold transition-colors"
        >
          Use Item
        </button>
      )}

      {isCosmetic && (
        <button
          disabled
          className="w-full py-2 mt-2 bg-[#2a2f42] text-gray-500 rounded-lg font-bold cursor-not-allowed"
        >
          Equip (Coming Soon)
        </button>
      )}
    </div>
  );
}
