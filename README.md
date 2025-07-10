# 💪 FitTracker - Personal Fitness Tracking App

Una aplicación web moderna y completa para el seguimiento personal de entrenamientos, construida con React y Node.js.

## ✨ Features

### 🏠 **Dashboard Interactivo**
- Estadísticas en tiempo real de entrenamientos
- Gráficas dinámicas con Chart.js (progreso semanal, tipos de ejercicios)
- Métricas de rendimiento y accesos rápidos
- Vista general personalizada del progreso

### 💪 **Gestión de Entrenamientos**
- ✅ Crear, editar y eliminar rutinas personalizadas
- 🔍 Búsqueda y filtrado avanzado de entrenamientos
- 📊 Seguimiento de ejercicios por categorías
- 📅 Historial completo de actividades

### 👤 **Perfil de Usuario**
- Información personal completa (edad, peso, altura, objetivos)
- 📊 Calculadora automática de BMI con categorías
- 📈 Estadísticas personales de entrenamiento
- ⚖️ Seguimiento de métricas corporales

### 🎨 **Diseño Profesional**
- 📱 **Completamente responsive** - Mobile-first design
- 🌟 Interfaz moderna con sistema de diseño consistente
- 🍔 Menú hamburguesa en móviles con navegación fluida
- 🎯 Componentes reutilizables (Button, Card, Input, Modal, Skeleton)

### 🔐 **Autenticación Completa**
- Sistema de registro e inicio de sesión seguro
- JWT tokens para autenticación
- Protección de rutas y datos de usuario
- Gestión de sesiones persistentes

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Framework principal
- **React Router** - Navegación SPA
- **Chart.js** - Gráficas interactivas
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos organizados

### **Backend**
- **Node.js** - Runtime del servidor
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### **Herramientas de Desarrollo**
- **Create React App** - Configuración inicial
- **Nodemon** - Hot reload del servidor
- **CORS** - Configuración de políticas de origen cruzado

## 🚀 Installation & Setup

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/fit-tracker.git
cd fit-tracker
```

### 2. Configurar Backend
```bash
cd server
npm install

# Crear archivo .env
echo "MONGODB_URI=mongodb://localhost:27017/fittracker
JWT_SECRET=tu_jwt_secret_super_secreto
PORT=5000" > .env

# Iniciar servidor
npm run dev
```

### 3. Configurar Frontend
```bash
cd ../client
npm install

# Crear archivo .env
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Iniciar aplicación
npm start
```

### 4. ¡Listo! 🎉
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Dashboard+con+Gráficas)

### Workouts Mobile
![Workouts Mobile](https://via.placeholder.com/300x600/16A34A/FFFFFF?text=Vista+Móvil+Responsive)

### Profile & BMI
![Profile](https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Perfil+y+BMI+Calculator)

## 🏗️ Arquitectura del Proyecto

```
fit-tracker/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── ui/        # Button, Card, Input, Modal, Skeleton
│   │   │   └── charts/    # Componentes de gráficas
│   │   ├── pages/         # Páginas principales
│   │   ├── context/       # Context API (Auth)
│   │   ├── styles/        # CSS y estilos globales
│   │   └── utils/         # Utilidades y helpers
│   └── package.json
├── server/                 # Backend Node.js
│   ├── models/            # Modelos de MongoDB
│   ├── routes/            # Rutas de la API
│   ├── middleware/        # Middleware de autenticación
│   ├── controllers/       # Lógica de controladores
│   └── package.json
└── README.md
```

## 🎯 Componentes Destacados

### Button Component
```jsx
<Button 
  variant="primary" 
  size="lg" 
  loading={isLoading}
  onClick={handleClick}
>
  Crear Rutina
</Button>
```

### Card Component
```jsx
<Card 
  title="Estadísticas" 
  icon="📊"
  variant="gradient"
>
  {content}
</Card>
```

### Modal con Confirmación
```jsx
<ConfirmModal
  isOpen={showModal}
  title="Eliminar entrenamiento"
  message="¿Estás seguro?"
  onConfirm={handleDelete}
  variant="danger"
/>
```

## 📊 API Endpoints

### Authentication
```bash
POST /api/auth/register      # Registro de usuario
POST /api/auth/login         # Inicio de sesión
PUT  /api/auth/profile       # Actualizar perfil
DELETE /api/auth/profile     # Eliminar cuenta
```

### Workouts
```bash
GET    /api/workouts         # Obtener entrenamientos
POST   /api/workouts         # Crear entrenamiento
PUT    /api/workouts/:id     # Actualizar entrenamiento
DELETE /api/workouts/:id     # Eliminar entrenamiento
```

## 🎨 Sistema de Diseño

### Variables CSS
```css
:root {
  /* Colores principales */
  --primary-500: #3B82F6;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  
  /* Espaciado */
  --space-1: 0.25rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Tipografía */
  --font-sm: 0.875rem;
  --font-base: 1rem;
  --font-lg: 1.125rem;
}
```

### Breakpoints Responsive
```css
/* Mobile First */
@media (max-width: 768px)  { /* Móvil */ }
@media (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

## 🚀 Próximas Features

### 🎯 En Desarrollo
- [ ] **React Query** - Cache inteligente y sincronización
- [ ] **PWA Support** - Aplicación installable
- [ ] **Templates de Rutinas** - Rutinas predefinidas
- [ ] **Progress Photos** - Seguimiento visual con fotos

### 💡 Roadmap
- [ ] **Social Features** - Compartir rutinas con amigos
- [ ] **Gamificación** - Sistema de logros y niveles
- [ ] **Analytics Avanzados** - Reportes detallados
- [ ] **Integration APIs** - Apple Health, Google Fit
- [ ] **Export Data** - PDF reports, CSV exports

## 🤝 Contributing

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Author

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/elhombrelluvia)
- LinkedIn: 
- Email: samuel.barcena@inacapmail.cl

## 🙏 Acknowledgments

- **Chart.js** por las increíbles gráficas
- **React Community** por el ecosistema fantástico
- **MongoDB** por la base de datos flexible
- **Vercel/Netlify** para deployment fácil

---

⭐ **¡Si te gustó el proyecto, deja una estrella!** ⭐

![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)
![Responsive](https://img.shields.io/badge/Design-Responsive-orange.svg)