import React, { useState, useRef, useEffect } from 'react';
import { ObsidianCard, ObsidianButton } from './ui/ObsidianElements';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChartChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy tu asistente de análisis financiero. Puedo ayudarte a interpretar los datos del gráfico. Pregúntame cosas como "¿Cómo ves mis ingresos de aquí a 3 meses?" o "¿Cuál es la tendencia de mis gastos?"',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messages.length > 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('ingreso') || lowerMessage.includes('revenue')) {
            return 'Basándome en los datos del gráfico, tus ingresos muestran una tendencia positiva. En los próximos 3 meses, proyectamos un crecimiento del 15-20% si se mantiene la tasa actual. Los picos que vemos coinciden con períodos de mayor actividad comercial.';
        } else if (lowerMessage.includes('gasto') || lowerMessage.includes('expense')) {
            return 'Los gastos se mantienen relativamente estables con un ligero incremento. Es importante monitorear que no crezcan más rápido que los ingresos. Actualmente, tu margen de beneficio se mantiene saludable.';
        } else if (lowerMessage.includes('beneficio') || lowerMessage.includes('profit')) {
            return 'El beneficio neto muestra una tendencia alcista consistente. La proyección indica que podrías alcanzar un margen de beneficio del 35-40% en el próximo trimestre si continúas con la estrategia actual.';
        } else if (lowerMessage.includes('cliente') || lowerMessage.includes('client')) {
            return 'La adquisición de clientes está en crecimiento. Veo un patrón positivo con aproximadamente 50-60 nuevos clientes proyectados para los próximos 3 meses. Esto se alinea bien con el crecimiento de ingresos.';
        } else if (lowerMessage.includes('tendencia') || lowerMessage.includes('trend')) {
            return 'La tendencia general es muy positiva. Todos los indicadores clave (ingresos, beneficios, clientes) muestran crecimiento sostenido. Te recomendaría mantener esta estrategia y considerar escalar las operaciones.';
        } else if (lowerMessage.includes('roi')) {
            return 'El ROI proyectado es excelente, rondando el 45-50%. Esto indica que tus inversiones están generando retornos sólidos. Considera reinvertir parte de estos beneficios para acelerar el crecimiento.';
        } else {
            return 'Interesante pregunta. Basándome en los datos visualizados, puedo decirte que tus métricas generales son positivas. ¿Te gustaría que profundice en algún aspecto específico como ingresos, gastos, beneficios o clientes?';
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: simulateAIResponse(inputValue),
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <ObsidianCard className="w-full">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <MessageSquare className="text-obsidian-accent" size={20} />
                <div>
                    <h3 className="text-white text-base font-light tracking-wide">
                        Asistente de Análisis IA
                    </h3>
                    <p className="text-[10px] text-obsidian-text-muted uppercase tracking-wider">
                        Pregunta sobre tus datos
                    </p>
                </div>
            </div>

            {/* Messages Container */}
            <div className="h-[400px] overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
                    >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'ai'
                            ? 'bg-obsidian-accent/20 text-obsidian-accent'
                            : 'bg-white/10 text-white'
                            }`}>
                            {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-3 rounded-lg ${message.sender === 'ai'
                                ? 'bg-white/5 text-obsidian-text-primary border border-white/10'
                                : 'bg-obsidian-accent/20 text-white border border-obsidian-accent/30'
                                }`}>
                                <p className="text-sm leading-relaxed">{message.text}</p>
                            </div>
                            <p className="text-[9px] text-obsidian-text-muted mt-1 px-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3 animate-fadeIn">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-obsidian-accent/20 text-obsidian-accent flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-lg">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-obsidian-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-obsidian-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-obsidian-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregunta sobre tus métricas financieras..."
                    className="flex-1 bg-[#16161A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:border-obsidian-accent outline-none transition-colors"
                    disabled={isTyping}
                />
                <ObsidianButton
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4"
                >
                    <Send size={16} />
                </ObsidianButton>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
                {[
                    '¿Cómo ves mis ingresos?',
                    'Analiza la tendencia de gastos',
                    '¿Cuál es mi ROI proyectado?'
                ].map((suggestion, idx) => (
                    <button
                        key={idx}
                        onClick={() => setInputValue(suggestion)}
                        className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-obsidian-text-muted hover:text-white transition-all"
                        disabled={isTyping}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
        </ObsidianCard>
    );
};

export default AIChartChat;
