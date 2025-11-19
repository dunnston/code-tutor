import { useState } from 'react';
import type {
  PlaygroundProject,
  PlaygroundTemplate,
  PlaygroundSnippet,
} from '@/types/playground';
import { formatProjectDate, countCodeLines } from '@/lib/playground';

interface PlaygroundSidebarProps {
  view: 'projects' | 'templates' | 'snippets';
  onViewChange: (view: 'projects' | 'templates' | 'snippets') => void;
  projects: PlaygroundProject[];
  templates: PlaygroundTemplate[];
  snippets: PlaygroundSnippet[];
  currentLanguage: string;
  onLoadProject: (project: PlaygroundProject) => void;
  onLoadTemplate: (template: PlaygroundTemplate) => void;
  onInsertSnippet: (snippet: PlaygroundSnippet) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
}

export default function PlaygroundSidebar({
  view,
  onViewChange,
  projects,
  templates,
  snippets,
  currentLanguage,
  onLoadProject,
  onLoadTemplate,
  onInsertSnippet,
  onDeleteProject,
  onNewProject,
}: PlaygroundSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSnippets = snippets.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📚</span>
          <h2 className="text-lg font-bold">Playground</h2>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded p-1">
          <button
            onClick={() => onViewChange('projects')}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'projects'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onViewChange('templates')}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'templates'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => onViewChange('snippets')}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'snippets'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Snippets
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'projects' && (
          <div className="space-y-2">
            {/* New Project Button */}
            <button
              onClick={onNewProject}
              className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>🆕</span>
              New Project
            </button>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                {searchQuery ? 'No projects found' : 'No projects yet. Create one to get started!'}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-900 hover:bg-slate-700 rounded p-3 cursor-pointer transition-colors group"
                  onClick={() => onLoadProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{project.name}</h3>
                        {project.is_favorite && <span className="text-yellow-500 text-xs">⭐</span>}
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{project.language_id}</span>
                        <span>•</span>
                        <span>{countCodeLines(project.code)} lines</span>
                        <span>•</span>
                        <span>{formatProjectDate(project.updated_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-1 transition-opacity"
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'templates' && (
          <div className="space-y-2">
            {filteredTemplates.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                No templates found
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-slate-900 hover:bg-slate-700 rounded p-3 cursor-pointer transition-colors"
                  onClick={() => onLoadTemplate(template)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{template.icon || '📄'}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      {template.description && (
                        <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {template.difficulty && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              template.difficulty === 'beginner'
                                ? 'bg-green-900 text-green-300'
                                : template.difficulty === 'intermediate'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {template.difficulty}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{template.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'snippets' && (
          <div className="space-y-2">
            {filteredSnippets.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                No snippets found
              </div>
            ) : (
              filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="bg-slate-900 hover:bg-slate-700 rounded p-3 cursor-pointer transition-colors"
                  onClick={() => onInsertSnippet(snippet)}
                >
                  <h3 className="font-semibold text-sm">{snippet.name}</h3>
                  {snippet.description && (
                    <p className="text-xs text-gray-400 mt-1">{snippet.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    {snippet.category && <span>{snippet.category}</span>}
                    <span>•</span>
                    <span>Used {snippet.use_count} times</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
