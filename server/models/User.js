// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  profilePicture: {
    type: String,
    default: null
  },
  // Configuración de objetivos del usuario
  goals: {
    targetWeight: {
      type: Number,
      default: null
    },
    weeklyWorkouts: {
      type: Number,
      default: 3
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },
  // Datos físicos del usuario
  physicalData: {
    height: {
      type: Number, // en cm
      default: null
    },
    weight: [{
      value: Number, // en kg
      date: {
        type: Date,
        default: Date.now
      }
    }],
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: null
    }
  },
  // Preferencias de la app
  preferences: {
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para hashear password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) return next();
  
  try {
    // Hashear password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener el peso actual
userSchema.methods.getCurrentWeight = function() {
  if (this.physicalData.weight.length === 0) return null;
  
  // Ordenar por fecha y obtener el más reciente
  const sortedWeights = this.physicalData.weight.sort((a, b) => b.date - a.date);
  return sortedWeights[0].value;
};

// Método para calcular IMC
userSchema.methods.calculateBMI = function() {
  const weight = this.getCurrentWeight();
  const height = this.physicalData.height;
  
  if (!weight || !height) return null;
  
  const heightInM = height / 100;
  return (weight / (heightInM * heightInM)).toFixed(1);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  
  // Remover datos sensibles
  delete user.password;
  delete user.__v;
  
  return user;
};

// Índices para mejorar rendimiento
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);