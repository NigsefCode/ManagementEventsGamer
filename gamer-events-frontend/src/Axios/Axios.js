import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // URL base de tu backend Django
  timeout: 5000, // Tiempo máximo de espera para las solicitudes (opcional)
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post('token/refresh/', { refresh: refreshToken });
          localStorage.setItem('access_token', data.access);
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
