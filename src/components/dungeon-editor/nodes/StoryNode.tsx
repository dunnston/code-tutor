import React from 'react';
import { NodeProps } from 'reactflow';
import { StoryNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const StoryNode: React.FC<NodeProps<StoryNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="📖"
      color="#6366f1"
    >
      <div className="space-y-1 w-full overflow-hidden">
        <div className="italic text-gray-400 line-clamp-3 overflow-hidden text-ellipsis">
          {props.data.storyText}
        </div>
        {props.data.autoProgress && (
          <div className="text-xs text-indigo-400">Auto-continues</div>
        )}
      </div>
    </DungeonNodeBase>
  );
};
