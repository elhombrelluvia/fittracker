import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario, redirige al login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;