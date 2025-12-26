import { useState, useEffect, useCallback } from 'react';

// Enhanced interface for time-series data points
export interface DataPoint {
  date: string;
  revenue: number;
  clients: number;
  expenses: number;
  profit: number;
  isProjection: boolean;
  growthRate?: number;
  conversionRate?: number;
  avgRevenue7d?: number;
  avgRevenue30d?: number;
}

// Enhanced results structure
export interface SimulationResults {
  data: DataPoint[];
  summary: {
    totalRevenue: number;
    totalProfit: number;
    newClients: number;
    profitMargin: number;
    avgGrowthRate: number;
    projectedROI: number;
  };
}

export interface Scenario {
  id: string;
  name: string;
  results: SimulationResults;
  createdAt: string;
}

export type Granularity = 'daily' | 'weekly' | 'monthly';

export interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  granularity: Granularity;
  visibleMetrics: {
    revenue: boolean;
    expenses: boolean;
    profit: boolean;
    clients: boolean;
  };
}

// Helper to generate realistic-looking random walk data
const generateTimeSeries = (daysBack: number, daysForward: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const today = new Date();

  // Initial baselines
  let currentRevenue = 50000;
  let currentClients = 120;
  let currentExpenses = 30000;

  for (let i = -daysBack; i <= daysForward; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Add some randomness and trends
    const growthFactor = i > 0 ? 1.002 : 1.001;
    const volatility = 0.05;

    currentRevenue = currentRevenue * growthFactor * (1 + (Math.random() - 0.5) * volatility);
    currentClients = currentClients * growthFactor * (1 + (Math.random() - 0.5) * (volatility * 0.5));
    currentExpenses = currentExpenses * (growthFactor * 0.999) * (1 + (Math.random() - 0.5) * (volatility * 0.2));

    const profit = currentRevenue - currentExpenses;
    const conversionRate = 2 + Math.random() * 3; // 2-5%

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(currentRevenue),
      clients: Math.round(currentClients),
      expenses: Math.round(currentExpenses),
      profit: Math.round(profit),
      isProjection: i > 0,
      conversionRate: parseFloat(conversionRate.toFixed(2))
    });
  }

  // Calculate growth rates and moving averages
  for (let i = 0; i < data.length; i++) {
    if (i > 0) {
      const prevRevenue = data[i - 1].revenue;
      const currentRevenue = data[i].revenue;
      data[i].growthRate = parseFloat((((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2));
    }

    // 7-day moving average
    if (i >= 6) {
      const sum = data.slice(i - 6, i + 1).reduce((acc, d) => acc + d.revenue, 0);
      data[i].avgRevenue7d = Math.round(sum / 7);
    }

    // 30-day moving average
    if (i >= 29) {
      const sum = data.slice(i - 29, i + 1).reduce((acc, d) => acc + d.revenue, 0);
      data[i].avgRevenue30d = Math.round(sum / 30);
    }
  }

  return data;
};

// Aggregate data by granularity
const aggregateData = (data: DataPoint[], granularity: Granularity): DataPoint[] => {
  if (granularity === 'daily') return data;

  const aggregated: DataPoint[] = [];
  const groupSize = granularity === 'weekly' ? 7 : 30;

  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize);
    if (group.length === 0) continue;

    const avgRevenue = group.reduce((sum, d) => sum + d.revenue, 0) / group.length;
    const avgExpenses = group.reduce((sum, d) => sum + d.expenses, 0) / group.length;
    const avgClients = group.reduce((sum, d) => sum + d.clients, 0) / group.length;
    const avgProfit = avgRevenue - avgExpenses;

    aggregated.push({
      date: group[0].date,
      revenue: Math.round(avgRevenue),
      expenses: Math.round(avgExpenses),
      clients: Math.round(avgClients),
      profit: Math.round(avgProfit),
      isProjection: group[0].isProjection,
      growthRate: group[group.length - 1].growthRate,
      conversionRate: group.reduce((sum, d) => sum + (d.conversionRate || 0), 0) / group.length,
      avgRevenue7d: group[group.length - 1].avgRevenue7d,
      avgRevenue30d: group[group.length - 1].avgRevenue30d
    });
  }

  return aggregated;
};

