import React from 'react';
import { DungeonNodeType } from '../../types/dungeonEditor';

interface NodePaletteProps {
  onAddNode: (nodeType: DungeonNodeType) => void;
}

interface NodeTypeInfo {
  type: DungeonNodeType;
  icon: string;
  label: string;
  color: string;
  description: string;
}

const nodeTypeInfo: NodeTypeInfo[] = [
  {
    type: DungeonNodeType.START,
    icon: '🚪',
    label: 'Start',
    color: '#10b981',
    description: 'Entry point',
  },
  {
    type: DungeonNodeType.STORY,
    icon: '📖',
    label: 'Story',
    color: '#6366f1',
    description: 'Narrative text',
  },
  {
    type: DungeonNodeType.COMBAT,
    icon: '⚔️',
    label: 'Combat',
    color: '#ef4444',
    description: 'Enemy encounter',
  },
  {
    type: DungeonNodeType.BOSS,
    icon: '👹',
    label: 'Boss',
    color: '#be123c',
    description: 'Boss fight',
  },
  {
    type: DungeonNodeType.CHOICE,
    icon: '🔀',
    label: 'Choice',
    color: '#8b5cf6',
    description: 'Branching decision',
  },
  {
    type: DungeonNodeType.ABILITY_CHECK,
    icon: '🎲',
    label: 'Ability Check',
    color: '#f59e0b',
    description: 'Skill check',
  },
  {
    type: DungeonNodeType.TRAP,
    icon: '💥',
    label: 'Trap',
    color: '#dc2626',
    description: 'Damage trap',
  },
  {
    type: DungeonNodeType.LOOT,
    icon: '💎',
    label: 'Loot',
    color: '#06b6d4',
    description: 'Rewards',
  },
  {
    type: DungeonNodeType.END,
    icon: '🏆',
    label: 'End',
    color: '#10b981',
    description: 'Level complete',
  },
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🎨</span>
        Node Palette
      </h2>

      <div className="space-y-2">
        {nodeTypeInfo.map((nodeInfo) => (
          <button
            key={nodeInfo.type}
            onClick={() => onAddNode(nodeInfo.type)}
            className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600
                     transition-all duration-200 border-2 border-transparent
                     hover:border-opacity-50 group"
            style={{
              borderColor: `${nodeInfo.color}40`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: `${nodeInfo.color}20` }}
              >
                {nodeInfo.icon}
              </div>
              <div className="flex-1">
                <div
                  className="font-semibold text-sm"
                  style={{ color: nodeInfo.color }}
                >
                  {nodeInfo.label}
                </div>
                <div className="text-xs text-gray-400">{nodeInfo.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-slate-900 rounded-lg border border-slate-700">
        <p className="text-xs text-gray-400">
          <strong className="text-white">Tip:</strong> Click a node type to add it to the canvas. Drag nodes to reposition them and connect handles to create paths.
        </p>
      </div>
    </div>
  );
};
