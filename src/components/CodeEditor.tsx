import { Editor } from '@monaco-editor/react'
import { useAppStore } from '@/lib/store'
import { getLanguageConfig } from '@/lib/languageRegistry'
import type { SupportedLanguage } from '@/types/language'

export function CodeEditor() {
  const code = useAppStore((state) => state.code)
  const setCode = useAppStore((state) => state.setCode)
  const currentLesson = useAppStore((state) => state.currentLesson)

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  // Get language configuration
  const language = (currentLesson?.language || 'python') as SupportedLanguage
  const languageConfig = getLanguageConfig(language)
  const monacoLanguage = languageConfig.monacoLanguage
  const fileExtension = languageConfig.extension

  return (
    <div className="h-full bg-navy-900 flex flex-col">
      {/* Editor toolbar */}
      <div className="h-10 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-mono">
            {languageConfig.icon} {languageConfig.name} {fileExtension}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Monaco Editor (VS Code)
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={monacoLanguage}
          language={monacoLanguage}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-navy-900">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading editor...</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
