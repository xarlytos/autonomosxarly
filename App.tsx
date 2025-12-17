import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import DTOLab from './components/DTOLab';
import SwarmOrchestrator from './components/SwarmOrchestrator';
import NegotiationHub from './components/NegotiationHub';
import PersonaStudio from './components/PersonaStudio';
import BionicSales from './components/BionicSales';
import NeuroFinance from './components/NeuroFinance';
import OntologyCore from './components/OntologyCore';
import SystemHealth from './components/SystemHealth';
import SSIVault from './components/SSIVault';
import ContentSocialStudio from './components/ContentSocialStudio';
import EmailHub from './components/EmailHub';
import Funnels from './components/Funnels';
import LeadMagnet from './components/LeadMagnet';
import { ContactManager } from './components/CRM/ContactManager';
import { ObsidianCard, ObsidianButton } from './components/ui/ObsidianElements';
import type { AuthState, LoginFormData } from './types';
import { Wifi, WifiOff, Settings2 } from 'lucide-react';
import { useWarRoom } from './hooks/useWarRoom';
import { useDashboardLayout } from './hooks/useDashboardLayout';
import { DashboardGrid, DashboardCustomizer } from './components/Dashboard';
import { HelpCenter } from './components/HelpCenter/HelpCenter';
import {
  KPIPanel,
  SwarmStatusPanel,
  EventStream,
  OpportunitiesPanel,
  AlertsPanel,
  SystemMetrics,
  MarketTopology
} from './components/WarRoom';
import { CalendarManager } from './components/Calendar/CalendarManager';
import { TodayEventsWidget } from './components/Dashboard/TodayEventsWidget';
import type { WidgetType } from './types/dashboard';

// --- DASHBOARD PRINCIPAL PAGE ---


// --- DASHBOARD PRINCIPAL PAGE ---

import { InteractiveTour } from './components/Onboarding/InteractiveTour';
import { useOnboarding } from './hooks/useOnboarding';
import { DASHBOARD_TOUR_STEPS } from './data/tourSteps';



interface WarRoomDashboardProps {
  onNavigate: (view: any) => void;
}

