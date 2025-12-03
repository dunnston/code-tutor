import React from 'react';
import { NodeProps } from 'reactflow';
import { EndNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="🏆"
      color="#10b981"
    >
      <div className="space-y-1">
        <div className="text-emerald-400 font-semibold">Level Complete!</div>
        {props.data.finalRewards && (
          <div className="text-xs text-yellow-400">
            Final Rewards: {props.data.finalRewards.xp} XP, {props.data.finalRewards.gold}g
          </div>
        )}
      </div>
    </DungeonNodeBase>
  );
};
