import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function VariationIndicator({ data }) {
  // 1) Calculamos las sumas igual que en el chart
  const totalHaAntes = data.reduce((sum, row) => sum + (row.Antes || 0), 0);
  const totalHaDesp  = data.reduce((sum, row) => sum + (row['Después'] || 0), 0);
  const m2Antes      = totalHaAntes * 10000;
  const m2Desp       = totalHaDesp  * 10000;

  // 2) Cálculo de diferencia y porcentaje
  const diff = m2Desp - m2Antes;
  const pct  = totalHaAntes === 0 
    ? 0 
    : (diff / (totalHaAntes * 10000)) * 100;
  const isIncrease = diff >= 0;

  // 3) Formato de porcentaje con signo
  const pctText = `${Math.abs(pct).toFixed(2)}%`;

  return (
    <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center">
      <div className="flex items-center">
        {isIncrease 
          ? <FaArrowUp className="text-red-500" size={24}/>
          : <FaArrowDown className="text-green-500" size={24}/>
        }
        <span className={`ml-2 text-2xl font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
          {pctText}
        </span>
      </div>
      <div className="mt-2 text-gray-700">
        {isIncrease ? 'Incremento' : 'Reducción'} de huella ecológica comparado con Antes
      </div>
    </div>
  );
}