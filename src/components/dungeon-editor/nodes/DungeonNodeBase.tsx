import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { DungeonNodeData } from '../../../types/dungeonEditor';

interface DungeonNodeBaseProps extends NodeProps<DungeonNodeData> {
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
}

export const DungeonNodeBase: React.FC<DungeonNodeBaseProps> = ({
  data,
  icon,
  color,
  selected,
  children,
}) => {
  return (
    <div
      className={`
        rounded-lg border-2 bg-slate-800 shadow-lg min-w-[180px] max-w-[280px]
        transition-all duration-200
        ${selected ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900' : ''}
      `}
      style={{ borderColor: color }}
    >
      {/* Top Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-slate-400 border-2 border-slate-600"
      />

      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-md flex items-center gap-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <div className="text-lg" style={{ color }}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 uppercase font-semibold">
            {data.nodeType}
          </div>
          <div className="text-sm font-medium text-white truncate">
            {data.label}
          </div>
        </div>
      </div>

      {/* Body */}
      {children && (
        <div className="px-3 py-2 text-xs text-gray-300 border-t border-slate-700 break-words">
          {children}
        </div>
      )}

      {/* Bottom Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-400 border-2 border-slate-600"
      />
    </div>
  );
};
