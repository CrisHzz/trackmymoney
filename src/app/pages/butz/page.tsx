"use client"

import { useState } from "react"
import { MessageCircle, Send, Sparkles, TrendingUp, Squirrel, Target } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  suggestions?: string[];
}

export default function Butz() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "¡Hola! Soy Butz, tu asistente financiero inteligente 🐿️ ¿En qué puedo ayudarte hoy?", sender: "bot", suggestions: ["Planificar mi futuro", "Consejos de ahorro", "Analizar gastos"] },
    { id: 2, content: "Puedo ayudarte a gestionar tus finanzas de manera inteligente.", sender: "bot" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const mockResponses = [
    "¡Excelente pregunta! Te ayudo a crear un plan personalizado para alcanzar tus metas financieras 📈",
    "Basándome en tus hábitos, te recomiendo ahorrar el 20% de tus ingresos mensuales 🎯",
    "He analizado tus gastos y encontré 3 áreas donde puedes optimizar tu presupuesto 💡",
    "¡Perfecto! Vamos a configurar tu primera meta de ahorro. ¿Cuánto quieres ahorrar este mes? 🐿️",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        sender: "bot",
        suggestions: Math.random() > 0.5 ? ["Ver más detalles", "Crear plan", "Siguiente paso"] : undefined,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 p-4 relative">
      <Header />
      
      <AnimatedBackground numberOfElements={8} />
      
      <div className="max-w-4xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Squirrel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Butz
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            Nuestro chat bot de IA Butz te ayudará a planificar tu futuro y a guardar tus bellotas!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/20">
            <div className="p-6 text-center">
              <Target className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Planificación</h3>
              <p className="text-sm text-white/70">Crea metas financieras personalizadas</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/20">
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Análisis</h3>
              <p className="text-sm text-white/70">Analiza tus patrones de gasto</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/20">
            <div className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <h3 className="font-semibold text-white">IA Inteligente</h3>
              <p className="text-sm text-white/70">Consejos personalizados con IA</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[600px] flex flex-col bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20">
          <div className="border-b border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Chat con Butz</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></div>
                En línea
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">
                    {message.sender === "bot" ? (
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                        🐿️
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                        TÚ
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user" 
                          ? "bg-purple-500 text-white" 
                          : "bg-white/20 backdrop-blur-sm text-white border border-white/20"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 text-xs border border-white/30 rounded-md hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    🐿️
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale a Butz sobre tus finanzas..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-white placeholder-white/60 backdrop-blur-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/60 mt-2">Butz puede cometer errores. Verifica información importante.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
