// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No tienes acceso a esta ruta. Token requerido.'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario y agregarlo al request
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// Middleware opcional - no requiere autenticación pero agrega usuario si existe
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En caso de error, continuar sin usuario
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
};