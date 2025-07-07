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

export default function Home() {
  const data = useSensorData();
  const sensorData = useSensorData();
  //console.log('Home — sensorData[0]:', sensorData[0]);
  const footprintData = useFootprintData();
  //console.log("Datos cargados:", data.length, "filas");

//console.log(data);
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Hola, aquí tu informe general</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemperatureChart data={data} />
        <HumidityChart    data={data} />
        <PhChart          data={data} />
      </div>
      {/* Gráfico de huella ecológica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <EcologicalFootprintChart data={footprintData}/>
        <VariationIndicator      data={footprintData} />
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