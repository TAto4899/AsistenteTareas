// frontend/src/pages/SharedTaskPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function SharedTaskPage() {
  const { token } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/compartido/${token}/`);
        setTask(response.data);
      } catch (err) {
        setError('Tarea no encontrada o ya no es pública');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTask();
  }, [token]);

  const getPrioridadTexto = (prioridad) => {
    const prioridades = { B: 'Baja', M: 'Media', A: 'Alta' };
    return prioridades[prioridad] || prioridad;
  };

  const getPrioridadColor = (prioridad) => {
    return prioridad === 'A' ? '#f44336' : prioridad === 'M' ? '#ff9800' : '#4caf50';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#666' }}>Cargando tarea...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Tarea no disponible</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600'
            }}
          >
            Ir a inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '32px' }}>📋</span>
            <h1 style={{ margin: 0, color: '#333' }}>Tarea Compartida</h1>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Esta tarea ha sido compartida contigo
          </p>
        </div>

        {/* Contenido de la tarea */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Título y prioridad */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h2 style={{ margin: 0, color: '#333', flex: 1 }}>
              {task.titulo}
            </h2>
            <span
              style={{
                padding: '6px 16px',
                backgroundColor: getPrioridadColor(task.prioridad),
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Prioridad: {getPrioridadTexto(task.prioridad)}
            </span>
          </div>

          {/* Estado */}
          {task.completada && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span style={{ color: '#2e7d32', fontWeight: '600' }}>
                Tarea completada
              </span>
            </div>
          )}

          {/* Descripción */}
          {task.descripcion && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase' }}>
                Descripción
              </h3>
              <p style={{ color: '#333', lineHeight: '1.6', margin: 0 }}>
                {task.descripcion}
              </p>
            </div>
          )}

          {/* Fecha de vencimiento */}
          {task.fecha_vencimiento && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase' }}>
                Fecha de vencimiento
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#333'
              }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <span>{new Date(task.fecha_vencimiento).toLocaleDateString('es-ES')}</span>
                {task.hora_vencimiento && (
                  <>
                    <span style={{ fontSize: '20px' }}>⏰</span>
                    <span>{task.hora_vencimiento}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Etiquetas */}
          {task.etiquetas && task.etiquetas.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase' }}>
                Etiquetas
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {task.etiquetas.map(tag => (
                  <span
                    key={tag.id}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: tag.color,
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {tag.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fecha de creación */}
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #e0e0e0',
            color: '#999',
            fontSize: '12px'
          }}>
            Creada el {new Date(task.creada_en).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px'
        }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            ¿Quieres gestionar tus propias tareas?
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
            }}
          >
            Crear mi cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SharedTaskPage;
