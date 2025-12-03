import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface LevelListItem {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;
  difficulty: string;
  isPublished: boolean;
  updatedAt: string;
}

interface LevelSequencerProps {
  onClose: () => void;
}

export const LevelSequencer: React.FC<LevelSequencerProps> = ({ onClose }) => {
  const [allLevels, setAllLevels] = useState<LevelListItem[]>([]);
  const [sequencedLevels, setSequencedLevels] = useState<LevelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const all: LevelListItem[] = await invoke('list_dungeon_levels');
      const sequenced: LevelListItem[] = await invoke('get_levels_in_sequence');

      setAllLevels(all);
      setSequencedLevels(sequenced);
    } catch (error) {
      console.error('Failed to load levels:', error);
      alert('Failed to load levels: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSequence = [...sequencedLevels];
    const draggedItem = newSequence[draggedIndex];
    newSequence.splice(draggedIndex, 1);
    newSequence.splice(index, 0, draggedItem);

    setSequencedLevels(newSequence);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const addToSequence = (level: LevelListItem) => {
    if (!sequencedLevels.find((l) => l.id === level.id)) {
      setSequencedLevels([...sequencedLevels, level]);
    }
  };

  const removeFromSequence = (levelId: string) => {
    setSequencedLevels(sequencedLevels.filter((l) => l.id !== levelId));
  };

  const handleSave = async () => {
    try {
      // Create array of (level_id, sequence_order) tuples
      const sequences: [string, number][] = sequencedLevels.map((level, index) => [
        level.id,
        index + 1,
      ]);

      await invoke('update_level_sequence', { levelSequences: sequences });
      alert('✅ Level sequence saved successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save sequence:', error);
      alert('❌ Failed to save sequence: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-900 rounded-lg border-2 border-slate-700 p-8">
          <p className="text-white text-lg">Loading levels...</p>
        </div>
      </div>
    );
  }

  const availableLevels = allLevels.filter(
    (level) => !sequencedLevels.find((s) => s.id === level.id)
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔢</span>
            Level Sequencing
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Save Sequence
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-4">
          <p className="text-sm text-gray-300">
            <strong>Instructions:</strong> Drag and drop levels in the right panel to set the order.
            Players will progress through levels in this sequence. Add levels from the left panel.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Available Levels (Left) */}
          <div className="w-1/2 border-r border-slate-700 p-4 overflow-auto">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>📚</span>
              Available Levels
            </h3>
            {availableLevels.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                All levels have been added to the sequence
              </p>
            ) : (
              <div className="space-y-2">
                {availableLevels.map((level) => (
                  <div
                    key={level.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-700
                             transition-colors cursor-pointer"
                    onClick={() => addToSequence(level)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-white">{level.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Level {level.recommendedLevel} • {level.difficulty}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToSequence(level);
                        }}
                        className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                      >
                        Add →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sequenced Levels (Right) */}
          <div className="w-1/2 p-4 overflow-auto">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>🎯</span>
              Campaign Sequence ({sequencedLevels.length})
            </h3>
            {sequencedLevels.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                Click levels from the left panel to add them to the sequence
              </p>
            ) : (
              <div className="space-y-2">
                {sequencedLevels.map((level, index) => (
                  <div
                    key={level.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-slate-800 border-2 border-slate-700 rounded-lg p-3
                             transition-all cursor-move hover:border-blue-500
                             ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center
                                    justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{level.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Level {level.recommendedLevel} • {level.difficulty}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromSequence(level.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
