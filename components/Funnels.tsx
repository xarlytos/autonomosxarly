import React, { useState, useEffect } from 'react';
import {
    GitGraph, Share2, Zap, LayoutTemplate, MoreVertical,
    ArrowRight, Filter, Plus, Users, DollarSign,
    TrendingUp, MousePointer, Eye, Settings, ArrowLeft, Search, Trash2, Copy, Save, X, Gift, Video
} from 'lucide-react';
import { ObsidianCard, ObsidianButton } from './ui/ObsidianElements';

// --- TYPES ---
interface FunnelStep {
    id: string;
    name: string;
    type: 'landing' | 'checkout' | 'upsell' | 'thankyou' | 'optin' | 'webinar' | 'email';
    visitors: number;
    conversions: number;
    revenue?: number;
}

interface Funnel {
    id: string;
    name: string;
    domain: string;
    status: 'active' | 'draft' | 'paused';
    steps: FunnelStep[];
    totalRevenue: number;
    conversionRate: number;
    lastUpdated: string;
    thumbnail?: string;
    pixels: { fb: boolean; ga4: boolean; tiktok: boolean };
}

// --- MOCK INIT DATA ---
const INITIAL_FUNNELS: Funnel[] = [
    {
        id: '1',
        name: 'Webinar High Ticket',
        domain: 'webinar.obsidian.ai',
        status: 'active',
        totalRevenue: 45200,
        conversionRate: 2.4,
        lastUpdated: '2h ago',
        pixels: { fb: true, ga4: true, tiktok: false },
        steps: [
            { id: 's1', name: 'Registration Page', type: 'landing', visitors: 12500, conversions: 3200 },
            { id: 's2', name: 'Webinar Room', type: 'webinar', visitors: 3200, conversions: 2800 },
            { id: 's3', name: 'Checkout', type: 'checkout', visitors: 850, conversions: 120, revenue: 45200 },
            { id: 's4', name: 'Thank You', type: 'thankyou', visitors: 120, conversions: 120 }
        ]
    },
    {
        id: '2',
        name: 'E-book Lead Magnet',
        domain: 'ebook.obsidian.ai',
        status: 'active',
        totalRevenue: 0,
        conversionRate: 18.5,
        lastUpdated: '1d ago',
        pixels: { fb: true, ga4: false, tiktok: true },
        steps: [
            { id: 's1', name: 'Opt-in Page', type: 'landing', visitors: 5600, conversions: 1036 },
            { id: 's2', name: 'Download Page', type: 'thankyou', visitors: 1036, conversions: 800 }
        ]
    }
];

interface FunnelTemplate {
    id: string;
    name: string;
    description: string;
    steps: { name: string; type: FunnelStep['type'] }[];
    icon: any;
    color: string;
}

const FUNNEL_TEMPLATES: FunnelTemplate[] = [
    {
        id: 'webinar-funnel',
        name: 'Webinar High Ticket',
        description: 'Ideal para venta de servicios o productos >$500. Captura, educa y vende.',
        icon: Video,
        color: 'text-purple-400',
        steps: [
            { name: 'Registro al Webinar', type: 'landing' },
            { name: 'Sala de Espera / Intro', type: 'landing' },
            { name: 'Webinar Live/Automated', type: 'webinar' },
            { name: 'Oferta Irresistible', type: 'checkout' },
            { name: 'Gracias & Onboarding', type: 'thankyou' }
        ]
    },
    {
        id: 'product-launch',
        name: 'Product Launch Formula',
        description: 'Serie de 3-4 videos de valor antes de abrir el carrito de compra.',
        icon: TrendingUp,
        color: 'text-green-400',
        steps: [
            { name: 'Opt-in Page', type: 'optin' },
            { name: 'Episodio 1: La Oportunidad', type: 'landing' },
            { name: 'Episodio 2: La Transformación', type: 'landing' },
            { name: 'Episodio 3: El Método', type: 'landing' },
            { name: 'Carta de Ventas', type: 'checkout' }
        ]
    },
    {
        id: 'lead-magnet',
        name: 'Lead Magnet Simple',
        description: 'Captura leads rápidamente entregando un recurso gratuito.',
        icon: Gift,
        color: 'text-blue-400',
        steps: [
            { name: 'Landing Page (Promesa)', type: 'landing' },
            { name: 'Página de Descarga', type: 'thankyou' },
            { name: 'Secuencia de Email', type: 'email' }
        ]
    },
    {
        id: 'blank',
        name: 'Funnel en Blanco',
        description: 'Empieza desde cero y construye tu propia estrategia.',
        icon: LayoutTemplate,
        color: 'text-gray-400',
        steps: [
            { name: 'Landing Page', type: 'landing' }
        ]
    }
];

