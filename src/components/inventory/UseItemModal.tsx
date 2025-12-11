import React from 'react';
import type { InventoryItem } from '@/types/gamification';

interface UseItemModalProps {
  item: InventoryItem;
  onConfirm: () => void;
  onCancel: () => void;
  using: boolean;
}

export function UseItemModal({ item, onConfirm, onCancel, using }: UseItemModalProps) {
  // Parse effects for display
  let effectsDisplay: string = 'Unknown effect';
  try {
    const effects = item.item.effectsParsed;
    if (effects) {
      if (effects.type === 'xp_multiplier') {
        effectsDisplay = `${effects.value}x XP multiplier`;
        if (effects.duration === 'next_lesson') {
          effectsDisplay += ' for your next lesson';
        } else if (effects.duration) {
          effectsDisplay += ` for ${effects.duration}`;
        } else if (effects.durationSeconds) {
          const hours = Math.floor(effects.durationSeconds / 3600);
          const minutes = Math.floor((effects.durationSeconds % 3600) / 60);
          if (hours > 0) {
            effectsDisplay += ` for ${hours} hour${hours > 1 ? 's' : ''}`;
          } else {
            effectsDisplay += ` for ${minutes} minute${minutes > 1 ? 's' : ''}`;
          }
        }
      } else if (effects.type === 'gold_multiplier') {
        effectsDisplay = `${effects.value}x gold multiplier for ${effects.durationSeconds ? Math.floor(effects.durationSeconds / 3600) + ' hours' : 'a duration'}`;
      } else if (effects.type === 'streak_protection') {
        effectsDisplay = `Protects your streak ${(effects.value ?? 1) > 1 ? `for up to ${effects.value} days` : 'for 1 day'}`;
      } else if (effects.type === 'free_hint') {
        effectsDisplay = 'Grants 1 free hint';
      } else if (effects.type === 'skip_timer') {
        effectsDisplay = 'Skips lesson timer requirement';
      } else if (effects.type === 'puzzle_points_multiplier') {
        effectsDisplay = `${effects.value}x puzzle points for ${effects.durationSeconds ? Math.floor(effects.durationSeconds / 3600) + ' hour' + (Math.floor(effects.durationSeconds / 3600) > 1 ? 's' : '') : 'a duration'}`;
      } else {
        effectsDisplay = effects.type.replace(/_/g, ' ');
      }
    }
  } catch (e) {
    // Use raw effects string if parsing fails
    effectsDisplay = 'Check item description for details';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1a1d29] border-2 border-[#2a2f42] rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Use Item?</h2>
          <button
            onClick={onCancel}
            disabled={using}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Item Info */}
        <div className="flex items-start gap-4 mb-6 p-4 bg-[#252837] rounded-lg">
          <div className="text-5xl">{item.item.icon || '📦'}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{item.item.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{item.item.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-[#2a2f42] text-gray-300 rounded">
                {item.quantity} remaining
              </span>
              {item.item.rarity && (
                <span className="px-2 py-1 bg-[#2a2f42] text-gray-300 rounded uppercase">
                  {item.item.rarity}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Effect Description */}
        <div className="mb-6 p-4 bg-[#252837] rounded-lg border-l-4 border-[#fb923c]">
          <h4 className="text-sm font-bold text-gray-300 mb-2">✨ Effect:</h4>
          <p className="text-white">{effectsDisplay}</p>
        </div>

        {/* Warning */}
        <div className="mb-6 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ This item will be consumed and cannot be recovered
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={using}
            className="flex-1 py-3 bg-[#252837] hover:bg-[#2a2f42] disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={using}
            className="flex-1 py-3 bg-[#fb923c] hover:bg-[#f59e0b] disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
          >
            {using ? 'Using...' : 'Use Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
