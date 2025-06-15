import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartBar, FaBell, FaMicroscope, FaUser } from 'react-icons/fa';

const routes = [
  { path: '/home',          name: 'Inicio',        icon: FaHome       },
  { path: '/dashboard',     name: 'Dashboard',     icon: FaChartBar   },
  { path: '/notifications', name: 'Notificaciones',icon: FaBell       },
  { path: '/detection',     name: 'Detección',     icon: FaMicroscope },
  { path: '/profile',       name: 'Perfil',        icon: FaUser       },
];

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-gray-200 flex flex-col z-50">
      {/* Logo y título */}
      <div className="flex items-center h-16 px-6 bg-gray-900">
        <span className="text-xl font-semibold">🌿 Tesis Huerto</span>
      </div>
      {/* Menú */}
      <ul className="flex-1 overflow-y-auto mt-4">
        {routes.map((route) => (
          <li key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              <route.icon className="mr-3 text-lg" />
              <span className="uppercase text-sm">{route.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* Pie de sidebar */}
      <div className="px-6 py-4 text-xs text-gray-400">
        © 2025 Huerto Escolar
      </div>
    </div>
  );
}