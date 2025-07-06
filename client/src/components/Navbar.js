import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>💪 FitTracker</Link>
      </h1>
      <div>
        {!user ? (
          <>
            <Link to="/login" className="btn btn-link">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-link">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="btn btn-link">Dashboard</Link>
            <Link to="/workouts" className="btn btn-link">Entrenamientos</Link>
            <Link to="/profile" className="btn btn-link">Perfil</Link>
            <button className="btn btn-link" onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;  
