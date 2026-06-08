import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to append JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh automatically on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        if (refreshResponse.data.success) {
          const { accessToken, user } = refreshResponse.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token expired or invalid, logging out...', refreshError.message);
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Custom dispatch event or redirect
        window.dispatchEvent(new Event('auth-logout-redirect'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
