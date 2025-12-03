import React, { useState } from 'react';
import { CustomEnemy, EnemyTypeCategory, EnemyAttack } from '../../types/customEnemies';

interface EnemyEditorProps {
  enemy: CustomEnemy | null;
  onSave: (enemy: CustomEnemy) => void;
  onCancel: () => void;
}

export const EnemyEditor: React.FC<EnemyEditorProps> = ({ enemy, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CustomEnemy>(
    enemy || {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      enemyType: EnemyTypeCategory.REGULAR,
      level: 1,
      baseHealth: 50,
      baseAttack: 10,
      baseDefense: 5,
      imagePath: '/enemies/placeholder.png',
      attacks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [currentAttack, setCurrentAttack] = useState<EnemyAttack>({
    name: '',
    damage: 0,
    description: '',
  });

  const handleAddAttack = () => {
    if (!currentAttack.name || currentAttack.damage <= 0) {
      alert('Please enter a valid attack name and damage');
      return;
    }

    setFormData({
      ...formData,
      attacks: [...formData.attacks, { ...currentAttack }],
    });

    setCurrentAttack({ name: '', damage: 0, description: '' });
  };

  const handleRemoveAttack = (index: number) => {
    setFormData({
      ...formData,
      attacks: formData.attacks.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Please enter an enemy name');
      return;
    }

    if (formData.attacks.length === 0) {
      alert('Please add at least one attack');
      return;
    }

    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👹</span>
            {enemy ? 'Edit Enemy' : 'Create New Enemy'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-3">Basic Information</h3>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Enemy Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fire Goblin"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe this enemy..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select
                    value={formData.enemyType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enemyType: e.target.value as EnemyTypeCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={EnemyTypeCategory.REGULAR}>Regular</option>
                    <option value={EnemyTypeCategory.ELITE}>Elite</option>
                    <option value={EnemyTypeCategory.BOSS}>Boss</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Level</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Image Path</label>
                <input
                  type="text"
                  value={formData.imagePath}
                  onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/enemies/goblin.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Path to enemy sprite/image (relative to assets folder)
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Attack Animation (GIF)</label>
                <input
                  type="text"
                  value={formData.attackAnimation?.path || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attackAnimation: e.target.value
                        ? { type: 'gif', path: e.target.value, loop: false }
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/animations/goblin-slash.gif"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Path to attack animation GIF (shown when enemy attacks)
                </p>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 pt-4">Stats</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Health</label>
                  <input
                    type="number"
                    value={formData.baseHealth}
                    onChange={(e) =>
                      setFormData({ ...formData, baseHealth: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Attack</label>
                  <input
                    type="number"
                    value={formData.baseAttack}
                    onChange={(e) =>
                      setFormData({ ...formData, baseAttack: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Defense</label>
                  <input
                    type="number"
                    value={formData.baseDefense}
                    onChange={(e) =>
                      setFormData({ ...formData, baseDefense: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Attacks */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-3">Attacks</h3>

              {/* Attack List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.attacks.map((attack, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {attack.name}
                          <span className="text-xs bg-red-600 px-2 py-0.5 rounded">
                            {attack.damage} DMG
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{attack.description}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttack(index)}
                        className="text-red-500 hover:text-red-400 text-sm ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {formData.attacks.length === 0 && (
                  <p className="text-gray-400 text-sm italic">No attacks added yet</p>
                )}
              </div>

              {/* Add Attack Form */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-3">Add New Attack</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Attack Name</label>
                    <input
                      type="text"
                      value={currentAttack.name}
                      onChange={(e) =>
                        setCurrentAttack({ ...currentAttack, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Fireball"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Damage</label>
                    <input
                      type="number"
                      value={currentAttack.damage}
                      onChange={(e) =>
                        setCurrentAttack({
                          ...currentAttack,
                          damage: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Description</label>
                    <textarea
                      value={currentAttack.description}
                      onChange={(e) =>
                        setCurrentAttack({ ...currentAttack, description: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Describe the attack..."
                    />
                  </div>

                  <button
                    onClick={handleAddAttack}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg
                             transition-colors text-sm font-medium"
                  >
                    Add Attack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
