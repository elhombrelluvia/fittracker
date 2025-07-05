// client/src/pages/Home.js
import React from 'react';

const Home = () => {
  return (
    <div className="card">
      <h2>¡Bienvenido a FitTracker! 💪</h2>
      <p>Tu aplicación personal para seguimiento de entrenamientos.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Características:</h3>
        <ul>
          <li>📊 Seguimiento de entrenamientos</li>
          <li>📈 Gráficos de progreso</li>
          <li>⏱️ Timer integrado</li>
          <li>🧮 Calculadora de IMC</li>
          <li>📱 Diseño responsive</li>
        </ul>
      </div>
      
      <button className="btn btn-primary" style={{ marginTop: '2rem' }}>
        Comenzar Ahora
      </button>
    </div>
  );
};

export default Home;