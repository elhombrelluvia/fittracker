// backend/controllers/workoutController.js
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// @desc    Obtener todos los workouts del usuario
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            workout_type,
            start_date,
            end_date,
            sort = '-date'
        } = req.query;

        let query = { user: req.user.id };

        // Filtros
        if (status) query.status = status;
        if (workout_type) query.workout_type = workout_type;
        if (start_date && end_date) {
            query.date = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            };
        }

        const workouts = await Workout.find(query)
            .populate('exercises.exercise', 'name category muscle_groups equipment')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Workout.countDocuments(query);

        res.json({
            success: true,
            data: workouts,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_workouts: total,
                per_page: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error obteniendo workouts:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Obtener un workout específico
// @route   GET /api/workouts/:id
// @access  Private
const getWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id)
            .populate('exercises.exercise', 'name category muscle_groups equipment metrics')
            .populate('user', 'name email');

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout no encontrado'
            });
        }

        // Verificar que el workout pertenece al usuario
        if (workout.user._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes acceso a este workout'
            });
        }

        res.json({
            success: true,
            data: workout
        });
    } catch (error) {
        console.error('Error obteniendo workout:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Crear un nuevo workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
    try {
        const workoutData = {
            ...req.body,
            user: req.user.id
        };

        // Validar que los ejercicios existen
        if (workoutData.exercises && workoutData.exercises.length > 0) {
            const exerciseIds = workoutData.exercises.map(ex => ex.exercise);
            const exercises = await Exercise.find({ _id: { $in: exerciseIds } });

            if (exercises.length !== exerciseIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Algunos ejercicios no existen'
                });
            }
        }
        const workout = await Workout.create(workoutData);
        res.status(201).json({
            success: true,
            data: workout
        });
    } catch (error) {
        console.error('Error creando workout:', error);
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
// @desc    Actualizar un workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout no encontrado'
            });
        }

        // Verificar que el workout pertenece al usuario
        if (workout.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes acceso a este workout'
            });
        }

        // Actualizar los datos del workout
        Object.assign(workout, req.body);
        await workout.save();

        res.json({
            success: true,
            data: workout
        });
    } catch (error) {
        console.error('Error actualizando workout:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
}
// @desc    Eliminar un workout
// @route   DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout no encontrado'
            });
        }

        // Verificar que el workout pertenece al usuario
        if (workout.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes acceso a este workout'
            });
        }

        await workout.remove();

        res.json({
            success: true,
            message: 'Workout eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando workout:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
// @desc    Agregar un set a un ejercicio en un workout
// @route   POST /api/workouts/:id/exercises/:exerciseId/sets
const addSetToExercise = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout no encontrado'
            });
        }

        // Verificar que el workout pertenece al usuario
        if (workout.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes acceso a este workout'
            });
        }

        const exerciseIndex = workout.exercises.findIndex(ex => ex.exercise.toString() === req.params.exerciseId);

        if (exerciseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado en este workout'
            });
        }

        const setData = req.body;
        workout.exercises[exerciseIndex].sets.push(setData);

        await workout.save();

        res.json({
            success: true,
            data: workout
        });
    } catch (error) {
        console.error('Error agregando set al ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
// @desc    Obtener estadísticas de workouts del usuario
// @route   GET /api/workouts/stats
const getWorkoutStats = async (req, res) => {
    try {
        const stats = await Workout.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalExercises: { $sum: { $size: '$exercises' } },
                    totalSets: { $sum: { $sum: '$exercises.sets' } },
                    totalReps: { $sum: { $sum: '$exercises.total_reps' } },
                    totalWeight: { $sum: { $sum: '$exercises.total_weight' } },
                    totalVolume: { $sum: { $sum: '$exercises.total_volume' } }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({
                success: true,
                data: {
                    totalWorkouts: 0,
                    totalExercises: 0,
                    totalSets: 0,
                    totalReps: 0,
                    totalWeight: 0,
                    totalVolume: 0
                }
            });
        }

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas de workouts:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    addSetToExercise,
    getWorkoutStats
};
