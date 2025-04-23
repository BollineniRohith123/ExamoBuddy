import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear the token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) => 
    api.post('/auth/token', { username, password }),
  
  register: (username: string, password: string) => 
    api.post('/auth/register', { username, password }),
  
  getMe: () => 
    api.get('/auth/me'),
};

// Q&A API
export const qaApi = {
  askQuestion: (question: string) => 
    api.post('/qa/ask', { question }),
  
  generatePdf: (answer: string, question?: string) => 
    api.post('/pdf/generate', { answer, question }, { responseType: 'blob' }),
};

// History API
export const historyApi = {
  getHistory: (skip = 0, limit = 10) => 
    api.get(`/history?skip=${skip}&limit=${limit}`),
  
  getHistoryItem: (id: number) => 
    api.get(`/history/${id}`),
  
  deleteHistoryItem: (id: number) => 
    api.delete(`/history/${id}`),
};

// Admin API
export const adminApi = {
  getStats: () => 
    api.get('/admin/stats'),
  
  getUsers: () => 
    api.get('/admin/users'),
};

export default api;
