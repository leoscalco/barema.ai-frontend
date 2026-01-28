import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  full_name: string
  crm?: string
  specialty?: string
  total_score?: number
  subscription_tier?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }

    setIsLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
