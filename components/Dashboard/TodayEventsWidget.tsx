import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { ObsidianCard, ObsidianButton } from '../ui/ObsidianElements';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CalendarEvent } from '../../types';

interface TodayEventsWidgetProps {
    onViewCalendar?: () => void;
}

export const TodayEventsWidget: React.FC<TodayEventsWidgetProps> = ({ onViewCalendar }) => {
    const { calendarEvents } = useGlobalState();

    const today = new Date();
    const todayEvents = calendarEvents.filter(ev => {
        const evDate = new Date(ev.start);
        return evDate.getDate() === today.getDate() &&
            evDate.getMonth() === today.getMonth() &&
            evDate.getFullYear() === today.getFullYear();
    }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const upcomingEvents = todayEvents.filter(ev => new Date(ev.end) > new Date());

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="text-obsidian-accent" size={18} />
                    <h3 className="text-sm font-medium text-white tracking-wide uppercase">Agenda de Hoy</h3>
                </div>
                <span className="text-xs text-obsidian-text-muted font-mono">
                    {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                {todayEvents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-obsidian-text-muted opacity-60">
                        <Calendar size={32} className="mb-2 opacity-50" />
                        <span className="text-sm">Sin eventos hoy</span>
                    </div>
                ) : (
                    todayEvents.map(event => {
                        const isPast = new Date(event.end) < new Date();
                        const isNow = new Date(event.start) <= new Date() && new Date(event.end) >= new Date();

                        return (
                            <div
                                key={event.id}
                                className={`
                                    relative p-3 rounded-lg border transition-all duration-300
                                    ${isNow
                                        ? 'bg-obsidian-accent/10 border-obsidian-accent/40 shadow-[0_0_15px_-5px_votes_obsidian-accent]'
                                        : isPast
                                            ? 'bg-white/[0.02] border-white/5 opacity-60 grayscale'
                                            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        {isNow && <span className="w-1.5 h-1.5 rounded-full bg-obsidian-accent animate-pulse" />}
                                        <h4 className={`text-sm font-medium ${isNow ? 'text-white' : 'text-gray-200'}`}>
                                            {event.title}
                                        </h4>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${event.type === 'MEETING' ? 'border-[#6A4FFB]/30 text-[#6A4FFB]' :
                                        event.type === 'CALL' ? 'border-green-500/30 text-green-400' :
                                            'border-orange-500/30 text-orange-400'
                                        }`}>
                                        {event.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-obsidian-text-muted">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span className="font-mono">
                                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            -
                                            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {event.platform === 'GOOGLE' && (
                                        <div className="flex items-center gap-1 opacity-70">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Google
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {onViewCalendar && (
                <div className="mt-4 pt-3 border-t border-white/5">
                    <ObsidianButton variant="outline" size="sm" className="w-full justify-center" onClick={onViewCalendar}>
                        Ver Calendario Completo
                    </ObsidianButton>
                </div>
            )}
        </div>
    );
};
