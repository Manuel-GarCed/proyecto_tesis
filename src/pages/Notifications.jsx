import React, { useState } from 'react';
import {
  notifications as initialNotifications,
  recommendations as initialRecommendations
} from '../data/alerts';
import Modal from '../components/Modal';

export default function NotificationsPage() {
  // 1) Estado local para recomendaciones
  const [recs, setRecs] = useState(
    initialRecommendations.map(r => ({ ...r, completed: false }))
  );
  // 2) Qué recomendación estamos confirmando
  const [confirmRecId, setConfirmRecId] = useState(null);

  // 3) Solo las pendientes
  const pendingRecs = recs.filter(r => !r.completed);

  // 4) Notificaciones con al menos una rec pendiente
  const visibleNotifications = initialNotifications.filter(n =>
    pendingRecs.some(r => r.notificationId === n.id)
  );

  // 5) Marca completada y cierra modal
  const completeRec = id => {
    setRecs(rs =>
      rs.map(r => (r.id === id ? { ...r, completed: true } : r))
    );
    setConfirmRecId(null);
  };

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-3xl font-bold">Notificaciones y Recomendaciones</h1>

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Notificaciones --- */}
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

        {/* --- Recomendaciones --- */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
          {pendingRecs.length === 0 ? (
            <p className="text-gray-500">No hay recomendaciones pendientes</p>
          ) : (
            <ul className="space-y-3">
              {pendingRecs.map(r => {
                const note = initialNotifications.find(n => n.id === r.notificationId);
                return (
                  <li key={r.id} className="border-l-4 border-verde-suave-oscuro pl-3">
                    <div className="text-sm text-gray-500">
                      Para: {note?.message}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{r.action}</span>
                      <button
                        onClick={() => setConfirmRecId(r.id)}
                        className="ml-4 text-sm text-white bg-verde-suave hover:bg-verde-suave-oscuro px-3 py-1 rounded transition"
                      >
                        Completada
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* --- Chatbot placeholder --- */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Asistente del Huerto</h2>
        <p className="text-gray-500">[Aquí irá el chat]</p>
      </div>

      {/* --- Modal de confirmación --- */}
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
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => completeRec(confirmRecId)}
            className="px-4 py-2 rounded bg-verde-suave text-white hover:bg-verde-suave-oscuro transition"
          >
            Completar
          </button>
        </div>
      </Modal>
    </div>
  );
}