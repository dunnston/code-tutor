import { useState, useEffect } from 'react';
import type {
  CharacterStats,
  CharacterEquipment,
  CharacterEquipmentWithDetails,
  EquipmentInventoryItem,
  EquipmentItem,
  UserAbilityWithLevel,
  AbilityWithUnlockStatus,
  UserConsumableInventoryItem,
} from '../../types/rpg';
import {
  getCharacterStats,
  getCharacterEquipment,
  getCharacterEquipmentWithDetails,
  getEquipmentInventory,
  getUserAbilitiesWithLevels,
  getAllAbilitiesWithStatus,
  unlockAbility,
  setActiveAbility,
  removeActiveAbility,
  equipItemToSlot,
  unequipItemFromSlot,
  spendStatPointOnHealth,
  spendStatPointOnMana,
  spendStatPointOnStat,
  spendStatPointOnAbility,
  getConsumableInventory,
  useConsumable,
} from '../../lib/rpg';

interface CharacterSheetProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'stats' | 'equipment' | 'inventory' | 'potions' | 'abilities';

export function CharacterSheet({ userId, isOpen, onClose }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [equipment, setEquipment] = useState<CharacterEquipmentWithDetails | null>(null);
  const [inventory, setInventory] = useState<EquipmentInventoryItem[]>([]);
  const [potions, setPotions] = useState<UserConsumableInventoryItem[]>([]);
  const [abilities, setAbilities] = useState<AbilityWithUnlockStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCharacterData();
    }
  }, [isOpen, userId]);

  const loadCharacterData = async () => {
    setLoading(true);
    try {
      const [statsData, equipmentData, inventoryData, potionsData, abilitiesData] = await Promise.all([
        getCharacterStats(userId),
        getCharacterEquipmentWithDetails(userId),
        getEquipmentInventory(userId),
        getConsumableInventory(userId),
        getAllAbilitiesWithStatus(userId),
      ]);
      setStats(statsData);
      setEquipment(equipmentData);
      setInventory(inventoryData);
      setPotions(potionsData);
      setAbilities(abilitiesData);
    } catch (error) {
      console.error('Failed to load character data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipItem = async (item: EquipmentItem, slot: string) => {
    try {
      const updatedEquipment = await equipItemToSlot(userId, item.id, slot);
      setEquipment(updatedEquipment);
      await loadCharacterData(); // Reload to update stats and inventory
    } catch (error) {
      console.error('Failed to equip item:', error);
      alert('Failed to equip item');
    }
  };

  const handleUnequipItem = async (slot: string) => {
    try {
      const updatedEquipment = await unequipItemFromSlot(userId, slot);
      setEquipment(updatedEquipment);
      await loadCharacterData(); // Reload to update stats and inventory
    } catch (error) {
      console.error('Failed to unequip item:', error);
      alert('Failed to unequip item');
    }
  };

  const handleSpendPointOnHealth = async () => {
    try {
      const updatedStats = await spendStatPointOnHealth(userId);
      setStats(updatedStats);
    } catch (error) {
      console.error('Failed to spend stat point:', error);
      alert('Failed to spend stat point on health');
    }
  };

  const handleSpendPointOnMana = async () => {
    try {
      const updatedStats = await spendStatPointOnMana(userId);
      setStats(updatedStats);
    } catch (error) {
      console.error('Failed to spend stat point:', error);
      alert('Failed to spend stat point on mana');
    }
  };

  const handleSpendPointOnStat = async (statName: 'strength' | 'intelligence' | 'dexterity' | 'charisma') => {
    try {
      const updatedStats = await spendStatPointOnStat(userId, statName);
      setStats(updatedStats);
    } catch (error) {
      console.error('Failed to spend stat point:', error);
      alert(`Failed to spend stat point on ${statName}`);
    }
  };

  const handleSpendPointOnAbility = async (abilityId: string) => {
    try {
      const updatedStats = await spendStatPointOnAbility(userId, abilityId);
      setStats(updatedStats);
      await loadCharacterData(); // Reload to update ability levels
    } catch (error) {
      console.error('Failed to spend stat point:', error);
      alert('Failed to spend stat point on ability');
    }
  };

  const handleUsePotion = async (consumableId: string) => {
    try {
      const updatedStats = await useConsumable(userId, consumableId);
      setStats(updatedStats);
      await loadCharacterData(); // Reload to update potion inventory
    } catch (error) {
      console.error('Failed to use potion:', error);
      alert(error instanceof Error ? error.message : 'Failed to use potion');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Character Sheet</h2>
            {stats && stats.statPointsAvailable > 0 && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                {stats.statPointsAvailable} Unspent Point{stats.statPointsAvailable !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900 border-b border-slate-700 flex">
          {(['stats', 'equipment', 'inventory', 'potions', 'abilities'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 text-orange-400 border-b-2 border-orange-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading character data...</div>
            </div>
          ) : (
            <>
              {activeTab === 'stats' && stats && (
                <StatsTab
                  stats={stats}
                  onSpendPointOnHealth={handleSpendPointOnHealth}
                  onSpendPointOnMana={handleSpendPointOnMana}
                  onSpendPointOnStat={handleSpendPointOnStat}
                />
              )}
              {activeTab === 'equipment' && equipment && (
                <EquipmentTab equipment={equipment} onUnequip={handleUnequipItem} />
              )}
              {activeTab === 'inventory' && (
                <InventoryTab inventory={inventory} onEquip={handleEquipItem} />
              )}
              {activeTab === 'potions' && stats && (
                <PotionsTab potions={potions} stats={stats} onUsePotion={handleUsePotion} />
              )}
              {activeTab === 'abilities' && (
                <AbilitiesTab
                  abilities={abilities}
                  stats={stats}
                  userId={userId}
                  onReload={loadCharacterData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Tab Component
function StatsTab({
  stats,
  onSpendPointOnHealth,
  onSpendPointOnMana,
  onSpendPointOnStat,
}: {
  stats: CharacterStats;
  onSpendPointOnHealth: () => void;
  onSpendPointOnMana: () => void;
  onSpendPointOnStat: (statName: 'strength' | 'intelligence' | 'dexterity' | 'charisma') => void;
}) {
  const hasPoints = stats.statPointsAvailable > 0;

  return (
    <div className="space-y-6">
      {/* Character Info */}
      <div className="bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Character Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-sm">Level</div>
            <div className="text-2xl font-bold text-white">{stats.level}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Stat Points Available</div>
            <div className="text-2xl font-bold text-orange-400">{stats.statPointsAvailable}</div>
          </div>
        </div>
      </div>

      {/* Spend Stat Points */}
      {hasPoints && (
        <div className="bg-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Spend Stat Points</h3>
          <div className="space-y-3">
            {/* Primary Stats */}
            <div>
              <div className="text-slate-400 text-sm mb-2">Primary Attributes (+1 each)</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSpendPointOnStat('strength')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  💪 +1 Strength
                </button>
                <button
                  onClick={() => onSpendPointOnStat('intelligence')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  🧠 +1 Intelligence
                </button>
                <button
                  onClick={() => onSpendPointOnStat('dexterity')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  ⚡ +1 Dexterity
                </button>
                <button
                  onClick={() => onSpendPointOnStat('charisma')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  ✨ +1 Charisma
                </button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="text-slate-400 text-sm mb-2">Resources (+5 each)</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSpendPointOnHealth}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  ❤️ +5 Max Health
                </button>
                <button
                  onClick={onSpendPointOnMana}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                >
                  💙 +5 Max Mana
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Stats */}
      <div className="bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Primary Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Strength" value={stats.strength} icon="💪" />
          <StatCard label="Intelligence" value={stats.intelligence} icon="🧠" />
          <StatCard label="Dexterity" value={stats.dexterity} icon="⚡" />
          <StatCard label="Charisma" value={stats.charisma} icon="✨" />
        </div>
      </div>

      {/* Health & Mana */}
      <div className="bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Health & Mana</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-sm mb-2">Health</div>
            <div className="bg-slate-800 rounded-full h-8 overflow-hidden">
              <div
                className="bg-green-500 h-full flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${(stats.currentHealth / stats.maxHealth) * 100}%` }}
              >
                {stats.currentHealth} / {stats.maxHealth}
              </div>
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-2">Mana</div>
            <div className="bg-slate-800 rounded-full h-8 overflow-hidden">
              <div
                className="bg-blue-500 h-full flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${(stats.currentMana / stats.maxMana) * 100}%` }}
              >
                {stats.currentMana} / {stats.maxMana}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Combat Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Base Damage" value={stats.baseDamage} icon="⚔️" />
          <StatCard label="Defense" value={stats.defense} icon="🛡️" />
          <StatCard label="Critical Chance" value={`${(stats.criticalChance * 100).toFixed(1)}%`} icon="💥" />
          <StatCard label="Dodge Chance" value={`${(stats.dodgeChance * 100).toFixed(1)}%`} icon="💨" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="text-slate-400 text-sm mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xl font-bold text-white">{value}</span>
      </div>
    </div>
  );
}

// Equipment Tab Component
function EquipmentTab({
  equipment,
  onUnequip,
}: {
  equipment: CharacterEquipmentWithDetails;
  onUnequip: (slot: string) => void;
}) {
  const slots = [
    { key: 'weapon', item: equipment.weapon, label: 'Weapon', icon: '⚔️' },
    { key: 'shield', item: equipment.shield, label: 'Shield', icon: '🛡️' },
    { key: 'helmet', item: equipment.helmet, label: 'Helmet', icon: '⛑️' },
    { key: 'chest', item: equipment.chest, label: 'Chest Armor', icon: '🦺' },
    { key: 'boots', item: equipment.boots, label: 'Boots', icon: '👢' },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legendary': return 'text-orange-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getBonusDisplay = (item: EquipmentItem) => {
    const bonuses = [];
    if (item.damageBonus > 0) bonuses.push(`⚔️ +${item.damageBonus} Damage`);
    if (item.defenseBonus > 0) bonuses.push(`🛡️ +${item.defenseBonus} Defense`);
    if (item.hpBonus > 0) bonuses.push(`❤️ +${item.hpBonus} HP`);
    if (item.manaBonus > 0) bonuses.push(`💙 +${item.manaBonus} Mana`);
    if (item.strengthBonus > 0) bonuses.push(`💪 +${item.strengthBonus} Strength`);
    if (item.intelligenceBonus > 0) bonuses.push(`🧠 +${item.intelligenceBonus} Intelligence`);
    if (item.dexterityBonus > 0) bonuses.push(`⚡ +${item.dexterityBonus} Dexterity`);
    if (item.criticalChanceBonus > 0) bonuses.push(`💥 +${(item.criticalChanceBonus * 100).toFixed(1)}% Crit`);
    if (item.dodgeChanceBonus > 0) bonuses.push(`💨 +${(item.dodgeChanceBonus * 100).toFixed(1)}% Dodge`);
    return bonuses;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Equipped Items</h3>
      <div className="grid grid-cols-1 gap-4">
        {slots.map((slot) => (
          <div key={slot.key} className="bg-slate-900 rounded-lg p-4 border-2 border-slate-700">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{slot.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 font-medium text-sm">{slot.label}</span>
                    {slot.item && (
                      <button
                        onClick={() => onUnequip(slot.key)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Unequip
                      </button>
                    )}
                  </div>
                  {slot.item ? (
                    <>
                      <div className={`font-bold text-lg mb-1 ${getTierColor(slot.item.tier)}`}>
                        {slot.item.name}
                      </div>
                      <div className="text-slate-400 text-sm mb-2">{slot.item.description}</div>
                      {getBonusDisplay(slot.item).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getBonusDisplay(slot.item).map((bonus, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-800 text-green-400 px-2 py-1 rounded"
                            >
                              {bonus}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-slate-600 italic">Empty Slot</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inventory Tab Component
function InventoryTab({
  inventory,
  onEquip,
}: {
  inventory: EquipmentInventoryItem[];
  onEquip: (item: EquipmentItem, slot: string) => void;
}) {
  // Use the item's slot field directly from the database
  const getSlotForItem = (item: EquipmentItem): string => {
    return item.slot;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legendary': return 'text-orange-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getBonusDisplay = (item: EquipmentItem) => {
    const bonuses = [];
    if (item.damageBonus > 0) bonuses.push(`⚔️ +${item.damageBonus} Damage`);
    if (item.defenseBonus > 0) bonuses.push(`🛡️ +${item.defenseBonus} Defense`);
    if (item.hpBonus > 0) bonuses.push(`❤️ +${item.hpBonus} HP`);
    if (item.manaBonus > 0) bonuses.push(`💙 +${item.manaBonus} Mana`);
    if (item.strengthBonus > 0) bonuses.push(`💪 +${item.strengthBonus} Strength`);
    if (item.intelligenceBonus > 0) bonuses.push(`🧠 +${item.intelligenceBonus} Intelligence`);
    if (item.dexterityBonus > 0) bonuses.push(`⚡ +${item.dexterityBonus} Dexterity`);
    if (item.criticalChanceBonus > 0) bonuses.push(`💥 +${(item.criticalChanceBonus * 100).toFixed(1)}% Crit`);
    if (item.dodgeChanceBonus > 0) bonuses.push(`💨 +${(item.dodgeChanceBonus * 100).toFixed(1)}% Dodge`);
    return bonuses;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Equipment Inventory</h3>
      {inventory.length === 0 ? (
        <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400">
          No equipment in inventory
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-lg p-4 border-2 border-slate-700 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className={`font-bold text-lg mb-1 ${getTierColor(item.equipment.tier)}`}>
                  {item.equipment.name}
                </div>
                <div className="text-slate-400 text-sm mb-2">{item.equipment.description}</div>
                <div className="text-slate-500 text-xs mb-2">
                  {item.equipment.tier.charAt(0).toUpperCase() + item.equipment.tier.slice(1)} | Level {item.equipment.requiredLevel}
                </div>
                {getBonusDisplay(item.equipment).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getBonusDisplay(item.equipment).map((bonus, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-800 text-green-400 px-2 py-1 rounded"
                      >
                        {bonus}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => onEquip(item.equipment, getSlotForItem(item.equipment))}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors whitespace-nowrap"
              >
                Equip
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Abilities Tab Component
function AbilitiesTab({
  abilities,
  stats,
  userId,
  onReload,
}: {
  abilities: AbilityWithUnlockStatus[];
  stats: CharacterStats | null;
  userId: number;
  onReload: () => void;
}) {
  const hasPoints = stats && stats.statPointsAvailable > 0;
  const activeAbilities = abilities.filter((a) => a.isActive).sort((a, b) => (a.activeSlot || 0) - (b.activeSlot || 0));
  const canUnlock = (ability: AbilityWithUnlockStatus) => {
    return stats && !ability.isUnlocked && stats.level >= ability.requiredLevel && hasPoints;
  };

  const handleUnlock = async (abilityId: string) => {
    try {
      await unlockAbility(userId, abilityId);
      await onReload();
    } catch (error) {
      console.error('Failed to unlock ability:', error);
      alert('Failed to unlock ability');
    }
  };

  const handleSetActive = async (abilityId: string, slot: number) => {
    try {
      await setActiveAbility(userId, abilityId, slot);
      await onReload();
    } catch (error) {
      console.error('Failed to set active ability:', error);
      alert('Failed to set active ability');
    }
  };

  const handleRemoveActive = async (slot: number) => {
    try {
      await removeActiveAbility(userId, slot);
      await onReload();
    } catch (error) {
      console.error('Failed to remove active ability:', error);
      alert('Failed to remove active ability');
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Ability Slots */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Active Abilities (Combat Loadout)</h3>
        <p className="text-slate-400 text-sm mb-4">
          Select up to 3 abilities to use in combat. Click an empty slot or an ability to equip it.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((slot) => {
            const activeAbility = activeAbilities.find((a) => a.activeSlot === slot);
            return (
              <div
                key={slot}
                className="bg-slate-900 rounded-lg p-4 border-2 border-slate-700 min-h-[100px]"
              >
                <div className="text-slate-500 text-xs font-semibold mb-2">SLOT {slot}</div>
                {activeAbility ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{activeAbility.icon}</span>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{activeAbility.name}</div>
                        <div className="text-xs text-slate-400">
                          {activeAbility.manaCost > 0 && `${activeAbility.manaCost} MP`}
                          {activeAbility.cooldownTurns > 0 && ` • ${activeAbility.cooldownTurns}T CD`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveActive(slot)}
                      className="text-red-400 hover:text-red-300 text-xs w-full text-center"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-600 text-sm text-center py-4">Empty Slot</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Abilities */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3">All Abilities</h3>
        <div className="space-y-2">
          {abilities.map((ability) => {
            const isLocked = !ability.isUnlocked;
            const meetsLevel = stats && stats.level >= ability.requiredLevel;
            const nextEmptySlot = activeAbilities.length < 3 ? activeAbilities.length + 1 : null;

            return (
              <div
                key={ability.id}
                className={`bg-slate-900 rounded-lg p-4 border-2 transition-all ${
                  isLocked
                    ? 'border-slate-800 opacity-60'
                    : ability.isActive
                    ? 'border-orange-500'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-3xl">{ability.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">{ability.name}</span>
                        {isLocked && (
                          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded">
                            🔒 Req. Level {ability.requiredLevel}
                          </span>
                        )}
                        {ability.isActive && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                            Slot {ability.activeSlot}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm mb-2">{ability.description}</div>
                      <div className="flex items-center gap-4 text-xs">
                        {ability.manaCost > 0 && (
                          <span className="text-blue-400">💙 {ability.manaCost} Mana</span>
                        )}
                        {ability.cooldownTurns > 0 && (
                          <span className="text-purple-400">⏱️ {ability.cooldownTurns} Turn CD</span>
                        )}
                        {ability.baseValue && (
                          <span className="text-orange-400">⚡ {ability.baseValue} Base</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {isLocked ? (
                      <button
                        onClick={() => handleUnlock(ability.id)}
                        disabled={!canUnlock(ability)}
                        className={`px-4 py-2 rounded font-medium transition-colors text-sm ${
                          canUnlock(ability)
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {meetsLevel ? 'Unlock' : `Level ${ability.requiredLevel}`}
                      </button>
                    ) : ability.isActive ? (
                      <button
                        onClick={() => handleRemoveActive(ability.activeSlot!)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                      >
                        Unequip
                      </button>
                    ) : nextEmptySlot ? (
                      <button
                        onClick={() => handleSetActive(ability.id, nextEmptySlot)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
                      >
                        Equip
                      </button>
                    ) : (
                      <div className="text-slate-500 text-xs text-center px-4 py-2">
                        All slots full
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Potions Tab Component
function PotionsTab({
  potions,
  stats,
  onUsePotion,
}: {
  potions: UserConsumableInventoryItem[];
  stats: CharacterStats;
  onUsePotion: (consumableId: string) => void;
}) {
  function getTierColor(tier: string): string {
    switch (tier) {
      case 'legendary': return 'text-orange-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }

  function canUsePotion(potion: UserConsumableInventoryItem): boolean {
    const consumable = potion.consumable;

    // Can't use health potion if at max health
    if (consumable.healthRestore > 0 && stats.currentHealth >= stats.maxHealth) {
      return false;
    }

    // Can't use mana potion if at max mana
    if (consumable.manaRestore > 0 && stats.currentMana >= stats.maxMana) {
      return false;
    }

    return true;
  }

  function getUseButtonText(potion: UserConsumableInventoryItem): string {
    const consumable = potion.consumable;

    if (consumable.healthRestore > 0 && stats.currentHealth >= stats.maxHealth) {
      return 'Health Full';
    }

    if (consumable.manaRestore > 0 && stats.currentMana >= stats.maxMana) {
      return 'Mana Full';
    }

    return 'Use';
  }

  if (potions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🧪</div>
        <p className="text-slate-400 text-center">
          No potions in inventory
          <br />
          <span className="text-sm">Visit the shop to purchase potions</span>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {potions.map((potion) => {
          const consumable = potion.consumable;
          const canUse = canUsePotion(potion);

          return (
            <div
              key={potion.id}
              className="bg-slate-700 border-2 border-slate-600 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{consumable.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${getTierColor(consumable.tier)}`}>
                      {consumable.name}
                    </h3>
                    <span className="text-sm text-gray-400">x{potion.quantity}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase mb-2">{consumable.tier}</p>
                  <p className="text-sm text-gray-300 mb-3">{consumable.description}</p>

                  {/* Effects */}
                  <div className="space-y-1 mb-3">
                    {consumable.healthRestore > 0 && (
                      <div className="text-sm text-green-400">
                        ❤️ {consumable.healthRestore === 999 ? 'Fully restores health' : `Restores ${consumable.healthRestore} HP`}
                      </div>
                    )}
                    {consumable.manaRestore > 0 && (
                      <div className="text-sm text-blue-400">
                        💙 {consumable.manaRestore === 999 ? 'Fully restores mana' : `Restores ${consumable.manaRestore} Mana`}
                      </div>
                    )}
                    {consumable.buffType && (
                      <div className="text-sm text-purple-400">
                        ⚡ +{consumable.buffValue} {consumable.buffType} ({consumable.buffDurationTurns} turns)
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onUsePotion(consumable.id)}
                    disabled={!canUse}
                    className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                      canUse
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-slate-600 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {getUseButtonText(potion)}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
