import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function KYC() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    crm: '',
    crm_state: '',
    specialty: '',
    graduation_year: '',
    phone: '',
    city: '',
    state: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare update data (only send non-empty fields)
      const updateData: any = {}
      if (formData.crm) updateData.crm = formData.crm
      if (formData.crm_state) updateData.state = formData.crm_state
      if (formData.specialty) updateData.specialty = formData.specialty
      if (formData.graduation_year) updateData.graduation_year = parseInt(formData.graduation_year)
      if (formData.phone) updateData.phone = formData.phone
      if (formData.city) updateData.city = formData.city
      if (formData.state) updateData.state = formData.state

      // Update user profile
      await endpoints.updateUser(updateData)

      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message
      setError(errorMessage || 'Erro ao atualizar perfil. Tente novamente.')
      console.error('KYC error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard', { replace: true })
  }

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="w-full max-w-2xl">
        <div className="card p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-3">
              Complete seu perfil
            </h1>
            <p className="text-slate-500 text-lg">
              Adicione informações profissionais para uma melhor experiência
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">CRM</label>
                <input
                  type="text"
                  name="crm"
                  value={formData.crm}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Ex: 123456"
                />
              </div>
              <div>
                <label className="label">Estado do CRM (UF)</label>
                <select
                  name="crm_state"
                  value={formData.crm_state}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Selecione...</option>
                  {brazilianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Especialidade Médica</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Ex: Cardiologia"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">Ano de Formatura</label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Ex: 2015"
                  min="1950"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <label className="label">Estado (UF)</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Selecione...</option>
                  {brazilianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Pular por agora
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar e Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
