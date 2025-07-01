import users from '../data/users.json'

/**
 * Comprueba si las credenciales son válidas.
 * @param {string} username  
 * @param {string} password  
 * @returns {boolean}
 */
export function validateUser(username, password) {
  const user = username.toUpperCase()
  return users.some(
    u => u.username === user && u.password === password
  )
}