import React, { useState, useEffect } from 'react';
import {
    Gift, Download, Eye, TrendingUp, FileText, Video,
    CheckSquare, BookOpen, Plus, Search, Filter, MoreVertical,
    Copy, Trash2, Edit, Share2, Code, Mail, Link2, BarChart3,
    Users, Clock, Zap, ArrowLeft, Save, X, Upload, Settings, Check
} from 'lucide-react';
import { ObsidianCard, ObsidianButton } from './ui/ObsidianElements';

// --- TYPES ---
type LeadMagnetType = 'ebook' | 'checklist' | 'template' | 'video' | 'course' | 'toolkit';
type LeadMagnetStatus = 'draft' | 'active' | 'paused';

interface LeadMagnet {
    id: string;
    name: string;
    type: LeadMagnetType;
    status: LeadMagnetStatus;
    description: string;
    fileUrl?: string;
    fileName?: string;
    thumbnailUrl?: string;
    downloads: number;
    conversionRate: number;
    views: number;
    createdAt: string;
    lastUpdated: string;
    embedCode?: string;
    landingPageUrl?: string;
    tags: string[];
    requireEmail: boolean;
    autoResponder: boolean;
}

// --- MOCK DATA ---
const INITIAL_LEAD_MAGNETS: LeadMagnet[] = [
    {
        id: '1',
        name: 'Ultimate Marketing Checklist 2024',
        type: 'checklist',
        status: 'active',
        description: 'A comprehensive 50-point checklist for launching successful marketing campaigns.',
        downloads: 2847,
        conversionRate: 42.5,
        views: 6700,
        createdAt: '2024-01-15',
        lastUpdated: '2h ago',
        landingPageUrl: 'https://obsidian.ai/checklist',
        tags: ['Marketing', 'Growth'],
        requireEmail: true,
        autoResponder: true,
        fileName: 'marketing-checklist.pdf'
    },
    {
        id: '2',
        name: 'Sales Funnel Masterclass',
        type: 'video',
        status: 'active',
        description: '45-minute video training on building high-converting sales funnels.',
        downloads: 1523,
        conversionRate: 38.2,
        views: 3990,
        createdAt: '2024-02-01',
        lastUpdated: '1d ago',
        landingPageUrl: 'https://obsidian.ai/masterclass',
        tags: ['Sales', 'Video'],
        requireEmail: true,
        autoResponder: false,
        fileName: 'masterclass.mp4'
    },
    {
        id: '3',
        name: 'Email Templates Pack',
        type: 'template',
        status: 'draft',
        description: '20 proven email templates for cold outreach and follow-ups.',
        downloads: 0,
        conversionRate: 0,
        views: 0,
        createdAt: '2024-03-10',
        lastUpdated: '3d ago',
        tags: ['Email', 'Templates'],
        requireEmail: true,
        autoResponder: true
    }
];

