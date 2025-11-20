import { useAppStore } from '@/lib/store';

export function PlaygroundWidget() {
  const { setCurrentView } = useAppStore();

  const handleOpenPlayground = () => {
    setCurrentView('playground');
  };

  return (
    <div className="bg-navy-800 rounded-xl p-4 border border-navy-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <h3 className="text-base font-semibold text-gray-200">Code Playground</h3>
            <p className="text-xs text-gray-500">Experiment with code</p>
          </div>
        </div>
        <button
          onClick={handleOpenPlayground}
          className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          Open
        </button>
      </div>
    </div>
  );
}
