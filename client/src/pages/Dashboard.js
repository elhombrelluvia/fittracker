import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkoutChart from '../components/Chart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton, { SkeletonCard, SkeletonStat } from '../components/ui/Skeleton';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estadísticas calculadas
  const stats = {
    totalWorkouts: workouts.length,
    thisWeek: workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    }).length,
    totalExercises: workouts.reduce((total, w) => total + (w.exercises?.length || 0), 0),
    avgExercisesPerWorkout: workouts.length > 0 
      ? Math.round(workouts.reduce((total, w) => total + (w.exercises?.length || 0), 0) / workouts.length)
      : 0
  };

  // ... (mantén la lógica de chartData igual)
  const chartData = useMemo(() => {
    // Tu lógica existente de chartData
    const weeklyData = [];
    const weekLabels = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const workoutsInWeek = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });
      
      weeklyData.push(workoutsInWeek.length);
      weekLabels.push(`Semana ${4-i}`);
    }

    const exerciseTypes = {};
    workouts.forEach(w => {
      w.exercises?.forEach(ex => {
        const type = ex.category || ex.muscle || 'General';
        exerciseTypes[type] = (exerciseTypes[type] || 0) + 1;
      });
    });

    return {
      weekly: {
        labels: weekLabels,
        datasets: [{
          label: 'Entrenamientos',
          data: weeklyData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      exerciseTypes: {
        labels: Object.keys(exerciseTypes).slice(0, 5),
        datasets: [{
          data: Object.values(exerciseTypes).slice(0, 5),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderWidth: 0
        }]
      }
    };
  }, [workouts]);

  useEffect(() => {
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

    if (token) {
      fetchWorkouts();
    }
  }, [token]);

  if (loading) {
    return (
      <div>
        {/* Header skeleton */}
        <SkeletonCard />
        
        {/* Stats skeleton */}
        <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
          {[1, 2, 3, 4].map(i => (
            <SkeletonStat key={i} />
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', margin: 'var(--space-6) 0' }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header del Dashboard */}
      <Card
        title={`¡Hola, ${user?.name || 'usuario'}!`}
        icon="👋"
        subtitle="Bienvenido a tu panel de control"
        headerContent={
          <Button
            variant="primary"
            onClick={() => navigate('/workouts/create')}
          >
            <span className="emoji">➕</span> Nueva rutina
          </Button>
        }
      />

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalWorkouts}</div>
          <div className="stat-label">Rutinas totales</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}>
          <div className="stat-value">{stats.thisWeek}</div>
          <div className="stat-label">Esta semana</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--warning), #d97706)' }}>
          <div className="stat-value">{stats.totalExercises}</div>
          <div className="stat-label">Ejercicios completados</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
          <div className="stat-value">{stats.avgExercisesPerWorkout}</div>
          <div className="stat-label">Promedio por rutina</div>
        </div>
      </div>

      {/* Gráficas */}
      {workouts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <Card title="Progreso Semanal" icon="📈">
            <WorkoutChart 
              type="bar"
              data={chartData.weekly}
              title="Entrenamientos por semana"
            />
          </Card>
          
          {Object.keys(chartData.exerciseTypes.labels).length > 0 && (
            <Card title="Tipos de Ejercicios" icon="🎯">
              <WorkoutChart 
                type="doughnut"
                data={chartData.exerciseTypes}
                title="Distribución por categoría"
              />
            </Card>
          )}
        </div>
      )}

      {/* Entrenamientos Recientes */}
      <Card 
        title="Entrenamientos recientes"
        icon="📋"
        headerContent={
          <Button 
            variant="secondary"
            onClick={() => navigate('/workouts')}
          >
            Ver todos
          </Button>
        }
      >
        {error ? (
          <div className="error-message">
            <span className="emoji">⚠️</span> {error}
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center" style={{ padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-4)' }}>
              No tienes entrenamientos recientes
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate('/workouts/create')}
            >
              Crear tu primera rutina
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {workouts.slice(0, 5).map((w) => (
              <div 
                key={w._id}
                className="workout-item"
                onClick={() => navigate(`/workouts/${w._id}/edit`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                      {w.name || w.title || 'Entrenamiento'}
                    </h4>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>
                      {new Date(w.date).toLocaleDateString()} • {w.exercises?.length || 0} ejercicios
                    </p>
                  </div>
                  <span style={{ color: 'var(--primary-500)', fontSize: 'var(--font-lg)' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Accesos Rápidos */}
      <Card title="Accesos rápidos" icon="🚀">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <Button 
            variant="secondary"
            onClick={() => navigate('/workouts')}
            style={{ padding: 'var(--space-4)', height: 'auto', flexDirection: 'column' }}
          >
            <span className="emoji" style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-2)' }}>💪</span>
            <span>Mis rutinas</span>
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/profile')}
            style={{ padding: 'var(--space-4)', height: 'auto', flexDirection: 'column' }}
          >
            <span className="emoji" style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-2)' }}>👤</span>
            <span>Mi perfil</span>
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/workouts/create')}
            style={{ padding: 'var(--space-4)', height: 'auto', flexDirection: 'column' }}
          >
            <span className="emoji" style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-2)' }}>➕</span>
            <span>Nueva rutina</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;