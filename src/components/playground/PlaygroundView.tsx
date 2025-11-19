import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Editor from '@monaco-editor/react';
import { useAppStore } from '@/lib/store';
import { LANGUAGE_REGISTRY } from '@/lib/languageRegistry';
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
import type {
  PlaygroundProject,
  PlaygroundTemplate,
  PlaygroundSnippet,
} from '@/types/playground';
import PlaygroundSidebar from './PlaygroundSidebar';
import PlaygroundToolbar from './PlaygroundToolbar';
import PlaygroundConsole from './PlaygroundConsole';

export default function PlaygroundView() {
  const {
    playgroundProjectId,
    setPlaygroundProjectId,
    playgroundLanguage,
    setPlaygroundLanguage,
    playgroundCode,
    setPlaygroundCode,
    settings,
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
    setIsRunning(true);
    setConsoleOutput([]);

    try {
      const result = await invoke<{
        stdout: string;
        stderr: string;
        exitCode: number;
        executionTimeMs: number;
      }>('execute_code', {
        code: playgroundCode,
        language: playgroundLanguage,
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

  const handleSaveProject = async () => {
    if (!currentProject) {
      // Create new project
      const projectName = prompt('Enter project name:');
      if (!projectName) return;

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
        alert('Failed to create project');
      } finally {
        setIsSaving(false);
      }
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
        alert('Failed to update project');
      } finally {
        setIsSaving(false);
      }
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

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deletePlaygroundProject(projectId);
      await loadProjects();

      if (projectId === playgroundProjectId) {
        handleNewProject();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const monacoLanguage = LANGUAGE_REGISTRY[playgroundLanguage as keyof typeof LANGUAGE_REGISTRY]?.monacoLanguage || 'python';

  return (
    <div className="flex h-screen bg-slate-900 text-gray-100">
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
      <div className="flex-1 flex flex-col">
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
    </div>
  );
}
