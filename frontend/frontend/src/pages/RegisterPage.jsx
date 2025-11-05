// frontend/src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Obtener CSRF token
      await axios.get('/api/csrf/');
      
      // Pequeño delay para asegurar que la cookie se establezca
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Registrar usuario
      const response = await axios.post('/api/register/', formData);
      console.log('Registro exitoso:', response.data);
      
      // Redirigir al home (ya está logueado)
      navigate('/');
    } catch (error) {
      console.error('Error en el registro:', error);
      console.error('Detalles del error:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        // Manejar diferentes tipos de errores
        if (typeof errorData === 'object') {
          setErrors(errorData);
        } else {
          setErrors({ general: errorData });
        }
      } else {
        setErrors({ general: 'Error al registrar. Intenta nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
          📝 Crear Cuenta
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          Regístrate para gestionar tus tareas
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Error general */}
          {errors.general && (
            <div style={{
              padding: '12px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: errors.username ? '2px solid #f44336' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="tu_usuario"
            />
            {errors.username && (
              <span style={{ color: '#f44336', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {Array.isArray(errors.username) ? errors.username[0] : errors.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: errors.email ? '2px solid #f44336' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <span style={{ color: '#f44336', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </span>
            )}
          </div>

          {/* Nombres */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                placeholder="Nombre"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                placeholder="Apellido"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: errors.password ? '2px solid #f44336' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <span style={{ color: '#f44336', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </span>
            )}
          </div>

          {/* Password Confirm */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: errors.password_confirm ? '2px solid #f44336' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="Confirma tu contraseña"
            />
            {errors.password_confirm && (
              <span style={{ color: '#f44336', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {Array.isArray(errors.password_confirm) ? errors.password_confirm[0] : errors.password_confirm}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          color: '#666',
          fontSize: '14px'
        }}>
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: '#2196F3', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
