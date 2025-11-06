// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SharedTaskPage from './pages/SharedTaskPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        ⏳ Cargando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />

        {/* Ruta de Registro */}
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* Ruta Principal (Tareas) */}
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Ruta para tarea compartida (pública) */}
        <Route
          path="/compartido/:token"
          element={<SharedTaskPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;