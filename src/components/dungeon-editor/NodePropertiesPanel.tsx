import React, { useState, useEffect } from 'react';
import {
  DungeonNode,
  DungeonNodeData,
  DungeonNodeType,
  CombatNodeData,
  ChoiceNodeData,
  AbilityCheckNodeData,
  TrapNodeData,
  LootNodeData,
  LootItem,
  StoryNodeData,
  BossNodeData,
  EndNodeData,
  StartNodeData,
  EnemyType,
  ItemType,
  AbilityType,
  Difficulty,
} from '../../types/dungeonEditor';
import { ItemManager } from './ItemManager';
import { invoke } from '@/lib/tauri';

// Enemy list item from database
interface EnemyListItem {
  id: string;
  name: string;
  enemy_type: 'regular' | 'elite' | 'boss';
  level: number;
}

interface NodePropertiesPanelProps {
  selectedNode: DungeonNode | null;
  onUpdateNode: (nodeId: string, data: Partial<DungeonNodeData>) => void;
  onDeleteNode: () => void;
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-slate-800 border-l border-slate-700 p-4">
        <div className="text-center text-gray-400 mt-8">
          <p className="text-4xl mb-2">📝</p>
          <p className="text-sm">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, { [field]: value });
  };

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">Node Properties</h2>
          <button
            onClick={onDeleteNode}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg
                     transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
        <div className="text-xs text-gray-400 uppercase font-semibold">
          {selectedNode.data.nodeType}
        </div>
      </div>

      {/* Common Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateField('label', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg
                     text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedNode.data.description !== undefined && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg
                       text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Type-Specific Fields */}
      <div className="border-t border-slate-700 pt-4">
        {renderTypeSpecificFields(selectedNode, updateField)}
      </div>
    </div>
  );
};

// Type-specific field renderers
function renderTypeSpecificFields(
  node: DungeonNode,
  updateField: (field: string, value: any) => void
) {
  switch (node.data.nodeType) {
    case DungeonNodeType.START:
      return <StartNodeFields data={node.data as StartNodeData} updateField={updateField} />;
    case DungeonNodeType.COMBAT:
      return <CombatNodeFields data={node.data as CombatNodeData} updateField={updateField} />;
    case DungeonNodeType.CHOICE:
      return <ChoiceNodeFields data={node.data as ChoiceNodeData} updateField={updateField} />;
    case DungeonNodeType.ABILITY_CHECK:
      return <AbilityCheckNodeFields data={node.data as AbilityCheckNodeData} updateField={updateField} />;
    case DungeonNodeType.TRAP:
      return <TrapNodeFields data={node.data as TrapNodeData} updateField={updateField} />;
    case DungeonNodeType.LOOT:
      return <LootNodeFields data={node.data as LootNodeData} updateField={updateField} />;
    case DungeonNodeType.STORY:
      return <StoryNodeFields data={node.data as StoryNodeData} updateField={updateField} />;
    case DungeonNodeType.BOSS:
      return <BossNodeFields data={node.data as BossNodeData} updateField={updateField} />;
    case DungeonNodeType.END:
      return <EndNodeFields data={node.data as EndNodeData} updateField={updateField} />;
    default:
      return null;
  }
}

// Individual field components for each node type

const StartNodeFields: React.FC<{ data: StartNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">Welcome Message</label>
    <textarea
      value={data.welcomeMessage || ''}
      onChange={(e) => updateField('welcomeMessage', e.target.value)}
      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
      rows={3}
    />
  </div>
);

