import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import WorkflowSidebar from './WorkflowSidebar';
import CustomNode from './CustomNode';
import NodeConfigPanel from './NodeConfigPanel';
import { ArrowLeft, Save, Play } from 'lucide-react';

// Persist key
const STORAGE_KEY = 'swarm_automation_workflow';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 250, y: 100 },
        data: { label: 'Manual Trigger', type: 'trigger', description: 'Click to start' },
    },
];

const WorkflowEditor = ({ onBack, onRunSimulation }: { onBack: () => void; onRunSimulation: (nodes: Node[], edges: Edge[]) => void }) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4b5563', strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label'); // Not strictly needed if we map type to label

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowWrapper.current!.getBoundingClientRect().left,
                y: event.clientY - reactFlowWrapper.current!.getBoundingClientRect().top,
            });

            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: 'custom',
                position,
                data: { label: label || type, type: type },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const handleUpdateNode = (nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    // Keep internal type but update data type for icon rendering
                    return { ...node, data: { ...newData } };
                }
                return node;
            })
        );
        setSelectedNode(null);
    };

    const handleDeleteNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        setSelectedNode(null);
    };

    const handleSave = () => {
        const flow = { nodes, edges };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
        alert('¡Workflow guardado localmente!');
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-950 text-white">
            {/* Header */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Editor Visual de Automatización
                        </h1>
                        <p className="text-xs text-gray-500">Modo Borrador</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                        <Save size={16} /> Guardar Workflow
                    </button>
                    <button onClick={() => onRunSimulation(nodes, edges)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                        <Play size={16} /> Ejecutar Prueba
                    </button>
                </div>
            </div>

            {/* Main Body */}
            <div className="flex flex-1 overflow-hidden">
                <WorkflowSidebar />

                <div className="flex-1 relative h-full" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-gray-950"
                    >
                        <Controls className="!bg-gray-800 !border-gray-700 !fill-gray-400" />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#374151" />
                        <Panel position="top-right" className="bg-gray-900/50 p-2 rounded text-xs text-gray-500 backdrop-blur-sm border border-gray-800">
                            Arrastra nodos desde la barra lateral al canvas
                        </Panel>
                    </ReactFlow>

                    {/* Configuration Panel Override (Overlay) */}
                    {selectedNode && (
                        <NodeConfigPanel
                            selectedNode={selectedNode}
                            onUpdateNode={handleUpdateNode}
                            onDeleteNode={handleDeleteNode}
                            onClose={() => setSelectedNode(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default function WorkflowEditorWrapper(props: any) {
    return (
        <ReactFlowProvider>
            <WorkflowEditor {...props} />
        </ReactFlowProvider>
    );
}
