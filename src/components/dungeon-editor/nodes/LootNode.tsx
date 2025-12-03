import React from 'react';
import { NodeProps } from 'reactflow';
import { LootNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const LootNode: React.FC<NodeProps<LootNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="💎"
      color="#06b6d4"
    >
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Items:</span>
          <span className="font-semibold text-cyan-400">{props.data.items.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Gold:</span>
          <span className="font-semibold text-yellow-400">{props.data.gold}g</span>
        </div>
        <div className="flex justify-between">
          <span>XP:</span>
          <span className="font-semibold text-green-400">{props.data.xp}</span>
        </div>
      </div>
    </DungeonNodeBase>
  );
};
