import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal, { ConfirmModal } from '../components/ui/Modal';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({});
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitnessGoal: user?.fitnessGoal || ''
  });

  useEffect(() => {
    fetchUserStats();
  }, [token]);

  const fetchUserStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/workouts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const workouts = res.data.workouts || res.data.data || [];

      const totalWorkouts = workouts.length;
      const totalExercises = workouts.reduce((total, w) => total + (w.exercises?.length || 0), 0);
      const thisWeek = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return workoutDate >= weekAgo;
      }).length;

      const thisMonth = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return workoutDate >= monthAgo;
      }).length;

      setStats({
        totalWorkouts,
        totalExercises,
        thisWeek,
        thisMonth,
        avgPerWeek: totalWorkouts > 0 ? Math.round(totalWorkouts / 4) : 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        age: profileData.age,
        weight: profileData.weight,
        height: profileData.height,
        fitnessGoal: profileData.fitnessGoal
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      logout();
      navigate('/');
    } catch (err) {
      setError('Error al eliminar cuenta');
    }
    setDeleteAccountModal(false);
  };
  const calculateBMI = () => {
    if (profileData.weight && profileData.height) {
      const heightInMeters = profileData.height / 100;
      return (profileData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Bajo peso', color: 'var(--warning)' };
    if (bmi < 25) return { text: 'Normal', color: 'var(--success)' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'var(--warning)' };
    return { text: 'Obesidad', color: 'var(--error)' };
  };

   return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <span className="emoji">👤</span> Mi Perfil
          </h1>
          <p className="page-subtitle">
            Gestiona tu información personal y configuración
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
        >
          <span className="emoji">{isEditing ? '❌' : '✏️'}</span> 
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="error-message">
          <span className="emoji">⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          <span className="emoji">✅</span> {success}
        </div>
      )}

      <div className="profile-grid">
        {/* Información Personal */}
        <div className="profile-section">
          <Card title="Información Personal" icon="📋">
            <form onSubmit={handleSaveProfile}>
              <div className="profile-form">
                <Input
                  label="Nombre completo"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />

                <div className="form-row">
                  <Input
                    label="Edad"
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="años"
                  />
                  <Input
                    label="Peso"
                    type="number"
                    name="weight"
                    value={profileData.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="kg"
                  />
                  <Input
                    label="Altura"
                    type="number"
                    name="height"
                    value={profileData.height}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="cm"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Objetivo fitness</label>
                  <select
                    name="fitnessGoal"
                    value={profileData.fitnessGoal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  >
                    <option value="">Selecciona un objetivo</option>
                    <option value="lose-weight">Perder peso</option>
                    <option value="gain-muscle">Ganar músculo</option>
                    <option value="maintain">Mantener forma</option>
                    <option value="endurance">Mejorar resistencia</option>
                    <option value="strength">Aumentar fuerza</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      fullWidth
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar con estadísticas */}
        <div className="profile-sidebar">
          {/* Estadísticas */}
          <Card title="Estadísticas" icon="📊">
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label">Total entrenamientos</span>
                <span className="stat-value">{stats.totalWorkouts || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Ejercicios realizados</span>
                <span className="stat-value">{stats.totalExercises || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Esta semana</span>
                <span className="stat-value">{stats.thisWeek || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Este mes</span>
                <span className="stat-value">{stats.thisMonth || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Promedio semanal</span>
                <span className="stat-value">{stats.avgPerWeek || 0}</span>
              </div>
            </div>
          </Card>

          {/* BMI */}
          {profileData.weight && profileData.height && (
            <Card title="Índice de Masa Corporal" icon="⚖️">
              <div className="bmi-section">
                <div className="bmi-value">
                  {calculateBMI()}
                </div>
                <div 
                  className="bmi-category"
                  style={{ color: getBMICategory(calculateBMI()).color }}
                >
                  {getBMICategory(calculateBMI()).text}
                </div>
                <div className="bmi-info">
                  Basado en altura: {profileData.height}cm y peso: {profileData.weight}kg
                </div>
              </div>
            </Card>
          )}

          {/* Acciones */}
          <Card title="Configuración de Cuenta" icon="⚙️">
            <div className="account-actions">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/workouts')}
              >
                <span className="emoji">💪</span> Ver mis entrenamientos
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/workouts/create')}
              >
                <span className="emoji">➕</span> Crear nueva rutina
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setDeleteAccountModal(true)}
              >
                <span className="emoji">🗑️</span> Eliminar cuenta
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal eliminar cuenta */}
      <ConfirmModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Eliminar cuenta"
        message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
        confirmText="Eliminar cuenta"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default Profile;