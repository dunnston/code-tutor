import React from 'react';
import type { ShopItem, UserCurrency } from '@/types/gamification';

interface ShopItemCardProps {
  item: ShopItem;
  userCurrency: UserCurrency | null;
  userLevel: number;
  onPurchase: (item: ShopItem) => void;
}

const RARITY_COLORS = {
  common: 'text-gray-400 border-gray-600',
  uncommon: 'text-green-400 border-green-600',
  rare: 'text-blue-400 border-blue-600',
  epic: 'text-purple-400 border-purple-600',
  legendary: 'text-yellow-400 border-yellow-600',
};

export function ShopItemCard({ item, userCurrency, userLevel, onPurchase }: ShopItemCardProps) {
  const canAfford =
    userCurrency &&
    userCurrency.gold >= item.costGold &&
    userCurrency.gems >= item.costGems;

  const meetsLevelRequirement = userLevel >= item.requiredLevel;
  const canPurchase = canAfford && meetsLevelRequirement;

  const rarityColor = item.rarity ? RARITY_COLORS[item.rarity] : RARITY_COLORS.common;

  return (
    <div
      className={`bg-[#1a1d29] border-2 ${rarityColor} rounded-lg p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow`}
    >
      {/* Item Icon & Rarity Badge */}
      <div className="flex items-start justify-between">
        <div className="text-4xl">{item.icon || '📦'}</div>
        {item.rarity && (
          <span
            className={`px-2 py-1 text-xs font-bold uppercase rounded ${rarityColor} bg-opacity-20`}
          >
            {item.rarity}
          </span>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-lg font-bold text-white">{item.name}</h3>

      {/* Item Description */}
      <p className="text-sm text-gray-400 line-clamp-3 flex-1">
        {item.description || 'No description available'}
      </p>

      {/* Item Properties */}
      <div className="flex flex-col gap-2 text-sm">
        {/* Category */}
        <div className="flex items-center gap-2 text-gray-400">
          <span className="capitalize">{item.category}</span>
          {item.isConsumable && <span className="text-xs">• Consumable</span>}
        </div>

        {/* Level Requirement */}
        {item.requiredLevel > 1 && (
          <div
            className={`flex items-center gap-2 ${
              meetsLevelRequirement ? 'text-gray-400' : 'text-red-400'
            }`}
          >
            <span>🎓</span>
            <span>Requires Level {item.requiredLevel}</span>
          </div>
        )}

        {/* Limited Time */}
        {item.isLimitedTime && (
          <div className="flex items-center gap-2 text-yellow-400">
            <span>⏰</span>
            <span>Limited Time!</span>
          </div>
        )}
      </div>

      {/* Price & Purchase */}
      <div className="mt-2 pt-3 border-t border-[#2a2f42]">
        <div className="flex items-center justify-between mb-3">
          {/* Gold Cost */}
          {item.costGold > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xl">🪙</span>
              <span
                className={`font-bold ${
                  userCurrency && userCurrency.gold >= item.costGold
                    ? 'text-yellow-500'
                    : 'text-red-400'
                }`}
              >
                {item.costGold.toLocaleString()}
              </span>
            </div>
          )}

          {/* Gems Cost */}
          {item.costGems > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xl">💎</span>
              <span
                className={`font-bold ${
                  userCurrency && userCurrency.gems >= item.costGems
                    ? 'text-blue-400'
                    : 'text-red-400'
                }`}
              >
                {item.costGems.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onPurchase(item)}
          disabled={!canPurchase}
          className={`w-full py-2 rounded-lg font-bold transition-colors ${
            canPurchase
              ? 'bg-[#fb923c] hover:bg-[#f59e0b] text-white'
              : 'bg-[#2a2f42] text-gray-500 cursor-not-allowed'
          }`}
        >
          {!meetsLevelRequirement
            ? `Level ${item.requiredLevel} Required`
            : !canAfford
            ? 'Insufficient Funds'
            : 'Purchase'}
        </button>
      </div>
    </div>
  );
}
