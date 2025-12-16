import React, { useState } from 'react';
import { LayoutDashboard, FlaskConical, Settings, LogOut, Network, Briefcase, ScanFace, BrainCircuit, Scale, Share2, HeartPulse, Fingerprint, ChevronRight, ChevronLeft, MessageSquareText, Mail, Filter, Gift, Users, Wallet, TrendingUp, Calendar } from 'lucide-react';

interface SidebarProps {
  currentView: 'war-room' | 'dto-lab' | 'swarm-orchestrator' | 'negotiation-hub' | 'persona-studio' | 'content-social' | 'bionic-sales' | 'neuro-finance' | 'ontology-core' | 'system-health' | 'ssi-vault' | 'email-hub' | 'funnels' | 'lead-magnet' | 'contacts' | 'calendar';
  onChangeView: (view: 'war-room' | 'dto-lab' | 'swarm-orchestrator' | 'negotiation-hub' | 'persona-studio' | 'content-social' | 'bionic-sales' | 'neuro-finance' | 'ontology-core' | 'system-health' | 'ssi-vault' | 'email-hub' | 'funnels' | 'lead-magnet' | 'contacts' | 'calendar') => void;
  onLogout: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, onOpenHelp }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navSections = [
    {
      title: 'COMMAND',
      items: [
        { id: 'war-room', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'dto-lab', label: 'Simulador', icon: <FlaskConical size={20} /> },
        { id: 'email-hub', label: 'Email Hub', icon: <Mail size={20} /> },
        { id: 'calendar', label: 'Calendario', icon: <Calendar size={20} /> },
      ]
    },
    {
      title: 'AUTOMATIZACIÓN',
      items: [
        { id: 'swarm-orchestrator', label: 'Automatizaciones', icon: <Network size={20} /> },
        { id: 'negotiation-hub', label: 'Negotiation (MNP)', icon: <Briefcase size={20} /> },
      ]
    },
    {
      title: 'GROWTH',
      items: [
        { id: 'persona-studio', label: 'Persona Studio', icon: <ScanFace size={20} /> },
        { id: 'content-social', label: 'Social Studio', icon: <MessageSquareText size={20} /> },
        { id: 'bionic-sales', label: 'Bionic Sales', icon: <TrendingUp size={20} /> },
        { id: 'contacts', label: 'Contactos', icon: <Users size={20} /> },
        { id: 'neuro-finance', label: 'Neuro-Finance', icon: <Wallet size={20} /> },
        { id: 'funnels', label: 'Funnels', icon: <Filter size={20} /> },
        { id: 'lead-magnet', label: 'Lead Magnets', icon: <Gift size={20} /> },
      ]
    },
    {
      title: 'INFRAESTRUCTURA',
      items: [
        { id: 'neuro-finance', label: 'Finanzas', icon: <Scale size={20} /> },
        { id: 'ontology-core', label: 'Ontologies', icon: <Share2 size={20} /> },
        { id: 'system-health', label: 'Health & Audit', icon: <HeartPulse size={20} /> },
        { id: 'ssi-vault', label: 'Seguridad', icon: <Fingerprint size={20} /> },
      ]
    }
  ];

  return (
    <aside
      className={`
        sticky top-0 h-screen flex flex-col items-center bg-[#0F0F12]/95 backdrop-blur-xl border-r border-white/[0.04] z-50 
        transition-all duration-300 ease-in-out shadow-[5px_0_30px_rgba(0,0,0,0.5)] flex-shrink-0
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#1A1A1D] border border-white/10 rounded-full p-1 z-50 text-white shadow-lg hover:border-obsidian-accent hover:bg-obsidian-accent transition-all"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`py-8 flex flex-col items-center justify-center transition-all duration-300 ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-thin text-white tracking-widest animate-[fadeIn_0.3s_ease-out]">OBSIDIAN</span>
          )}
        </div>
        {isCollapsed && <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2"></div>}
      </div>

      {/* Nav Sections Container (Scrollable) */}
      <nav
        className="flex-1 w-full flex flex-col gap-6 overflow-y-auto px-3 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >

        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col w-full">
            {/* Section Header */}
            <div className={`
                text-[8px] font-bold text-obsidian-text-muted/40 tracking-[0.25em] mb-3 uppercase select-none transition-all duration-300
                ${isCollapsed ? 'text-center' : 'text-left px-4'}
            `}>
              {section.title}
            </div>

            {/* Section Items */}
            <div className="space-y-1 w-full flex flex-col">
              {section.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeView(item.id as any)}
                    className={`
                        group relative w-full flex items-center h-10 transition-all duration-300 rounded-lg overflow-hidden
                        ${isCollapsed ? 'justify-center' : 'px-3 justify-start'}
                        ${isActive ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-obsidian-accent shadow-[0_0_12px_#6A4FFB] rounded-r-full"></div>
                    )}

                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 transition-colors duration-300 z-10
                      ${isActive ? 'text-white' : 'text-obsidian-text-muted group-hover:text-white'}
                    `}>
                      {item.icon}
                    </div>

                    {/* Label (Expanded Only) */}
                    <span className={`
                        ml-3 text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300
                        ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto text-obsidian-text-primary group-hover:text-white'}
                        ${isActive && !isCollapsed ? 'text-white' : ''}
                    `}>
                      {item.label}
                    </span>

                    {/* Tooltip for Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-[#16161A] border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl uppercase tracking-wider backdrop-blur-md">
                        {item.label}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Subtle Divider */}
            {section.title !== 'BACKBONE' && (
              <div className={`h-[1px] bg-white/[0.03] mt-4 mx-auto transition-all ${isCollapsed ? 'w-6' : 'w-[90%]'}`}></div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className={`flex flex-col gap-1 w-full py-4 border-t border-white/[0.04] bg-[#0F0F12]/50 backdrop-blur transition-all ${isCollapsed ? 'items-center' : 'px-3 items-start'}`}>

        {/* Utility Shortcuts */}
        <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'gap-1 px-2 mb-2 w-full justify-start'}`}>
          <button className="p-2 text-obsidian-text-muted hover:text-white hover:bg-white/10 rounded transition-colors" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          </button>
          <button className="p-2 text-obsidian-text-muted hover:text-white hover:bg-white/10 rounded transition-colors" title="Quick Notes">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M15 3v6h6" /></svg>
          </button>
          <button className="p-2 text-obsidian-text-muted hover:text-white hover:bg-white/10 rounded transition-colors" title="Global Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
        </div>

        <div className={`h-[1px] bg-white/[0.04] w-full my-1 ${isCollapsed ? 'hidden' : 'block'}`}></div>

        <button
          onClick={onOpenHelp}
          className={`flex items-center gap-3 text-obsidian-text-muted hover:text-obsidian-accent transition-colors p-2.5 rounded-lg hover:bg-white/[0.04] w-full ${isCollapsed ? 'justify-center' : ''}`} title="Ayuda y Glosario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          {!isCollapsed && <span className="text-xs">Ayuda</span>}
        </button>

        <button className={`flex items-center gap-3 text-obsidian-text-muted hover:text-white transition-colors p-2.5 rounded-lg hover:bg-white/[0.04] w-full ${isCollapsed ? 'justify-center' : ''}`} title="Settings">
          <Settings size={18} strokeWidth={1.5} />
          {!isCollapsed && <span className="text-xs">Settings</span>}
        </button>
        <button onClick={onLogout} className={`flex items-center gap-3 text-obsidian-text-muted hover:text-red-400 transition-colors p-2.5 rounded-lg hover:bg-red-500/10 w-full ${isCollapsed ? 'justify-center' : ''}`} title="Logout">
          <LogOut size={18} strokeWidth={1.5} />
          {!isCollapsed && <span className="text-xs">Logout</span>}
        </button>
      </div>
    </aside>
  );
};