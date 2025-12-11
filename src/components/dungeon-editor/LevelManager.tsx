import React, { useState, useEffect } from 'react';
import { invoke } from '@/lib/tauri';
import { LevelListItem, DungeonLevel } from '../../types/dungeonEditor';

interface LevelManagerProps {
  onLoadLevel: (level: DungeonLevel) => void;
  onClose: () => void;
}

export const LevelManager: React.FC<LevelManagerProps> = ({ onLoadLevel, onClose }) => {
  const [levels, setLevels] = useState<LevelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const levelList = await invoke<LevelListItem[]>('list_dungeon_levels');
      setLevels(levelList);
    } catch (err) {
      setError(err as string);
      console.error('Failed to load levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLevel = async (levelId: string) => {
    try {
      const level = await invoke<DungeonLevel>('load_dungeon_level', { levelId });
      onLoadLevel(level);
      onClose();
    } catch (err) {
      alert('Failed to load level: ' + err);
    }
  };

  const handleDeleteLevel = async (levelId: string, levelName: string) => {
    if (!confirm(`Are you sure you want to delete "${levelName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await invoke('delete_dungeon_level', { levelId });
      await loadLevels();
    } catch (err) {
      alert('Failed to delete level: ' + err);
    }
  };

  const handleDuplicateLevel = async (levelId: string, levelName: string) => {
    const newName = prompt('Enter name for the duplicated level:', `${levelName} (Copy)`);
    if (!newName) return;

    try {
      await invoke('duplicate_dungeon_level', { levelId, newName });
      await loadLevels();
    } catch (err) {
      alert('Failed to duplicate level: ' + err);
    }
  };

  const handleExportLevel = async (levelId: string) => {
    try {
      const level = await invoke<DungeonLevel>('load_dungeon_level', { levelId });
      const json = JSON.stringify(level, null, 2);

      // Create a download link
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${level.metadata.name.replace(/[^a-z0-9]/gi, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export level: ' + err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-orange-400',
      deadly: 'text-red-400',
    };
    return colors[difficulty] || 'text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📚</span>
            Level Manager
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Loading levels...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-400">
            <p>Error: {error}</p>
          </div>
        ) : levels.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">🗺️</p>
              <p>No levels created yet</p>
              <p className="text-sm mt-2">Create your first level to get started!</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {levels.map((level) => (
                <div
                  key={level.id}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {level.name}
                        </h3>
                        {level.isPublished && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{level.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-400">
                          Level {level.recommendedLevel}
                        </span>
                        <span className={getDifficultyColor(level.difficulty)}>
                          {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                        </span>
                        <span className="text-gray-500">
                          Updated: {new Date(level.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleLoadLevel(level.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        📂 Load
                      </button>
                      <button
                        onClick={() => handleDuplicateLevel(level.id, level.name)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        📋 Duplicate
                      </button>
                      <button
                        onClick={() => handleExportLevel(level.id)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        💾 Export
                      </button>
                      <button
                        onClick={() => handleDeleteLevel(level.id, level.name)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
