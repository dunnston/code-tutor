import React, { useEffect, useState } from 'react';
import {
  getCharacterStats,
  getUserAbilities,
  getCharacterEquipment,
  getEquipmentItems,
  distributeStatPoints,
} from '../../lib/rpg';
import type { CharacterStats, Ability, CharacterEquipment, EquipmentItem } from '../../types/rpg';

interface CharacterSheetProps {
  userId: number;
  onClose: () => void;
}

export function CharacterSheet({ userId, onClose }: CharacterSheetProps) {
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [equipment, setEquipment] = useState<CharacterEquipment | null>(null);
  const [allEquipment, setAllEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Stat point distribution
  const [strPoints, setStrPoints] = useState(0);
  const [intPoints, setIntPoints] = useState(0);
  const [dexPoints, setDexPoints] = useState(0);

  useEffect(() => {
    loadCharacterData();
  }, [userId]);

  async function loadCharacterData() {
    try {
      setLoading(true);
      const [characterStats, userAbilities, characterEquipment, equipmentItems] = await Promise.all([
        getCharacterStats(userId),
        getUserAbilities(userId),
        getCharacterEquipment(userId),
        getEquipmentItems(),
      ]);
      setStats(characterStats);
      setAbilities(userAbilities);
      setEquipment(characterEquipment);
      setAllEquipment(equipmentItems);
    } catch (err) {
      console.error('Failed to load character data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDistributePoints() {
    if (!stats || strPoints + intPoints + dexPoints === 0) return;

    try {
      const updated = await distributeStatPoints(userId, strPoints, intPoints, dexPoints);
      setStats(updated);
      setStrPoints(0);
      setIntPoints(0);
      setDexPoints(0);
    } catch (err) {
      console.error('Failed to distribute stat points:', err);
    }
  }

  const pointsToSpend = (stats?.statPointsAvailable || 0) - (strPoints + intPoints + dexPoints);

  if (loading || !stats) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full mx-4 animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-32 bg-slate-700 rounded" />
            <div className="h-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const equippedWeapon = allEquipment.find((item) => item.id === equipment?.weaponId);
  const equippedArmor = allEquipment.find((item) => item.id === equipment?.armorId);
  const equippedAccessory = allEquipment.find((item) => item.id === equipment?.accessoryId);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-orange-400">📋 Character Sheet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Level & XP */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Level {stats.level}</h3>
                <p className="text-sm text-gray-400">Adventurer</p>
              </div>
              {stats.statPointsAvailable > 0 && (
                <div className="text-right">
                  <div className="text-orange-400 font-bold">{pointsToSpend} Points Available</div>
                  <p className="text-xs text-gray-400">Distribute below</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Health & Mana */}
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white mb-3">Vitals</h4>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">❤️ Health</span>
                    <span className="text-gray-300">
                      {stats.currentHealth}/{stats.maxHealth}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(stats.currentHealth / stats.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-400">💙 Mana</span>
                    <span className="text-gray-300">
                      {stats.currentMana}/{stats.maxMana}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(stats.currentMana / stats.maxMana) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Primary Stats */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Primary Stats</h4>
                <div className="space-y-3">
                  {/* Strength */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💪</span>
                      <div>
                        <div className="text-white font-semibold">Strength</div>
                        <div className="text-xs text-gray-400">Physical power</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-orange-400">{stats.strength + strPoints}</span>
                      {pointsToSpend > 0 && (
                        <button
                          onClick={() => setStrPoints(strPoints + 1)}
                          disabled={pointsToSpend === 0}
                          className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white w-7 h-7 rounded flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Intelligence */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <div className="text-white font-semibold">Intelligence</div>
                        <div className="text-xs text-gray-400">Magical power</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-purple-400">{stats.intelligence + intPoints}</span>
                      {pointsToSpend > 0 && (
                        <button
                          onClick={() => setIntPoints(intPoints + 1)}
                          disabled={pointsToSpend === 0}
                          className="bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white w-7 h-7 rounded flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dexterity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <div className="text-white font-semibold">Dexterity</div>
                        <div className="text-xs text-gray-400">Speed & precision</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-400">{stats.dexterity + dexPoints}</span>
                      {pointsToSpend > 0 && (
                        <button
                          onClick={() => setDexPoints(dexPoints + 1)}
                          disabled={pointsToSpend === 0}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white w-7 h-7 rounded flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {(strPoints + intPoints + dexPoints > 0) && (
                  <button
                    onClick={handleDistributePoints}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
                  >
                    Apply Changes
                  </button>
                )}
              </div>

              {/* Combat Stats */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Combat Stats</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">⚔️ Damage:</span>
                    <span className="text-white font-mono">{stats.baseDamage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🛡️ Defense:</span>
                    <span className="text-white font-mono">{stats.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">💥 Critical:</span>
                    <span className="text-white font-mono">{(stats.criticalChance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🌀 Dodge:</span>
                    <span className="text-white font-mono">{(stats.dodgeChance * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Equipment */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">⚙️ Equipment</h4>
                <div className="space-y-3">
                  <div className="bg-slate-600/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Weapon</div>
                    <div className="text-white">
                      {equippedWeapon ? (
                        <div className="flex items-center gap-2">
                          <span>{equippedWeapon.icon}</span>
                          <span>{equippedWeapon.name}</span>
                          <span className="text-orange-400 text-sm">+{equippedWeapon.damageBonus} dmg</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Empty</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-600/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Armor</div>
                    <div className="text-white">
                      {equippedArmor ? (
                        <div className="flex items-center gap-2">
                          <span>{equippedArmor.icon}</span>
                          <span>{equippedArmor.name}</span>
                          <span className="text-blue-400 text-sm">+{equippedArmor.defenseBonus} def</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Empty</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-600/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Accessory</div>
                    <div className="text-white">
                      {equippedAccessory ? (
                        <div className="flex items-center gap-2">
                          <span>{equippedAccessory.icon}</span>
                          <span>{equippedAccessory.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">✨ Abilities ({abilities.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {abilities.map((ability) => (
                    <div key={ability.id} className="bg-slate-600/50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ability.icon}</span>
                          <span className="text-white font-semibold">{ability.name}</span>
                        </div>
                        {ability.manaCost > 0 && (
                          <span className="text-blue-400 text-sm">{ability.manaCost} MP</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{ability.description}</p>
                    </div>
                  ))}
                  {abilities.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No abilities unlocked yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
