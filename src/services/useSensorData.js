import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function useSensorData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('/mediciones.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: ({ data: rows }) => {
        const parsed = rows
          .map(r => {
            // 1) Separa día, mes y año de r.fecha
            const [day, month, year] = r.fecha.split('/').map(n => parseInt(n, 10));
            // 2) Separa hora, minuto y segundo de r.hora
            const [hour, minute, second] = r.hora.split(':').map(n => parseInt(n, 10));
            // 3) Crea un Date válido con (año, mes-1, día, hora, minuto, segundo)
            const dt = new Date(year, month - 1, day, hour, minute, second);
            return {
              timestamp: dt.toISOString(),
              temperatura: parseFloat(r.temperatura),
              humedad: parseFloat(r.humedad)*100,
              pH: parseFloat(r.pH),
            };
          })
          // 4) Ordena por timestamp
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(parsed);
      },
      error: err => {
        console.error("Error cargando mediciones.csv:", err);
      }      
    });
  }, []);

  return data;
}