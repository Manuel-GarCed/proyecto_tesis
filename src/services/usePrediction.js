import useSensorData from './useSensorData';
import { predictNext } from './regressionService';

export default function useWaterPrediction() {
  const data = useSensorData(); // ya trae { date, water, ... }
  // Filtramos y mapeamos sólo la serie de agua
  const series = data.map(d => ({
    date: d.date,
    value: d.water
  }));
  const next = predictNext(series);
  return Number(next.toFixed(2));
}