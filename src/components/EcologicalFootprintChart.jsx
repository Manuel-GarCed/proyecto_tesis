import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function EcologicalFootprintChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
        Cargando huella ecológica…
      </div>
    );
  }

  // 1) Calculamos totales en ha y convertimos a m²
  const totalHaAntes = data.reduce((sum, row) => sum + (row.Antes || 0), 0);
  const totalHaDesp  = data.reduce((sum, row) => sum + (row['Después'] || 0), 0);
  const m2Antes      = totalHaAntes * 10000;
  const m2Desp       = totalHaDesp  * 10000;

  // 2) Creamos un único punto con dos series
  const chartData = [{
    categoria: 'Comparación',
    Antes:      m2Antes,
    Después:    m2Desp
  }];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">
        Comparación de Huella Ecológica (m² totales)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={0}
          barCategoryGap="0%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="categoria"
            tick={{ fontSize: 14 }}
          />
          <YAxis
            domain={[48.60, 48.82]}
            label={{ value: 'm²', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={value => value.toFixed(6) + ' m²'} 
            cursor={{ fill: 'rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="top" />

          {/* Dos series dibujadas bajo la misma categoría */}
          <Bar 
            dataKey="Antes" 
            name="Antes" 
            barSize={80}
            fill="#16697A" 
          />
          <Bar 
            dataKey="Después" 
            name="Después" 
            barSize={80}
            fill="#FFA62B" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}