import React, { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { api } from '../services/api'

interface IdentificationCheck {
  is_complete: boolean
  completeness_percentage: number
  missing_fields: string[]
  optional_missing_fields: string[]
}

export default function Profile() {
  const { user } = useUser()
  const [identificationCheck, setIdentificationCheck] = useState<IdentificationCheck | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state for all identification fields
  const [formData, setFormData] = useState({
    // Personal Info
    full_name: '',
    email: '',
    birth_date: '',
    birth_city: '',
    birth_state: '',
    nationality: 'Brasileira',
    gender: '',
    marital_status: '',
    
    // Parents
    father_name: '',
    mother_name: '',
    
    // Documents
    cpf: '',
    rg: '',
    crm: '',
    crm_state: '',
    phone: '',
    
    // Address
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    
    // Academic
    graduation_institution: '',
    graduation_start_date: '',
    graduation_end_date: '',
    graduation_average: '',
    graduation_year: '',
    specialty: '',
  })

  // Load identification check and user data on mount
  useEffect(() => {
    fetchIdentificationCheck()
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      console.log('🔍 PROFILE - Loading user data...')
      const response = await api.get('/users/me')
      const userData = response.data
      
      console.log('🔍 PROFILE - User data received:', userData)
      console.log('🔍 PROFILE - Sample fields:', {
        birth_city: userData.birth_city,
        birth_state: userData.birth_state,
        father_name: userData.father_name,
        mother_name: userData.mother_name
      })
      
      // Populate form with user data
      const newFormData = {
        full_name: userData.full_name || '',
        email: userData.email || '',
        birth_date: userData.birth_date ? userData.birth_date.split('T')[0] : '',
        birth_city: userData.birth_city || '',
        birth_state: userData.birth_state || '',
        nationality: userData.nationality || 'Brasileira',
        gender: userData.gender || '',
        marital_status: userData.marital_status || '',
        father_name: userData.father_name || '',
        mother_name: userData.mother_name || '',
        cpf: userData.cpf || '',
        rg: userData.rg || '',
        crm: userData.crm || '',
        crm_state: userData.crm_state || '',
        phone: userData.phone || '',
        address_street: userData.address_street || '',
        address_number: userData.address_number || '',
        address_complement: userData.address_complement || '',
        address_neighborhood: userData.address_neighborhood || '',
        address_city: userData.address_city || '',
        address_state: userData.address_state || '',
        address_zip: userData.address_zip || '',
        graduation_institution: userData.graduation_institution || '',
        graduation_start_date: userData.graduation_start_date ? userData.graduation_start_date.split('T')[0] : '',
        graduation_end_date: userData.graduation_end_date ? userData.graduation_end_date.split('T')[0] : '',
        graduation_average: userData.graduation_average || '',
        graduation_year: userData.graduation_year || '',
        specialty: userData.specialty || '',
      }
      
      console.log('🔍 PROFILE - Setting formData:', newFormData)
      setFormData(newFormData)
      console.log('✅ PROFILE - formData updated successfully')
    } catch (error) {
      console.error('❌ PROFILE - Failed to load user data:', error)
    }
  }

  const fetchIdentificationCheck = async () => {
    try {
      const response = await api.get('/users/me/identification-check')
      setIdentificationCheck(response.data)
    } catch (error) {
      console.error('Failed to fetch identification check:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('🔍 PROFILE - Saving profile...')
      console.log('🔍 PROFILE - Current formData:', formData)
      
      // Filter out empty strings and send only filled fields
      const dataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
        // Only include non-empty values
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>)
      
      console.log('🔍 PROFILE - Data to send:', dataToSend)
      
      const response = await api.patch('/users/me', dataToSend)
      console.log('✅ PROFILE - Save response:', response.data)
      
      alert('Perfil atualizado com sucesso!')
      await fetchIdentificationCheck() // Reload check
      await loadUserData() // Reload user data to confirm persistence
    } catch (error) {
      console.error('❌ PROFILE - Failed to save profile:', error)
      alert('Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-100'
    if (percentage >= 50) return 'text-amber-600 bg-amber-100'
    return 'text-rose-600 bg-rose-100'
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Meu Perfil Completo</h1>
        {identificationCheck && (
          <div className={`px-4 py-2 rounded-xl font-bold ${getCompletenessColor(identificationCheck.completeness_percentage)}`}>
            {identificationCheck.completeness_percentage}% Completo
          </div>
        )}
      </div>

      {/* Completeness Alert */}
      {identificationCheck && !identificationCheck.is_complete && (
        <div className="card p-6 bg-amber-50 border-2 border-amber-200 mb-6">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-2">Identificação Incompleta</h3>
              <p className="text-sm text-amber-700 mb-3">
                Complete sua identificação para poder gerar currículos personalizados para editais.
              </p>
              <div className="text-sm text-amber-700">
                <strong>Campos obrigatórios faltando ({identificationCheck.missing_fields.length}):</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {identificationCheck.missing_fields.slice(0, 5).map((field) => (
                    <li key={field} className="ml-2">{field.replace(/_/g, ' ')}</li>
                  ))}
                  {identificationCheck.missing_fields.length > 5 && (
                    <li className="ml-2">... e mais {identificationCheck.missing_fields.length - 5} campos</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. IDENTIFICAÇÃO - Personal Info */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">1. IDENTIFICAÇÃO</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="label">Nome Completo *</label>
              <input
                type="text"
                name="full_name"
                className="input-field w-full"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Nome completo conforme documento"
              />
            </div>
            <div>
              <label className="label">Data de Nascimento *</label>
              <input
                type="date"
                name="birth_date"
                className="input-field w-full"
                value={formData.birth_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Cidade de Nascimento *</label>
              <input
                type="text"
                name="birth_city"
                className="input-field w-full"
                value={formData.birth_city}
                onChange={handleInputChange}
                placeholder="Ex: São Paulo"
              />
            </div>
            <div>
              <label className="label">Estado de Nascimento *</label>
              <select
                name="birth_state"
                className="input-field w-full"
                value={formData.birth_state}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                {/* Add all Brazilian states */}
              </select>
            </div>
            <div>
              <label className="label">Nacionalidade *</label>
              <input
                type="text"
                name="nationality"
                className="input-field w-full"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Sexo *</label>
              <select
                name="gender"
                className="input-field w-full"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="label">Estado Civil *</label>
              <select
                name="marital_status"
                className="input-field w-full"
                value={formData.marital_status}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. FILIAÇÃO */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">2. FILIAÇÃO</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">Nome do Pai *</label>
              <input
                type="text"
                name="father_name"
                className="input-field w-full"
                value={formData.father_name}
                onChange={handleInputChange}
                placeholder="Nome completo do pai"
              />
            </div>
            <div>
              <label className="label">Nome da Mãe *</label>
              <input
                type="text"
                name="mother_name"
                className="input-field w-full"
                value={formData.mother_name}
                onChange={handleInputChange}
                placeholder="Nome completo da mãe"
              />
            </div>
          </div>
        </div>

        {/* 3. DOCUMENTOS */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">3. DOCUMENTOS</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">CPF *</label>
              <input
                type="text"
                name="cpf"
                className="input-field w-full"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div>
              <label className="label">RG *</label>
              <input
                type="text"
                name="rg"
                className="input-field w-full"
                value={formData.rg}
                onChange={handleInputChange}
                placeholder="00.000.000-0"
              />
            </div>
            <div>
              <label className="label">CRM</label>
              <input
                type="text"
                name="crm"
                className="input-field w-full"
                value={formData.crm}
                onChange={handleInputChange}
                placeholder="123456"
              />
            </div>
            <div>
              <label className="label">Estado do CRM</label>
              <select
                name="crm_state"
                className="input-field w-full"
                value={formData.crm_state}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                {/* Add all states */}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Telefone</label>
              <input
                type="tel"
                name="phone"
                className="input-field w-full"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 98765-4321"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input-field w-full"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="input-field w-full bg-slate-100 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">O email não pode ser alterado</p>
            </div>
          </div>
        </div>

        {/* 4. ENDEREÇO */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">4. ENDEREÇO</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <label className="label">Rua/Avenida *</label>
              <input
                type="text"
                name="address_street"
                className="input-field w-full"
                value={formData.address_street}
                onChange={handleInputChange}
                placeholder="Ex: Rua das Flores"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Número *</label>
              <input
                type="text"
                name="address_number"
                className="input-field w-full"
                value={formData.address_number}
                onChange={handleInputChange}
                placeholder="123"
              />
            </div>
            <div className="col-span-2">
              <label className="label">CEP *</label>
              <input
                type="text"
                name="address_zip"
                className="input-field w-full"
                value={formData.address_zip}
                onChange={handleInputChange}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
            <div className="col-span-6">
              <label className="label">Complemento</label>
              <input
                type="text"
                name="address_complement"
                className="input-field w-full"
                value={formData.address_complement}
                onChange={handleInputChange}
                placeholder="Apto, Bloco, etc."
              />
            </div>
            <div className="col-span-6">
              <label className="label">Bairro *</label>
              <input
                type="text"
                name="address_neighborhood"
                className="input-field w-full"
                value={formData.address_neighborhood}
                onChange={handleInputChange}
                placeholder="Ex: Centro"
              />
            </div>
            <div className="col-span-8">
              <label className="label">Cidade *</label>
              <input
                type="text"
                name="address_city"
                className="input-field w-full"
                value={formData.address_city}
                onChange={handleInputChange}
                placeholder="Ex: São Paulo"
              />
            </div>
            <div className="col-span-4">
              <label className="label">Estado *</label>
              <select
                name="address_state"
                className="input-field w-full"
                value={formData.address_state}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                {/* Add all states */}
              </select>
            </div>
          </div>
        </div>

        {/* 5. HISTÓRICO ACADÊMICO */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">5. HISTÓRICO ACADÊMICO</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="label">Instituição de Graduação *</label>
              <input
                type="text"
                name="graduation_institution"
                className="input-field w-full"
                value={formData.graduation_institution}
                onChange={handleInputChange}
                placeholder="Ex: Universidade de São Paulo (USP)"
              />
            </div>
            <div>
              <label className="label">Data de Início *</label>
              <input
                type="date"
                name="graduation_start_date"
                className="input-field w-full"
                value={formData.graduation_start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Data de Conclusão *</label>
              <input
                type="date"
                name="graduation_end_date"
                className="input-field w-full"
                value={formData.graduation_end_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Ano de Formatura</label>
              <input
                type="number"
                name="graduation_year"
                className="input-field w-full"
                value={formData.graduation_year}
                onChange={handleInputChange}
                placeholder="2020"
                min="1950"
                max="2030"
              />
            </div>
            <div>
              <label className="label">Média Geral (0-10)</label>
              <input
                type="number"
                name="graduation_average"
                className="input-field w-full"
                value={formData.graduation_average}
                onChange={handleInputChange}
                placeholder="8.5"
                step="0.01"
                min="0"
                max="10"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Especialidade</label>
              <input
                type="text"
                name="specialty"
                className="input-field w-full"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="Ex: Cardiologia"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            * Campos obrigatórios para geração de currículo
          </p>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
