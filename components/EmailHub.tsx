import React, { useState, useEffect } from 'react';
import {
    Mail, Inbox, Send, Archive, Trash2, FileText, Star,
    Search, Plus, Paperclip, MoreVertical, Layout,
    Clock, Tag, CheckCircle, AlertCircle, Sparkles,
    ArrowLeft, CornerUpLeft, User, Briefcase, ArrowRight
} from 'lucide-react';
import { ObsidianCard, ObsidianButton } from './ui/ObsidianElements';
import type { Email } from '../types';

// --- TYPES ---
type EmailTemplate = {
    id: string;
    label: string;
    subject: string;
    body: string;
    icon: any;
};

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'welcome',
        label: 'Bienvenida VIP',
        icon: Star,
        subject: '¡Bienvenido a [Empresa]! - Primeros pasos',
        body: `Hola [Nombre],

¡Es un placer darte la bienvenida! Estamos emocionados de tenerte con nosotros.

Aquí tienes algunos recursos para empezar:
1. ...
2. ...

Si tienes alguna duda, responde a este correo.

Saludos,
El equipo.`
    },
    {
        id: 'followup',
        label: 'Seguimiento Lead',
        icon: User,
        subject: 'Sigues interesado en [Producto]?',
        body: `Hola [Nombre],

Vi que mostraste interés en nuestro [Producto/Servicio] recientemente pero no hemos tenido la oportunidad de conversar.

¿Tienes 10 minutos esta semana para una llamada rápida? Me gustaría entender mejor tus necesidades.

Agenda aquí: [Link]

Un saludo.`
    },
    {
        id: 'newsletter',
        label: 'Newsletter Semanal',
        icon: Layout,
        subject: 'Novedades de la semana: [Tema Principal]',
        body: `¡Hola a todos!

Esta semana traemos novedades importantes:

🚀 **Lanzamiento:** ...

💡 **Tip de la semana:** ...

📰 **Noticias del sector:** ...

¡Hasta la próxima semana!
[Tu Nombre]`
    },
    {
        id: 'reactivation',
        label: 'Reactivación',
        icon: Clock,
        subject: 'Te extrañamos en [Empresa]',
        body: `Hola [Nombre],

Hace tiempo que no sabemos de ti. Hemos lanzado varias mejoras que podrían interesarte:

- Mejora 1
- Mejora 2

¿Te gustaría ver una demo de lo nuevo?

Saludos.`
    }
];