export function useDTOLab() {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    granularity: 'daily',
    visibleMetrics: {
      revenue: true,
      expenses: true,
      profit: true,
      clients: true
    }
  });

  // Load scenarios from LocalStorage
  useEffect(() => {
    const savedScenarios = localStorage.getItem('obsidian_dto_scenarios_v2');
    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios));
      } catch (e) {
        console.error('Failed to parse scenarios', e);
      }
    }
  }, []);

  // Save scenarios to LocalStorage
  useEffect(() => {
    localStorage.setItem('obsidian_dto_scenarios_v2', JSON.stringify(scenarios));
  }, [scenarios]);

  // Initial simulation run
  useEffect(() => {
    runSimulation();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (rawData.length === 0) return;
    applyFilters();
  }, [filters, rawData]);

  const runSimulation = useCallback(() => {
    setIsComputing(true);
    setTimeout(() => {
      const data = generateTimeSeries(90, 180);
      setRawData(data);

      // Set initial date range
      setFilters(prev => ({
        ...prev,
        dateFrom: data[0].date,
        dateTo: data[data.length - 1].date
      }));

      setIsComputing(false);
    }, 600);
  }, []);

  const applyFilters = useCallback(() => {
    let filteredData = [...rawData];

    // Filter by date range
    if (filters.dateFrom) {
      filteredData = filteredData.filter(d => d.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filteredData = filteredData.filter(d => d.date <= filters.dateTo);
    }

    // Aggregate by granularity
    filteredData = aggregateData(filteredData, filters.granularity);

    // Calculate summary
    const projections = filteredData.filter(d => d.isProjection);
    const totalRevenue = projections.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProfit = projections.reduce((acc, curr) => acc + curr.profit, 0);
    const totalExpenses = projections.reduce((acc, curr) => acc + curr.expenses, 0);

    const newClients = projections.length > 0
      ? projections[projections.length - 1].clients - projections[0].clients
      : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const growthRates = projections.map(d => d.growthRate || 0).filter(r => r !== 0);
    const avgGrowthRate = growthRates.length > 0
      ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length
      : 0;

    const projectedROI = totalRevenue > 0 ? ((totalProfit / totalExpenses) * 100) : 0;

    setResults({
      data: filteredData,
      summary: {
        totalRevenue,
        totalProfit,
        newClients: Math.max(0, newClients),
        profitMargin,
        avgGrowthRate,
        projectedROI
      }
    });
  }, [rawData, filters]);

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleMetric = useCallback((metric: keyof FilterOptions['visibleMetrics']) => {
    setFilters(prev => ({
      ...prev,
      visibleMetrics: {
        ...prev.visibleMetrics,
        [metric]: !prev.visibleMetrics[metric]
      }
    }));
  }, []);

  const saveScenario = useCallback((name: string) => {
    if (!results) return;
    const scenario: Scenario = {
      id: `SCN-${Date.now()}`,
      name,
      results: { ...results },
      createdAt: new Date().toISOString()
    };
    setScenarios(prev => [scenario, ...prev]);
    setSelectedScenario(scenario.id);
  }, [results]);

  const loadScenario = useCallback((scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setResults(scenario.results);
      setRawData(scenario.results.data);
      setSelectedScenario(scenarioId);
    }
  }, [scenarios]);

  const deleteScenario = useCallback((scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenario === scenarioId) {
      setSelectedScenario(null);
    }
  }, [selectedScenario]);

  return {
    results,
    scenarios,
    isComputing,
    selectedScenario,
    filters,
    runSimulation,
    saveScenario,
    loadScenario,
    deleteScenario,
    updateFilter,
    toggleMetric
  };
}
