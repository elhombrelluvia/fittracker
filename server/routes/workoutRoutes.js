// backend/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addSetToExercise,
  getWorkoutStats
} = require('../controllers/workoutController');

const { protect } = require('../middleware/authMiddleware');

// Todas las rutas son privadas (requieren token)
router.use(protect);

// Obtener todas los workouts del usuario con filtros y paginación
router.get('/', getWorkouts);

// Obtener estadísticas de workouts
router.get('/stats', getWorkoutStats);

// Crear nuevo workout
router.post('/', createWorkout);

// Rutas con ID de workout
router.route('/:id')
  .get(getWorkout)        // Obtener workout por id
  .put(updateWorkout)     // Actualizar workout por id
  .delete(deleteWorkout); // Eliminar workout por id

// Agregar set a un ejercicio dentro de un workout
router.post('/:id/exercises/:exerciseId/sets', addSetToExercise);

module.exports = router;
