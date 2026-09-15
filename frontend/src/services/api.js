import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fittrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 unauthorized errors (token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid
      if (!window.location.pathname.includes('/auth') && localStorage.getItem('fittrack_token')) {
        console.warn('Session expired or invalid token. Clearing credentials.');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  demoLogin: async () => {
    const res = await api.post('/auth/demo');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const userService = {
  getDashboardSummary: async () => {
    const res = await api.get('/users/dashboard-summary');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },
};

export const workoutService = {
  getWorkouts: async (params = {}) => {
    const res = await api.get('/workouts', { params });
    return res.data;
  },
  createWorkout: async (workoutData) => {
    const res = await api.post('/workouts', workoutData);
    return res.data;
  },
  toggleWorkout: async (id) => {
    const res = await api.patch(`/workouts/${id}/toggle`);
    return res.data;
  },
  deleteWorkout: async (id) => {
    const res = await api.delete(`/workouts/${id}`);
    return res.data;
  },
  loadPresets: async (goal) => {
    const res = await api.post('/workouts/presets', { goal });
    return res.data;
  },
};

export const foodService = {
  getFoods: async (date) => {
    const res = await api.get('/food', { params: { date } });
    return res.data;
  },
  addFood: async (foodData) => {
    const res = await api.post('/food', foodData);
    return res.data;
  },
  deleteFood: async (id) => {
    const res = await api.delete(`/food/${id}`);
    return res.data;
  },
};

export const waterService = {
  getWater: async (date) => {
    const res = await api.get('/water', { params: { date } });
    return res.data;
  },
  updateWater: async (data) => {
    const res = await api.post('/water', data);
    return res.data;
  },
  resetWater: async (date) => {
    const res = await api.post('/water/reset', { date });
    return res.data;
  },
};

export const progressService = {
  getProgress: async () => {
    const res = await api.get('/progress');
    return res.data;
  },
  addProgress: async (entry) => {
    const res = await api.post('/progress', entry);
    return res.data;
  },
  deleteProgress: async (id) => {
    const res = await api.delete(`/progress/${id}`);
    return res.data;
  },
};

export default api;