const WarRoomDashboard: React.FC<WarRoomDashboardProps> = ({ onNavigate }) => {
  const { uiMode } = useGlobalState();
  const { connected, kpis, swarms, events, opportunities, alerts, controlSwarm, markAlertAsRead } = useWarRoom();
  const { layout, isCustomizing, setIsCustomizing, addWidget, removeWidget, updateLayout, resetLayout } = useDashboardLayout();
  const [activeTab, setActiveTab] = useState<'overview' | 'swarms' | 'alerts'>('overview');

  // Advanced widgets to hide in Lite Mode
  const advancedWidgets: WidgetType[] = ['swarm-status', 'system-metrics', 'market-topology', 'event-stream'];

  // Filter widgets for Lite Mode
  const visibleWidgets = uiMode === 'lite'
    ? layout.widgets.filter(w => !advancedWidgets.includes(w.type))
    : layout.widgets;

  // Onboarding Hook
  const { isPlaying, completeTour, skipTour } = useOnboarding('dashboard');

  // Helper function to get widget title
  const getWidgetTitle = (type: WidgetType): string => {
    const titles: Record<WidgetType, string> = {
      'kpi-revenue': 'Ingresos',
      'kpi-profitability': 'Rentabilidad',
      'kpi-efficiency': 'Eficiencia',
      'system-metrics': 'Métricas del Sistema',
      'opportunities': 'Oportunidades',
      'market-topology': 'Topología de Mercado',
      'event-stream': 'Stream de Eventos',
      'swarm-status': 'Estado de Enjambres',
      'calendar-events': 'Agenda de Hoy'
    };
    return titles[type] || type;
  };

  // Helper function to render widget content
  const renderWidget = (type: WidgetType) => {
    switch (type) {
      case 'kpi-revenue':
        return <KPIPanel kpis={kpis} />;
      case 'system-metrics':
        return <SystemMetrics kpis={kpis} />;
      case 'opportunities':
        return <OpportunitiesPanel opportunities={opportunities} />;
      case 'market-topology':
        return <MarketTopology kpis={kpis} opportunities={opportunities} />;
      case 'event-stream':
        return <EventStream events={events} />;
      case 'swarm-status':
        return <SwarmStatusPanel swarms={swarms} onControlSwarm={controlSwarm} />;
      case 'calendar-events':
        return <TodayEventsWidget onViewCalendar={() => onNavigate('calendar')} />;
      default:
        return <div className="text-obsidian-text-muted text-sm">Widget: {type}</div>;
    }
  };

  // Handle layout changes from drag-and-drop
  const handleLayoutChange = (newLayout: any[]) => {
    const updatedWidgets = visibleWidgets.map(widget => {
      const layoutItem = newLayout.find(l => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: { x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h }
        };
      }
      return widget;
    });
    // Use visibleWidgets logic slightly adjusted or just updateLayout
    // Since we're in lite mode, we only update filtered widgets. 
    // This is tricky for persistence if we overwrite layout with partial widgets.
    // For now, let's just update the specific widgets that moved.
    // But updateLayout expects full list? 
    // If updateLayout overwrites state, we might lose hidden widgets.
    // Assuming updateLayout merges or we pass only modified ones.
    // Let's assume for now we only support reordering visible ones and it might save partially.
    // Ideally updateLayout should handle merging.
    updateLayout(updatedWidgets);
  };

  return (
    <div className="w-full h-screen px-6 py-6 overflow-hidden relative">
      <InteractiveTour
        isOpen={isPlaying}
        steps={DASHBOARD_TOUR_STEPS}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-obsidian-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-obsidian-success/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="dashboard-header relative z-20 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.3em] font-light uppercase">Obsidian OS v3.0 // Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <Wifi size={12} className="text-obsidian-success" />
                <span className="text-[9px] text-obsidian-success uppercase tracking-wider">En Línea</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-400" />
                <span className="text-[9px] text-red-400 uppercase tracking-wider">Desconectado</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="dashboard-tabs flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'text-white border-b-2 border-obsidian-accent' : 'text-obsidian-text-muted hover:text-white'}`}
            >
              Resumen
            </button>

            {uiMode === 'advanced' && (
              <>
                <button
                  onClick={() => setActiveTab('swarms')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${activeTab === 'swarms' ? 'text-white border-b-2 border-obsidian-accent' : 'text-obsidian-text-muted hover:text-white'}`}
                >
                  Enjambres ({swarms.length})
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-colors relative ${activeTab === 'alerts' ? 'text-white border-b-2 border-obsidian-accent' : 'text-obsidian-text-muted hover:text-white'}`}
                >
                  Alertas
                  {alerts.filter(a => !a.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Customize Button */}
          {activeTab === 'overview' && (
            <div className="dashboard-customize-btn">
              <ObsidianButton
                variant="outline"
                onClick={() => setIsCustomizing(true)}
                className="text-xs"
              >
                <Settings2 size={14} />
                Personalizar
              </ObsidianButton>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-[calc(100%-80px)]">
        {activeTab === 'overview' && (
          <DashboardGrid
            widgets={visibleWidgets}
            isCustomizing={isCustomizing}
            onLayoutChange={handleLayoutChange}
            onRemoveWidget={removeWidget}
            renderWidget={renderWidget}
            getWidgetTitle={getWidgetTitle}
          />
        )}

        {activeTab === 'swarms' && uiMode === 'advanced' && (
          <div className="w-full max-w-4xl mx-auto h-full overflow-y-auto">
            <SwarmStatusPanel swarms={swarms} onControlSwarm={controlSwarm} />
          </div>
        )}

        {activeTab === 'alerts' && uiMode === 'advanced' && (
          <div className="w-full max-w-4xl mx-auto h-full overflow-y-auto">
            <AlertsPanel alerts={alerts} onMarkAsRead={markAlertAsRead} />
          </div>
        )}
      </div>

      {/* Customizer Modal */}
      {isCustomizing && (
        <DashboardCustomizer
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
          onReset={resetLayout}
          onClose={() => setIsCustomizing(false)}
          existingWidgets={visibleWidgets.map(w => w.type)}
          currentWidgets={visibleWidgets}
          getWidgetTitle={getWidgetTitle}
        />
      )}
    </div>
  );
};

// --- MAIN APP LOGIC ---

import { useGlobalState } from './context/GlobalStateContext';

// ... existing imports

const App: React.FC = () => {
  const { uiMode } = useGlobalState();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  const [currentView, setCurrentView] = useState<'war-room' | 'dto-lab' | 'swarm-orchestrator' | 'negotiation-hub' | 'persona-studio' | 'content-social' | 'bionic-sales' | 'neuro-finance' | 'ontology-core' | 'system-health' | 'ssi-vault' | 'email-hub' | 'funnels' | 'lead-magnet' | 'contacts' | 'calendar'>('war-room');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Advanced modules that are restricted in Lite Mode
  const advancedModules = [
    'dto-lab', 'swarm-orchestrator', 'negotiation-hub',
    'persona-studio', 'content-social', 'funnels',
    'lead-magnet', 'ontology-core', 'system-health', 'ssi-vault'
  ];

  // Helper to safely change view enforcing Lite Mode restrictions
  const handleNavigate = (view: typeof currentView) => {
    if (uiMode === 'lite' && advancedModules.includes(view)) {
      // If trying to access advanced module in lite mode, redirect to dashboard
      setCurrentView('war-room');
      return;
    }
    setCurrentView(view);
  };

  // Effect to redirect to dashboard if current view becomes invalid due to mode switch
  useEffect(() => {
    if (uiMode === 'lite' && advancedModules.includes(currentView)) {
      setCurrentView('war-room');
    }
  }, [uiMode, currentView]);

  const handleLogin = (data: LoginFormData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate API delay
    setTimeout(() => {
      // STRICT MOCK VALIDATION
      if (data.email === 'admin@obsidian.ai' && data.pass === '123456') {
        setAuthState({
          isAuthenticated: true,
          user: { id: '1', name: 'Comandante', email: data.email },
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Credenciales inválidas. Usa la cuenta Demo.',
        }));
      }
    }, 1500);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
    setCurrentView('war-room');
  };

  if (authState.isAuthenticated) {
    return (
      <div className="bg-[#0B0B0D] min-h-screen text-obsidian-text-primary font-sans flex">
        <Sidebar
          currentView={currentView}
          onChangeView={handleNavigate}
          onLogout={handleLogout}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        <main className="flex-1 h-screen overflow-hidden bg-[#0B0B0D]">
          {currentView === 'war-room' && <WarRoomDashboard onNavigate={handleNavigate} />}
          {currentView === 'dto-lab' && <DTOLab />}
          {currentView === 'swarm-orchestrator' && <SwarmOrchestrator />}
          {currentView === 'negotiation-hub' && <NegotiationHub />}
          {currentView === 'persona-studio' && <PersonaStudio />}
          {currentView === 'content-social' && <ContentSocialStudio />}
          {currentView === 'bionic-sales' && <BionicSales />}
          {currentView === 'contacts' && <ContactManager />}
          {currentView === 'calendar' && <CalendarManager />}
          {currentView === 'neuro-finance' && <NeuroFinance />}
          {currentView === 'ontology-core' && <OntologyCore />}
          {currentView === 'system-health' && <SystemHealth />}
          {currentView === 'ssi-vault' && <SSIVault />}
          {currentView === 'email-hub' && <EmailHub />}
          {currentView === 'funnels' && <Funnels />}
          {currentView === 'lead-magnet' && <LeadMagnet />}
        </main>

        <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] relative flex items-center justify-center overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0D]/80 to-[#0B0B0D] z-0 pointer-events-none" />

      <LoginForm
        onLogin={handleLogin}
        isLoading={authState.isLoading}
        error={authState.error}
      />
    </div>
  );
};

export default App;