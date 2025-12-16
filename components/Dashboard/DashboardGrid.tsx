import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetContainer } from './WidgetContainer';
import type { WidgetConfig } from '../../types/dashboard';

interface DashboardGridProps {
    widgets: WidgetConfig[];
    isCustomizing: boolean;
    onLayoutChange: (layout: any[]) => void;
    onRemoveWidget: (id: string) => void;
    renderWidget: (type: string) => React.ReactNode;
    getWidgetTitle: (type: string) => string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
    widgets,
    isCustomizing,
    onLayoutChange,
    onRemoveWidget,
    renderWidget,
    getWidgetTitle
}) => {
    const layout = widgets
        .filter(w => w.visible)
        .map(w => ({
            i: w.id,
            x: w.position.x,
            y: w.position.y,
            w: w.position.w,
            h: w.position.h,
            minW: 2,
            minH: 2,
            maxW: 12,
            maxH: 8
        }));

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <GridLayout
                className="layout w-full"
                layout={layout}
                cols={12}
                rowHeight={80}
                width={1600}
                onLayoutChange={onLayoutChange}
                isDraggable={isCustomizing}
                isResizable={isCustomizing}
                compactType="vertical"
                preventCollision={false}
                margin={[24, 24]}
                containerPadding={[0, 0]}
                draggableHandle=".cursor-move"
            >
                {widgets.filter(w => w.visible).map(widget => (
                    <div key={widget.id}>
                        <WidgetContainer
                            id={widget.id}
                            title={getWidgetTitle(widget.type)}
                            size={widget.size}
                            isCustomizing={isCustomizing}
                            onRemove={() => onRemoveWidget(widget.id)}
                        >
                            {renderWidget(widget.type)}
                        </WidgetContainer>
                    </div>
                ))}
            </GridLayout>
        </div>
    );
};
