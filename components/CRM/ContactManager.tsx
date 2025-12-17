import React, { useState } from 'react';
import {
  Users, Search, Filter, Plus, Mail, Phone, MoreHorizontal,
  MapPin, Linkedin, Twitter, Globe, Calendar, DollarSign,
  Trash2, Edit3, ArrowUpRight, Tag, Star, ShieldCheck, AlertTriangle,
  CheckCircle2, X
} from 'lucide-react';
import { ObsidianCard, ObsidianButton, ObsidianInput } from '../ui/ObsidianElements';
import { Contact, ContactType, ContactStatus, CalendarEvent } from '../../types';
import { EventModal } from '../Calendar/EventModal';

// Mock Data
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Elena Richardson',
    role: 'CEO',
    company: 'Nexus Innovations',
    email: 'elena@nexus.com',
    phone: '+1 555-0123',
    type: 'CLIENT',
    status: 'ACTIVE',
    lastContact: '2025-05-15',
    tags: ['VIP', 'Tech', 'Enterprise'],
    location: 'San Francisco, CA',
    social: { linkedin: 'elena-rich', twitter: '@elenatech' },
    ltv: 150000,
    notes: 'Key decision maker. Interested in AI expansion.',
    nextAction: 'Quarterly Review',
    nextActionDate: '2025-06-01',
    history: [
      {
        id: 'h1',
        type: 'CALL',
        direction: 'INBOUND',
        date: '2025-05-15T10:30:00',
        subject: 'Llamada de seguimiento completada',
        details: 'Discutimos los detalles del contrato Q3. Interés alto en módulo de Automatizaciones.',
        status: 'COMPLETED'
      },
      {
        id: 'h2',
        type: 'EMAIL',
        direction: 'OUTBOUND',
        date: '2025-05-14T14:20:00',
        subject: 'Propuesta Comercial v2.pdf',
        details: 'Enviada versión revisada con los nuevos términos de pago.',
        status: 'COMPLETED'
      },
      {
        id: 'h3',
        type: 'MEETING',
        date: '2025-05-10T09:00:00',
        subject: 'Demo Swarms Orchestrator',
        details: 'Presentación formal ante el comité técnico.',
        status: 'COMPLETED'
      }
    ]
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'CTO',
    company: 'Quantum Dynamics',
    email: 'marcus@quantum.io',
    phone: '+1 555-9876',
    type: 'LEAD',
    status: 'WARM',
    lastContact: '2025-05-18',
    tags: ['AI', 'SaaS', 'Prospección'],
    location: 'Austin, TX',
    dealSize: 45000,
    probability: 60,
    notes: 'Impressed by the Swarm demo. Needs security validation.',
    nextAction: 'Send Security Whitepaper',
    nextActionDate: '2025-05-20',
    history: [
      {
        id: 'h4',
        type: 'FUNNEL',
        date: '2025-05-18T11:00:00',
        subject: 'Entró en Funnel "Enterprise AI"',
        details: 'Capturado vía Landing Page B.',
        status: 'COMPLETED'
      },
      {
        id: 'h5',
        type: 'EMAIL',
        direction: 'OUTBOUND',
        date: '2025-05-18T11:05:00',
        subject: 'Bienvenido a Nexus - Recursos',
        details: 'Email automático de bienvenida enviado.',
        status: 'COMPLETED'
      }
    ]
  },
  {
    id: '3',
    name: 'Sarah Miller',
    role: 'Director of Ops',
    company: 'Global Logistics',
    email: 's.miller@glogistics.com',
    phone: '+44 20 7123 4567',
    type: 'CLIENT',
    status: 'ACTIVE',
    lastContact: '2025-05-10',
    tags: ['Logistics', 'European'],
    location: 'London, UK',
    ltv: 85000,
    notes: 'Renewal coming up in Q3.',
    nextAction: 'Renewal Proposal',
    nextActionDate: '2025-07-01',
    history: []
  },
  {
    id: '4',
    name: 'David Cyber',
    role: 'Founder',
    company: 'CyberGuard',
    email: 'david@cyberguard.net',
    phone: '+1 555-4567',
    type: 'COMPETITOR',
    status: 'ACTIVE',
    lastContact: '2025-04-20',
    tags: ['Security', 'Competitor'],
    location: 'Tel Aviv, IL',
    notes: 'Lanzó una funcionalidad similar a nuestro Sistema de Automatizaciones.',
    social: { website: 'cyberguard.net' },
    history: []
  },
  {
    id: '5',
    name: 'Priya Patel',
    role: 'VP Sales',
    company: 'TechFlow',
    email: 'priya@techflow.io',
    phone: '+1 555-2233',
    type: 'PARTNER',
    status: 'ACTIVE',
    lastContact: '2025-05-12',
    tags: ['Integration Partner'],
    location: 'New York, NY',
    notes: 'Working on a joint webinar for next month.',
    nextAction: 'Webinar Prep',
    nextActionDate: '2025-05-25',
    history: []
  }
];

