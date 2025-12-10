import React from 'react';
import type { ShopItem, UserCurrency } from '@/types/gamification';

interface PurchaseModalProps {
  item: ShopItem;
  userCurrency: UserCurrency;
  userLevel: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  purchasing: boolean;
}

export function PurchaseModal({
  item,
  userCurrency,
  userLevel,
  quantity,
  onQuantityChange,
  onConfirm,
  onCancel,
  purchasing,
}: PurchaseModalProps) {
  const totalGold = item.costGold * quantity;
  const totalGems = item.costGems * quantity;
  const canAfford =
    userCurrency.gold >= totalGold && userCurrency.gems >= totalGems;
  const meetsLevelRequirement = userLevel >= item.requiredLevel;
  const canPurchase = canAfford && meetsLevelRequirement;

  const remainingGold = userCurrency.gold - totalGold;
  const remainingGems = userCurrency.gems - totalGems;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, item.maxStack));
    onQuantityChange(newQuantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1a1d29] border-2 border-[#2a2f42] rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Confirm Purchase</h2>
          <button
            onClick={onCancel}
            disabled={purchasing}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Item Info */}
        <div className="flex items-start gap-4 mb-6 p-4 bg-[#252837] rounded-lg">
          <div className="text-5xl">{item.icon || '📦'}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
            {item.rarity && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-bold uppercase rounded bg-[#2a2f42] text-gray-300">
                {item.rarity}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        {item.isConsumable && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Quantity</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || purchasing}
                className="w-10 h-10 bg-[#252837] hover:bg-[#2a2f42] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-bold text-white w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= item.maxStack || purchasing}
                className="w-10 h-10 bg-[#252837] hover:bg-[#2a2f42] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Max stack: {item.maxStack}
            </p>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="mb-6 space-y-3">
          {/* Gold */}
          {totalGold > 0 && (
            <div className="flex items-center justify-between p-3 bg-[#252837] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="text-gray-400">Gold Cost</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-500">
                  {totalGold.toLocaleString()}
                </div>
                <div
                  className={`text-xs ${
                    remainingGold >= 0 ? 'text-gray-500' : 'text-red-400'
                  }`}
                >
                  Balance: {userCurrency.gold.toLocaleString()} → {remainingGold.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Gems */}
          {totalGems > 0 && (
            <div className="flex items-center justify-between p-3 bg-[#252837] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span className="text-gray-400">Gems Cost</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400">
                  {totalGems.toLocaleString()}
                </div>
                <div
                  className={`text-xs ${
                    remainingGems >= 0 ? 'text-gray-500' : 'text-red-400'
                  }`}
                >
                  Balance: {userCurrency.gems.toLocaleString()} → {remainingGems.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning if level requirement not met */}
        {!meetsLevelRequirement && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg">
            <p className="text-red-400 text-sm">
              ⚠️ Level requirement not met: Requires level {item.requiredLevel} (you are level {userLevel})
            </p>
          </div>
        )}

        {/* Warning if can't afford */}
        {meetsLevelRequirement && !canAfford && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg">
            <p className="text-red-400 text-sm">
              ⚠️ You don't have enough currency for this purchase
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={purchasing}
            className="flex-1 py-3 bg-[#252837] hover:bg-[#2a2f42] disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canPurchase || purchasing}
            className="flex-1 py-3 bg-[#fb923c] hover:bg-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
          >
            {purchasing ? 'Purchasing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
