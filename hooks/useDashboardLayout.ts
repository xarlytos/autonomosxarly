import { useState, useEffect, useCallback } from 'react';
import type { DashboardLayout, WidgetConfig, WidgetType, WidgetSize } from '../types/dashboard';

const DEFAULT_LAYOUT: DashboardLayout = {
    widgets: [
        { id: 'w1', type: 'kpi-revenue', size: 'large', position: { x: 0, y: 0, w: 4, h: 3 }, visible: true },
        { id: 'w2', type: 'kpi-profitability', size: 'medium', position: { x: 4, y: 0, w: 4, h: 3 }, visible: true },
        { id: 'w3', type: 'kpi-efficiency', size: 'medium', position: { x: 8, y: 0, w: 4, h: 3 }, visible: true },
        { id: 'w4', type: 'market-topology', size: 'large', position: { x: 0, y: 3, w: 8, h: 4 }, visible: true },
        { id: 'w5', type: 'opportunities', size: 'medium', position: { x: 8, y: 3, w: 4, h: 4 }, visible: true },
        { id: 'w6', type: 'event-stream', size: 'large', position: { x: 0, y: 7, w: 8, h: 3 }, visible: true },
        { id: 'w7', type: 'system-metrics', size: 'medium', position: { x: 8, y: 7, w: 4, h: 3 }, visible: true },
        { id: 'w8', type: 'calendar-events', size: 'medium', position: { x: 8, y: 10, w: 4, h: 4 }, visible: true },
    ],
    lastModified: new Date()
};

const STORAGE_KEY = 'obsidian-dashboard-layout';

export const useDashboardLayout = () => {
    const [layout, setLayout] = useState<DashboardLayout>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);

                // MIGRATION: Ensure calendar widget exists for existing users
                const hasCalendar = parsed.widgets.some((w: any) => w.type === 'calendar-events');

                if (!hasCalendar) {
                    const calendarWidget = DEFAULT_LAYOUT.widgets.find(w => w.type === 'calendar-events');
                    if (calendarWidget) {
                        return {
                            ...parsed,
                            widgets: [...parsed.widgets, calendarWidget],
                            lastModified: new Date()
                        };
                    }
                }

                return {
                    ...parsed,
                    lastModified: new Date(parsed.lastModified)
                };
            }
        } catch (error) {
            console.error('Error loading dashboard layout:', error);
        }
        return DEFAULT_LAYOUT;
    });

    const [isCustomizing, setIsCustomizing] = useState(false);

    // Save to localStorage whenever layout changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
        } catch (error) {
            console.error('Error saving dashboard layout:', error);
        }
    }, [layout]);

    const addWidget = useCallback((type: WidgetType) => {
        const newWidget: WidgetConfig = {
            id: `w${Date.now()}`,
            type,
            size: 'medium',
            position: { x: 0, y: Infinity, w: 4, h: 3 }, // Will be placed at bottom
            visible: true
        };

        setLayout(prev => ({
            widgets: [...prev.widgets, newWidget],
            lastModified: new Date()
        }));
    }, []);

    const removeWidget = useCallback((id: string) => {
        setLayout(prev => ({
            widgets: prev.widgets.filter(w => w.id !== id),
            lastModified: new Date()
        }));
    }, []);

    const toggleWidget = useCallback((id: string) => {
        setLayout(prev => ({
            widgets: prev.widgets.map(w =>
                w.id === id ? { ...w, visible: !w.visible } : w
            ),
            lastModified: new Date()
        }));
    }, []);

    const updateWidgetPosition = useCallback((id: string, position: { x: number; y: number; w: number; h: number }) => {
        setLayout(prev => ({
            widgets: prev.widgets.map(w =>
                w.id === id ? { ...w, position } : w
            ),
            lastModified: new Date()
        }));
    }, []);

    const updateWidgetSize = useCallback((id: string, size: WidgetSize) => {
        setLayout(prev => ({
            widgets: prev.widgets.map(w =>
                w.id === id ? { ...w, size } : w
            ),
            lastModified: new Date()
        }));
    }, []);

    const updateLayout = useCallback((newWidgets: WidgetConfig[]) => {
        setLayout({
            widgets: newWidgets,
            lastModified: new Date()
        });
    }, []);

    const resetLayout = useCallback(() => {
        setLayout(DEFAULT_LAYOUT);
    }, []);

    return {
        layout,
        isCustomizing,
        setIsCustomizing,
        addWidget,
        removeWidget,
        toggleWidget,
        updateWidgetPosition,
        updateWidgetSize,
        updateLayout,
        resetLayout
    };
};
