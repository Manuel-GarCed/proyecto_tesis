import regression from 'regression';

/**
 * Dado un array de registros con fecha y valor numérico,
 * devuelve la predicción para el siguiente índice (por ejemplo, siguiente día).
 *
 * @param {Array<{ date: string, value: number }>} data
 * @returns {number} Valor predicho
 */
export function predictNext(data) {
  // 1) Convertimos a pares [índice, valor]
  //    Aquí asumimos que data está ordenado cronológicamente.
  const points = data.map((row, i) => [i, row.value]);

  // 2) Ajustamos la regresión lineal
  const result = regression.linear(points);

  // 3) Pedimos la predicción para el siguiente índice
  //    result.predict(x) → [x, y_pred]
  const nextIndex = points.length;
  const [, yPred] = result.predict(nextIndex);

  return yPred;
}