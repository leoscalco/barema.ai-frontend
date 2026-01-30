import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { endpoints } from '../services/api'
import type { Edict, EdictCriterion } from '../types'
import {
  ArrowLeftIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  MapPinIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const CATEGORY_NAMES: Record<string, string> = {
  formacao_academica: 'Formação Acadêmica',
  titulos_certificados: 'Títulos e Certificados',
  atividades_academicas: 'Atividades Acadêmicas',
  publicacoes: 'Publicações',
  premios_distincoes: 'Prêmios e Distinções',
  experiencia_profissional: 'Experiência Profissional',
  atividades_extensao: 'Atividades de Extensão',
  idiomas: 'Idiomas',
  outros: 'Outros'
}

interface CriterionCardProps {
  criterion: EdictCriterion
}

const CriterionCard: React.FC<CriterionCardProps> = ({ criterion }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              #{criterion.display_order}
              {criterion.sub_order && `.${criterion.sub_order}`}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {CATEGORY_NAMES[criterion.category_slug] || criterion.category_slug}
            </span>
          </div>

          <p className="text-sm text-slate-900 mb-3 leading-relaxed">
            {criterion.description}
          </p>

          {/* Points Info */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-slate-600">Pontos:</span>
              <span className="font-semibold text-slate-900">{criterion.unit_points}</span>
            </div>

            {criterion.item_limit && (
              <div className="flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
                <span className="text-slate-600">Limite:</span>
                <span className="font-semibold text-slate-900">{criterion.item_limit}</span>
              </div>
            )}

            {criterion.max_points && (
              <div className="flex items-center gap-1">
                <ChartBarIcon className="w-4 h-4 text-blue-600" />
                <span className="text-slate-600">Máximo:</span>
                <span className="font-semibold text-slate-900">{criterion.max_points}</span>
              </div>
            )}
          </div>

          {/* Conditionals */}
          {criterion.conditionals && criterion.conditionals.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                {isExpanded ? 'Ocultar' : 'Ver'} condições especiais ({criterion.conditionals.length})
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {criterion.conditionals.map((cond, idx) => (
                    <div key={idx} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded shrink-0">
                          {cond.trigger}
                        </span>
                        <div className="flex-1">
                          {cond.description && (
                            <p className="text-xs text-slate-700 mb-1">{cond.description}</p>
                          )}
                          <p className="text-xs font-semibold text-indigo-900">
                            {cond.additional_points > 0 ? '+' : ''}{cond.additional_points} pontos
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Program/Department filters */}
          {(criterion.program || criterion.department) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {criterion.program && (
                <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  Programa: {criterion.program}
                </span>
              )}
              {criterion.department && (
                <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  Departamento: {criterion.department}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EdictDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [edict, setEdict] = useState<Edict | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'barema' | 'analysis'>('info')

  useEffect(() => {
    if (id) {
      loadEdict(id)
    }
  }, [id])

  const loadEdict = async (edictId: string) => {
    setIsLoading(true)
    try {
      const response = await endpoints.getEdictById(edictId)
      setEdict(response.data)
    } catch (error) {
      console.error('Error loading edict:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const groupedCriteria = React.useMemo(() => {
    if (!edict?.barema_config?.criteria) return {}
    
    return edict.barema_config.criteria.reduce((acc, criterion) => {
      const category = criterion.category_slug
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(criterion)
      return acc
    }, {} as Record<string, EdictCriterion[]>)
  }, [edict])

  if (isLoading) {
    return (
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (!edict) {
    return (
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Edital não encontrado
          </h3>
          <button
            onClick={() => navigate('/edicts')}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Voltar para Editais
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/edicts')}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-medium">Voltar para Editais</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{edict.title}</h1>
            <p className="text-slate-600 text-sm">Código: {edict.code}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-medium rounded-full shrink-0 ${
            edict.status === 'published' 
              ? 'bg-green-100 text-green-700' 
              : edict.status === 'draft'
              ? 'bg-slate-100 text-slate-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {edict.status === 'published' ? 'Publicado' : 
             edict.status === 'draft' ? 'Rascunho' : 
             edict.status}
          </span>
        </div>

        {edict.description && (
          <p className="text-slate-700 mb-4">{edict.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <BuildingLibraryIcon className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Instituição</p>
              <p className="text-sm font-semibold text-slate-900">{edict.institution}</p>
            </div>
          </div>

          {edict.year && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Ano</p>
                <p className="text-sm font-semibold text-slate-900">{edict.year}</p>
              </div>
            </div>
          )}

          {edict.state && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Estado</p>
                <p className="text-sm font-semibold text-slate-900">{edict.state}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Critérios</p>
              <p className="text-sm font-semibold text-slate-900">
                {edict.barema_config?.criteria?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {edict.programs && edict.programs.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-600 mb-2 flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4" />
              Programas
            </p>
            <div className="flex flex-wrap gap-2">
              {edict.programs.map((program, idx) => (
                <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  {program}
                </span>
              ))}
            </div>
          </div>
        )}

        {edict.departments && edict.departments.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-600 mb-2">Departamentos</p>
            <div className="flex flex-wrap gap-2">
              {edict.departments.map((dept, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="border-b border-slate-200">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('barema')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'barema'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Barema ({edict.barema_config?.criteria?.length || 0} critérios)
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Análise de Perfil
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Detalhes do Edital</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-slate-600">Código</dt>
                    <dd className="text-sm font-semibold text-slate-900">{edict.code}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-600">Instituição</dt>
                    <dd className="text-sm font-semibold text-slate-900">{edict.institution}</dd>
                  </div>
                  {edict.year && (
                    <div>
                      <dt className="text-sm text-slate-600">Ano</dt>
                      <dd className="text-sm font-semibold text-slate-900">{edict.year}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-slate-600">Status</dt>
                    <dd className="text-sm font-semibold text-slate-900 capitalize">{edict.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-600">Criado em</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {new Date(edict.created_at).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>

              {edict.barema_config?.footnotes && edict.barema_config.footnotes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Observações Importantes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {edict.barema_config.footnotes.map((note, idx) => (
                      <li key={idx} className="text-sm text-slate-700">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Barema Tab */}
          {activeTab === 'barema' && (
            <div className="space-y-6">
              {Object.entries(groupedCriteria).map(([categorySlug, criteria]) => (
                <div key={categorySlug}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm">
                      {CATEGORY_NAMES[categorySlug] || categorySlug}
                    </span>
                    <span className="text-sm font-normal text-slate-600">
                      ({criteria.length} critério{criteria.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {criteria
                      .sort((a, b) => {
                        if (a.display_order !== b.display_order) {
                          return a.display_order - b.display_order
                        }
                        return (a.sub_order || 0) - (b.sub_order || 0)
                      })
                      .map((criterion, idx) => (
                        <CriterionCard key={idx} criterion={criterion} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Análise de Perfil do Usuário
              </h3>
              <p className="text-slate-600 mb-4">
                Em desenvolvimento
              </p>
              <div className="max-w-2xl mx-auto text-left bg-slate-50 rounded-xl p-6">
                <p className="text-sm text-slate-700 mb-3">
                  Esta funcionalidade permitirá:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                  <li>Calcular sua pontuação total baseada nos certificados validados</li>
                  <li>Identificar gaps (critérios onde você pode melhorar sua pontuação)</li>
                  <li>Comparar seu perfil com o barema do edital</li>
                  <li>Receber recomendações personalizadas para aumentar sua competitividade</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
