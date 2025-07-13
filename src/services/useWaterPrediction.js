import regression from 'regression';
import useDailyRecords from './useDailyRecords';

export default function useWaterPrediction() {
  const records = useDailyRecords();
  if (records.length < 2) return null;

  // 1) convertimos a pares [índice, valor]
  const points = records.map((r, i) => [i, Number(r.water)]);

  // 2) ajustamos línea
  const result = regression.linear(points);

  // 3) calculamos predicción para el siguiente índice
  const [, yPred] = result.predict(points.length);

  return Number(yPred.toFixed(2));
}