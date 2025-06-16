import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartBar, FaBell, FaMicroscope, FaUser, FaBars, FaChevronLeft } from 'react-icons/fa';

const routes = [
  { path: '/home',          name: 'Inicio',        icon: FaHome       },
  { path: '/dashboard',     name: 'Dashboard',     icon: FaChartBar   },
  { path: '/notifications', name: 'Notificaciones',icon: FaBell       },
  { path: '/detection',     name: 'Detección',     icon: FaMicroscope },
  { path: '/profile',       name: 'Perfil',        icon: FaUser       },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div 
      className={`
        fixed top-0 left-0 h-screen bg-cielo
        text-gray-800 transition-all duration-300
        flex flex-col z-50
        ${isOpen ? 'w-64' : 'w-16'}
    `}
    >
      {/* Header con toggle + logo/título */}
      <div className="flex items-center justify-between h-16 px-5 bg-cielo-oscuro">
        {/* Solo mostramos el logo + texto cuando la sidebar está abierta */}
        {isOpen && (
          <span className="text-xl font-semibold text-fondo-hueso">
            🌿 Tesis Huerto
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-2xl text-fondo-hueso focus:outline-none hoover: cursor-pointer"
        >
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      </div>

      {/* Navigation */}
      <ul className="flex-1 overflow-y-auto mt-4">
        {routes.map(route => (
          <li key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                `flex items-center 
                 px-6 py-3 
                 hover:bg-cielo-claro cursor-pointer
                 transition-colors duration-200
                 ${isActive ? 'bg-cielo-claro' : ''}`
              }
            >
              <route.icon className="text-xl" />
              {isOpen && (
                <span className="ml-3 uppercase text-sm">
                  {route.name}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
             
      {/* Pie de sidebar */}
      <div className="px-6 py-4 text-xs text-gray-800">
        {isOpen ? '© 2025 Huerto Escolar': '©'}
      </div>
    </div>
  );
}