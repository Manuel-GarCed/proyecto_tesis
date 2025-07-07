import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function IndicatorCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,      // number: positivo o negativo
  trendUnit,  // cadena p.ej. '%' o '°C'
  trendText   // p.ej. 'vs hace 1 h'
}) {
  const isUp = trend > 0;
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
      <div className="p-3 bg-cielo-claro rounded-full">
        <Icon className="w-6 h-6 text-cielo-oscuro" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-900">
          {value} <span className="text-lg font-normal">{unit}</span>
        </div>
        {typeof trend === 'number' && (
          <div className="flex items-center text-sm mt-1">
            {isUp ? (
              <FiArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <FiArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`${isUp ? 'text-green-600' : 'text-red-600'} ml-1`}>
              {Math.abs(trend).toFixed(1)}{trendUnit}
            </span>
            <span className="text-gray-400 ml-2">{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
}