import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

export default function Edicts() {
  const { user } = useUser()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    // TODO: Implement actual upload to backend
    console.log('Uploading edict:', selectedFile.name)
    
    // Simulate upload
    setTimeout(() => {
      alert(`Edital "${selectedFile.name}" enviado com sucesso!`)
      setSelectedFile(null)
      setShowUploadModal(false)
    }, 1000)
  }

  const edicts = [
    {
      code: 'RESIDENCIA-2024-SP-CARDIOLOGIA',
      title: 'Residência Médica em Cardiologia - 2024',
      institution: 'Hospital das Clínicas - FMUSP',
      state: 'SP',
      score: 487,
      maxScore: 1000,
      position: 8,
      deadline: '2024-03-15',
    },
    {
      code: 'RESIDENCIA-2024-RJ-CIRURGIA',
      title: 'Residência Médica em Cirurgia Geral - 2024',
      institution: 'Hospital Universitário - UFRJ',
      state: 'RJ',
      score: 392,
      maxScore: 850,
      position: 15,
      deadline: '2024-04-01',
    },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Meus Editais</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          Adicionar Novo Edital
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-8">
        <input
          type="search"
          placeholder="Buscar editais por instituição, estado ou especialidade..."
          className="input-field w-full"
        />
      </div>

      {/* Edicts List */}
      <div className="space-y-6">
        {edicts.map((edict) => {
          const daysRemaining = Math.ceil(
            (new Date(edict.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )

          return (
            <div key={edict.code} className="card p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {edict.state}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {edict.code}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {edict.title}
                  </h2>
                  <p className="text-slate-500">{edict.institution}</p>
                </div>
                <button className="btn-secondary">
                  Ver Detalhes
                </button>
              </div>

              {/* Score Card */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 rounded-2xl bg-indigo-50">
                  <div className="label mb-2">Sua Pontuação</div>
                  <div className="text-4xl font-black text-indigo-600">
                    {edict.score}
                  </div>
                  <div className="text-sm text-slate-500">
                    de {edict.maxScore} pontos
                  </div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-emerald-50">
                  <div className="label mb-2">Sua Posição</div>
                  <div className="text-4xl font-black text-emerald-600">
                    #{edict.position}
                  </div>
                  <div className="text-sm text-slate-500">
                    no ranking regional
                  </div>
                </div>

                <div className="text-center p-6 rounded-2xl bg-slate-50">
                  <div className="label mb-2">Prazo</div>
                  <div className="text-2xl font-black text-slate-900">
                    {new Date(edict.deadline).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-slate-500">
                    {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Prazo encerrado'}
                  </div>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-slate-900 mb-4">Análise de Gaps</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Monitoria', missing: '10h', points: '+50' },
                    { category: 'Publicações', missing: '2 artigos', points: '+100' },
                  ].map((gap) => (
                    <div
                      key={gap.category}
                      className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/50"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{gap.category}</span>
                        <span className="text-slate-500 ml-2">
                          Faltam {gap.missing} para pontuação máxima
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                        {gap.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-8 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Adicionar Novo Edital
            </h2>
            <p className="text-slate-500 mb-6">
              Faça upload do PDF do edital para análise automática
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mb-6">
              {selectedFile ? (
                <div>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="font-bold text-slate-900 mb-2">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500 mb-4">
                    Arraste o PDF aqui ou clique para selecionar
                  </p>
                  <label className="btn-secondary cursor-pointer inline-block">
                    Selecionar Arquivo
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Edital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
