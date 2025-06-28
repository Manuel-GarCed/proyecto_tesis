import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import './index.css'

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Detection from './pages/Detection';
import Profile from './pages/Profile';
import Login from './pages/Login';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <BrowserRouter>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay que cubre el contenido cuando el sidebar está desplegado */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div
        className={`
         flex flex-col h-screen bg-gray-100
         transition-all duration-300
         ${sidebarOpen ? 'ml-64' : 'ml-16'}
       `}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home"          element={<Home />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/detection"     element={<Detection />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/login"       element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
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