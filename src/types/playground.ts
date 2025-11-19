// Playground TypeScript Types

export interface PlaygroundProject {
  id: string;
  user_id: number;
  name: string;
  description?: string;
  language_id: string;
  code: string;
  is_public: boolean;
  is_favorite: boolean;
  fork_count: number;
  view_count: number;
  like_count: number;
  forked_from_id?: string;
  tags?: string; // JSON array string
  created_at: string;
  updated_at: string;
  last_run_at?: string;
}

export interface PlaygroundTemplate {
  id: string;
  name: string;
  description?: string;
  language_id: string;
  category: string;
  code: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string; // JSON array string
  icon?: string;
  is_featured: boolean;
  order_index?: number;
}

export interface PlaygroundSnippet {
  id: string;
  user_id?: number;
  name: string;
  description?: string;
  language_id: string;
  category?: string;
  code: string;
  use_count: number;
  created_at: string;
}

export interface PlaygroundSession {
  id: number;
  user_id: number;
  language_id: string;
  code?: string;
  last_saved_at: string;
}

export interface PlaygroundAchievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  requirement_type?: string;
  requirement_value?: number;
  xp_reward?: number;
  gold_reward?: number;
}

// UI State Types
export type PlaygroundView = 'editor' | 'projects' | 'templates' | 'snippets' | 'community';

export interface PlaygroundState {
  currentView: PlaygroundView;
  currentProject?: PlaygroundProject;
  currentLanguage: string;
  code: string;
  isRunning: boolean;
  isSaving: boolean;
  lastSaved?: Date;
  consoleOutput: string[];
  projects: PlaygroundProject[];
  templates: PlaygroundTemplate[];
  snippets: PlaygroundSnippet[];
}

// Create Project Request
export interface CreateProjectRequest {
  name: string;
  description?: string;
  language_id: string;
  code: string;
  tags?: string[];
}

// Update Project Request
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  code?: string;
  tags?: string[];
  is_public?: boolean;
  is_favorite?: boolean;
}

// Create Snippet Request
export interface CreateSnippetRequest {
  name: string;
  description?: string;
  language_id: string;
  category?: string;
  code: string;
}

// Template Categories
export type TemplateCategory = 'basics' | 'game' | 'algorithm' | 'utility' | 'data-viz';

// Filter Options
export interface TemplateFilters {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: TemplateCategory;
  language?: string;
}

export interface SnippetFilters {
  category?: string;
  language?: string;
  userOnly?: boolean;
}