// --- MOCK DATA ---
const MOCK_EMAILS: Email[] = [
    {
        id: '1',
        from: { id: 'c1', name: 'Sofia Rodriguez', email: 'sofia.r@techcorp.com', role: 'Cliente VIP', avatar: 'https://i.pravatar.cc/150?u=sofia' },
        to: [{ id: 'me', name: 'Yo', email: 'me@obsidian.ai' }],
        subject: 'Propuesta de Proyecto Phoenix - Revisión Final',
        preview: 'Hola equipo, he revisado los últimos diseños y tengo algunas...',
        body: `Hola equipo,

He revisado los últimos diseños y tengo algunas observaciones clave para la fase final del Proyecto Phoenix. En general, el enfoque minimalista es excelente, pero necesitamos ajustar la paleta de colores para el modo oscuro.

Puntos a revisar:
1. Contraste en los botones primarios.
2. Animaciones de entrada en la dashboard.
3. Integración con la API de pagos.

¿Podemos agendar una call para este jueves?

Saludos,
Sofia`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        read: false,
        starred: true,
        folder: 'inbox',
        tags: ['Proyecto Phoenix', 'Urgente'],
        tracking: { openedAt: new Date().toISOString(), clicks: 2 }
    },
    {
        id: '2',
        from: { id: 'c2', name: 'Stripe', email: 'notifications@stripe.com', role: 'Proveedor' },
        to: [{ id: 'me', name: 'Yo', email: 'me@obsidian.ai' }],
        subject: 'Pago recibido: $4,500.00 USD',
        preview: 'Tu pago de TechCorp Inc. ha sido procesado exitosamente.',
        body: `Tu pago de TechCorp Inc. ha sido procesado exitosamente.
    
Monto: $4,500.00 USD
Fecha: Hoy
Referencia: #INV-2024-001

El dinero estará disponible en tu cuenta en 2 días hábiles.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: true,
        starred: false,
        folder: 'inbox',
        tags: ['Finanzas'],
        attachments: [{ name: 'receipt.pdf', size: '156 KB', type: 'pdf' }]
    },
    {
        id: '3',
        from: { id: 'c3', name: 'Carlos Mendoza', email: 'carlos@freelance.network', role: 'Partner' },
        to: [{ id: 'me', name: 'Yo', email: 'me@obsidian.ai' }],
        subject: 'Oportunidad de colaboración - Startup AI',
        preview: '¡Hola! Vi tu portfolio y creo que encajarías perfecto en...',
        body: `¡Hola!

Vi tu portfolio y creo que encajarías perfecto en un nuevo proyecto que estamos montando. Es una Startup de AI para abogados.
Necesitamos a alguien que maneje el frontend con React y Tailwind (como un maestro).

¿Tienes disponibilidad para una charla rápida?

Abrazo,
Carlos`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        starred: false,
        folder: 'inbox',
        tags: ['Lead'],
        snoozedUntil: new Date(Date.now() + 86400000).toISOString()
    }
];

const EmailHub: React.FC = () => {
    // --- STATE ---
    const [emails, setEmails] = useState<Email[]>([
        ...MOCK_EMAILS,
        {
            id: '4', from: { id: 'me', name: 'Yo', email: 'me@obsidian.ai' }, to: [{ id: 'c1', name: 'Sofia Rodriguez', email: 'sofia.r@techcorp.com' }], subject: 'Re: Propuesta de Proyecto Phoenix', preview: 'Gracias Sofia, lo reviso ahora mismo.', body: 'Gracias Sofia, lo reviso ahora mismo.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), read: true, starred: false, folder: 'sent', tags: []
        },
        {
            id: '5', from: { id: 'news', name: 'TechCrunch', email: 'news@techcrunch.com', role: 'Newsletter' }, to: [{ id: 'me', name: 'Yo', email: 'me@obsidian.ai' }], subject: 'Daily Move: AI is eating software', preview: 'Plus: The new features in React 19...', body: '...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), read: true, starred: false, folder: 'archived', tags: ['News']
        }
    ]);

    const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archived'>('inbox');
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // UI States
    const [showCompose, setShowCompose] = useState(false);
    const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
    const [showCRM, setShowCRM] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

    const selectedEmail = emails.find(e => e.id === selectedEmailId);

    // Filter Logic
    const filteredEmails = emails.filter(email =>
        email.folder === activeFolder &&
        (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.from.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sidebar Counts
    const counts = {
        inbox: emails.filter(e => e.folder === 'inbox' && !e.read).length,
        sent: 0,
        drafts: emails.filter(e => e.folder === 'drafts').length,
        archived: emails.filter(e => e.folder === 'archived').length,
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- HANDLERS ---
    const handleArchive = (id: string) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'archived' } : e));
        setSelectedEmailId(null);
        setNotification({ message: 'Correo archivado', type: 'info' });
    };

    const handleDelete = (id: string) => {
        setEmails(prev => prev.filter(e => e.id !== id));
        setSelectedEmailId(null);
        setNotification({ message: 'Correo eliminado', type: 'info' });
    };

    const handleSnooze = () => {
        if (selectedEmailId) {
            handleArchive(selectedEmailId); // Simulate snooze by archiving for now
            setNotification({ message: 'Pospuesto para mañana a las 9:00 AM', type: 'success' });
        }
    };

    const handleCreateTask = () => {
        setNotification({ message: `Tarea creada: "Revisar correos de ${selectedEmail?.from.name}"`, type: 'success' });
    };

    const handleSendReply = (text: string) => {
        const newEmail: Email = {
            id: Date.now().toString(),
            from: { id: 'me', name: 'Yo', email: 'me@obsidian.ai' },
            to: selectedEmail?.from ? [selectedEmail.from] : [],
            subject: `Re: ${selectedEmail?.subject}`,
            preview: text,
            body: text,
            timestamp: new Date().toISOString(),
            read: true,
            starred: false,
            folder: 'sent',
            tags: []
        };
        setEmails(prev => [...prev, newEmail]);
        setNotification({ message: 'Respuesta enviada', type: 'success' });
    };

    const handleComposeSend = () => {
        const newEmail: Email = {
            id: Date.now().toString(),
            from: { id: 'me', name: 'Yo', email: 'me@obsidian.ai' },
            to: [{ id: 'new', name: composeData.to, email: composeData.to }],
            subject: composeData.subject,
            preview: composeData.body.substring(0, 50) + '...',
            body: composeData.body,
            timestamp: new Date().toISOString(),
            read: true,
            starred: false,
            folder: 'sent',
            tags: []
        };
        setEmails(prev => [...prev, newEmail]);
        setShowCompose(false);
        setComposeData({ to: '', subject: '', body: '' });
        setNotification({ message: 'Mensaje enviado correctamente', type: 'success' });
    };

    return (
        <div className="w-full h-screen bg-[#0B0B0D] text-white flex overflow-hidden font-sans relative">

            {/* --- NOTIFICATIONS --- */}
            {notification && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1E] border border-obsidian-accent/50 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(106,79,251,0.3)] animate-[slideDown_0.3s_ease-out]">
                    <div className="w-2 h-2 rounded-full bg-obsidian-success animate-pulse"></div>
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* --- MODALS --- */}

            {/* CRM Modal */}
            {showCRM && selectedEmail && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCRM(false)}>
                    <div className="bg-[#16161A] border border-white/10 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                        <div className="h-24 bg-gradient-to-r from-obsidian-accent/20 to-purple-900/20 relative">
                            <div className="absolute -bottom-8 left-6 flex items-end gap-4">
                                {selectedEmail.from.avatar ? (
                                    <img src={selectedEmail.from.avatar} className="w-20 h-20 rounded-xl border-4 border-[#16161A] shadow-xl" />
                                ) : (
                                    <div className="w-20 h-20 rounded-xl border-4 border-[#16161A] bg-gradient-to-br from-obsidian-accent to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl">{selectedEmail.from.name.substring(0, 2)}</div>
                                )}
                            </div>
                            <button onClick={() => setShowCRM(false)} className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-black/20 rounded-full backdrop-blur"><ArrowRight size={16} className="rotate-45" /></button>
                        </div>
                        <div className="pt-10 px-6 pb-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-light text-white">{selectedEmail.from.name}</h2>
                                    <p className="text-sm text-obsidian-text-muted">{selectedEmail.from.role || 'Prospecto'}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-obsidian-accent/20 text-obsidian-accent border border-obsidian-accent/20">Lead Caliente</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5">Tech Tech</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">85%</div>
                                    <div className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">Engagement</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-obsidian-text-muted mb-1">Pipeline Stage</div>
                                    <div className="text-sm font-medium text-white flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Negociación
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-obsidian-text-muted mb-1">Valor Estimado</div>
                                    <div className="text-sm font-medium text-green-400">$12,500 USD</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full py-2 bg-obsidian-accent hover:bg-obsidian-accent/90 text-white rounded text-xs font-medium transition-colors">Ver Perfil Completo en Bionic Sales</button>
                                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded text-xs transition-colors border border-white/5">Agendar Reunión </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Compose Modal */}
            {showCompose && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#16161A] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[600px] animate-[slideUp_0.3s_ease-out]">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h3 className="text-sm font-medium text-white">Nuevo Mensaje</h3>
                            <button
                                onClick={() => {
                                    if (composeData.subject || composeData.body) {
                                        setComposeData(prev => ({ ...prev, subject: '', body: '' }));
                                    } else {
                                        setShowCompose(false);
                                    }
                                }}
                                className="text-obsidian-text-muted hover:text-white"
                            >
                                <ArrowLeft size={16} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {/* Template Selector */}
                            {!composeData.subject && !composeData.body && (
                                <div className="mb-6">
                                    <h4 className="text-xs text-obsidian-text-muted uppercase tracking-wider mb-3">Plantillas Rápidas</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {EMAIL_TEMPLATES.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => setComposeData(prev => ({ ...prev, subject: template.subject, body: template.body }))}
                                                className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-obsidian-accent/30 transition-all text-left group"
                                            >
                                                <div className="p-2 rounded bg-[#0B0B0D] text-obsidian-text-muted group-hover:text-obsidian-accent transition-colors">
                                                    <template.icon size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-white block">{template.label}</span>
                                                    <span className="text-[10px] text-obsidian-text-muted block truncate w-32">{template.subject}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#16161A] px-2 text-obsidian-text-muted">O escribe desde cero</span></div>
                                    </div>
                                </div>
                            )}

                            <input
                                placeholder="Para:"
                                className="w-full bg-transparent border-b border-white/5 py-2 text-sm text-white focus:border-obsidian-accent outline-none"
                                value={composeData.to} onChange={e => setComposeData({ ...composeData, to: e.target.value })}
                            />
                            <input
                                placeholder="Asunto:"
                                className="w-full bg-transparent border-b border-white/5 py-2 text-sm text-white focus:border-obsidian-accent outline-none font-medium"
                                value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                            />
                            <textarea
                                placeholder="Escribe tu mensaje..."
                                className="w-full h-full bg-transparent resize-none outline-none text-sm text-gray-300 leading-relaxed mt-4 min-h-[200px]"
                                value={composeData.body} onChange={e => setComposeData({ ...composeData, body: e.target.value })}
                            />
                        </div>
                        <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#0B0B0D]/50 rounded-b-xl">
                            <div className="flex gap-2 text-obsidian-text-muted">
                                <Paperclip size={18} className="hover:text-white cursor-pointer" />
                                <Sparkles size={18} className="hover:text-obsidian-accent cursor-pointer" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-xs text-obsidian-text-muted hover:text-white transition-colors">Cancelar</button>
                                <ObsidianButton variant="primary" onClick={handleComposeSend} disabled={!composeData.to || !composeData.body}>
                                    <Send size={14} className="mr-2" /> Enviar
                                </ObsidianButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SIDEBAR DE NAVEGACIÓN (Izquierda) --- */}
            <div className="w-64 bg-[#16161A] border-r border-white/5 flex flex-col hidden md:flex">
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-white/90">
                        <Mail className="text-obsidian-accent" size={20} />
                        <span className="font-light tracking-wide text-sm">EMAIL HUB</span>
                    </div>
                </div>

                {/* Compose Button */}
                <div className="p-4">
                    <ObsidianButton variant="primary" onClick={() => setShowCompose(true)} className="w-full justify-center py-3 shadow-[0_0_15px_rgba(106,79,251,0.2)]">
                        <Plus size={16} className="mr-2" /> Redactar
                    </ObsidianButton>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-2">
                    <nav className="space-y-1 px-2">
                        {[
                            { id: 'inbox', icon: Inbox, label: 'Bandeja de Entrada', count: counts.inbox },
                            { id: 'sent', icon: Send, label: 'Enviados', count: counts.sent },
                            { id: 'drafts', icon: FileText, label: 'Borradores', count: counts.drafts },
                            { id: 'archived', icon: Archive, label: 'Archivados', count: counts.archived },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveFolder(item.id as any)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm transition-all ${activeFolder === item.id
                                    ? 'bg-obsidian-accent/10 text-white font-medium'
                                    : 'text-obsidian-text-muted hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} className={activeFolder === item.id ? 'text-obsidian-accent' : ''} />
                                    <span>{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFolder === item.id ? 'bg-obsidian-accent text-white' : 'bg-white/10 text-obsidian-text-muted'
                                        }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Spacer */}
                    <div className="h-6"></div>

                    {/* Tags / Smart Folders */}
                    <div className="px-6 mb-2">
                        <span className="text-[10px] text-obsidian-text-muted uppercase tracking-widest">ETIQUETAS & CRM</span>
                    </div>
                    <nav className="space-y-1 px-2">
                        {[
                            { color: 'bg-green-500', label: 'Clientes VIP' },
                            { color: 'bg-blue-500', label: 'Facturación' },
                            { color: 'bg-yellow-500', label: 'Leads' },
                            { color: 'bg-red-500', label: 'Urgente' },
                        ].map((tag, i) => (
                            <button key={i} className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-obsidian-text-muted hover:text-white hover:bg-white/5 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                                <span>{tag.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Sync Status */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-obsidian-text-muted">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span>Sincronizado hace 2 min</span>
                    </div>
                </div>
            </div>

            {/* --- LISTA DE EMAILS (Centro) --- */}
            <div className={`flex-1 md:w-[400px] md:max-w-[400px] md:flex-none border-r border-white/5 flex flex-col bg-[#0B0B0D] ${selectedEmailId ? 'hidden md:flex' : 'flex'}`}>
                {/* Search Header */}
                <div className="h-16 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar correos..."
                            className="w-full bg-[#16161A] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:border-obsidian-accent outline-none placeholder-white/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 text-obsidian-text-muted hover:text-white">
                        <Layout size={16} />
                    </button>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.map(email => (
                        <div
                            key={email.id}
                            onClick={() => {
                                setSelectedEmailId(email.id);
                                if (!email.read) {
                                    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
                                }
                            }}
                            className={`border-b border-white/5 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors group relative ${selectedEmailId === email.id ? 'bg-obsidian-accent/[0.03] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-obsidian-accent' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {email.from.avatar ? (
                                        <img src={email.from.avatar} alt={email.from.name} className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-obsidian-accent to-purple-600 flex items-center justify-center text-[10px] uppercase font-bold text-white">
                                            {email.from.name.substring(0, 2)}
                                        </div>
                                    )}
                                    <span className={`text-sm ${!email.read ? 'font-semibold text-white' : 'text-gray-300'}`}>
                                        {email.from.name}
                                    </span>
                                </div>
                                <span className="text-[10px] text-obsidian-text-muted">
                                    {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <h4 className={`text-xs mb-1 truncate ${!email.read ? 'font-medium text-white' : 'text-obsidian-text-secondary'}`}>
                                {email.subject}
                            </h4>
                            <p className="text-[11px] text-obsidian-text-muted line-clamp-2 leading-relaxed">
                                {email.preview}
                            </p>

                            {/* Badges */}
                            <div className="flex items-center gap-2 mt-2">
                                {email.tags.map(tag => (
                                    <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-obsidian-text-muted border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                                {email.starred && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                            </div>
                        </div>
                    ))}

                    {filteredEmails.length === 0 && (
                        <div className="text-center py-12 text-obsidian-text-muted">
                            <p className="text-xs">No se encontraron correos</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PANEL DE LECTURA (Derecha) --- */}
            <div className={`flex-1 bg-[#16161A] flex flex-col ${!selectedEmailId ? 'hidden md:flex' : 'flex'}`}>
                {selectedEmail ? (
                    <>
                        {/* Lectura Header */}
                        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#1A1A1E]">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedEmailId(null)}
                                    className="md:hidden p-2 -ml-2 text-obsidian-text-muted hover:text-white"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <div className="flex items-center gap-2">
                                    <ObsidianButton
                                        variant="secondary" className="px-3" title="Archivar"
                                        onClick={() => handleArchive(selectedEmail.id)}
                                    >
                                        <Archive size={14} className="mr-2" />
                                    </ObsidianButton>
                                    <ObsidianButton
                                        variant="secondary" className="px-3" title="Eliminar"
                                        onClick={() => handleDelete(selectedEmail.id)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                    </ObsidianButton>
                                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                                    <ObsidianButton
                                        variant="secondary" className="px-3" title="Posponer"
                                        onClick={handleSnooze}
                                    >
                                        <Clock size={14} className="mr-2" />
                                    </ObsidianButton>
                                    <ObsidianButton variant="secondary" className="px-3" title="Mover" onClick={() => setNotification({ message: 'Movido a carpeta "Clientes"', type: 'info' })}>
                                        <FolderButton size={14} />
                                    </ObsidianButton>
                                </div>
                            </div>

                            {/* AI Actions */}
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-obsidian-accent/10 border border-obsidian-accent/20 rounded-full flex items-center gap-2 cursor-pointer hover:bg-obsidian-accent/20 transition-colors">
                                    <Sparkles size={12} className="text-obsidian-accent" />
                                    <span className="text-[10px] text-obsidian-accent font-medium uppercase tracking-wide">AI Summary Available</span>
                                </div>
                            </div>
                        </div>

                        {/* Contenido del Email */}
                        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                            {/* Subject */}
                            <h1 className="text-2xl font-light text-white mb-6 leading-tight">
                                {selectedEmail.subject}
                            </h1>

                            {/* Sender Info Card */}
                            <div className="flex items-start justify-between mb-8 pb-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    {selectedEmail.from.avatar ? (
                                        <img src={selectedEmail.from.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-obsidian-accent to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                                            {selectedEmail.from.name.substring(0, 2)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white font-medium text-sm">{selectedEmail.from.name}</h3>
                                            {selectedEmail.from.role && <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">{selectedEmail.from.role}</span>}
                                        </div>
                                        <p className="text-xs text-obsidian-text-muted mt-0.5">{selectedEmail.from.email}</p>
                                        <p className="text-xs text-obsidian-text-muted mt-0.5">Para: {selectedEmail.to.map(t => t.name).join(', ')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-obsidian-text-muted">{new Date(selectedEmail.timestamp).toLocaleString()}</p>
                                    {selectedEmail.tracking?.openedAt && (
                                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-obsidian-success">
                                            <CheckCircle size={10} />
                                            <span>Visto por el cliente</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                                {selectedEmail.body}
                            </div>

                            {/* Attachments */}
                            {selectedEmail.attachments && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h4 className="text-xs text-obsidian-text-muted uppercase tracking-wider mb-3">Adjuntos ({selectedEmail.attachments.length})</h4>
                                    <div className="flex gap-4">
                                        {selectedEmail.attachments.map((file, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                                                <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-400">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-medium">{file.name}</p>
                                                    <p className="text-[10px] text-obsidian-text-muted">{file.size}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                    <DownloadButton />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CRM Connectivity Panel */}
                            <div className="mt-8 bg-obsidian-accent/5 border border-obsidian-accent/20 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-obsidian-accent/20 rounded-lg">
                                        <Briefcase size={16} className="text-obsidian-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white">Conexión CRM Detectada</h4>
                                        <p className="text-[10px] text-obsidian-text-muted">Este contacto está en tu lista de 'Leads Potenciales'.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowCRM(true)}
                                        className="text-[10px] bg-obsidian-accent text-white px-3 py-1.5 rounded hover:bg-obsidian-accent/80 transition-colors"
                                    >
                                        Ver en CRM
                                    </button>
                                    <button
                                        onClick={handleCreateTask}
                                        className="text-[10px] bg-white/5 text-white border border-white/10 px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
                                    >
                                        Crear Tarea
                                    </button>
                                </div>
                            </div>

                            {/* Smart Reply Area */}
                            <div className="mt-8 pt-4">
                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={() => setShowCompose(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs text-white"
                                    >
                                        <CornerUpLeft size={14} /> Responder
                                    </button>
                                    <button
                                        onClick={() => setShowCompose(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs text-white"
                                    >
                                        <ArrowRight size={14} /> Reenviar
                                    </button>
                                    <span className="text-xs text-obsidian-text-muted self-center ml-2">o usa una Respuesta Rápida:</span>
                                    <button
                                        onClick={() => handleSendReply('Sí, me parece bien.')}
                                        className="px-3 py-1.5 rounded-full bg-obsidian-accent/10 text-obsidian-accent text-[10px] hover:bg-obsidian-accent/20 transition-colors border border-transparent hover:border-obsidian-accent/30"
                                    >
                                        "Sí, me parece bien"
                                    </button>
                                    <button
                                        onClick={() => handleSendReply('Gracias por el pago.')}
                                        className="px-3 py-1.5 rounded-full bg-obsidian-accent/10 text-obsidian-accent text-[10px] hover:bg-obsidian-accent/20 transition-colors border border-transparent hover:border-obsidian-accent/30"
                                    >
                                        "Gracias por el pago"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-obsidian-text-muted">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 rotate-12">
                            <Mail size={32} className="opacity-50" />
                        </div>
                        <h3 className="text-lg font-light text-white mb-2">Email Hub</h3>
                        <p className="text-sm max-w-xs text-center">Selecciona un correo para leerlo, o presiona 'Redactar' para empezar uno nuevo.</p>
                        <div className="flex gap-4 mt-8 opacity-50 text-[10px] uppercase tracking-widest cursor-pointer hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-1" onClick={() => setShowCompose(true)}><span className="w-3 h-3 border border-white rounded flex items-center justify-center text-[8px]">C</span> Redactar</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 border border-white rounded flex items-center justify-center text-[8px]">/</span> Buscar</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Components
const FolderButton = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path></svg>
)
const DownloadButton = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
)

export default EmailHub;
