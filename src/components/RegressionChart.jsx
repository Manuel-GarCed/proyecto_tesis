import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function RegressionChart({ record, allRecords }) {
  // 1) Ordenamos por fecha ascendente
  const sorted = useMemo(() =>
    [...allRecords].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    ),
    [allRecords]
  );

  // 2) Creamos vectores x (0,1,2,...), y (agua)
  const n = sorted.length;
  const xs = sorted.map((r,i) => i);
  const ys = sorted.map(r => r.water);

  // 3) Calculamos media, pendiente e intercepto
  const meanX = xs.reduce((s,v) => s+v, 0) / n;
  const meanY = ys.reduce((s,v) => s+v, 0) / n;
  const num = xs.reduce((s,x,i) => s + (x - meanX)*(ys[i] - meanY), 0);
  const den = xs.reduce((s,x) => s + (x - meanX)**2, 0);
  const slope = den === 0 ? 0 : num/den;
  const intercept = meanY - slope*meanX;

  // 4) Predicción para el siguiente día (índice n)
  const predictedY = intercept + slope * n;
  // fecha siguiente
  const nextDate = (() => {
    const d = new Date(sorted[n-1].date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0,10);
  })();

  // 5) Datos para el gráfico: puntos reales + punto predicho
  const data = sorted.map((r,i) => ({
    index: i,
    date: r.date,
    water: r.water
  })).concat({
    index: n,
    date: nextDate,
    water: predictedY
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={40}
          />
          <YAxis
            label={{ value: 'Agua (L)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={d => `Fecha: ${d}`}
            formatter={v => v.toFixed(2) + ' L'}
          />
          <Line
            type="monotone"
            dataKey="water"
            stroke="#8884d8"
            dot={props => {
              const { payload, cx, cy } = props;
              // si es el último punto (predicho), dibujamos en verde y más grande
              if (payload.index === n) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="green"
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }
              // puntos reales
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill="#8884d8"
                />
              );
            }}
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}