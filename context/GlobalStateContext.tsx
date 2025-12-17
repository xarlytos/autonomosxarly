import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Negotiation, Transaction, FinancialMetrics, CalendarEvent } from '../types';

// Initial Mock Data
const INITIAL_NEGOTIATIONS: Negotiation[] = [
    {
        id: '1',
        counterparty: 'Acme Corp Supply',
        type: 'BUY',
        product: 'Raw Materials',
        amount: 12450,
        progress: 88,
        status: 'ACTIVE',
        sentiment: 0.7,
        zopaDetected: true,
        zopaRange: { min: 11000, max: 13500 },
        batna: 13800,
        reservationPrice: 13500,
        targetPrice: 11000,
        activeStrategies: ['ANCHORING', 'RECIPROCITY'],
        offers: [
            { id: 'o1', timestamp: '2025-12-13T09:45:00', from: 'THEM', message: 'Buenos días! Vi que solicitaron una cotización para raw materials. ¿En qué puedo ayudarles hoy?', sentiment: 0.6 },
            { id: 'o2', timestamp: '2025-12-13T09:50:00', from: 'US', message: 'Sí, exacto. Necesitamos materias primas para nuestro próximo lote de producción. ¿Qué disponibilidad tienen?', sentiment: 0.5 },
            { id: 'o3', timestamp: '2025-12-13T10:00:00', from: 'THEM', message: 'Tenemos stock disponible inmediato. Para el volumen que mencionaron, podemos ofrecer entrega en 48 horas.', sentiment: 0.7 },
            { id: 'o4', timestamp: '2025-12-13T10:05:00', from: 'US', message: 'Perfecto, eso nos funciona. Podríamos cerrar en $11,000 con envío gratuito y pago a 10 días. ¿Qué opina?', amount: 11000, terms: 'Net10 + Free Shipping', sentiment: 0.5 },
            { id: 'o5', timestamp: '2025-12-13T10:15:00', from: 'THEM', message: 'El precio mínimo que podemos ofrecer es $13,200 con pago a 30 días. Es nuestro mejor precio considerando la calidad del material premium.', amount: 13200, terms: 'Net30', sentiment: 0.3 },
            { id: 'o6', timestamp: '2025-12-13T10:30:00', from: 'US', message: 'Entiendo su posición, pero ese precio está por encima de nuestro presupuesto. ¿Podrían considerar $11,750 con pago a 15 días y envío gratis? Llevamos 3 años comprando con ustedes.', amount: 11750, terms: 'Net15 + Free Shipping', sentiment: 0.6 },
            { id: 'o7', timestamp: '2025-12-13T10:45:00', from: 'THEM', message: 'Apreciamos mucho su lealtad. Déjeme consultar con mi supervisor...', sentiment: 0.7 },
            { id: 'o8', timestamp: '2025-12-13T10:50:00', from: 'THEM', message: 'Hemos revisado los números y podemos bajar a $12,450 con pago a 20 días. Es lo máximo que podemos hacer sin comprometer la calidad. ¿Le parece bien?', amount: 12450, terms: 'Net20', sentiment: 0.7 },
        ]
    },
    {
        id: '2',
        counterparty: 'Globex Logistics',
        type: 'BUY',
        product: 'Shipping Q1',
        amount: 45000,
        progress: 64,
        status: 'AUCTION',
        sentiment: 0.4,
        zopaDetected: false,
        batna: 52000,
        reservationPrice: 50000,
        targetPrice: 42000,
        activeStrategies: ['SCARCITY', 'AUTHORITY'],
        offers: [
            { id: 'o1', timestamp: '2025-12-13T08:30:00', from: 'US', message: 'Hola, ¿cómo están? Queremos cotizar el servicio de envíos para todo el Q1.', sentiment: 0.5 },
            { id: 'o2', timestamp: '2025-12-13T08:45:00', from: 'THEM', message: '¡Hola! Claro que sí. ¿Qué volumen estimado están manejando?', sentiment: 0.6 },
            { id: 'o3', timestamp: '2025-12-13T09:00:00', from: 'US', message: 'Calculamos alrededor de 500 envíos mensuales. Tenemos presupuesto de $42,000 para tarifa de volumen. ¿Pueden hacerlo?', amount: 42000, terms: 'Bulk Rate', sentiment: 0.3 },
            { id: 'o4', timestamp: '2025-12-13T09:30:00', from: 'THEM', message: 'Revisando su solicitud... Con el volumen que manejan, podríamos ofrecer $48,000 bajo tarifa estándar. Los costos de combustible han subido bastante este trimestre.', amount: 48000, terms: 'Standard', sentiment: 0.4 },
            { id: 'o5', timestamp: '2025-12-13T09:35:00', from: 'US', message: 'Es mucho más de lo que esperábamos. ¿No hay forma de ajustar ese precio?', sentiment: 0.3 },
        ]
    },
    {
        id: '3',
        counterparty: 'Massive Dynamic',
        type: 'BUY',
        product: 'R&D Consultation',
        amount: 8900,
        progress: 45,
        status: 'ACTIVE',
        sentiment: 0.5,
        zopaDetected: false,
        batna: 12000,
        reservationPrice: 11000,
        targetPrice: 8000,
        activeStrategies: ['SOCIAL_PROOF'],
        offers: [
            { id: 'o1', timestamp: '2025-12-13T07:45:00', from: 'US', message: 'Buenos días. Nos interesa contratar servicios de consultoría en R&D.', sentiment: 0.5 },
            { id: 'o2', timestamp: '2025-12-13T07:55:00', from: 'THEM', message: 'Excelente! Cuénteme más sobre su proyecto. ¿Qué tipo de consultoría necesitan exactamente?', sentiment: 0.6 },
            { id: 'o3', timestamp: '2025-12-13T08:00:00', from: 'US', message: 'Necesitamos ayuda con el desarrollo de un nuevo producto por 3 meses. Nuestro presupuesto inicial es de $8,000. ¿Qué nos pueden ofrecer?', amount: 8000, terms: '3-month contract', sentiment: 0.4 },
            { id: 'o4', timestamp: '2025-12-13T08:20:00', from: 'THEM', message: 'Interesante proyecto. Déjeme revisar con nuestro equipo técnico...', sentiment: 0.5 },
            { id: 'o5', timestamp: '2025-12-13T08:45:00', from: 'THEM', message: 'Para un proyecto con el alcance que mencionan, necesitaríamos $10,500 y preferiblemente extenderlo a 6 meses para lograr mejores resultados.', amount: 10500, terms: '6-month contract', sentiment: 0.5 },
        ]
    },
    {
        id: '4',
        counterparty: 'Sovereign Systems',
        type: 'SELL',
        product: 'Software License',
        amount: 120000,
        progress: 100,
        status: 'CLOSED',
        sentiment: 0.9,
        zopaDetected: true,
        zopaRange: { min: 115000, max: 135000 },
        batna: 100000,
        reservationPrice: 110000,
        targetPrice: 130000,
        activeStrategies: ['AUTHORITY', 'SCARCITY'],
        offers: [
            { id: 'o1', timestamp: '2025-12-12T13:30:00', from: 'THEM', message: 'Hola! Vimos su software en la conferencia de tecnología el mes pasado. Nos impresionó mucho.', sentiment: 0.7 },
            { id: 'o2', timestamp: '2025-12-12T13:45:00', from: 'US', message: '¡Gracias! Nos alegra mucho que les haya interesado. ¿En qué podemos ayudarles?', sentiment: 0.7 },
            { id: 'o3', timestamp: '2025-12-12T14:00:00', from: 'THEM', message: 'Queremos implementarlo en nuestra empresa. ¿Qué opciones de licenciamiento tienen disponibles?', sentiment: 0.6 },
            { id: 'o4', timestamp: '2025-12-12T14:10:00', from: 'US', message: 'Tenemos la licencia anual disponible por $130,000. Incluye todas las funcionalidades premium y actualizaciones automáticas durante todo el año.', amount: 130000, terms: 'Annual license', sentiment: 0.6 },
            { id: 'o5', timestamp: '2025-12-12T14:45:00', from: 'THEM', message: 'Es un poco más de lo que teníamos presupuestado...', sentiment: 0.4 },
            { id: 'o6', timestamp: '2025-12-12T15:00:00', from: 'THEM', message: '¿Podrían considerar $115,000 si incluimos soporte técnico anual en el paquete? Queremos establecer una relación a largo plazo.', amount: 115000, terms: 'Annual + Support', sentiment: 0.7 },
            { id: 'o7', timestamp: '2025-12-12T15:30:00', from: 'US', message: 'Me gusta esa visión de largo plazo. Déjeme ver qué podemos hacer...', sentiment: 0.8 },
            { id: 'o8', timestamp: '2025-12-12T16:00:00', from: 'US', message: 'Perfecto! Podemos cerrar en $120,000 incluyendo la licencia anual + soporte premium con respuesta garantizada en 24h. ¿Trato hecho?', amount: 120000, terms: 'Annual + Premium Support', sentiment: 0.9 },
            { id: 'o9', timestamp: '2025-12-12T16:05:00', from: 'THEM', message: '¡Excelente! Trato hecho. Procederé con el papeleo. 🤝', sentiment: 0.95 },
        ]
    },
];

