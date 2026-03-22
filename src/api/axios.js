import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const clienteAxios = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ── REQUEST: inyectar token ───────────────────────────────────
clienteAxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE: renovar token si expira ────────────────────────
clienteAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = sessionStorage.getItem('refresh_token')

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken
          })

          sessionStorage.setItem('access_token', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return clienteAxios(originalRequest)

        } catch {
          sessionStorage.clear()
          window.location.href = '/'
          return Promise.reject(new Error('Sesión expirada'))
        }
      }

      sessionStorage.clear()
      window.location.href = '/'
      return Promise.reject(new Error('No autenticado'))
    }

    return Promise.reject(error)
  }
)

export default clienteAxios