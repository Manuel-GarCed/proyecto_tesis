import users from '../data/users.json'

/**
 * Valida el usuario haciendo un GET a json-server
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function validateUser(username, password) {
  // Ajusta el puerto si tu json-server no está en 3001
  const res = await fetch(`http://localhost:3001/users?username=${encodeURIComponent(username)}`);
  if (!res.ok) {
    console.error('Error al conectar con la API de users:', res.status);
    return false;
  }
  const users = await res.json();
  if (users.length === 0) {
    return false;
  }
  const user = users[0];
  return user.password === password;
}