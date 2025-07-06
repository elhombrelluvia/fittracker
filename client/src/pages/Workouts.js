import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Workouts = () => {
  const { token } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkouts(res.data.workouts || res.data.data || []);
      } catch (err) {
        setWorkouts([]);
      }
      setLoading(false);
    };
    fetchWorkouts();
  }, [token]);

  const handleSelect = (workout) => {
    setSelected(selected && selected._id === workout._id ? null : workout);
  };

  return (
    <div className="card">
      <h2>Mis Rutinas</h2>
      {loading ? (
        <p>Cargando rutinas...</p>
      ) : workouts.length === 0 ? (
        <p>No tienes rutinas registradas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {workouts.map(w => (
            <li key={w._id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{w.name}</strong>
                  <span style={{ marginLeft: 12, color: '#888', fontSize: 13 }}>
                    {new Date(w.date).toLocaleDateString()}
                  </span>
                  <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                    {w.description}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <b>Tipo:</b> {w.workout_type} &nbsp;|&nbsp;
                    <b>Ejercicios:</b> {w.exercises?.length || 0} &nbsp;|&nbsp;
                    <b>Grupos musculares:</b> {w.muscle_groups_targeted?.join(', ') || 'N/A'}
                  </div>
                </div>
                <button className="btn btn-link" onClick={() => handleSelect(w)}>
                  {selected && selected._id === w._id ? 'Ocultar' : 'Ver detalles'}
                </button>
                <Link to={`/workouts/${w._id}/edit`} className="btn btn-link" style={{ marginLeft: 8 }}>
                  Editar sets
                </Link>
              </div>
              {selected && selected._id === w._id && (
                <div style={{ marginTop: 12, background: '#f6f8fa', borderRadius: 8, padding: 12 }}>
                  <h4 style={{ margin: '8px 0' }}>Ejercicios:</h4>
                  <ol>
                    {w.exercises && w.exercises.length > 0 ? (
                      w.exercises.map((ex, idx) => (
                        <li key={ex._id || idx}>
                          <b>{ex.exercise?.name || ex.exercise?.toString() || 'Ejercicio'}</b>
                          {ex.notes && <span style={{ color: '#888' }}> — {ex.notes}</span>}
                          <div style={{ fontSize: 13, marginLeft: 8 }}>
                            Sets: {ex.sets?.length || 0}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>No hay ejercicios en esta rutina.</li>
                    )}
                  </ol>
                  {w.notes && (
                    <div style={{ marginTop: 8 }}>
                      <b>Notas:</b> {w.notes}
                    </div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
                    Estado: {w.status} | Duración: {w.duration ? `${w.duration} min` : 'N/A'}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Workouts;