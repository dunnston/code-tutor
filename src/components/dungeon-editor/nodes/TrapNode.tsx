import React from 'react';
import { NodeProps } from 'reactflow';
import { TrapNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const TrapNode: React.FC<NodeProps<TrapNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="💥"
      color="#dc2626"
    >
      <div className="space-y-1">
        <div className="font-semibold text-red-400">{props.data.trapType}</div>
        <div className="flex justify-between">
          <span>Damage:</span>
          <span className="font-bold text-red-500">{props.data.damage}</span>
        </div>
        {props.data.avoidCheck && (
          <div className="text-xs text-amber-400">
            {props.data.avoidCheck.ability} DC {props.data.avoidCheck.dc} to avoid
          </div>
        )}
      </div>
    </DungeonNodeBase>
  );
};
