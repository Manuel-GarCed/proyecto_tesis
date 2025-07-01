import React from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mapea rutas a títulos legibles
  const routeTitles = {
    '/home':          'Inicio',
    '/dashboard':     'Dashboard',
    '/notifications': 'Notificaciones',
    '/detection':     'Detección',
    '/profile':       'Perfil',
  };

  // Calcula título según la ruta actual, con fallback
  const title = routeTitles[location.pathname] || '';

  const handleLogout = () => {
    // Limpia estado de autenticación y redirige a login
    localStorage.removeItem('isAuthenticated');
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b shadow-sm">
      {/* Izquierda: título de la página */}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* Derecha: links de perfil y logout */}
      <div className="space-x-4">
        <NavLink
          to="/profile"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Perfil
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 transition-colors hover:cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}