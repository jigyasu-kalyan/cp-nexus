import axios from 'axios';
import { getToken, removeToken } from './auth';

const api = axios.create({
    baseURL: 'https://cp-nexus-backend.onrender.com/api/v1',
    withCredentials: true,
});

// Add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses (unauthorized) - token expired or invalid
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired, remove it and redirect to login
            removeToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;