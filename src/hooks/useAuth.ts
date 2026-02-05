import { useState, useEffect } from 'react'
import { endpoints } from '../services/api'
import type { User } from '../types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (err) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await endpoints.login({ email, password })
      
      const { access_token, user: userData } = response.data
      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('user_data', JSON.stringify(userData))
      setUser(userData)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erro ao fazer login'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
