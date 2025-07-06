import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditWorkout = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkout(res.data.workout || res.data.data);
      } catch (err) {
        setError('No se pudo cargar la rutina');
      }
      setLoading(false);
    };
    fetchWorkout();
  }, [id, token]);

  const handleSetChange = (exIdx, setIdx, field, value) => {
    setWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exIdx].sets[setIdx][field] = value;
      return updated;
    });
  };

  const handleAddSet = (exIdx) => {
    setWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exIdx].sets.push({ reps: 0, weight: 0 });
      return updated;
    });
  };

  const handleSave = async () => {
    setError('');
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts/${id}`,
        { exercises: workout.exercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/workouts');
    } catch (err) {
      setError('Error al guardar los cambios');
    }
  };

  if (loading) return <div className="card"><p>Cargando rutina...</p></div>;
  if (error) return <div className="card"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!workout) return null;

  return (
    <div className="card">
      <h2>Editar Sets de: {workout.name}</h2>
      {workout.exercises.map((ex, exIdx) => (
        <div key={ex._id || ex.exercise._id} style={{ marginBottom: 24 }}>
          <h4>{ex.exercise.name || ex.exercise}</h4>
          <ol>
            {ex.sets.map((set, setIdx) => (
              <li key={setIdx} style={{ marginBottom: 8 }}>
                <label>
                  Reps:
                  <input
                    type="number"
                    min="0"
                    value={set.reps}
                    onChange={e => handleSetChange(exIdx, setIdx, 'reps', Number(e.target.value))}
                    style={{ width: 60, marginLeft: 8, marginRight: 16 }}
                  />
                </label>
                <label>
                  Peso:
                  <input
                    type="number"
                    min="0"
                    value={set.weight}
                    onChange={e => handleSetChange(exIdx, setIdx, 'weight', Number(e.target.value))}
                    style={{ width: 60, marginLeft: 8 }}
                  />
                </label>
              </li>
            ))}
          </ol>
          <button className="btn btn-link" type="button" onClick={() => handleAddSet(exIdx)}>
            + Agregar set
          </button>
        </div>
      ))}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
    </div>
  );
};

export default EditWorkout;