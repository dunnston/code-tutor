import React from 'react';
import { NodeProps } from 'reactflow';
import { BossNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const BossNode: React.FC<NodeProps<BossNodeData>> = (props) => {
  return (
    <DungeonNodeBase
      {...props}
      icon="👹"
      color="#be123c"
    >
      <div className="space-y-1">
        <div className="font-bold text-rose-400 text-sm">{props.data.bossName}</div>
        <div className="flex justify-between">
          <span>Level {props.data.bossLevel}</span>
          <span className="text-red-400">{props.data.health} HP</span>
        </div>
        <div className="text-xs text-gray-400">
          {props.data.abilities.length} abilities
        </div>
        <div className="text-xs text-yellow-400">
          {props.data.rewardXp} XP, {props.data.rewardGold}g
        </div>
      </div>
    </DungeonNodeBase>
  );
};
