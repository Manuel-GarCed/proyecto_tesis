import regression from 'regression';

/**
 * Ajusta una regresión lineal Humedad (x) -> Agua (y) y devuelve { m, b }.
 * dailyWater: [{ date, water }]
 * dailyHumidity: [{ date, humidity }]
 */
export function fitHumidityToWater(dailyWater, dailyHumidity) {
  const humMap = Object.fromEntries(
    dailyHumidity.map(h => [h.date, Number(h.humidity)])
  );

  const points = dailyWater
    .map(w => {
      const x = humMap[w.date];
      const y = Number(w.water);
      return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
    })
    .filter(Boolean);

  if (points.length < 2) return { m: NaN, b: NaN };

  const result = regression.linear(points);
  const [m, b] = result.equation; // pendiente e intercepto
  return { m, b };
}