import React from 'react';
import { NodeProps } from 'reactflow';
import { CombatNodeData } from '../../../types/dungeonEditor';
import { DungeonNodeBase } from './DungeonNodeBase';

export const CombatNode: React.FC<NodeProps<CombatNodeData>> = (props) => {
  const totalEnemies = props.data.enemies.reduce((sum, e) => sum + e.count, 0);

  return (
    <DungeonNodeBase
      {...props}
      icon="⚔️"
      color="#ef4444"
    >
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Enemies:</span>
          <span className="font-semibold">{totalEnemies}</span>
        </div>
        <div className="flex justify-between">
          <span>Difficulty:</span>
          <span className="capitalize font-semibold text-red-400">
            {props.data.difficulty}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Reward:</span>
          <span className="text-yellow-400">{props.data.rewardXp} XP, {props.data.rewardGold}g</span>
        </div>
      </div>
    </DungeonNodeBase>
  );
};
