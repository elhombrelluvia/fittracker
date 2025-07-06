import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkouts(res.data.workouts || []);
      } catch (err) {
        setWorkouts([]);
      }
      setLoading(false);
    };
    if (token) fetchWorkouts();
  }, [token]);

  return (
    <div className="card">
      <h2>¡Hola, {user?.name || 'usuario'}! 👋</h2>
      <p>Bienvenido a tu panel de control.</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Entrenamientos recientes</h3>
        {loading ? (
          <p>Cargando entrenamientos...</p>
        ) : workouts.length === 0 ? (
          <p>No tienes entrenamientos recientes.</p>
        ) : (
          <ul>
            {workouts.slice(0, 5).map((w) => (
              <li key={w._id}>
                <strong>{w.title || 'Entrenamiento'}</strong> — {new Date(w.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul style={{ marginTop: '2rem' }}>
        <li>📈 Visualiza tu progreso</li>
        <li>📝 Accede a tus rutinas y perfil</li>
      </ul>

      <button
        className="btn btn-primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/workouts/create')}
      >
        Crear nueva rutina
      </button>
    </div>
  );
};

export default Dashboard;