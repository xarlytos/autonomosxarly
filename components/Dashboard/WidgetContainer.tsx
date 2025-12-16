import React from 'react';
import { X, Maximize2, Minimize2, GripVertical } from 'lucide-react';
import { ObsidianCard } from '../ui/ObsidianElements';
import type { WidgetSize } from '../../types/dashboard';

interface WidgetContainerProps {
    id: string;
    title: string;
    size: WidgetSize;
    isCustomizing: boolean;
    onRemove?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
    id,
    title,
    size,
    isCustomizing,
    onRemove,
    children,
    className = ''
}) => {
    return (
        <ObsidianCard className={`h-full flex flex-col ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    {isCustomizing && (
                        <div className="cursor-move text-obsidian-text-muted hover:text-white transition-colors">
                            <GripVertical size={16} />
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-white">{title}</h3>
                </div>

                {isCustomizing && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onRemove}
                            className="p-1.5 rounded hover:bg-red-500/20 text-obsidian-text-muted hover:text-red-400 transition-colors"
                            title="Eliminar widget"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </ObsidianCard>
    );
};
