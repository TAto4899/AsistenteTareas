// frontend/src/components/ProductivityCharts.jsx

import { useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

function ProductivityCharts({ tasks }) {
  const { darkMode } = useTheme();

  // Colores para los gráficos
  const COLORS = {
    A: '#f44336', // Alta - Rojo
    M: '#ff9800', // Media - Naranja
    B: '#4caf50', // Baja - Verde
    completed: '#4caf50',
    pending: '#ff9800',
    overdue: '#f44336'
  };

  const chartColors = {
    text: darkMode ? '#e0e0e0' : '#333',
    grid: darkMode ? '#444' : '#e0e0e0',
    bg: darkMode ? '#1e1e1e' : '#ffffff'
  };

  // Calcular datos de tareas completadas por día (últimos 7 días)
  const completedByDay = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      
      const completedCount = tasks.filter(task => {
        if (!task.completada) return false;
        const taskDate = new Date(task.actualizada_en || task.creada_en);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      }).length;
      
      days.push({
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        completadas: completedCount,
        fecha: dateStr
      });
    }
    
    return days;
  }, [tasks]);

  // Distribución por prioridad
  const priorityData = useMemo(() => {
    const counts = { A: 0, M: 0, B: 0 };
    tasks.forEach(task => {
      if (!task.completada) {
        counts[task.prioridad]++;
      }
    });
    
    return [
      { name: 'Alta', value: counts.A, color: COLORS.A },
      { name: 'Media', value: counts.M, color: COLORS.M },
      { name: 'Baja', value: counts.B, color: COLORS.B }
    ].filter(item => item.value > 0);
  }, [tasks]);

  // Distribución por estado
  const statusData = useMemo(() => {
    const completed = tasks.filter(t => t.completada).length;
    const overdue = tasks.filter(t => {
      if (t.completada || !t.fecha_vencimiento) return false;
      const today = new Date();
      const dueDate = new Date(t.fecha_vencimiento);
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    const pending = tasks.length - completed - overdue;
    
    return [
      { name: 'Completadas', value: completed, color: COLORS.completed },
      { name: 'Pendientes', value: pending, color: COLORS.pending },
      { name: 'Vencidas', value: overdue, color: COLORS.overdue }
    ].filter(item => item.value > 0);
  }, [tasks]);

  // Tasa de completación (últimos 7 días)
  const completionRate = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.creada_en);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      });
      
      const completed = dayTasks.filter(t => t.completada).length;
      const total = dayTasks.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      days.push({
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        tasa: rate
      });
    }
    
    return days;
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        📊 No hay datos suficientes para mostrar gráficos
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: darkMode ? '#2a2a2a' : '#fff',
          border: `1px solid ${darkMode ? '#444' : '#ccc'}`,
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <p style={{ margin: 0, color: chartColors.text }}>
            {payload[0].name}: <strong>{payload[0].value}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        📊 Estadísticas de Productividad
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Gráfico de tareas completadas por día */}
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            marginTop: 0,
            fontSize: '16px',
            marginBottom: '15px'
          }}>
            Tareas Completadas (7 días)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completedByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="day" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completadas" fill="#4caf50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de distribución por prioridad */}
        {priorityData.length > 0 && (
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginTop: 0,
              fontSize: '16px',
              marginBottom: '15px'
            }}>
              Tareas Pendientes por Prioridad
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico de distribución por estado */}
        {statusData.length > 0 && (
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginTop: 0,
              fontSize: '16px',
              marginBottom: '15px'
            }}>
              Estado General de Tareas
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico de tasa de completación */}
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          gridColumn: priorityData.length === 0 || statusData.length === 0 ? 'span 1' : 'auto'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            marginTop: 0,
            fontSize: '16px',
            marginBottom: '15px'
          }}>
            Tasa de Completación (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={completionRate}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="day" 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={chartColors.text}
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="tasa" 
                stroke="#2196F3" 
                strokeWidth={2}
                dot={{ fill: '#2196F3', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ProductivityCharts;
