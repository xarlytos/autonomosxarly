import React, { useState } from 'react';
import { ObsidianCard, ObsidianButton } from './ui/ObsidianElements';
import { Target, Info, Download, Save, History, Zap, TrendingUp, X, Trash2, Calendar, Filter, BarChart2, TrendingDown, Users, DollarSign, Percent } from 'lucide-react';
import { useDTOLab } from '../hooks/useDTOLab';
import { HelpIcon } from './Help/HelpIcon';
import AIChartChat from './AIChartChat';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const DTOLab: React.FC = () => {
  const {
    results,
    isComputing,
    runSimulation,
    scenarios,
    saveScenario,
    loadScenario,
    deleteScenario,
    selectedScenario,
    filters,
    updateFilter,
    toggleMetric
  } = useDTOLab();

  const [scenarioName, setScenarioName] = useState('');
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Function to export results as CSV
  const exportToCSV = () => {
    if (!results) return;

    const csvRows = [
      ['Fecha', 'Ingresos', 'Gastos', 'Beneficio', 'Clientes', 'Es Proyección', 'Tasa Crecimiento', 'Tasa Conversión'],
      ...results.data.map(row => [
        row.date,
        row.revenue,
        row.expenses,
        row.profit,
        row.clients,
        row.isProjection ? 'Sí' : 'No',
        row.growthRate || '',
        row.conversionRate || ''
      ])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulacion-${Date.now()}.csv`;
    a.click();
  };

  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      saveScenario(scenarioName);
      setScenarioName('');
      setShowSaveDialog(false);
    }
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1E] border border-white/10 p-3 rounded shadow-xl text-xs">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="capitalize">{entry.name}: </span>
              <span className="font-mono font-bold">
                {entry.name === 'Clientes' ? entry.value : `$${entry.value.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // KPI Card Component
  const KPICard: React.FC<{
    title: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, change, icon, color = 'text-obsidian-accent' }) => (
    <ObsidianCard className="flex-1 p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">{title}</span>
        <div className={color}>{icon}</div>
      </div>
      <div className="text-2xl font-light text-white mb-1">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-obsidian-success' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
      )}
    </ObsidianCard>
  );

  return (
    <div ref={scrollContainerRef} className="w-full h-screen bg-[#0B0B0D] text-obsidian-text-primary px-6 py-6 flex flex-col gap-6 overflow-y-auto relative font-sans">

      {/* Header */}
      <div className="flex justify-between items-center h-16 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-light text-white tracking-widest flex items-center gap-2">
              <Target className="text-obsidian-accent" size={20} />
              SIMULADOR DE ESCENARIOS
              <HelpIcon
                term="Simulador de Escenarios"
                content="Visualizador avanzado de métricas financieras y operativas. Muestra datos históricos y proyecciones futuras con filtros personalizables."
                size={16}
              />
            </h1>
            <p className="text-xs text-obsidian-text-muted mt-1">
              Análisis Avanzado con Filtros y KPIs
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ObsidianButton variant="secondary" className="text-xs" onClick={() => setShowHelp(!showHelp)}>
            <Info size={14} className="mr-2" /> Ayuda
          </ObsidianButton>
          <ObsidianButton variant="secondary" className="text-xs" onClick={exportToCSV} disabled={!results}>
            <Download size={14} className="mr-2" /> Exportar CSV
          </ObsidianButton>
          <ObsidianButton variant="secondary" className="text-xs" onClick={() => setShowSaveDialog(true)} disabled={!results}>
            <Save size={14} className="mr-2" /> Guardar
          </ObsidianButton>
          <ObsidianButton variant="secondary" className="text-xs border-dashed border-white/20" onClick={() => setShowHistoryPanel(!showHistoryPanel)}>
            <History size={14} className="mr-2" /> Historial ({scenarios.length})
          </ObsidianButton>
          <ObsidianButton variant="primary" className="text-xs px-6" isLoading={isComputing} onClick={runSimulation}>
            <Zap size={14} className="mr-2" /> REPROCESAR
          </ObsidianButton>
        </div>
      </div>

      {/* KPI Cards */}
      {results && (
        <div className="flex gap-4">
          <KPICard
            title="Ingresos Totales"
            value={`$${(results.summary.totalRevenue / 1000000).toFixed(2)}M`}
            change={results.summary.avgGrowthRate}
            icon={<DollarSign size={18} />}
            color="text-green-400"
          />
          <KPICard
            title="Beneficio Neto"
            value={`$${(results.summary.totalProfit / 1000000).toFixed(2)}M`}
            icon={<TrendingUp size={18} />}
            color="text-obsidian-success"
          />
          <KPICard
            title="Nuevos Clientes"
            value={`+${results.summary.newClients}`}
            icon={<Users size={18} />}
            color="text-blue-400"
          />
          <KPICard
            title="Margen de Beneficio"
            value={`${results.summary.profitMargin.toFixed(1)}%`}
            icon={<Percent size={18} />}
            color="text-obsidian-accent"
          />
          <KPICard
            title="ROI Proyectado"
            value={`${results.summary.projectedROI.toFixed(1)}%`}
            icon={<BarChart2 size={18} />}
            color="text-purple-400"
          />
        </div>
      )}

      <div className="flex-1 flex gap-6">

        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <div className="w-[20%] flex flex-col">
          <ObsidianCard className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <Filter size={14} className="text-obsidian-text-muted" />
              <span className="text-[10px] tracking-[0.2em] font-bold text-obsidian-text-muted uppercase">FILTROS</span>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Calendar size={12} /> Rango de Fechas
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="w-full bg-[#16161A] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-obsidian-accent outline-none"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="w-full bg-[#16161A] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-obsidian-accent outline-none"
                />
              </div>
            </div>

            {/* Granularity */}
            <div className="mb-6">
              <label className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-2 block">Granularidad</label>
              <div className="grid grid-cols-3 gap-1">
                {(['daily', 'weekly', 'monthly'] as const).map(gran => (
                  <button
                    key={gran}
                    onClick={() => updateFilter('granularity', gran)}
                    className={`py-1.5 rounded text-[9px] uppercase tracking-wider transition-all ${filters.granularity === gran
                      ? 'bg-obsidian-accent text-white'
                      : 'border border-white/10 text-white/60 hover:bg-white/5'
                      }`}
                  >
                    {gran === 'daily' ? 'Día' : gran === 'weekly' ? 'Sem' : 'Mes'}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Toggles */}
            <div className="mb-4">
              <label className="text-[10px] text-obsidian-text-muted uppercase tracking-wider mb-2 block">Métricas Visibles</label>
              <div className="space-y-2">
                {[
                  { key: 'revenue' as const, label: 'Ingresos', color: '#45FF9A' },
                  { key: 'expenses' as const, label: 'Gastos', color: '#FF6B6B' },
                  { key: 'profit' as const, label: 'Beneficio', color: '#6A4FFB' },
                  { key: 'clients' as const, label: 'Clientes', color: '#FFA500' }
                ].map(metric => (
                  <div
                    key={metric.key}
                    className="flex items-center justify-between group cursor-pointer p-2 rounded hover:bg-white/5"
                    onClick={() => toggleMetric(metric.key)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: metric.color, opacity: filters.visibleMetrics[metric.key] ? 1 : 0.3 }}></div>
                      <span className={`text-xs ${filters.visibleMetrics[metric.key] ? 'text-white' : 'text-obsidian-text-muted'}`}>{metric.label}</span>
                    </div>
                    <div className={`w-4 h-4 border border-white/20 rounded flex items-center justify-center ${filters.visibleMetrics[metric.key] ? 'bg-obsidian-accent/20 border-obsidian-accent' : ''}`}>
                      {filters.visibleMetrics[metric.key] && <div className="w-2 h-2 bg-obsidian-accent rounded-sm"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ObsidianCard>
        </div>

        {/* --- GRAPH PANEL --- */}
        <div className="flex-1 flex flex-col">
          <ObsidianCard className="min-h-[600px] relative overflow-hidden flex flex-col" active={isComputing}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-white text-lg font-light tracking-wide mb-1">Proyección Multivariable</h2>
                <p className="text-[10px] text-obsidian-text-muted uppercase tracking-[0.2em] font-mono">
                  {filters.granularity === 'daily' ? 'VISTA DIARIA' : filters.granularity === 'weekly' ? 'VISTA SEMANAL' : 'VISTA MENSUAL'}
                </p>
              </div>
            </div>

            <div className="w-full h-[500px]">
              {results ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      minTickGap={50}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 10 }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    {/* Reference line for "Today" */}
                    <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="#FFFFFF" strokeDasharray="3 3" label={{ position: 'top', value: 'HOY', fill: 'white', fontSize: 10 }} />

                    {filters.visibleMetrics.revenue && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="Ingresos"
                        stroke="#45FF9A"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {filters.visibleMetrics.expenses && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="expenses"
                        name="Gastos"
                        stroke="#FF6B6B"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                    {filters.visibleMetrics.profit && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="profit"
                        name="Beneficio"
                        stroke="#6A4FFB"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                    {filters.visibleMetrics.clients && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="clients"
                        name="Clientes"
                        stroke="#FFA500"
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-obsidian-text-muted">
                  Cargando simulación...
                </div>
              )}
            </div>

          </ObsidianCard>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="w-full">
        <AIChartChat />

      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowHelp(false)}>
          <div className="bg-[#16161A] border border-white/10 rounded-lg p-6 max-w-2xl m-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-light text-white">Guía de Uso - Simulador Avanzado</h2>
              <button onClick={() => setShowHelp(false)} className="text-obsidian-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-obsidian-text-primary">
              <p>Este simulador avanzado te permite analizar métricas clave con filtros personalizables:</p>
              <ul className="list-disc list-inside space-y-2 text-xs text-obsidian-text-muted">
                <li><strong>Rango de Fechas:</strong> Filtra los datos por período específico</li>
                <li><strong>Granularidad:</strong> Visualiza datos por día, semana o mes</li>
                <li><strong>Métricas Visibles:</strong> Activa/desactiva líneas del gráfico</li>
                <li><strong>KPIs:</strong> Resumen de métricas clave en tiempo real</li>
              </ul>
              <p className="text-xs mt-4">La línea vertical marca el día de hoy. Todo a la derecha son proyecciones basadas en tendencias actuales.</p>
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistoryPanel && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowHistoryPanel(false)}>
          <div className="bg-[#16161A] border border-white/10 rounded-lg p-6 max-w-3xl w-full m-6 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-light text-white">Historial de Escenarios</h2>
              <button onClick={() => setShowHistoryPanel(false)} className="text-obsidian-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {scenarios.length === 0 ? (
                <div className="text-center py-12 text-obsidian-text-muted">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No hay escenarios guardados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className={`border rounded p-4 transition-all ${selectedScenario === scenario.id ? 'border-obsidian-accent bg-obsidian-accent/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-medium">{scenario.name}</h3>
                          <p className="text-xs text-obsidian-text-muted">{new Date(scenario.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { loadScenario(scenario.id); setShowHistoryPanel(false); }} className="text-xs px-3 py-1 bg-obsidian-accent/20 text-obsidian-accent rounded hover:bg-obsidian-accent/30">
                            Cargar
                          </button>
                          <button onClick={() => deleteScenario(scenario.id)} className="text-xs px-2 py-1 text-red-400 hover:bg-red-500/10 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-[#0B0B0D]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
          <div className="bg-[#16161A] border border-white/10 rounded-lg p-6 max-w-md w-full m-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-light text-white">Guardar Escenario</h2>
              <button onClick={() => setShowSaveDialog(false)} className="text-obsidian-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-obsidian-text-muted mb-2 block">Nombre del Escenario</label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="Ej: Proyección Q3 2025"
                  className="w-full bg-[#0B0B0D] border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/40 focus:border-obsidian-accent outline-none transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveScenario()}
                />
              </div>
              <div className="flex gap-2">
                <ObsidianButton variant="secondary" className="flex-1" onClick={() => setShowSaveDialog(false)}>
                  Cancelar
                </ObsidianButton>
                <ObsidianButton variant="primary" className="flex-1" onClick={handleSaveScenario} disabled={!scenarioName.trim()}>
                  <Save size={14} className="mr-2" /> Guardar
                </ObsidianButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DTOLab;