import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, RefreshCw } from 'lucide-react';
import { ObsidianButton } from '../ui/ObsidianElements';
import { EventModal } from './EventModal';
import { CalendarEvent } from '../../types';
import { useGlobalState } from '../../context/GlobalStateContext';

// Helper to generate calendar grid
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
};

export const CalendarManager: React.FC = () => {
    const { calendarEvents: events, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useGlobalState();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleOpenModal = (date?: Date) => {
        setSelectedDate(date || new Date());
        setSelectedEvent(undefined); // Reset edit state
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering date click
        setSelectedEvent(event);
        setSelectedDate(undefined);
        setIsModalOpen(true);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            deleteCalendarEvent(selectedEvent.id);
            setIsModalOpen(false);
            setSelectedEvent(undefined);
        }
    };

    const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
        if (selectedEvent) {
            // Update existing
            const updatedEvent = { ...selectedEvent, ...eventData };
            updateCalendarEvent(updatedEvent);
        } else {
            // Create new
            const newEvent: CalendarEvent = {
                ...eventData,
                id: Date.now().toString()
            };
            addCalendarEvent(newEvent);
        }
    };

    // Render Grid Cells
    const renderCalendarDays = () => {
        const totalSlots = 42; // 6 rows * 7 cols
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 border border-white/[0.03] bg-white/[0.01]"></div>);
        }

        // Days of current month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

            // Find events for this day
            const dayEvents = events.filter(e => {
                const eDate = new Date(e.start);
                return eDate.getDate() === d && eDate.getMonth() === month && eDate.getFullYear() === year;
            });

            days.push(
                <div key={d} className={`h-32 border border-white/[0.05] p-2 relative group transition-colors hover:bg-white/[0.03] ${isToday ? 'bg-obsidian-accent/5 ring-1 ring-inset ring-obsidian-accent/50' : ''}`}>
                    <span className={`text-sm font-light ${isToday ? 'text-obsidian-accent font-medium' : 'text-obsidian-text-muted'}`}>{d}</span>

                    {/* Events List */}
                    <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                        {dayEvents.map(ev => (
                            <div
                                key={ev.id}
                                onClick={(e) => handleEditEvent(ev, e)}
                                className={`text-[10px] px-1.5 py-1 rounded border-l-2 truncate cursor-pointer hover:opacity-80 transition-opacity
                        ${ev.type === 'MEETING' ? 'bg-[#6A4FFB]/20 border-[#6A4FFB] text-[#6A4FFB]' :
                                        ev.type === 'CALL' ? 'bg-green-500/10 border-green-500 text-green-400' :
                                            'bg-orange-500/10 border-orange-500 text-orange-400'
                                    }
                      `}>
                                <span className="opacity-75 mr-1 font-mono text-[9px] font-semibold">
                                    {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                                {ev.title}
                            </div>
                        ))}
                    </div>

                    {/* Add Button on Hover */}
                    <button
                        onClick={() => handleOpenModal(new Date(year, month, d))}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-obsidian-accent text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            );
        }

        // Fill remaining slots
        const remaining = totalSlots - (firstDay + daysInMonth);
        for (let i = 0; i < remaining; i++) {
            days.push(<div key={`next-empty-${i}`} className="h-32 border border-white/[0.03] bg-white/[0.01]"></div>);
        }

        return days;
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#0B0B0D] overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-obsidian-accent/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-white/5 flex justify-between items-center z-10 bg-[#0B0B0D]/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-light text-white tracking-wide">
                        {monthNames[month]} <span className="text-obsidian-text-muted">{year}</span>
                    </h1>
                    <div className="flex items-center gap-1 bg-[#1A1A1E] rounded-lg p-1 border border-white/5">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded text-obsidian-text-muted hover:text-white transition-colors"><ChevronLeft size={18} /></button>
                        <button onClick={handleToday} className="px-3 py-1 text-xs font-medium text-white hover:bg-white/10 rounded transition-colors">Hoy</button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded text-obsidian-text-muted hover:text-white transition-colors"><ChevronRight size={18} /></button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ObsidianButton variant="outline" size="sm" className="hidden lg:flex">
                        <RefreshCw size={14} className="mr-2" /> Sync
                    </ObsidianButton>
                    <ObsidianButton variant="outline" size="sm">
                        <Filter size={14} className="mr-2" /> Filtrar
                    </ObsidianButton>
                    <ObsidianButton glow size="sm" onClick={() => handleOpenModal()}>
                        <Plus size={16} className="mr-2" /> Nuevo Evento
                    </ObsidianButton>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="text-center text-xs uppercase tracking-widest text-obsidian-text-muted/60 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 bg-[#141418] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    {renderCalendarDays()}
                </div>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                initialDate={selectedDate}
                initialEvent={selectedEvent}
            />
        </div>
    );
};
