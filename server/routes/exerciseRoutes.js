const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getCategories,
  getPopularExercises
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas
router.use(protect);

// Validaciones para crear/actualizar ejercicios
const exerciseValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('category')
    .isIn(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full-body'])
    .withMessage('Categoría no válida'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Nivel de dificultad no válido'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('instructions')
    .optional()
    .isArray()
    .withMessage('Las instrucciones deben ser un array'),
  
  body('instructions.*')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Cada instrucción no puede exceder 200 caracteres'),
  
  body('targetMuscles')
    .optional()
    .isArray()
    .withMessage('Los músculos objetivo deben ser un array'),
  
  body('equipment')
    .optional()
    .isIn(['bodyweight', 'dumbbells', 'barbell', 'machine', 'resistance-bands', 'other'])
    .withMessage('Equipo no válido')
];

// Rutas específicas (deben ir antes de las rutas con parámetros)
router.get('/categories', getCategories);
router.get('/popular', getPopularExercises);

// Rutas principales
router.route('/')
  .get(getExercises)
  .post(exerciseValidation, createExercise);

router.route('/:id')
  .get(getExercise)
  .put(exerciseValidation, updateExercise)
  .delete(deleteExercise);

module.exports = router;