const Funnels: React.FC = () => {
    // --- STATE ---
    const [funnels, setFunnels] = useState<Funnel[]>(INITIAL_FUNNELS);
    const [view, setView] = useState<'dashboard' | 'builder'>('dashboard');
    const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null);

    // Builder State
    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newFunnelName, setNewFunnelName] = useState('');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Derived State
    const activeFunnel = funnels.find(f => f.id === selectedFunnelId);
    const activeStep = activeFunnel?.steps.find(s => s.id === selectedStepId);

    // --- EFFECTS ---
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- HELPERS ---
    const calculateStats = (steps: FunnelStep[]) => {
        if (steps.length === 0) return { revenue: 0, conversion: 0 };
        const revenue = steps.reduce((acc, step) => acc + (step.revenue || 0), 0);
        const firstStep = steps[0];
        const lastStep = steps[steps.length - 1]; // Simplified
        const conversion = firstStep.visitors > 0 ? (lastStep.conversions / firstStep.visitors) * 100 : 0;
        return { revenue, conversion: parseFloat(conversion.toFixed(1)) };
    };

    // --- HANDLERS: DASHBOARD ---
    const handleCreateFunnel = () => {
        if (!newFunnelName.trim()) return;

        const template = FUNNEL_TEMPLATES.find(t => t.id === selectedTemplate) || FUNNEL_TEMPLATES[3]; // Default to blank if null (though UI prevents it)

        const newSteps: FunnelStep[] = template.steps.map((step, idx) => ({
            id: `s-${Date.now()}-${idx}`,
            name: step.name,
            type: step.type,
            visitors: 0,
            conversions: 0
        }));

        const newFunnel: Funnel = {
            id: Date.now().toString(),
            name: newFunnelName,
            domain: `${newFunnelName.toLowerCase().replace(/\s/g, '-')}.obsidian.ai`,
            status: 'draft',
            totalRevenue: 0,
            conversionRate: 0,
            lastUpdated: 'Just now',
            pixels: { fb: false, ga4: false, tiktok: false },
            steps: newSteps
        };
        setFunnels(prev => [newFunnel, ...prev]);
        setNewFunnelName('');
        setSelectedTemplate(null);
        setShowCreateModal(false);
        setNotification({ message: 'Funnel creado exitosamente', type: 'success' });
        // Auto open
        handleOpenFunnel(newFunnel);
    };

    const handleDeleteFunnel = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este funnel?')) {
            setFunnels(prev => prev.filter(f => f.id !== id));
            setNotification({ message: 'Funnel eliminado', type: 'success' });
        }
    };

    const handleDuplicateFunnel = (e: React.MouseEvent, funnel: Funnel) => {
        e.stopPropagation();
        const copy: Funnel = {
            ...funnel,
            id: Date.now().toString(),
            name: `${funnel.name} (Copy)`,
            status: 'draft',
            lastUpdated: 'Just now'
        };
        setFunnels(prev => [copy, ...prev]);
        setNotification({ message: 'Funnel duplicado', type: 'success' });
    };

    const handleOpenFunnel = (funnel: Funnel) => {
        setSelectedFunnelId(funnel.id);
        setView('builder');
        setSelectedStepId(null);
    };

    // --- HANDLERS: BUILDER ---
    const updateFunnel = (updates: Partial<Funnel>) => {
        if (!activeFunnel) return;
        setFunnels(prev => prev.map(f => f.id === activeFunnel.id ? { ...f, ...updates, lastUpdated: 'Just now' } : f));
    };

    const handleAddStep = (type: FunnelStep['type']) => {
        if (!activeFunnel) return;
        const newStep: FunnelStep = {
            id: `s-${Date.now()}`,
            name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type,
            visitors: 0,
            conversions: 0
        };
        const newSteps = [...activeFunnel.steps, newStep];
        const stats = calculateStats(newSteps);
        updateFunnel({ steps: newSteps, totalRevenue: stats.revenue, conversionRate: stats.conversion });
        setNotification({ message: 'Paso añadido', type: 'success' });
    };

    const handleUpdateStep = (id: string, updates: Partial<FunnelStep>) => {
        if (!activeFunnel) return;
        const newSteps = activeFunnel.steps.map(s => s.id === id ? { ...s, ...updates } : s);
        // Recalculate stats potentially? For now we trust user input or simulated logic
        const stats = calculateStats(newSteps);
        updateFunnel({ steps: newSteps, totalRevenue: stats.revenue, conversionRate: stats.conversion });
    };

    const handleDeleteStep = (id: string) => {
        if (!activeFunnel) return;
        const newSteps = activeFunnel.steps.filter(s => s.id !== id);
        const stats = calculateStats(newSteps);
        updateFunnel({ steps: newSteps, totalRevenue: stats.revenue, conversionRate: stats.conversion });
        setSelectedStepId(null);
        setNotification({ message: 'Paso eliminado', type: 'success' });
    };

    const handlePublish = () => {
        updateFunnel({ status: 'active' });
        setNotification({ message: 'Funnel publicado: LIVE 🚀', type: 'success' });
    };

    return (
        <div className="w-full h-screen bg-[#0B0B0D] text-white flex flex-col font-sans overflow-hidden relative">

            {/* --- NOTIFICATIONS --- */}
            {notification && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1E] border border-obsidian-accent/50 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(106,79,251,0.3)] animate-[slideDown_0.3s_ease-out]">
                    <div className="w-2 h-2 rounded-full bg-obsidian-success animate-pulse"></div>
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* --- CREATE MODAL --- */}
            {showCreateModal && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-[#16161A] border border-white/10 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-light text-white">Crear Nuevo Funnel</h3>
                                <p className="text-sm text-obsidian-text-muted mt-1">Selecciona una plantilla para comenzar o empieza desde cero.</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)}><X className="text-obsidian-text-muted hover:text-white" /></button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {FUNNEL_TEMPLATES.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col h-full ${selectedTemplate === template.id
                                        ? 'bg-obsidian-accent/10 border-obsidian-accent shadow-[0_0_15px_rgba(106,79,251,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${template.id === selectedTemplate ? 'bg-obsidian-accent text-white' : 'bg-[#0B0B0D] text-gray-400'}`}>
                                        <template.icon size={20} className={template.id === selectedTemplate ? 'text-white' : template.color} />
                                    </div>
                                    <h4 className="text-white font-medium mb-2">{template.name}</h4>
                                    <p className="text-xs text-obsidian-text-muted mb-4 flex-1">{template.description}</p>

                                    <div className="space-y-1">
                                        {template.steps.slice(0, 3).map((step, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                                {step.name}
                                            </div>
                                        ))}
                                        {template.steps.length > 3 && (
                                            <div className="text-[10px] text-gray-600 pl-3">+{template.steps.length - 3} pasos más...</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#0B0B0D]/50 flex items-center justify-between">
                            <div className="flex-1 mr-4">
                                <label className="text-xs text-obsidian-text-muted block mb-1.5 ml-1">Nombre del Funnel</label>
                                <input
                                    autoFocus
                                    placeholder="ej. Lanzamiento Q3 Verano"
                                    className="w-full bg-[#0B0B0D] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-obsidian-accent outline-none"
                                    value={newFunnelName}
                                    onChange={(e) => setNewFunnelName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFunnel()}
                                />
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-xs text-obsidian-text-muted hover:text-white">Cancelar</button>
                                <ObsidianButton variant="primary" onClick={handleCreateFunnel} disabled={!newFunnelName.trim() || !selectedTemplate}>
                                    Crear Funnel
                                </ObsidianButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#16161A]/50 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                    {view === 'builder' && (
                        <button
                            onClick={() => { setView('dashboard'); setSelectedFunnelId(null); }}
                            className="p-2 -ml-2 text-obsidian-text-muted hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <GitGraph className="text-obsidian-accent" size={20} />
                        <span className="font-light tracking-wide text-sm text-gray-300">
                            {view === 'dashboard' ? 'FUNNEL STUDIO' : activeFunnel?.name}
                        </span>
                        {view === 'builder' && activeFunnel && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${activeFunnel.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                {activeFunnel.status.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view === 'dashboard' ? (
                        <>
                            <div className="flex items-center text-xs text-obsidian-text-muted gap-4 border-r border-white/10 pr-4 hidden sm:flex">
                                <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500" /> {funnels.filter(f => f.status === 'active').length} Activos</span>
                                <span className="flex items-center gap-1"><Users size={12} className="text-blue-500" /> 45k Visitas</span>
                            </div>
                            <ObsidianButton variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus size={16} className="mr-2" /> Nuevo Funnel
                            </ObsidianButton>
                        </>
                    ) : (
                        <>
                            {/* Builder Actions */}
                            <div className="flex bg-[#0B0B0D] rounded-lg p-1 border border-white/10">
                                <button className="px-3 py-1 rounded text-xs bg-obsidian-accent/20 text-white font-medium">Editor</button>
                                <button className="px-3 py-1 rounded text-xs text-obsidian-text-muted hover:text-white transition-colors">Estadísticas</button>
                            </div>
                            <ObsidianButton variant="secondary" onClick={() => activeFunnel && handleDuplicateFunnel({} as any, activeFunnel)}>
                                <Copy size={16} className="mr-2" /> Clonar
                            </ObsidianButton>
                            <ObsidianButton variant="primary" onClick={handlePublish}>
                                <Zap size={16} className="mr-2" /> Publicar
                            </ObsidianButton>
                        </>
                    )}
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-hidden relative">

                {/* DASHBOARD VIEW */}
                {view === 'dashboard' && (
                    <div className="h-full overflow-y-auto p-6 animate-[fadeIn_0.3s_ease-out]">
                        <div className="max-w-7xl mx-auto space-y-8">

                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Revenue', value: '$' + funnels.reduce((acc, f) => acc + f.totalRevenue, 0).toLocaleString(), change: '+12%', icon: DollarSign, color: 'text-green-400' },
                                    { label: 'Avg. Conversion', value: (funnels.reduce((acc, f) => acc + f.conversionRate, 0) / (funnels.length || 1)).toFixed(1) + '%', change: '+0.5%', icon: TrendingUp, color: 'text-obsidian-accent' },
                                    { label: 'Active Funnels', value: funnels.filter(f => f.status === 'active').length, change: '0', icon: Zap, color: 'text-yellow-400' },
                                    { label: 'Total Steps', value: funnels.reduce((acc, f) => acc + f.steps.length, 0), change: '+5', icon: LayoutTemplate, color: 'text-blue-400' }
                                ].map((stat, i) => (
                                    <ObsidianCard key={i} className="p-4 flex items-center justify-between group hover:border-obsidian-accent/30 transition-all">
                                        <div>
                                            <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">{stat.label === 'Total Revenue' ? 'Ingresos Totales' : stat.label === 'Avg. Conversion' ? 'Conversión Promedio' : stat.label === 'Active Funnels' ? 'Funnels Activos' : 'Total de Pasos'}</p>
                                            <h3 className="text-2xl font-light text-white">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                    </ObsidianCard>
                                ))}
                            </div>

                            {/* Funnel Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-light text-white">Mis Embudos</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-obsidian-text-muted hover:text-white bg-white/5 rounded border border-white/5"><Filter size={14} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {/* Create Card (First Item) */}
                                    <div
                                        onClick={() => setShowCreateModal(true)}
                                        className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center min-h-[250px] text-obsidian-text-muted hover:text-white hover:border-obsidian-accent/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-obsidian-accent/20 flex items-center justify-center mb-3 transition-colors">
                                            <Plus size={24} className="group-hover:text-obsidian-accent" />
                                        </div>
                                        <span className="text-sm font-medium">Crear Nuevo Funnel</span>
                                    </div>

                                    {/* Funnel Cards */}
                                    {funnels.map(funnel => (
                                        <div
                                            key={funnel.id}
                                            onClick={() => handleOpenFunnel(funnel)}
                                            className="group bg-[#16161A] border border-white/5 rounded-xl overflow-hidden hover:border-obsidian-accent/50 hover:shadow-[0_0_20px_rgba(106,79,251,0.1)] transition-all cursor-pointer relative flex flex-col h-[250px]"
                                        >
                                            {/* Top Actions */}
                                            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => handleDuplicateFunnel(e, funnel)} className="p-1.5 bg-black/60 rounded text-white/70 hover:text-white hover:bg-obsidian-accent tooltip" title="Duplicar">
                                                    <Copy size={12} />
                                                </button>
                                                <button onClick={(e) => handleDeleteFunnel(e, funnel.id)} className="p-1.5 bg-black/60 rounded text-red-400 hover:text-red-500 hover:bg-white/10 tooltip" title="Eliminar">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>

                                            {/* Preview */}
                                            <div className="h-32 bg-[#0B0B0D] relative overflow-hidden flex items-center justify-center border-b border-white/5 shrink-0">
                                                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {funnel.steps.slice(0, 3).map((step, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <div className={`w-6 h-8 border rounded-sm ${idx === 0 ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10'}`}></div>
                                                            {idx < funnel.steps.slice(0, 3).length - 1 && <div className="w-2 h-[1px] bg-white/10"></div>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <div className="absolute top-2 left-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] border font-medium ${funnel.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                        }`}>
                                                        {funnel.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-5 flex flex-col justify-between flex-1">
                                                <div>
                                                    <h4 className="text-white font-medium mb-1 truncate group-hover:text-obsidian-accent transition-colors">{funnel.name}</h4>
                                                    <p className="text-[10px] text-obsidian-text-muted">{funnel.steps.length} pasos • {funnel.lastUpdated}</p>
                                                </div>

                                                <div className="flex items-end justify-between pt-2">
                                                    <div>
                                                        <p className="text-[10px] text-obsidian-text-muted">Conversión</p>
                                                        <p className="text-sm font-mono text-white">{funnel.conversionRate}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-obsidian-text-muted text-right">Revenue</p>
                                                        <p className="text-sm font-mono text-green-400">${funnel.totalRevenue.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BUILDER VIEW */}
                {view === 'builder' && activeFunnel && (
                    <div className="h-full w-full flex overflow-hidden">

                        {/* Toolbox Sidebar */}
                        <div className="w-64 border-r border-white/5 bg-[#16161A] flex flex-col hidden md:flex shrink-0">
                            <div className="p-4 border-b border-white/5">
                                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Componentes</h4>
                                <div className="relative">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-obsidian-text-muted" />
                                    <input className="w-full bg-[#0B0B0D] border border-white/10 rounded py-1.5 pl-8 text-xs text-white" placeholder="Buscar..." />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {['landing', 'checkout', 'upsell', 'webinar', 'email', 'thankyou'].map(item => (
                                    <button
                                        key={item}
                                        onClick={() => handleAddStep(item as any)}
                                        className="w-full flex items-center gap-3 p-3 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-colors group text-left"
                                    >
                                        <div className="w-8 h-8 rounded bg-[#0B0B0D] border border-white/10 flex items-center justify-center">
                                            <Plus size={14} className="text-obsidian-text-muted group-hover:text-white" />
                                        </div>
                                        <span className="text-sm text-gray-300 capitalize">{item} page</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Canvas */}
                        <div className="flex-1 bg-[#0B0B0D] relative overflow-hidden bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] flex flex-col">
                            <div className="flex-1 overflow-auto flex items-center justify-center min-h-[500px]">
                                <div className="flex items-center gap-4 px-10 py-20 min-w-max">
                                    {activeFunnel.steps.map((step, index) => (
                                        <React.Fragment key={step.id}>
                                            {/* Connector */}
                                            {index > 0 && (
                                                <div className="w-16 h-0.5 bg-white/10 relative shrink-0">
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                        <span className="text-[10px] text-obsidian-text-muted">
                                                            {step.visitors > 0 && activeFunnel.steps[index - 1].visitors > 0
                                                                ? ((step.visitors / activeFunnel.steps[index - 1].visitors) * 100).toFixed(1) + '%'
                                                                : '0%'}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-white/20 mt-1"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Node */}
                                            <div
                                                onClick={() => setSelectedStepId(step.id)}
                                                className={`w-52 bg-[#16161A] border rounded-xl shadow-xl transition-all group relative cursor-pointer hover:-translate-y-1 shrink-0 ${selectedStepId === step.id
                                                    ? 'border-obsidian-accent shadow-[0_0_20px_rgba(106,79,251,0.2)]'
                                                    : 'border-white/10 hover:border-obsidian-accent/50'
                                                    }`}
                                            >
                                                <div className={`h-1.5 w-full rounded-t-xl ${selectedStepId === step.id ? 'bg-obsidian-accent' : 'bg-transparent'
                                                    }`}></div>

                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className={`p-2 rounded-lg bg-white/5`}>
                                                            <LayoutTemplate size={16} className={selectedStepId === step.id ? 'text-white' : 'text-obsidian-text-muted'} />
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }}
                                                            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <h5 className="text-sm font-medium text-white mb-2 truncate">{step.name}</h5>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-obsidian-text-muted">
                                                        <div className="bg-black/20 p-1 rounded">
                                                            <span className="block text-white font-mono">{step.visitors.toLocaleString()}</span>
                                                            Visitas
                                                        </div>
                                                        <div className="bg-black/20 p-1 rounded">
                                                            <span className="block text-green-400 font-mono">{step.conversions.toLocaleString()}</span>
                                                            Conv.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}

                                    {/* End Placeholder */}
                                    <div className="w-16 h-0.5 bg-white/10 shrink-0"></div>
                                    <div
                                        onClick={() => handleAddStep('landing')}
                                        className="w-14 h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20 hover:text-white hover:border-white hover:bg-white/5 cursor-pointer transition-all shrink-0"
                                    >
                                        <Plus size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inspector Panel (Properties) */}
                        <div className={`w-80 bg-[#16161A] border-l border-white/5 flex flex-col transition-all ${selectedStepId || activeFunnel ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                            {selectedStepId && activeStep ? (
                                <div className="p-0 flex flex-col h-full animate-[slideLeft_0.2s_ease-out]">
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Editar Paso</h4>
                                        <button onClick={() => setSelectedStepId(null)}><X size={14} className="text-obsidian-text-muted hover:text-white" /></button>
                                    </div>
                                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                                        <div>
                                            <label className="text-[10px] text-obsidian-text-muted block mb-1.5">Nombre del Paso</label>
                                            <input
                                                className="w-full bg-[#0B0B0D] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-obsidian-accent outline-none transition-colors"
                                                value={activeStep.name}
                                                onChange={(e) => handleUpdateStep(activeStep.id, { name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-obsidian-text-muted block mb-1.5">Tipo de Página</label>
                                            <select
                                                className="w-full bg-[#0B0B0D] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-obsidian-accent outline-none"
                                                value={activeStep.type}
                                                onChange={(e) => handleUpdateStep(activeStep.id, { type: e.target.value as any })}
                                            >
                                                <option value="landing">Landing Page</option>
                                                <option value="checkout">Checkout</option>
                                                <option value="upsell">Upsell</option>
                                                <option value="thankyou">Thank You</option>
                                                <option value="webinar">Webinar Room</option>
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <h5 className="text-xs font-medium text-white mb-3 flex items-center gap-2"><Settings size={12} /> Simulación de Tráfico</h5>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-[10px] text-obsidian-text-muted mb-1">
                                                        <span>Visitantes</span>
                                                        <span>{activeStep.visitors}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max="50000" step="100"
                                                        className="w-full accent-obsidian-accent"
                                                        value={activeStep.visitors}
                                                        onChange={(e) => handleUpdateStep(activeStep.id, { visitors: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[10px] text-obsidian-text-muted mb-1">
                                                        <span>Conversiones</span>
                                                        <span>{activeStep.conversions}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max={activeStep.visitors} step="10"
                                                        className="w-full accent-green-500"
                                                        value={activeStep.conversions}
                                                        onChange={(e) => handleUpdateStep(activeStep.id, { conversions: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[10px] text-obsidian-text-muted mb-1">
                                                        <span>Revenue ($)</span>
                                                        <span>{activeStep.revenue || 0}</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-[#0B0B0D] border border-white/10 rounded px-2 py-1 text-xs text-white"
                                                        value={activeStep.revenue || 0}
                                                        onChange={(e) => handleUpdateStep(activeStep.id, { revenue: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 space-y-6">
                                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Propiedades del Funnel</h4>
                                    <div>
                                        <label className="text-[10px] text-obsidian-text-muted block mb-1">Nombre</label>
                                        <input
                                            className="w-full bg-[#0B0B0D] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-obsidian-accent outline-none"
                                            value={activeFunnel.name}
                                            onChange={(e) => updateFunnel({ name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-obsidian-text-muted block mb-1">Dominio</label>
                                        <div className="flex items-center bg-[#0B0B0D] border border-white/10 rounded px-3 py-2">
                                            <span className="text-gray-500 text-xs mr-1">https://</span>
                                            <input
                                                className="bg-transparent w-full text-sm text-white outline-none"
                                                value={activeFunnel.domain}
                                                onChange={(e) => updateFunnel({ domain: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <h5 className="text-xs font-medium text-white mb-3">Pixeles & Tracking</h5>
                                        <div className="space-y-2">
                                            {Object.keys(activeFunnel.pixels).map(px => (
                                                <div key={px} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                                                    <span className="text-xs text-gray-300 uppercase">{px} Pixel</span>
                                                    <div
                                                        onClick={() => updateFunnel({ pixels: { ...activeFunnel.pixels, [px]: !activeFunnel.pixels[px as keyof typeof activeFunnel.pixels] } })}
                                                        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${activeFunnel.pixels[px as keyof typeof activeFunnel.pixels] ? 'bg-green-500/20' : 'bg-gray-600/20'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${activeFunnel.pixels[px as keyof typeof activeFunnel.pixels] ? 'right-0.5 bg-green-500' : 'left-0.5 bg-gray-500'}`}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Funnels;
