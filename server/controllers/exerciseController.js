// backend/controllers/exerciseController.js
const Exercise = require('../models/Exercise');

// @desc    Obtener todos los ejercicios
// @route   GET /api/exercises
// @access  Public
const getExercises = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            muscle_groups,
            equipment,
            difficulty,
            search,
            user_only
        } = req.query;

        let query = {};

        // Filtros
        if (category) query.category = category;
        if (muscle_groups) {
            query.muscle_groups = { $in: Array.isArray(muscle_groups) ? muscle_groups : [muscle_groups] };
        }
        if (equipment) query.equipment = equipment;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Solo ejercicios del usuario si está autenticado y solicita user_only
        if (user_only && req.user) {
            query.$or = [
                { isCustom: false },
                { isCustom: true, createdBy: req.user.id }
            ];
        } else {
            // Solo ejercicios públicos si no está autenticado
            query.isCustom = false;
        }

        const exercises = await Exercise.find(query)
            .sort({ usage_count: -1, name: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'name');

        const total = await Exercise.countDocuments(query);

        res.json({
            success: true,
            data: exercises,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_exercises: total,
                per_page: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error obteniendo ejercicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Obtener categorías de ejercicios
// @route   GET /api/exercises/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Exercise.distinct('category');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};



// @desc    Obtener un ejercicio específico
// @route   GET /api/exercises/:id
// @access  Public
const getExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id)
            .populate('createdBy', 'name');

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado'
            });
        }

        // Verificar si es un ejercicio personalizado y el usuario tiene acceso
        if (exercise.isCustom && exercise.createdBy &&
            (!req.user || exercise.createdBy._id.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes acceso a este ejercicio'
            });
        }

        res.json({
            success: true,
            data: exercise
        });
    } catch (error) {
        console.error('Error obteniendo ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Crear un nuevo ejercicio personalizado
// @route   POST /api/exercises
// @access  Private
const createExercise = async (req, res) => {
    try {
        const exerciseData = {
            ...req.body,
            isCustom: true,
            createdBy: req.user.id
        };

        const exercise = await Exercise.create(exerciseData);

        res.status(201).json({
            success: true,
            message: 'Ejercicio creado exitosamente',
            data: exercise
        });
    } catch (error) {
        console.error('Error creando ejercicio:', error);

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

// @desc    Actualizar ejercicio personalizado
// @route   PUT /api/exercises/:id
// @access  Private
const updateExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado'
            });
        }

        // Verificar que el usuario es el creador del ejercicio
        if (!exercise.isCustom || exercise.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para actualizar este ejercicio'
            });
        }

        const updatedExercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Ejercicio actualizado exitosamente',
            data: updatedExercise
        });
    } catch (error) {
        console.error('Error actualizando ejercicio:', error);

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

// @desc    Eliminar ejercicio personalizado
// @route   DELETE /api/exercises/:id
// @access  Private
const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado'
            });
        }

        // Verificar que el usuario es el creador del ejercicio
        if (!exercise.isCustom || exercise.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este ejercicio'
            });
        }

        await Exercise.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Ejercicio eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Obtener ejercicios por categoría
// @route   GET /api/exercises/category/:category
// @access  Public
const getExercisesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 20 } = req.query;

        const exercises = await Exercise.getByCategory(category)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: exercises,
            category: category
        });
    } catch (error) {
        console.error('Error obteniendo ejercicios por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Obtener ejercicios populares
// @route   GET /api/exercises/popular
// @access  Public
const getPopularExercises = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const exercises = await Exercise.getPopularExercises(parseInt(limit));

        res.json({
            success: true,
            data: exercises
        });
    } catch (error) {
        console.error('Error obteniendo ejercicios populares:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Buscar ejercicios
// @route   GET /api/exercises/search
// @access  Public
const searchExercises = async (req, res) => {
    try {
        const exercises = await Exercise.searchExercises(req.query);

        res.json({
            success: true,
            data: exercises,
            query: req.query
        });
    } catch (error) {
        console.error('Error buscando ejercicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// @desc    Obtener estadísticas de ejercicios
// @route   GET /api/exercises/stats
// @access  Public
const getExerciseStats = async (req, res) => {
    try {
        const stats = await Exercise.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avg_usage: { $avg: '$usage_count' },
                    avg_rating: { $avg: '$average_rating' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const totalExercises = await Exercise.countDocuments();
        const customExercises = await Exercise.countDocuments({ isCustom: true });

        res.json({
            success: true,
            data: {
                total_exercises: totalExercises,
                custom_exercises: customExercises,
                predefined_exercises: totalExercises - customExercises,
                categories: stats
            }
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

module.exports = {
    getExercises,
    getExercise,
    createExercise,
    updateExercise,
    deleteExercise,
    getExercisesByCategory,
    getPopularExercises,
    searchExercises,
    getExerciseStats,
    getCategories
};