const CombatNodeFields: React.FC<{ data: CombatNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => {
  const [availableEnemies, setAvailableEnemies] = useState<EnemyListItem[]>([]);
  const [isLoadingEnemies, setIsLoadingEnemies] = useState(true);

  useEffect(() => {
    const loadEnemies = async () => {
      try {
        const enemies: EnemyListItem[] = await invoke('list_custom_enemies', {
          enemyTypeFilter: null, // Get all enemy types
        });
        setAvailableEnemies(enemies);
      } catch (error) {
        console.error('Failed to load enemies:', error);
      } finally {
        setIsLoadingEnemies(false);
      }
    };
    loadEnemies();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
        <select
          value={data.difficulty}
          onChange={(e) => updateField('difficulty', e.target.value as Difficulty)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="deadly">Deadly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Reward XP</label>
          <input
            type="number"
            value={data.rewardXp}
            onChange={(e) => updateField('rewardXp', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Reward Gold</label>
          <input
            type="number"
            value={data.rewardGold}
            onChange={(e) => updateField('rewardGold', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Enemies</label>
        {isLoadingEnemies ? (
          <div className="text-gray-400 text-xs py-2">Loading enemies...</div>
        ) : availableEnemies.length === 0 ? (
          <div className="text-yellow-400 text-xs py-2">
            No enemies available. Create enemies in the Enemy Manager first.
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-2">
              {data.enemies.map((enemy, index) => {
                const selectedEnemy = availableEnemies.find(e => e.id === enemy.customEnemyId);

                return (
                  <div key={index} className="flex gap-2 items-center bg-slate-900 p-2 rounded">
                    <select
                      value={enemy.customEnemyId || ''}
                      onChange={(e) => {
                        const newEnemies = [...data.enemies];
                        newEnemies[index].customEnemyId = e.target.value;
                        // Clear legacy type field
                        delete newEnemies[index].type;
                        updateField('enemies', newEnemies);
                      }}
                      className="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                    >
                      <option value="">Select Enemy...</option>
                      {availableEnemies.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} (Lv{e.level} {e.enemy_type})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={enemy.count}
                      onChange={(e) => {
                        const newEnemies = [...data.enemies];
                        newEnemies[index].count = parseInt(e.target.value) || 1;
                        updateField('enemies', newEnemies);
                      }}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                      min="1"
                      placeholder="Qty"
                      title="Quantity"
                    />
                    <input
                      type="number"
                      value={enemy.level}
                      placeholder="Lvl"
                      onChange={(e) => {
                        const newEnemies = [...data.enemies];
                        newEnemies[index].level = parseInt(e.target.value) || 1;
                        updateField('enemies', newEnemies);
                      }}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                      min="1"
                      title="Level Override"
                    />
                    <button
                      onClick={() => {
                        const newEnemies = data.enemies.filter((_, i) => i !== index);
                        updateField('enemies', newEnemies);
                      }}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                updateField('enemies', [...data.enemies, { customEnemyId: availableEnemies[0]?.id || '', count: 1, level: 1 }]);
              }}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
              disabled={availableEnemies.length === 0}
            >
              + Add Enemy
            </button>
          </>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Flavor Text</label>
        <textarea
          value={data.flavorText || ''}
          onChange={(e) => updateField('flavorText', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          rows={2}
        />
      </div>
    </div>
  );
};

const ChoiceNodeFields: React.FC<{ data: ChoiceNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Prompt</label>
      <textarea
        value={data.prompt}
        onChange={(e) => updateField('prompt', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        rows={2}
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-2">Options</label>
      <div className="space-y-2 mb-2">
        {data.options.map((option, index) => (
          <div key={option.id} className="bg-slate-900 p-2 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Option {index + 1}</span>
              <button
                onClick={() => {
                  const newOptions = data.options.filter((_, i) => i !== index);
                  updateField('options', newOptions);
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={option.text}
              onChange={(e) => {
                const newOptions = [...data.options];
                newOptions[index].text = e.target.value;
                updateField('options', newOptions);
              }}
              placeholder="Choice text"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            />
            <input
              type="text"
              value={option.resultText || ''}
              onChange={(e) => {
                const newOptions = [...data.options];
                newOptions[index].resultText = e.target.value;
                updateField('options', newOptions);
              }}
              placeholder="Result text (optional)"
              className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          updateField('options', [
            ...data.options,
            { id: crypto.randomUUID(), text: 'New choice', resultText: '' },
          ]);
        }}
        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
      >
        + Add Option
      </button>
    </div>
  </div>
);

const AbilityCheckNodeFields: React.FC<{ data: AbilityCheckNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Ability</label>
        <select
          value={data.ability}
          onChange={(e) => updateField('ability', e.target.value as AbilityType)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        >
          {Object.values(AbilityType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">DC</label>
        <input
          type="number"
          value={data.dc}
          onChange={(e) => updateField('dc', parseInt(e.target.value) || 10)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          min="1"
        />
      </div>
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">Success Text</label>
      <textarea
        value={data.successText}
        onChange={(e) => updateField('successText', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        rows={2}
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">Failure Text</label>
      <textarea
        value={data.failureText}
        onChange={(e) => updateField('failureText', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        rows={2}
      />
    </div>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={data.allowRetry}
        onChange={(e) => updateField('allowRetry', e.target.checked)}
        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
      />
      <span className="text-sm text-gray-300">Allow Retry</span>
    </label>

    <div className="border-t border-slate-700 pt-4">
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={data.useMcq || false}
          onChange={(e) => updateField('useMcq', e.target.checked)}
          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
        />
        <span className="text-sm text-gray-300">Use MCQ Question</span>
      </label>

      {data.useMcq && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">MCQ Question ID (Optional)</label>
          <input
            type="text"
            value={data.mcqQuestionId || ''}
            onChange={(e) => updateField('mcqQuestionId', e.target.value)}
            placeholder="Leave empty for random question"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Correct = +[stat value], Incorrect = -2. Leave ID empty to select random question from database.
          </p>
        </div>
      )}
    </div>
  </div>
);

const TrapNodeFields: React.FC<{ data: TrapNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Trap Type</label>
      <input
        type="text"
        value={data.trapType}
        onChange={(e) => updateField('trapType', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">Damage</label>
      <input
        type="number"
        value={data.damage}
        onChange={(e) => updateField('damage', parseInt(e.target.value) || 0)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-2">Avoid Check (Optional)</label>
      {data.avoidCheck ? (
        <div className="bg-slate-900 p-2 rounded space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={data.avoidCheck.ability}
              onChange={(e) =>
                updateField('avoidCheck', {
                  ...data.avoidCheck,
                  ability: e.target.value as AbilityType,
                })
              }
              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            >
              {Object.values(AbilityType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={data.avoidCheck.dc}
              onChange={(e) =>
                updateField('avoidCheck', {
                  ...data.avoidCheck,
                  dc: parseInt(e.target.value) || 10,
                })
              }
              placeholder="DC"
              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            />
          </div>
          <button
            onClick={() => updateField('avoidCheck', undefined)}
            className="w-full px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
          >
            Remove Check
          </button>
        </div>
      ) : (
        <button
          onClick={() => updateField('avoidCheck', { ability: 'DEX' as AbilityType, dc: 10 })}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
        >
          + Add Avoid Check
        </button>
      )}
    </div>
  </div>
);

const LootNodeFields: React.FC<{ data: LootNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => {
  const [showItemSelector, setShowItemSelector] = useState(false);

  // Migrate old-format items to new format (backward compatibility)
  const migratedItems = data.items.map((item) => {
    if (!item.itemSource) {
      // Old format - convert to custom item
      return {
        ...item,
        itemSource: 'custom' as const,
      };
    }
    return item;
  });

  // Auto-migrate if needed
  if (migratedItems.some((item, i) => item !== data.items[i])) {
    setTimeout(() => updateField('items', migratedItems), 0);
  }

  const handleSelectItem = (item: LootItem) => {
    updateField('items', [...migratedItems, item]);
  };

  const handleUpdateItem = (index: number, updates: Partial<LootItem>) => {
    const newItems = [...migratedItems];
    newItems[index] = { ...newItems[index], ...updates };
    updateField('items', newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = migratedItems.filter((_, i) => i !== index);
    updateField('items', newItems);
  };


  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Gold</label>
            <input
              type="number"
              value={data.gold}
              onChange={(e) => updateField('gold', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">XP</label>
            <input
              type="number"
              value={data.xp}
              onChange={(e) => updateField('xp', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">Items</label>
          <div className="space-y-2 mb-2">
            {migratedItems.map((item, index) => (
              <div key={index} className="bg-slate-900 p-3 rounded space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm mb-1">{item.name}</div>
                    {item.description && (
                      <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                    min="1"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowItemSelector(true)}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded flex items-center justify-center gap-1"
          >
            <span>➕</span>
            Add Item
          </button>
        </div>
      </div>

      {showItemSelector && (
        <ItemManager
          onClose={() => setShowItemSelector(false)}
          onSelectItem={(item) => {
            // Convert LootItemOption to LootItem
            const lootItem: LootItem = {
              itemSource: 'database',
              itemId: item.id,
              itemCategory: item.category as 'equipment' | 'consumable',
              type: item.itemType?.includes('potion') ? ItemType.POTION :
                    item.itemType === 'scroll' ? ItemType.SCROLL :
                    item.category === 'equipment' && item.itemType === 'weapon' ? ItemType.WEAPON :
                    item.category === 'equipment' ? ItemType.ARMOR : ItemType.SCROLL,
              name: item.name,
              quantity: 1,
              description: item.description || undefined,
            };
            handleSelectItem(lootItem);
          }}
        />
      )}
    </>
  );
};

const StoryNodeFields: React.FC<{ data: StoryNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Story Text</label>
      <textarea
        value={data.storyText}
        onChange={(e) => updateField('storyText', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        rows={4}
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">Image URL (Optional)</label>
      <input
        type="text"
        value={data.imageUrl || ''}
        onChange={(e) => updateField('imageUrl', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
      />
    </div>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={data.autoProgress || false}
        onChange={(e) => updateField('autoProgress', e.target.checked)}
        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600"
      />
      <span className="text-sm text-gray-300">Auto-Progress</span>
    </label>
  </div>
);

const BossNodeFields: React.FC<{ data: BossNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => {
  const [availableEnemies, setAvailableEnemies] = useState<EnemyListItem[]>([]);
  const [isLoadingEnemies, setIsLoadingEnemies] = useState(true);

  useEffect(() => {
    const loadEnemies = async () => {
      try {
        // Load boss and elite enemies for boss nodes
        const enemies: EnemyListItem[] = await invoke('list_custom_enemies', {
          enemyTypeFilter: null, // Get all, user can filter
        });
        setAvailableEnemies(enemies);
      } catch (error) {
        console.error('Failed to load enemies:', error);
      } finally {
        setIsLoadingEnemies(false);
      }
    };
    loadEnemies();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Boss Name</label>
        <input
          type="text"
          value={data.bossName}
          onChange={(e) => updateField('bossName', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Select Boss Enemy</label>
        {isLoadingEnemies ? (
          <div className="text-gray-400 text-xs py-2">Loading enemies...</div>
        ) : availableEnemies.length === 0 ? (
          <div className="text-yellow-400 text-xs py-2">
            No enemies available. Create enemies in the Enemy Manager first.
          </div>
        ) : (
          <select
            value={data.customEnemyId || ''}
            onChange={(e) => {
              const selectedEnemy = availableEnemies.find(enemy => enemy.id === e.target.value);
              updateField('customEnemyId', e.target.value);
              // Clear legacy bossType field
              updateField('bossType', undefined);
              // Auto-fill boss name if it's empty or matches the old type
              if (!data.bossName || data.bossName === 'Boss Name') {
                updateField('bossName', selectedEnemy?.name || 'Boss');
              }
            }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          >
            <option value="">Select Enemy...</option>
            {availableEnemies.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} (Lv{e.level} {e.enemy_type})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Level</label>
          <input
            type="number"
            value={data.bossLevel}
            onChange={(e) => updateField('bossLevel', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            min="1"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Health</label>
          <input
            type="number"
            value={data.health}
            onChange={(e) => updateField('health', parseInt(e.target.value) || 100)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Reward XP</label>
          <input
            type="number"
            value={data.rewardXp}
            onChange={(e) => updateField('rewardXp', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Reward Gold</label>
          <input
            type="number"
            value={data.rewardGold}
            onChange={(e) => updateField('rewardGold', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Flavor Text</label>
        <textarea
          value={data.flavorText}
          onChange={(e) => updateField('flavorText', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Abilities (comma-separated)</label>
        <input
          type="text"
          value={data.abilities.join(', ')}
          onChange={(e) => updateField('abilities', e.target.value.split(',').map((s) => s.trim()))}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        />
      </div>
    </div>
  );
};

const EndNodeFields: React.FC<{ data: EndNodeData; updateField: (field: string, value: any) => void }> = ({ data, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Completion Message</label>
      <textarea
        value={data.completionMessage}
        onChange={(e) => updateField('completionMessage', e.target.value)}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
        rows={3}
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-2">Final Rewards</label>
      {data.finalRewards ? (
        <div className="bg-slate-900 p-2 rounded space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={data.finalRewards.xp}
              onChange={(e) =>
                updateField('finalRewards', {
                  ...data.finalRewards!,
                  xp: parseInt(e.target.value) || 0,
                })
              }
              placeholder="XP"
              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            />
            <input
              type="number"
              value={data.finalRewards.gold}
              onChange={(e) =>
                updateField('finalRewards', {
                  ...data.finalRewards!,
                  gold: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Gold"
              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs"
            />
          </div>
          <button
            onClick={() => updateField('finalRewards', undefined)}
            className="w-full px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
          >
            Remove Rewards
          </button>
        </div>
      ) : (
        <button
          onClick={() => updateField('finalRewards', { xp: 100, gold: 50, items: [] })}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
        >
          + Add Final Rewards
        </button>
      )}
    </div>
  </div>
);
