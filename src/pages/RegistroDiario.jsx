import React, { useState, useEffect } from 'react';
import { fetchRecords, createRecord } from '../services/dailyRecordService';

export default function RegistroDiario() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    water: '',
    fertilizer: '',
    waste: ''
  });
  const [error, setError] = useState('');

  // 1) Al montar, cargamos registros
  useEffect(() => {
    fetchRecords()
      .then(data => setRecords(data))
      .catch(err => setError(err.message));
  }, []);

  // 2) Manejo de inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // 3) Enviar nuevo registro
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const { date, water, fertilizer, waste } = form;
    if (!date || !water || !fertilizer || !waste) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const newRec = await createRecord({
        date,
        water: Number(water),
        fertilizer: Number(fertilizer),
        waste: Number(waste)
      });
      setRecords(r => [...r, newRec]);
      // limpiamos el form (salvo la fecha)
      setForm(f => ({ ...f, water: '', fertilizer: '', waste: '' }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Registro Diario</h1>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
      >
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input 
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Agua (L)</label>
          <input 
            type="number" step="any"
            name="water"
            value={form.water}
            onChange={handleChange}
            placeholder="Litros usados"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fertilizantes (g)</label>
          <input 
            type="number" step="any"
            name="fertilizer"
            value={form.fertilizer}
            onChange={handleChange}
            placeholder="Gramos usados"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Residuos (kg)</label>
          <input 
            type="number" step="any"
            name="waste"
            value={form.waste}
            onChange={handleChange}
            placeholder="Kg generados"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cielo-oscuro text-white rounded-md hover:bg-amarillo-concreto transition"
          >
            Guardar
          </button>
        </div>
        {error && (
          <p className="col-span-5 text-red-500 text-sm">{error}</p>
        )}
      </form>

      {/* 4) Tabla de registros */}
      <div className="bg-white p-4 rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {['ID','Fecha','Agua (L)','Fertilizantes (g)','Residuos (kg)']
                .map(h => (
                  <th 
                    key={h}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-2 text-sm">{r.id}</td>
                <td className="px-4 py-2 text-sm">{r.date}</td>
                <td className="px-4 py-2 text-sm">{r.water}</td>
                <td className="px-4 py-2 text-sm">{r.fertilizer}</td>
                <td className="px-4 py-2 text-sm">{r.waste}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td 
                  colSpan={5} 
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No hay registros aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}