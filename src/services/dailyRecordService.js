const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchRecords() {
  const res = await fetch(`${API_BASE}/api/records`);
  if (!res.ok) throw new Error('Error al obtener registros');
  return res.json();
}

export async function createRecord(record) {
  const res = await fetch(`${API_BASE}/api/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Error al guardar registro');
  return res.json();
}

export async function updateRecord(id, body) {
  const res = await fetch(`${API_BASE}/api/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error al actualizar registro');
  return res.json();
}

export async function deleteRecord(id) {
  const res = await fetch(`${API_BASE}/api/records/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar registro');
  return res.ok;
}