import React, { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface BatchProgressProps {
  batchId: string
  onComplete?: () => void
}

interface BatchStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  total: number
  processed: number
  successful: number
  failed: number
  created_at: string
  started_at?: string
  completed_at?: string
  error_message?: string
}

export default function BatchProgress({ batchId, onComplete }: BatchProgressProps) {
  const [status, setStatus] = useState<BatchStatus | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (!batchId || !isPolling) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/v1/batches/${batchId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
          
          // Stop polling when complete
          if (data.status === 'completed' || data.status === 'failed') {
            setIsPolling(false)
            if (onComplete) {
              onComplete()
            }
          }
        }
      } catch (error) {
        console.error('Error polling batch status:', error)
      }
    }

    // Poll immediately
    pollStatus()

    // Then poll every 2 seconds
    const interval = setInterval(pollStatus, 2000)

    return () => clearInterval(interval)
  }, [batchId, isPolling, onComplete])

  if (!status) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />
      case 'failed':
        return <XCircleIcon className="w-6 h-6 text-red-600" />
      case 'processing':
        return <ClockIcon className="w-6 h-6 text-blue-600 animate-pulse" />
      default:
        return <ClockIcon className="w-6 h-6 text-slate-400" />
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case 'completed':
        return 'Concluído'
      case 'failed':
        return 'Falhou'
      case 'processing':
        return 'Processando...'
      default:
        return 'Pendente'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Processamento de Certificados
            </h3>
            <p className={`text-sm font-medium ${getStatusColor()} px-2 py-1 rounded-full inline-block mt-1`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(status.progress)}%
          </div>
          <div className="text-sm text-slate-600">
            {status.processed} / {status.total}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${status.progress}%` }}
          >
            {status.status === 'processing' && (
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {status.successful}
          </div>
          <div className="text-xs text-green-600 font-medium mt-1">
            Sucesso
          </div>
        </div>
        
        <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-2xl font-bold text-slate-700">
            {status.processed - status.successful - status.failed}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-1">
            Processando
          </div>
        </div>
        
        {status.failed > 0 && (
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {status.failed}
            </div>
            <div className="text-xs text-red-600 font-medium mt-1">
              Falhas
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {status.error_message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">
            <strong>Erro:</strong> {status.error_message}
          </p>
        </div>
      )}

      {/* Complete Message */}
      {status.status === 'completed' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-700">
            ✅ Processamento concluído! {status.successful} de {status.total} certificados processados com sucesso.
          </p>
        </div>
      )}
    </div>
  )
}
