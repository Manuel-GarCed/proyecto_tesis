import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { KeepAlive } from 'react-activation'

import Header from './components/header';
import Sidebar from './components/sidebar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Notifications from './pages/Notifications'
import Detection from './pages/Detection'
import Profile from './pages/Profile'
import Login from './pages/Login'

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  // 1) Si estamos en /login, devolvemos SOLO el Login sin layout
  if (isLogin) {
    return <Login setIsAuthenticated={() => {}} />;
  }

  // 2) En cualquier otra ruta, montamos el layout con Sidebar + contenido
  return (
    <div className='flex h-screen'>
      {/* Sidebar y overlay */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          flex-1
          flex flex-col
          min-h-0
          bg-gray-100
          transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        {/* Header siempre de altura automática */}
        <Header />

        {/* Body que crece, con scroll si hace falta */}
        <div className="flex-1 overflow-auto">
          <Routes>
            {/* redirect raíz a home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Rutas normales */}
            <Route path="/home"          element={<Home />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/detection"     element={<Detection />} />
            <Route path="/profile"       element={<Profile />} />

            {/* Captura cualquier otra y envía a home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
/*
import './App.css';
import Sidebar from './components/sidebar';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        { //Aquí va el contenido dinámico (Home, Dashboard, etc.) }
        <h1 className="text-2xl font-bold">Bienvenido al sistema de Tesis</h1>
      </main>
    </div>
  );
}

export default App;
*/