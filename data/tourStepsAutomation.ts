import { TourStep } from '../components/Onboarding/InteractiveTour';

export const AUTOMATION_TOUR_STEPS: TourStep[] = [
    {
        target: '.tour-swarm-header',
        title: 'Gestor de Automatizaciones',
        content: 'Bienvenido a tu centro de mando. Aquí orquestas enjambres de agentes autónomos que trabajan en paralelo para ti.'
    },
    {
        target: '.tour-swarm-stats',
        title: 'Monitoreo en Tiempo Real',
        content: 'Visualiza cuántos agentes están activos trabajando actualmente y el coste acumulado de las operaciones en curso.'
    },
    {
        target: '.tour-swarm-list',
        title: 'Misiones Activas',
        content: 'Aquí verás el progreso de tus misiones. Desde investigación de mercado hasta generación de leads, todo en un solo lugar.'
    },
    {
        target: '.tour-swarm-create-btn',
        title: 'Lanza tu Primer Enjambre',
        content: 'Pulsa aquí para desplegar una nueva misión. Elige una plantilla predefinida o crea una estrategia personalizada.'
    }
];
