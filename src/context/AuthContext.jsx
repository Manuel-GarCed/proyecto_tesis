import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  isAuthenticated: false,
  login:    () => {},
  logout:   () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Inicializar estado desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  // Funciones de login/logout
  const login = useCallback(() => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Hook para logout tras 5 min de inactividad
  useEffect(() => {
    if (!isAuthenticated) return;

    let timerId;
    const resetTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        logout();
        alert('Has sido desconectado por inactividad');
      }, 5 * 60 * 1000); // 5 minutos
    };

    // Eventos de usuario que reinician el contador
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(ev => document.addEventListener(ev, resetTimer));

    resetTimer(); // inicia el temporizador

    return () => {
      clearTimeout(timerId);
      events.forEach(ev => document.removeEventListener(ev, resetTimer));
    };
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;