import { useAppStore } from '@/lib/store';
import type { PlaygroundProject } from '@/types/playground';

interface PlaygroundToolbarProps {
  currentProject: PlaygroundProject | null;
  language: string;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onSave: () => void;
  isRunning: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'csharp', name: 'C#', icon: '🔷' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
  { id: 'gdscript', name: 'GDScript', icon: '🎮' },
];

export default function PlaygroundToolbar({
  currentProject,
  language,
  onLanguageChange,
  onRun,
  onSave,
  isRunning,
  isSaving,
  lastSaved,
}: PlaygroundToolbarProps) {
  const { setCurrentView } = useAppStore();

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return 'just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
      {/* Left Side - Back Button & Project Info */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-sm"
          title="Back to Dashboard"
        >
          <span>←</span>
          <span>Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-xl">🎨</span>
          <h1 className="text-lg font-semibold">
            {currentProject ? currentProject.name : 'Untitled Project'}
          </h1>
          {currentProject && currentProject.is_favorite && (
            <span className="text-yellow-500">⭐</span>
          )}
        </div>

        {lastSaved && (
          <span className="text-xs text-gray-400">
            Saved {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>

      {/* Center - Language Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Language:</span>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600 focus:outline-none focus:border-orange-500 text-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.icon} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition-colors text-sm"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <span>▶️</span>
              Run Code
              <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-green-700 rounded">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition-colors text-sm"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save
              <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-blue-700 rounded">
                Ctrl+S
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