// Initial Financial Data
const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 'TX-8842', concept: 'AWS Infrastructure', amount: 430.00, currency: 'USD', type: 'OUT', status: 'VERIFIED', date: new Date(Date.now() - 2 * 3600000).toISOString(), category: 'Software Expense', taxRule: 'Rule 179-B', account: 'Business Checking', confidence: 98.2, aiAnalysis: { category: 'Cloud Services', confidence: 98.2, taxDeductible: true, flags: [] } },
    { id: 'TX-8843', concept: 'Client Payment #402 - Acme Corp', amount: 12500.00, currency: 'USD', type: 'IN', status: 'VERIFIED', date: new Date(Date.now() - 5 * 3600000).toISOString(), category: 'Revenue', taxRule: 'Income Class A', account: 'Business Checking', confidence: 100, aiAnalysis: { category: 'Consulting Revenue', confidence: 100, taxDeductible: false, flags: [] } },
    { id: 'TX-8844', concept: 'Team Offsite Lunch', amount: 245.50, currency: 'USD', type: 'OUT', status: 'PROCESSING', date: new Date(Date.now() - 6 * 3600000).toISOString(), category: 'Meals & Entertainment', taxRule: 'Pending...', account: 'Business Credit Card', confidence: 87.5, aiAnalysis: { category: 'Meals & Entertainment', confidence: 87.5, taxDeductible: true, flags: ['50% deductible'] } },
    { id: 'TX-8841', concept: 'Unknown Vendor', amount: 99.00, currency: 'USD', type: 'OUT', status: 'FLAGGED', date: new Date(Date.now() - 86400000).toISOString(), category: 'Uncategorized', taxRule: 'Review Required', account: 'Business Checking', confidence: 45.3, aiAnalysis: { category: 'Uncategorized', confidence: 45.3, taxDeductible: false, flags: ['Unknown vendor', 'Manual review required'] } },
];

