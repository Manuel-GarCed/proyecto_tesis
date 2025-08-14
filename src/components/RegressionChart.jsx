import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function RegressionChart({
  allRecords,
  dailyHumidity,
  predictedRecord
}) {
  // 1) Agua total por día
  const dailyWater = useMemo(() => {
    const map = {};
    allRecords.forEach(r => {
      map[r.date] = (map[r.date] || 0) + Number(r.water);
    });
    return Object.entries(map).map(([date, water]) => ({ date, water }));
  }, [allRecords]);

  // 2) Fusionar por fecha (Humedad vs Agua)
  const scatterData = useMemo(() => {
    const humMap = Object.fromEntries(
      dailyHumidity.map(h => [h.date, Number(h.humidity)]) // ← asegura número
    );

    const pts = dailyWater
      .map(w => {
        const x = humMap[w.date];
        const y = Number(w.water);
        return Number.isFinite(x) && Number.isFinite(y)
          ? { x, y, date: w.date }
          : null;
      })
      .filter(Boolean);

    // Inserta o reemplaza el punto predicho (si existe)
    if (predictedRecord) {
      const idx = pts.findIndex(p => p.date === predictedRecord.date);
      const point = {
        x: humMap[predictedRecord.date] ?? pts[pts.length - 1]?.x,
        y: Number(predictedRecord.water),
        date: predictedRecord.date,
        predicted: true
      };
      if (idx >= 0) pts[idx] = point;
      else pts.push(point);
    }

    return pts;
  }, [dailyWater, dailyHumidity, predictedRecord]);

  // 3) Calcular m, b (o usar predMeta si viene)
  const { m, b } = useMemo(() => {
    if (
      predictedRecord?.predMeta &&
      Number.isFinite(predictedRecord.predMeta.m) &&
      Number.isFinite(predictedRecord.predMeta.b)
    ) {
      return {
        m: Number(predictedRecord.predMeta.m),
        b: Number(predictedRecord.predMeta.b)
      };
    }

    if (scatterData.length < 2) return { m: NaN, b: NaN };

    const n = scatterData.length;
    const sumX = scatterData.reduce((acc, p) => acc + p.x, 0);
    const sumY = scatterData.reduce((acc, p) => acc + p.y, 0);
    const sumXX = scatterData.reduce((acc, p) => acc + p.x * p.x, 0);
    const sumXY = scatterData.reduce((acc, p) => acc + p.x * p.y, 0);

    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return { m: NaN, b: NaN };

    const mCalc = (n * sumXY - sumX * sumY) / denom;
    const bCalc = (sumY - mCalc * sumX) / n;
    return { m: mCalc, b: bCalc };
  }, [scatterData, predictedRecord]);

  // 4) Línea de regresión (solo si hay suficientes puntos y m/b finitos)
  const lineData = useMemo(() => {
    if (!Number.isFinite(m) || !Number.isFinite(b) || scatterData.length < 2) {
      return [];
    }
    const xs = scatterData.map(p => p.x).sort((a, z) => a - z);
    return [
      { x: xs[0],           y: m * xs[0]           + b },
      { x: xs[xs.length-1], y: m * xs[xs.length-1] + b }
    ];
  }, [m, b, scatterData]);

  // 5) Render
  if (!scatterData.length) {
    return (
      <div className="p-4 text-sm text-gray-600">
        No hay datos suficientes para graficar la regresión.
      </div>
    );
  }

  // Set de ids predichos (persistido opcionalmente en localStorage)
  const [predictedIds, setPredictedIds] = useState(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('predictedIds') || '[]');
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  const addPredictedId = (id) => {
    setPredictedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('predictedIds', JSON.stringify([...next]));
      return next;
    });
  };

  const removePredictedId = (id) => {
    setPredictedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem('predictedIds', JSON.stringify([...next]));
      return next;
    });
  };


  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={scatterData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="x"
          name="Humedad diaria"
          unit="%"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={v => `${Number(v).toFixed(0)}%`}
        />

        <YAxis
          dataKey="y"
          name="Agua consumida"
          unit="L"
          type="number"
          domain={[dataMin => dataMin * 0.8, dataMax => dataMax * 1.2]}  // ← fix
          tickFormatter={v => Number(v).toFixed(0)}
        />

        <Tooltip
          labelFormatter={x => `Humedad: ${Number(x).toFixed(2)}%`}
          formatter={(value, name) => [`${Number(value).toFixed(2)} L`, name]}
        />

        {/* Puntos reales (y predicho si está insertado) */}
        <Scatter name="Datos reales" data={scatterData} fill="#489fb5" shape="circle" />

        {/* Recta de regresión (si existe) */}
        <Line type="linear" name="Regresión" data={lineData} dataKey="y" stroke="#ffa62b" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}