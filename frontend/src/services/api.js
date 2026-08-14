import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('mypet_user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: automatically logout on token expiration if not on login page
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/pets') || window.location.pathname.startsWith('/vaccinations')) {
        localStorage.removeItem('mypet_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
