// frontend/src/components/SubtasksList.jsx

import { useState } from 'react';
import axios from '../api';

function SubtasksList({ task, onUpdate }) {
  const [subtasks, setSubtasks] = useState(task.subtareas || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    setAdding(true);
    try {
      const response = await axios.post('/api/subtareas/', {
        tarea_id: task.id,
        texto: newSubtask.trim(),
        orden: subtasks.length
      });
      
      setSubtasks([...subtasks, response.data]);
      setNewSubtask('');
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error al crear subtarea:', error);
      console.error('Response:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Error al crear subtarea';
      alert(errorMsg);
    }
    setAdding(false);
  };

  const handleToggleSubtask = async (subtask) => {
    try {
      const response = await axios.patch(`/api/subtareas/${subtask.id}/`, {
        completada: !subtask.completada
      });
      
      setSubtasks(subtasks.map(st => 
        st.id === subtask.id ? response.data : st
      ));
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error al actualizar subtarea:', error);
      console.error('Response:', error.response?.data);
      alert('Error al actualizar subtarea');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!window.confirm('¿Eliminar esta subtarea?')) return;

    try {
      await axios.delete(`/api/subtareas/${subtaskId}/`);
      setSubtasks(subtasks.filter(st => st.id !== subtaskId));
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error al eliminar subtarea:', error);
      alert('Error al eliminar subtarea');
    }
  };

  const completedCount = subtasks.filter(st => st.completada).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ marginTop: '15px' }}>
      {totalCount > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
              ✓ Subtareas ({completedCount}/{totalCount})
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {progress}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: progress === 100 ? '#4caf50' : '#2196F3',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {subtasks.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          {subtasks.map(subtask => (
            <div
              key={subtask.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                marginBottom: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
              }}
            >
              <input
                type="checkbox"
                checked={subtask.completada}
                onChange={() => handleToggleSubtask(subtask)}
                style={{
                  cursor: 'pointer',
                  width: '16px',
                  height: '16px',
                  accentColor: '#4caf50'
                }}
              />
              <span style={{
                flex: 1,
                fontSize: '14px',
                color: subtask.completada ? '#999' : '#333',
                textDecoration: subtask.completada ? 'line-through' : 'none'
              }}>
                {subtask.texto}
              </span>
              <button
                onClick={() => handleDeleteSubtask(subtask.id)}
                style={{
                  padding: '2px 6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#f44336',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                title="Eliminar subtarea"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddSubtask} style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="+ Agregar subtarea..."
          disabled={adding}
          style={{
            flex: 1,
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: 'white'
          }}
        />
        <button
          type="submit"
          disabled={adding || !newSubtask.trim()}
          style={{
            padding: '6px 12px',
            backgroundColor: adding || !newSubtask.trim() ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: adding || !newSubtask.trim() ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {adding ? '...' : '+ Agregar'}
        </button>
      </form>
    </div>
  );
}

export default SubtasksList;
