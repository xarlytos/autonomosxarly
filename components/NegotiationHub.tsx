import React, { useState, useEffect, useRef } from 'react';
import { ObsidianCard, ObsidianButton, ObsidianSlider } from './ui/ObsidianElements';
import {
  ShieldCheck, Lock, CheckCircle2, FileCode, Play, AlertTriangle, ArrowRightLeft,
  Plus, TrendingUp, TrendingDown, DollarSign, Clock, Users, Eye, Pause,
  PlayCircle, StopCircle, Calendar, Target, MessageSquare, Activity,
  FileText, Download, Share2, ArrowLeft, ChevronRight, Zap, AlertCircle,
  CheckCircle, XCircle, Edit2, Trash2, BarChart3, Hash, RefreshCw, History,
  ArrowRight, X, Send
} from 'lucide-react';

import { useGlobalState } from '../context/GlobalStateContext';
import { Negotiation, Offer, NegotiationStatus, AIStrategy } from '../types';
import { HelpIcon } from './Help/HelpIcon';
import { GLOSSARY } from '../data/glossary';

// --- Types transferred to global types.ts ---


const STRATEGY_INFO: Record<AIStrategy, { name: string; description: string; icon: string }> = {
  ANCHORING: { name: 'Anclaje', description: 'Establece un punto de referencia inicial alto/bajo', icon: '⚓' },
  RECIPROCITY: { name: 'Reciprocidad', description: 'Pequeñas concesiones generan reciprocidad', icon: '🔄' },
  SCARCITY: { name: 'Escasez', description: 'Enfatiza urgencia y disponibilidad limitada', icon: '⏰' },
  SOCIAL_PROOF: { name: 'Prueba Social', description: 'Demuestra que otros aceptaron términos similares', icon: '👥' },
  AUTHORITY: { name: 'Autoridad', description: 'Referencia a expertos y estándares del sector', icon: '🎯' },
  COMPROMISE: { name: 'Compromiso', description: 'Búsqueda activa de punto medio', icon: '🤝' },
};

