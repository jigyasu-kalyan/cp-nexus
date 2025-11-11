import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cp-nexus-backend.onrender.com/api/v1',
    withCredentials: true,
});

export default api;