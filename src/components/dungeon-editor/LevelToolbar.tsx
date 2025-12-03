import React, { useState } from 'react';
import { LevelMetadata, Difficulty } from '../../types/dungeonEditor';

interface LevelToolbarProps {
  levelMetadata: LevelMetadata;
  onUpdateMetadata: (metadata: LevelMetadata) => void;
  onNew: () => void;
  onSave: () => void;
  onLoad?: () => void;
  onValidate: () => void;
  onClose?: () => void;
  onPlayLevel?: () => void;
  onSequenceLevels?: () => void;
  onManageEnemies?: () => void;
  onManageQuestions?: () => void;
  onManageItems?: () => void;
}

export const LevelToolbar: React.FC<LevelToolbarProps> = ({
  levelMetadata,
  onUpdateMetadata,
  onNew,
  onSave,
  onLoad,
  onValidate,
  onClose,
  onPlayLevel,
  onSequenceLevels,
  onManageEnemies,
  onManageQuestions,
  onManageItems,
}) => {
  const [showMetadataEdit, setShowMetadataEdit] = useState(false);

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Level Info */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🗺️</span>
            Dungeon Editor
          </h1>
          <div className="h-6 w-px bg-slate-700"></div>
          <button
            onClick={() => setShowMetadataEdit(!showMetadataEdit)}
            className="text-left hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
          >
            <div className="text-sm font-semibold text-white">{levelMetadata.name}</div>
            <div className="text-xs text-gray-400">
              Level {levelMetadata.recommendedLevel} • {levelMetadata.difficulty}
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                     transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span>➕</span>
            New
          </button>
          {onLoad && (
            <button
              onClick={onLoad}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>📂</span>
              Load
            </button>
          )}
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                     transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span>💾</span>
            Save
          </button>
          {onManageEnemies && (
            <button
              onClick={onManageEnemies}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>👹</span>
              Enemies
            </button>
          )}
          {onManageQuestions && (
            <button
              onClick={onManageQuestions}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>❓</span>
              Questions
            </button>
          )}
          {onManageItems && (
            <button
              onClick={onManageItems}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>🎁</span>
              Items
            </button>
          )}
          {onSequenceLevels && (
            <button
              onClick={onSequenceLevels}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>🔢</span>
              Sequence
            </button>
          )}
          {onPlayLevel && (
            <button
              onClick={onPlayLevel}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>▶️</span>
              Play
            </button>
          )}
          <button
            onClick={onValidate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg
                     transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span>✓</span>
            Validate
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>✕</span>
              Close Editor
            </button>
          )}
        </div>
      </div>

      {/* Metadata Editor (Expandable) */}
      {showMetadataEdit && (
        <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <h3 className="text-sm font-bold text-white mb-3">Level Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Level Name</label>
              <input
                type="text"
                value={levelMetadata.name}
                onChange={(e) =>
                  onUpdateMetadata({ ...levelMetadata, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Recommended Level</label>
              <input
                type="number"
                value={levelMetadata.recommendedLevel}
                onChange={(e) =>
                  onUpdateMetadata({
                    ...levelMetadata,
                    recommendedLevel: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
              <select
                value={levelMetadata.difficulty}
                onChange={(e) =>
                  onUpdateMetadata({
                    ...levelMetadata,
                    difficulty: e.target.value as Difficulty,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="deadly">Deadly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Est. Duration (min)</label>
              <input
                type="number"
                value={levelMetadata.estimatedDuration}
                onChange={(e) =>
                  onUpdateMetadata({
                    ...levelMetadata,
                    estimatedDuration: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                value={levelMetadata.description}
                onChange={(e) =>
                  onUpdateMetadata({ ...levelMetadata, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={levelMetadata.isPublished}
                  onChange={(e) =>
                    onUpdateMetadata({
                      ...levelMetadata,
                      isPublished: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600
                           focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Published (visible to players)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
