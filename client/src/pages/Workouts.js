import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import Modal, { ConfirmModal } from '../components/ui/Modal';

const Workouts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [deleteModal, setDeleteModal] = useState({ open: false, workoutId: null, workoutName: '' });

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(res.data.workouts || res.data.data || []);
      setError('');
    } catch (err) {
      setWorkouts([]);
      setError('Error al cargar entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (workout) => {
    setDeleteModal({
      open: true,
      workoutId: workout._id,
      workoutName: workout.name || workout.title || 'Entrenamiento'
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts/${deleteModal.workoutId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts(workouts.filter(w => w._id !== deleteModal.workoutId));
      setDeleteModal({ open: false, workoutId: null, workoutName: '' });
    } catch (err) {
      setError('Error al eliminar entrenamiento');
    }
  };

  // Filtrar y ordenar workouts
  const filteredWorkouts = workouts
    .filter(workout => 
      workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'name') {
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      }
      if (sortBy === 'exercises') {
        return (b.exercises?.length || 0) - (a.exercises?.length || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="workouts-page">
        <div className="page-header">
          <Skeleton width="60%" height="48px" lines={2} />
          <Skeleton width="150px" height="44px" />
        </div>
        <div className="workouts-grid">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="workouts-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <span className="emoji">💪</span> Mis Entrenamientos
          </h1>
          <p className="page-subtitle">
            Gestiona y revisa tus rutinas de ejercicios
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/workouts/create')}
        >
          <span className="emoji">➕</span> Nueva Rutina
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="workouts-filters">
        <Input
          placeholder="Buscar entrenamientos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="🔍"
          className="search-input-custom"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="date">Más recientes</option>
          <option value="name">Nombre A-Z</option>
          <option value="exercises">Más ejercicios</option>
        </select>
      </div>

      {/* Estadísticas rápidas */}
      <div className="workouts-stats">
        <div className="stat-item">
          <span className="stat-number">{workouts.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {workouts.reduce((total, w) => total + (w.exercises?.length || 0), 0)}
          </span>
          <span className="stat-label">Ejercicios</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {workouts.filter(w => {
              const workoutDate = new Date(w.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return workoutDate >= weekAgo;
            }).length}
          </span>
          <span className="stat-label">Esta semana</span>
        </div>
      </div>

      {/* Lista de entrenamientos */}
      {error && (
        <div className="error-message">
          <span className="emoji">⚠️</span> {error}
        </div>
      )}

      {filteredWorkouts.length === 0 ? (
        <Card variant="flat">
          <div className="empty-state">
            <div className="empty-icon">💪</div>
            <h3>No hay entrenamientos</h3>
            <p>
              {searchTerm 
                ? `No se encontraron entrenamientos que coincidan con "${searchTerm}"`
                : 'Aún no has creado ningún entrenamiento'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/workouts/create')}
            >
              <span className="emoji">➕</span> Crear mi primera rutina
            </Button>
          </div>
        </Card>
      ) : (
        <div className="workouts-grid">
          {filteredWorkouts.map((workout) => (
            <Card key={workout._id} className="workout-card">
              <div className="workout-card-header">
                <h3 className="workout-name">
                  {workout.name || workout.title || 'Entrenamiento'}
                </h3>
                <div className="workout-date">
                  {new Date(workout.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="workout-card-content">
                <div className="workout-stats">
                  <div className="workout-stat">
                    <span className="emoji">🏋️</span>
                    <span>{workout.exercises?.length || 0} ejercicios</span>
                  </div>
                  {workout.duration && (
                    <div className="workout-stat">
                      <span className="emoji">⏱️</span>
                      <span>{workout.duration} min</span>
                    </div>
                  )}
                </div>
                
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="exercise-preview">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <span key={index} className="exercise-tag">
                        {exercise.name}
                      </span>
                    ))}
                    {workout.exercises.length > 3 && (
                      <span className="exercise-tag more">
                        +{workout.exercises.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="workout-card-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/workouts/${workout._id}/edit`)}
                >
                  <span className="emoji">✏️</span> Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(workout)}
                >
                  <span className="emoji">🗑️</span> Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, workoutId: null, workoutName: '' })}
        onConfirm={confirmDelete}
        title="Eliminar entrenamiento"
        message={`¿Estás seguro de que quieres eliminar "${deleteModal.workoutName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default Workouts;