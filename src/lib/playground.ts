// Playground Utility Functions
import { invoke } from '@/lib/tauri';
import type {
  PlaygroundProject,
  PlaygroundTemplate,
  PlaygroundSnippet,
  PlaygroundSession,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateSnippetRequest,
} from '../types/playground';

// ============================================================================
// PROJECT OPERATIONS
// ============================================================================

export async function getPlaygroundProjects(userId: number = 1): Promise<PlaygroundProject[]> {
  try {
    const projects = await invoke<PlaygroundProject[]>('get_playground_projects', { userId });
    return projects;
  } catch (error) {
    console.error('Failed to get playground projects:', error);
    throw error;
  }
}

export async function getPlaygroundProject(projectId: string): Promise<PlaygroundProject> {
  try {
    const project = await invoke<PlaygroundProject>('get_playground_project', { projectId });
    return project;
  } catch (error) {
    console.error('Failed to get playground project:', error);
    throw error;
  }
}

export async function createPlaygroundProject(
  request: CreateProjectRequest,
  userId: number = 1
): Promise<string> {
  try {
    const tags = request.tags ? JSON.stringify(request.tags) : null;
    const projectId = await invoke<string>('create_playground_project', {
      userId,
      name: request.name,
      description: request.description || null,
      languageId: request.language_id,
      code: request.code,
      tags,
    });
    return projectId;
  } catch (error) {
    console.error('Failed to create playground project:', error);
    throw error;
  }
}

export async function updatePlaygroundProject(
  projectId: string,
  updates: UpdateProjectRequest
): Promise<void> {
  try {
    const tags = updates.tags ? JSON.stringify(updates.tags) : undefined;
    await invoke('update_playground_project', {
      projectId,
      name: updates.name,
      description: updates.description,
      code: updates.code,
      tags,
      isPublic: updates.is_public,
      isFavorite: updates.is_favorite,
    });
  } catch (error) {
    console.error('Failed to update playground project:', error);
    throw error;
  }
}

export async function deletePlaygroundProject(projectId: string): Promise<void> {
  try {
    await invoke('delete_playground_project', { projectId });
  } catch (error) {
    console.error('Failed to delete playground project:', error);
    throw error;
  }
}

export async function updateProjectLastRun(projectId: string): Promise<void> {
  try {
    await invoke('update_project_last_run', { projectId });
  } catch (error) {
    console.error('Failed to update project last run:', error);
    // Don't throw, this is not critical
  }
}

export async function forkPlaygroundProject(
  originalProjectId: string,
  newName: string,
  userId: number = 1
): Promise<string> {
  try {
    const newProjectId = await invoke<string>('fork_playground_project', {
      userId,
      originalProjectId,
      newName,
    });
    return newProjectId;
  } catch (error) {
    console.error('Failed to fork playground project:', error);
    throw error;
  }
}

// ============================================================================
// TEMPLATE OPERATIONS
// ============================================================================

export async function getPlaygroundTemplates(
  languageId?: string,
  category?: string
): Promise<PlaygroundTemplate[]> {
  try {
    const templates = await invoke<PlaygroundTemplate[]>('get_playground_templates', {
      languageId: languageId || null,
      category: category || null,
    });
    return templates;
  } catch (error) {
    console.error('Failed to get playground templates:', error);
    throw error;
  }
}

export async function getPlaygroundTemplate(templateId: string): Promise<PlaygroundTemplate> {
  try {
    const template = await invoke<PlaygroundTemplate>('get_playground_template', { templateId });
    return template;
  } catch (error) {
    console.error('Failed to get playground template:', error);
    throw error;
  }
}

// ============================================================================
// SNIPPET OPERATIONS
// ============================================================================

export async function getPlaygroundSnippets(
  languageId?: string,
  category?: string,
  userOnly: boolean = false,
  userId: number = 1
): Promise<PlaygroundSnippet[]> {
  try {
    const snippets = await invoke<PlaygroundSnippet[]>('get_playground_snippets', {
      languageId: languageId || null,
      category: category || null,
      userOnly,
      userId,
    });
    return snippets;
  } catch (error) {
    console.error('Failed to get playground snippets:', error);
    throw error;
  }
}

export async function createPlaygroundSnippet(
  request: CreateSnippetRequest,
  userId: number = 1
): Promise<string> {
  try {
    const snippetId = await invoke<string>('create_playground_snippet', {
      userId,
      name: request.name,
      description: request.description || null,
      languageId: request.language_id,
      category: request.category || null,
      code: request.code,
    });
    return snippetId;
  } catch (error) {
    console.error('Failed to create playground snippet:', error);
    throw error;
  }
}

export async function incrementSnippetUseCount(snippetId: string): Promise<void> {
  try {
    await invoke('increment_snippet_use_count', { snippetId });
  } catch (error) {
    console.error('Failed to increment snippet use count:', error);
    // Don't throw, this is not critical
  }
}

// ============================================================================
// SESSION OPERATIONS (Auto-save)
// ============================================================================

export async function getPlaygroundSession(
  userId: number,
  languageId: string
): Promise<PlaygroundSession | null> {
  try {
    const session = await invoke<PlaygroundSession | null>('get_playground_session', {
      userId,
      languageId,
    });
    return session;
  } catch (error) {
    console.error('Failed to get playground session:', error);
    return null;
  }
}

export async function savePlaygroundSession(
  userId: number,
  languageId: string,
  code: string
): Promise<void> {
  try {
    await invoke('save_playground_session', {
      userId,
      languageId,
      code,
    });
  } catch (error) {
    console.error('Failed to save playground session:', error);
    // Don't throw, auto-save failures shouldn't interrupt user
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function parseProjectTags(tagsJson?: string): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

export function getProjectLanguageName(languageId: string): string {
  const languageNames: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    csharp: 'C#',
    ruby: 'Ruby',
    gdscript: 'GDScript',
  };
  return languageNames[languageId] || languageId;
}

export function formatProjectDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

export function countCodeLines(code: string): number {
  return code.split('\n').filter((line) => line.trim().length > 0).length;
}

export function getDifficultyColor(difficulty?: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-500';
    case 'intermediate':
      return 'text-yellow-500';
    case 'advanced':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    basics: '👋',
    game: '🎮',
    algorithm: '🧠',
    utility: '🔧',
    'data-viz': '📊',
  };
  return icons[category] || '📄';
}
