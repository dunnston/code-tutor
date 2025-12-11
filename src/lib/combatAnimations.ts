/**
 * Combat animation mappings for player avatars and enemies
 * Now using GIF files for simple, smooth animations
 */

// Player avatar animations (mapped by avatar file name)
export const PLAYER_ATTACK_ANIMATIONS: Record<string, string> = {
  'dragon-born.png': '/animations/dragon-born.gif',
  'female-archer.png': '/animations/archer.gif',
  'female-rouge.png': '/animations/female-rouge.gif',
  'male-rouge.png': '/animations/female-rouge.gif', // Using same animation
  'wizzard.png': '/animations/wizzard.gif',
};

// Enemy attack animations (mapped by enemy ID)
export const ENEMY_ATTACK_ANIMATIONS: Record<string, string> = {
  giant_rat: '/animations/rat-sword.gif',
  goblin: '/animations/goblin.gif',
  skeleton: '/animations/skelaton.gif',
  wolf: '/animations/wolf.gif',
  goblin_archer: '/animations/goblin.gif',
  skeleton_guard: '/animations/skelaton.gif',
  rat_folk: '/animations/rat-sword.gif',
  gelatinous_cube_small: '/animations/cube.gif',
  gelatinous_cube_boss: '/animations/cube.gif',
  young_dragon: '/animations/dragon.gif',
};

/**
 * Get player attack animation GIF path from avatar path
 */
export function getPlayerAttackAnimation(avatarPath: string | undefined): string | null {
  if (!avatarPath) return null;

  // Extract filename from path (e.g., /avatars/dragon-born.png -> dragon-born.png)
  const filename = avatarPath.split('/').pop();
  if (!filename) return null;

  return PLAYER_ATTACK_ANIMATIONS[filename] || null;
}

/**
 * Get enemy attack animation GIF path from enemy ID
 */
export function getEnemyAttackAnimation(enemyId: string): string | null {
  return ENEMY_ATTACK_ANIMATIONS[enemyId] || null;
}
