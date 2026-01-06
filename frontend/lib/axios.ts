import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Removed withCredentials: true as we are using Bearer tokens, not cookies, 
    // and it simplifies CORS Origin '*' vs specific origin.
});

// Add a request interceptor to insert the token
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log('Adding token to request:', config.url);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
