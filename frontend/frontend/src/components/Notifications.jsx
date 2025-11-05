// frontend/src/components/Notifications.jsx

import { useState, useEffect } from 'react';
import axios from '../api';

function Notifications({ tasks }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Verificar si el navegador soporta notificaciones
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(localStorage.getItem('notificationsEnabled') === 'true');
    }
  }, []);

  useEffect(() => {
    if (notificationsEnabled && permission === 'granted') {
      checkTasksAndNotify();
      // Verificar cada 5 minutos
      const interval = setInterval(checkTasksAndNotify, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [notificationsEnabled, permission, tasks]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      setNotificationsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
      new Notification('¡Notificaciones activadas!', {
        body: 'Ahora recibirás alertas sobre tus tareas',
        icon: '📝',
        tag: 'welcome'
      });
    }
  };

  const toggleNotifications = () => {
    if (permission !== 'granted') {
      requestPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      localStorage.setItem('notificationsEnabled', newState.toString());
      
      if (newState) {
        new Notification('Notificaciones reactivadas', {
          body: 'Volverás a recibir alertas de tus tareas',
          icon: '🔔',
          tag: 'reactivated'
        });
      }
    }
  };

  const checkTasksAndNotify = () => {
    if (!Array.isArray(tasks) || tasks.length === 0) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    tasks.forEach(task => {
      if (task.completada) return;

      const taskDate = task.fecha_vencimiento;
      const taskTime = task.hora_vencimiento;

      // Tareas vencidas
      if (taskDate && taskDate < today) {
        sendNotification(
          '⚠️ Tarea vencida',
          `"${task.titulo}" venció el ${new Date(taskDate).toLocaleDateString('es-ES')}`,
          'overdue'
        );
      }
      // Tareas que vencen hoy
      else if (taskDate === today) {
        if (taskTime) {
          // Si tiene hora, notificar cuando llegue la hora
          if (taskTime === currentTime) {
            sendNotification(
              '🔔 ¡Es hora!',
              `"${task.titulo}" - Vence ahora a las ${taskTime}`,
              'now'
            );
          }
          // Notificar 30 minutos antes
          else if (isWithinMinutes(taskTime, currentTime, 30)) {
            sendNotification(
              '⏰ Recordatorio',
              `"${task.titulo}" vence en 30 minutos (${taskTime})`,
              'soon'
            );
          }
        } else {
          // Si no tiene hora, notificar que vence hoy
          sendNotification(
            '📅 Vence hoy',
            `"${task.titulo}" debe completarse hoy`,
            'today'
          );
        }
      }
      // Tareas que vencen mañana
      else if (taskDate === getTomorrowDate()) {
        sendNotification(
          '📆 Vence mañana',
          `"${task.titulo}" ${taskTime ? `a las ${taskTime}` : ''}`,
          'tomorrow'
        );
      }
    });
  };

  const sendNotification = (title, body, tag) => {
    // Evitar notificaciones duplicadas con el mismo tag
    const notifiedKey = `notified_${tag}_${body}`;
    const lastNotified = localStorage.getItem(notifiedKey);
    const now = Date.now();

    // No notificar si se notificó hace menos de 1 hora
    if (lastNotified && (now - parseInt(lastNotified)) < 60 * 60 * 1000) {
      return;
    }

    new Notification(title, {
      body,
      icon: '📝',
      tag,
      requireInteraction: tag === 'now' || tag === 'overdue',
    });

    localStorage.setItem(notifiedKey, now.toString());
  };

  const isWithinMinutes = (targetTime, currentTime, minutes) => {
    const [tH, tM] = targetTime.split(':').map(Number);
    const [cH, cM] = currentTime.split(':').map(Number);
    
    const targetMinutes = tH * 60 + tM;
    const currentMinutes = cH * 60 + cM;
    
    const diff = targetMinutes - currentMinutes;
    return diff > 0 && diff <= minutes;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={toggleNotifications}
        style={{
          padding: '12px 20px',
          backgroundColor: notificationsEnabled ? '#4caf50' : '#9e9e9e',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s'
        }}
        title={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
      >
        {notificationsEnabled ? '🔔 Notificaciones ON' : '🔕 Notificaciones OFF'}
      </button>
    </div>
  );
}

export default Notifications;
