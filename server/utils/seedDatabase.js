// server/utils/seedDatabase.js
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const { exercises } = require('./seedData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Conectado a MongoDB');

    // Limpiar ejercicios existentes que no son personalizados
    await Exercise.deleteMany({ isCustom: false });
    console.log('🧹 Ejercicios predeterminados limpiados');

    // Insertar nuevos ejercicios
    await Exercise.insertMany(exercises);
    console.log('✅ Ejercicios predeterminados insertados');

    console.log('🎉 Base de datos poblada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();