// frontend/src/context/ThemeContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Definir paletas de colores disponibles
const THEMES = {
  green: {
    name: 'Verde Clásico',
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    secondary: '#8BC34A',
    accent: '#2196F3',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  blue: {
    name: 'Azul Océano',
    primary: '#2196F3',
    primaryDark: '#1976D2',
    secondary: '#03A9F4',
    accent: '#00BCD4',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  purple: {
    name: 'Púrpura Real',
    primary: '#9C27B0',
    primaryDark: '#7B1FA2',
    secondary: '#BA68C8',
    accent: '#E91E63',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  orange: {
    name: 'Naranja Vibrante',
    primary: '#FF5722',
    primaryDark: '#E64A19',
    secondary: '#FF9800',
    accent: '#FFC107',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  teal: {
    name: 'Verde Azulado',
    primary: '#009688',
    primaryDark: '#00796B',
    secondary: '#26A69A',
    accent: '#00BCD4',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  pink: {
    name: 'Rosa Moderno',
    primary: '#E91E63',
    primaryDark: '#C2185B',
    secondary: '#F06292',
    accent: '#FF4081',
    danger: '#f44336',
    warning: '#ff9800',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'green';
  });

  const theme = THEMES[currentTheme];

  useEffect(() => {
    // Guardar preferencias
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('theme', currentTheme);
    
    // Aplicar variables CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--primary-dark', theme.primaryDark);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--danger-color', theme.danger);
    root.style.setProperty('--warning-color', theme.warning);
    
    // Aplicar modo oscuro
    if (darkMode) {
      document.body.classList.add('dark-mode');
      root.style.setProperty('--bg-primary', '#1e1e1e');
      root.style.setProperty('--bg-secondary', '#2a2a2a');
      root.style.setProperty('--bg-tertiary', '#333333');
      root.style.setProperty('--text-primary', '#e0e0e0');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#444444');
    } else {
      document.body.classList.remove('dark-mode');
      root.style.setProperty('--bg-primary', theme.bgPrimary);
      root.style.setProperty('--bg-secondary', theme.bgSecondary);
      root.style.setProperty('--bg-tertiary', '#fafafa');
      root.style.setProperty('--text-primary', theme.textPrimary);
      root.style.setProperty('--text-secondary', theme.textSecondary);
      root.style.setProperty('--border-color', '#e0e0e0');
    }
  }, [darkMode, currentTheme, theme]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      currentTheme,
      changeTheme,
      theme,
      availableThemes: THEMES
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
