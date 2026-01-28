import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Remove Content-Type header for FormData to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Endpoints
export const endpoints = {
  // Auth
  register: (data: any) => api.post('/users/register', data),
  login: (data: any) => api.post('/users/login', data),
  profile: () => api.get('/users/profile'),

  // Certificates
  getCertificates: (params?: any) => api.get('/certificates/', { params }),
  getCertificateForValidation: (id: string) => api.get(`/certificates/validate/${id}`),
  getCertificatePreview: (id: string) => api.get(`/certificates/${id}/preview`),
  uploadCertificate: (formData: FormData) => {
    // Use axios directly without Content-Type header
    // Browser will automatically set Content-Type with boundary for FormData
    return axios.post(`${API_BASE_URL}/certificates/upload/batch`, formData)
  },
  updateCertificate: (id: string, data: any) => api.patch(`/certificates/validate/${id}`, data),
  deleteCertificate: (id: string) => api.delete(`/certificates/${id}`),

  // Ranking
  getGlobalRanking: (params?: any) => api.get('/ranking/global', { params }),
  getRegionalRanking: (state: string, params?: any) => 
    api.get(`/ranking/regional/${state}`, { params }),

  // Edicts
  getEdicts: (params?: any) => api.get('/edicts/', { params }),
  getEdictById: (id: string) => api.get(`/edicts/${id}`),
  evaluateEdict: (id: string) => api.post(`/edicts/${id}/evaluate`),

  // Lattes
  exportLattes: () => api.get('/lattes/export', { responseType: 'blob' }),
}
