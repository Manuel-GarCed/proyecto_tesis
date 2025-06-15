import React from 'react';
import { FaHome, FaUser, FaBell, FaChartBar, FaMicroscope, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">
        🌿 Tesis Huerto
      </div>
      <nav className="flex flex-col flex-grow px-4 py-6 space-y-4">
        <NavItem icon={<FaHome />} label="Inicio" />
        <NavItem icon={<FaChartBar />} label="Dashboard" />
        <NavItem icon={<FaBell />} label="Notificaciones" />
        <NavItem icon={<FaMicroscope />} label="Detección" />
        <NavItem icon={<FaUser />} label="Perfil" />
      </nav>
      <div className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
        © 2025 Huerto Escolar
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded cursor-pointer">
    <div className="text-lg">{icon}</div>
    <span>{label}</span>
  </div>
);

export default Sidebar;