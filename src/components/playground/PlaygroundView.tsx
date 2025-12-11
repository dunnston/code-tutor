import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@/lib/tauri';
import Editor from '@monaco-editor/react';
import { useAppStore } from '@/lib/store';
import { LANGUAGE_REGISTRY } from '@/lib/languageRegistry';
import { getRuntimePath } from '@/lib/runtimePaths';
import {
  getPlaygroundProjects,
  getPlaygroundTemplates,
  getPlaygroundSnippets,
  getPlaygroundSession,
  savePlaygroundSession,
  createPlaygroundProject,
  updatePlaygroundProject,
  deletePlaygroundProject,
  getPlaygroundProject,
} from '@/lib/playground';
import { incrementQuestProgress } from '@/lib/gamification';
import type {
  PlaygroundProject,
  PlaygroundTemplate,
  PlaygroundSnippet,
} from '@/types/playground';
import PlaygroundSidebar from './PlaygroundSidebar';
import PlaygroundToolbar from './PlaygroundToolbar';
import PlaygroundConsole from './PlaygroundConsole';
import { PlaygroundChatPanel } from './PlaygroundChatPanel';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { InputModal } from '@/components/ui/InputModal';
import { AlertModal } from '@/components/ui/AlertModal';
import { InteractiveInputModal } from '@/components/ui/InteractiveInputModal';
import { detectInputRequirements, needsInput } from '@/lib/inputDetection';
import type { InputPrompt } from '@/lib/inputDetection';

