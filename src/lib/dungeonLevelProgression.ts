/**
 * Dungeon Level Progression System
 *
 * Manages which levels the player has access to and tracks their progress
 */

import { invoke } from '@tauri-apps/api/core';
import { DungeonLevel, LevelListItem } from '../types/dungeonEditor';

// ==========================================
// LEVEL PROGRESSION TRACKING
// ==========================================

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  bestTime?: number; // in seconds
  attempts: number;
  completedAt?: string;
}

export interface CampaignProgress {
  userId: number;
  currentLevelId: string;
  completedLevels: string[];
  levelProgress: Record<string, LevelProgress>;
}

/**
 * Get campaign progression for a user
 */
export async function getCampaignProgress(userId: number): Promise<CampaignProgress> {
  // This would integrate with your existing database
  // For now, using localStorage as example
  const key = `campaign_progress_${userId}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    return JSON.parse(stored);
  }

  // Default: start at level 1
  return {
    userId,
    currentLevelId: 'level-1-abandoned-fortress',
    completedLevels: [],
    levelProgress: {},
  };
}

/**
 * Save campaign progress
 */
export async function saveCampaignProgress(progress: CampaignProgress): Promise<void> {
  const key = `campaign_progress_${progress.userId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Mark a level as completed
 */
export async function completeLevel(
  userId: number,
  levelId: string,
  timeTaken: number
): Promise<void> {
  const progress = await getCampaignProgress(userId);

  // Add to completed if not already there
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }

  // Update level progress
  const existing = progress.levelProgress[levelId];
  progress.levelProgress[levelId] = {
    levelId,
    completed: true,
    bestTime: existing?.bestTime
      ? Math.min(existing.bestTime, timeTaken)
      : timeTaken,
    attempts: (existing?.attempts || 0) + 1,
    completedAt: new Date().toISOString(),
  };

  await saveCampaignProgress(progress);
}

/**
 * Get the next available level for a user
 */
export async function getNextLevel(userId: number): Promise<string | null> {
  const progress = await getCampaignProgress(userId);
  const allLevels = await getPublishedLevels();

  // Find first incomplete level
  const nextLevel = allLevels.find(
    (level) => !progress.completedLevels.includes(level.id)
  );

  return nextLevel?.id || null;
}

/**
 * Check if a level is unlocked for a user
 */
export async function isLevelUnlocked(
  userId: number,
  levelId: string
): Promise<boolean> {
  const progress = await getCampaignProgress(userId);
  const allLevels = await getPublishedLevels();

  // Level 1 is always unlocked
  const level = allLevels.find((l) => l.id === levelId);
  if (!level || level.recommendedLevel === 1) {
    return true;
  }

  // Check if previous levels are completed
  const previousLevels = allLevels.filter(
    (l) => l.recommendedLevel < level.recommendedLevel
  );

  return previousLevels.every((prevLevel) =>
    progress.completedLevels.includes(prevLevel.id)
  );
}

// ==========================================
// LEVEL LOADING
// ==========================================

/**
 * Get all published levels (for campaign)
 */
export async function getPublishedLevels(): Promise<LevelListItem[]> {
  try {
    const allLevels = await invoke<LevelListItem[]>('list_dungeon_levels');
    return allLevels
      .filter((level) => level.isPublished)
      .sort((a, b) => a.recommendedLevel - b.recommendedLevel);
  } catch (error) {
    console.error('Failed to get published levels:', error);
    return [];
  }
}

/**
 * Load a specific level by ID
 */
export async function loadLevel(levelId: string): Promise<DungeonLevel | null> {
  try {
    return await invoke<DungeonLevel>('load_dungeon_level', { levelId });
  } catch (error) {
    console.error('Failed to load level:', error);
    return null;
  }
}

/**
 * Get level with progress information
 */
export async function getLevelWithProgress(
  userId: number,
  levelId: string
): Promise<{ level: DungeonLevel; progress: LevelProgress | null; unlocked: boolean } | null> {
  const level = await loadLevel(levelId);
  if (!level) return null;

  const campaignProgress = await getCampaignProgress(userId);
  const levelProgress = campaignProgress.levelProgress[levelId] || null;
  const unlocked = await isLevelUnlocked(userId, levelId);

  return {
    level,
    progress: levelProgress,
    unlocked,
  };
}

// ==========================================
// CAMPAIGN INTEGRATION
// ==========================================

/**
 * Example: How to integrate with your existing dungeon system
 */
export const INTEGRATION_EXAMPLE = `
// In your dungeon crawler component:

import { loadLevel, completeLevel, isLevelUnlocked } from '@/lib/dungeonLevelProgression';

function DungeonCrawler() {
  const userId = getCurrentUserId(); // Your existing user system
  const [currentLevel, setCurrentLevel] = useState(null);

  // Load level on mount
  useEffect(() => {
    async function load() {
      const level = await loadLevel('level-1-abandoned-fortress');
      setCurrentLevel(level);
    }
    load();
  }, []);

  // When player completes the level
  async function handleLevelComplete(timeTaken: number) {
    await completeLevel(userId, currentLevel.metadata.id, timeTaken);

    // Award XP, gold, etc. based on level rewards
    // Then load next level or return to hub
  }

  return <LevelPlayer level={currentLevel} onComplete={handleLevelComplete} />;
}
`;

/**
 * Load Level 1 template (for testing)
 */
export async function loadLevel1Template(): Promise<DungeonLevel> {
  const { createLevel1Template } = await import('./dungeonLevelConverter');
  return createLevel1Template();
}
