import React from 'react';
import { NodeProps } from 'reactflow';
import { StartNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="🚪"
      color="#10b981"
    >
      <div className="text-xs text-emerald-400">Entry Point</div>
    </DungeonNodeBase>
  );
};
