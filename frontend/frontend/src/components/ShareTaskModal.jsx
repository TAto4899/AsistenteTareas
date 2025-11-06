// frontend/src/components/ShareTaskModal.jsx

import { useState } from 'react';
import axios from '../api';

function ShareTaskModal({ task, isOpen, onClose }) {
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(task?.is_public || false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/tareas/${task.id}/compartir/`);
      setShareUrl(response.data.share_url);
      setIsSharing(true);
      
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('Error al generar link de compartición');
    }
    setLoading(false);
  };

  const handleUnshare = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/tareas/${task.id}/dejar_compartir/`);
      setIsSharing(false);
      setShareUrl('');
      setCopied(false);
    } catch (error) {
      console.error('Error al dejar de compartir:', error);
      alert('Error al dejar de compartir');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
          🔗 Compartir Tarea
        </h2>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong style={{ color: '#333' }}>{task.titulo}</strong>
          {task.descripcion && (
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              {task.descripcion}
            </p>
          )}
        </div>

        {!isSharing ? (
          <div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Al compartir esta tarea, cualquier persona con el link podrá verla.
            </p>
            <button
              onClick={handleShare}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Generando...' : '🔗 Generar Link de Compartición'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#4CAF50', fontWeight: '600', marginBottom: '10px' }}>
              ✅ Tarea compartida
            </p>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <input
                type="text"
                value={shareUrl}
                readOnly
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#333'
                }}
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '10px 20px',
                  backgroundColor: copied ? '#4CAF50' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                {copied ? '✓ Copiado' : '📋 Copiar'}
              </button>
            </div>

            <button
              onClick={handleUnshare}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Procesando...' : '🔒 Dejar de Compartir'}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cerrar
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ShareTaskModal;
