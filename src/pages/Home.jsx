import React from 'react';
import useSensorData from '../services/useSensorData';
import useFootprintData from '../services/useFootprintData';
import TemperatureChart from '../components/TemperatureChart';
import HumidityChart from '../components/HumidityChart';
import PhChart from '../components/PhChart';
import EcologicalFootprintChart from '../components/EcologicalFootprintChart';
import VariationIndicator           from '../components/VariationIndicator';
import DailyHumidityChart       from '../components/DailyHumidityChart';
import DailyTemperatureChart    from '../components/DailyTemperatureChart';
import DailyPhChart             from '../components/DailyPhChart';
import IndicatorCard from '../components/indicatorCard';
import useWaterPrediction from '../services/useWaterPrediction';
import { FaTint, FaThermometerHalf, FaFlask } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { recommendations } from '../data/alerts'
import RecommendationsSummary from '../components/RecommendationsSummary';

export default function Home() {
  const data = useSensorData();
  const sensorData = useSensorData();
  //console.log('Home — sensorData[0]:', sensorData[0]);
  const footprintData = useFootprintData();
  //console.log("Datos cargados:", data.length, "filas");
  const waterPred = useWaterPrediction();

//console.log(data);
  
  // Elegimos solo las primeras 3 (o cualquier lógica tuya)
  const top3 = recommendations.slice(0, 11)


  // suponemos que data está ordenado cronológicamente ascendente
  const last = data[data.length - 1] || {};
  const prev = data[data.length - 2] || {};

  const cards = [
    {
      icon: FaTint,
      label: 'Humedad actual',
      value: last.humedad?.toFixed(1),
      unit: '%',
      trend: last.humedad - prev.humedad,
      trendUnit: '%',
      trendText: 'vs última lectura'
    },
    {
      icon: FaThermometerHalf,
      label: 'Temperatura actual',
      value: last.temperatura?.toFixed(1),
      unit: '°C',
      trend: last.temperatura - prev.temperatura,
      trendUnit: '°C',
      trendText: 'vs última lectura'
    },
    {
      icon: FaFlask,
      label: 'pH actual',
      value: last.pH?.toFixed(2),
      unit: '',
      trend: last.pH - prev.pH,
      trendUnit: '',
      trendText: 'vs última lectura'
    },
  ];


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Hola, aquí tu informe básico 😊</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <IndicatorCard key={i} {...c} />
        ))}
      </div>
      {/* Gráfico de huella ecológicaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Izquierda: ocupa su contenido */}
        <div className="h-[460px]">
          <EcologicalFootprintChart data={footprintData} />
        </div>

        {/* Derecha: column flex para indicator arriba y rec rápidas abajo */}
        {/* Derecha: indicator + recs */}
        <div className="h-[460px] flex flex-col">
          <VariationIndicator data={footprintData} />
          {/* Este wrapper sólo flex para que el hijo ocupe el hueco */}
          <div className="mt-6 flex-1 flex flex-col min-h-0">
            <RecommendationsSummary recommendations={top3} />
          </div>
        </div>
      </div>
      {/* Gráficos diarios de serie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DailyHumidityChart    data={data}/>
        <DailyTemperatureChart data={data}/>
        <DailyPhChart          data={data}/>
      </div>
            
    </div>
  );
}