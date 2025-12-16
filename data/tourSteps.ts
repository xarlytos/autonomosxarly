
import { TourStep } from '../components/Onboarding/InteractiveTour';

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
    {
        target: '.dashboard-header', // We need to add this class to the header
        title: 'Bienvenido al Command Center',
        content: 'Este es el corazón de Obsidian OS. Aquí tienes una vista unificada de todas las operaciones, enjambres y alertas críticas.'
    },
    {
        target: '.dashboard-tabs', // We need to add this class to the tabs container
        title: 'Navegación Rápida',
        content: 'Alterna entre la vista general, el estado de tus enjambres de agentes y las alertas del sistema.'
    },
    {
        target: '.dashboard-customize-btn', // We need to add this class
        title: 'Personaliza tu Espacio',
        content: 'El dashboard es modular. Pulsa aquí para reorganizar, añadir o quitar widgets según tus prioridades.'
    },
    {
        target: '.sidebar-nav', // This is in Sidebar, might be tricky if Sidebar is outside WarRoomDashboard but visible. 
        title: 'Acceso a Módulos',
        content: 'Accede a los laboratorios especializados (DTO Lab, SSI Vault) desde la barra lateral.'
    }
];

// Fallback if Sidebar is hard to target from local context, we stick to dashboard elements first.
