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
  const { refreshCertificates, user } = useUser()
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0)
  const [fields, setFields] = useState<FieldConfig[]>([])
  const [pendingCertificates, setPendingCertificates] = useState<any[]>([])
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true)
  const [documentConfidence, setDocumentConfidence] = useState<number>(0.0)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  
  // Load certificates for validation (confidence < 0.7)
  useEffect(() => {
    const loadValidationCertificates = async () => {
      if (!user) return
      
      setIsLoadingCertificates(true)
      try {
        const response = await endpoints.getCertificates({ 
          user_id: user.id,
          validation: true 
        })
        const certs = (response.data || []).map((c: any) => ({
          ...c,
          id: c.id,
          status: c.validation_status || 'pending',
          extraction_confidence: c.extraction_confidence || 0.0,
        }))
        setPendingCertificates(certs)
      } catch (error) {
        console.error('Error loading validation certificates:', error)
        setPendingCertificates([])
      } finally {
        setIsLoadingCertificates(false)
      }
    }
    if (user) {
      loadValidationCertificates()
    }
  }, [user])

  const currentCert = pendingCertificates[currentCertificateIndex]

  useEffect(() => {
    if (currentCert) {
      // Load certificate data for validation
      loadCertificateData(currentCert.id)
      // Load preview URL
      loadPreviewUrl(currentCert.id)
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

  const loadPreviewUrl = async (certId: string) => {
    setIsLoadingPreview(true)
    try {
      const response = await endpoints.getCertificatePreview(certId)
      const url = response.data.preview_url
      console.log('Preview URL loaded:', url)
      console.log('Content type:', response.data.content_type)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error loading preview URL:', error)
      setPreviewUrl(null)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const loadCertificateData = async (certId: string) => {
    try {
      const response = await endpoints.getCertificateForValidation(certId)
      const cert = response.data
      
      if (cert) {
        // Set document-level confidence
        setDocumentConfidence(cert.extraction_confidence || 0.0)
        
        // Map certificate data to fields (without individual confidence)
        const certFields: FieldConfig[] = [
          {
            label: 'Título do Certificado',
            value: cert.title || '',
            confidence: 0, // Not used per field anymore
            type: 'text',
          },
          {
            label: 'Instituição',
            value: cert.institution || '',
            confidence: 0,
            type: 'text',
          },
          {
            label: 'Carga Horária (h)',
            value: cert.workload_hours || 0,
            confidence: 0,
            type: 'number',
          },
          {
            label: 'Categoria',
            value: cert.category || 'Cursos',
            confidence: 0,
            type: 'select',
            options: ['Cursos', 'Monitoria', 'Eventos', 'Publicações'],
          },
          {
            label: 'Data Início',
            value: cert.start_date ? new Date(cert.start_date).toISOString().split('T')[0] : '',
            confidence: 0,
            type: 'date',
          },
          {
            label: 'Data Fim',
            value: cert.end_date ? new Date(cert.end_date).toISOString().split('T')[0] : '',
            confidence: 0,
            type: 'date',
          },
          {
            label: 'Data Emissão',
            value: cert.issue_date ? new Date(cert.issue_date).toISOString().split('T')[0] : '',
            confidence: 0,
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
        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    } else if (confidence >= 0.7) {
      return (
        <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    } else {
      return (
        <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
          {Math.round(confidence * 100)}% confiança
        </span>
      )
    }
  }
  
  const getConfidenceMessage = (confidence: number) => {
    if (confidence >= 0.9) {
      return "Alta confiança - Dados extraídos com precisão"
    } else if (confidence >= 0.7) {
      return "Confiança moderada - Revise os dados extraídos"
    } else {
      return "Baixa confiança - Verifique cuidadosamente todos os campos"
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
      // Prepare updated data from fields
      const updatedData: { [key: string]: any } = {}
      fields.forEach(field => {
        let key = ''
        switch (field.label) {
          case 'Título do Certificado': key = 'title'; break;
          case 'Instituição': key = 'institution'; break;
          case 'Carga Horária (h)': key = 'workload_hours'; break;
          case 'Categoria': key = 'category'; break;
          case 'Data Início': key = 'start_date'; break;
          case 'Data Fim': key = 'end_date'; break;
          case 'Data Emissão': key = 'issue_date'; break;
          default: return;
        }
        updatedData[key] = field.value
      })

      // Send updates and approve the certificate
      await endpoints.updateCertificate(currentCert.id, {
        action: 'edit',
        updates: updatedData,
      })
      
      // Refresh the certificate list
      await refreshCertificates()
      
      // Remove from pending list and move to next
      const newPendingList = pendingCertificates.filter((_, idx) => idx !== currentCertificateIndex)
      setPendingCertificates(newPendingList)
      
      // If there are more certificates, stay at same index (which now shows next cert)
      // Otherwise, go back to beginning
      if (currentCertificateIndex >= newPendingList.length && newPendingList.length > 0) {
        setCurrentCertificateIndex(0)
      }
      
      // Show success message
      console.log('Certificate validated successfully!')
    } catch (error) {
      console.error('Error confirming certificate:', error)
      alert('Erro ao salvar validação. Por favor, tente novamente.')
    }
  }

  if (isLoadingCertificates) {
    return (
      <div className="w-full">
        <h1 className="section-title mb-8">Validação de Certificados</h1>
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 text-lg">Carregando certificados...</p>
        </div>
      </div>
    )
  }

  if (pendingCertificates.length === 0) {
    return (
      <div className="w-full">
        <h1 className="section-title mb-8">Validação de Certificados</h1>
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-lg">
            Nenhum certificado pendente de validação (confidence &lt; 0.7)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Validação de Certificados</h1>
        <div className="text-sm text-slate-500">
          {currentCertificateIndex + 1} de {pendingCertificates.length} certificados
        </div>
      </div>

      <div className="grid grid-cols-[70%_30%] gap-6 h-[calc(100vh-16rem)]">
        {/* Left: Document Viewer (70%) */}
        <div className="card p-6 flex flex-col">
          <div className="label mb-4">Documento Original</div>
          <div className="flex-1 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
            {isLoadingPreview ? (
              <div className="text-center text-slate-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="font-medium">Carregando documento...</p>
              </div>
            ) : previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            ) : (
              <div className="text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">{currentCert?.file_name || 'Visualização do PDF'}</p>
                <p className="text-sm mt-2">Documento não disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Validation Form */}
        <div className="card p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="label">Dados Extraídos pela IA</div>
            {getConfidenceBadge(documentConfidence)}
          </div>
          
          {/* Global confidence message */}
          <div className={`mb-6 p-4 rounded-xl ${
            documentConfidence >= 0.9 
              ? 'bg-emerald-50 border border-emerald-200' 
              : documentConfidence >= 0.7
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`text-xl ${
                documentConfidence >= 0.9 
                  ? 'text-emerald-600' 
                  : documentConfidence >= 0.7
                  ? 'text-blue-600'
                  : 'text-amber-600'
              }`}>
                {documentConfidence < 0.7 ? '⚠️' : documentConfidence < 0.9 ? 'ℹ️' : '✓'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  documentConfidence >= 0.9 
                    ? 'text-emerald-800' 
                    : documentConfidence >= 0.7
                    ? 'text-blue-800'
                    : 'text-amber-800'
                }`}>
                  {getConfidenceMessage(documentConfidence)}
                </p>
                <p className={`text-xs mt-1 ${
                  documentConfidence >= 0.9 
                    ? 'text-emerald-600' 
                    : documentConfidence >= 0.7
                    ? 'text-blue-600'
                    : 'text-amber-600'
                }`}>
                  Confiança geral da extração: {Math.round(documentConfidence * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => {
              return (
                <div key={index}>
                  <label className="label">{field.label}</label>
                  <div className="relative">
                    {field.type === 'select' ? (
                      <select
                        className="input-field w-full"
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
                        className="input-field w-full"
                        value={field.value}
                        onChange={(e) =>
                          updateField(
                            index,
                            field.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              )
            })}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button onClick={handleConfirm} className="btn-primary w-full">
                      ✓ Confirmar e Salvar
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
