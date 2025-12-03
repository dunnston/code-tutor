/**
 * Maps enemy IDs to their PNG image paths
 */

export const ENEMY_IMAGES: Record<string, string> = {
  // Common enemies
  giant_rat: '/src/images/enemies/rat.png',
  goblin: '/src/images/enemies/golbin.png',
  skeleton: '/src/images/enemies/skelaton.png',
  wolf: '/src/images/enemies/wolf.png',
  goblin_archer: '/src/images/enemies/golbin.png',
  skeleton_guard: '/src/images/enemies/skelaton.png',
  rat_folk: '/src/images/enemies/rat-with-sword.png',
  gelatinous_cube_small: '/src/images/enemies/cube.png',

  // Boss enemies
  gelatinous_cube_boss: '/src/images/enemies/cube.png',
  young_dragon: '/src/images/enemies/dragon.png',
};

/**
 * Get the image path for an enemy, fallback to a default if not found
 */
export function getEnemyImage(enemyId: string): string {
  return ENEMY_IMAGES[enemyId] || '/src/images/enemies/golbin.png'; // Default fallback
}
