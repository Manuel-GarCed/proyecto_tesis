import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Envuelve a tus rutas protegidas.
 * Si isAuthenticated es true, renderiza <Outlet/> (las rutas hijas).
 * Si no, redirige a /login.
 */
export default function ProtectedRoute({ isAuthenticated }) {
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}