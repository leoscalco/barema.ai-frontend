import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { endpoints } from '../services/api'

interface ParsedEdict {
  nome_edital: string
  instituicao: string
  ano: number | null
  criterios: Array<{
    programa: string | null
    departamento: string | null
    ordem_exibicao: number
    categoria_slug: string
    descricao: string
    pontos_unitarios: number
    limite_itens: number | null
    teto_maximo: number | null
  }>
}

interface UploadResponse {
  edict_id: string
  status: string
  message: string
  parsed_data: ParsedEdict | null
  num_criterios: number
  programas: string[]
  departamentos: string[]
}

export default function EdictUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget
    const relatedTarget = e.relatedTarget as Node
    if (!target.contains(relatedTarget)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Por favor, envie apenas arquivos PDF')
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Por favor, envie apenas arquivos PDF')
    }
  }, [])

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await endpoints.uploadEdict(formData)
      setUploadResult(response.data)
      
      // Show success message and navigate after a delay
      setTimeout(() => {
        navigate('/edicts')
      }, 3000)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.response?.data?.detail || 'Erro ao fazer upload do edital')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadResult(null)
    setError(null)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Upload de Edital</h1>
        <p className="mt-2 text-slate-600">
          Envie o PDF do edital de residência médica para análise automática
        </p>
      </div>

      {!uploadResult && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            
            {!file ? (
              <>
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Arraste o PDF do edital aqui
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  ou clique para selecionar
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer transition-colors">
                  <span>Selecionar Arquivo</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <DocumentArrowUpIcon className="h-8 w-8 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Analisando...' : 'Analisar Edital'}
                  </button>
                  <button
                    onClick={removeFile}
                    disabled={isUploading}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Erro no upload</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <div>
                  <p className="font-medium text-indigo-900">Analisando edital...</p>
                  <p className="text-sm text-indigo-700 mt-1">
                    Extraindo critérios de avaliação curricular
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadResult && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Edital Analisado com Sucesso!</h2>
              <p className="text-slate-600 mt-1">{uploadResult.message}</p>
            </div>
          </div>

          {uploadResult.parsed_data && (
            <div className="space-y-6">
              {/* Edict Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Edital</p>
                  <p className="font-semibold text-slate-900">
                    {uploadResult.parsed_data.nome_edital}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Instituição</p>
                  <p className="font-semibold text-slate-900">
                    {uploadResult.parsed_data.instituicao}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Ano</p>
                  <p className="font-semibold text-slate-900">
                    {uploadResult.parsed_data.ano || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-sm text-indigo-600 mb-1">Critérios Extraídos</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {uploadResult.num_criterios}
                  </p>
                </div>
                {uploadResult.programas.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-600 mb-1">Programas</p>
                    <p className="text-lg font-semibold text-purple-900">
                      {uploadResult.programas.join(', ')}
                    </p>
                  </div>
                )}
                {uploadResult.departamentos.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Departamentos</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {uploadResult.departamentos.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  Redirecionando para a página de editais...
                </p>
                <button
                  onClick={() => navigate('/edicts')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Ir para Editais
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
