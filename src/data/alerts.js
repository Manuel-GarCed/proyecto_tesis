// Placeholder de ejemplo de Notificaciones disparadas por los sensores
export const notifications = [
  {
    id: 1,
    timestamp: '2025-07-02T09:15:00Z',
    type: 'temperatura',
    message: 'La temperatura superó los 35 °C, nivel crítico para los cultivos.',
  },
  {
    id: 2,
    timestamp: '2025-07-02T11:40:00Z',
    type: 'humedad',
    message: 'La humedad descendió por debajo del límite mínimo recomendado (menor al 60 %).',
  },
  {
    id: 3,
    timestamp: '2025-07-02T15:15:00Z',
    type: 'ph',
    message: 'El pH se encuentra en niveles demasiado ácidos (menor a 5.5).',
  },
  {
    id: 4,
    timestamp: '2025-07-02T16:40:00Z',
    type: 'temperatura',
    message: 'La temperatura descendió por debajo del rango ideal (menor a 25 °C).',
  },
  {
    id: 5,
    timestamp: '2025-07-02T17:50:00Z',
    type: 'humedad',
    message: 'La humedad superó el límite máximo recomendado (más del 80 %). Riesgo de hongos.',
  },
];

export const recommendations = [
  {
    id: 1,
    notificationId: 1,
    action: 'Aumentar frecuencia de riego con sesiones breves (10 minutos cada 2 horas) para reducir estrés térmico en las plantas.',
  },
  {
    id: 2,
    notificationId: 2,
    action: 'Activar el sistema de nebulización ligera hasta alcanzar niveles ideales de humedad (60-80 %).',
  },
  {
    id: 3,
    notificationId: 3,
    action: 'Aplicar cal agrícola al suelo (aprox. 10 gramos por m²) para neutralizar la acidez y elevar el pH al rango ideal.',
  },
  {
    id: 4,
    notificationId: 4,
    action: 'Utilizar cobertura vegetal o mantas térmicas para mantener la temperatura del suelo por encima de 25 °C.',
  },
  {
    id: 5,
    notificationId: 5,
    action: 'Reducir el riego temporalmente y mejorar ventilación del área para disminuir la humedad y prevenir la aparición de enfermedades fúngicas.',
  },
];