import React from 'react';
import { ObsidianCard, ObsidianButton, ObsidianSwitch } from './ui/ObsidianElements';
import {
    Activity, Clock, MessageSquare, Mic, Video, Settings, Zap,
    Database, ChevronLeft, Calendar, Share2, MoreVertical,
    CheckCircle, AlertCircle, PlayCircle, BarChart2
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// --- Types ---
interface Agent {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    lastActive: string;
    performance: number;
}

interface AgentProfileProps {
    agent: Agent | null;
    onBack: () => void;
}

const PERFORMANCE_DATA = [
    { time: '09:00', value: 30 },
    { time: '10:00', value: 45 },
    { time: '11:00', value: 35 },
    { time: '12:00', value: 60 },
    { time: '13:00', value: 55 },
    { time: '14:00', value: 70 },
    { time: '15:00', value: 85 },
    { time: '16:00', value: 80 },
    { time: '17:00', value: 95 },
];

const HISTORY_DATA = [
    { id: 1, action: 'Cierre de Venta', agent: 'System', time: '10:42 AM', type: 'success', detail: 'Cliente: TechCorp - Plan Enterprise' },
    { id: 2, action: 'Resolución Ticket', agent: 'System', time: '10:15 AM', type: 'info', detail: 'Ticket #4-002: Error de acceso' },
    { id: 3, action: 'Análisis de Sentimiento', agent: 'System', time: '09:30 AM', type: 'neutral', detail: 'Positivo (85%) - Última llamada' },
    { id: 4, action: 'Sincronización CRM', agent: 'System', time: '09:00 AM', type: 'neutral', detail: '45 nuevos contactos actualizados' },
];

export const AgentProfile: React.FC<AgentProfileProps> = ({ agent, onBack }) => {
    // Fallback if no agent is passed (e.g. direct access or refresh)
    const displayAgent = agent || {
        id: '1',
        name: 'Sarah Jenkins',
        role: 'Ventas Senior',
        email: 'sarah.j@obsidian.com',
        avatar: '',
        status: 'online',
        lastActive: 'Ahora mismo',
        performance: 92
    };

    return (
        <div className="w-full h-full animate-[fadeIn_0.3s_ease-out] flex flex-col gap-6 p-1">

            {/* Navigation Bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs text-obsidian-text-muted hover:text-white transition-colors group"
                >
                    <div className="p-1 rounded-full border border-white/10 group-hover:border-white/30 bg-white/5">
                        <ChevronLeft size={14} />
                    </div>
                    <span className="uppercase tracking-wider font-medium">Volver al listado</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-wider ${displayAgent.status === 'online' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-gray-500/30 bg-gray-500/10 text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${displayAgent.status === 'online' ? 'bg-emerald-400' : 'bg-gray-400'} shadow-[0_0_8px_currentColor]`} />
                        {displayAgent.status === 'online' ? 'Sistema Activo' : 'Offline'}
                    </span>
                    <ObsidianButton variant="secondary" size="sm" className="!p-2"><Settings size={14} /></ObsidianButton>
                </div>
            </div>

            {/* Profile Header Card */}
            <ObsidianCard className="relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#6A4FFB]/10 via-[#6A4FFB]/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full border-2 border-white/10 p-1 group-hover:border-obsidian-accent/50 transition-colors">
                                <div className="w-full h-full rounded-full bg-[#1A1A1D] flex items-center justify-center overflow-hidden">
                                    <span className="text-2xl font-light text-white">{displayAgent.name.substring(0, 2)}</span>
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 p-1.5 bg-[#0B0B0D] rounded-full border border-white/10">
                                <Settings size={12} className="text-obsidian-text-muted" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-light text-white tracking-wide">{displayAgent.name}</h1>
                                <ObsidianButton variant="outline" size="sm" className="!py-0.5 !px-2 !text-[9px]">Editar</ObsidianButton>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-obsidian-text-muted mb-4">
                                <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-obsidian-accent rounded-full"></div> {displayAgent.role}</span>
                                <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> {displayAgent.email}</span>
                                <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> ID: {displayAgent.id}</span>
                            </div>

                            <div className="flex gap-8">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-obsidian-text-muted mb-1">Eficacia Global</div>
                                    <div className="text-xl text-white font-light flex items-end gap-2">
                                        {displayAgent.performance}%
                                        <span className="text-xs text-emerald-400 mb-1 leading-none flex items-center">
                                            <Activity size={10} className="mr-1" /> +2.4%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-px h-full bg-white/10 mx-2"></div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-obsidian-text-muted mb-1">Tiempo Respuesta</div>
                                    <div className="text-xl text-white font-light">1.2<span className="text-sm text-white/50">s</span></div>
                                </div>
                                <div className="w-px h-full bg-white/10 mx-2"></div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-obsidian-text-muted mb-1">Uptime</div>
                                    <div className="text-xl text-white font-light">99.9<span className="text-sm text-white/50">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <ObsidianButton className="w-full justify-between group">
                            <span className="flex items-center gap-2"><MessageSquare size={14} /> Abrir Chat Directo</span>
                            <ChevronLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                        </ObsidianButton>
                        <ObsidianButton variant="secondary" className="w-full justify-between">
                            <span className="flex items-center gap-2"><Calendar size={14} /> Ver Agenda</span>
                        </ObsidianButton>
                    </div>
                </div>
            </ObsidianCard>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Column: Performance */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                    {/* Performance Chart - White Lines as requested */}
                    <ObsidianCard className="flex-1 min-h-[400px]">
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-white tracking-widest flex items-center gap-2">
                                        <Activity size={16} className="text-white" /> RENDIMIENTO DE AGENTE
                                    </h3>
                                    <p className="text-[10px] text-obsidian-text-muted mt-1 uppercase tracking-wider">Métricas en tiempo real</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-white/10 text-white text-[10px] rounded hover:bg-white/20 transition-colors uppercase tracking-wider">Hoy</button>
                                    <button className="px-3 py-1 bg-transparent border border-white/10 text-obsidian-text-muted text-[10px] rounded hover:text-white transition-colors uppercase tracking-wider">Semana</button>
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWhite" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#16161A', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#FFFFFF"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorWhite)"
                                            activeDot={{ r: 6, fill: "#FFFFFF", stroke: "#0B0B0D", strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </ObsidianCard>

                    {/* Interaction History Table */}
                    <ObsidianCard>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-white tracking-widest flex items-center gap-2">
                                <Clock size={16} className="text-white/60" /> HISTORIAL DE ACCIONES
                            </h3>
                            <button className="text-[10px] text-obsidian-accent hover:text-white transition-colors uppercase tracking-wider">System Logs &gt;</button>
                        </div>
                        <div className="w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase text-obsidian-text-muted tracking-wider">
                                        <th className="py-2 font-medium">Acción</th>
                                        <th className="py-2 font-medium">Detalle</th>
                                        <th className="py-2 font-medium">Hora</th>
                                        <th className="py-2 font-medium text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {HISTORY_DATA.map((item) => (
                                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-3 text-white font-medium group-hover:text-obsidian-accent transition-colors">{item.action}</td>
                                            <td className="py-3 text-obsidian-text-muted">{item.detail}</td>
                                            <td className="py-3 text-obsidian-text-muted font-mono text-[10px]">{item.time}</td>
                                            <td className="py-3 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] border ${item.type === 'success' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                                    item.type === 'info' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                                                        'border-white/10 text-gray-400 bg-white/5'
                                                    }`}>
                                                    {item.type === 'success' && <CheckCircle size={10} />}
                                                    {item.type === 'info' && <AlertCircle size={10} />}
                                                    {item.type === 'success' ? 'Completado' : item.type === 'info' ? 'Info' : 'General'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ObsidianCard>
                </div>

                {/* Right Column: Multimedia & Config */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                    {/* Multimedia Showcase - Glassmorphism */}
                    <ObsidianCard className="flex flex-col relative overflow-hidden group">
                        {/* Deep background glow */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none" />

                        <h3 className="text-sm font-medium text-white tracking-widest mb-4 flex items-center gap-2 z-10">
                            <Database size={16} className="text-blue-400" /> MULTIMEDIA
                        </h3>

                        <div className="flex-1 space-y-3 z-10">
                            {/* Glass Item 1 */}
                            <div className="relative h-24 rounded-xl overflow-hidden border border-white/10 group/item hover:border-white/30 transition-all shadow-lg cursor-pointer">
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 animate-pulse" />
                                <div className="absolute inset-0 flex items-center px-4 gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0B0B0D]/50 flex items-center justify-center border border-white/10 text-white">
                                        <PlayCircle size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-white">Demo_Ventas_Q4.mp4</div>
                                        <div className="text-[10px] text-obsidian-text-muted mt-1">Grabación de sesión • 12:45 min</div>
                                    </div>
                                </div>
                            </div>

                            {/* Glass Item 2 */}
                            <div className="relative h-24 rounded-xl overflow-hidden border border-white/10 group/item hover:border-white/30 transition-all shadow-lg cursor-pointer">
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                                <div className="absolute inset-0 flex items-center px-4 gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0B0B0D]/50 flex items-center justify-center border border-white/10 text-obsidian-accent">
                                        <Mic size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-white">Call_Log_Client_A.wav</div>
                                        <div className="text-[10px] text-obsidian-text-muted mt-1">Audio Log • 4:20 min</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 z-10">
                            <ObsidianButton variant="outline" size="sm" fullWidth className="text-[10px]">Ver galería completa</ObsidianButton>
                        </div>
                    </ObsidianCard>

                    {/* Advanced Settings */}
                    <ObsidianCard className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-white tracking-widest mb-4 flex items-center gap-2">
                            <Settings size={16} className="text-white/60" /> CONFIGURACIÓN
                        </h3>

                        <div className="space-y-5">
                            <ObsidianSwitch label="Modo Alta Precisión" checked={true} onChange={() => { }} />
                            <ObsidianSwitch label="Grabar Sesiones" checked={true} onChange={() => { }} />
                            <ObsidianSwitch label="Notificaciones Push" checked={false} onChange={() => { }} />

                            <div className="pt-2 border-t border-white/5">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">Umbral de Confianza</label>
                                    <span className="text-xs font-mono text-white">85%</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">Límite de Tokens</label>
                                    <span className="text-xs font-mono text-white">4k</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </ObsidianCard>

                </div>

            </div>
        </div>
    );
};
