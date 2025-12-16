
export interface GuideSection {
    title: string;
    content: string;
    image?: string;
}

export interface Guide {
    id: string;
    title: string;
    description: string;
    icon: string; // We'll map string to Lucide icon in the component
    readTime: string;
    category: 'onboarding' | 'advanced' | 'security' | 'automation';
    sections: GuideSection[];
}

export const GUIDES: Guide[] = [
    {
        id: 'getting-started',
        title: 'Primeros Pasos',
        description: 'Conceptos básicos, navegación y configuración inicial del sistema.',
        icon: 'target',
        readTime: '5 min',
        category: 'onboarding',
        sections: [
            {
                title: 'Bienvenido al Command Center',
                content: 'Esta plataforma unifica todas las operaciones críticas de tu ecosistema digital. Desde aquí puedes supervisar métricas en tiempo real, gestionar enjambres de agentes y asegurar tus activos digitales.',
            },
            {
                title: 'Navegación Principal',
                content: 'La barra lateral izquierda es tu centro de control. Está dividida en 4 áreas clave:\n\n1. **COMMAND**: Dashboard principal y simulación.\n2. **AUTOMATIZACIÓN**: Orquestación de agentes y negociación.\n3. **GROWTH**: Herramientas de marketing y ventas.\n4. **INFRAESTRUCTURA**: Finanzas, seguridad y auditoría.',
            },
            {
                title: 'Personalización',
                content: 'Puedes adaptar el Dashboard principal a tus necesidades. Usa el botón "Personalizar" en la esquina superior derecha para mover, añadir o eliminar widgets.',
            }
        ]
    },
    {
        id: 'scenario-simulator',
        title: 'Simulador de Escenarios',
        description: 'Cómo ejecutar y analizar simulaciones de Monte Carlo para predicciones.',
        icon: 'trending-up',
        readTime: '8 min',
        category: 'advanced',
        sections: [
            {
                title: '¿Qué es el DTO Lab?',
                content: 'El Digital Twin Organization (DTO) Lab te permite crear "gemelos digitales" de tu negocio para probar estrategias sin riesgo real.',
            },
            {
                title: 'Ejecutando una Simulación',
                content: '1. Ve a la sección **Simulador**.\n2. Configura los parámetros de entrada (presupuesto, mercado, variables externas).\n3. Selecciona el modelo "Monte Carlo".\n4. Haz clic en "Ejecutar Simulación".\n\nEl sistema realizará miles de iteraciones para mostrarte un abanico de resultados probables.',
            },
            {
                title: 'Interpretando el Cono de Incertidumbre',
                content: 'El gráfico resultante muestra cómo la varianza aumenta con el tiempo. La zona central más oscura representa los resultados más probables, mientras que las áreas claras muestran los casos extremos.',
            }
        ]
    },
    {
        id: 'security-management',
        title: 'Gestión de Seguridad',
        description: 'Administración de identidades (DIDs), credenciales verificables y auditoría.',
        icon: 'lock',
        readTime: '6 min',
        category: 'security',
        sections: [
            {
                title: 'SSI Vault',
                content: 'Tu bóveda de Identidad Soberana (SSI) es donde residen todas las identidades digitales de tus agentes y empleados. Aquí controlas quién tiene acceso a qué.',
            },
            {
                title: 'Creando un Nuevo DID',
                content: 'Para emitir una nueva identidad:\n1. Accede a **Seguridad** > **Agent Passports**.\n2. Haz clic en "Emitir Nuevo Pasaporte".\n3. Define los permisos y roles del agente.\n4. Firma la transacción criptográfica.',
            },
            {
                title: 'Privacidad Diferencial',
                content: 'El sistema aplica ruido estadístico a los datos sensibles antes de procesarlos. Esto garantiza que la utilidad de los datos se mantenga sin comprometer la privacidad individual de los usuarios.',
            }
        ]
    },
    {
        id: 'automation-swarms',
        title: 'Automatizaciones',
        description: 'Configuración, despliegue y monitoreo de enjambres de agentes.',
        icon: 'zap',
        readTime: '10 min',
        category: 'automation',
        sections: [
            {
                title: 'Concepto de Enjambre',
                content: 'Un enjambre no es un solo bot, es un equipo coordinado de agentes especializados. Cada uno tiene un rol: Analista, Ejecutor, Supervisor, etc.',
            },
            {
                title: 'Orquestador de Enjambres',
                content: 'En la sección **Automatizaciones**, puedes ver el estado de salud de tus enjambres activos. El "Heartbeat" indica que la comunicación entre agentes es fluida.',
            },
            {
                title: 'Desplegando una Nueva Misión',
                content: 'Selecciona una plantilla (ej. "Campaña de Ventas Bionica") y asigna los recursos. El Orquestador instancará los agentes necesarios y comenzará la ejecución autónoma.',
            }
        ]
    }
];
