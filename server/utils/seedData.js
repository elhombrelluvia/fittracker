// server/utils/seedData.js
const exercises = [
  {
    name: 'Push-ups',
    category: 'chest',
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight',
    instructions: 'Colócate en posición de plancha, baja el cuerpo hasta casi tocar el suelo, luego empuja hacia arriba.',
    difficulty: 'beginner'
  },
  {
    name: 'Squats',
    category: 'legs',
    muscle_groups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: 'bodyweight',
    instructions: 'Baja como si te fueras a sentar, mantén la espalda recta, luego sube.',
    difficulty: 'beginner'
  },
  {
    name: 'Bench Press',
    category: 'chest',
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    instructions: 'Acuéstate en el banco, baja la barra hasta el pecho, luego empuja hacia arriba.',
    difficulty: 'intermediate'
  },
  {
    name: 'Deadlift',
    category: 'back',
    muscle_groups: ['back', 'glutes', 'hamstrings'],
    equipment: 'barbell',
    instructions: 'Levanta la barra desde el suelo manteniendo la espalda recta.',
    difficulty: 'intermediate'
  },
  {
    name: 'Pull-ups',
    category: 'back',
    muscle_groups: ['back', 'biceps'],
    equipment: 'bodyweight',
    instructions: 'Cuélgate de la barra y levanta tu cuerpo hasta que la barbilla pase la barra.',
    difficulty: 'intermediate'
  },
  {
    name: 'Plank',
    category: 'core',
    muscle_groups: ['abs', 'obliques'],
    equipment: 'bodyweight',
    instructions: 'Mantén la posición de plancha con el cuerpo recto.',
    difficulty: 'beginner'
  }
];

module.exports = { exercises };