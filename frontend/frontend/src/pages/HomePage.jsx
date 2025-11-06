// frontend/src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import TagManager from '../components/TagManager';
import Notifications from '../components/Notifications';
import ProductivityCharts from '../components/ProductivityCharts';
import InstallPWA from '../components/InstallPWA';
import ShareTaskModal from '../components/ShareTaskModal';
import SubtasksList from '../components/SubtasksList';
import ThemeSelector from '../components/ThemeSelector';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para cada tarea arrastrable
function SortableTask({ task, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function HomePage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [statistics, setStatistics] = useState(null);
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'M',
    fecha_vencimiento: '',
    hora_vencimiento: '',
    etiquetas: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
  const [filterPriority, setFilterPriority] = useState('all'); // all, B, M, A
  const [filterTag, setFilterTag] = useState('all'); // all, tag_id
  const [sortBy, setSortBy] = useState('created'); // created, priority, due_date

  // Estados para etiquetas
  const [availableTags, setAvailableTags] = useState([]);
  const [showTagManager, setShowTagManager] = useState(false);

  // Estado para modal de compartir
  const [shareTask, setShareTask] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Estado para selector de temas
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Debounce para búsqueda (espera 300ms después de que el usuario deje de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cargar tareas y estadísticas al inicio
  useEffect(() => {
    const initData = async () => {
      // Asegurar que tenemos el CSRF token antes de hacer peticiones
      try {
        await axios.get('/api/csrf/');
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error al obtener CSRF:', error);
      }
      
      fetchTasks();
      fetchStatistics();
      fetchTags();
    };
    
    initData();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tareas/');
      // Django REST Framework devuelve datos paginados con esta estructura:
      // { count: X, next: url, previous: url, results: [...] }
      const tasksData = response.data.results || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      setError('Error al cargar las tareas');
      setTasks([]); // Asegurar que tasks sea un array
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/tareas/estadisticas/');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/etiquetas/');
      setAvailableTags(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await axios.put(`/api/tareas/${editingId}/`, formData);
        showSuccess('Tarea actualizada correctamente');
      } else {
        await axios.post('/api/tareas/', formData);
        showSuccess('Tarea creada correctamente');
      }
      
      setFormData({ titulo: '', descripcion: '', prioridad: 'M', fecha_vencimiento: '' });
      setShowForm(false);
      setEditingId(null);
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = typeof errorData === 'string' 
          ? errorData 
          : Object.values(errorData).flat().join(', ');
        setError(errorMessage || 'Error al guardar la tarea');
      } else {
        setError('Error al guardar la tarea');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await axios.delete(`/api/tareas/${id}/`);
      showSuccess('Tarea eliminada correctamente');
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setError('Error al eliminar la tarea');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.patch(`/api/tareas/${task.id}/`, {
        completada: !task.completada,
      });
      
      // Actualizar inmediatamente el estado local para mejor UX
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, completada: !t.completada } : t
        )
      );
      
      // Luego refrescar desde el servidor
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      console.error('Detalles del error:', error.response?.data);
      
      // Mostrar error específico si existe
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = typeof errorData === 'string' 
          ? errorData 
          : JSON.stringify(errorData);
        setError(`Error al actualizar: ${errorMessage}`);
      } else {
        setError('Error al actualizar la tarea');
      }
    }
  };

  // Nueva función: Limpiar tareas completadas
  const handleClearCompleted = async () => {
    if (!Array.isArray(tasks)) {
      setError('Error al cargar tareas');
      return;
    }
    
    const completedCount = tasks.filter(t => t.completada).length;
    
    if (completedCount === 0) {
      setError('No hay tareas completadas para eliminar');
      return;
    }

    if (!window.confirm(`¿Eliminar ${completedCount} tarea(s) completada(s)?`)) return;
    
    try {
      const response = await axios.delete('/api/tareas/limpiar_completadas/');
      showSuccess(response.data.detail);
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      console.error('Error al limpiar tareas:', error);
      setError('Error al limpiar tareas completadas');
    }
  };

  const handleShare = (task) => {
    setShareTask(task);
    setShowShareModal(true);
  };

  const handleEdit = (task) => {
    setFormData({
      titulo: task.titulo,
      descripcion: task.descripcion || '',
      prioridad: task.prioridad,
      fecha_vencimiento: task.fecha_vencimiento || '',
      hora_vencimiento: task.hora_vencimiento || '',
      etiquetas: task.etiquetas?.map(tag => tag.id) || [],
    });
    setEditingId(task.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setFormData({ titulo: '', descripcion: '', prioridad: 'M', fecha_vencimiento: '', hora_vencimiento: '', etiquetas: [] });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  // Función para exportar tareas a CSV
  const exportToCSV = () => {
    const tasksToExport = getFilteredTasks();
    
    if (tasksToExport.length === 0) {
      setError('No hay tareas para exportar');
      return;
    }

    // Encabezados del CSV
    const headers = ['Título', 'Descripción', 'Prioridad', 'Estado', 'Fecha Vencimiento', 'Hora', 'Etiquetas', 'Creada', 'Vencida'];
    
    // Convertir tareas a filas CSV
    const rows = tasksToExport.map(task => {
      const etiquetas = task.etiquetas?.map(tag => tag.nombre).join('; ') || '';
      const estado = task.completada ? 'Completada' : 'Pendiente';
      const prioridad = getPrioridadTexto(task.prioridad);
      const vencida = isOverdue(task) ? 'Sí' : 'No';
      const fechaCreada = new Date(task.creada_en).toLocaleDateString('es-ES');
      
      return [
        `"${task.titulo}"`,
        `"${task.descripcion || ''}"`,
        prioridad,
        estado,
        task.fecha_vencimiento || '',
        task.hora_vencimiento || '',
        `"${etiquetas}"`,
        fechaCreada,
        vencida
      ].join(',');
    });

    // Combinar encabezados y filas
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Crear el archivo y descargarlo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `tareas_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess(`${tasksToExport.length} tarea(s) exportadas a CSV`);
  };

  const getPrioridadTexto = (prioridad) => {
    const prioridades = { B: 'Baja', M: 'Media', A: 'Alta' };
    return prioridades[prioridad] || prioridad;
  };

  const getPrioridadColor = (prioridad) => {
    return prioridad === 'A' ? '#f44336' : prioridad === 'M' ? '#ff9800' : '#4caf50';
  };

  // Función para verificar si la tarea está vencida
  const isOverdue = (task) => {
    if (!task.fecha_vencimiento || task.completada) return false;
    const today = new Date();
    const dueDate = new Date(task.fecha_vencimiento);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Filtrar y ordenar tareas
  const getFilteredTasks = () => {
    // Asegurar que tasks sea un array
    if (!Array.isArray(tasks)) {
      return [];
    }
    
    let filtered = [...tasks];

    // Filtrar por búsqueda (con debounce)
    if (debouncedSearchTerm) {
      filtered = filtered.filter(task =>
        task.titulo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (task.descripcion && task.descripcion.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    // Filtrar por estado
    if (filterStatus === 'pending') {
      filtered = filtered.filter(task => !task.completada);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.completada);
    }

    // Filtrar por prioridad
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.prioridad === filterPriority);
    }

    // Filtrar por etiqueta
    if (filterTag !== 'all') {
      filtered = filtered.filter(task => 
        task.etiquetas && task.etiquetas.some(tag => tag.id === parseInt(filterTag))
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'A': 3, 'M': 2, 'B': 1 };
        return priorityOrder[b.prioridad] - priorityOrder[a.prioridad];
      } else if (sortBy === 'due_date') {
        if (!a.fecha_vencimiento) return 1;
        if (!b.fecha_vencimiento) return -1;
        return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
      } else {
        // Por fecha de creación (más reciente primero)
        return new Date(b.creada_en) - new Date(a.creada_en);
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Configuración de sensores para Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manejar el final del drag
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredTasks.findIndex(task => task.id === over.id);

      const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      
      // Actualizar el estado local inmediatamente para una UI fluida
      const allTasks = tasks.map(task => {
        const reordered = reorderedTasks.find(t => t.id === task.id);
        return reordered || task;
      });
      setTasks(allTasks);

      // Crear el payload con los nuevos órdenes
      const ordenes = reorderedTasks.map((task, index) => ({
        id: task.id,
        orden: index
      }));

      // Enviar al backend
      try {
        await axios.post('/api/tareas/reordenar/', { ordenes });
        showSuccess('Orden actualizado');
      } catch (error) {
        console.error('Error al reordenar:', error);
        setError('Error al guardar el orden');
        // Revertir en caso de error
        fetchTasks();
      }
    }
  };

  // Usar estadísticas del backend o calcular localmente
  const stats = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    completed: Array.isArray(tasks) ? tasks.filter(t => t.completada).length : 0,
    pending: Array.isArray(tasks) ? tasks.filter(t => !t.completada).length : 0,
    overdue: Array.isArray(tasks) ? tasks.filter(t => isOverdue(t)).length : 0,
    proximas_vencer: statistics?.proximas_vencer,
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>📝 Mis Tareas</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>👤 {user.username}</span>
          
          {/* Botón Modo Oscuro */}
          <button 
            onClick={toggleDarkMode}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {/* Botón Selector de Temas */}
          <button 
            onClick={() => setShowThemeSelector(true)}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: '500'
            }}
            title="Cambiar tema de colores"
          >
            🎨 Temas
          </button>
          
          <button 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: darkMode ? '#1e3a5f' : '#e3f2fd',
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${darkMode ? '#2c5aa0' : 'transparent'}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#64b5f6' : '#1976d2' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total</div>
        </div>
        <div style={{ 
          backgroundColor: darkMode ? '#4a3a1f' : '#fff3e0',
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${darkMode ? '#6d5428' : 'transparent'}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#ffb74d' : '#f57c00' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pendientes</div>
        </div>
        <div style={{ 
          backgroundColor: darkMode ? '#1f3a2f' : '#e8f5e9',
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${darkMode ? '#2e5c47' : 'transparent'}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#81c784' : '#388e3c' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completadas</div>
        </div>
        <div style={{ 
          backgroundColor: darkMode ? '#4a1f1f' : '#ffebee',
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid ${darkMode ? '#6d2828' : 'transparent'}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#e57373' : '#d32f2f' }}>
            {stats.vencidas || stats.overdue}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vencidas</div>
        </div>
        {statistics?.proximas_vencer !== undefined && (
          <div style={{ 
            backgroundColor: darkMode ? '#4a4a1f' : '#fff9c4',
            padding: '15px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: `1px solid ${darkMode ? '#6d6d28' : 'transparent'}`
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#ffd54f' : '#f57f17' }}>
              {statistics.proximas_vencer}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Próximas (7d)</div>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: darkMode ? '#4a1f1f' : '#ffebee',
          color: darkMode ? '#ef5350' : '#c62828',
          marginBottom: '20px', 
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: `1px solid ${darkMode ? '#6d2828' : 'transparent'}`
        }}>
          {error}
          <button onClick={() => setError('')} style={{ 
            background: 'none', 
            border: 'none',
            color: '#c62828', 
            cursor: 'pointer',
            fontSize: '18px'
          }}>×</button>
        </div>
      )}

      {successMessage && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32', 
          marginBottom: '20px', 
          borderRadius: '4px',
          animation: 'fadeIn 0.3s'
        }}>
          ✓ {successMessage}
        </div>
      )}

      {/* Gráficos de Productividad */}
      {!loadingTasks && tasks.length > 0 && (
        <ProductivityCharts tasks={tasks} />
      )}

      {/* Botón Nueva Tarea y Limpiar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: showForm ? '#757575' : '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Tarea'}
        </button>
        
        {stats.completed > 0 && (
          <button 
            onClick={handleClearCompleted}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#ff9800', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            🗑️ Limpiar Completadas ({stats.completed})
          </button>
        )}

        {tasks.length > 0 && (
          <button 
            onClick={exportToCSV}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
            title="Exportar tareas actuales a archivo CSV"
          >
            📥 Exportar CSV
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #2196F3'
        }}>
          <h3 style={{ marginTop: 0 }}>
            {editingId ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
              placeholder="Ej: Comprar víveres"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              placeholder="Detalles adicionales..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Prioridad
              </label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc'
                }}
              >
                <option value="B">🟢 Baja</option>
                <option value="M">🟡 Media</option>
                <option value="A">🔴 Alta</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                ⏰ Hora de Vencimiento (opcional)
              </label>
              <input
                type="time"
                name="hora_vencimiento"
                value={formData.hora_vencimiento}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc'
                }}
              />
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                Útil para recibir notificaciones precisas
              </small>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              🏷️ Etiquetas
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                multiple
                value={formData.etiquetas}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  setFormData({ ...formData, etiquetas: selected });
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  minHeight: '80px'
                }}
              >
                {availableTags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowTagManager(true)}
                style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#673ab7', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: '500'
                }}
                title="Gestionar etiquetas"
              >
                ⚙️
              </button>
            </div>
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              Mantén Ctrl (Cmd en Mac) para seleccionar múltiples
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {editingId ? '💾 Actualizar' : '➕ Crear'}
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#757575', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {/* Búsqueda */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              🔍 Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filtro Estado */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>
          </div>

          {/* Filtro Prioridad */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              Prioridad
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">Todas</option>
              <option value="A">🔴 Alta</option>
              <option value="M">🟡 Media</option>
              <option value="B">🟢 Baja</option>
            </select>
          </div>

          {/* Filtro Etiqueta */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              🏷️ Etiqueta
            </label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">Todas</option>
              {availableTags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="created">Fecha creación</option>
              <option value="priority">Prioridad</option>
              <option value="due_date">Fecha vencimiento</option>
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterTag !== 'all' || sortBy !== 'created') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterPriority('all');
              setFilterTag('all');
              setSortBy('created');
            }}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de Tareas */}
      <div>
        <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea' : 'tareas'}
          {searchTerm && ` con "${searchTerm}"`}
          {sortBy === 'created' && !searchTerm && !filterStatus && !filterPriority && !filterTag && (
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '10px' }}>
              🔀 Arrastra para reordenar
            </span>
          )}
        </h3>
        
        {loadingTasks ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div>⏳ Cargando tareas...</div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📋</div>
            <div>
              {tasks.length === 0 
                ? 'No tienes tareas. ¡Crea tu primera tarea!' 
                : 'No hay tareas que coincidan con los filtros'}
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map((task) => (
                <SortableTask key={task.id} task={task}>
                  <div 
                key={task.id}
                style={{
                  backgroundColor: task.completada ? '#e8f5e9' : 'white',
                  border: `2px solid ${isOverdue(task) ? '#f44336' : '#ddd'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '12px',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completada}
                    onChange={() => handleToggleComplete(task)}
                    style={{ 
                      marginTop: '3px', 
                      cursor: 'pointer', 
                      width: '20px', 
                      height: '20px',
                      accentColor: '#4caf50'
                    }}
                  />
                  
                  {/* Contenido */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h4 style={{ 
                        margin: 0,
                        textDecoration: task.completada ? 'line-through' : 'none',
                        color: task.completada ? '#757575' : '#000',
                        fontSize: '18px'
                      }}>
                        {task.titulo}
                      </h4>
                      
                      {/* Badge de prioridad */}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: getPrioridadColor(task.prioridad),
                        color: 'white'
                      }}>
                        {getPrioridadTexto(task.prioridad)}
                      </span>

                      {/* Badge vencida */}
                      {isOverdue(task) && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: '#f44336',
                          color: 'white'
                        }}>
                          ⚠️ VENCIDA
                        </span>
                      )}
                    </div>
                    
                    {task.descripcion && (
                      <p style={{ 
                        margin: '0 0 10px 0', 
                        color: '#666', 
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {task.descripcion}
                      </p>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      fontSize: '12px', 
                      color: '#888',
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}>
                      {task.fecha_vencimiento && (
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px'
                        }}>
                          📅 {new Date(task.fecha_vencimiento).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                          {task.hora_vencimiento && (
                            <span style={{ marginLeft: '4px' }}>
                              ⏰ {task.hora_vencimiento.substring(0, 5)}
                            </span>
                          )}
                        </span>
                      )}
                      <span>
                        🕐 Creada: {new Date(task.creada_en).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                      {/* Etiquetas */}
                      {task.etiquetas && task.etiquetas.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {task.etiquetas.map(tag => (
                            <span
                              key={tag.id}
                              style={{
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600',
                                backgroundColor: tag.color,
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                              }}
                            >
                              {tag.nombre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtareas/Checklist */}
                  <SubtasksList task={task} onUpdate={fetchTasks} />
                  
                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexDirection: 'column' }}>
                    <button
                      onClick={() => handleToggleComplete(task)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: task.completada ? '#ff9800' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      title={task.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {task.completada ? '↩️ Pendiente' : '✓ Completar'}
                    </button>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleEdit(task)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                        title="Editar tarea"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleShare(task)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#9C27B0',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                        title="Compartir tarea"
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                        title="Eliminar tarea"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                </SortableTask>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal de Gestión de Etiquetas */}
      <TagManager 
        isOpen={showTagManager}
        onClose={() => setShowTagManager(false)}
        onTagsUpdated={fetchTags}
      />

      {/* Modal de Compartir Tarea */}
      <ShareTaskModal
        task={shareTask}
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareTask(null);
        }}
      />

      {/* Modal Selector de Temas */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {/* Componente de Notificaciones */}
      <Notifications tasks={tasks} />

      {/* Botón de instalación PWA */}
      <InstallPWA />
    </div>
  );
}

export default HomePage;