import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { ChoiceNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const ChoiceNode: React.FC<NodeProps<ChoiceNodeData>> = (props) => {
  return (
    <div className="relative">
      <DungeonNodeBase
        {...props}
        icon="🔀"
        color="#8b5cf6"
      >
        <div className="space-y-1 w-full overflow-hidden">
          <div className="font-semibold mb-1 line-clamp-2 overflow-hidden text-ellipsis">
            {props.data.prompt}
          </div>
          <div className="space-y-1">
            {props.data.options.map((option, index) => (
              <div key={option.id} className="text-xs text-purple-300 truncate">
                {index + 1}. {option.text}
              </div>
            ))}
          </div>
        </div>
      </DungeonNodeBase>

      {/* Multiple output handles for choices */}
      {props.data.options.map((option, index) => {
        const totalOptions = props.data.options.length;
        // Distribute handles evenly along the right edge
        const percentage = totalOptions === 1
          ? 50
          : (index / (totalOptions - 1)) * 80 + 10; // Spread from 10% to 90%

        return (
          <div key={option.id} className="absolute" style={{ top: `${percentage}%`, right: '-12px', transform: 'translateY(-50%)' }}>
            <Handle
              type="source"
              position={Position.Right}
              id={option.id}
              className="w-4 h-4 !bg-purple-500 border-2 border-purple-700 hover:!bg-purple-400 hover:scale-125 transition-all cursor-crosshair"
              style={{ position: 'relative', left: 0, top: 0, transform: 'none' }}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-purple-400 bg-slate-900 px-1 rounded pointer-events-none whitespace-nowrap">
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};
