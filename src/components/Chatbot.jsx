import React, { useState, useRef, useEffect } from 'react';
import { getBotResponse } from '../services/chatbotService';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const scrollRef = useRef(null);

  // Hace scroll automático al final de la conversación
  /*
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    // Añade el mensaje del usuario
    setMessages(ms => [...ms, { from: 'user', text }]);
    setInput('');
    // Obtiene respuesta del bot
    const reply = await getBotResponse(text);
    setMessages(ms => [...ms, { from: 'bot', text: reply }]);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                inline-block px-3 py-2 rounded-lg shadow-sm max-w-xs
                ${m.from === 'user'
                  ? 'bg-cielo text-white'
                  : 'bg-white text-gray-800'}
              `}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input y botón */}
      <div className="p-2 border-t flex">
        <input
          type="text"
          className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:outline-none"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="
            bg-cielo-oscuro text-white px-4 py-2 rounded-r-lg
            hover:bg-cielo transition-colors
          "
        >
          Enviar
        </button>
      </div>
    </div>
  );
}