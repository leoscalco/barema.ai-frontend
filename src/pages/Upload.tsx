import React, { useState, useCallback, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { endpoints } from '../services/api'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FileWithPreview {
  id: string
  file: File  // Keep original File reference
  preview?: string
  status?: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  certificateId?: string
}

export default function Upload() {
  const { certificates, refreshCertificates } = useUser()
  const [selectedEdict, setSelectedEdict] = useState<string | null>(null)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock edict barema config - will come from API
  const edictBarema = {
    categories: [
      { name: 'Cursos', max_points: 300, current: 180 },
      { name: 'Monitoria', max_points: 100, current: 87 },
      { name: 'Ligas', max_points: 150, current: 150 }, // Max reached
      { name: 'Eventos', max_points: 150, current: 100 },
      { name: 'Publicações', max_points: 200, current: 120 },
      { name: 'Estágios', max_points: 100, current: 45 },
      { name: 'Pesquisa', max_points: 50, current: 0 },
      { name: 'Outros', max_points: 50, current: 7 },
    ],
  }

  const categories = [
    { name: 'Cursos', count: certificates.filter((c) => c.category === 'courses').length, icon: '📚' },
    { name: 'Monitoria', count: certificates.filter((c) => c.category === 'teaching_assistant').length, icon: '👨‍🏫' },
    { name: 'Ligas', count: certificates.filter((c) => c.category === 'events').length, icon: '🏥' },
    { name: 'Eventos', count: certificates.filter((c) => c.category === 'events').length, icon: '🎯' },
    { name: 'Publicações', count: certificates.filter((c) => c.category === 'publications').length, icon: '📄' },
    { name: 'Estágios', count: certificates.filter((c) => c.category === 'internships').length, icon: '🔬' },
    { name: 'Pesquisa', count: certificates.filter((c) => c.category === 'research').length, icon: '🧪' },
    { name: 'Outros', count: certificates.filter((c) => !['courses', 'teaching_assistant', 'events', 'publications', 'internships', 'research'].includes(c.category)).length, icon: '📋' },
  ]

  const getCategoryMaxStatus = (categoryName: string) => {
    const baremaCategory = edictBarema.categories.find(
      (c) => c.name === categoryName
    )
    if (!baremaCategory || !selectedEdict) return null
    return {
      current: baremaCategory.current,
      max: baremaCategory.max_points,
      isMaxReached: baremaCategory.current >= baremaCategory.max_points,
    }
  }

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const newFiles: FileWithPreview[] = Array.from(fileList)
      .filter((file) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        const isValidType = validTypes.includes(file.type)
        if (!isValidType) {
          console.warn(`File type ${file.type} not allowed:`, file.name)
        }
        return isValidType
      })
      .map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file: file,  // Keep original File reference
        status: 'pending' as const,
      }))

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging to false if we're leaving the drop zone itself
    const target = e.currentTarget as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!target.contains(relatedTarget)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    // Update all files to uploading status
    setFiles((prev) => prev.map((f) => ({ ...f, status: 'uploading' })))

    try {
      const formData = new FormData()
      
      // Append each file with the same field name 'files' for FastAPI
      // Use the original File object, not the extended object
      files.forEach((fileWithPreview) => {
        formData.append('files', fileWithPreview.file)
      })

      console.log('Uploading files:', files.map(f => ({ name: f.file.name, size: f.file.size, type: f.file.type })))
      console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({ key, value: value instanceof File ? { name: value.name, size: value.size, type: value.type } : String(value) })))

      const response = await endpoints.uploadCertificate(formData)

      console.log('Upload response:', response.data)

      // Update files with processing status
      setFiles((prev) =>
        prev.map((f, idx) => ({
          ...f,
          status: response.data.results[idx]?.status === 'completed' || response.data.results[idx]?.status === 'processing' ? 'processing' : 'error',
          certificateId: response.data.results[idx]?.document_id,
        }))
      )

      // Refresh certificates list
      await refreshCertificates()

      // Clear files after a delay
      setTimeout(() => {
        setFiles([])
      }, 3000)
    } catch (error: any) {
      console.error('Upload error:', error)
      console.error('Error details:', error.response?.data || error.message)
      if (error.response?.data) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2))
      }
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'error' })))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-6xl">
      <h1 className="section-title mb-8">Upload de Certificados</h1>

      {/* Edict Selector */}
      <div className="card p-6 mb-8">
        <label className="label mb-4">Selecione um Edital para Visualizar Pontuação Máxima</label>
        <select
          className="input-field w-full"
          value={selectedEdict || ''}
          onChange={(e) => setSelectedEdict(e.target.value)}
        >
          <option value="">Nenhum edital selecionado</option>
          <option value="edict-1">Residência Médica em Cardiologia - 2024 (HC-SP)</option>
          <option value="edict-2">Residência Médica em Cirurgia Geral - 2024 (UFRJ)</option>
        </select>
        {selectedEdict && (
          <p className="text-sm text-slate-500 mt-2">
            Visualizando limites de pontuação para este edital
          </p>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div className="card p-12 mb-8">
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
            <ArrowUpTrayIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
            Arraste arquivos aqui ou clique para selecionar
          </h3>
          <p className="text-slate-500 mb-4 text-center">
            Suporta PDF e imagens (PNG, JPG) - Múltiplos arquivos permitidos
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="btn-primary"
              disabled={isUploading}
            >
              Selecionar Arquivos
            </button>
            {files.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpload()
                }}
                className="btn-primary"
                disabled={isUploading}
              >
                {isUploading ? 'Enviando...' : `Enviar ${files.length} arquivo(s)`}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-bold text-slate-900 mb-3">Arquivos selecionados ({files.length})</h3>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">{file.file.name}</div>
                  <div className="text-sm text-slate-500">
                    {file.file.size && file.file.size > 0 ? `${(file.file.size / 1024 / 1024).toFixed(2)} MB` : 'Tamanho desconhecido'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {file.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      Aguardando
                    </span>
                  )}
                  {file.status === 'uploading' && (
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shimmer">
                      Enviando...
                    </span>
                  )}
                  {file.status === 'processing' && (
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shimmer">
                      ⏳ Processando IA
                    </span>
                  )}
                  {file.status === 'completed' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      ✓ Processado
                    </span>
                  )}
                  {file.status === 'error' && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      ✗ Erro
                    </span>
                  )}
                  {file.status !== 'uploading' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Categorias</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => {
          const maxStatus = getCategoryMaxStatus(category.name)
          const isMaxReached = maxStatus?.isMaxReached

          return (
            <button
              key={category.name}
              className={`card p-6 hover:shadow-lg hover:shadow-indigo-100/50 transition-all text-left relative ${
                isMaxReached ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
              }`}
            >
              {isMaxReached && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    ✓ MÁXIMO
                  </span>
                </div>
              )}
              <div className="text-3xl mb-3">{category.icon}</div>
              <div className="font-bold text-slate-900 mb-1">{category.name}</div>
              <div className="text-sm text-slate-500 mb-2">{category.count} certificados</div>
              {maxStatus && selectedEdict && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Pontos</span>
                    <span className="font-bold text-slate-900">
                      {maxStatus.current}/{maxStatus.max}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isMaxReached ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{
                        width: `${Math.min((maxStatus.current / maxStatus.max) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Recent Uploads */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Arquivos Recentes</h2>
      <div className="space-y-3">
        {certificates.slice(0, 5).map((cert) => (
          <div key={cert.id} className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 truncate">{cert.title}</div>
              <div className="text-sm text-slate-500">{cert.category}</div>
            </div>
            <div>
              {(cert.status === 'validated' || cert.status === 'approved') && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  ✓ Sucesso
                </span>
              )}
              {(cert.status === 'processing' || cert.status === 'needs_review') && (
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shimmer">
                  ⏳ Processando IA
                </span>
              )}
              {cert.status === 'pending' && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  ⚠ Pendente
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