const NegotiationHub: React.FC = () => {
  const { negotiations, updateNegotiation } = useGlobalState(); // Use Global State
  const [viewMode, setViewMode] = useState<'table' | 'detail'>('table');
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null);

  const selectedNegotiation = negotiations.find(n => n.id === selectedNegotiationId) || null;

  const [aggressiveness, setAggressiveness] = useState(50);
  const [showStrategyPanel, setShowStrategyPanel] = useState(false);
  const [showOffersHistory, setShowOffersHistory] = useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | NegotiationStatus>('ALL');
  const [logs, setLogs] = useState<string[]>([
    "[MNP-OUT]: Offer sent: $11,750 + Net15.",
    "[MNP-IN]: Counter-party accepts. Sentiment: Positive (0.7).",
    "[AI-CORE]: ZOPA Detected! Range: $11K-$13.5K",
    "[AI-CORE]: Activating Strategy: ANCHORING + RECIPROCITY"
  ]);

  // Chat State
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedNegotiation?.offers]);

  // Handle Send Message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedNegotiation) return;

    const newOffer: Offer = {
      id: `o-${Date.now()}`,
      timestamp: new Date().toISOString(),
      from: 'US',
      message: inputMessage,
      sentiment: 0.5, // Neutral initial sentiment
      amount: extractAmount(inputMessage) // Helper to extract numbers
    };

    // Update state active negotiation
    const updatedNegotiation = {
      ...selectedNegotiation,
      offers: [...(selectedNegotiation.offers || []), newOffer]
    };

    updateNegotiation(updatedNegotiation); // Update GLOBAL state
    setInputMessage('');

    // Trigger Bot Response
    setTimeout(() => {
      simulateBotResponse(updatedNegotiation);
    }, 1500);
  };

  const extractAmount = (text: string): number | undefined => {
    const match = text.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)/);
    if (!match) return undefined;
    return parseFloat(match[1].replace(/,/g, ''));
  };

  const simulateBotResponse = (currentNeg: Negotiation) => {
    if (!currentNeg || currentNeg.status !== 'ACTIVE') return;

    // Simple Logic: React to the last offer
    const lastOffer = currentNeg.offers![currentNeg.offers!.length - 1];
    let botMessage = "Déjeme considerar su oferta...";
    let sentiment = 0.5;

    // Logic based on types
    if (currentNeg.type === 'BUY') {
      // Buying: We want lower price
      if (lastOffer.amount) {
        if (lastOffer.amount < (currentNeg.targetPrice || 0)) {
          botMessage = "Ese precio es demasiado bajo. No podemos aceptarlo.";
          sentiment = 0.2;
        } else if (lastOffer.amount > (currentNeg.reservationPrice || 0)) {
          botMessage = "Es una oferta razonable. Podemos cerrar el trato.";
          sentiment = 0.9;
        } else {
          botMessage = `Podríamos aceptarlo si cerramos en $${(lastOffer.amount * 1.05).toFixed(0)}.`;
          sentiment = 0.6;
        }
      } else {
        botMessage = "Entiendo su punto. ¿Cuál es su propuesta económica concreta?";
      }
    } else {
      // Selling: We want higher price
      if (lastOffer.amount) {
        if (lastOffer.amount > (currentNeg.targetPrice || 0)) {
          botMessage = "¡Trato hecho! Es un precio excelente.";
          sentiment = 0.95;
        } else {
          botMessage = "Necesitamos subir un poco más para cubrir costos.";
          sentiment = 0.4;
        }
      } else {
        botMessage = "¿Tiene alguna cifra en mente?";
      }
    }

    const botOffer: Offer = {
      id: `bot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      from: 'THEM',
      message: botMessage,
      sentiment: sentiment
    };

    updateNegotiation({
      ...currentNeg,
      offers: [...(currentNeg.offers || []), botOffer]
    });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return '#45FF9A';
    if (sentiment >= 0.5) return '#FFA500';
    if (sentiment >= 0.3) return '#FF9500';
    return '#FF6B6B';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.7) return 'Positivo';
    if (sentiment >= 0.5) return 'Neutral';
    if (sentiment >= 0.3) return 'Hesitante';
    return 'Negativo';
  };

  const getStatusColor = (status: NegotiationStatus) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'AUCTION': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'PAUSED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'CLOSED': return 'text-obsidian-text-muted bg-white/5 border-white/10';
      case 'FAILED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  const handleViewDetail = (negotiation: Negotiation) => {
    setSelectedNegotiationId(negotiation.id);
    setViewMode('detail');
  };

  const handleBackToTable = () => {
    setViewMode('table');
    setSelectedNegotiationId(null);
  };

  // Filtrar negociaciones
  const filteredNegotiations = negotiations.filter(neg => {
    if (filterType !== 'ALL' && neg.type !== filterType) return false;
    if (filterStatus !== 'ALL' && neg.status !== filterStatus) return false;
    return true;
  });

  // --- Animation Loop for Nash Graph ---
  useEffect(() => {
    if (viewMode !== 'detail') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let animationId: number;

    const render = () => {
      time += 0.02;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = '#BEBEC6';
      ctx.beginPath(); ctx.moveTo(40, height - 40); ctx.lineTo(width - 40, height - 40); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(40, height - 40); ctx.lineTo(40, 40); ctx.stroke(); // Y

      // Buyer Utility Curve (Green, Descending)
      ctx.beginPath();
      ctx.moveTo(40, 60);
      ctx.bezierCurveTo(width * 0.4, 60, width * 0.6, height - 60, width - 40, height - 40);
      ctx.strokeStyle = '#45FF9A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Seller Utility Curve (White, Ascending) - Animated
      const shift = Math.sin(time) * 10;
      ctx.beginPath();
      ctx.moveTo(40, height - 40);
      ctx.bezierCurveTo(width * 0.3, height - 40, width * 0.7, 60 + shift, width - 40, 40);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Nash Equilibrium Point (Intersection)
      const eqX = width / 2 + Math.sin(time * 0.5) * 5;
      const eqY = height / 2 + Math.cos(time * 0.5) * 5;

      // Pulse
      ctx.beginPath();
      ctx.arc(eqX, eqY, 15 + Math.sin(time * 3) * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(69, 255, 154, 0.1)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eqX, eqY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Axis Labels
      ctx.fillStyle = '#8C8C97';
      ctx.font = '10px Inter';
      ctx.fillText('PRICE UTILITY', width - 80, height - 25);
      ctx.save();
      ctx.translate(25, 100);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('CONFLICT', 0, 0);
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [viewMode, selectedNegotiation]);

  // Vista de Tabla
  if (viewMode === 'table') {
    return (
      <div className="w-full h-full bg-[#0B0B0D] text-obsidian-text-primary px-6 py-6 flex flex-col gap-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl font-light text-white tracking-widest flex items-center gap-2">
              <ArrowRightLeft className="text-obsidian-accent" size={20} />
              NEGOTIATION HUB <span className="text-obsidian-text-muted text-sm font-normal">PROTOCOL MNP</span>
            </h1>
            <p className="text-xs text-obsidian-text-muted mt-1">Gestión centralizada de negociaciones automáticas</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20 flex items-center gap-1">
              <Activity size={10} /> ACTIVE NODES: {negotiations.filter(n => n.status === 'ACTIVE').length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded text-xs transition-all ${filterType === 'ALL' ? 'bg-obsidian-accent text-white' : 'bg-white/5 text-obsidian-text-muted hover:bg-white/10'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('BUY')}
              className={`px-4 py-2 rounded text-xs transition-all ${filterType === 'BUY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-obsidian-text-muted hover:bg-white/10'}`}
            >
              Compras
            </button>
            <button
              onClick={() => setFilterType('SELL')}
              className={`px-4 py-2 rounded text-xs transition-all ${filterType === 'SELL' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-obsidian-text-muted hover:bg-white/10'}`}
            >
              Ventas
            </button>
          </div>

          <div className="flex gap-2 ml-auto">
            {['ALL', 'ACTIVE', 'AUCTION', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-2 rounded text-xs transition-all ${filterStatus === status ? 'bg-white/10 text-white' : 'bg-white/5 text-obsidian-text-muted hover:bg-white/10'}`}
              >
                {status === 'ALL' ? 'Todos' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <ObsidianCard className="flex-1 overflow-hidden flex flex-col" noPadding>
          <div className="overflow-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#0F0F12] z-10 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">ID</th>
                  <th className="text-left p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Contraparte</th>
                  <th className="text-left p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Tipo</th>
                  <th className="text-left p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Producto</th>
                  <th className="text-right p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Monto</th>
                  <th className="text-center p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Progreso</th>
                  <th className="text-center p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Estado</th>
                  <th className="text-center p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Sentimiento</th>
                  <th className="text-center p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium flex items-center justify-center gap-1">
                    ZOPA
                    <HelpIcon term={GLOSSARY['zopa'].term} content={GLOSSARY['zopa'].shortDefinition} size={10} />
                  </th>
                  <th className="text-center p-4 text-[10px] text-obsidian-text-muted uppercase tracking-wider font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredNegotiations.map((neg, index) => (
                  <tr
                    key={neg.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4">
                      <span className="text-xs font-mono text-obsidian-text-muted">#{neg.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm text-white font-medium">{neg.counterparty}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded border ${neg.type === 'BUY' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                        {neg.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-obsidian-text-primary">{neg.product}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm text-white font-mono">${neg.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${neg.status === 'AUCTION' ? 'bg-yellow-400' : neg.status === 'CLOSED' ? 'bg-green-400' : 'bg-obsidian-accent'}`}
                            style={{ width: `${neg.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-obsidian-text-muted font-mono w-10 text-right">{neg.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(neg.status)}`}>
                        {neg.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${neg.sentiment * 100}%`,
                              backgroundColor: getSentimentColor(neg.sentiment)
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: getSentimentColor(neg.sentiment) }}>
                          {(neg.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {neg.zopaDetected ? (
                        <CheckCircle size={16} className="text-green-400 mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-obsidian-text-muted mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewDetail(neg)}
                        className="px-3 py-1.5 bg-obsidian-accent/20 text-obsidian-accent hover:bg-obsidian-accent hover:text-white rounded text-xs transition-all opacity-0 group-hover:opacity-100"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Footer */}
          <div className="border-t border-white/10 p-4 grid grid-cols-4 gap-4 bg-[#0F0F12]">
            <div className="text-center">
              <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">Total Negociaciones</p>
              <p className="text-xl text-white font-light">{negotiations.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">Activas</p>
              <p className="text-xl text-green-400 font-light">{negotiations.filter(n => n.status === 'ACTIVE').length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">Cerradas</p>
              <p className="text-xl text-obsidian-text-muted font-light">{negotiations.filter(n => n.status === 'CLOSED').length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-1">Volumen Total</p>
              <p className="text-xl text-white font-light">${negotiations.reduce((sum, n) => sum + n.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </ObsidianCard>
      </div>
    );
  }

  // Vista de Detalle
  return (
    <div className="w-full h-full bg-[#0B0B0D] text-obsidian-text-primary px-6 py-6 flex flex-col gap-6 overflow-y-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToTable}
            className="p-2 hover:bg-white/5 rounded transition-colors"
          >
            <ArrowLeft className="text-obsidian-text-muted hover:text-white" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-light text-white tracking-widest flex items-center gap-2">
              {selectedNegotiation?.counterparty}
              <span className={`text-xs px-2 py-1 rounded border ${selectedNegotiation ? getStatusColor(selectedNegotiation.status) : ''}`}>
                {selectedNegotiation?.status}
              </span>
            </h1>
            <p className="text-xs text-obsidian-text-muted mt-1">{selectedNegotiation?.product} • Negociación #{selectedNegotiation?.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ObsidianButton variant="secondary" className="text-xs" onClick={() => setShowStrategyPanel(!showStrategyPanel)}>
            <Zap size={14} className="mr-2" /> Estrategias IA
          </ObsidianButton>
          <ObsidianButton variant="secondary" className="text-xs" onClick={() => setShowOffersHistory(!showOffersHistory)}>
            <History size={14} className="mr-2" /> Historial ({selectedNegotiation?.offers?.length || 0})
          </ObsidianButton>
          <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20 flex items-center gap-1">
            <Activity size={10} /> LIVE ANALYSIS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 pb-6">

        {/* --- LEFT PANEL: RESUMEN --- */}
        <div className="col-span-3 flex flex-col gap-4">
          <ObsidianCard>
            <h2 className="text-xs font-bold text-obsidian-text-muted tracking-[0.2em] mb-4 uppercase border-b border-white/5 pb-2">
              INFORMACIÓN GENERAL
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-obsidian-text-muted uppercase mb-1">Tipo de Operación</p>
                <span className={`text-xs px-2 py-1 rounded border inline-block ${selectedNegotiation?.type === 'BUY' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                  {selectedNegotiation?.type === 'BUY' ? 'COMPRA' : 'VENTA'}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-obsidian-text-muted uppercase mb-1">Monto Actual</p>
                <p className="text-2xl text-white font-light font-mono">${selectedNegotiation?.amount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-[10px] text-obsidian-text-muted uppercase mb-1">Progreso General</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedNegotiation?.status === 'AUCTION' ? 'bg-yellow-400' : selectedNegotiation?.status === 'CLOSED' ? 'bg-green-400' : 'bg-obsidian-accent'}`}
                      style={{ width: `${selectedNegotiation?.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-white font-mono">{selectedNegotiation?.progress}%</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Estrategias Activas</p>
                <div className="space-y-1">
                  {selectedNegotiation?.activeStrategies?.map((strategy) => (
                    <div key={strategy} className="flex items-center gap-2 text-xs">
                      <span>{STRATEGY_INFO[strategy].icon}</span>
                      <span className="text-obsidian-text-primary">{STRATEGY_INFO[strategy].name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ObsidianCard>
        </div>

        {/* --- CENTER PANEL: ANÁLISIS --- */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* NASH ENGINE */}
          <ObsidianCard className="relative flex flex-col h-[400px]" noPadding>
            <div className="absolute top-4 left-4 z-10">
              <h2 className="text-sm font-medium text-white tracking-widest flex items-center gap-2">
                MOTOR DE EQUILIBRIO NASH
                <HelpIcon content="Visualiza el punto óptimo de acuerdo donde ambas partes maximizan su utilidad sin perjudicar al otro." size={12} />
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-obsidian-accent animate-pulse"></div>
                <span className="text-[9px] text-obsidian-text-muted">LIVE ANALYSIS • {selectedNegotiation?.counterparty.toUpperCase()}</span>
              </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-full bg-[#050505]" />
          </ObsidianCard>

          {/* CHAT DE NEGOCIACIÓN */}
          <ObsidianCard className="flex flex-col h-[600px]" noPadding>
            {/* Header estilo WhatsApp */}
            <div className="px-4 py-3 bg-[#0F0F12] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {selectedNegotiation?.counterparty.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedNegotiation?.counterparty}</p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    En negociación activa
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-obsidian-text-muted">IA: {aggressiveness}%</span>
                <MessageSquare size={16} className="text-obsidian-text-muted" />
              </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0B0B0D] space-y-3">
              {selectedNegotiation?.offers && selectedNegotiation.offers.length > 0 ? (
                selectedNegotiation.offers.map((offer, index) => {
                  const isUs = offer.from === 'US';
                  const prevOffer = index > 0 ? selectedNegotiation.offers![index - 1] : null;
                  const priceDiff = (prevOffer?.amount && offer.amount) ? offer.amount - prevOffer.amount : 0;

                  return (
                    <div key={offer.id} className={`flex ${isUs ? 'justify-end' : 'justify-start'} animate-[slideIn_0.3s_ease-out]`}>
                      <div className={`max-w-[85%] ${isUs ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        {/* Etiqueta de quién envía */}
                        <span className="text-[9px] text-obsidian-text-muted px-2">
                          {isUs ? 'Tú' : selectedNegotiation.counterparty}
                        </span>

                        {/* Burbuja de mensaje */}
                        <div className={`rounded-xl px-4 py-3 max-w-md shadow-lg backdrop-blur-sm transition-all duration-300 ${isUs
                          ? 'bg-obsidian-accent/90 text-white rounded-br-none border border-obsidian-accent/50'
                          : 'bg-[#1A1A1E]/90 text-white rounded-bl-none border border-white/10'
                          }`}>
                          {/* Mensaje principal - conversacional */}
                          <p className="text-sm leading-relaxed mb-3 font-normal">{offer.message}</p>

                          {/* Metadatos (monto, términos) - pequeños y discretos */}
                          {offer.amount && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                              <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded text-[10px] font-mono border border-white/5">
                                <DollarSign size={10} className="text-obsidian-accent" />
                                <span>{offer.amount.toLocaleString()}</span>
                                {priceDiff !== 0 && prevOffer?.amount && (
                                  <span className={`ml-1 ${priceDiff > 0 ? 'text-red-300' : 'text-green-300'
                                    }`}>
                                    {priceDiff > 0 ? '↑' : '↓'} {Math.abs(priceDiff).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {offer.terms && (
                                <span className="text-[10px] text-obsidian-text-muted bg-black/20 px-2 py-1 rounded border border-white/5">
                                  {offer.terms}
                                </span>
                              )}
                              <div className="flex items-center gap-1 ml-auto">
                                <div className="w-8 h-1 bg-black/30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                      width: `${offer.sentiment * 100}%`,
                                      backgroundColor: getSentimentColor(offer.sentiment)
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[9px] text-obsidian-text-muted px-1 mt-1 opacity-60">
                          {new Date(offer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-obsidian-text-muted">
                  <MessageSquare size={48} className="mb-3 opacity-20" />
                  <p className="text-sm">No hay ofertas aún</p>
                  <p className="text-xs">Las ofertas aparecerán aquí</p>
                </div>
              )}

              {/* Indicador de escritura (IA pensando) */}
              {selectedNegotiation?.status === 'ACTIVE' && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1E] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/10 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-obsidian-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-obsidian-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-obsidian-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[10px] text-obsidian-text-muted">IA analizando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de nueva oferta */}
            <div className="p-3 bg-[#0F0F12] border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje aquí..."
                  className="flex-1 bg-[#1A1A1E] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:border-obsidian-accent outline-none placeholder-white/30"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full bg-obsidian-accent flex items-center justify-center hover:bg-obsidian-accent/80 transition-colors"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
              <p className="text-[9px] text-obsidian-text-muted mt-2 px-1">💡 Escribe naturalmente. La IA extraerá los términos clave automáticamente.</p>
            </div>
          </ObsidianCard>
        </div>

        {/* --- RIGHT PANEL: METRICS & ANALYSIS --- */}
        <div className="col-span-4 flex flex-col gap-4">

          {/* ANÁLISIS DE SENTIMIENTO */}
          <ObsidianCard className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              <Activity size={14} className="text-obsidian-accent" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-obsidian-text-muted">ANÁLISIS SENTIMIENTO</h2>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#2A2A2E" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke={getSentimentColor(selectedNegotiation?.sentiment || 0)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(selectedNegotiation?.sentiment || 0) * 251.2} 251.2`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-light text-white">{((selectedNegotiation?.sentiment || 0) * 100).toFixed(0)}%</span>
                  <span className="text-[8px] text-obsidian-text-muted uppercase">{getSentimentLabel(selectedNegotiation?.sentiment || 0)}</span>
                </div>
              </div>
            </div>
          </ObsidianCard>

          {/* PRESUPUESTO */}
          <ObsidianCard className="flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-obsidian-accent" />
                <h2 className="text-xs font-bold tracking-[0.2em] text-obsidian-text-muted">PRESUPUESTO</h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Resumen rápido */}
              <div className="text-center py-4">
                <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">
                  {selectedNegotiation?.type === 'BUY' ? 'Presupuesto Máximo' : 'Precio Mínimo'}
                </p>
                <p className="text-3xl font-light text-white font-mono mb-1">
                  ${selectedNegotiation?.batna?.toLocaleString()}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[9px] text-obsidian-text-muted">Objetivo:</span>
                  <span className="text-xs text-green-400 font-mono">
                    ${selectedNegotiation?.targetPrice?.toLocaleString()}
                  </span>
                </div>
                <p className="text-[8px] text-obsidian-text-muted mt-1">
                  {selectedNegotiation?.type === 'BUY' ? '📥 Comprando' : '📤 Vendiendo'}
                </p>
              </div>

              {/* Botón para abrir popup */}
              <button
                onClick={() => setShowBudgetPopup(true)}
                className="w-full py-2.5 bg-obsidian-accent/10 hover:bg-obsidian-accent/20 border border-obsidian-accent/30 rounded text-xs text-obsidian-accent transition-all flex items-center justify-center gap-2"
              >
                <Eye size={14} />
                Ver Detalles de Presupuesto
              </button>
            </div>
          </ObsidianCard>

          {/* SMART CONTRACT */}
          <ObsidianCard className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-white border-b border-white/5 pb-2">
              <Lock size={14} className="text-obsidian-accent" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-obsidian-text-muted">CONTRATO</h2>
            </div>

            <div className="space-y-2 flex-1 text-xs">
              {[
                { label: 'Bloqueo', val: 'Fijo' },
                { label: 'SLA', val: '5%' },
                { label: 'Jurisdicción', val: 'DAO' },
              ].map((term, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-white/[0.02] rounded border border-white/5">
                  <span className="text-[10px] text-obsidian-text-muted">{term.label}</span>
                  <span className="text-[10px] text-white font-mono">{term.val}</span>
                </div>
              ))}
            </div>

            <ObsidianButton variant="outline" className="text-xs border-green-500/30 text-green-400 hover:bg-green-500/10 mt-3">
              FIRMAR & EJECUTAR
            </ObsidianButton>
          </ObsidianCard>

        </div>

      </div>

      {/* Panel de Estrategias de IA */}
      {showStrategyPanel && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowStrategyPanel(false)}>
          <div className="bg-[#16161A] border border-white/10 rounded-lg p-6 max-w-2xl w-full m-6 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div>
                <h2 className="text-lg font-light text-white">Estrategias de IA Activas</h2>
                <p className="text-xs text-obsidian-text-muted mt-1">Tácticas psicológicas aplicadas por el agente de negociación</p>
              </div>
              <button onClick={() => setShowStrategyPanel(false)} className="text-obsidian-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Estrategias Activas */}
            <div className="mb-6">
              <h3 className="text-sm text-obsidian-accent font-medium mb-3">Estrategias Activas en {selectedNegotiation?.counterparty}</h3>
              <div className="space-y-2">
                {selectedNegotiation?.activeStrategies?.map((strategy) => (
                  <div key={strategy} className="p-3 bg-obsidian-accent/5 border border-obsidian-accent/20 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{STRATEGY_INFO[strategy].icon}</span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{STRATEGY_INFO[strategy].name}</h4>
                        <p className="text-xs text-obsidian-text-muted mt-1">{STRATEGY_INFO[strategy].description}</p>
                      </div>
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Todas las Estrategias Disponibles */}
            <div>
              <h3 className="text-sm text-obsidian-text-muted font-medium mb-3">Todas las Estrategias Disponibles</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(STRATEGY_INFO) as [AIStrategy, typeof STRATEGY_INFO[AIStrategy]][]).map(([key, info]) => {
                  const isActive = selectedNegotiation?.activeStrategies?.includes(key);
                  return (
                    <div key={key} className={`p-3 rounded border ${isActive ? 'bg-white/[0.02] border-white/20' : 'bg-white/[0.01] border-white/5'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{info.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-xs">{info.name}</h4>
                        </div>
                        {isActive && <div className="w-2 h-2 rounded-full bg-green-400"></div>}
                      </div>
                      <p className="text-[10px] text-obsidian-text-muted">{info.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Control de Agresividad */}
            <div className="mt-6 p-4 bg-white/[0.02] rounded border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm text-white font-medium">Nivel de Agresividad del Agente</h3>
                <span className="text-sm text-obsidian-accent font-mono">{aggressiveness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={aggressiveness}
                onChange={(e) => setAggressiveness(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-obsidian-accent
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-obsidian-accent [&::-moz-range-thumb]:border-0"
              />
              <div className="flex justify-between text-[10px] text-obsidian-text-muted mt-2">
                <span>Conservador</span>
                <span>Balanceado</span>
                <span>Agresivo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Historial de Ofertas */}
      {showOffersHistory && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowOffersHistory(false)}>
          <div className="bg-[#16161A] border border-white/10 rounded-lg p-6 max-w-3xl w-full m-6 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div>
                <h2 className="text-lg font-light text-white">Historial de Ofertas</h2>
                <p className="text-xs text-obsidian-text-muted mt-1">{selectedNegotiation?.counterparty} • {selectedNegotiation?.product}</p>
              </div>
              <button onClick={() => setShowOffersHistory(false)} className="text-obsidian-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!selectedNegotiation?.offers || selectedNegotiation.offers.length === 0 ? (
                <div className="text-center py-12 text-obsidian-text-muted">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No hay ofertas registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedNegotiation.offers.map((offer, index) => {
                    const isUs = offer.from === 'US';
                    const prevOffer = index > 0 ? selectedNegotiation.offers![index - 1] : null;
                    const hasAmount = typeof offer.amount === 'number';
                    const hasPrevAmount = prevOffer && typeof prevOffer.amount === 'number';

                    const priceDiff = (hasAmount && hasPrevAmount)
                      ? (offer.amount! - prevOffer!.amount!)
                      : 0;

                    return (
                      <div key={offer.id} className={`p-4 rounded border ${isUs ? 'bg-green-500/5 border-green-500/20 ml-12' : 'bg-blue-500/5 border-blue-500/20 mr-12'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {isUs ? <ArrowRight className="text-green-400" size={16} /> : <ArrowLeft className="text-blue-400" size={16} />}
                            <span className="text-xs font-medium text-white">
                              {isUs ? 'Nuestra Oferta' : 'Contraoferta'}
                            </span>
                          </div>
                          <span className="text-[10px] text-obsidian-text-muted">
                            {new Date(offer.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-2">
                          {hasAmount && (
                            <span className="text-2xl font-light text-white">${offer.amount!.toLocaleString()}</span>
                          )}
                          {priceDiff !== 0 && (
                            <span className={`text-xs flex items-center gap-1 ${priceDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {priceDiff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(priceDiff).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-obsidian-text-muted mb-2">{offer.terms}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-obsidian-text-muted">Sentimiento:</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${offer.sentiment * 100}%`,
                                backgroundColor: getSentimentColor(offer.sentiment)
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: getSentimentColor(offer.sentiment) }}>
                            {(offer.sentiment * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Estadísticas del historial */}
            {selectedNegotiation?.offers && selectedNegotiation.offers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-obsidian-text-muted mb-1">Total Ofertas</p>
                  <p className="text-lg text-white font-light">{selectedNegotiation.offers.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-obsidian-text-muted mb-1">Oferta Inicial</p>
                  <p className="text-lg text-white font-light">${selectedNegotiation.offers[0].amount.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-obsidian-text-muted mb-1">Oferta Actual</p>
                  <p className="text-lg text-white font-light">${selectedNegotiation.offers[selectedNegotiation.offers.length - 1].amount.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP DE PRESUPUESTO */}
      {showBudgetPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowBudgetPopup(false)}>
          <div className="bg-[#0F0F12] border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-obsidian-accent" />
                <h2 className="text-lg font-light text-white tracking-wider">DETALLES DE PRESUPUESTO</h2>
              </div>
              <button
                onClick={() => setShowBudgetPopup(false)}
                className="p-2 hover:bg-white/5 rounded transition-colors"
              >
                <X size={20} className="text-obsidian-text-muted hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Resumen Principal */}
              <div className="bg-obsidian-accent/5 border border-obsidian-accent/20 rounded-lg p-6">
                <div className="mb-4 text-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${selectedNegotiation?.type === 'BUY'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                    {selectedNegotiation?.type === 'BUY' ? '📥 COMPRANDO' : '📤 VENDIENDO'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {selectedNegotiation?.type === 'BUY' ? (
                    <>
                      <div className="text-center">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Precio Ideal</p>
                        <p className="text-2xl font-light text-green-400 font-mono">
                          ${selectedNegotiation?.targetPrice?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">Lo que quieres pagar</p>
                      </div>
                      <div className="text-center border-l border-r border-white/10">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Precio Reserva</p>
                        <p className="text-2xl font-light text-yellow-400 font-mono">
                          ${selectedNegotiation?.reservationPrice?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">Límite aceptable</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Máximo Absoluto</p>
                        <p className="text-2xl font-light text-red-400 font-mono">
                          ${selectedNegotiation?.batna?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">No pagar más</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Mínimo Absoluto</p>
                        <p className="text-2xl font-light text-red-400 font-mono">
                          ${selectedNegotiation?.batna?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">No cobrar menos</p>
                      </div>
                      <div className="text-center border-l border-r border-white/10">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Precio Reserva</p>
                        <p className="text-2xl font-light text-yellow-400 font-mono">
                          ${selectedNegotiation?.reservationPrice?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">Límite aceptable</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Precio Ideal</p>
                        <p className="text-2xl font-light text-green-400 font-mono">
                          ${selectedNegotiation?.targetPrice?.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-obsidian-text-muted mt-1">Lo que quieres cobrar</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Barra de progreso visual */}
              {selectedNegotiation && selectedNegotiation.targetPrice && selectedNegotiation.batna && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-obsidian-text-muted uppercase">Posición Actual</p>
                    <p className="text-lg text-white font-mono">${selectedNegotiation.amount.toLocaleString()}</p>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                    <div
                      className={`absolute h-full opacity-30 ${selectedNegotiation.type === 'BUY'
                        ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500'
                        : 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500'
                        }`}
                      style={{ width: '100%' }}
                    />
                    <div
                      className="absolute h-full w-2 bg-white shadow-[0_0_10px_white] rounded-full"
                      style={{
                        left: selectedNegotiation.type === 'BUY'
                          ? `${Math.max(0, Math.min(100, ((selectedNegotiation.amount - selectedNegotiation.targetPrice) / (selectedNegotiation.batna - selectedNegotiation.targetPrice)) * 100))}%`
                          : `${Math.max(0, Math.min(100, ((selectedNegotiation.batna - selectedNegotiation.amount) / (selectedNegotiation.batna - selectedNegotiation.targetPrice)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-obsidian-text-muted">
                    {selectedNegotiation.type === 'BUY' ? (
                      <>
                        <span>💚 Precio Ideal</span>
                        <span>🔴 Límite Máximo</span>
                      </>
                    ) : (
                      <>
                        <span>🔴 Límite Mínimo</span>
                        <span>💚 Precio Ideal</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Zona de Negociación */}
              {selectedNegotiation?.zopaDetected && selectedNegotiation?.zopaRange && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-green-400" />
                    <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Zona de Acuerdo Detectada</h3>
                  </div>
                  <p className="text-xs text-obsidian-text-muted mb-2">
                    Rango óptimo para cerrar el acuerdo:
                  </p>
                  <p className="text-xl text-white font-mono">
                    ${selectedNegotiation.zopaRange.min.toLocaleString()} - ${selectedNegotiation.zopaRange.max.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Información Adicional */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">Diferencia con Objetivo</p>
                  <p className={`text-lg font-mono ${selectedNegotiation && selectedNegotiation.targetPrice
                    ? (selectedNegotiation.type === 'BUY'
                      ? (selectedNegotiation.amount > selectedNegotiation.targetPrice ? 'text-red-400' : 'text-green-400')
                      : (selectedNegotiation.amount < selectedNegotiation.targetPrice ? 'text-red-400' : 'text-green-400'))
                    : 'text-white'
                    }`}>
                    {selectedNegotiation && selectedNegotiation.targetPrice
                      ? `${selectedNegotiation.amount > selectedNegotiation.targetPrice ? '+' : ''}$${Math.abs(selectedNegotiation.amount - selectedNegotiation.targetPrice).toLocaleString()}`
                      : '-'
                    }
                  </p>
                  <p className="text-[8px] text-obsidian-text-muted mt-1">
                    {selectedNegotiation?.type === 'BUY'
                      ? (selectedNegotiation.amount > selectedNegotiation.targetPrice ? 'Estás pagando más' : 'Estás ahorrando')
                      : (selectedNegotiation.amount < selectedNegotiation.targetPrice ? 'Estás cobrando menos' : 'Ganancia extra')
                    }
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-[10px] text-obsidian-text-muted uppercase mb-2">
                    {selectedNegotiation?.type === 'BUY' ? 'Margen hasta Límite' : 'Margen sobre Mínimo'}
                  </p>
                  <p className="text-lg text-white font-mono">
                    {selectedNegotiation && selectedNegotiation.batna
                      ? `$${Math.abs(selectedNegotiation.batna - selectedNegotiation.amount).toLocaleString()}`
                      : '-'
                    }
                  </p>
                  <p className="text-[8px] text-obsidian-text-muted mt-1">
                    {selectedNegotiation?.type === 'BUY' ? 'Cuánto más puedes pagar' : 'Cuánto más estás ganando'}
                  </p>
                </div>
              </div>

              {/* Recomendación IA */}
              <div className="bg-obsidian-accent/10 border border-obsidian-accent/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-obsidian-accent mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Recomendación IA</h3>
                    <p className="text-xs text-obsidian-text-muted leading-relaxed">
                      {selectedNegotiation && selectedNegotiation.targetPrice && (
                        selectedNegotiation.type === 'BUY' ? (
                          selectedNegotiation.amount > selectedNegotiation.targetPrice
                            ? `Estás pagando $${(selectedNegotiation.amount - selectedNegotiation.targetPrice).toLocaleString()} más de tu objetivo. Intenta negociar hacia abajo o busca beneficios adicionales (mejores términos de pago, envío gratis, garantías extendidas) para justificar el sobreprecio.`
                            : `¡Excelente! Estás ahorrando $${(selectedNegotiation.targetPrice - selectedNegotiation.amount).toLocaleString()}. Puedes cerrar el acuerdo ahora o intentar negociar un poco más abajo si crees que hay margen.`
                        ) : (
                          selectedNegotiation.amount < selectedNegotiation.targetPrice
                            ? `Estás cobrando $${(selectedNegotiation.targetPrice - selectedNegotiation.amount).toLocaleString()} menos de tu objetivo. Intenta negociar hacia arriba mostrando valor añadido o mantén firme si el cliente muestra resistencia.`
                            : `¡Excelente! Estás ganando $${(selectedNegotiation.amount - selectedNegotiation.targetPrice).toLocaleString()} más de lo esperado. Puedes cerrar el acuerdo ahora o intentar optimizar aún más si el cliente tiene margen.`
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowBudgetPopup(false)}
                className="px-6 py-2.5 bg-obsidian-accent hover:bg-obsidian-accent/80 text-white rounded text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NegotiationHub;
