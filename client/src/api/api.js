import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (email, password) => api.post('/api/auth/signup', { email, password }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Subscription APIs
export const subscriptionAPI = {
  getSubscriptions: () => api.get('/api/subscriptions'),
  subscribe: (ticker) => api.post('/api/subscriptions/subscribe', { ticker }),
  unsubscribe: (ticker) => api.post('/api/subscriptions/unsubscribe', { ticker }),
};

export default api;
