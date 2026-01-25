import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, certificates, loading } = useUser()

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalCertificates = certificates.length
  const pendingValidation = certificates.filter(
    (c) => c.status === 'pending' || c.status === 'processing'
  ).length
  const totalScore = user?.total_score || 487

  // Mock ranking data - will be replaced with real API call
  const rankingData = {
    position: 8,
    totalUsers: 150,
    percentile: 75.5,
    regionalPosition: 3,
    regionalTotal: 25,
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="section-title mb-2">Bem-vindo de volta, {user?.full_name?.split(' ')[0]}!</h1>
        <p className="text-slate-500">
          Aqui está um resumo do seu progresso curricular
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="label">Total de Certificados</div>
          <div className="text-4xl font-black text-indigo-600 mb-2">{totalCertificates}</div>
          <div className="text-sm text-slate-500">
            {certificates.filter((c) => c.status === 'validated').length} validados
          </div>
        </div>

        <div className="card p-6">
          <div className="label">Pontuação Total</div>
          <div className="text-4xl font-black text-indigo-600 mb-2">{totalScore}</div>
          <div className="text-sm text-slate-500">de 1000 pontos</div>
          {/* Ranking Comparison */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Posição Global</span>
              <span className="font-bold text-slate-900">
                #{rankingData.position} de {rankingData.totalUsers}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-slate-500">Posição Regional ({user?.state})</span>
              <span className="font-bold text-slate-900">
                #{rankingData.regionalPosition} de {rankingData.regionalTotal}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${rankingData.percentile}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {rankingData.percentile}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Percentil</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="label">Pendente Validação</div>
          <div className="text-4xl font-black text-amber-500 mb-2">{pendingValidation}</div>
          <div className="text-sm text-slate-500">aguardando revisão</div>
          {pendingValidation > 0 && (
            <button
              onClick={() => navigate('/validation')}
              className="mt-4 w-full btn-secondary text-sm py-2"
            >
              Validar Agora →
            </button>
          )}
        </div>
      </div>

      {/* Progress Rings */}
      <div className="card p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Completude por Categoria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Cursos', value: 80, color: 'indigo' },
            { name: 'Publicações', value: 45, color: 'emerald' },
            { name: 'Monitoria', value: 60, color: 'amber' },
            { name: 'Eventos', value: 90, color: 'blue' },
          ].map((category) => (
            <div key={category.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - category.value / 100)}`}
                    className={
                      category.color === 'indigo' ? 'text-indigo-600' :
                      category.color === 'emerald' ? 'text-emerald-600' :
                      category.color === 'amber' ? 'text-amber-600' :
                      'text-blue-600'
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">
                    {category.value}%
                  </span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{category.name}</div>
              <div className="text-sm text-slate-500">
                {Math.round(category.value / 10)} de 10 itens
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Recomendações da IA
        </h2>
        <p className="text-slate-500 mb-6">
          Baseado nos editais que você favoritou
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Complete 10h de monitoria',
              description:
                'Faltam apenas 10 horas para atingir a pontuação máxima no Edital HC-SP',
              impact: '+50 pontos',
              color: 'amber',
              action: 'upload',
            },
            {
              title: 'Adicione publicações científicas',
              description:
                'Artigos em periódicos indexados valem até 100 pontos',
              impact: '+100 pontos',
              color: 'indigo',
              action: 'upload',
            },
            {
              title: 'Valide certificados pendentes',
              description:
                'Você tem certificados aguardando validação que podem aumentar sua pontuação',
              impact: '+75 pontos',
              color: 'emerald',
              action: 'validation',
            },
          ].map((rec) => (
            <button
              key={rec.title}
              onClick={() => navigate(`/${rec.action}`)}
              className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{rec.description}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${rec.color}-100 text-${rec.color}-700 text-xs font-bold`}>
                    <span>{rec.impact}</span>
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
