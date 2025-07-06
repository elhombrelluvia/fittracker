import React from 'react';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <h2>404 - Página no encontrada</h2>
    <p>La ruta que buscas no existe.</p>
    <p>Por favor, verifica la URL o vuelve al inicio.</p>
    <br></br>
    <br></br>
    {/* Botón para volver al inicio */}
    <a href="/" className="btn btn-primary">Volver al inicio</a>

  </div>
);

export default NotFound;