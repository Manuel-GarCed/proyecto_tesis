import React from 'react';
import {
  notifications,
  recommendations
} from '../data/alerts';

export default function Notifications() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Notificaciones y Recomendaciones</h1>
      
      {/* Sección principal en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1) Notificaciones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
          <ul className="space-y-3">
            {notifications.map(n => (
              <li key={n.id} className="border-l-4 border-red-400 pl-3">
                <div className="text-sm text-gray-500">
                  {new Date(n.timestamp).toLocaleString()}
                </div>
                <div className="text-gray-800">{n.message}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* 2) Recomendaciones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
          <ul className="space-y-3">
            {recommendations.map(r => {
              const note = notifications.find(n => n.id === r.notificationId);
              return (
                <li key={r.id} className="border-l-4 border-green-400 pl-3">
                  <div className="text-sm text-gray-500">
                    Para: {note?.message}
                  </div>
                  <div className="text-gray-800">{r.action}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 3) Chatbot NLP */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Asistente del Huerto</h2>
        {/* placeholder */}
        <div className="text-gray-500">[Aquí irá el chat]</div>
      </div>
    </div>
  );
}