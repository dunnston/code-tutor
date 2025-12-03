import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CustomEnemy, EnemyListItem } from '../../types/customEnemies';
import { EnemyEditor } from './EnemyEditor';

interface EnemyManagerProps {
  onClose: () => void;
  onSelectEnemy?: (enemy: EnemyListItem) => void; // Optional: for selecting enemies in nodes
}

export const EnemyManager: React.FC<EnemyManagerProps> = ({ onClose, onSelectEnemy }) => {
  const [enemies, setEnemies] = useState<EnemyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEnemy, setEditingEnemy] = useState<CustomEnemy | null>(null);
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    loadEnemies();
  }, [filterType]);

  const loadEnemies = async () => {
    try {
      setLoading(true);
      const typeFilter = filterType === '' ? null : filterType;
      const loadedEnemies: EnemyListItem[] = await invoke('list_custom_enemies', {
        enemyTypeFilter: typeFilter,
      });
      setEnemies(loadedEnemies);
    } catch (error) {
      console.error('Failed to load enemies:', error);
      alert('Failed to load enemies: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingEnemy(null);
    setShowEditor(true);
  };

  const handleEdit = async (enemyId: string) => {
    try {
      const enemy: CustomEnemy = await invoke('load_custom_enemy', { enemyId });
      // Convert attacks from JSON string to array
      const enemyData = {
        ...enemy,
        attacks: JSON.parse(enemy.attacks),
        attackAnimation: enemy.attackAnimation ? JSON.parse(enemy.attackAnimation) : undefined,
      };
      setEditingEnemy(enemyData);
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to load enemy:', error);
      alert('Failed to load enemy: ' + error);
    }
  };

  const handleSave = async (enemy: CustomEnemy) => {
    try {
      // Convert attacks array and attackAnimation to JSON strings for backend
      const enemyToSave = {
        ...enemy,
        attacks: JSON.stringify(enemy.attacks),
        attackAnimation: enemy.attackAnimation ? JSON.stringify(enemy.attackAnimation) : null,
      };

      await invoke('save_custom_enemy', { enemy: enemyToSave });
      setShowEditor(false);
      setEditingEnemy(null);
      loadEnemies();
      alert('✅ Enemy saved successfully!');
    } catch (error) {
      console.error('Failed to save enemy:', error);
      alert('❌ Failed to save enemy: ' + error);
    }
  };

  const handleDelete = async (enemyId: string, enemyName: string) => {
    if (!confirm(`Delete "${enemyName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await invoke('delete_custom_enemy', { enemyId });
      loadEnemies();
      alert('✅ Enemy deleted successfully!');
    } catch (error) {
      console.error('Failed to delete enemy:', error);
      alert('❌ Failed to delete enemy: ' + error);
    }
  };

  const handleDuplicate = async (enemyId: string, enemyName: string) => {
    const newName = prompt(`Enter name for duplicate:`, `${enemyName} (Copy)`);
    if (!newName) return;

    try {
      await invoke('duplicate_custom_enemy', { enemyId, newName });
      loadEnemies();
      alert('✅ Enemy duplicated successfully!');
    } catch (error) {
      console.error('Failed to duplicate enemy:', error);
      alert('❌ Failed to duplicate enemy: ' + error);
    }
  };

  if (showEditor) {
    return (
      <EnemyEditor
        enemy={editingEnemy}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false);
          setEditingEnemy(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👹</span>
            Enemy Manager
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Create Enemy
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
            <label className="text-sm text-gray-400">Filter by type:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('regular')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'regular'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => setFilterType('elite')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'elite'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Elite
              </button>
              <button
                onClick={() => setFilterType('boss')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'boss'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Boss
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <p className="text-gray-400 text-center">Loading enemies...</p>
          ) : enemies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No enemies found. Create your first enemy!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500
                           transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">{enemy.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded mr-2 ${
                            enemy.enemyType === 'boss'
                              ? 'bg-red-600'
                              : enemy.enemyType === 'elite'
                              ? 'bg-purple-600'
                              : 'bg-slate-600'
                          }`}
                        >
                          {enemy.enemyType}
                        </span>
                        Level {enemy.level}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded p-2 mb-3">
                    <div className="text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Health:</span>
                        <span className="text-white font-semibold">{enemy.baseHealth}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {onSelectEnemy && (
                      <button
                        onClick={() => {
                          onSelectEnemy(enemy);
                          onClose();
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded
                                 transition-colors text-sm"
                      >
                        Select
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(enemy.id)}
                      className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded
                               transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(enemy.id, enemy.name)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded
                               transition-colors text-sm"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(enemy.id, enemy.name)}
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