const INITIAL_METRICS: FinancialMetrics = {
    totalBalance: 142850.00,
    monthlyRevenue: 26250.00,
    monthlyExpenses: 8945.28,
    netProfit: 17304.72,
    cashFlow: 15200.00,
    accountsReceivable: 28950.00,
    accountsPayable: 4200.00,
    taxLiability: 5191.42,
};

const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1', title: 'Q3 Strategy Review', start: new Date().toISOString(), end: new Date().toISOString(), type: 'MEETING', status: 'PENDING', platform: 'GOOGLE'
    },
    {
        id: '2', title: 'Client Follow-up: Nexus', start: new Date(Date.now() + 86400000).toISOString(), end: new Date(Date.now() + 86400000).toISOString(), type: 'CALL', status: 'PENDING'
    }
];

interface GlobalStateContextType {
    negotiations: Negotiation[];
    updateNegotiation: (updated: Negotiation) => void;

    transactions: Transaction[];
    financialMetrics: FinancialMetrics;
    addTransaction: (tx: Transaction) => void;
    updateFinancialMetrics: (metrics: FinancialMetrics) => void;

    calendarEvents: CalendarEvent[];
    addCalendarEvent: (event: CalendarEvent) => void;
    updateCalendarEvent: (event: CalendarEvent) => void;
    deleteCalendarEvent: (eventId: string) => void;

