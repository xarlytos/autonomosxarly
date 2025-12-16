import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlignLeft, Link, Check, Globe, Mail, Trash2 } from 'lucide-react';
import { ObsidianButton, ObsidianInput } from '../ui/ObsidianElements';
import { CalendarEvent, Contact } from '../../types';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'>) => void;
    onDelete?: () => void;
    initialDate?: Date;
    initialContact?: Contact;
    initialEvent?: CalendarEvent;
}

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialDate,
    initialContact,
    initialEvent
}) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<CalendarEvent['type']>('MEETING');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [description, setDescription] = useState('');
    const [syncPlatform, setSyncPlatform] = useState<'NONE' | 'GOOGLE' | 'OUTLOOK'>('NONE');

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                // Edit Mode
                setTitle(initialEvent.title);
                setType(initialEvent.type);
                setDescription(initialEvent.description || '');
                setSyncPlatform(
                    (initialEvent.platform === 'GOOGLE' || initialEvent.platform === 'OUTLOOK')
                        ? initialEvent.platform
                        : 'NONE'
                );

                const start = new Date(initialEvent.start);
                const end = new Date(initialEvent.end);

                // Set date using local time
                const year = start.getFullYear();
                const month = String(start.getMonth() + 1).padStart(2, '0');
                const day = String(start.getDate()).padStart(2, '0');
                setDate(`${year}-${month}-${day}`);

                // Set times
                setStartTime(start.toTimeString().slice(0, 5));
                setEndTime(end.toTimeString().slice(0, 5));

            } else {
                // Create Mode
                const d = initialDate || new Date();
                // Manually format to YYYY-MM-DD using local time to avoid UTC shift issues
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                setDate(`${year}-${month}-${day}`);

                if (initialContact) {
                    setTitle(`Reunión con ${initialContact.name}`);
                    setDescription(`Contexto: ${initialContact.role} en ${initialContact.company}.`);
                } else {
                    setTitle('');
                    setDescription('');
                }

                // Defaults
                setStartTime('09:00');
                setEndTime('10:00');
                setType('MEETING');
                setSyncPlatform('NONE');
            }
        }
    }, [isOpen, initialDate, initialContact, initialEvent]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!title || !date) return;

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        onSave({
            title,
            type,
            start: start.toISOString(),
            end: end.toISOString(),
            description,
            status: 'PENDING',
            platform: syncPlatform !== 'NONE' ? syncPlatform : undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-obsidian-accent/5 to-transparent">
                    <h2 className="text-lg font-light text-white tracking-wide flex items-center gap-2">
                        <Calendar size={18} className="text-obsidian-accent" />
                        {initialEvent ? 'Editar Evento' : 'Nuevo Evento'}
                    </h2>
                    <button onClick={onClose} className="text-obsidian-text-muted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    <ObsidianInput
                        label="Título del Evento"
                        placeholder="Ej. Demo de Producto"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted font-medium">Tipo</label>
                            <div className="flex bg-[#1A1A1E] rounded-lg p-1 border border-white/5">
                                {(['MEETING', 'CALL', 'TASK'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-1.5 text-xs rounded-md transition-all ${type === t ? 'bg-white/10 text-white shadow-sm' : 'text-obsidian-text-muted hover:text-white'}`}
                                    >
                                        {t === 'MEETING' ? 'Reunión' : t === 'CALL' ? 'Llamada' : 'Tarea'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ObsidianInput
                            label="Fecha"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ObsidianInput
                            label="Hora Inicio"
                            type="time"
                            icon={<Clock size={14} />}
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                        <ObsidianInput
                            label="Hora Fin"
                            type="time"
                            icon={<Clock size={14} />}
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted font-medium ml-1">Descripción / Notas</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3 text-obsidian-text-muted/50">
                                <AlignLeft size={14} />
                            </div>
                            <textarea
                                className="w-full bg-[#0B0B0D]/50 border border-white/[0.08] rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-obsidian-text-muted/30 outline-none focus:border-obsidian-accent/50 focus:bg-[#111114] transition-all min-h-[100px]"
                                placeholder="Detalles adicionales..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sync Options */}
                    <div className="pt-2 border-t border-white/5">
                        <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted font-medium mb-3 block">Sincronizar con</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSyncPlatform(syncPlatform === 'GOOGLE' ? 'NONE' : 'GOOGLE')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${syncPlatform === 'GOOGLE' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-obsidian-text-muted hover:border-white/10'}`}
                            >
                                <Globe size={14} /> Google Calendar
                                {syncPlatform === 'GOOGLE' && <Check size={12} />}
                            </button>
                            <button
                                onClick={() => setSyncPlatform(syncPlatform === 'OUTLOOK' ? 'NONE' : 'OUTLOOK')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${syncPlatform === 'OUTLOOK' ? 'bg-blue-400/10 border-blue-400 text-blue-300' : 'bg-white/5 border-transparent text-obsidian-text-muted hover:border-white/10'}`}
                            >
                                <Mail size={14} /> Outlook
                                {syncPlatform === 'OUTLOOK' && <Check size={12} />}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 bg-[#141418] border-t border-white/5 flex justify-between gap-3">
                    {initialEvent && onDelete ? (
                        <ObsidianButton variant="secondary" onClick={onDelete} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 size={16} className="mr-2" /> Eliminar
                        </ObsidianButton>
                    ) : <div></div>}

                    <div className="flex gap-3">
                        <ObsidianButton variant="secondary" onClick={onClose}>Cancelar</ObsidianButton>
                        <ObsidianButton glow onClick={handleSubmit}>
                            {initialEvent ? 'Actualizar' : 'Guardar Evento'}
                        </ObsidianButton>
                    </div>
                </div>

            </div>
        </div>
    );
};
