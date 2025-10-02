import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Your backend API URL
});

// Axios Interceptor to add the token to protected requests
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;