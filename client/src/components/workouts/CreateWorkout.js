import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MUSCLE_GROUPS = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'forearms', 'quadriceps', 'hamstrings', 'glutes',
    'calves', 'abs', 'obliques', 'traps', 'lats'
];

const WORKOUT_TYPES = [
    'strength', 'cardio', 'flexibility', 'sports', 'mixed'
];

const CreateWorkout = () => {
    const { token } = useAuth();
    const [success, setSuccess] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [workoutType, setWorkoutType] = useState('strength');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                console.log('Token:', token); // <-- agrega esto para depuración
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/exercises`,
                    { headers: { Authorization: `Bearer ${token}` } } // <-- agrega esto
                );
                setExercises(res.data.data || []);
            } catch (err) {
                setExercises([]);
                console.error('Error al obtener ejercicios:', err);
            }
        };
        fetchExercises();
    }, [token]);

    const handleExerciseSelect = (id) => {
        setSelectedExercises((prev) =>
            prev.includes(id)
                ? prev.filter((eid) => eid !== id)
                : [...prev, id]
        );
    };

    const handleMuscleGroupSelect = (group) => {
        setMuscleGroups((prev) =>
            prev.includes(group)
                ? prev.filter((g) => g !== group)
                : [...prev, group]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                name,
                description,
                workout_type: workoutType,
                muscle_groups_targeted: muscleGroups,
                exercises: selectedExercises.map((id, idx) => ({
                    exercise: id,
                    sets: [],
                    order: idx + 1
                }))
            };
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la rutina');
        }
        setLoading(false);

        
    };

    return (
        <div className="card">
            {success && <p style={{ color: 'green' }}>¡Rutina creada con éxito! Redirigiendo...</p>}
            <h2>Crear Nueva Rutina</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de la rutina:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="form-group">
                    <label>Tipo de rutina:</label>
                    <select value={workoutType} onChange={e => setWorkoutType(e.target.value)}>
                        {WORKOUT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Grupos musculares:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {MUSCLE_GROUPS.map(group => (
                            <label key={group} style={{ fontSize: 13 }}>
                                <input
                                    type="checkbox"
                                    checked={muscleGroups.includes(group)}
                                    onChange={() => handleMuscleGroupSelect(group)}
                                />
                                {group}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label>Selecciona ejercicios (en orden):</label>
                    <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', borderRadius: 6, padding: 8 }}>
                        {exercises.map(ex => (
                            <div key={ex._id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedExercises.includes(ex._id)}
                                        onChange={() => handleExerciseSelect(ex._id)}
                                    />
                                    {ex.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Rutina'}
                </button>
            </form>
        </div>
    );
};

export default CreateWorkout;