export interface GlossaryTerm {
    id: string;
    term: string;
    shortDefinition: string;
    fullDefinition: string;
    category: 'negotiation' | 'finance' | 'security' | 'automation' | 'analytics' | 'general';
    relatedTerms?: string[];
    formula?: string;
    example?: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
    // Negotiation Terms
    'zopa': {
        id: 'zopa',
        term: 'ZOPA',
        shortDefinition: 'Zona de Posible Acuerdo entre dos partes',
        fullDefinition: 'Rango de valores donde ambas partes pueden llegar a un acuerdo mutuamente beneficioso. Es el espacio entre el precio mínimo del vendedor y el máximo del comprador.',
        category: 'negotiation',
        relatedTerms: ['batna', 'reservation-price'],
        example: 'Si el comprador paga hasta $100 y el vendedor acepta desde $80, la ZOPA es $80-$100.'
    },
    'batna': {
        id: 'batna',
        term: 'BATNA',
        shortDefinition: 'Mejor Alternativa a un Acuerdo Negociado',
        fullDefinition: 'Best Alternative To a Negotiated Agreement. Es tu mejor opción si la negociación actual falla.',
        category: 'negotiation',
        relatedTerms: ['zopa'],
        example: 'Si negocio un coche y mi BATNA es comprar otro modelo, no aceptaré menos que esa alternativa.'
    },
    'weighted-value': {
        id: 'weighted-value',
        term: 'Weighted Value',
        shortDefinition: 'Valor Ponderado según importancia',
        fullDefinition: 'Valor calculado multiplicando cada métrica por su peso de importancia relativa. Permite comparar opciones con múltiples criterios.',
        category: 'analytics',
        formula: 'WV = Σ(valor_i × peso_i)',
        example: 'Si precio tiene peso 0.6 y calidad 0.4: WV = (precio × 0.6) + (calidad × 0.4)'
    },

    // Analytics Terms
    'monte-carlo': {
        id: 'monte-carlo',
        term: 'Monte Carlo',
        shortDefinition: 'Simulación probabilística con muestreo aleatorio',
        fullDefinition: 'Método que usa muestreo aleatorio repetido (típicamente 10,000 iteraciones) para obtener resultados numéricos y predecir escenarios futuros con incertidumbre.',
        category: 'analytics',
        example: 'Ejecutar 10,000 simulaciones para predecir ingresos futuros considerando diferentes variables aleatorias.'
    },
    'cono-incertidumbre': {
        id: 'cono-incertidumbre',
        term: 'Cono de Incertidumbre',
        shortDefinition: 'Rango de resultados posibles en el futuro',
        fullDefinition: 'Visualización que muestra cómo la incertidumbre aumenta con el tiempo. Representa el rango entre el mejor y peor escenario posible.',
        category: 'analytics',
        relatedTerms: ['monte-carlo'],
        example: 'En 1 mes la incertidumbre es ±10%, pero en 1 año puede ser ±50%.'
    },

    // Security Terms
    'differential-privacy': {
        id: 'differential-privacy',
        term: 'Differential Privacy',
        shortDefinition: 'Privacidad Diferencial con ruido controlado',
        fullDefinition: 'Técnica que añade ruido matemático controlado a los datos para proteger la privacidad individual mientras mantiene utilidad estadística. El parámetro epsilon (ε) controla el nivel de privacidad.',
        category: 'security',
        formula: 'ε (epsilon) controla privacidad: menor ε = más privacidad',
        example: 'Con ε=0.1, los datos tienen alta privacidad pero menos precisión. Con ε=1.0, más precisión pero menos privacidad.'
    },
    'ssi': {
        id: 'ssi',
        term: 'SSI',
        shortDefinition: 'Self-Sovereign Identity - Identidad Soberana',
        fullDefinition: 'Sistema donde los individuos controlan completamente su identidad digital sin depender de autoridades centrales. Usa blockchain y criptografía.',
        category: 'security',
        relatedTerms: ['did'],
        example: 'Tu identidad digital está en tu wallet, no en servidores de Google o Facebook.'
    },
    'did': {
        id: 'did',
        term: 'DID',
        shortDefinition: 'Decentralized Identifier - Identificador Descentralizado',
        fullDefinition: 'Identificador único verificable que no requiere autoridad central. Formato: did:método:identificador',
        category: 'security',
        relatedTerms: ['ssi'],
        example: 'did:sov:28f9s8d9f8s9d8f...x92 es un DID en la red Sovrin.'
    },

