import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Filter, Plus, FileText,
  Settings, Activity, CheckCircle, Clock,
  FileCode, Terminal, ChevronRight, MoreHorizontal,
  Bot, X, Play, Save, AlertTriangle
} from 'lucide-react';

// --- TYPES ---
interface Rule {
  id: string;
  name: string;
  code: string;
  active: boolean;
  status: 'running' | 'paused' | 'draft';
}

interface Document {
  id: string;
  title: string;
  desc: string;
  type: 'PDF' | 'DOCX' | 'WIKI' | 'TECH';
  tag?: string;
  date: string;
}

const OntologyCore: React.FC = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'draft'>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Logic State
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'Lead Scoring Alto', code: 'IF score > 80 THEN priority(high)', active: true, status: 'running' },
    { id: '2', name: 'Auto-Respuesta Fin de Semana', code: "IF day == 'Sat' THEN send('weekend')", active: true, status: 'running' },
    { id: '3', name: 'Descuento Recuperación', code: "IF inactive > 30d THEN discount(15%)", active: false, status: 'paused' },
    { id: '4', name: 'Alerta de Fraude High-Vel', code: "IF tx_rate > 10/min THEN block_ip()", active: true, status: 'running' }
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Guía de Onboarding 2024', desc: 'Procedimientos estándar para nuevos clientes freelance y pymes.', type: 'PDF', tag: 'INTERNO', date: '2024-10-15' },
    { id: '2', title: 'Política de Precios Q3', desc: 'Actualización de tarifas y reglas de descuento automático.', type: 'DOCX', date: '2024-11-01' },
    { id: '3', title: 'FAQ: Resolución de Conflictos', desc: 'Scripts para manejo de clientes difíciles y escalado.', type: 'WIKI', date: '2024-09-20' },
    { id: '4', title: 'API Keys & Accesos', desc: 'Documentación técnica para integraciones de terceros.', type: 'TECH', tag: 'CONFIDENCIAL', date: '2024-12-05' }
  ]);

  // New Rule Form State
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '' });

  // --- ACTIONS ---

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const newActive = !r.active;
        return { ...r, active: newActive, status: newActive ? 'running' : 'paused' };
      }
      return r;
    }));
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.action) return;

    const rule: Rule = {
      id: Date.now().toString(),
      name: newRule.name,
      code: `IF ${newRule.condition} THEN ${newRule.action}`,
      active: true,
      status: 'running'
    };

    setRules([...rules, rule]);
    setNewRule({ name: '', condition: '', action: '' });
    setIsModalOpen(false);
  };

  // --- DERIVED STATE ---

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : r.status === (activeTab === 'running' ? 'running' : 'draft'); // simplified logic
    return matchesSearch && matchesTab;
  });

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    articles: documents.length,
    activeRules: rules.filter(r => r.active).length,
    draftRules: rules.filter(r => !r.active).length,
    queries: '1.2k', // Mocked for now
    health: '99%'
  };

  return (
    <div className="w-full h-screen bg-[#0B0B0D] text-white overflow-hidden flex flex-col font-sans selection:bg-purple-500/30 relative">

      {/* HEADER */}
      <div className="w-full h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0B0D]/50 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span onClick={() => setSelectedDoc(null)} className="hover:text-white cursor-pointer transition-colors">Workspace</span>
          <ChevronRight size={14} />
          <span onClick={() => setSelectedDoc(null)} className="hover:text-white cursor-pointer transition-colors">Conocimiento</span>
          {selectedDoc && (
            <>
              <ChevronRight size={14} />
              <span className="text-white font-medium truncate max-w-[200px]">{selectedDoc.title}</span>
            </>
          )}
        </div>

        {!selectedDoc && (
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors" size={16} />
              <input
                type="text"
                placeholder="Buscar reglas o docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
              />
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-white/20"></div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-12 pb-32 scrollbar-hide">

        {/* DOCUMENT VIEWER */}
        {selectedDoc ? (
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <button
              onClick={() => setSelectedDoc(null)}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              <ChevronRight size={16} className="rotate-180" /> Volver al Dashboard
            </button>

            <div className="bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

              {/* Doc Header */}
              <div className="p-8 border-b border-white/5 bg-[#16161A] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${selectedDoc.tag === 'CONFIDENCIAL'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-white/5 text-gray-400 border-white/5'
                      }`}>
                      {selectedDoc.type}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">{selectedDoc.date}</span>
                  </div>
                  <h1 className="text-3xl font-light text-white tracking-tight leading-tight">{selectedDoc.title}</h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><Settings size={18} /></button>
                  <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                </div>
              </div>

              {/* Doc Body (Mock) */}
              <div className="p-12 min-h-[500px] bg-[#0B0B0D]">
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-2 bg-white/5 rounded w-full"></div>
                    <div className="h-2 bg-white/5 rounded w-full"></div>
                    <div className="h-2 bg-white/5 rounded w-5/6"></div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                    <p className="text-gray-600 text-sm font-mono flex items-center gap-2"><FileText size={16} /> VISTA PREVIA DEL DOCUMENTO</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-white/5 rounded w-11/12"></div>
                    <div className="h-2 bg-white/5 rounded w-full"></div>
                    <div className="h-2 bg-white/5 rounded w-3/4"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">

            {/* HERO SECTION */}
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-5xl font-light mb-4 tracking-tight">
                Gestión de <span className="font-medium text-white">Conocimiento</span>
              </h1>
              <div className="flex items-end justify-between">
                <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
                  Centraliza la lógica de negocio y la documentación técnica de tu organización.
                  Administra reglas activas y recursos de IA con precisión clínica.
                </p>
                <div className="flex gap-4">
                  <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => setActiveTab('running')}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
                    >
                      Active
                    </button>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 text-sm font-bold tracking-wide flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    <Plus size={16} />
                    NUEVA REGLA
                  </button>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-4 gap-6 mb-16">
              {[
                { label: 'ARTÍCULOS', value: stats.articles, trend: '+3 nuevos', icon: FileText, color: 'text-emerald-400' },
                { label: 'REGLAS ACTIVAS', value: stats.activeRules, sub: `${stats.draftRules} en pausa`, icon: Filter, color: 'text-purple-400' },
                { label: 'CONSULTAS IA', value: stats.queries, trend: '+24% eficiencia', icon: Bot, color: 'text-emerald-400' },
                { label: 'SALUD SISTEMA', value: stats.health, sub: 'Operativo', icon: Activity, color: 'text-yellow-400' }
              ].map((stat, i) => (
                <div key={i} className="group relative bg-[#121214] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">{stat.label}</span>
                    <stat.icon size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-5xl font-extralight text-white mb-2">{stat.value}</div>
                  {stat.trend && <div className={`text-xs font-medium ${stat.color} flex items-center gap-1`}>
                    <span className="tracking-wide">{stat.trend}</span>
                  </div>}
                  {stat.sub && <div className={`text-xs font-medium ${stat.color} flex items-center gap-1`}>
                    <span className="tracking-wide">{stat.sub}</span>
                  </div>}
                </div>
              ))}
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-12 gap-12">

              {/* LEFT COLUMN: DOCUMENTATION */}
              <div className="col-span-7 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-light tracking-wide">Documentación Reciente <span className="text-gray-500 text-sm ml-2">({filteredDocs.length})</span></h2>
                  <button className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-white uppercase">Ver Todo</button>
                </div>

                <div className="space-y-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="bg-[#121214] border border-white/5 rounded-3xl p-6 group hover:bg-[#161619] transition-all cursor-pointer flex gap-5 items-start animate-fade-in-up"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                        {doc.type === 'TECH' ? <Terminal size={20} className="text-gray-400 group-hover:text-white" /> :
                          doc.type === 'WIKI' ? <CheckCircle size={20} className="text-gray-400 group-hover:text-white" /> :
                            <FileText size={20} className="text-gray-400 group-hover:text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-medium text-white mb-2 group-hover:text-purple-300 transition-colors">{doc.title}</h3>
                          <span className="text-[10px] text-gray-600 font-mono">{doc.date}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-light leading-relaxed mb-4 line-clamp-2">{doc.desc}</p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 border border-white/5 uppercase tracking-wider">{doc.type}</span>
                          {doc.tag && (
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${doc.tag === 'CONFIDENCIAL'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-white/5 text-gray-400 border-white/5'
                              }`}>
                              {doc.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDocs.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">No se encontraron documentos</div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: BUSINESS RULES */}
              <div className="col-span-5 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-light tracking-wide">Reglas de Negocio <span className="text-gray-500 text-sm ml-2">({filteredRules.length})</span></h2>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">RUNNING</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRules.map((rule) => (
                    <div key={rule.id} className={`bg-[#0F0F11] border rounded-2xl p-5 transition-all animate-fade-in-up ${rule.active ? 'border-white/10' : 'border-white/5 opacity-60 hover:opacity-100'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-white">{rule.name}</h3>
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${rule.active ? 'bg-white' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-black shadow-sm transform transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                      </div>

                      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs border border-white/5 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        <span className="text-purple-400 select-none shrink-0">IF</span>
                        <span className="text-gray-300 whitespace-nowrap">{rule.code.includes('IF ') ? rule.code.split('IF ')[1].split(' THEN')[0] : '...'}</span>
                        <span className="text-purple-400 select-none shrink-0">THEN</span>
                        <span className="text-gray-300 whitespace-nowrap">{rule.code.includes('THEN ') ? rule.code.split('THEN ')[1] : '...'}</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#0F0F11] border border-dashed border-white/10 rounded-2xl p-4 flex items-center justify-center cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all group"
                  >
                    <span className="text-xs font-medium text-gray-500 group-hover:text-white flex items-center gap-2">
                      <Plus size={14} /> Añadir Nueva Regla
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* NEW RULE MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-8 relative overflow-hidden">

            {/* Modal Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light tracking-tight text-white">Nueva Regla de Negocio</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre de la Regla</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Ej. VIP Client Discount"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 focus:bg-white/5 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-purple-400">IF</span> Condición
                  </label>
                  <textarea
                    value={newRule.condition}
                    onChange={e => setNewRule({ ...newRule, condition: e.target.value })}
                    placeholder="score > 90"
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-300 focus:border-purple-500/50 focus:bg-white/5 transition-all outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-purple-400">THEN</span> Acción
                  </label>
                  <textarea
                    value={newRule.action}
                    onChange={e => setNewRule({ ...newRule, action: e.target.value })}
                    placeholder="apply_tag('vip')"
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-300 focus:border-purple-500/50 focus:bg-white/5 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Play size={14} /> Simular
                </button>
                <button
                  onClick={handleAddRule}
                  disabled={!newRule.name || !newRule.condition || !newRule.action}
                  className="flex-[2] py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Save size={14} /> Guardar Regla
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OntologyCore;
