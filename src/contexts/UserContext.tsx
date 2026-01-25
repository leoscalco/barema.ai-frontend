import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { endpoints } from '../services/api'
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

// Development user ID - will be replaced with auth later
const DEV_USER_ID = '7a8cbc10-4f18-4b33-b6c5-6d966fcfe4a0'
const DEV_USER_EMAIL = 'dev@barema.ai'

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [edictEvaluations, setEdictEvaluations] = useState<EdictEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      // For now, use mock data - will be replaced with real API call
      const mockUser: User = {
        id: DEV_USER_ID,
        email: DEV_USER_EMAIL,
        full_name: 'Dr. João Silva Santos',
        cpf: '12345678900',
        phone: '+5511999999999',
        crm: '123456-SP',
        specialty: 'Cardiologia',
        city: 'São Paulo',
        state: 'SP',
        subscription_tier: 'free',
        total_score: 487.5,
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
      }
      setUser(mockUser)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchCertificates = async () => {
    try {
      const response = await endpoints.getCertificates({ user_id: DEV_USER_ID })
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
      setLoading(true)
      await Promise.all([
        fetchUser(),
        fetchCertificates(),
        fetchEdictEvaluations(),
      ])
      setLoading(false)
    }
    loadData()
  }, [])

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
