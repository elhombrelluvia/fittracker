// server/models/Workout.js
const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: [true, 'Las repeticiones son requeridas'],
    min: [1, 'Mínimo 1 repetición']
  },
  weight: {
    type: Number,
    required: [true, 'El peso es requerido'],
    min: [0, 'El peso no puede ser negativo']
  },
  duration: {
    type: Number, // en segundos
    default: 0
  },
  restTime: {
    type: Number, // en segundos
    default: 60
  },
  rpe: {
    type: Number, // Rate of Perceived Exertion (1-10)
    min: [1, 'RPE mínimo 1'],
    max: [10, 'RPE máximo 10']
  },
  notes: {
    type: String,
    trim: true
  }
});

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: [true, 'El ejercicio es requerido']
  },
  sets: [setSchema],
  order: {
    type: Number,
    required: true,
    min: [1, 'El orden debe ser mayor a 0']
  },
  superset: {
    type: String, // ID del superset si aplica
    default: null
  },
  notes: {
    type: String,
    trim: true
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre del entrenamiento es requerido'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [workoutExerciseSchema],
  duration: {
    type: Number, // en minutos
    required: [true, 'La duración es requerida'],
    min: [1, 'Duración mínima 1 minuto']
  },
  totalVolume: {
    type: Number, // peso total levantado
    default: 0
  },
  totalReps: {
    type: Number,
    default: 0
  },
  totalSets: {
    type: Number,
    default: 0
  },
  bodyweight: {
    type: Number, // peso corporal del día
    min: [30, 'Peso corporal mínimo 30kg']
  },
  notes: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'terrible'],
    default: 'average'
  },
  energy: {
    type: String,
    enum: ['very-high', 'high', 'medium', 'low', 'very-low'],
    default: 'medium'
  },
  location: {
    type: String,
    enum: ['gym', 'home', 'outdoor', 'other'],
    default: 'gym'
  },
  completed: {
    type: Boolean,
    default: false
  },
  template: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware para calcular estadísticas antes de guardar
workoutSchema.pre('save', function(next) {
  let totalVolume = 0;
  let totalReps = 0;
  let totalSets = 0;

  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      totalVolume += set.weight * set.reps;
      totalReps += set.reps;
      totalSets += 1;
    });
  });

  this.totalVolume = totalVolume;
  this.totalReps = totalReps;
  this.totalSets = totalSets;
  
  next();
});

// Índices para optimizar consultas
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, completed: 1 });
workoutSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Workout', workoutSchema);