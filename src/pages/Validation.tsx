import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { endpoints } from '../services/api'

interface FieldConfig {
  label: string
  value: string | number
  confidence: number
  type?: 'text' | 'number' | 'date' | 'select'
  options?: string[]
}

export default function Validation() {
  const { certificates, refreshCertificates } = useUser()
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0)
  const [fields, setFields] = useState<FieldConfig[]>([])

  // Get pending certificates
  const pendingCertificates = certificates.filter(
    (c) => c.status === 'pending' || c.status === 'processing' || c.status === 'needs_review'
  )

  const currentCert = pendingCertificates[currentCertificateIndex]

  useEffect(() => {
    if (currentCert) {
      // Load certificate data for validation
      loadCertificateData(currentCert.id)
    } else {
      // Use mock data if no certificates
      setFields([
        {
          label: 'Título do Certificado',
          value: 'Curso de Especialização em Cardiologia Clínica',
          confidence: 0.98,
          type: 'text',
        },
        {
          label: 'Instituição',
          value: 'Hospital das Clínicas - FMUSP',
          confidence: 0.95,
          type: 'text',
        },
        {
          label: 'Carga Horária (h)',
          value: 360,
          confidence: 0.72,
          type: 'number',
        },
        {
          label: 'Categoria',
          value: 'Cursos',
          confidence: 0.88,
          type: 'select',
          options: ['Cursos', 'Monitoria', 'Eventos', 'Publicações'],
        },
        {
          label: 'Data Início',
          value: '2023-03-15',
          confidence: 0.65,
          type: 'date',
        },
        {
          label: 'Data Fim',
          value: '2024-01-20',
          confidence: 0.82,
          type: 'date',
        },
        {
          label: 'Data Emissão',
          value: '2024-02-05',
          confidence: 0.91,
          type: 'date',
        },
      ])
    }
  }, [currentCert])

  const loadCertificateData = async (certId: string) => {
    try {
      const response = await endpoints.getCertificates({ user_id: '7a8cbc10-4f18-4b33-b6c5-6d966fcfe4a0' })
      const cert = (response.data || []).find((c: any) => c.id === certId)
      
      if (cert) {
        // Map certificate data to fields
        const certFields: FieldConfig[] = [
          {
            label: 'Título do Certificado',
            value: cert.title || '',
            confidence: cert.extraction_confidence || 0.5,
            type: 'text',
          },
          {
            label: 'Instituição',
            value: cert.institution || '',
            confidence: cert.extraction_confidence || 0.5,
            type: 'text',
          },
          {
            label: 'Carga Horária (h)',
            value: cert.workload_hours || 0,
            confidence: cert.extraction_confidence || 0.5,
            type: 'number',
          },
          {
            label: 'Categoria',
            value: cert.category || 'Cursos',
            confidence: cert.extraction_confidence || 0.5,
            type: 'select',
            options: ['Cursos', 'Monitoria', 'Eventos', 'Publicações'],
          },
          {
            label: 'Data Início',
            value: cert.start_date ? new Date(cert.start_date).toISOString().split('T')[0] : '',
            confidence: cert.extraction_confidence || 0.5,
            type: 'date',
          },
          {
            label: 'Data Fim',
            value: cert.end_date ? new Date(cert.end_date).toISOString().split('T')[0] : '',
            confidence: cert.extraction_confidence || 0.5,
            type: 'date',
          },
          {
            label: 'Data Emissão',
            value: cert.issue_date ? new Date(cert.issue_date).toISOString().split('T')[0] : '',
            confidence: cert.extraction_confidence || 0.5,
            type: 'date',
          },
        ]
        setFields(certFields)
      }
    } catch (error) {
      console.error('Error loading certificate:', error)
    }
  }

  const updateField = (index: number, value: string | number) => {
    const newFields = [...fields]
    newFields[index].value = value
    setFields(newFields)
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return (
        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    } else if (confidence >= 0.8) {
      return (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    } else {
      return (
        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    }
  }

  const handleNext = () => {
    if (currentCertificateIndex < pendingCertificates.length - 1) {
      setCurrentCertificateIndex(currentCertificateIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentCertificateIndex > 0) {
      setCurrentCertificateIndex(currentCertificateIndex - 1)
    }
  }

  const handleConfirm = async () => {
    if (!currentCert) return

    try {
      await endpoints.updateCertificate(currentCert.id, {
        action: 'approve',
      })
      await refreshCertificates()
      
      if (currentCertificateIndex < pendingCertificates.length - 1) {
        setCurrentCertificateIndex(currentCertificateIndex + 1)
      } else if (pendingCertificates.length > 1) {
        setCurrentCertificateIndex(0)
      }
    } catch (error) {
      console.error('Error confirming certificate:', error)
    }
  }

  if (pendingCertificates.length === 0) {
    return (
      <div className="max-w-7xl">
        <h1 className="section-title mb-8">Validação de Certificados</h1>
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-lg">
            Nenhum certificado pendente de validação
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Validação de Certificados</h1>
        <div className="text-sm text-slate-500">
          {currentCertificateIndex + 1} de {pendingCertificates.length} certificados
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
        {/* Left: Document Viewer */}
        <div className="card p-6 flex flex-col">
          <div className="label mb-4">Documento Original</div>
          <div className="flex-1 bg-slate-100 rounded-2xl flex items-center justify-center">
            <div className="text-center text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium">{currentCert?.file_name || 'Visualização do PDF'}</p>
            </div>
          </div>
        </div>

        {/* Right: Validation Form */}
        <div className="card p-6 flex flex-col overflow-y-auto">
          <div className="label mb-4">Dados Extraídos pela IA</div>

          <div className="space-y-6">
            {fields.map((field, index) => {
              const isLowConfidence = field.confidence < 0.8
              
              return (
                <div key={index}>
                  <label className="label">{field.label}</label>
                  <div className="relative">
                    {field.type === 'select' ? (
                      <select
                        className={`input-field w-full ${
                          isLowConfidence
                            ? 'border-amber-400 border-2 focus:ring-amber-500 focus:border-amber-500'
                            : ''
                        }`}
                        value={field.value as string}
                        onChange={(e) => updateField(index, e.target.value)}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className={`input-field w-full ${
                          isLowConfidence
                            ? 'border-amber-400 border-2 focus:ring-amber-500 focus:border-amber-500'
                            : ''
                        }`}
                        value={field.value}
                        onChange={(e) =>
                          updateField(
                            index,
                            field.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                      />
                    )}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getConfidenceBadge(field.confidence)}
                    </div>
                    {isLowConfidence && (
                      <div className="mt-2 text-xs text-amber-600 font-medium">
                        ⚠️ Confiança baixa - Verifique este campo cuidadosamente
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button onClick={handleConfirm} className="btn-primary flex-1">
                ✓ Confirmar e Salvar
              </button>
              <button className="btn-secondary">
                ⚠ Reportar Erro
              </button>
            </div>
          </div>

          {/* Queue Navigation */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentCertificateIndex === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <span className="text-sm text-slate-500">
                {pendingCertificates.length} certificados pendentes
              </span>
              <button
                onClick={handleNext}
                disabled={currentCertificateIndex >= pendingCertificates.length - 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
