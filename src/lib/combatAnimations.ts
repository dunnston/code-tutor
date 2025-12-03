/**
 * Combat animation mappings for player avatars and enemies
 * Now using GIF files for simple, smooth animations
 */

// Player avatar animations (mapped by avatar file name)
export const PLAYER_ATTACK_ANIMATIONS: Record<string, string> = {
  'dragon-born.png': '/src/images/animations/dragon-born.gif',
  'female-archer.png': '/src/images/animations/archer.gif',
  'female-rouge.png': '/src/images/animations/female-rouge.gif',
  'male-rouge.png': '/src/images/animations/female-rouge.gif', // Using same animation
  'wizzard.png': '/src/images/animations/wizzard.gif',
};

// Enemy attack animations (mapped by enemy ID)
export const ENEMY_ATTACK_ANIMATIONS: Record<string, string> = {
  giant_rat: '/src/images/animations/rat-sword.gif',
  goblin: '/src/images/animations/goblin.gif',
  skeleton: '/src/images/animations/skelaton.gif',
  wolf: '/src/images/animations/wolf.gif',
  goblin_archer: '/src/images/animations/goblin.gif',
  skeleton_guard: '/src/images/animations/skelaton.gif',
  rat_folk: '/src/images/animations/rat-sword.gif',
  gelatinous_cube_small: '/src/images/animations/cube.gif',
  gelatinous_cube_boss: '/src/images/animations/cube.gif',
  young_dragon: '/src/images/animations/dragon.gif',
};

/**
 * Get player attack animation GIF path from avatar path
 */
export function getPlayerAttackAnimation(avatarPath: string | undefined): string | null {
  if (!avatarPath) return null;

  // Extract filename from path (e.g., /src/images/avatars/dragon-born.png -> dragon-born.png)
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
