// Export all node components

export { StartNode } from './StartNode';
export { CombatNode } from './CombatNode';
export { ChoiceNode } from './ChoiceNode';
export { AbilityCheckNode } from './AbilityCheckNode';
export { TrapNode } from './TrapNode';
export { LootNode } from './LootNode';
export { StoryNode } from './StoryNode';
export { BossNode } from './BossNode';
export { EndNode } from './EndNode';

// Node type mapping for React Flow
import { DungeonNodeType } from '../../../types/dungeonEditor';
import { StartNode } from './StartNode';
import { CombatNode } from './CombatNode';
import { ChoiceNode } from './ChoiceNode';
import { AbilityCheckNode } from './AbilityCheckNode';
import { TrapNode } from './TrapNode';
import { LootNode } from './LootNode';
import { StoryNode } from './StoryNode';
import { BossNode } from './BossNode';
import { EndNode } from './EndNode';

export const nodeTypes = {
  [DungeonNodeType.START]: StartNode,
  [DungeonNodeType.COMBAT]: CombatNode,
  [DungeonNodeType.CHOICE]: ChoiceNode,
  [DungeonNodeType.ABILITY_CHECK]: AbilityCheckNode,
  [DungeonNodeType.TRAP]: TrapNode,
  [DungeonNodeType.LOOT]: LootNode,
  [DungeonNodeType.STORY]: StoryNode,
  [DungeonNodeType.BOSS]: BossNode,
  [DungeonNodeType.END]: EndNode,
};
