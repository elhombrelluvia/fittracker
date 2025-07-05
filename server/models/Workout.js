// backend/models/Workout.js
const mongoose = require('mongoose');

// Schema para sets individuales
const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    min: [0, 'Las repeticiones no pueden ser negativas']
  },
  weight: {
    type: Number,
    min: [0, 'El peso no puede ser negativo'],
    default: 0
  },
  duration: {
    type: Number, // en segundos
    min: [0, 'La duración no puede ser negativa']
  },
  distance: {
    type: Number, // en metros
    min: [0, 'La distancia no puede ser negativa']
  },
  calories: {
    type: Number,
    min: [0, 'Las calorías no pueden ser negativas']
  },
  rest_time: {
    type: Number, // tiempo de descanso en segundos
    default: 60
  },
  notes: {
    type: String,
    maxlength: [200, 'Las notas no pueden exceder 200 caracteres']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Schema para ejercicios dentro de un workout
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
    min: 1
  },
  notes: {
    type: String,
    maxlength: [300, 'Las notas no pueden exceder 300 caracteres']
  },
  // Métricas calculadas automáticamente
  total_reps: {
    type: Number,
    default: 0
  },
  total_weight: {
    type: Number,
    default: 0
  },
  total_volume: {
    type: Number, // reps * weight
    default: 0
  },
  max_weight: {
    type: Number,
    default: 0
  }
});

// Schema principal del workout
const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre del workout es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  exercises: [workoutExerciseSchema],
  // Información temporal del workout
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date
  },
  duration: {
    type: Number, // en minutos
    min: [0, 'La duración no puede ser negativa']
  },
  // Estado del workout
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'skipped'],
    default: 'planned'
  },
  // Métricas del workout
  total_exercises: {
    type: Number,
    default: 0
  },
  total_sets: {
    type: Number,
    default: 0
  },
  total_reps: {
    type: Number,
    default: 0
  },
  total_weight: {
    type: Number,
    default: 0
  },
  total_volume: {
    type: Number, // suma de reps * weight de todos los ejercicios
    default: 0
  },
  calories_burned: {
    type: Number,
    default: 0
  },
  // Categorización
  workout_type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'mixed'],
    default: 'strength'
  },
  muscle_groups_targeted: [{
    type: String,
    enum: [
      'chest', 'back', 'shoulders', 'biceps', 'triceps',
      'forearms', 'quadriceps', 'hamstrings', 'glutes',
      'calves', 'abs', 'obliques', 'traps', 'lats'
    ]
  }],
  // Datos adicionales
  notes: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Plantilla para reutilizar
  is_template: {
    type: Boolean,
    default: false
  },
  template_name: {
    type: String,
    maxlength: [100, 'El nombre de la plantilla no puede exceder 100 caracteres']
  },
  // Progreso y récords
  personal_records: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    metric: {
      type: String,
      enum: ['max_weight', 'max_reps', 'max_volume', 'best_time']
    },
    value: Number,
    previous_value: Number,
    improvement: Number
  }]
}, {
  timestamps: true
});

// Middleware para calcular métricas antes de guardar
workoutSchema.pre('save', function (next) {
  // Calcular métricas de ejercicios
  this.exercises.forEach(exercise => {
    exercise.total_reps = exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0);
    exercise.total_weight = exercise.sets.reduce((sum, set) => sum + (set.weight || 0), 0);
    exercise.total_volume = exercise.sets.reduce((sum, set) => sum + ((set.reps || 0) * (set.weight || 0)), 0);
    exercise.max_weight = Math.max(...exercise.sets.map(set => set.weight || 0));
  });

  // Calcular métricas del workout
  this.total_exercises = this.exercises.length;
  this.total_sets = this.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  this.total_reps = this.exercises.reduce((sum, exercise) => sum + exercise.total_reps, 0);
  this.total_weight = this.exercises.reduce((sum, exercise) => sum + exercise.total_weight, 0);
  this.total_volume = this.exercises.reduce((sum, exercise) => sum + exercise.total_volume, 0);

  // Calcular duración si hay start_time y end_time
  if (this.start_time && this.end_time) {
    this.duration = Math.round((this.end_time - this.start_time) / (1000 * 60)); // en minutos
  }

  next();
});

// Métodos del modelo
workoutSchema.methods.startWorkout = function () {
  this.status = 'in_progress';
  this.start_time = new Date();
  return this.save();
};

workoutSchema.methods.completeWorkout = function () {
  this.status = 'completed';
  this.end_time = new Date();
  return this.save();
};

workoutSchema.methods.addExercise = function (exercise, order) {
  this.exercises.push({
    exercise: exercise._id,
    sets: [],
    order: order || this.exercises.length + 1
  });
  return this.save();
};

workoutSchema.methods.addSet = function (exerciseIndex, setData) {
  if (this.exercises[exerciseIndex]) {
    this.exercises[exerciseIndex].sets.push(setData);
    return this.save();
  }
  throw new Error('Ejercicio no encontrado');
};

// Métodos estáticos
workoutSchema.statics.getWorkoutStats = function (userId, startDate, endDate) {
  const matchStage = {
    user: mongoose.Types.ObjectId(userId),
    status: 'completed'
  };

  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total_workouts: { $sum: 1 },
        total_exercises: { $sum: '$total_exercises' },
        total_sets: { $sum: '$total_sets' },
        total_reps: { $sum: '$total_reps' },
        total_volume: { $sum: '$total_volume' },
        avg_duration: { $avg: '$duration' },
        avg_rating: { $avg: '$rating' }
      }
    }
  ]);
};

workoutSchema.statics.getWorkoutsByDateRange = function (userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .populate('exercises.exercise')
    .sort({ date: -1 });
};

// Índices para optimizar consultas
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, status: 1 });
workoutSchema.index({ user: 1, workout_type: 1 });
workoutSchema.index({ date: -1 });
workoutSchema.index({ 'exercises.exercise': 1 });

module.exports = mongoose.model('Workout', workoutSchema);