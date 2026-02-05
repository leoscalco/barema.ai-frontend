import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { endpoints } from '../services/api'
import { useAuth } from './AuthContext'
import type { User, Certificate, EdictEvaluation } from '../types'

interface UserContextType {
  user: User | null
  certificates: Certificate[]
  edictEvaluations: EdictEvaluation[]
  loading: boolean
  refreshUser: () => Promise<void>
  refreshCertificates: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [edictEvaluations, setEdictEvaluations] = useState<EdictEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    if (!authUser) return
    
    try {
      // Use user from AuthContext
      setUser(authUser as User)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchCertificates = async () => {
    if (!authUser) return
    
    try {
      const response = await endpoints.getCertificates({ user_id: authUser.id })
      // Map API response to our Certificate interface
      const certs = (response.data || []).map((c: any) => ({
        ...c,
        status: c.validation_status || c.status || 'pending',
        ai_confidence: c.extraction_confidence || c.ai_confidence,
        extraction_confidence: c.extraction_confidence,
      }))
      setCertificates(certs)
    } catch (error) {
      console.error('Error fetching certificates:', error)
      // Fallback to empty array
      setCertificates([])
    }
  }

  const fetchEdictEvaluations = async () => {
    try {
      // TODO: Implement endpoint for edict evaluations
      // For now, use mock data
      setEdictEvaluations([])
    } catch (error) {
      console.error('Error fetching edict evaluations:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!authUser) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      await Promise.all([
        fetchUser(),
        fetchCertificates(),
        fetchEdictEvaluations(),
      ])
      setLoading(false)
    }
    loadData()
  }, [authUser])

  return (
    <UserContext.Provider
      value={{
        user,
        certificates,
        edictEvaluations,
        loading,
        refreshUser: fetchUser,
        refreshCertificates: fetchCertificates,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
