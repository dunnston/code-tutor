import { useAppStore } from '@/lib/store';

const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', icon: '📘' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
];

export function PlaygroundWidget() {
  const { setCurrentView, setPlaygroundLanguage } = useAppStore();

  const handleOpenPlayground = (language?: string) => {
    if (language && setPlaygroundLanguage) {
      setPlaygroundLanguage(language);
    }
    setCurrentView('playground');
  };

  return (
    <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎨</span>
        <div>
          <h3 className="text-lg font-bold text-gray-100">Code Playground</h3>
          <p className="text-sm text-gray-500">Experiment freely with code</p>
        </div>
      </div>

      {/* Language Quick Select */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quick Start</p>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleOpenPlayground(lang.id)}
              className="flex items-center gap-2 px-3 py-2 bg-navy-700/50 hover:bg-navy-600 border border-navy-600 hover:border-accent-500 rounded-lg transition-colors text-left"
            >
              <span className="text-lg">{lang.icon}</span>
              <span className="text-sm text-gray-300">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Open Button */}
      <button
        onClick={() => handleOpenPlayground()}
        className="w-full px-4 py-3 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-gray-200 hover:text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
      >
        <span>Open Playground</span>
      </button>
    </div>
  );
}
