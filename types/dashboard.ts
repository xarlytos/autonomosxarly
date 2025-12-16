export type WidgetType =
    | 'kpi-revenue'
    | 'kpi-profitability'
    | 'kpi-efficiency'
    | 'system-metrics'
    | 'opportunities'
    | 'market-topology'
    | 'event-stream'
    | 'swarm-status'
    | 'calendar-events';

export type WidgetSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface WidgetConfig {
    id: string;
    type: WidgetType;
    size: WidgetSize;
    position: { x: number; y: number; w: number; h: number };
    visible: boolean;
}

export interface DashboardLayout {
    widgets: WidgetConfig[];
    lastModified: Date;
}

export interface WidgetDefinition {
    type: WidgetType;
    name: string;
    description: string;
    icon: string;
    defaultSize: WidgetSize;
    minSize: { w: number; h: number };
    maxSize: { w: number; h: number };
}
