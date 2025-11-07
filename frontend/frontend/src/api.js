// frontend/src/api.js

import axios from 'axios';

// 1. Apunta a la URL base de tu backend de Django - usa variable de entorno
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// 2. Le dice a axios que envíe y reciba cookies
axios.defaults.withCredentials = true;

// 3. Función para obtener el CSRF token de las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 4. Interceptor para agregar el CSRF token a cada petición
axios.interceptors.request.use(
    (config) => {
        const csrftoken = getCookie('csrftoken');
        
        // Debug: ver qué token estamos enviando
        console.log('🔐 CSRF Token:', csrftoken ? 'Encontrado' : 'NO encontrado');
        console.log('📝 Todas las cookies:', document.cookie);
        
        if (csrftoken) {
            config.headers['X-CSRFToken'] = csrftoken;
        } else {
            console.warn('⚠️ No se encontró CSRF token en las cookies');
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con error
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            console.error('❌ Error 403 - CSRF token inválido o faltante');
            console.log('Cookies actuales:', document.cookie);
        }
        return Promise.reject(error);
    }
);

export default axios;