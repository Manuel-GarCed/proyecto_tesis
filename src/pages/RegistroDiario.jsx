import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../components/Modal';
import useWaterPrediction from '../services/useWaterPrediction';
import RegressionChart from '../components/RegressionChart';
import useDailyHumidity from '../services/useDailyHumidity';
import { fitHumidityToWater } from '../services/regressionService';

import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord
} from '../services/dailyRecordService';

export default function RegistroDiario() {
  const dailyHumidity = useDailyHumidity();
  const [predModalRec, setPredModalRec] = useState(null);
  const waterPrediction = useWaterPrediction(); // predicción numérica
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    water: '',
    fertilizer: '',
    waste: '',
    energy: ''
  });

  const [error, setError] = useState('');
  const [editRec, setEditRec] = useState(null);
  const [delRecId, setDelRecId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // === Set de IDs predichos (persistencia local) ===
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

  // 1) Carga inicial
  useEffect(() => {
    fetchRecords()
      .then(data => setRecords(data))
      .catch(err => setError(err.message));
  }, []);

  // 2) Manejo de inputs form nuevo
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // 3) Crear registro
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const { date, water, fertilizer, waste, energy } = form;

    if (!date || !water || !fertilizer || !waste || !energy) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (records.some(rec => rec.date === date)) {
      setError('Ya existe un registro para esa fecha');
      return;
    }
    if (water < 0 || fertilizer < 0 || waste < 0 || energy < 0) {
      setError('Datos ingresados inválidos');
      return;
    }

    try {
      const newRec = await createRecord({
        date,
        water: Number(water),
        fertilizer: Number(fertilizer),
        waste: Number(waste),
        energy: Number(energy)
      });
      setRecords(rs => [...rs, newRec]);
      setForm(f => ({ ...f, water: '', fertilizer: '', waste: '', energy: '' }));
    } catch (err) {
      setError(err.message);
    }
  };

  // 4) Abrir modal edición
  const openEdit = rec => {
    setEditRec({ ...rec });
    setError('');
  };

  // 5) Rellenar con predicción y actualizar array local (marca predicho)
  function fillWaterWithPrediction(event) {
    event.preventDefault();
    if (waterPrediction == null) {
      setError('Necesitas al menos 2 registros para predecir');
      return;
    }
    const predValue = Number(waterPrediction.toFixed(2));

    // Calcula m,b de la regresión Humedad -> Agua
    const dailyWater = records.map(r => ({ date: r.date, water: Number(r.water) }));
    const { m, b } = fitHumidityToWater(dailyWater, dailyHumidity);

    // Marca en el modal
    setEditRec(er => ({
      ...er,
      water: predValue,
      predicted: true,
      predMeta: { m, b }
    }));

    // Marca en la tabla visible
    setRecords(rs =>
      rs.map(r =>
        r.id === editRec.id
          ? { ...r, water: predValue, predicted: true, predMeta: { m, b } }
          : r
      )
    );

    // Mantén este registro como "predicho" en el set
    addPredictedId(editRec.id);
  }

  // 6) Confirmar edición (guardar)
  const handleUpdate = async () => {
    const { water, fertilizer, waste, energy, predicted, predMeta } = editRec;

    if (
      water === '' || fertilizer === '' ||
      waste === '' || energy === ''
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (water < 0 || fertilizer < 0 || waste < 0 || energy < 0) {
      setError('Datos ingresados inválidos');
      return;
    }

    setError('');
    setConfirmLoading(true);

    try {
      const body = {
        water: Number(water),
        fertilizer: Number(fertilizer),
        waste: Number(waste),
        energy: Number(energy),
        // si tu API lo soporta:
        predicted: predicted === true,
        predMeta: predMeta || null
      };

      const upd = await updateRecord(editRec.id, body);

      // Reinyecta predicted/predMeta por si backend no los devuelve
      const updatedRecord = {
        ...upd,
        predicted: predicted === true,
        predMeta: predMeta || upd.predMeta || null
      };

      setRecords(rs =>
        rs.map(r =>
          String(r.id) === String(updatedRecord.id) ? updatedRecord : r
        )
      );

      if (updatedRecord.predicted) addPredictedId(updatedRecord.id);

      setEditRec(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 7) Abrir modal eliminar
  const openDelete = id => setDelRecId(id);

  // 8) Confirmar eliminación
  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteRecord(delRecId);
      setRecords(rs => rs.filter(r => r.id !== delRecId));
      removePredictedId(delRecId);
      setDelRecId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Registro Diario</h1>

      {/* Form nuevo */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
      >
        <div>
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
            type="number"
            step="any"
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
            type="number"
            step="any"
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
            type="number"
            step="any"
            name="waste"
            value={form.waste}
            onChange={handleChange}
            placeholder="Kg generados"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Energía (MWh)</label>
          <input
            type="number"
            step="any"
            name="energy"
            value={form.energy}
            onChange={handleChange}
            placeholder="MWh usados"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cielo-oscuro cursor-pointer text-white rounded-md hover:bg-cielo transition"
          >
            Guardar
          </button>
        </div>
        {error && (
          <p className="col-span-5 text-red-500 text-sm">{error}</p>
        )}
      </form>

      {/* Tabla */}
      <div className="bg-white p-4 rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {['ID','Fecha','Agua (L)','Fertilizantes (g)','Residuos (kg)','Energía (MWh)','Acciones'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase hover:bg-gray-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-center">
            {records.map(r => {
              const isPred = r.predicted || predictedIds.has(r.id);
              return (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{r.id}</td>
                  <td className="px-4 py-2 text-sm">{r.date}</td>
                  <td
                    className={`px-4 py-2 text-sm ${isPred ? 'text-green-600 font-semibold cursor-pointer' : ''}`}
                    onClick={() => { if (isPred) setPredModalRec(r); }}
                  >
                    {r.water}
                  </td>
                  <td className="px-4 py-2 text-sm">{r.fertilizer}</td>
                  <td className="px-4 py-2 text-sm">{r.waste}</td>
                  <td className="px-4 py-2 text-sm">{r.energy}</td>
                  <td className="px-4 py-2 text-sm space-x-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="text-sm text-white bg-cielo-oscuro hover:bg-cielo px-3 py-1 rounded transition cursor-pointer"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => openDelete(r.id)}
                      className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}

            {records.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay registros aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal editar */}
      <Modal isOpen={!!editRec} onClose={() => setEditRec(null)}>
        <h3 className="text-lg font-semibold mb-4">
          Editar registro #{editRec?.id}
        </h3>
        {editRec && (
          <div className="space-y-4">
            {['water','fertilizer','waste','energy'].map((field) => {
              let label;
              if (field === 'energy') label = 'Energía (MWh)';
              else if (field === 'water') label = 'Agua (L)';
              else if (field === 'fertilizer') label = 'Fertilizantes (g)';
              else label = 'Residuos (kg)';

              if (field === 'water') {
                return (
                  <div key={field}>
                    <label className="block text-sm">{label}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="any"
                        value={editRec.water}
                        onChange={e =>
                          setEditRec(er => ({ ...er, water: e.target.value }))
                        }
                        className="mt-1 flex-1 border rounded px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={fillWaterWithPrediction}
                        className="mt-1 px-3 py-1 text-sm bg-cielo-oscuro text-white rounded hover:bg-cielo transition"
                      >
                        ¿No conoces? Predecir
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={field}>
                  <label className="block text-sm">{label}</label>
                  <input
                    type="number"
                    step="any"
                    value={editRec[field]}
                    onChange={e =>
                      setEditRec(er => ({ ...er, [field]: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-2 py-1"
                  />
                </div>
              );
            })}

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditRec(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={confirmLoading}
                className="px-4 py-2 bg-cielo-oscuro text-white rounded hover:bg-cielo cursor-pointer"
              >
                {confirmLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal eliminar */}
      <Modal isOpen={!!delRecId} onClose={() => setDelRecId(null)}>
        <h3 className="text-lg font-semibold mb-4">
          ¿Seguro que quieres eliminar el registro #{delRecId}?
        </h3>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setDelRecId(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            {confirmLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </Modal>

      {predModalRec && (
        <Modal isOpen onClose={() => setPredModalRec(null)}>
          <h3>Regresión Humedad → Consumo de Agua</h3>
          <div className="modal-chart mb-2">
            <RegressionChart
              allRecords={records}
              dailyHumidity={dailyHumidity}
              predictedRecord={predModalRec}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setPredModalRec(null)}
              className="px-4 py-2 bg-cielo-oscuro text-white rounded hover:bg-cielo cursor-pointer"
            >
              Aceptar
            </button>
          </div>

        </Modal>
      )}
    </div>
  );
}