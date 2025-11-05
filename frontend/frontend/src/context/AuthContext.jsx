// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Función de Login ---
    const login = async (username, password) => {
        try {
            // Primero obtenemos el CSRF token
            await axios.get('/api/csrf/');
            
            const response = await axios.post('/api/login/', {
                username,
                password,
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error en el login:', error);
            throw new Error('Credenciales inválidas');
        }
    };

    // --- Función de Logout ---
    const logout = async () => {
        try {
            await axios.post('/api/logout/');
            setUser(null);
        } catch (error) {
            console.error('Error en el logout:', error);
        }
    };

    // --- Verificar si hay una sesión activa cuando la app carga ---
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                // Primero obtenemos el CSRF token
                await axios.get('/api/csrf/');
                
                // Pequeño delay para asegurar que la cookie se establezca
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Luego intentamos obtener el usuario actual
                const response = await axios.get('/api/user/');
                setUser(response.data);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log('No hay sesión activa');
                } else {
                    console.error('Error al verificar sesión:', error.message);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);