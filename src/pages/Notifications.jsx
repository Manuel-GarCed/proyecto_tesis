import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  notifications as initialNotifications,
  recommendations as initialRecommendations
} from '../data/alerts';
import Modal from '../components/Modal';
import Chatbot from '../components/Chatbot';

export default function Notifications() {
  const location = useLocation();

  // 1) Estado de recomendaciones (añadimos campo completed)
  const [recs, setRecs] = useState(
    initialRecommendations.map(r => ({ ...r, completed: false }))
  );
  const [confirmRecId, setConfirmRecId] = useState(null);

  // 2) ID de rec a resaltar
  const [highlightId, setHighlightId] = useState(null);

  // 3) Al montar o cambiar query ?highlight=...
  useEffect(() => {
    const h = new URLSearchParams(location.search).get('highlight');
    if (h) {
      const id = Number(h);
      setHighlightId(id);               // activa fade-in
      // tras 1s, quitamos el highlight (fade-out)
      const t = setTimeout(() => setHighlightId(null), 1000);
      return () => clearTimeout(t);
    }
  }, [location.search]);

  // 4) Filtramos las recs pendientes
  const pendingRecs = recs.filter(r => !r.completed);

  // 5) Qué notificaciones mostrar
  const visibleNotifications = initialNotifications.filter(n =>
    pendingRecs.some(r => r.notificationId === n.id)
  );

  // 6) Marcar completada
  const completeRec = id => {
    setRecs(rs =>
      rs.map(r => (r.id === id ? { ...r, completed: true } : r))
    );
    setConfirmRecId(null);
  };

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-3xl font-bold">Notificaciones y Recomendaciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notificaciones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
          {visibleNotifications.length === 0 ? (
            <p className="text-gray-500">Todas las notificaciones atendidas</p>
          ) : (
            <ul className="space-y-3">
              {visibleNotifications.map(n => (
                <li key={n.id} className="border-l-4 border-red-400 pl-3">
                  <div className="text-sm text-gray-500">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                  <div className="text-gray-800">{n.message}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recomendaciones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
          {pendingRecs.length === 0 ? (
            <p className="text-gray-500">No hay recomendaciones pendientes</p>
          ) : (
            <ul className="space-y-3">
              {pendingRecs.map(r => {
                const note = initialNotifications.find(n => n.id === r.notificationId);
                const isHighlighted = r.id === highlightId;

                return (
                  <li
                    className={`
                      border-l-4 border-verde-suave-oscuro pl-3
                      transition-opacity duration-500 ease-in-out
                      ${isHighlighted
                        ? 'bg-amarillo-concreto bg-opacity-100'
                        : 'bg-transparent hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-sm text-gray-500">
                      Para: {note?.message}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{r.action}</span>
                      <button
                        onClick={() => setConfirmRecId(r.id)}
                        className="
                          ml-4 text-sm text-white bg-verde-suave
                          hover:bg-verde-suave-oscuro px-3 py-1 rounded
                          transition cursor-pointer
                        "
                      >
                        Completar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <div className="h-96">
        <Chatbot />
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={confirmRecId !== null}
        onClose={() => setConfirmRecId(null)}
      >
        <h3 className="text-lg font-semibold mb-4">
          ¿Estás seguro que quieres marcar como completada esta recomendación?
        </h3>
        <p className="text-gray-600 mb-6">
          Esta acción no puede deshacerse.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setConfirmRecId(null)}
            className="
              px-4 py-2 rounded bg-gray-200
              hover:bg-gray-300 transition cursor-pointer
            "
          >
            Cancelar
          </button>
          <button
            onClick={() => completeRec(confirmRecId)}
            className="
              px-4 py-2 rounded bg-verde-suave text-white
              hover:bg-verde-suave-oscuro transition cursor-pointer
            "
          >
            Completar
          </button>
        </div>
      </Modal>
    </div>
  );
}