const TEMPLATE_LIBRARY = [
    { type: 'ebook', icon: BookOpen, label: 'eBook', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { type: 'checklist', icon: CheckSquare, label: 'Checklist', color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { type: 'template', icon: FileText, label: 'Template', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { type: 'video', icon: Video, label: 'Video Course', color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { type: 'toolkit', icon: Gift, label: 'Toolkit', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { type: 'course', icon: BookOpen, label: 'Mini Course', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' }
];

const LeadMagnet: React.FC = () => {
    // --- STATE ---
    const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>(INITIAL_LEAD_MAGNETS);
    const [view, setView] = useState<'dashboard' | 'builder' | 'analytics'>('dashboard');
    const [selectedMagnetId, setSelectedMagnetId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedType, setSelectedType] = useState<LeadMagnetType | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [newTagInput, setNewTagInput] = useState('');
    const [uploadedFile, setUploadedFile] = useState<{ name: string, size: string } | null>(null);

    // Form state for builder
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: [] as string[],
        fileUrl: '',
        fileName: '',
        requireEmail: true,
        autoResponder: true
    });

    // Derived
    const activeMagnet = leadMagnets.find(m => m.id === selectedMagnetId);
    const totalDownloads = leadMagnets.reduce((acc, m) => acc + m.downloads, 0);
    const avgConversion = leadMagnets.length > 0
        ? leadMagnets.reduce((acc, m) => acc + m.conversionRate, 0) / leadMagnets.length
        : 0;

    // --- EFFECTS ---
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (activeMagnet) {
            setFormData({
                name: activeMagnet.name,
                description: activeMagnet.description,
                tags: activeMagnet.tags,
                fileUrl: activeMagnet.fileUrl || '',
                fileName: activeMagnet.fileName || '',
                requireEmail: activeMagnet.requireEmail,
                autoResponder: activeMagnet.autoResponder
            });
            if (activeMagnet.fileName) {
                setUploadedFile({ name: activeMagnet.fileName, size: '2.4 MB' });
            }
        }
    }, [activeMagnet]);

    // --- HANDLERS ---
    const handleCreateMagnet = () => {
        if (!selectedType || !formData.name.trim()) return;

        const newMagnet: LeadMagnet = {
            id: Date.now().toString(),
            name: formData.name,
            type: selectedType,
            status: 'draft',
            description: formData.description,
            downloads: 0,
            conversionRate: 0,
            views: 0,
            createdAt: new Date().toISOString().split('T')[0],
            lastUpdated: 'Just now',
            landingPageUrl: `https://obsidian.ai/${formData.name.toLowerCase().replace(/\s/g, '-')}`,
            tags: formData.tags,
            requireEmail: true,
            autoResponder: true
        };

        setLeadMagnets(prev => [newMagnet, ...prev]);
        setShowCreateModal(false);
        setSelectedType(null);
        setFormData({ name: '', description: '', tags: [], fileUrl: '', fileName: '', requireEmail: true, autoResponder: true });
        setNotification({ message: 'Lead Magnet creado exitosamente', type: 'success' });

        // Auto-open in builder
        setSelectedMagnetId(newMagnet.id);
        setView('builder');
    };

    const handleUpdateMagnet = (updates: Partial<LeadMagnet>) => {
        if (!activeMagnet) return;
        setLeadMagnets(prev => prev.map(m =>
            m.id === activeMagnet.id
                ? { ...m, ...updates, lastUpdated: 'Just now' }
                : m
        ));
    };

    const handleDeleteMagnet = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Eliminar este lead magnet?')) {
            setLeadMagnets(prev => prev.filter(m => m.id !== id));
            setNotification({ message: 'Lead Magnet eliminado', type: 'success' });
        }
    };

    const handleDuplicate = (e: React.MouseEvent, magnet: LeadMagnet) => {
        e.stopPropagation();
        const copy: LeadMagnet = {
            ...magnet,
            id: Date.now().toString(),
            name: `${magnet.name} (Copy)`,
            status: 'draft',
            downloads: 0,
            views: 0,
            lastUpdated: 'Just now'
        };
        setLeadMagnets(prev => [copy, ...prev]);
        setNotification({ message: 'Lead Magnet duplicado', type: 'success' });
    };

    const handlePublish = () => {
        handleUpdateMagnet({ status: 'active' });
        setNotification({ message: '¡Lead Magnet publicado! 🚀', type: 'success' });
    };

    const handleSaveChanges = () => {
        handleUpdateMagnet({
            name: formData.name,
            description: formData.description,
            tags: formData.tags,
            fileUrl: formData.fileUrl,
            fileName: formData.fileName,
            requireEmail: formData.requireEmail,
            autoResponder: formData.autoResponder
        });
        setNotification({ message: 'Cambios guardados', type: 'success' });
    };

    const handleAddTag = () => {
        if (!newTagInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTagInput.trim()]
        }));
        setNewTagInput('');
    };

    const handleRemoveTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setUploadedFile({ name: file.name, size: `${sizeMB} MB` });
            setFormData(prev => ({
                ...prev,
                fileName: file.name,
                fileUrl: URL.createObjectURL(file)
            }));
            setNotification({ message: `Archivo "${file.name}" cargado`, type: 'success' });
        }
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setNotification({ message: `${label} copiado al portapapeles`, type: 'success' });
    };

    const toggleSetting = (key: 'requireEmail' | 'autoResponder') => {
        setFormData(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="w-full h-screen bg-[#0B0B0D] text-white flex flex-col font-sans overflow-hidden relative">

            {/* NOTIFICATIONS */}
            {notification && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1E] border border-obsidian-accent/50 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(106,79,251,0.3)] animate-[slideDown_0.3s_ease-out]">
                    <div className="w-2 h-2 rounded-full bg-obsidian-success animate-pulse"></div>
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-[#16161A] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-lg font-light text-white">Crear Nuevo Lead Magnet</h3>
                            <p className="text-xs text-obsidian-text-muted mt-1">Selecciona un tipo y configura tu lead magnet</p>
                        </div>

                        {!selectedType ? (
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {TEMPLATE_LIBRARY.map(template => (
                                        <button
                                            key={template.type}
                                            onClick={() => setSelectedType(template.type as LeadMagnetType)}
                                            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-obsidian-accent hover:bg-white/10 transition-all group text-center"
                                        >
                                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${template.bgColor} flex items-center justify-center`}>
                                                <template.icon size={24} className={template.color} />
                                            </div>
                                            <h4 className="text-sm font-medium text-white mb-1">{template.label}</h4>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Nombre del Lead Magnet</label>
                                    <input
                                        autoFocus
                                        placeholder="ej. Ultimate Marketing Guide"
                                        className="w-full bg-[#0B0B0D] border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-obsidian-accent outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Descripción</label>
                                    <textarea
                                        placeholder="Describe qué recibirán tus leads..."
                                        className="w-full bg-[#0B0B0D] border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-obsidian-accent outline-none resize-none"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-[#0B0B0D]/50">
                            {selectedType && (
                                <button
                                    onClick={() => setSelectedType(null)}
                                    className="text-xs text-obsidian-text-muted hover:text-white flex items-center gap-1"
                                >
                                    <ArrowLeft size={12} /> Cambiar tipo
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button onClick={() => { setShowCreateModal(false); setSelectedType(null); }} className="px-4 py-2 text-xs text-obsidian-text-muted hover:text-white">Cancelar</button>
                                <ObsidianButton
                                    variant="primary"
                                    onClick={handleCreateMagnet}
                                    disabled={!selectedType || !formData.name.trim()}
                                >
                                    Crear Lead Magnet
                                </ObsidianButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#16161A]/50 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                    {view !== 'dashboard' && (
                        <button
                            onClick={() => { setView('dashboard'); setSelectedMagnetId(null); }}
                            className="p-2 -ml-2 text-obsidian-text-muted hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <Gift className="text-obsidian-accent" size={20} />
                        <span className="font-light tracking-wide text-sm text-gray-300">
                            {view === 'dashboard' ? 'LEAD MAGNET STUDIO' : activeMagnet?.name}
                        </span>
                        {view !== 'dashboard' && activeMagnet && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${activeMagnet.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                {activeMagnet.status.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view === 'dashboard' ? (
                        <>
                            <div className="flex items-center text-xs text-obsidian-text-muted gap-4 border-r border-white/10 pr-4 hidden sm:flex">
                                <span className="flex items-center gap-1"><Download size={12} className="text-green-500" /> {totalDownloads.toLocaleString()} Downloads</span>
                                <span className="flex items-center gap-1"><TrendingUp size={12} className="text-obsidian-accent" /> {avgConversion.toFixed(1)}% Avg Conv.</span>
                            </div>
                            <ObsidianButton variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus size={16} className="mr-2" /> Nuevo Lead Magnet
                            </ObsidianButton>
                        </>
                    ) : (
                        <>
                            <div className="flex bg-[#0B0B0D] rounded-lg p-1 border border-white/10">
                                <button
                                    onClick={() => setView('builder')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${view === 'builder' ? 'bg-obsidian-accent/20 text-white' : 'text-obsidian-text-muted hover:text-white'}`}
                                >
                                    Editor
                                </button>
                                <button
                                    onClick={() => setView('analytics')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${view === 'analytics' ? 'bg-obsidian-accent/20 text-white' : 'text-obsidian-text-muted hover:text-white'}`}
                                >
                                    Analytics
                                </button>
                            </div>
                            <ObsidianButton variant="secondary" onClick={handleSaveChanges}>
                                <Save size={16} className="mr-2" /> Guardar
                            </ObsidianButton>
                            <ObsidianButton variant="primary" onClick={handlePublish}>
                                <Zap size={16} className="mr-2" /> Publicar
                            </ObsidianButton>
                        </>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden relative">

                {/* DASHBOARD */}
                {view === 'dashboard' && (
                    <div className="h-full overflow-y-auto p-6 animate-[fadeIn_0.3s_ease-out]">
                        <div className="max-w-7xl mx-auto space-y-8">

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'text-green-400' },
                                    { label: 'Avg. Conversion', value: avgConversion.toFixed(1) + '%', icon: TrendingUp, color: 'text-obsidian-accent' },
                                    { label: 'Active Magnets', value: leadMagnets.filter(m => m.status === 'active').length, icon: Zap, color: 'text-yellow-400' },
                                    { label: 'Total Views', value: leadMagnets.reduce((acc, m) => acc + m.views, 0).toLocaleString(), icon: Eye, color: 'text-blue-400' }
                                ].map((stat, i) => (
                                    <ObsidianCard key={i} className="p-4 flex items-center justify-between group hover:border-obsidian-accent/30 transition-all">
                                        <div>
                                            <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                                            <h3 className="text-2xl font-light text-white">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                    </ObsidianCard>
                                ))}
                            </div>

                            {/* Lead Magnets Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-light text-white">Mis Lead Magnets</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-obsidian-text-muted hover:text-white bg-white/5 rounded border border-white/5"><Filter size={14} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {/* Create Card */}
                                    <div
                                        onClick={() => setShowCreateModal(true)}
                                        className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center min-h-[280px] text-obsidian-text-muted hover:text-white hover:border-obsidian-accent/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-obsidian-accent/20 flex items-center justify-center mb-3 transition-colors">
                                            <Plus size={24} className="group-hover:text-obsidian-accent" />
                                        </div>
                                        <span className="text-sm font-medium">Crear Lead Magnet</span>
                                    </div>

                                    {/* Magnet Cards */}
                                    {leadMagnets.map(magnet => {
                                        const template = TEMPLATE_LIBRARY.find(t => t.type === magnet.type);
                                        return (
                                            <div
                                                key={magnet.id}
                                                onClick={() => { setSelectedMagnetId(magnet.id); setView('builder'); }}
                                                className="group bg-[#16161A] border border-white/5 rounded-xl overflow-hidden hover:border-obsidian-accent/50 hover:shadow-[0_0_20px_rgba(106,79,251,0.1)] transition-all cursor-pointer relative flex flex-col h-[280px]"
                                            >
                                                {/* Actions */}
                                                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => handleDuplicate(e, magnet)} className="p-1.5 bg-black/60 rounded text-white/70 hover:text-white" title="Duplicar">
                                                        <Copy size={12} />
                                                    </button>
                                                    <button onClick={(e) => handleDeleteMagnet(e, magnet.id)} className="p-1.5 bg-black/60 rounded text-red-400 hover:text-red-500" title="Eliminar">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>

                                                {/* Icon Area */}
                                                <div className="h-32 bg-[#0B0B0D] relative overflow-hidden flex items-center justify-center border-b border-white/5 shrink-0">
                                                    {template && (
                                                        <div className={`w-16 h-16 rounded-xl ${template.bgColor} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}>
                                                            <template.icon size={32} className={template.color} />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 left-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] border font-medium ${magnet.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                            }`}>
                                                            {magnet.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="p-5 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <h4 className="text-white font-medium mb-1 truncate group-hover:text-obsidian-accent transition-colors">{magnet.name}</h4>
                                                        <p className="text-[10px] text-obsidian-text-muted line-clamp-2 mb-2">{magnet.description}</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                                        <div>
                                                            <p className="text-[10px] text-obsidian-text-muted">Downloads</p>
                                                            <p className="text-sm font-mono text-white">{magnet.downloads.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-obsidian-text-muted">Conv. Rate</p>
                                                            <p className="text-sm font-mono text-green-400">{magnet.conversionRate}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BUILDER */}
                {view === 'builder' && activeMagnet && (
                    <div className="h-full flex overflow-hidden">
                        {/* Main Editor */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#0B0B0D]">
                            <div className="max-w-3xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Nombre del Lead Magnet</label>
                                    <input
                                        className="w-full bg-[#16161A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-obsidian-accent outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Descripción</label>
                                    <textarea
                                        className="w-full bg-[#16161A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-obsidian-accent outline-none resize-none"
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Archivo del Lead Magnet</label>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.zip,.mp4,.mov"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-obsidian-accent/50 transition-colors cursor-pointer group block"
                                    >
                                        {uploadedFile ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileText size={24} className="text-green-400" />
                                                <div className="text-left">
                                                    <p className="text-sm text-white font-medium">{uploadedFile.name}</p>
                                                    <p className="text-xs text-obsidian-text-muted">{uploadedFile.size}</p>
                                                </div>
                                                <Check size={20} className="text-green-400" />
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} className="mx-auto mb-3 text-obsidian-text-muted group-hover:text-obsidian-accent transition-colors" />
                                                <p className="text-sm text-white mb-1">Arrastra tu archivo aquí o haz clic para subir</p>
                                                <p className="text-xs text-obsidian-text-muted">PDF, ZIP, MP4 (Max 50MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-obsidian-accent/10 text-obsidian-accent rounded-full text-xs border border-obsidian-accent/20 flex items-center gap-2">
                                                {tag}
                                                <button onClick={() => handleRemoveTag(i)} className="hover:text-white">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Añadir tag..."
                                            className="flex-1 bg-[#16161A] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-obsidian-accent outline-none"
                                            value={newTagInput}
                                            onChange={(e) => setNewTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-white/5 text-white rounded text-xs border border-white/10 hover:border-obsidian-accent hover:bg-white/10 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Panel */}
                        <div className="w-80 bg-[#16161A] border-l border-white/5 p-6 overflow-y-auto">
                            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/5">Distribución</h4>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2 flex items-center gap-2">
                                        <Link2 size={12} /> Landing Page URL
                                    </label>
                                    <div className="flex items-center bg-[#0B0B0D] border border-white/10 rounded px-3 py-2">
                                        <input
                                            className="bg-transparent w-full text-xs text-white outline-none"
                                            value={activeMagnet.landingPageUrl || ''}
                                            readOnly
                                        />
                                        <button
                                            onClick={() => handleCopyToClipboard(activeMagnet.landingPageUrl || '', 'URL')}
                                            className="text-obsidian-accent hover:text-white ml-2"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-obsidian-text-muted block mb-2 flex items-center gap-2">
                                        <Code size={12} /> Código de Embed
                                    </label>
                                    <div className="bg-[#0B0B0D] border border-white/10 rounded p-3">
                                        <code className="text-[10px] text-green-400 font-mono break-all">
                                            {`<script src="obsidian.ai/embed/${activeMagnet.id}"></script>`}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(`<script src="obsidian.ai/embed/${activeMagnet.id}"></script>`, 'Código')}
                                        className="mt-2 text-xs text-obsidian-accent hover:text-white flex items-center gap-1"
                                    >
                                        <Copy size={12} /> Copiar código
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <h5 className="text-xs font-medium text-white mb-3 flex items-center gap-2">
                                        <Settings size={12} /> Configuración
                                    </h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-300">Requiere email</span>
                                            <div
                                                onClick={() => toggleSetting('requireEmail')}
                                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.requireEmail ? 'bg-green-500/30' : 'bg-gray-600/30'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${formData.requireEmail ? 'right-0.5 bg-green-500' : 'left-0.5 bg-gray-500'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-300">Auto-responder</span>
                                            <div
                                                onClick={() => toggleSetting('autoResponder')}
                                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.autoResponder ? 'bg-green-500/30' : 'bg-gray-600/30'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${formData.autoResponder ? 'right-0.5 bg-green-500' : 'left-0.5 bg-gray-500'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ANALYTICS */}
                {view === 'analytics' && activeMagnet && (
                    <div className="h-full overflow-y-auto p-8 bg-[#0B0B0D] animate-[fadeIn_0.3s_ease-out]">
                        <div className="max-w-6xl mx-auto space-y-6">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Downloads', value: activeMagnet.downloads.toLocaleString(), change: '+12%', icon: Download },
                                    { label: 'Conversion Rate', value: activeMagnet.conversionRate + '%', change: '+2.3%', icon: TrendingUp },
                                    { label: 'Page Views', value: activeMagnet.views.toLocaleString(), change: '+8%', icon: Eye }
                                ].map((stat, i) => (
                                    <ObsidianCard key={i} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-obsidian-text-muted">{stat.label}</p>
                                            <stat.icon size={16} className="text-obsidian-accent" />
                                        </div>
                                        <h3 className="text-2xl font-light text-white mb-1">{stat.value}</h3>
                                        <span className="text-xs text-green-500">{stat.change} vs last month</span>
                                    </ObsidianCard>
                                ))}
                            </div>

                            {/* Chart Placeholder */}
                            <ObsidianCard className="p-6">
                                <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-obsidian-accent" />
                                    Downloads Over Time
                                </h4>
                                <div className="h-64 bg-[#0B0B0D] rounded-lg border border-white/5 flex items-center justify-center">
                                    <p className="text-obsidian-text-muted text-sm">Chart visualization coming soon...</p>
                                </div>
                            </ObsidianCard>

                            {/* Traffic Sources */}
                            <ObsidianCard className="p-6">
                                <h4 className="text-sm font-medium text-white mb-4">Traffic Sources</h4>
                                <div className="space-y-3">
                                    {[
                                        { source: 'Direct', percentage: 45, color: 'bg-blue-500' },
                                        { source: 'Social Media', percentage: 30, color: 'bg-purple-500' },
                                        { source: 'Email', percentage: 15, color: 'bg-green-500' },
                                        { source: 'Organic Search', percentage: 10, color: 'bg-yellow-500' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-300">{item.source}</span>
                                                <span className="text-white font-mono">{item.percentage}%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ObsidianCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadMagnet;
