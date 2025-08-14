import React, { useState, useRef, useMemo } from 'react';
import { getBotResponse } from '../services/chatbotService'; // <- usa el nuevo módulo

// Si quieres que entienda "explica la recomendación #3"
const ctx = {
  recommendations: [
    { id: 1, text: 'Aumentar frecuencia de riego con sesiones breves (10 minutos cada 2 horas).' },
    { id: 2, text: 'Activar el sistema de nebulización ligera hasta alcanzar niveles ideales de humedad (60–80%).' },
    { id: 3, text: 'Aplicar cal agrícola al suelo (aprox. 10 g/m²) para elevar el pH al rango ideal.' },
    { id: 4, text: 'Utilizar cobertura vegetal o mantas térmicas para mantener la temperatura por encima de 25 °C.' },
    { id: 5, text: 'Reducir el riego temporalmente y mejorar ventilación para disminuir la humedad y prevenir hongos.' },
  ]
};

// Ejemplos:
await getBotResponse('¿Qué hago con la humedad alta?');           // → guía reducir_riego_y_ventilar
await getBotResponse('Cómo aplicar cal agrícola');                // → guía cal_agricola_subir_ph
await getBotResponse('muéstrame la recomendación #2', ctx);      // → guía nebulizacion_ligera
await getBotResponse('temas de recomendaciones');                 // → lista de guías


export default function Chatbot({ recommendations = [], completeRecommendation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const scrollRef = useRef(null);

  // Construimos el contexto que entiende el bot (solo recomendaciones)
  const ctx = useMemo(() => ({
    recommendations: recommendations.map(r => ({ id: r.id, text: r.action })),
    completeRecommendation, // opcional: si luego quieres “completar #id” desde el chat
  }), [recommendations, completeRecommendation]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(ms => [...ms, { from: 'user', text }]);
    setInput('');

    const reply = await getBotResponse(text, ctx); // <- aquí pasamos el ctx
    setMessages(ms => [...ms, { from: 'bot', text: reply }]);

    requestAnimationFrame(() =>
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    );
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      {/* Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-line ${
                m.from === 'user'
                  ? 'bg-cielo-oscuro text-white'
                  : 'bg-white border'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t flex">
        <input
          type="text"
          className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:outline-none"
          placeholder="Pregúntame sobre recomendaciones…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-cielo-oscuro text-white px-4 py-2 rounded-r-lg hover:bg-cielo transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}