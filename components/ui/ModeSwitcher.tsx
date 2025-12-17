import React from 'react';
import { Zap, ZapOff } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export const ModeSwitcher: React.FC = () => {
    const { uiMode, setUIMode } = useGlobalState();

    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex-1">
                <h4 className="text-sm text-white font-medium mb-1">
                    Modo de Interfaz
                </h4>
                <p className="text-xs text-obsidian-text-muted">
                    {uiMode === 'lite'
                        ? 'Funcionalidades esenciales'
                        : 'Todas las funcionalidades'}
                </p>
            </div>

            <button
                onClick={() => setUIMode(uiMode === 'lite' ? 'advanced' : 'lite')}
                className={`
          relative w-14 h-7 rounded-full transition-colors
          ${uiMode === 'advanced'
                        ? 'bg-obsidian-accent'
                        : 'bg-white/20'}
        `}
            >
                <div className={`
          absolute top-1 left-1 w-5 h-5 rounded-full bg-white
          transition-transform duration-200
          ${uiMode === 'advanced' ? 'translate-x-7' : 'translate-x-0'}
          flex items-center justify-center
        `}>
                    {uiMode === 'advanced' ? (
                        <Zap size={12} className="text-obsidian-accent" />
                    ) : (
                        <ZapOff size={12} className="text-gray-400" />
                    )}
                </div>
            </button>
        </div>
    );
};
