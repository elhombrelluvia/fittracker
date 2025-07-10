import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import CreateWorkout from './components/workouts/CreateWorkout';
import EditWorkout from './components/workouts/EditWorkout';

import PrivateRoute from './components/PrivateRoute';

import './styles/global.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workouts/create" element={<CreateWorkout />} />
              <Route path="/workouts/:id/edit" element={<EditWorkout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;