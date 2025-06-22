// src/components/PhChart.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function PhChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">pH</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            type="category"                   // <- le decimos que es categoría
            tickFormatter={t => new Date(t).toLocaleDateString()} 
            angle={-45}                       // <- gira etiquetas 45°
            textAnchor="end"                  // <- ancla el texto para que no se solape
            height={60}   
          />
          <YAxis domain={['auto','auto']} />
          <Tooltip labelFormatter={t => new Date(t).toLocaleString()} />
          <Line type="monotone" dataKey="pH" stroke="#38A169" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}