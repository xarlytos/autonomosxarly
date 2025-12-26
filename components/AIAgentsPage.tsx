import React, { useState } from 'react';
import { ObsidianCard, ObsidianButton, ObsidianInput, ObsidianSwitch } from './ui/ObsidianElements';
import {
    Users, TrendingUp, Clock, Activity, Search, Filter, MoreHorizontal,
    Bot, MessageSquare, Mic, Video, Settings, BarChart2, Shield,
    CheckCircle, XCircle, AlertCircle, ChevronDown, Download, Plus,
    Cpu, Zap, Database, Trash2
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AgentProfile } from './AgentProfile';

// --- Types & Mock Data ---

interface Agent {
    id: string;
    name: string;
    role: string;
    roleColor: string;
    email: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    lastActive: string;
    performance: number; // 0-100
}

const AGENTS_DATA: Agent[] = [
    {
        id: '1',
        name: 'Sarah Jenkins',
        role: 'Ventas Senior',
        roleColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        email: 'sarah.j@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        status: 'online',
        lastActive: 'Ahora mismo',
        performance: 92
    },
    {
        id: '2',
        name: 'Michael Chen',
        role: 'Soporte Técnico',
        roleColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        email: 'm.chen@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=michael',
        status: 'away',
        lastActive: 'Hace 15 min',
        performance: 88
    },
    {
        id: '3',
        name: 'Alisa Vester',
        role: 'Ventas',
        roleColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        email: 'alisa.v@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=alisa',
        status: 'offline',
        lastActive: 'Ayer, 18:30',
        performance: 75
    },
    {
        id: '4',
        name: 'David Kim',
        role: 'Admin',
        roleColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        email: 'david.k@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=david',
        status: 'online',
        lastActive: 'Ahora mismo',
        performance: 98
    },
    {
        id: '5',
        name: 'Emily Stone',
        role: 'Soporte Técnico',
        roleColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        email: 'emily.s@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=emily',
        status: 'busy',
        lastActive: 'Hace 2 horas',
        performance: 85
    },
    {
        id: '6',
        name: 'James Wilson',
        role: 'Ventas',
        roleColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        email: 'james.w@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=james',
        status: 'online',
        lastActive: 'Ahora mismo',
        performance: 81
    },
    {
        id: '7',
        name: 'Linda Martinez',
        role: 'Soporte Técnico',
        roleColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        email: 'linda.m@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=linda',
        status: 'offline',
        lastActive: 'Hace 5 horas',
        performance: 89
    },
    {
        id: '8',
        name: 'Robert Fox',
        role: 'Ventas',
        roleColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        email: 'robert.f@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=robert',
        status: 'busy',
        lastActive: 'Hace 30 min',
        performance: 94
    },
    {
        id: '9',
        name: 'Patricia Lee',
        role: 'Admin',
        roleColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        email: 'patricia.l@obsidian.com',
        avatar: 'https://i.pravatar.cc/150?u=patricia',
        status: 'online',
        lastActive: 'Ahora mismo',
        performance: 96
    }
];

// --- Components ---

