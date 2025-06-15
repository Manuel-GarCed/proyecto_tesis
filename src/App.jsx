import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Detection from './pages/Detection';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home"          element={<Home />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/detection"     element={<Detection />} />
          <Route path="/profile"       element={<Profile />} />
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