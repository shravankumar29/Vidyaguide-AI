import axios from 'axios';

// Vite env format
const API_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Initialize token from local storage on app boot
const savedToken = localStorage.getItem('token');
if (savedToken) {
    setAuthToken(savedToken);
}

// Interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            setAuthToken(null);
            // Redirect to login if appropriate
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
