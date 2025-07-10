import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="emoji">💪</span> FitTracker
        </Link>
        
        {/* Hamburger Button */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="nav-link nav-link-primary">Registrarse</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/workouts" className="nav-link">Entrenamientos</Link>
              <Link to="/profile" className="nav-link">Perfil</Link>
              <button className="nav-link nav-logout" onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            {!user ? (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
                  <span className="emoji">🔐</span> Iniciar Sesión
                </Link>
                <Link to="/register" className="mobile-nav-link primary" onClick={closeMenu}>
                  <span className="emoji">📝</span> Registrarse
                </Link>
              </>
            ) : (
              <>
                <div className="mobile-user-info">
                  <span className="emoji">👋</span>
                  <span>Hola, {user?.name || 'Usuario'}</span>
                </div>
                <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>
                  <span className="emoji">📊</span> Dashboard
                </Link>
                <Link to="/workouts" className="mobile-nav-link" onClick={closeMenu}>
                  <span className="emoji">💪</span> Entrenamientos
                </Link>
                <Link to="/workouts/create" className="mobile-nav-link" onClick={closeMenu}>
                  <span className="emoji">➕</span> Nueva Rutina
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>
                  <span className="emoji">👤</span> Perfil
                </Link>
                <button className="mobile-nav-link logout" onClick={handleLogout}>
                  <span className="emoji">🚪</span> Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;