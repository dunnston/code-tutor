import { useAppStore } from '@/lib/store';

export function PlaygroundWidget() {
  const { setCurrentView } = useAppStore();

  const handleOpenPlayground = () => {
    setCurrentView('playground');
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-700/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎨</span>
            <h3 className="text-xl font-bold text-purple-300">Code Playground</h3>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Experiment freely with code! No tests, no rules – just create.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-purple-900/30 rounded-lg p-3">
              <div className="text-2xl mb-1">🆕</div>
              <div className="text-xs text-gray-400">Quick Start</div>
              <div className="text-sm font-semibold text-purple-200">Blank Canvas</div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xs text-gray-400">Explore</div>
              <div className="text-sm font-semibold text-blue-200">Templates</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleOpenPlayground}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm"
            >
              Open Playground
            </button>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="mt-4 pt-4 border-t border-purple-700/30">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="text-lg mb-1">🐍</div>
            <div className="text-gray-400">Python</div>
          </div>
          <div>
            <div className="text-lg mb-1">🟨</div>
            <div className="text-gray-400">JavaScript</div>
          </div>
          <div>
            <div className="text-lg mb-1">🔷</div>
            <div className="text-gray-400">C#</div>
          </div>
          <div>
            <div className="text-lg mb-1">💎</div>
            <div className="text-gray-400">Ruby</div>
          </div>
          <div>
            <div className="text-lg mb-1">🎮</div>
            <div className="text-gray-400">GDScript</div>
          </div>
          <div>
            <div className="text-lg mb-1">💾</div>
            <div className="text-gray-400">Auto-save</div>
          </div>
        </div>
      </div>
    </div>
  );
}
