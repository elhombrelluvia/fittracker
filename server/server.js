// server/server.js (actualizar)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar modelos
const User = require('./models/User');
const Exercise = require('./models/Exercise');
const Workout = require('./models/Workout');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas básicas
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'FitTracker API funcionando! 💪',
    timestamp: new Date().toISOString(),
    models: {
      User: 'User model loaded',
      Exercise: 'Exercise model loaded',
      Workout: 'Workout model loaded'
    }
  });
});

// Ruta para obtener ejercicios (temporal para probar)
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find({ isCustom: false });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});