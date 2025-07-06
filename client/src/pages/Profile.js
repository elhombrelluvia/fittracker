import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="card"><h2>Cargando perfil...</h2></div>;
  }

  return (
    <div className="card">
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Puedes agregar más datos aquí */}
    </div>
  );
};

export default Profile;