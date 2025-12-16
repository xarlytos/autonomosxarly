import React, { useState } from 'react';
import { ObsidianCard, ObsidianButton, ObsidianInput } from './ui/ObsidianElements';
import { User, Edit2, Trash2, Plus, MessageSquare, Save, Copy, CheckCircle, Sparkles } from 'lucide-react';

// --- Types ---
interface Persona {
    id: string;
    name: string;
    role: string;
    tone: string;
    signature: string;
    tags: string[];
}

const INITIAL_PERSONAS: Persona[] = [
    {
        id: '1',
        name: 'Soporte Empático',
        role: 'Atención al Cliente',
        tone: 'Amable, Paciente, Resolutivo',
        signature: 'Atentamente, El equipo de Soporte',
        tags: ['Soporte', 'Email']
    },
    {
        id: '2',
        name: 'Ventas Agresivo',
        role: 'Ejecutivo de Ventas',
        tone: 'Directo, Persuasivo, Urgente',
        signature: '¡No pierdas esta oportunidad!\nJuan Pérez - Sales Manager',
        tags: ['Ventas', 'Outreach']
    },
    {
        id: '3',
        name: 'Comunicación Corporativa',
        role: 'PR Officer',
        tone: 'Formal, Profesional, Conciso',
        signature: 'Saludos cordiales,\nDepartamento de Comunicación',
        tags: ['Oficial', 'Newsletter']
    }
];

