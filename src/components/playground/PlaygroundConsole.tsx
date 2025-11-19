interface PlaygroundConsoleProps {
  output: string[];
  onClear: () => void;
}

export default function PlaygroundConsole({ output, onClear }: PlaygroundConsoleProps) {
  return (
    <div className="h-64 bg-black border-t border-slate-700 flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-green-400">▶</span>
          <span className="text-sm font-semibold">Console Output</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500 italic">
            Console output will appear here when you run your code...
          </div>
        ) : (
          output.map((line, index) => (
            <div
              key={index}
              className={line.startsWith('[ERROR]') ? 'text-red-400' : 'text-gray-100'}
            >
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
