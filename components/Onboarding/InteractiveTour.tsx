
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { ObsidianButton, ObsidianCard } from '../ui/ObsidianElements';

export interface TourStep {
    target: string; // CSS selector
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface InteractiveTourProps {
    steps: TourStep[];
    isOpen: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({ steps, isOpen, onComplete, onSkip }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);

    const currentStep = steps[currentStepIndex];

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const element = document.querySelector(currentStep.target);
            if (element) {
                const rect = element.getBoundingClientRect();

                // Spotlight position
                const PADDING = 8;
                const newPos = {
                    top: rect.top + window.scrollY - PADDING,
                    left: rect.left + window.scrollX - PADDING,
                    width: rect.width + (PADDING * 2),
                    height: rect.height + (PADDING * 2)
                };
                setPosition(newPos);

                // Popover position calculation
                const POPOVER_WIDTH = 320;
                const POPOVER_HEIGHT = 200; // Approx
                const MARGIN = 16;

                let popTop = newPos.top + newPos.height + MARGIN;
                let popLeft = newPos.left;

                // Simple collision detection/adjustment
                if (popLeft + POPOVER_WIDTH > window.innerWidth) {
                    popLeft = window.innerWidth - POPOVER_WIDTH - MARGIN;
                }

                // If bottom, check if fits, else put top
                // ... simplistic logic for now

                setPopoverPos({ top: popTop, left: popLeft });

                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Element not found - skip or fallback?
                console.warn(`Tour target not found: ${currentStep.target}`);
            }
        };

        // Small delay to ensure rendering
        const timer = setTimeout(updatePosition, 500);
        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        };
    }, [currentStepIndex, isOpen, currentStep.target]);

    if (!isOpen || !position || !popoverPos) return null;

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <>
            {/* Backdrop using simplified SVGs or just divs for the "hole" effect */}
            {/* We use a high z-index div with a big border/outline to create the focus effect? 
            Or usually simpler: Semi-transparent divs around the spotlight.
        */}
            <div className="fixed inset-0 z-[60] overflow-hidden pointer-events-none">
                {/* Top */}
                <div className="absolute bg-black/70 backdrop-blur-[1px] transition-all duration-300 ease-in-out pointer-events-auto"
                    style={{ top: 0, left: 0, right: 0, height: position.top }} />
                {/* Bottom */}
                <div className="absolute bg-black/70 backdrop-blur-[1px] transition-all duration-300 ease-in-out pointer-events-auto"
                    style={{ top: position.top + position.height, left: 0, right: 0, bottom: 0 }} />
                {/* Left */}
                <div className="absolute bg-black/70 backdrop-blur-[1px] transition-all duration-300 ease-in-out pointer-events-auto"
                    style={{ top: position.top, left: 0, width: position.left, height: position.height }} />
                {/* Right */}
                <div className="absolute bg-black/70 backdrop-blur-[1px] transition-all duration-300 ease-in-out pointer-events-auto"
                    style={{ top: position.top, left: position.left + position.width, right: 0, height: position.height }} />

                {/* Spotlight Border */}
                <div className="absolute border-2 border-obsidian-accent rounded transition-all duration-300 ease-in-out shadow-[0_0_30px_rgba(106,79,251,0.5)]"
                    style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        height: position.height
                    }}
                />
            </div>

            {/* Tooltip Card */}
            <div className="fixed z-[70] transition-all duration-300 ease-in-out"
                style={{
                    top: popoverPos.top,
                    left: popoverPos.left,
                    opacity: 1
                }}>
                <ObsidianCard className="w-[320px] shadow-2xl border-obsidian-accent/30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-obsidian-accent uppercase tracking-widest bg-obsidian-accent/10 px-2 py-0.5 rounded">
                            Paso {currentStepIndex + 1} de {steps.length}
                        </span>
                        <button onClick={onSkip} className="text-obsidian-text-muted hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    </div>

                    <h3 className="text-lg text-white font-light mb-2">{currentStep.title}</h3>
                    <p className="text-sm text-obsidian-text-secondary leading-relaxed mb-6">
                        {currentStep.content}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-1">
                            {steps.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentStepIndex ? 'bg-obsidian-accent' : 'bg-white/10'}`} />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {currentStepIndex > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className="px-3 py-1.5 rounded text-xs text-obsidian-text-muted hover:text-white transition-colors"
                                >
                                    Atrás
                                </button>
                            )}
                            <ObsidianButton
                                size="sm"
                                variant="primary"
                                onClick={handleNext}
                                className="bg-obsidian-accent hover:bg-obsidian-accent/80"
                            >
                                {currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                {currentStepIndex < steps.length - 1 && <ChevronRight size={14} className="ml-1" />}
                            </ObsidianButton>
                        </div>
                    </div>
                </ObsidianCard>
            </div>
        </>
    );
};
