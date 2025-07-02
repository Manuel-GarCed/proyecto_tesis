// Placeholder de ejemplo de Notificaciones disparadas por los sensores
export const notifications = [
  {
    id: 1,
    timestamp: '2025-07-02T09:15:00Z',
    type: 'temperatura',
    message: 'La temperatura superó los 30 °C',
  },
  {
    id: 2,
    timestamp: '2025-07-02T11:40:00Z',
    type: 'humedad',
    message: 'Humedad por debajo del 40 %',
  },
    {
    id: 3,
    timestamp: '2025-07-02T15:15:00Z',
    type: 'ph',
    message: 'ph en niveles menores a 6',
  },
  {
    id: 4,
    timestamp: '2025-07-02T16:40:00Z',
    type: 'humedad',
    message: 'Humedad por debajo del 25 %',
  },
  // …
];

// Recomendaciones asociadas
export const recommendations = [
  {
    id: 1,
    notificationId: 1,
    action: 'Incrementar el riego en 10 min cada 2 horas',
  },
  {
    id: 2,
    notificationId: 2,
    action: 'Programar nebulización ligera',
  },
    {
    id: 3,
    notificationId: 3,
    action: 'Incrementar el riego en 10 min cada 5 horas',
  },
  {
    id: 4,
    notificationId: 3,
    action: 'Programar abonado de 5gr',
  },
  // …
];