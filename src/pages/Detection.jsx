import React, { useState } from 'react';

export default function DetectionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  // Cuando el usuario elige archivo, guardamos objeto + URL para preview
  const handleFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  // Lógica simulada: 50% probabilidad de infección
  const handleDetect = () => {
    if (!file) return;
    const infected = Math.random() < 0.5;
    setResult({
      status: infected ? 'Infectada' : 'Sana',
      measures: infected
        ? [
            'Retirar cuidadosamente las hojas afectadas',
            'Aplicar fungicida específico para "mildiu"',
            'Mantener buena ventilación y no mojar el follaje'
          ]
        : []
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Detección de enfermedades</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ──────────────── Izquierda: uploader ──────────────── */}
        <div className="bg-white p-4 rounded-lg shadow">
          <label className="block mb-2 font-medium">Sube foto de la hoja</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full max-h-64 object-contain rounded"
            />
          )}

          <button
            disabled={!file}
            onClick={handleDetect}
            className="mt-4 px-4 py-2 bg-cielo-oscuro text-white rounded hover:bg-cielo transition disabled:opacity-50"
          >
            Detectar
          </button>
        </div>

        {/* ──────────────── Derecha: resultado ──────────────── */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Resultado</h2>
          
          {!result && (
            <p className="text-gray-500">No hay detección aún.</p>
          )}

          {result && (
            <>
              <p
                className={`font-semibold mb-4 ${
                  result.status === 'Sana'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {result.status}
              </p>

              {result.status === 'Infectada' && (
                <div>
                  <h3 className="font-medium mb-2">
                    Medidas recomendadas:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {result.measures.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}