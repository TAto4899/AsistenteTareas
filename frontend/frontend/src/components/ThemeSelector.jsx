// frontend/src/components/ThemeSelector.jsx

import { useTheme } from '../context/ThemeContext';

function ThemeSelector({ isOpen, onClose }) {
  const { currentTheme, changeTheme, availableThemes, darkMode } = useTheme();

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
          backgroundColor: darkMode ? '#2a2a2a' : 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🎨 Temas Personalizados
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
          Elige el tema que mejor se adapte a tu estilo
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {Object.entries(availableThemes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => {
                changeTheme(key);
                setTimeout(onClose, 300);
              }}
              style={{
                padding: '15px',
                borderRadius: '12px',
                border: currentTheme === key ? `3px solid ${themeData.primary}` : '2px solid var(--border-color)',
                backgroundColor: darkMode ? '#333' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== key) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Círculo de color principal */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: themeData.primary,
                margin: '0 auto 10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                {/* Círculo de color secundario */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: themeData.secondary,
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  border: '2px solid white'
                }}></div>
              </div>

              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                {themeData.name}
              </div>

              {currentTheme === key && (
                <div style={{
                  fontSize: '18px',
                  marginTop: '8px'
                }}>
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: darkMode ? '#333' : '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: 'var(--text-primary)',
            fontSize: '14px'
          }}>
            Vista Previa del Tema
          </h4>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: availableThemes[currentTheme].primary,
              color: 'white',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Primario
            </span>
            <span style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: availableThemes[currentTheme].secondary,
              color: 'white',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Secundario
            </span>
            <span style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: availableThemes[currentTheme].accent,
              color: 'white',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Acento
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
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

export default ThemeSelector;