const StatusBadge: React.FC<{ status: Agent['status'] }> = ({ status }) => {
    const config = {
        online: { color: 'text-emerald-400', bg: 'bg-emerald-400', label: 'En línea' },
        offline: { color: 'text-gray-400', bg: 'bg-gray-400', label: 'Offline' },
        busy: { color: 'text-red-400', bg: 'bg-red-400', label: 'Ocupado' },
        away: { color: 'text-yellow-400', bg: 'bg-yellow-400', label: 'Ausente' },
    };
    const c = config[status];
    return (
        <div className={`flex items-center gap-2 ${c.color} text-xs font-medium`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.bg} shadow-[0_0_8px_currentColor]`}></div>
            {c.label}
        </div>
    );
};

const KPICard: React.FC<{ title: string; value: string; trend?: string; icon: React.ReactNode; active?: boolean }> = ({ title, value, trend, icon, active }) => (
    <ObsidianCard className={`group transition-all duration-300 ${active ? 'border-obsidian-accent/50 bg-obsidian-accent/5' : ''}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${active ? 'bg-obsidian-accent text-white' : 'bg-white/5 text-obsidian-text-muted group-hover:text-white transition-colors'}`}>
                {icon}
            </div>
            {trend && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${trend.includes('+') ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <div className="text-[11px] text-obsidian-text-muted uppercase tracking-wider font-medium mb-1">{title}</div>
            <div className="text-2xl text-white font-light tracking-wide">{value}</div>
        </div>
    </ObsidianCard>
);

// --- Main Page Component ---

const AIAgentsPage: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    // Feature: Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Todos');
    const [agents, setAgents] = useState<Agent[]>(AGENTS_DATA);

    // Feature: New Agent Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgentForm, setNewAgentForm] = useState({ name: '', email: '', role: 'Ventas' });

    // Feature: Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Feature: Row Actions State
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    // Logic: Filter Agents
    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'Todos' || agent.role.includes(activeTab) || (activeTab === 'Admin' && agent.role === 'Admin'); // Simple mapped logic

        // Refine 'Soporte' logic if needed, data uses 'Soporte Técnico'
        if (activeTab === 'Soporte' && !agent.role.includes('Soporte')) return false;

        return matchesSearch && matchesTab;
    });

    // Logic: Add New Agent
    const handleCreateAgent = () => {
        const newId = (agents.length + 1).toString();
        const roleColor = newAgentForm.role === 'Ventas' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
            newAgentForm.role === 'Soporte Técnico' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-orange-500/20 text-orange-400 border-orange-500/30';

        const newAgent: Agent = {
            id: newId,
            name: newAgentForm.name || 'Nuevo Agente',
            email: newAgentForm.email || 'agente@obsidian.com',
            role: newAgentForm.role,
            roleColor: roleColor,
            avatar: '',
            status: 'offline', // Default
            lastActive: 'Nunca',
            performance: 0
        };

        setAgents([newAgent, ...agents]);
        setIsModalOpen(false);
        setNewAgentForm({ name: '', email: '', role: 'Ventas' }); // Reset
    };

    // Logic: Export
    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredAgents));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "agents_export.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Logic: Delete Agent
    const handleDeleteAgent = (agentId: string) => {
        setAgents(agents.filter(a => a.id !== agentId));
        setOpenActionId(null);
    };

    // Simulate navigation to detail
    const handleAgentClick = (agent: Agent) => {
        setSelectedAgent(agent);
        setViewMode('detail');
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
    const paginatedAgents = filteredAgents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    // Reset page on filter change
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    return (
        <div className="w-full h-screen bg-[#0B0B0D] text-obsidian-text-primary overflow-hidden flex flex-col font-sans relative" onClick={() => setOpenActionId(null)}>

            {/* New Agent Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <ObsidianCard className="w-[400px] border border-obsidian-accent/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-light text-white">Nuevo Agente</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-obsidian-text-muted hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-obsidian-text-muted mb-1 block uppercase tracking-wider">Nombre</label>
                                <ObsidianInput
                                    placeholder="Ej: John Doe"
                                    value={newAgentForm.name}
                                    onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-obsidian-text-muted mb-1 block uppercase tracking-wider">Email</label>
                                <ObsidianInput
                                    placeholder="ejemplo@obsidian.com"
                                    value={newAgentForm.email}
                                    onChange={(e) => setNewAgentForm({ ...newAgentForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-obsidian-text-muted mb-1 block uppercase tracking-wider">Rol</label>
                                <select
                                    className="w-full bg-[#16161A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-obsidian-accent outline-none appearance-none"
                                    value={newAgentForm.role}
                                    onChange={(e) => setNewAgentForm({ ...newAgentForm, role: e.target.value })}
                                >
                                    <option value="Ventas">Ventas</option>
                                    <option value="Soporte Técnico">Soporte Técnico</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <ObsidianButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</ObsidianButton>
                            <ObsidianButton className="bg-obsidian-accent text-white hover:bg-obsidian-accent/80" onClick={handleCreateAgent}>Crear Agente</ObsidianButton>
                        </div>
                    </ObsidianCard>
                </div>
            )}

            {/* Header */}
            <div className="h-20 px-8 border-b border-white/[0.06] flex items-center justify-between bg-[#0B0B0D]/50 backdrop-blur-sm z-10">
                <div>
                    <h1 className="text-2xl font-light text-white tracking-wide mb-1">Listado de Agentes</h1>
                    <p className="text-xs text-obsidian-text-muted">Gestiona el acceso, roles y métricas de rendimiento de tu equipo de ventas y soporte.</p>
                </div>
                <div className="flex gap-3">
                    <ObsidianButton variant="secondary" className="flex items-center gap-2" onClick={handleExport}>
                        <Download size={16} /> Exportar
                    </ObsidianButton>
                    <ObsidianButton
                        className="bg-obsidian-accent hover:bg-obsidian-accent/80 text-white border-none shadow-[0_0_20px_rgba(106,79,251,0.3)] flex items-center gap-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={16} /> Nuevo Agente
                    </ObsidianButton>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 relative">

                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-obsidian-accent/5 rounded-full blur-[120px] pointer-events-none" />

                {viewMode === 'list' ? (
                    <div className="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">

                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KPICard
                                title="Total Agentes"
                                value={agents.length.toString()}
                                trend="+2"
                                icon={<Users size={20} />}
                            />
                            <KPICard
                                title="Activos Ahora"
                                value={agents.filter(a => a.status === 'online').length.toString()}
                                active={true}
                                icon={<Activity size={20} />}
                            />
                            <KPICard
                                title="Ventas (Mes)"
                                value="$124k"
                                trend="+12%"
                                icon={<TrendingUp size={20} />}
                            />
                            <KPICard
                                title="Soporte Promedio"
                                value="12m"
                                trend="-5%"
                                icon={<Clock size={20} />}
                            />
                        </div>

                        {/* Filters & Search */}
                        <div className="flex justify-between items-center">
                            <div className="flex bg-[#16161A] p-1 rounded-lg border border-white/5">
                                {['Todos', 'Ventas', 'Soporte', 'Admin'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 text-xs rounded-md transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-obsidian-text-muted hover:text-white hover:bg-white/5'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#16161A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-obsidian-accent/50 outline-none w-64"
                                    />
                                </div>
                                <ObsidianButton variant="secondary" className="px-3">
                                    <Filter size={16} />
                                </ObsidianButton>
                                <ObsidianButton variant="secondary" className="px-3">
                                    <Settings size={16} />
                                </ObsidianButton>
                            </div>
                        </div>

                        {/* Agents List */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 px-6 text-[10px] uppercase tracking-wider text-obsidian-text-muted font-medium mb-2">
                                <div className="col-span-4">Agente</div>
                                <div className="col-span-2">Rol</div>
                                <div className="col-span-2">Estado</div>
                                <div className="col-span-3">Última Actividad</div>
                                <div className="col-span-1 text-right">Acciones</div>
                            </div>

                            {filteredAgents.length === 0 && (
                                <div className="text-center py-12 text-obsidian-text-muted text-sm border border-dashed border-white/10 rounded-lg">
                                    No se encontraron agentes que coincidan con tu búsqueda.
                                </div>
                            )}

                            {paginatedAgents.map((agent, idx) => (
                                <ObsidianCard
                                    key={agent.id}
                                    className="group hover:border-obsidian-accent/30 transition-all duration-300 cursor-pointer relative"
                                    noPadding
                                >
                                    <div className="p-4 grid grid-cols-12 items-center" onClick={() => handleAgentClick(agent)}>
                                        <div className="col-span-4 flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                    <span className="text-xs font-bold text-white/50">{agent.name.substring(0, 2).toUpperCase()}</span>
                                                </div>
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0B0B0D] ${agent.status === 'online' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white group-hover:text-obsidian-accent transition-colors">{agent.name}</div>
                                                <div className="text-xs text-obsidian-text-muted">{agent.email}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`text-[10px] px-2 py-1 rounded border ${agent.roleColor}`}>
                                                {agent.role}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <StatusBadge status={agent.status} />
                                        </div>
                                        <div className="col-span-3 text-xs text-obsidian-text-muted">
                                            {agent.lastActive}
                                        </div>
                                        <div className="col-span-1 flex justify-end relative" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${openActionId === agent.id ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-obsidian-text-muted hover:text-white'}`}
                                                onClick={() => setOpenActionId(openActionId === agent.id ? null : agent.id)}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            {/* Dropdown Action - Simple Implementation */}
                                            {openActionId === agent.id && (
                                                <div className="absolute right-0 top-full mt-2 w-32 bg-[#1A1A1E] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                                                        onClick={() => handleDeleteAgent(agent.id)}
                                                    >
                                                        <Trash2 size={12} /> Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ObsidianCard>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center text-xs text-obsidian-text-muted mt-8">
                            <div>Mostrando <span className="text-white font-medium">{filteredAgents.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAgents.length)}</span> de <span className="text-white font-medium">{agents.length}</span> agentes</div>
                            <div className="flex gap-2">
                                <ObsidianButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    Anterior
                                </ObsidianButton>
                                <ObsidianButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={nextPage}
                                    disabled={currentPage >= totalPages}
                                    className={currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    Siguiente
                                </ObsidianButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- DETAILED VIEW ---
                    <AgentProfile agent={selectedAgent} onBack={() => setViewMode('list')} />
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AIAgentsPage;
