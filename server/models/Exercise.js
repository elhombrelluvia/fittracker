// server/models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del ejercicio es requerido'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full-body'],
    default: 'full-body'
  },
  muscle_groups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 
           'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'obliques']
  }],
  equipment: {
    type: String,
    enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'resistance-band', 'other'],
    default: 'bodyweight'
  },
  instructions: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.isCustom;
    }
  }
}, {
  timestamps: true
});

// Índices
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);