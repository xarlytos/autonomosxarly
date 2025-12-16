import React from 'react';
import { Plus, RotateCcw, X, Settings, Trash2 } from 'lucide-react';
import { ObsidianCard, ObsidianButton } from '../ui/ObsidianElements';
import type { WidgetType, WidgetConfig } from '../../types/dashboard';

interface DashboardCustomizerProps {
    onAddWidget: (type: WidgetType) => void;
    onRemoveWidget: (id: string) => void;
    onReset: () => void;
    onClose: () => void;
    existingWidgets: WidgetType[];
    currentWidgets: WidgetConfig[];
    getWidgetTitle: (type: WidgetType) => string;
}

const AVAILABLE_WIDGETS = [
    { type: 'kpi-revenue' as WidgetType, name: 'Ingresos', description: 'KPI de ingresos totales', icon: '💰' },
    { type: 'kpi-profitability' as WidgetType, name: 'Rentabilidad', description: 'Margen operativo', icon: '📊' },
    { type: 'kpi-efficiency' as WidgetType, name: 'Eficiencia', description: 'Productividad de agentes', icon: '⚡' },
    { type: 'system-metrics' as WidgetType, name: 'Métricas Sistema', description: 'Latencia, carga, uptime', icon: '🖥️' },
    { type: 'opportunities' as WidgetType, name: 'Oportunidades', description: 'Oportunidades de mercado', icon: '🎯' },
    { type: 'market-topology' as WidgetType, name: 'Topología', description: 'Mapa de mercado', icon: '🗺️' },
    { type: 'event-stream' as WidgetType, name: 'Eventos', description: 'Stream en tiempo real', icon: '📡' },
    { type: 'swarm-status' as WidgetType, name: 'Enjambres', description: 'Estado de enjambres', icon: '🐝' },
];

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
    onAddWidget,
    onRemoveWidget,
    onReset,
    onClose,
    existingWidgets,
    currentWidgets,
    getWidgetTitle
}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <ObsidianCard className="w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Settings size={20} className="text-obsidian-accent" />
                        <h2 className="text-lg font-light text-white">Personalizar Dashboard</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-white/10 text-obsidian-text-muted hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                    {/* Instructions */}
                    <div className="bg-obsidian-accent/10 border border-obsidian-accent/20 rounded-lg p-4">
                        <p className="text-sm text-white mb-2">
                            <strong>Cómo personalizar:</strong>
                        </p>
                        <ul className="text-xs text-obsidian-text-secondary space-y-1 list-disc list-inside">
                            <li>Haz clic en un widget para añadirlo al dashboard</li>
                            <li>Arrastra los widgets para reordenarlos (activa modo personalización)</li>
                            <li>Haz clic en el icono de basura para eliminar un widget</li>
                            <li>Los cambios se guardan automáticamente</li>
                        </ul>
                    </div>

                    {/* Current Widgets */}
                    {currentWidgets.length > 0 && (
                        <div>
                            <h3 className="text-sm text-obsidian-text-muted uppercase tracking-wider mb-3">
                                Widgets Actuales ({currentWidgets.length})
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {currentWidgets.filter(w => w.visible).map(widget => {
                                    const widgetInfo = AVAILABLE_WIDGETS.find(w => w.type === widget.type);
                                    return (
                                        <div
                                            key={widget.id}
                                            className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/10 rounded hover:border-obsidian-accent/30 transition-colors"
                                        >
                                            <span className="text-xl">{widgetInfo?.icon || '📦'}</span>
                                            <div className="flex-1">
                                                <div className="text-sm text-white font-medium">{getWidgetTitle(widget.type)}</div>
                                                <div className="text-xs text-obsidian-text-muted">{widgetInfo?.description || widget.type}</div>
                                            </div>
                                            <button
                                                onClick={() => onRemoveWidget(widget.id)}
                                                className="p-2 rounded hover:bg-red-500/20 text-obsidian-text-muted hover:text-red-400 transition-colors"
                                                title="Eliminar widget"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Widgets */}
                    <div>
                        <h3 className="text-sm text-obsidian-text-muted uppercase tracking-wider mb-3">
                            Widgets Disponibles
                        </h3>
                        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                            {AVAILABLE_WIDGETS.map(widget => {
                                const isAdded = existingWidgets.includes(widget.type);
                                return (
                                    <button
                                        key={widget.type}
                                        onClick={() => !isAdded && onAddWidget(widget.type)}
                                        disabled={isAdded}
                                        className={`flex items-center gap-3 p-4 border rounded transition-all text-left ${isAdded
                                            ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                                            : 'bg-white/[0.02] border-white/10 hover:border-obsidian-accent/50 hover:bg-obsidian-accent/5 cursor-pointer'
                                            }`}
                                    >
                                        <span className="text-2xl">{widget.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-white font-medium">{widget.name}</div>
                                            <div className="text-xs text-obsidian-text-muted truncate">{widget.description}</div>
                                        </div>
                                        {isAdded ? (
                                            <span className="text-xs text-green-500 font-medium">✓ Añadido</span>
                                        ) : (
                                            <Plus size={16} className="text-obsidian-accent flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <ObsidianButton
                            variant="outline"
                            onClick={onReset}
                            className="flex-1"
                        >
                            <RotateCcw size={14} />
                            Restaurar Predeterminado
                        </ObsidianButton>
                        <ObsidianButton
                            variant="primary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Guardar y Cerrar
                        </ObsidianButton>
                    </div>
                </div>
            </ObsidianCard>
        </div>
    );
};
