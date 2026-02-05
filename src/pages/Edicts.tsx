import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../services/api'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import type { Edict } from '../types'

interface EdictCardProps {
  edict: Edict & { num_criteria?: number }
  onView: (id: string) => void
}

const EdictCard: React.FC<EdictCardProps> = ({ edict, onView }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
            {edict.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
            <BuildingLibraryIcon className="w-4 h-4" />
            <span>{edict.institution}</span>
          </div>
          {edict.year && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{edict.year}</span>
            </div>
          )}
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
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

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Critérios</span>
          <span className="font-semibold text-slate-900">
            {edict.num_criteria || edict.barema_config?.criteria?.length || 0}
          </span>
        </div>

        {edict.programs && edict.programs.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <AcademicCapIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-slate-600">Programas: </span>
              <span className="text-slate-900">{edict.programs.slice(0, 2).join(', ')}</span>
              {edict.programs.length > 2 && (
                <span className="text-slate-500"> +{edict.programs.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {edict.state && (
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{edict.state}</span>
          </div>
        )}
      </div>

      <button 
        onClick={() => onView(edict.id)}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
      >
        Ver Detalhes
      </button>
    </div>
  )
}

export default function Edicts() {
  const navigate = useNavigate()
  const [myEdicts, setMyEdicts] = useState<Edict[]>([])
  const [allEdicts, setAllEdicts] = useState<Edict[]>([])
  const [isLoadingMy, setIsLoadingMy] = useState(true)
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    institution: '',
    year: '',
    state: '',
    program: '',
    department: ''
  })
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadMyEdicts()
  }, [])

  const loadMyEdicts = async () => {
    setIsLoadingMy(true)
    try {
      const response = await endpoints.getMyEdicts()
      setMyEdicts(response.data.edicts || [])
    } catch (error) {
      console.error('Error loading my edicts:', error)
    } finally {
      setIsLoadingMy(false)
    }
  }

  const handleSearch = async () => {
    setIsLoadingAll(true)
    setIsSearching(true)
    try {
      const params: any = {}
      if (searchFilters.institution) params.institution = searchFilters.institution
      if (searchFilters.year) params.year = parseInt(searchFilters.year)
      if (searchFilters.state) params.state = searchFilters.state
      if (searchFilters.program) params.program = searchFilters.program
      if (searchFilters.department) params.department = searchFilters.department

      const response = await endpoints.searchEdicts(params)
      setAllEdicts(response.data.edicts || [])
    } catch (error) {
      console.error('Error searching edicts:', error)
    } finally {
      setIsLoadingAll(false)
    }
  }

  const handleClearSearch = () => {
    setSearchFilters({
      institution: '',
      year: '',
      state: '',
      program: '',
      department: ''
    })
    setAllEdicts([])
    setIsSearching(false)
  }

  const handleViewEdict = (id: string) => {
    navigate(`/edicts/${id}`)
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editais</h1>
          <p className="mt-2 text-slate-600">
            Gerencie e analise editais de residência médica
          </p>
        </div>
        <button
          onClick={() => navigate('/edicts/upload')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Edital
        </button>
      </div>

      {/* My Edicts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Meus Editais</h2>

        {isLoadingMy && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!isLoadingMy && myEdicts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <AcademicCapIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Nenhum edital cadastrado
            </h3>
            <p className="text-slate-600 mb-6">
              Faça upload do primeiro edital para começar a análise
            </p>
            <button
              onClick={() => navigate('/edicts/upload')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Enviar Edital
            </button>
          </div>
        )}

        {!isLoadingMy && myEdicts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myEdicts.map((edict: any) => (
              <EdictCard 
                key={edict.id} 
                edict={edict} 
                onView={handleViewEdict}
              />
            ))}
          </div>
        )}
      </section>

      {/* All Edicts Section with Search */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Todos os Editais</h2>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-4">
            <input
              type="text"
              placeholder="Instituição"
              value={searchFilters.institution}
              onChange={(e) => setSearchFilters({ ...searchFilters, institution: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Ano (ex: 2024)"
              value={searchFilters.year}
              onChange={(e) => setSearchFilters({ ...searchFilters, year: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Estado (UF)"
              maxLength={2}
              value={searchFilters.state}
              onChange={(e) => setSearchFilters({ ...searchFilters, state: e.target.value.toUpperCase() })}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Programa"
              value={searchFilters.program}
              onChange={(e) => setSearchFilters({ ...searchFilters, program: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Departamento"
              value={searchFilters.department}
              onChange={(e) => setSearchFilters({ ...searchFilters, department: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={isLoadingAll}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              {isLoadingAll ? 'Buscando...' : 'Buscar Editais'}
            </button>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isLoadingAll && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!isLoadingAll && isSearching && allEdicts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Nenhum edital encontrado
            </h3>
            <p className="text-slate-600">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}

        {!isLoadingAll && allEdicts.length > 0 && (
          <>
            <p className="text-sm text-slate-600 mb-4">
              {allEdicts.length} edital{allEdicts.length !== 1 ? 'is' : ''} encontrado{allEdicts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allEdicts.map((edict: any) => (
                <EdictCard 
                  key={edict.id} 
                  edict={edict} 
                  onView={handleViewEdict}
                />
              ))}
            </div>
          </>
        )}

        {!isSearching && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Busque editais disponíveis
            </h3>
            <p className="text-slate-600">
              Use os filtros acima para encontrar editais por instituição, ano, programa ou departamento
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
