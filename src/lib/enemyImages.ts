/**
 * Maps enemy IDs to their PNG image paths
 */

export const ENEMY_IMAGES: Record<string, string> = {
  // Common enemies
  giant_rat: '/enemies/rat.png',
  goblin: '/enemies/golbin.png',
  skeleton: '/enemies/skelaton.png',
  wolf: '/enemies/wolf.png',
  goblin_archer: '/enemies/golbin.png',
  skeleton_guard: '/enemies/skelaton.png',
  rat_folk: '/enemies/rat-with-sword.png',
  gelatinous_cube_small: '/enemies/cube.png',

  // Boss enemies
  gelatinous_cube_boss: '/enemies/cube.png',
  young_dragon: '/enemies/dragon.png',
};

/**
 * Get the image path for an enemy, fallback to a default if not found
 */
export function getEnemyImage(enemyId: string, icon?: string): string {
  // If a custom icon is provided and it's an image path (not an emoji), use it
  if (icon && (icon.startsWith('/') || icon.startsWith('http'))) {
    // Normalize path: if it starts with /enemies/, it's already correct
    // If it starts with /src/images, strip that prefix
    if (icon.startsWith('/src/images')) {
      return icon.replace('/src/images', '');
    }
    return icon;
  }

  // Otherwise, look up in predefined enemy images
  return ENEMY_IMAGES[enemyId] || '/enemies/golbin.png'; // Default fallback
}