    uiMode: 'lite' | 'advanced';
    setUIMode: (mode: 'lite' | 'advanced') => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics>(INITIAL_METRICS);

    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    // UI Mode State
    const [uiMode, setUIModeState] = useState<'lite' | 'advanced'>(() => {
        // Safe check for SSR/SSG environments
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('obsidian_ui_mode');
            return (saved as 'lite' | 'advanced') || 'lite';
        }
        return 'lite';
    });

    const setUIMode = (mode: 'lite' | 'advanced') => {
        setUIModeState(mode);
        localStorage.setItem('obsidian_ui_mode', mode);
    };

    // Load from LocalStorage on mount
    useEffect(() => {
        // Negotiations
        const savedNegotiations = localStorage.getItem('obsidian_negotiations');
        if (savedNegotiations) {
            try { setNegotiations(JSON.parse(savedNegotiations)); } catch (e) { setNegotiations(INITIAL_NEGOTIATIONS); }
        } else { setNegotiations(INITIAL_NEGOTIATIONS); }

        // Transactions
        const savedTx = localStorage.getItem('obsidian_transactions');
        if (savedTx) {
            try { setTransactions(JSON.parse(savedTx)); } catch (e) { setTransactions(INITIAL_TRANSACTIONS); }
        } else { setTransactions(INITIAL_TRANSACTIONS); }

        // Metrics
        const savedMetrics = localStorage.getItem('obsidian_metrics');
        if (savedMetrics) {
            try { setFinancialMetrics(JSON.parse(savedMetrics)); } catch (e) { setFinancialMetrics(INITIAL_METRICS); }
        } else { setFinancialMetrics(INITIAL_METRICS); }

        // Calendar Events
        const savedEvents = localStorage.getItem('obsidian_events');
        if (savedEvents) {
            try { setCalendarEvents(JSON.parse(savedEvents)); } catch (e) { setCalendarEvents(INITIAL_EVENTS); }
        } else { setCalendarEvents(INITIAL_EVENTS); }

    }, []);

    // Save to LocalStorage whenever changes
    useEffect(() => {
        if (negotiations.length > 0) {
            localStorage.setItem('obsidian_negotiations', JSON.stringify(negotiations));
        }
    }, [negotiations]);

    // Save Transactions & Metrics
    useEffect(() => {
        if (transactions.length > 0) localStorage.setItem('obsidian_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('obsidian_metrics', JSON.stringify(financialMetrics));
    }, [financialMetrics]);

    useEffect(() => {
        if (calendarEvents.length > 0) localStorage.setItem('obsidian_events', JSON.stringify(calendarEvents));
    }, [calendarEvents]);

    const updateNegotiation = (updated: Negotiation) => {
        setNegotiations(prev => prev.map(n => n.id === updated.id ? updated : n));
    };

    const addTransaction = (tx: Transaction) => {
        setTransactions(prev => [tx, ...prev]);

        // Update total balance logic
        if (tx.status === 'VERIFIED' || tx.status === 'PROCESSING') {
            const amount = tx.amount;
            setFinancialMetrics(prev => ({
                ...prev,
                totalBalance: tx.type === 'IN' ? prev.totalBalance + amount : prev.totalBalance - amount,
                monthlyExpenses: tx.type === 'OUT' ? prev.monthlyExpenses + amount : prev.monthlyExpenses,
                monthlyRevenue: tx.type === 'IN' ? prev.monthlyRevenue + amount : prev.monthlyRevenue
            }));
        }
    };

    const updateFinancialMetrics = (metrics: FinancialMetrics) => {
        setFinancialMetrics(metrics);
    };

    const addCalendarEvent = (event: CalendarEvent) => {
        setCalendarEvents(prev => [...prev, event]);
    };

    const updateCalendarEvent = (updated: CalendarEvent) => {
        setCalendarEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
    };

    const deleteCalendarEvent = (eventId: string) => {
        setCalendarEvents(prev => prev.filter(ev => ev.id !== eventId));
    };

    return (
        <GlobalStateContext.Provider value={{
            negotiations, updateNegotiation,
            transactions, financialMetrics, addTransaction, updateFinancialMetrics,
            calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
            uiMode, setUIMode
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
