// backend/routes/authRoutes.js
const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/verify', protect, verifyToken);

module.exports = router;