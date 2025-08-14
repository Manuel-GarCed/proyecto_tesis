import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

/**
 * Fuente del CSV (Azure Blob o local).
 * - Puedes configurar Vite: VITE_CSV_URL="https://.../telemetria.csv[?sas]"
 * - Si no hay env var, se usa el blob público por defecto.
 */
const DEFAULT_AZURE_URL = 'https://tesisstorageiot.blob.core.windows.net/datos-iot/csv/telemetria.csv?sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-08-30T11:31:59Z&st=2025-08-14T03:16:59Z&spr=https&sig=3FSI1QwEVfAE9RZfk3kA3%2F3v9aHEmrx%2Fx9pTSg1iB5c%3D';
const CSV_URL =
  (import.meta?.env?.VITE_CSV_URL && String(import.meta.env.VITE_CSV_URL).trim()) ||
  DEFAULT_AZURE_URL;

/**
 * Hook para cargar datos de sensores desde un CSV remoto (Azure Blob) o local.
 * Retorna un arreglo de objetos: { timestamp, temperatura, humedad, pH }
 */
export default function useSensorData() {
  const [data, setData] = useState([]);

  // Evita caché agresiva del navegador/CDN añadiendo un query param único.
  const urlWithBust = useMemo(() => {
    const sep = CSV_URL.includes('?') ? '&' : '?';
    return `${CSV_URL}${sep}_=${Date.now()}`;
  }, []);

  // Utilidad numérica robusta (acepta comas decimales)
  const toNumber = (v) => {
    if (v === undefined || v === null) return NaN;
    if (typeof v === 'number') return v;
    const s = String(v).trim().replace(',', '.');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
    };

  // Parseo de una fila con tolerancia a cabeceras comunes
  const parseRow = (r) => {
    const f = (r.fecha ?? r.Fecha ?? r.FECHA ?? '').trim();
    const h = (r.hora ?? r.Hora ?? r.HORA ?? '').trim();
    if (!f || !h) return null;

    // Soporta DD/MM/YYYY o DD-MM-YYYY
    const [day, month, year] = f.split(/[\/\-]/).map((x) => parseInt(x, 10));
    const [hour, minute, second] = h.split(':').map((x) => parseInt(x, 10));
    if (![day, month, year, hour, minute].every(Number.isFinite)) return null;

    const dt = new Date(year, (month ?? 1) - 1, day, hour, minute, second || 0);

    const temp = toNumber(r.temperatura ?? r.Temperatura ?? r.temperature ?? r.Temperature);
    let hum = toNumber(r.humedad ?? r.Humedad ?? r.humidity ?? r.Humidity);
    const ph = toNumber(r.pH ?? r.ph ?? r.PH ?? r.Ph);

    // Si humedad viene normalizada (0-1), escalar a 0-100
    if (Number.isFinite(hum) && hum <= 1) hum = hum * 100;

    if (!Number.isFinite(temp) || !Number.isFinite(hum) || !Number.isFinite(ph)) return null;

    return {
      timestamp: dt.toISOString(),
      temperatura: temp,
      humedad: hum,
      pH: ph,
    };
  };

  useEffect(() => {
    Papa.parse(urlWithBust, {
      download: true,
      header: true,
      dynamicTyping: false, // parseamos manualmente para mayor control
      skipEmptyLines: true,
      complete: ({ data: rows }) => {
        const parsed = rows
          .map(parseRow)
          .filter(Boolean)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(parsed);
      },
      error: (err) => {
        console.error('Error cargando telemetria CSV:', err);
      },
    });
    // Solo en montaje (la URL ya incluye bust para una carga fresca)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}