const PersonaStudio: React.FC = () => {
    const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Persona>({
        id: '', name: '', role: '', tone: '', signature: '', tags: []
    });

    // Test State
    const [testPrompt, setTestPrompt] = useState('');
    const [testResult, setTestResult] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // --- Handlers ---

    const handleCreateNew = () => {
        const newPersona = {
            id: Date.now().toString(),
            name: 'Nueva Persona',
            role: '',
            tone: '',
            signature: '',
            tags: []
        };
        setFormData(newPersona);
        setSelectedPersona(null);
        setIsEditing(true);
    };

    const handleEdit = (persona: Persona) => {
        setFormData({ ...persona });
        setSelectedPersona(persona);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (selectedPersona) {
            // Update existing
            setPersonas(personas.map(p => p.id === formData.id ? formData : p));
        } else {
            // Create new
            setPersonas([...personas, formData]);
        }
        setIsEditing(false);
        setSelectedPersona(formData);
    };

    const handleDelete = (id: string) => {
        setPersonas(personas.filter(p => p.id !== id));
        if (selectedPersona?.id === id) {
            setSelectedPersona(null);
            setIsEditing(false);
        }
    };

    const handleTestGeneration = () => {
        if (!testPrompt) return;
        setIsGenerating(true);
        // Mock API call
        setTimeout(() => {
            setTestResult(`[Respuesta generada con tono: ${selectedPersona?.tone || formData.tone}]\n\n${testPrompt}\n\nEspero que esto resuelva tu duda. Estamos aquí para ayudarte en lo que necesites.\n\n${selectedPersona?.signature || formData.signature}`);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="w-full h-screen bg-[#0B0B0D] text-obsidian-text-primary flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 px-6 border-b border-white/[0.06] flex items-center justify-between bg-[#0B0B0D]">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-light text-[#F5F5F7] tracking-wider flex items-center gap-2">
                        <User className="text-obsidian-accent" size={24} />
                        PERSONA <span className="text-obsidian-text-muted text-sm font-normal">STUDIO</span>
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-12">

                {/* LEFT SIDEBAR: LIST */}
                <div className="col-span-3 border-r border-white/[0.06] bg-[#0F0F12]/50 flex flex-col">
                    <div className="p-4">
                        <ObsidianButton onClick={handleCreateNew} className="w-full justify-center gap-2">
                            <Plus size={16} /> NUEVA PERSONA
                        </ObsidianButton>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-2 pb-4">
                        {personas.map(p => (
                            <div
                                key={p.id}
                                onClick={() => { setSelectedPersona(p); setIsEditing(false); setTestResult(''); setTestPrompt(''); }}
                                className={`
                            p-3 rounded-lg border cursor-pointer transition-all group
                            ${selectedPersona?.id === p.id
                                        ? 'bg-white/[0.05] border-obsidian-accent/50 shadow-lg'
                                        : 'bg-transparent border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.1]'}
                        `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-medium text-sm ${selectedPersona?.id === p.id ? 'text-white' : 'text-obsidian-text-primary'}`}>
                                        {p.name}
                                    </h3>
                                    {selectedPersona?.id === p.id && <div className="w-2 h-2 rounded-full bg-obsidian-accent mt-1.5" />}
                                </div>
                                <p className="text-xs text-obsidian-text-muted mb-2">{p.role}</p>
                                <div className="flex flex-wrap gap-1">
                                    {p.tags.map(t => (
                                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="col-span-9 p-8 overflow-y-auto bg-[#0B0B0D]">
                    {(selectedPersona || isEditing) ? (
                        <div className="max-w-4xl mx-auto space-y-6">

                            {/* Toolbar */}
                            {!isEditing && (
                                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                                    <div>
                                        <h2 className="text-2xl font-light text-white mb-1">{selectedPersona?.name}</h2>
                                        <p className="text-sm text-obsidian-text-muted">{selectedPersona?.role} • {selectedPersona?.tone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <ObsidianButton variant="secondary" onClick={() => handleEdit(selectedPersona!)} className="flex items-center gap-2">
                                            <Edit2 size={14} /> Editar
                                        </ObsidianButton>
                                        <button
                                            onClick={() => handleDelete(selectedPersona!.id)}
                                            className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isEditing ? (
                                <ObsidianCard className="animate-[fadeIn_0.2s]">
                                    <h3 className="text-sm font-medium text-white tracking-widest mb-6 border-b border-white/[0.06] pb-2">
                                        {selectedPersona?.id ? 'EDITAR PERSONA' : 'CREAR NUEVA PERSONA'}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted">Nombre Interno</label>
                                            <input
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#0B0B0D] border border-white/10 rounded p-2.5 text-sm text-white focus:border-obsidian-accent outline-none"
                                                placeholder="Ej: Soporte V.I.P."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted">Rol / Cargo</label>
                                            <input
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-[#0B0B0D] border border-white/10 rounded p-2.5 text-sm text-white focus:border-obsidian-accent outline-none"
                                                placeholder="Ej: Customer Success Manager"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted">Definición de Tono y Voz</label>
                                        <textarea
                                            value={formData.tone}
                                            onChange={e => setFormData({ ...formData, tone: e.target.value })}
                                            className="w-full bg-[#0B0B0D] border border-white/10 rounded p-2.5 text-sm text-white focus:border-obsidian-accent outline-none h-20 resize-none"
                                            placeholder="Describe cómo debe hablar esta persona (ej: 'Formal pero cercano, usa emojis ocasionalmente, frases cortas...')"
                                        />
                                    </div>

                                    <div className="space-y-2 mb-8">
                                        <label className="text-[10px] uppercase tracking-wider text-obsidian-text-muted">Firma de Correo (Signature)</label>
                                        <textarea
                                            value={formData.signature}
                                            onChange={e => setFormData({ ...formData, signature: e.target.value })}
                                            className="w-full bg-[#0B0B0D] border border-white/10 rounded p-2.5 text-sm text-white focus:border-obsidian-accent outline-none font-mono text-xs h-24"
                                            placeholder="HTML o texto plano para la firma..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-obsidian-text-muted hover:text-white transition-colors">Cancelar</button>
                                        <ObsidianButton onClick={handleSave} className="flex items-center gap-2">
                                            <Save size={16} /> Guardar Cambios
                                        </ObsidianButton>
                                    </div>
                                </ObsidianCard>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* DETAILS VIEW */}
                                    <div className="space-y-6">
                                        <ObsidianCard>
                                            <h3 className="text-xs font-medium text-obsidian-text-muted uppercase tracking-wider mb-4">Configuración de Voz</h3>

                                            <div className="mb-4">
                                                <div className="text-[10px] text-white/40 mb-1 uppercase">Tono</div>
                                                <div className="text-sm text-white p-3 bg-white/[0.03] rounded border border-white/[0.06]">
                                                    {selectedPersona?.tone}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] text-white/40 mb-1 uppercase">Firma</div>
                                                <div className="text-xs text-obsidian-text-muted font-mono p-3 bg-[#050505] rounded border border-white/[0.06] whitespace-pre-wrap">
                                                    {selectedPersona?.signature}
                                                </div>
                                            </div>
                                        </ObsidianCard>
                                    </div>

                                    {/* TEST AREA */}
                                    <div className="space-y-6">
                                        <ObsidianCard className="h-full flex flex-col">
                                            <h3 className="text-xs font-medium text-obsidian-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Sparkles size={14} className="text-obsidian-accent" /> Simulador de Respuesta
                                            </h3>

                                            <div className="flex-1 flex flex-col gap-3">
                                                <textarea
                                                    value={testPrompt}
                                                    onChange={e => setTestPrompt(e.target.value)}
                                                    placeholder="Escribe un mensaje de prueba para ver cómo respondería esta persona..."
                                                    className="w-full bg-[#0B0B0D] border border-white/10 rounded p-3 text-xs text-white focus:border-obsidian-accent outline-none resize-none h-24"
                                                />
                                                <div className="flex justify-end">
                                                    <ObsidianButton
                                                        onClick={handleTestGeneration}
                                                        isLoading={isGenerating}
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <MessageSquare size={14} /> Generar Respuesta
                                                    </ObsidianButton>
                                                </div>

                                                {testResult && (
                                                    <div className="mt-4 p-4 rounded bg-obsidian-accent/10 border border-obsidian-accent/20 animate-[fadeIn_0.3s]">
                                                        <div className="text-[10px] text-obsidian-accent mb-2 uppercase tracking-wider font-bold">Respuesta Generada</div>
                                                        <p className="text-xs text-white/90 whitespace-pre-wrap leading-relaxed">
                                                            {testResult}
                                                        </p>
                                                        <div className="mt-2 flex justify-end">
                                                            <button className="text-[10px] text-obsidian-text-muted hover:text-white flex items-center gap-1 transition-colors">
                                                                <Copy size={10} /> Copiar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ObsidianCard>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-obsidian-text-muted opacity-40">
                            <User size={64} strokeWidth={1} className="mb-4" />
                            <p className="text-lg font-light">Selecciona una persona para editar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonaStudio;
