// backend/seeders/seedExercises.js
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
require('dotenv').config();

const exercises = [
  // PECHO
  {
    name: 'Push-ups',
    category: 'chest',
    difficulty: 'beginner',
    description: 'Flexiones de pecho clásicas para fortalecer el pecho, hombros y tríceps',
    instructions: [
      'Colócate en posición de plancha con las manos separadas al ancho de los hombros',
      'Mantén el cuerpo recto desde la cabeza hasta los pies',
      'Baja el pecho hacia el suelo flexionando los codos',
      'Empuja hacia arriba hasta la posición inicial'
    ],
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight'
  },
  {
    name: 'Bench Press',
    category: 'chest',
    difficulty: 'intermediate',
    description: 'Press de banca con barra para desarrollar fuerza en el pecho',
    instructions: [
      'Acuéstate en el banco con los pies firmes en el suelo',
      'Agarra la barra con las manos más anchas que los hombros',
      'Baja la barra controladamente hasta tocar el pecho',
      'Presiona la barra hacia arriba hasta extender completamente los brazos'
    ],
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell'
  },
  {
    name: 'Dumbbell Flyes',
    category: 'chest',
    difficulty: 'intermediate',
    description: 'Aperturas con mancuernas para aislar el pecho',
    instructions: [
      'Acuéstate en el banco con una mancuerna en cada mano',
      'Extiende los brazos hacia arriba con una ligera flexión en los codos',
      'Baja las mancuernas hacia los lados en un movimiento de arco',
      'Contrae el pecho para volver a la posición inicial'
    ],
    muscle_groups: ['chest'],
    equipment: 'dumbbell'
  },

  // ESPALDA
  {
    name: 'Pull-ups',
    category: 'back',
    difficulty: 'intermediate',
    description: 'Dominadas para fortalecer la espalda y bíceps',
    instructions: [
      'Cuelga de una barra con las manos separadas al ancho de los hombros',
      'Mantén el cuerpo recto y los músculos del core activos',
      'Tira hacia arriba hasta que la barbilla pase la barra',
      'Baja controladamente hasta la posición inicial'
    ],
    muscle_groups: ['back', 'biceps', 'lats'],
    equipment: 'bodyweight'
  },
  {
    name: 'Deadlifts',
    category: 'back',
    difficulty: 'advanced',
    description: 'Peso muerto, ejercicio compuesto para espalda y piernas',
    instructions: [
      'Párate con los pies separados al ancho de las caderas',
      'Agarra la barra con las manos separadas al ancho de los hombros',
      'Mantén la espalda recta y levanta la barra extendiendo las caderas',
      'Baja la barra controladamente hasta la posición inicial'
    ],
    muscle_groups: ['back', 'glutes', 'hamstrings'],
    equipment: 'barbell'
  },

  // HOMBROS
  {
    name: 'Overhead Press',
    category: 'shoulders',
    difficulty: 'intermediate',
    description: 'Press militar para desarrollar los hombros',
    instructions: [
      'Párate con los pies separados al ancho de las caderas',
      'Sostén la barra a la altura de los hombros',
      'Presiona la barra hacia arriba hasta extender completamente los brazos',
      'Baja controladamente hasta la posición inicial'
    ],
    muscle_groups: ['shoulders', 'triceps', 'traps'],
    equipment: 'barbell'
  },
  {
    name: 'Lateral Raises',
    category: 'shoulders',
    difficulty: 'beginner',
    description: 'Elevaciones laterales para los deltoides laterales',
    instructions: [
      'Párate con una mancuerna en cada mano a los lados del cuerpo',
      'Levanta los brazos hacia los lados hasta la altura de los hombros',
      'Mantén una ligera flexión en los codos',
      'Baja controladamente hasta la posición inicial'
    ],
    muscle_groups: ['shoulders'],
    equipment: 'dumbbell'
  },

  // BRAZOS
  {
    name: 'Bicep Curls',
    category: 'arms',
    difficulty: 'beginner',
    description: 'Curl de bíceps con mancuernas',
    instructions: [
      'Párate con una mancuerna en cada mano, brazos extendidos',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los codos para levantar las mancuernas',
      'Baja controladamente hasta la posición inicial'
    ],
    muscle_groups: ['biceps'],
    equipment: 'dumbbell'
  },
  {
    name: 'Tricep Dips',
    category: 'arms',
    difficulty: 'intermediate',
    description: 'Fondos de tríceps en banco o silla',
    instructions: [
      'Siéntate en el borde de un banco con las manos al lado de las caderas',
      'Desliza el cuerpo hacia adelante y baja los glúteos',
      'Flexiona los codos para bajar el cuerpo',
      'Empuja hacia arriba para volver a la posición inicial'
    ],
    muscle_groups: ['triceps', 'shoulders'],
    equipment: 'bodyweight'
  }
];

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Exercise.deleteMany({});
    console.log('Ejercicios anteriores eliminados');

    const inserted = await Exercise.insertMany(exercises);
    console.log(`Se insertaron ${inserted.length} ejercicios`);

    process.exit(0);
  } catch (error) {
    console.error('Error al hacer seed de ejercicios:', error);
    process.exit(1);
  }
};

seedExercises();
