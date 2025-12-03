/**
 * Custom Enemy and Boss Types
 */

export enum EnemyTypeCategory {
  REGULAR = 'regular',
  BOSS = 'boss',
  ELITE = 'elite',
}

export interface EnemyAttack {
  name: string;
  damage: number;
  description: string;
  animation?: string; // Animation name/identifier
  cooldown?: number; // Turns before can use again
  statusEffect?: {
    type: string; // poison, stun, burn, etc.
    duration: number; // turns
    damagePerTurn?: number;
  };
}

export interface AnimationData {
  type: string; // 'sprite', 'gif', 'spritesheet'
  path: string; // Path to animation file
  frameCount?: number;
  frameDuration?: number; // ms per frame
  loop?: boolean;
}

export interface CustomEnemy {
  id: string;
  name: string;
  description: string;
  enemyType: EnemyTypeCategory;
  level: number;

  // Stats
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;

  // Visual
  imagePath: string;
  attackAnimation?: AnimationData;

  // Behavior
  attacks: EnemyAttack[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface EnemyEncounter {
  enemyId: string; // References custom_enemies.id
  count: number; // How many of this enemy
  level?: number; // Override enemy level if needed
}

export interface EnemyListItem {
  id: string;
  name: string;
  enemyType: EnemyTypeCategory;
  level: number;
  baseHealth: number;
  imagePath: string;
}
