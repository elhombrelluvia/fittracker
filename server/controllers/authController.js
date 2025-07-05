// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Función para generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Función para enviar respuesta con token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      goals: user.goals,
      physicalData: user.physicalData,
      preferences: user.preferences,
      lastLogin: user.lastLogin
    }
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe con este email'
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password
    });

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        goals: user.goals,
        physicalData: user.physicalData,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Campos que se pueden actualizar
    const allowedFields = ['name', 'goals', 'physicalData', 'preferences'];
    const updates = {};

    // Solo permitir actualizar campos permitidos
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Actualizar usuario
    Object.assign(user, updates);
    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        goals: user.goals,
        physicalData: user.physicalData,
        preferences: user.preferences,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas nuevas no coinciden'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// @desc    Verificar token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
};