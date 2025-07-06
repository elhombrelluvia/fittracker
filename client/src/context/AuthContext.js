import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar si hay token
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(res.data.user);
        } catch (err) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // Login real
  const login = async (email, password) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
      { email, password }
    );
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Registro (opcional)
  const register = async (name, email, password, confirmPassword) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`,
      { name, email, password, confirmPassword }
    );
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}