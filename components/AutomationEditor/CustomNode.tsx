import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Settings, Play, Zap, Clock, Mail, Database, Globe, Split, AlertTriangle } from 'lucide-react';

const getNodeIcon = (type: string) => {
    switch (type) {
        case 'trigger': return <Zap size={16} />;
        case 'action': return <Play size={16} />;
        case 'condition': return <Split size={16} />;
        case 'delay': return <Clock size={16} />;
        case 'email': return <Mail size={16} />;
        case 'scrape': return <Globe size={16} />;
        case 'database': return <Database size={16} />;
        default: return <Settings size={16} />;
    }
};

const getNodeColor = (type: string) => {
    switch (type) {
        case 'trigger': return 'border-yellow-400 shadow-yellow-400/20';
        case 'action': return 'border-blue-400 shadow-blue-400/20';
        case 'condition': return 'border-purple-400 shadow-purple-400/20';
        case 'delay': return 'border-gray-400 shadow-gray-400/20';
        default: return 'border-gray-500 shadow-gray-500/20';
    }
};

const CustomNode = ({ data, selected }: NodeProps) => {
    const isTrigger = data.type === 'trigger';
    const isCondition = data.type === 'condition';

    return (
        <div className={`px-4 py-2 shadow-lg rounded-lg bg-gray-900 border-2 min-w-[150px] transition-all duration-200 ${selected ? 'border-white shadow-white/20 scale-105' : getNodeColor(data.type)}`}>
            {!isTrigger && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-3 h-3 !bg-gray-400 !border-2 !border-gray-900"
                />
            )}

            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-gray-800 ${selected ? 'text-white' : 'text-gray-300'}`}>
                    {getNodeIcon(data.type)}
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-100">{data.label}</div>
                    <div className="text-xs text-gray-400">{data.description || data.type}</div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-gray-400 !border-2 !border-gray-900"
            />

            {isCondition && (
                <div className="absolute -bottom-6 w-full flex justify-between px-2 text-[10px] text-gray-400 font-mono">
                    <span>TRUE</span>
                    <span>FALSE</span>
                </div>
            )}
        </div>
    );
};

export default memo(CustomNode);
