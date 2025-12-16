import React, { useState, useMemo } from 'react';
import { Book, FileText, Search, X, ChevronRight, LayoutPanelTop, Lock, Zap, TrendingUp, Target } from 'lucide-react';
import { ObsidianCard, ObsidianButton, ObsidianInput } from '../ui/ObsidianElements';
import { GLOSSARY, GlossaryTerm, searchTerms, getTermsByCategory } from '../../data/glossary';
import { GUIDES, Guide } from '../../data/guides';

interface HelpCenterProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'glossary' | 'guides';
}

type Tab = 'glossary' | 'guides';

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose, initialTab = 'glossary' }) => {
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GlossaryTerm['category'] | 'ALL'>('ALL');
    const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null); // New state for tracking selected guide

    const categories: { id: GlossaryTerm['category'] | 'ALL'; label: string }[] = [
        { id: 'ALL', label: 'Todos' },
        { id: 'negotiation', label: 'Negociación' },
        { id: 'finance', label: 'Finanzas' },
        { id: 'security', label: 'Seguridad' },
        { id: 'automation', label: 'Automatización' },
        { id: 'analytics', label: 'Analítica' },
        { id: 'general', label: 'General' },
    ];

    const filteredTerms = useMemo(() => {
        let terms = Object.values(GLOSSARY);

        if (searchQuery) {
            terms = searchTerms(searchQuery);
        }

        if (selectedCategory !== 'ALL') {
            terms = terms.filter(t => t.category === selectedCategory);
        }

        return terms;
    }, [searchQuery, selectedCategory]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-6xl h-[90vh] bg-[#0B0B0D] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/5">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[#16161A]/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-obsidian-accent/20 to-transparent border border-obsidian-accent/20 flex items-center justify-center shadow-[0_0_15px_rgba(106,79,251,0.1)]">
                            <Book className="text-obsidian-accent" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-white tracking-wide">CENTRO DE AYUDA</h2>
                            <p className="text-sm text-obsidian-text-muted">Documentación y Glosario del Sistema</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex bg-[#0F0F12] p-1.5 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('glossary')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'glossary' ? 'bg-obsidian-accent text-white shadow-lg shadow-obsidian-accent/20' : 'text-obsidian-text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                Glosario
                            </button>
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'guides' ? 'bg-obsidian-accent text-white shadow-lg shadow-obsidian-accent/20' : 'text-obsidian-text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                Guías de Usuario
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/10 rounded-full transition-colors text-obsidian-text-muted hover:text-white hover:rotate-90 duration-300"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex bg-gradient-to-b from-[#0B0B0D] to-[#0F0F12]">

                    {/* TAB: GLOSARIO */}
                    {activeTab === 'glossary' && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar Filters & List */}
                            <div className="w-80 border-r border-white/10 flex flex-col bg-[#0F0F12]/50 backdrop-blur-sm">
                                <div className="p-6 space-y-6 border-b border-white/5">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-text-muted group-focus-within:text-obsidian-accent transition-colors" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Buscar término..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-obsidian-accent/50 focus:bg-white/10 focus:ring-1 focus:ring-obsidian-accent/50 outline-none placeholder-white/20 transition-all font-light"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-300 ${selectedCategory === cat.id
                                                    ? 'bg-obsidian-accent/20 text-white border-obsidian-accent/50 shadow-[0_0_10px_rgba(106,79,251,0.2)]'
                                                    : 'bg-white/5 text-obsidian-text-muted border-transparent hover:bg-white/10 hover:text-white hover:border-white/10'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                    {filteredTerms.length > 0 ? (
                                        <div className="space-y-1">
                                            {filteredTerms.map(term => (
                                                <button
                                                    key={term.id}
                                                    onClick={() => setSelectedTerm(term)}
                                                    className={`w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-between group ${selectedTerm?.id === term.id ? 'bg-gradient-to-r from-obsidian-accent/10 to-transparent border-l-2 border-obsidian-accent' : 'border-l-2 border-transparent hover:pl-5'}`}
                                                >
                                                    <div>
                                                        <p className={`text-sm font-medium transition-colors ${selectedTerm?.id === term.id ? 'text-white' : 'text-obsidian-text-primary group-hover:text-white'}`}>
                                                            {term.term}
                                                        </p>
                                                        <span className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">{categories.find(c => c.id === term.category)?.label}</span>
                                                    </div>
                                                    <ChevronRight size={14} className={`text-obsidian-text-muted transition-all duration-300 ${selectedTerm?.id === term.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-obsidian-text-muted flex flex-col items-center">
                                            <Search size={32} className="mb-3 opacity-20" />
                                            <p className="text-sm">No se encontraron términos</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Term Detail View */}
                            <div className="flex-1 overflow-y-auto p-12 bg-gradient-radial from-[#121215] to-[#0B0B0D]">
                                {selectedTerm ? (
                                    <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                        <div className="relative">
                                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-obsidian-accent/5 rounded-full blur-[100px] pointer-events-none" />

                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-obsidian-accent/10 text-obsidian-accent border border-obsidian-accent/20 shadow-[0_0_10px_rgba(106,79,251,0.15)] backdrop-blur-sm">
                                                    {categories.find(c => c.id === selectedTerm.category)?.label}
                                                </span>
                                                {selectedTerm.formula && (
                                                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm">
                                                        Fórmula
                                                    </span>
                                                )}
                                            </div>
                                            <h1 className="text-5xl font-extralight text-white mb-6 tracking-tight">{selectedTerm.term}</h1>
                                            <p className="text-xl text-obsidian-text-primary leading-loose font-light border-l-4 border-obsidian-accent/30 pl-6">
                                                {selectedTerm.fullDefinition}
                                            </p>
                                        </div>

                                        {selectedTerm.example && (
                                            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                                                <h3 className="text-xs font-bold text-obsidian-text-muted uppercase mb-4 flex items-center gap-2">
                                                    <Target size={14} className="text-obsidian-accent" /> Ejemplo Práctico
                                                </h3>
                                                <p className="text-base text-white/90 italic font-serif leading-relaxed px-4 border-l-2 border-white/10">
                                                    "{selectedTerm.example}"
                                                </p>
                                            </div>
                                        )}

                                        {selectedTerm.formula && (
                                            <div className="bg-[#0A0A0C] rounded-2xl border border-white/10 overflow-hidden group hover:border-obsidian-accent/30 transition-colors">
                                                <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                                                    <h3 className="text-xs font-bold text-obsidian-text-muted uppercase flex items-center gap-2">
                                                        <span className="text-xs">∑</span> Fórmula Matemática
                                                    </h3>
                                                </div>
                                                <div className="p-6 font-mono text-base text-green-400 bg-black/40 group-hover:text-green-300 transition-colors">
                                                    {selectedTerm.formula}
                                                </div>
                                            </div>
                                        )}

                                        {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-bold text-obsidian-text-muted uppercase mb-4 tracking-widest">Términos Relacionados</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedTerm.relatedTerms.map(relatedId => {
                                                        const related = GLOSSARY[relatedId];
                                                        if (!related) return null;
                                                        return (
                                                            <button
                                                                key={relatedId}
                                                                onClick={() => setSelectedTerm(related)}
                                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-obsidian-accent/30 hover:scale-105 active:scale-95 text-xs text-white transition-all duration-300 shadow-lg hover:shadow-obsidian-accent/10"
                                                            >
                                                                {related.term}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-obsidian-text-muted opacity-30 select-none">
                                        <div className="p-8 rounded-full bg-white/5 mb-6 animate-pulse">
                                            <Book size={64} strokeWidth={1} />
                                        </div>
                                        <p className="text-lg font-light tracking-wide">Selecciona un término para ver su definición completa</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: GUIDES */}
                    {activeTab === 'guides' && (
                        <div className="flex-1 overflow-hidden relative">
                            {/* Guide List View */}
                            <div className={`absolute inset-0 p-12 overflow-y-auto transition-transform duration-500 ease-out ${selectedGuide ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                    {GUIDES.map((guide) => {
                                        // Map string icon name to Lucide component
                                        const IconComponent =
                                            guide.icon === 'target' ? Target :
                                                guide.icon === 'trending-up' ? TrendingUp :
                                                    guide.icon === 'lock' ? Lock :
                                                        guide.icon === 'zap' ? Zap : Book;

                                        return (
                                            <div
                                                key={guide.id}
                                                onClick={() => setSelectedGuide(guide)}
                                                className="cursor-pointer h-full"
                                            >
                                                <ObsidianCard
                                                    className="hover:bg-white/5 border-white/10 hover:border-obsidian-accent/50 transition-all group h-full flex flex-col"
                                                >
                                                    <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                                        <IconComponent size={24} className={
                                                            guide.category === 'onboarding' ? 'text-obsidian-accent' :
                                                                guide.category === 'advanced' ? 'text-blue-400' :
                                                                    guide.category === 'security' ? 'text-green-400' :
                                                                        guide.category === 'automation' ? 'text-yellow-400' : 'text-white'
                                                        } />
                                                    </div>
                                                    <h3 className="text-xl text-white font-light mb-3 group-hover:text-obsidian-accent transition-colors">{guide.title}</h3>
                                                    <p className="text-sm text-obsidian-text-secondary leading-relaxed flex-1">{guide.description}</p>
                                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-obsidian-text-muted group-hover:text-white transition-colors">
                                                        <span className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-obsidian-accent/50" />
                                                            {guide.readTime}
                                                        </span>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-obsidian-accent">
                                                            Leer Guía <ChevronRight size={14} />
                                                        </div>
                                                    </div>
                                                </ObsidianCard>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Guide Detail View */}
                            <div className={`absolute inset-0 bg-[#0B0B0D] overflow-y-auto transition-transform duration-500 ease-out ${selectedGuide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                                {selectedGuide && (
                                    <div className="max-w-4xl mx-auto p-12 space-y-8">
                                        <button
                                            onClick={() => setSelectedGuide(null)}
                                            className="group flex items-center gap-2 text-obsidian-text-muted hover:text-white transition-colors mb-6"
                                        >
                                            <div className="p-1 rounded-full bg-white/5 group-hover:bg-obsidian-accent/20 transition-colors">
                                                <ChevronRight className="rotate-180" size={16} />
                                            </div>
                                            <span className="text-sm font-medium">Volver a las guías</span>
                                        </button>

                                        <header className="space-y-6 pb-8 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border backdrop-blur-sm ${selectedGuide.category === 'onboarding' ? 'bg-obsidian-accent/10 text-obsidian-accent border-obsidian-accent/20' :
                                                    selectedGuide.category === 'advanced' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        selectedGuide.category === 'security' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {selectedGuide.category}
                                                </span>
                                                <span className="text-xs text-obsidian-text-muted flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-white/30" />
                                                    Lectura: {selectedGuide.readTime}
                                                </span>
                                            </div>
                                            <h1 className="text-5xl font-extralight text-white tracking-tight">{selectedGuide.title}</h1>
                                            <p className="text-xl text-obsidian-text-secondary font-light max-w-2xl">{selectedGuide.description}</p>
                                        </header>

                                        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-forwards">
                                            {selectedGuide.sections.map((section, idx) => (
                                                <section key={idx} className="group">
                                                    <div className="flex gap-6">
                                                        <div className="flex-none flex flex-col items-center gap-2 pt-2">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-obsidian-text-muted group-hover:border-obsidian-accent/50 group-hover:text-white transition-colors shadow-lg">
                                                                {idx + 1}
                                                            </div>
                                                            {idx !== selectedGuide.sections.length - 1 && (
                                                                <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent group-hover:from-obsidian-accent/30 transition-colors" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-4 pb-8">
                                                            <h3 className="text-2xl text-white font-light group-hover:text-obsidian-accent transition-colors">{section.title}</h3>
                                                            <div className="prose prose-invert prose-sm max-w-none text-obsidian-text-primary leading-relaxed whitespace-pre-line">
                                                                {section.content.split('\n').map((line, i) => {
                                                                    // Simple markdown-ish bold parsing
                                                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                                                    return (
                                                                        <p key={i} className="mb-2">
                                                                            {parts.map((part, j) => {
                                                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                                                    return <strong key={j} className="text-white font-medium">{part.slice(2, -2)}</strong>;
                                                                                }
                                                                                return part;
                                                                            })}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-white/10 flex justify-center">
                                            <button
                                                onClick={() => setSelectedGuide(null)}
                                                className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-obsidian-accent/30 text-white transition-all duration-300"
                                            >
                                                ¿Te ha sido útil esta guía?
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
