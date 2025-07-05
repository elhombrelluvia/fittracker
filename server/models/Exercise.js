// backend/models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del ejercicio es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: [
      'chest',      // Pecho
      'back',       // Espalda
      'shoulders',  // Hombros
      'arms',       // Brazos
      'legs',       // Piernas
      'core',       // Abdomen/Core
      'cardio',     // Cardio
      'full_body'   // Cuerpo completo
    ]
  },
  muscle_groups: [{
    type: String,
    enum: [
      'chest', 'back', 'shoulders', 'biceps', 'triceps',
      'forearms', 'quadriceps', 'hamstrings', 'glutes',
      'calves', 'abs', 'obliques', 'traps', 'lats'
    ]
  }],
  equipment: {
    type: String,
    enum: [
      'barbell',      // Barra
      'dumbbell',     // Mancuernas
      'machine',      // Máquina
      'cable',        // Cables
      'bodyweight',   // Peso corporal
      'kettlebell',   // Kettlebell
      'resistance_band', // Banda elástica
      'other'         // Otro
    ],
    default: 'bodyweight'
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  instructions: [String], // Array de instrucciones paso a paso
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // Métricas que se pueden trackear para este ejercicio
  metrics: {
    weight: {
      type: Boolean,
      default: true
    },
    reps: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Boolean,
      default: false
    },
    distance: {
      type: Boolean,
      default: false
    },
    calories: {
      type: Boolean,
      default: false
    }
  },
  // Ejercicio creado por un usuario o es predefinido
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Estadísticas de uso
  usage_count: {
    type: Number,
    default: 0
  },
  average_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ muscle_groups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ isCustom: 1, createdBy: 1 });

// Método para incrementar contador de uso
exerciseSchema.methods.incrementUsage = async function () {
  this.usage_count += 1;
  await this.save();
};

// Método estático para buscar ejercicios
exerciseSchema.statics.searchExercises = function (query) {
  const { category, muscle_groups, equipment, difficulty, search } = query;

  let filter = {};

  if (category) filter.category = category;
  if (muscle_groups) filter.muscle_groups = { $in: Array.isArray(muscle_groups) ? muscle_groups : [muscle_groups] };
  if (equipment) filter.equipment = equipment;
  if (difficulty) filter.difficulty = difficulty;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return this.find(filter).sort({ usage_count: -1, name: 1 });
};

// Método para obtener ejercicios populares
exerciseSchema.statics.getPopularExercises = function (limit = 10) {
  return this.find({ isCustom: false })
    .sort({ usage_count: -1, average_rating: -1 })
    .limit(limit);
};

// Método para obtener ejercicios por categoría
exerciseSchema.statics.getByCategory = function (category) {
  return this.find({ category, isCustom: false })
    .sort({ usage_count: -1, name: 1 });
};

module.exports = mongoose.model('Exercise', exerciseSchema);