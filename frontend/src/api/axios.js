import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      // Do not append Authorization header for public endpoints
      const isAuthEndpoint = ['register', 'login', 'forgot-password', 'verify-otp', 'reset-password'].some(ep => config.url && config.url.includes(ep));
      
      if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        // Optionally redirect to login, but leaving it to React Router for now
    }
    return Promise.reject(error);
  }
);

export default api;
