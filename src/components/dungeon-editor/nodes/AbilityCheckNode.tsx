import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { AbilityCheckNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const AbilityCheckNode: React.FC<NodeProps<AbilityCheckNodeData>> = (props) => {
  return (
    <div className="relative">
      <DungeonNodeBase
        {...props}
        icon="🎲"
        color="#f59e0b"
      >
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-amber-400">{props.data.ability}</span>
            <span className="text-lg font-bold">DC {props.data.dc}</span>
          </div>
          <div className="text-xs text-gray-400">
            {props.data.allowRetry ? 'Retry allowed' : 'One attempt'}
          </div>
        </div>
      </DungeonNodeBase>

      {/* Success handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="success"
        className="w-3 h-3 !bg-green-500 border-2 border-green-700"
        style={{ top: '30%' }}
      />

      {/* Failure handle (right, lower) */}
      <Handle
        type="source"
        position={Position.Right}
        id="failure"
        className="w-3 h-3 !bg-red-500 border-2 border-red-700"
        style={{ top: '70%' }}
      />
    </div>
  );
};
