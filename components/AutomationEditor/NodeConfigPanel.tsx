import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { X, Save, Trash2 } from 'lucide-react';

interface NodeConfigPanelProps {
    selectedNode: Node | null;
    onUpdateNode: (nodeId: string, data: any) => void;
    onDeleteNode: (nodeId: string) => void;
    onClose: () => void;
}

const NodeConfigPanel = ({ selectedNode, onUpdateNode, onDeleteNode, onClose }: NodeConfigPanelProps) => {
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');

    // Custom fields based on type
    const [duration, setDuration] = useState('5000');
    const [target, setTarget] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setLabel(selectedNode.data.label || '');
            setDescription(selectedNode.data.description || '');
            setDuration(selectedNode.data.duration || '5000');
            setTarget(selectedNode.data.target || '');
        }
    }, [selectedNode]);

    if (!selectedNode) return null;

    const handleSave = () => {
        onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            label,
            description,
            duration,
            target
        });
    };

    return (
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 flex flex-col h-full absolute right-0 top-0 shadow-xl z-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-100">Propiedades</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Etiqueta</label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
                    <textarea
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none h-20 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="h-px bg-gray-800 my-4" />

                {selectedNode.type === 'delay' && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Duración (ms)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                )}

                {(selectedNode.type === 'email' || selectedNode.type === 'scrape') && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Objetivo (URL/Email)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        />
                    </div>
                )}

                {selectedNode.data.type === 'trigger' && (
                    <div className="p-3 bg-blue-900/20 border border-blue-900/50 rounded text-xs text-blue-200">
                        Este es un nodo de inicio. La ejecución comienza aquí.
                    </div>
                )}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2"
                >
                    <Save size={16} /> Guardar
                </button>
                <button
                    onClick={() => onDeleteNode(selectedNode.id)}
                    className="bg-red-900/50 hover:bg-red-900 border border-red-900 text-red-200 p-2 rounded"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NodeConfigPanel;
