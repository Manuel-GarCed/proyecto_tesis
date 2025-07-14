import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

export default function RegressionChart({
  allRecords,
  dailyHumidity,
  predictedRecord
}) {
  // 1) Agrupamos allRecords para obtener agua total por día
  const dailyWater = useMemo(() => {
    const map = {}
    allRecords.forEach(r => {
      map[r.date] = (map[r.date] || 0) + Number(r.water)
    })
    return Object.entries(map).map(([date, water]) => ({ date, water }))
  }, [allRecords])

  // 2) Fusionamos por fecha: coincidencias en humidity y water
  const scatterData = useMemo(() => {
    // mapa fecha → humedad
    const humMap = Object.fromEntries(
      dailyHumidity.map(h => [h.date, h.humidity])
    )

    // sólo fechas con ambos valores
    const pts = dailyWater
      .map(w => {
        const h = humMap[w.date]
        return h != null
          ? { x: h, y: w.water, date: w.date }
          : null
      })
      .filter(p => p)

    // SI además tienes un predictedRecord explícito,
    // lo insertamos o reemplazamos su fecha
    if (predictedRecord) {
      const idx = pts.findIndex(p => p.date === predictedRecord.date)
      const point = {
        x: humMap[predictedRecord.date] ?? pts[pts.length - 1]?.x,
        y: Number(predictedRecord.water),
        date: predictedRecord.date,
        predicted: true
      }
      if (idx >= 0) pts[idx] = point
      else pts.push(point)
    }

    return pts
  }, [dailyWater, dailyHumidity, predictedRecord])

  if (!scatterData.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay datos de humedad + agua para trazar…
      </div>
    )
  }

  // 3) Calculamos regresión lineal sobre scatterData
  const n     = scatterData.length
  const sumX  = scatterData.reduce((s, p) => s + p.x, 0)
  const sumY  = scatterData.reduce((s, p) => s + p.y, 0)
  const sumXY = scatterData.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = scatterData.reduce((s, p) => s + p.x * p.x, 0)
  const m     = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const b     = (sumY - m * sumX) / n

  // 4) Definimos la línea usando mínimo y máximo de X
  const xs = scatterData.map(p => p.x).sort((a,z) => a - z)
  const lineData = [
    { x: xs[0],            y: m * xs[0]            + b },
    { x: xs[xs.length-1],  y: m * xs[xs.length-1]  + b }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={scatterData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="x"
          name="Humedad diaria"
          unit="%"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={v => `${v.toFixed(0)}%`}
        />

        <YAxis
          dataKey="y"
          name="Agua consumida"
          unit="L"
          type="number"
          domain={['dataMin'*0.8, 'dataMax'*1.2]}
          tickFormatter={v => v.toFixed(0)}
        />

        <Tooltip
          labelFormatter={dateX => `Humedad: ${dateX.toFixed(2)}%`}
          formatter={(value, name) => [`${value.toFixed(2)} L`, name]}
        />

        {/* puntos reales */}
        <Scatter
          name="Datos reales"
          data={scatterData}
          fill="#489fb5"
          shape="circle"
        />

        {/* recta de regresión */}
        <Line
          type="linear"
          name="Regresión"
          data={lineData}
          dataKey="y"
          stroke="#ffa62b"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}