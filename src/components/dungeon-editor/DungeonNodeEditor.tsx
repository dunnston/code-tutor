import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './nodes';
import { NodePalette } from './NodePalette';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { LevelToolbar } from './LevelToolbar';
import { LevelManager } from './LevelManager';
import { LevelPlayerEnhanced } from './LevelPlayerEnhanced';
import { getCurrentProfile, ensureProfileHasDbUser } from '../../lib/profiles';
import { LevelSequencer } from './LevelSequencer';
import { EnemyManager } from './EnemyManager';
import { QuestionManager } from './QuestionManager';
import { ItemManager } from './ItemManager';
import { DungeonNode, DungeonLevel, DungeonNodeType, DungeonNodeData } from '../../types/dungeonEditor';
import { invoke } from '@tauri-apps/api/core';

interface DungeonNodeEditorProps {
  initialLevel?: DungeonLevel;
  onSave?: (level: DungeonLevel) => void;
  onLoad?: () => void;
  onClose?: () => void;
}

const DungeonNodeEditorInner: React.FC<DungeonNodeEditorProps> = ({
  initialLevel,
  onSave,
  onLoad,
  onClose,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<DungeonNodeData>(initialLevel?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialLevel?.edges || []);
  const [selectedNode, setSelectedNode] = useState<DungeonNode | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [showLevelManager, setShowLevelManager] = useState(false);
  const [showLevelPlayer, setShowLevelPlayer] = useState(false);
  const [showLevelSequencer, setShowLevelSequencer] = useState(false);
  const [showEnemyManager, setShowEnemyManager] = useState(false);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [showItemManager, setShowItemManager] = useState(false);
  const [levelMetadata, setLevelMetadata] = useState(
    initialLevel?.metadata || {
      id: crypto.randomUUID(),
      name: 'Untitled Level',
      description: '',
      recommendedLevel: 1,
      difficulty: 'medium' as const,
      estimatedDuration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      version: 1,
    }
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as DungeonNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback(
    (nodeType: DungeonNodeType) => {
      if (!reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 50,
      });

      const newNode: DungeonNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: createDefaultNodeData(nodeType),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<DungeonNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...newData },
            };
          }
          return node;
        })
      );

      // Update selected node if it's the one being edited
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode((prev) =>
          prev ? { ...prev, data: { ...prev.data, ...newData } } : null
        );
      }
    },
    [setNodes, selectedNode]
  );

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const handleSave = useCallback(async () => {
    const level: DungeonLevel = {
      metadata: {
        ...levelMetadata,
        updatedAt: new Date().toISOString(),
      },
      nodes,
      edges,
    };

    if (onSave) {
      onSave(level);
    } else {
      // Save to Tauri backend
      try {
        await invoke('save_dungeon_level', { level });
        alert('✅ Level saved successfully!');
      } catch (err) {
        console.error('Failed to save level:', err);
        alert('❌ Failed to save level: ' + err);
      }
    }
  }, [levelMetadata, nodes, edges, onSave]);

  const handleLoadFromManager = useCallback((level: DungeonLevel) => {
    setLevelMetadata(level.metadata);
    setNodes(level.nodes);
    setEdges(level.edges);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleValidate = useCallback(() => {
    const errors: string[] = [];

    // Check for start node
    const startNodes = nodes.filter((n) => n.type === DungeonNodeType.START);
    if (startNodes.length === 0) {
      errors.push('Level must have at least one Start node');
    } else if (startNodes.length > 1) {
      errors.push('Level should have only one Start node');
    }

    // Check for end node
    const endNodes = nodes.filter((n) => n.type === DungeonNodeType.END);
    if (endNodes.length === 0) {
      errors.push('Level must have at least one End node');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const disconnectedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id) && nodes.length > 1
    );
    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} disconnected node(s) found`);
    }

    if (errors.length === 0) {
      alert('✅ Level validation passed! No errors found.');
    } else {
      alert('❌ Validation errors:\n\n' + errors.join('\n'));
    }
  }, [nodes, edges]);

  const handleNewLevel = useCallback(() => {
    if (confirm('Create a new level? Unsaved changes will be lost.')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setLevelMetadata({
        id: crypto.randomUUID(),
        name: 'Untitled Level',
        description: '',
        recommendedLevel: 1,
        difficulty: 'medium',
        estimatedDuration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: false,
        version: 1,
      });
    }
  }, [setNodes, setEdges]);

  const handlePlayLevel = useCallback(async () => {
    // Validate first
    const startNodes = nodes.filter((n) => n.type === DungeonNodeType.START);
    if (startNodes.length === 0) {
      alert('❌ Cannot play level: No start node found. Add a start node first.');
      return;
    }

    // Ensure profile has a database user ID
    const profile = getCurrentProfile();
    if (profile && !profile.dbUserId) {
      try {
        await ensureProfileHasDbUser(profile);
      } catch (error) {
        console.error('Failed to ensure profile has database user:', error);
        alert('Failed to initialize user profile. Please try again.');
        return;
      }
    }

    setShowLevelPlayer(true);
  }, [nodes]);

  const handleSequenceLevels = useCallback(() => {
    setShowLevelSequencer(true);
  }, []);

  const handleManageEnemies = useCallback(() => {
    setShowEnemyManager(true);
  }, []);

  const handleManageQuestions = useCallback(() => {
    setShowQuestionManager(true);
  }, []);

  const handleManageItems = useCallback(() => {
    setShowItemManager(true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      {/* Top Toolbar */}
      <LevelToolbar
        levelMetadata={levelMetadata}
        onUpdateMetadata={setLevelMetadata}
        onNew={handleNewLevel}
        onSave={handleSave}
        onLoad={() => setShowLevelManager(true)}
        onValidate={handleValidate}
        onClose={onClose}
        onPlayLevel={handlePlayLevel}
        onSequenceLevels={handleSequenceLevels}
        onManageEnemies={handleManageEnemies}
        onManageQuestions={handleManageQuestions}
        onManageItems={handleManageItems}
      />

      {/* Level Manager Modal */}
      {showLevelManager && (
        <LevelManager
          onLoadLevel={handleLoadFromManager}
          onClose={() => setShowLevelManager(false)}
        />
      )}

      {/* Level Player - Full Screen Experience */}
      {showLevelPlayer && (() => {
        const profile = getCurrentProfile();
        const userId = profile?.dbUserId || 1; // Use numeric database user ID, fallback to 1

        return (
          <LevelPlayerEnhanced
            level={{ metadata: levelMetadata, nodes, edges }}
            userId={userId}
            onExit={() => setShowLevelPlayer(false)}
            onComplete={(rewards) => {
              console.log('Level completed with rewards:', rewards);
              setShowLevelPlayer(false);
            }}
          />
        );
      })()}

      {/* Level Sequencer Modal */}
      {showLevelSequencer && (
        <LevelSequencer onClose={() => setShowLevelSequencer(false)} />
      )}

      {/* Enemy Manager Modal */}
      {showEnemyManager && (
        <EnemyManager onClose={() => setShowEnemyManager(false)} />
      )}

      {/* Question Manager Modal */}
      {showQuestionManager && (
        <QuestionManager onClose={() => setShowQuestionManager(false)} />
      )}

      {/* Item Manager Modal */}
      {showItemManager && (
        <ItemManager onClose={() => setShowItemManager(false)} />
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Palette */}
        <NodePalette onAddNode={addNode} />

        {/* Center: React Flow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-slate-950"
          >
            <Background color="#334155" variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls className="bg-slate-800 border border-slate-700" />
            <MiniMap
              className="bg-slate-800 border border-slate-700"
              nodeColor={(node) => {
                const colors: Record<string, string> = {
                  start: '#10b981',
                  combat: '#ef4444',
                  choice: '#8b5cf6',
                  abilityCheck: '#f59e0b',
                  trap: '#dc2626',
                  loot: '#06b6d4',
                  story: '#6366f1',
                  boss: '#be123c',
                  end: '#10b981',
                };
                return colors[node.type || 'default'] || '#64748b';
              }}
            />

            {/* Instructions Panel */}
            {nodes.length === 0 && (
              <Panel position="top-center" className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">
                  👈 Select a node type from the palette to get started
                </p>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Right: Properties Panel */}
        <NodePropertiesPanel
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteSelectedNode}
        />
      </div>
    </div>
  );
};

// Helper function to create default node data
function createDefaultNodeData(nodeType: DungeonNodeType): DungeonNodeData {
  const baseData = {
    label: `New ${nodeType}`,
    nodeType,
  };

  switch (nodeType) {
    case DungeonNodeType.START:
      return { ...baseData, nodeType: DungeonNodeType.START, welcomeMessage: 'Welcome to the dungeon!' };
    case DungeonNodeType.COMBAT:
      return { ...baseData, nodeType: DungeonNodeType.COMBAT, enemies: [], difficulty: 'medium' as const, rewardXp: 100, rewardGold: 50 };
    case DungeonNodeType.CHOICE:
      return { ...baseData, nodeType: DungeonNodeType.CHOICE, prompt: 'What do you do?', options: [] };
    case DungeonNodeType.ABILITY_CHECK:
      return { ...baseData, nodeType: DungeonNodeType.ABILITY_CHECK, ability: 'STR' as const, dc: 10, successText: 'Success!', failureText: 'Failure!', allowRetry: false };
    case DungeonNodeType.TRAP:
      return { ...baseData, nodeType: DungeonNodeType.TRAP, trapType: 'Spike Trap', damage: 10, description: 'A hidden trap!' };
    case DungeonNodeType.LOOT:
      return { ...baseData, nodeType: DungeonNodeType.LOOT, items: [], gold: 100, xp: 50, description: 'You find treasure!' };
    case DungeonNodeType.STORY:
      return { ...baseData, nodeType: DungeonNodeType.STORY, storyText: 'Story text here...', autoProgress: false };
    case DungeonNodeType.BOSS:
      return { ...baseData, nodeType: DungeonNodeType.BOSS, bossName: 'Boss Name', bossType: 'dragon' as const, bossLevel: 10, health: 500, abilities: [], rewardXp: 1000, rewardGold: 500, rewardItems: [], flavorText: 'A mighty boss appears!' };
    case DungeonNodeType.END:
      return { ...baseData, nodeType: DungeonNodeType.END, completionMessage: 'Congratulations!' };
    default:
      return baseData as DungeonNodeData;
  }
}

// Wrapper with ReactFlowProvider
export const DungeonNodeEditor: React.FC<DungeonNodeEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DungeonNodeEditorInner {...props} />
    </ReactFlowProvider>
  );
};
