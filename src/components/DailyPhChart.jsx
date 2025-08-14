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

export default function DailyPhChart({ data = [] }) {
  const daily = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const map = {};

    data.forEach(row => {
      const dt = new Date(row.timestamp);
      if (isNaN(dt)) return;

      const key = [
        dt.getFullYear(),
        String(dt.getMonth() + 1).padStart(2, '0'),
        String(dt.getDate()).padStart(2, '0'),
      ].join('-');

      if (!map[key]) map[key] = { date: key, sum: 0, count: 0 };
      map[key].sum   += Number(row.pH);
      map[key].count += 1;
    });

    return Object.values(map)
      .map(({ date, sum, count }) => ({
        date,
        ph: count > 0 ? sum / count : 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  if (daily.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
        Cargando pH diario…
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">
        pH Diario Promedio
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={daily}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={false}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            tickFormatter={value => value.toFixed(2)}
            label={{
                value: 'pH',
                angle: -90,
                position: 'insideLeft',
                style: {
                fontWeight: 'bold',
                fontSize: '14px',
                fill: '#333'
                }
            }}
          />
          <Tooltip
            labelFormatter={iso => `Fecha: ${iso}`}
            formatter={val => val.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey="ph"
            stroke="#2A9D8F"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}