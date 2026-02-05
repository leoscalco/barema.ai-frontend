import { useState, useEffect } from 'react'
import { endpoints } from '../services/api'
import type { Certificate } from '../types'

interface UseCurriculumReturn {
  certificates: Certificate[]
  loading: boolean
  error: string | null
  refreshCertificates: () => Promise<void>
  totalCertificates: number
  pendingValidation: number
  byCategory: Record<string, number>
}

export function useCurriculum(): UseCurriculumReturn {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await endpoints.getCertificates({ limit: 100 })
      setCertificates(response.data.certificates || [])
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar certificados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  // Computed values
  const totalCertificates = certificates.length
  const pendingValidation = certificates.filter(
    (cert) => cert.status === 'pending' || cert.status === 'processing'
  ).length

  const byCategory = certificates.reduce((acc, cert) => {
    acc[cert.category] = (acc[cert.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    certificates,
    loading,
    error,
    refreshCertificates: fetchCertificates,
    totalCertificates,
    pendingValidation,
    byCategory,
  }
}