    // Finance Terms
    'roi': {
        id: 'roi',
        term: 'ROI',
        shortDefinition: 'Return on Investment - Retorno de Inversión',
        fullDefinition: 'Métrica que mide la rentabilidad de una inversión. Se calcula como (Ganancia - Coste) / Coste × 100%',
        category: 'finance',
        formula: 'ROI = ((Ganancia - Coste) / Coste) × 100%',
        example: 'Invertí $1000 y gané $1500. ROI = (1500-1000)/1000 × 100% = 50%'
    },
    'margen-operativo': {
        id: 'margen-operativo',
        term: 'Margen Operativo',
        shortDefinition: 'Beneficio operativo como % de ingresos',
        fullDefinition: 'Porcentaje de ingresos que queda después de pagar costes operacionales. Mide eficiencia operativa.',
        category: 'finance',
        formula: 'Margen = (Beneficio Operativo / Ingresos) × 100%',
        example: 'Con $100k ingresos y $70k costes: Margen = 30k/100k = 30%'
    },

    // Automation Terms
    'enjambre': {
        id: 'enjambre',
        term: 'Enjambre',
        shortDefinition: 'Grupo de agentes trabajando coordinadamente',
        fullDefinition: 'Conjunto de agentes autónomos que colaboran para completar tareas complejas. Cada agente tiene un rol específico.',
        category: 'automation',
        example: 'Un enjambre de marketing con 5 agentes: análisis, contenido, email, social media y reportes.'
    },
    'agente': {
        id: 'agente',
        term: 'Agente',
        shortDefinition: 'Automatización que ejecuta tareas específicas',
        fullDefinition: 'Programa autónomo que realiza tareas específicas sin intervención humana. Puede tomar decisiones basadas en reglas o IA.',
        category: 'automation',
        relatedTerms: ['enjambre'],
        example: 'Un agente de email que envía campañas automáticamente según comportamiento del usuario.'
    },

    // General Terms
    'kpi': {
        id: 'kpi',
        term: 'KPI',
        shortDefinition: 'Key Performance Indicator - Indicador Clave',
        fullDefinition: 'Métrica cuantificable que mide el rendimiento de un objetivo específico del negocio.',
        category: 'general',
        example: 'Ingresos mensuales, tasa de conversión, satisfacción del cliente.'
    },
    'latencia': {
        id: 'latencia',
        term: 'Latencia',
        shortDefinition: 'Tiempo de respuesta del sistema',
        fullDefinition: 'Tiempo que tarda el sistema en responder a una petición, medido en milisegundos. Valores bajos indican mejor rendimiento.',
        category: 'general',
        example: 'Latencia de 24ms significa que el sistema responde en 0.024 segundos.'
    },
    'uptime': {
        id: 'uptime',
        term: 'Uptime',
        shortDefinition: 'Tiempo que el sistema está operativo',
        fullDefinition: 'Porcentaje del tiempo que el sistema ha estado disponible y funcionando sin interrupciones. 99.9% es el estándar de la industria.',
        category: 'general',
        example: '99.97% uptime significa solo 13 minutos de inactividad al mes.'
    }
};

// Helper function to get term by ID
export const getTerm = (id: string): GlossaryTerm | undefined => {
    return GLOSSARY[id];
};

// Helper function to search terms
export const searchTerms = (query: string): GlossaryTerm[] => {
    const lowerQuery = query.toLowerCase();
    return Object.values(GLOSSARY).filter(term =>
        term.term.toLowerCase().includes(lowerQuery) ||
        term.shortDefinition.toLowerCase().includes(lowerQuery) ||
        term.fullDefinition.toLowerCase().includes(lowerQuery)
    );
};

// Helper function to get terms by category
export const getTermsByCategory = (category: GlossaryTerm['category']): GlossaryTerm[] => {
    return Object.values(GLOSSARY).filter(term => term.category === category);
};