export const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [initialEventType, setInitialEventType] = useState<'CALL' | 'MEETING'>('MEETING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContactType | 'ALL'>('ALL');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);

  // New Contact State
  const [newContactData, setNewContactData] = useState<Partial<Contact>>({
    type: 'LEAD',
    status: 'WARM',
    tags: []
  });

  // Filter Logic
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || contact.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
      case 'WARM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]';
      case 'COLD': return 'text-blue-300 bg-blue-400/10 border-blue-400/20';
      case 'INACTIVE': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'BLOCKED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-white bg-white/10';
    }
  };

  const getStatusBadge = (status: ContactStatus) => (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border backdrop-blur-md ${getStatusColor(status)}`}>
      {status}
    </span>
  );

  const getTypeIcon = (type: ContactType) => {
    switch (type) {
      case 'CLIENT': return <Star size={14} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 'LEAD': return <ArrowUpRight size={14} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />;
      case 'PARTNER': return <Users size={14} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />;
      case 'COMPETITOR': return <ShieldCheck size={14} className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />;
      default: return <Users size={14} />;
    }
  };

  const getTypeLabel = (type: ContactType) => {
    switch (type) {
      case 'CLIENT': return 'Cliente';
      case 'LEAD': return 'Lead';
      case 'PARTNER': return 'Partner';
      case 'COMPETITOR': return 'Competidor';
      default: return type;
    }
  };

  const handleOpenSchedule = (type: 'CALL' | 'MEETING') => {
    if (!selectedContact) return;
    setInitialEventType(type);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (event: Omit<CalendarEvent, 'id'>) => {
    console.log("Event saved linked to contact:", selectedContact?.name, event);
    // In a real app, this would save to the backend or context
    setIsEventModalOpen(false);
  };

  const handleCreateContact = () => {
    // Basic validation
    if (!newContactData.name) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactData.name,
      role: newContactData.role || 'Sin Cargo',
      company: newContactData.company || 'Sin Empresa',
      email: newContactData.email || '',
      phone: newContactData.phone || '',
      type: newContactData.type || 'LEAD',
      status: newContactData.status || 'WARM',
      lastContact: new Date().toISOString().split('T')[0],
      tags: newContactData.tags || [],
      notes: newContactData.notes || '',
      // Default / empty values for optional fields
      ltv: 0,
      dealSize: 0,
      probability: 0,
    };

    setContacts([newContact, ...contacts]);
    setSelectedContact(newContact);
    setIsCreatingContact(false);
    // Reset form
    setNewContactData({ type: 'LEAD', status: 'WARM', tags: [] });
  };

  return (
    <div className="w-full h-screen bg-[#0B0B0D] text-obsidian-text-primary flex overflow-hidden font-sans relative">

      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute -left-[200px] top-[20%] w-[500px] h-[500px] bg-obsidian-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT PANEL: Contact List */}
      <div className={`${selectedContact ? 'hidden lg:flex lg:w-1/4' : 'w-full flex lg:w-3/4'} lg:border-r lg:border-white/5 flex-col transition-all duration-300 z-10 bg-[#0B0B0D]/50 backdrop-blur-sm`}>
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-light text-white tracking-[0.2em] uppercase drop-shadow-md">
              CRM <span className="text-obsidian-accent font-normal">NEXUS</span>
            </h1>
            <ObsidianButton size="sm" onClick={() => setIsCreatingContact(true)} className="shadow-[0_0_20px_rgba(106,79,251,0.2)] hover:shadow-[0_0_30px_rgba(106,79,251,0.4)] transition-all">
              <Plus size={16} />
              <span className="ml-2 hidden sm:inline">Nuevo Contacto</span>
            </ObsidianButton>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-obsidian-text-muted group-focus-within:text-obsidian-accent transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Buscar directivos, empresas, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16161A]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-obsidian-text-muted/50 focus:outline-none focus:border-obsidian-accent/50 focus:bg-[#16161A] transition-all shadow-inner"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
              {['ALL', 'CLIENT', 'LEAD', 'PARTNER', 'COMPETITOR'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as ContactType | 'ALL')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${selectedType === type
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'bg-transparent text-obsidian-text-muted border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                >
                  {type === 'ALL' ? 'Todos' : getTypeLabel(type as ContactType)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden ${selectedContact?.id === contact.id
                ? 'bg-white/[0.03] border-obsidian-accent/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                : 'bg-[#121215]/50 border-white/[0.03] hover:border-white/10 hover:bg-[#16161A]'
                }`}
            >
              {/* Highlight Bar */}
              {selectedContact?.id === contact.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-obsidian-accent shadow-[0_0_10px_#6A4FFB]" />
              )}

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden ${selectedContact?.id === contact.id ? 'bg-gradient-to-br from-obsidian-accent to-purple-900' : 'bg-[#1C1C21]'
                    }`}>
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{contact.name.charAt(0)}</span>
                    )}
                    {/* Ring for active */}
                    {selectedContact?.id === contact.id && (
                      <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium transition-colors ${selectedContact?.id === contact.id ? 'text-white' : 'text-obsidian-text-primary group-hover:text-white'}`}>
                      {contact.name}
                    </h3>
                    <p className="text-xs text-obsidian-text-muted">{contact.role} <span className="text-white/20 px-1">•</span> {contact.company}</p>
                  </div>
                </div>
                {getStatusBadge(contact.status)}
              </div>

              <div className="flex items-center gap-6 text-xs text-obsidian-text-secondary pl-16 relative z-10">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-white/70">
                  {getTypeIcon(contact.type)}
                  {getTypeLabel(contact.type)}
                </span>
                {contact.nextAction && (
                  <span className={`flex items-center gap-1.5 ${new Date(contact.nextActionDate!) < new Date() ? 'text-red-400' : 'text-yellow-500/80'}`}>
                    <Calendar size={12} />
                    {new Date(contact.nextActionDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* New Contact Button List Placeholder */}
          <button
            onClick={() => setIsCreatingContact(true)}
            className="w-full py-4 border border-dashed border-white/10 rounded-xl text-obsidian-text-muted hover:text-white hover:border-obsidian-accent/30 hover:bg-obsidian-accent/5 transition-all flex items-center justify-center gap-2 group"
          >
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-obsidian-accent group-hover:bg-obsidian-accent group-hover:text-white transition-all">
              <Plus size={12} />
            </div>
            <span className="text-sm font-light tracking-wider">Añadir Contacto</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Detail View */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col bg-[#0F0F12] h-full overflow-hidden animate-in slide-in-from-right-4 duration-300 relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          {/* Detail Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian-accent/10 to-[#0F0F12] pointer-events-none" />

            <div className="p-8 pb-0 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="lg:hidden text-obsidian-text-muted hover:text-white flex items-center gap-2"
                >
                  <ArrowUpRight className="rotate-[-135deg]" size={16} /> Atrás
                </button>
                <div className="ml-auto flex gap-2">
                  <ObsidianButton variant="secondary" size="sm" onClick={() => setSelectedContact(null)} className="hidden lg:flex hover:bg-white/10" aria-label="Cerrar detalle">
                    <X size={14} />
                  </ObsidianButton>
                  <div className="w-[1px] h-6 bg-white/10 mx-2 hidden lg:block"></div>
                  <ObsidianButton variant="secondary" size="sm">
                    <Edit3 size={14} />
                  </ObsidianButton>
                  <ObsidianButton variant="secondary" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 size={14} />
                  </ObsidianButton>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex items-start gap-8">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-obsidian-accent via-purple-900 to-[#0F0F12] flex items-center justify-center text-5xl text-white font-thin shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10">
                  {selectedContact.name.charAt(0)}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-light text-white tracking-tight">{selectedContact.name}</h1>
                    {getStatusBadge(selectedContact.status)}
                  </div>
                  <p className="text-xl text-obsidian-text-muted font-light mb-6 flex items-baseline gap-2">
                    {selectedContact.role} <span className="text-sm text-white/30 px-1">en</span> <span className="text-white font-normal">{selectedContact.company}</span>
                  </p>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-obsidian-accent">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-green-400">
                        <Phone size={16} />
                      </div>
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">{selectedContact.phone}</span>
                    </div>
                    {selectedContact.location && (
                      <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-blue-400">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">{selectedContact.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex gap-4 py-8 mt-4 border-b border-white/5">
                <ObsidianButton className="flex-1" glow>
                  <Mail size={16} className="mr-2" /> Enviar Email
                </ObsidianButton>
                <ObsidianButton variant="outline" className="flex-1 border-white/10 hover:border-white/30" onClick={() => handleOpenSchedule('CALL')}>
                  <Phone size={16} className="mr-2" /> Llamar
                </ObsidianButton>
                <ObsidianButton variant="outline" className="flex-1 border-white/10 hover:border-white/30" onClick={() => handleOpenSchedule('MEETING')}>
                  <Calendar size={16} className="mr-2" /> Agendar
                </ObsidianButton>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
            <div className="grid grid-cols-12 gap-8">

              {/* Main Info Column */}
              <div className="col-span-8 space-y-8">

                {/* Notes Section with modern card capability */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-obsidian-accent to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                  <div className="relative p-6 bg-[#16161A] rounded-xl border border-white/10">
                    <h3 className="text-xs font-bold text-obsidian-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Edit3 size={14} /> Notas Privadas
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-light">
                      {selectedContact.notes}
                    </p>
                  </div>
                </div>

                {/* Activity Feed */}
                <div>
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Historial de Interacciones</h3>
                  <div className="relative border-l border-white/10 ml-3 space-y-10 pl-8 pb-4">
                    {(selectedContact.history || []).map((interaction) => (
                      <div key={interaction.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[38px] top-1 w-5 h-5 rounded-full bg-[#0F0F12] border flex items-center justify-center z-10 
                          ${interaction.type === 'CALL' || interaction.type === 'MEETING' ? 'border-obsidian-accent shadow-[0_0_10px_rgba(106,79,251,0.3)]' : 'border-white/20'}`}>
                          <div className={`w-2 h-2 rounded-full ${interaction.type === 'CALL' || interaction.type === 'MEETING' ? 'bg-obsidian-accent' : 'bg-white/20'}`} />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-obsidian-text-muted font-mono">
                              {new Date(interaction.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider
                              ${interaction.type === 'CALL' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                interaction.type === 'EMAIL' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                  interaction.type === 'MEETING' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                                    'bg-white/5 border-white/10 text-white/50'
                              }`}>
                              {interaction.type}
                            </span>
                          </div>

                          <div className={`${interaction.type === 'EMAIL' ? 'bg-transparent p-0' : 'bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors'}`}>
                            <h4 className={`text-sm font-medium mb-1 ${interaction.type === 'EMAIL' ? 'text-obsidian-text-secondary' : 'text-white'}`}>
                              {interaction.subject}
                            </h4>
                            {interaction.details && (
                              <p className="text-xs text-obsidian-text-muted">{interaction.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!selectedContact.history || selectedContact.history.length === 0) && (
                      <div className="text-sm text-obsidian-text-muted italic">No hay historial de interacciones registrado.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Info Column */}
              <div className="col-span-4 space-y-6">
                {/* Key Metrics Card */}
                {(selectedContact.ltv || selectedContact.dealSize) && (
                  <ObsidianCard className="!bg-[#1A1A1E]/50 !backdrop-blur">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign size={14} className="text-green-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Valor Comercial</h4>
                    </div>

                    {selectedContact.ltv && (
                      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">LTV (Lifetime Value)</p>
                        <p className="text-2xl font-light text-white tabular-nums tracking-tight">${selectedContact.ltv.toLocaleString()}</p>
                      </div>
                    )}

                    {selectedContact.dealSize && (
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">Oportunidad Activa</p>
                          <p className="text-xs font-mono text-green-400">{selectedContact.probability}% Prob.</p>
                        </div>
                        <p className="text-2xl font-light text-green-400 tabular-nums tracking-tight mb-2">${selectedContact.dealSize.toLocaleString()}</p>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${selectedContact.probability}%` }} />
                        </div>
                      </div>
                    )}
                  </ObsidianCard>
                )}

                {/* Tags Card */}
                <ObsidianCard className="!bg-[#1A1A1E]/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={14} className="text-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Etiquetas</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[10px] text-purple-200 font-medium tracking-wide flex items-center gap-1.5 hover:bg-purple-500/20 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                    <button className="px-2.5 py-1 border border-dashed border-white/10 rounded-md text-[10px] text-obsidian-text-muted hover:text-white hover:border-white/30 transition-colors">
                      + Añadir
                    </button>
                  </div>
                </ObsidianCard>

                {/* Next Action Card */}
                {selectedContact.nextAction && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
                    <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle size={14} /> Próxima Acción
                    </h4>
                    <p className="text-white text-base font-light mb-1">{selectedContact.nextAction}</p>
                    <p className="text-amber-500/60 text-xs flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(selectedContact.nextActionDate!).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-obsidian-text-muted bg-[#0B0B0D] relative z-0">
          <div className="w-[400px] h-[400px] bg-obsidian-accent/5 rounded-full blur-[120px] absolute pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/5 to-transparent border border-white/5 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-sm">
              <Users size={64} className="text-white/20" />
            </div>
            <h2 className="text-3xl font-thin text-white mb-3 tracking-wide">Nexus CRM</h2>
            <p className="max-w-md text-center text-obsidian-text-secondary text-base leading-relaxed">
              Selecciona un contacto para ver su expediente, historial de interacciones y métricas de valor.
            </p>
          </div>
        </div>
      )}

      {/* NEW CONTACT MODAL */}
      {isCreatingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#141418]">
              <div>
                <h2 className="text-xl font-light text-white tracking-wide">Nuevo Contacto</h2>
                <p className="text-xs text-obsidian-text-muted mt-1">Ingresa la información básica para crear una ficha.</p>
              </div>
              <button onClick={() => setIsCreatingContact(false)} className="text-obsidian-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">

              <div className="space-y-4">
                <h3 className="text-xs text-obsidian-accent font-bold uppercase tracking-widest mb-4">Información Principal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <ObsidianInput
                      label="Nombre Completo"
                      placeholder="Ej. Ana García"
                      value={newContactData.name || ''}
                      onChange={(e) => setNewContactData({ ...newContactData, name: e.target.value })}
                    />
                  </div>
                  <ObsidianInput
                    label="Cargo"
                    placeholder="Ej. Director de Marketing"
                    value={newContactData.role || ''}
                    onChange={(e) => setNewContactData({ ...newContactData, role: e.target.value })}
                  />
                  <ObsidianInput
                    label="Empresa"
                    placeholder="Ej. TechSolutions Inc."
                    value={newContactData.company || ''}
                    onChange={(e) => setNewContactData({ ...newContactData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs text-obsidian-accent font-bold uppercase tracking-widest mb-4">Contacto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ObsidianInput
                    label="Email Corporativo"
                    placeholder="ana@techsolutions.com"
                    icon={<Mail size={14} />}
                    value={newContactData.email || ''}
                    onChange={(e) => setNewContactData({ ...newContactData, email: e.target.value })}
                  />
                  <ObsidianInput
                    label="Teléfono"
                    placeholder="+1 234 567 890"
                    icon={<Phone size={14} />}
                    value={newContactData.phone || ''}
                    onChange={(e) => setNewContactData({ ...newContactData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs text-obsidian-accent font-bold uppercase tracking-widest mb-4">Clasificación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-obsidian-text-muted uppercase tracking-wider">Tipo</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['CLIENT', 'LEAD', 'PARTNER', 'COMPETITOR'].map(t => (
                        <button
                          key={t}
                          onClick={() => setNewContactData({ ...newContactData, type: t as ContactType })}
                          className={`py-2 px-2 rounded border text-xs font-medium transition-all ${newContactData.type === t
                            ? 'bg-obsidian-accent text-white border-obsidian-accent'
                            : 'bg-white/5 text-obsidian-text-muted border-transparent hover:border-white/10'
                            }`}
                        >
                          {getTypeLabel(t as ContactType)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-obsidian-text-muted uppercase tracking-wider">Estado Inicial</label>
                    <select
                      value={newContactData.status || 'WARM'}
                      onChange={(e) => setNewContactData({ ...newContactData, status: e.target.value as ContactStatus })}
                      className="w-full bg-[#1A1A1E] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-obsidian-accent"
                    >
                      <option value="ACTIVE">Activo</option>
                      <option value="WARM">Warm Lead</option>
                      <option value="COLD">Cold Lead</option>
                      <option value="INACTIVE">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#141418] flex justify-end gap-3">
              <button
                onClick={() => setIsCreatingContact(false)}
                className="px-6 py-2.5 rounded-lg text-sm text-obsidian-text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <ObsidianButton onClick={handleCreateContact} glow>
                <CheckCircle2 size={16} className="mr-2" />
                Crear Contacto
              </ObsidianButton>
            </div>

          </div>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialContact={selectedContact || undefined}
      />

    </div>
  );
};