export default function PlaygroundView() {
  const {
    playgroundProjectId,
    setPlaygroundProjectId,
    playgroundLanguage,
    setPlaygroundLanguage,
    playgroundCode,
    setPlaygroundCode,
    settings,
    currentUserId,
  } = useAppStore();

  const [sidebarView, setSidebarView] = useState<'projects' | 'templates' | 'snippets'>('projects');
  const [projects, setProjects] = useState<PlaygroundProject[]>([]);
  const [templates, setTemplates] = useState<PlaygroundTemplate[]>([]);
  const [snippets, setSnippets] = useState<PlaygroundSnippet[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentProject, setCurrentProject] = useState<PlaygroundProject | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showSaveProjectModal, setShowSaveProjectModal] = useState(false);
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [inputPrompts, setInputPrompts] = useState<InputPrompt[]>([]);
  const [showInputModal, setShowInputModal] = useState(false);

  // Load projects, templates, and snippets on mount
  useEffect(() => {
    loadProjects();
    loadTemplates();
    loadSnippets();
    loadSession();
  }, []);

  // Auto-save session periodically
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (playgroundCode && playgroundCode.length > 0) {
        saveSession();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [playgroundCode, playgroundLanguage]);

  const loadProjects = async () => {
    try {
      const projectList = await getPlaygroundProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await getPlaygroundTemplates(playgroundLanguage);
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadSnippets = async () => {
    try {
      const snippetList = await getPlaygroundSnippets(playgroundLanguage);
      setSnippets(snippetList);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    }
  };

  const loadSession = async () => {
    try {
      const session = await getPlaygroundSession(1, playgroundLanguage);
      if (session && session.code) {
        setPlaygroundCode(session.code);
      } else {
        // Load default starter code for the language
        const defaultCode = getDefaultCode(playgroundLanguage);
        setPlaygroundCode(defaultCode);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      const defaultCode = getDefaultCode(playgroundLanguage);
      setPlaygroundCode(defaultCode);
    }
  };

  const saveSession = async () => {
    try {
      await savePlaygroundSession(1, playgroundLanguage, playgroundCode);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const getDefaultCode = (languageId: string): string => {
    const defaults: Record<string, string> = {
      python: '# Welcome to the Playground!\n# Write any Python code you want\n\nprint("Hello, World!")\n',
      javascript: '// Welcome to the Playground!\n// Write any JavaScript code you want\n\nconsole.log("Hello, World!");\n',
      csharp: '// Welcome to the Playground!\n// Write any C# code you want\n\nusing System;\n\nConsole.WriteLine("Hello, World!");\n',
      ruby: '# Welcome to the Playground!\n# Write any Ruby code you want\n\nputs "Hello, World!"\n',
      gdscript: '# Welcome to the Playground!\n# Write any GDScript code you want\n\nprint("Hello, World!")\n',
    };
    return defaults[languageId] || '# Start coding!\n';
  };

  const handleRunCode = async () => {
    // Check if code needs input
    if (needsInput(playgroundCode, playgroundLanguage)) {
      const prompts = detectInputRequirements(playgroundCode, playgroundLanguage);
      setInputPrompts(prompts);
      setShowInputModal(true);
      return;
    }

    // Run without input
    await executeCode(null);
  };

  const executeCode = async (stdinValues: string[] | null) => {
    setIsRunning(true);
    setConsoleOutput([]);

    try {
      // Convert input values to stdin string (newline-separated)
      const stdin = stdinValues ? stdinValues.join('\n') + '\n' : null;

      // Get custom runtime path if configured
      const customPath = getRuntimePath(playgroundLanguage as any);

      const result = await invoke<{
        stdout: string;
        stderr: string;
        exitCode: number;
        executionTimeMs: number;
      }>('execute_code', {
        code: playgroundCode,
        language: playgroundLanguage,
        stdin,
        customExecutablePath: customPath,
      });

      const output: string[] = [];

      if (result.stdout) {
        output.push(result.stdout);
      }

      if (result.stderr) {
        output.push(`[ERROR] ${result.stderr}`);
      }

      output.push(`\n✓ Executed in ${(result.executionTimeMs / 1000).toFixed(2)}s`);

      setConsoleOutput(output);

      // Track playground usage for quest progress
      if (currentUserId) {
        try {
          await incrementQuestProgress(currentUserId, 'use_playground');

          // Refresh currency and quests to show updated gold and quest progress
          const { refreshCurrency, refreshQuests } = useAppStore.getState();
          await refreshCurrency();
          await refreshQuests();
        } catch (error) {
          console.error('Failed to update quest progress:', error);
        }
      }

      // Update last run time if this is a saved project
      if (playgroundProjectId) {
        await invoke('update_project_last_run', { projectId: playgroundProjectId });
      }
    } catch (error) {
      setConsoleOutput([`[ERROR] ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInputConfirm = (values: string[]) => {
    setShowInputModal(false);
    executeCode(values);
  };

  const handleInputCancel = () => {
    setShowInputModal(false);
  };

  const handleSaveProject = async () => {
    if (!currentProject) {
      // Create new project - show modal to get project name
      setShowSaveProjectModal(true);
    } else {
      // Update existing project
      setIsSaving(true);
      try {
        await updatePlaygroundProject(currentProject.id, {
          code: playgroundCode,
        });
        setLastSaved(new Date());
        await loadProjects();
      } catch (error) {
        console.error('Failed to update project:', error);
        setErrorModal({ show: true, message: 'Failed to update project. Please try again.' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleConfirmSaveProject = async (projectName: string) => {
    setShowSaveProjectModal(false);
    setIsSaving(true);
    try {
      const projectId = await createPlaygroundProject({
        name: projectName,
        language_id: playgroundLanguage,
        code: playgroundCode,
      });

      setPlaygroundProjectId(projectId);
      await loadProjects();

      // Load the created project
      const project = await getPlaygroundProject(projectId);
      setCurrentProject(project);
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrorModal({ show: true, message: 'Failed to create project. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadProject = async (project: PlaygroundProject) => {
    setCurrentProject(project);
    setPlaygroundProjectId(project.id);
    setPlaygroundLanguage(project.language_id);
    setPlaygroundCode(project.code);
    setConsoleOutput([]);
  };

  const handleLoadTemplate = (template: PlaygroundTemplate) => {
    setPlaygroundLanguage(template.language_id);
    setPlaygroundCode(template.code);
    setCurrentProject(null);
    setPlaygroundProjectId(null);
    setConsoleOutput([]);
  };

  const handleInsertSnippet = (snippet: PlaygroundSnippet) => {
    // Insert snippet at cursor position
    // For now, just append to end
    setPlaygroundCode(playgroundCode + '\n\n' + snippet.code);
  };

  const handleClearConsole = () => {
    setConsoleOutput([]);
  };

  const handleLanguageChange = async (languageId: string) => {
    setPlaygroundLanguage(languageId);
    setCurrentProject(null);
    setPlaygroundProjectId(null);
    setConsoleOutput([]);

    // Load session for new language
    try {
      const session = await getPlaygroundSession(1, languageId);
      if (session && session.code) {
        setPlaygroundCode(session.code);
      } else {
        setPlaygroundCode(getDefaultCode(languageId));
      }
    } catch (error) {
      setPlaygroundCode(getDefaultCode(languageId));
    }

    // Reload templates and snippets for new language
    loadTemplates();
    loadSnippets();
  };

  const handleNewProject = () => {
    console.log('Creating new project');
    setCurrentProject(null);
    setPlaygroundProjectId(null);
    const defaultCode = getDefaultCode(playgroundLanguage);
    console.log('Setting default code:', defaultCode);
    setPlaygroundCode(defaultCode);
    setConsoleOutput([]);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deletePlaygroundProject(projectToDelete);
      await loadProjects();

      if (projectToDelete === playgroundProjectId) {
        handleNewProject();
      }
      setProjectToDelete(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
      setConsoleOutput(prev => [...prev, 'Error: Failed to delete project']);
      setProjectToDelete(null);
    }
  };

  const monacoLanguage = LANGUAGE_REGISTRY[playgroundLanguage as keyof typeof LANGUAGE_REGISTRY]?.monacoLanguage || 'python';

  return (
    <>
      <ConfirmModal
        isOpen={projectToDelete !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />

      <InputModal
        isOpen={showSaveProjectModal}
        title="Save Project"
        message="Enter a name for your project:"
        placeholder="My Project"
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={handleConfirmSaveProject}
        onCancel={() => setShowSaveProjectModal(false)}
      />

      <AlertModal
        isOpen={errorModal.show}
        title="Error"
        message={errorModal.message}
        variant="error"
        confirmText="OK"
        onConfirm={() => setErrorModal({ show: false, message: '' })}
      />

      <InteractiveInputModal
        isOpen={showInputModal}
        prompts={inputPrompts}
        onConfirm={handleInputConfirm}
        onCancel={handleInputCancel}
      />

      <div className="flex h-screen bg-slate-900 text-gray-100 overflow-hidden">
        {/* Sidebar */}
        <PlaygroundSidebar
        view={sidebarView}
        onViewChange={setSidebarView}
        projects={projects}
        templates={templates}
        snippets={snippets}
        currentLanguage={playgroundLanguage}
        onLoadProject={handleLoadProject}
        onLoadTemplate={handleLoadTemplate}
        onInsertSnippet={handleInsertSnippet}
        onDeleteProject={handleDeleteProject}
        onNewProject={handleNewProject}
      />

      {/* Main Editor Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Toolbar */}
        <PlaygroundToolbar
          currentProject={currentProject}
          language={playgroundLanguage}
          onLanguageChange={handleLanguageChange}
          onRun={handleRunCode}
          onSave={handleSaveProject}
          isRunning={isRunning}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Editor and Console */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 border-b border-slate-700 bg-slate-900">
              <Editor
                height="100%"
                language={monacoLanguage}
                value={playgroundCode}
                onChange={(value) => setPlaygroundCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: settings.fontSize || 14,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
                loading={<div className="flex items-center justify-center h-full bg-slate-900 text-gray-400">Loading editor...</div>}
              />
            </div>

            {/* Console */}
            <PlaygroundConsole
              output={consoleOutput}
              onClear={handleClearConsole}
            />
          </div>

          {/* AI Chat Panel - Only takes space when open */}
          {chatOpen && (
            <div className="w-96 flex-shrink-0 border-l border-slate-700">
              <PlaygroundChatPanel isOpen={chatOpen} onToggle={() => setChatOpen(false)} />
            </div>
          )}

          {/* Floating Chat Button - Only show when closed */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="fixed right-6 bottom-6 w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
              aria-label="Open AI Tutor"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
