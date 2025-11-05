// frontend/src/components/TagManager.jsx

import { useState, useEffect } from 'react';
import axios from '../api';
import '../styles/TagManager.css';

function TagManager({ isOpen, onClose, onTagsUpdated }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    color: '#3b82f6'
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const colorOptions = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Amarillo', value: '#f59e0b' },
    { name: 'Morado', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Índigo', value: '#6366f1' },
    { name: 'Naranja', value: '#f97316' },
    { name: 'Turquesa', value: '#06b6d4' },
    { name: 'Lima', value: '#84cc16' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/etiquetas/');
      setTags(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
      setError('Error al cargar las etiquetas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/etiquetas/${editingId}/`, formData);
      } else {
        await axios.post('/api/etiquetas/', formData);
      }
      
      setFormData({ nombre: '', color: '#3b82f6' });
      setEditingId(null);
      fetchTags();
      if (onTagsUpdated) onTagsUpdated();
    } catch (error) {
      console.error('Error al guardar etiqueta:', error);
      setError(error.response?.data?.nombre?.[0] || 'Error al guardar la etiqueta');
    }
  };

  const handleEdit = (tag) => {
    setFormData({
      nombre: tag.nombre,
      color: tag.color
    });
    setEditingId(tag.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta etiqueta?')) return;

    try {
      await axios.delete(`/api/etiquetas/${id}/`);
      fetchTags();
      if (onTagsUpdated) onTagsUpdated();
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error);
      setError('Error al eliminar la etiqueta');
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', color: '#3b82f6' });
    setEditingId(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tag-manager" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏷️ Gestión de Etiquetas</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="tag-form">
            <div className="form-row">
              <div className="form-group flex-grow">
                <input
                  type="text"
                  placeholder="Nombre de la etiqueta"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  maxLength="50"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <div className="color-picker">
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="form-control color-select"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                {editingId ? '✓' : '+'}
              </button>
              
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  ✕
                </button>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
          </form>

          {/* Lista de etiquetas */}
          <div className="tags-list">
            {loading ? (
              <div className="loading">Cargando etiquetas...</div>
            ) : tags.length === 0 ? (
              <div className="empty-state">
                <p>No hay etiquetas creadas</p>
                <small>Crea tu primera etiqueta arriba</small>
              </div>
            ) : (
              <div className="tags-grid">
                {tags.map(tag => (
                  <div key={tag.id} className="tag-item">
                    <div className="tag-badge" style={{ backgroundColor: tag.color }}>
                      {tag.nombre}
                    </div>
                    <div className="tag-actions">
                      <button 
                        onClick={() => handleEdit(tag)} 
                        className="btn-icon"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(tag.id)} 
                        className="btn-icon"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagManager;
