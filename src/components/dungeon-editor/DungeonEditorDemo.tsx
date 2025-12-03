import React, { useState } from 'react';
import { DungeonNodeEditor } from './DungeonNodeEditor';
import { sampleLevels } from '../../data/sampleDungeonLevels';
import { DungeonLevel } from '../../types/dungeonEditor';

/**
 * Demo page for the Dungeon Node Editor
 *
 * This component shows how to integrate the editor into your application.
 * You can load sample levels or start from scratch.
 */
export const DungeonEditorDemo: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<DungeonLevel | undefined>();
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <DungeonNodeEditor initialLevel={selectedLevel} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span>🗺️</span>
            Dungeon Node Editor
          </h1>
          <p className="text-gray-400 text-lg">
            Create interactive dungeon levels with a visual node-based editor
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectedLevel(undefined);
                setShowEditor(true);
              }}
              className="p-6 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="text-xl font-semibold text-white mb-1">Create New Level</div>
              <div className="text-sm text-blue-100">Start with a blank canvas</div>
            </button>

            <button
              onClick={() => setShowEditor(true)}
              className="p-6 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-left"
            >
              <div className="text-3xl mb-2">📂</div>
              <div className="text-xl font-semibold text-white mb-1">Load Existing Level</div>
              <div className="text-sm text-purple-100">Open a saved level</div>
            </button>
          </div>
        </div>

        {/* Sample Levels */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Sample Levels</h2>
          <p className="text-gray-400 mb-4">
            Try these pre-built levels to see what's possible
          </p>
          <div className="grid gap-4">
            {sampleLevels.map((level) => (
              <div
                key={level.metadata.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {level.metadata.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {level.metadata.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-400">
                        Level {level.metadata.recommendedLevel}
                      </span>
                      <span
                        className={
                          level.metadata.difficulty === 'easy'
                            ? 'text-green-400'
                            : level.metadata.difficulty === 'medium'
                            ? 'text-yellow-400'
                            : level.metadata.difficulty === 'hard'
                            ? 'text-orange-400'
                            : 'text-red-400'
                        }
                      >
                        {level.metadata.difficulty.charAt(0).toUpperCase() +
                          level.metadata.difficulty.slice(1)}
                      </span>
                      <span className="text-gray-500">
                        ~{level.metadata.estimatedDuration} min
                      </span>
                      <span className="text-gray-500">
                        {level.nodes.length} nodes
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {level.metadata.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLevel(level);
                      setShowEditor(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>🎨</span> Visual Node Editor
              </h3>
              <p className="text-gray-400 text-sm">
                Drag and drop nodes onto a canvas. Connect them to create branching
                paths and complex dungeon flows.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>🎯</span> 9 Node Types
              </h3>
              <p className="text-gray-400 text-sm">
                Start, Combat, Boss, Choice, Ability Check, Trap, Loot, Story, and End
                nodes for diverse gameplay.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>⚙️</span> Detailed Configuration
              </h3>
              <p className="text-gray-400 text-sm">
                Click any node to edit its properties in the side panel. Configure
                enemies, rewards, dialogue, and more.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>✓</span> Built-in Validation
              </h3>
              <p className="text-gray-400 text-sm">
                Validate your level to ensure proper connections and catch errors
                before publishing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>💾</span> Save & Load
              </h3>
              <p className="text-gray-400 text-sm">
                Levels are saved to a local database. Create, edit, duplicate, and
                export levels as JSON.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>📤</span> Export to JSON
              </h3>
              <p className="text-gray-400 text-sm">
                Export your levels as JSON files that can be imported by your game
                engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
