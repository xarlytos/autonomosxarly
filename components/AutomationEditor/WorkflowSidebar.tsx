import React from 'react';
import { Zap, Play, Split, Clock, Mail, Globe, Database, MousePointer } from 'lucide-react';

const SidebarItem = ({ type, label, icon, description }: { type: string; label: string; icon: React.ReactNode; description: string }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', nodeLabel);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-grab hover:bg-gray-700 hover:border-gray-500 transition-colors mb-2"
            onDragStart={(event) => onDragStart(event, type, label)}
            draggable
        >
            <div className="text-blue-400">{icon}</div>
            <div>
                <div className="text-sm font-medium text-gray-200">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
            </div>
        </div>
    );
};

const WorkflowSidebar = () => {
    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col h-full overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                <MousePointer size={14} /> Caja de Herramientas
            </h3>

            <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Disparadores</h4>
                <SidebarItem type="trigger" label="Inicio Manual" icon={<Zap size={16} />} description="Clic de botón" />
                <SidebarItem type="trigger" label="Programado" icon={<Clock size={16} />} description="Cron job" />
                <SidebarItem type="trigger" label="Webhook" icon={<Globe size={16} />} description="Llamada API ext." />
            </div>

            <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Acciones</h4>
                <SidebarItem type="action" label="Ejecutar Tarea" icon={<Play size={16} />} description="Tarea genérica" />
                <SidebarItem type="scrape" label="Scrape Web" icon={<Globe size={16} />} description="Obtener HTML" />
                <SidebarItem type="email" label="Enviar Email" icon={<Mail size={16} />} description="SMTP / API" />
                <SidebarItem type="database" label="Guardar Datos" icon={<Database size={16} />} description="Almacenar resultado" />
            </div>

            <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Flujo de Control</h4>
                <SidebarItem type="condition" label="Condición" icon={<Split size={16} />} description="If / Else" />
                <SidebarItem type="delay" label="Retraso" icon={<Clock size={16} />} description="Tiempo de espera" />
            </div>
        </div>
    );
};

export default WorkflowSidebar;
