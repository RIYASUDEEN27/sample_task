import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://sample-task-backend.onrender.com/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and redirect
      const event = new CustomEvent('auth:logout')
      window.dispatchEvent(event)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
