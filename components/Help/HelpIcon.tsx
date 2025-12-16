import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ObsidianTooltip } from '../ui/ObsidianElements';

interface HelpIconProps {
    content: string | React.ReactNode;
    term?: string;
    size?: number;
    className?: string;
}

export const HelpIcon: React.FC<HelpIconProps> = ({
    content,
    term,
    size = 14,
    className = ''
}) => {
    const tooltipContent = (
        <div className="max-w-xs">
            {term && <div className="font-semibold mb-1 text-obsidian-accent">{term}</div>}
            <div className="text-xs leading-relaxed">{content}</div>
        </div>
    );

    return (
        <ObsidianTooltip content={tooltipContent} position="top">
            <HelpCircle
                size={size}
                className={`text-obsidian-text-muted hover:text-obsidian-accent cursor-help transition-colors inline-block ${className}`}
            />
        </ObsidianTooltip>
    );
};
