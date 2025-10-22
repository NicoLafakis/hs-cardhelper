import axios from 'axios'
import useAuthStore from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const response = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken })
        const { accessToken } = response.data

        useAuthStore.getState().updateAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: (email, password) => api.post('/auth/signup', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken })
}

// Templates API
export const templatesAPI = {
  getAll: () => api.get('/templates'),
  getOne: (id) => api.get(`/templates/${id}`),
  create: (name, config) => api.post('/templates', { name, config }),
  delete: (id) => api.delete(`/templates/${id}`)
}

// Settings API
export const settingsAPI = {
  saveApiKey: (service, apiKey) => api.post(`/settings/${service}`, { apiKey }),
  getKeyStatus: (service) => api.get(`/settings/${service}`),
  getApiKey: (service) => api.get(`/settings/${service}/key`),
  deleteApiKey: (service) => api.delete(`/settings/${service}`)
}

// HubSpot API
export const hubspotAPI = {
  validate: (apiKey) => api.post('/hubspot/validate', { apiKey }),
  getObjects: () => api.get('/hubspot/objects'),
  getProperties: (objectType) => api.get(`/hubspot/properties/${objectType}`)
}

// AI API
export const aiAPI = {
  suggest: (prompt, objectType, properties) =>
    api.post('/ai/suggest', { prompt, objectType, properties }),
  tableWizard: (description, objectType, availableProperties) =>
    api.post('/ai/table-wizard', { description, objectType, availableProperties })
}

// Feature Flags API
export const featureFlagsAPI = {
  getAll: () => api.get('/feature-flags'),
  set: (key, value) => api.post('/feature-flags', { key, value }),
  setBulk: (flags) => api.post('/feature-flags/bulk', { flags }),
  delete: (key) => api.delete(`/feature-flags/${key}`),
  reset: () => api.post('/feature-flags/reset')
}

export default api
