import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../services/api'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    crm_number: '',
    crm_state: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const response = await endpoints.login({
          email: formData.email,
          password: formData.password,
        })
        
        // Store in localStorage
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        
        // Update AuthContext
        authLogin(response.data.access_token, response.data.user)
        
        // Check if user needs to complete KYC (no CRM)
        const needsKYC = !response.data.user.crm
        
        // Force navigation using window.location to ensure full page reload
        window.location.href = needsKYC ? '/kyc' : '/dashboard'
      } else {
        // Register
        await endpoints.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          crm_number: formData.crm_number,
          crm_state: formData.crm_state,
        })
        
        // After registration, automatically login
        const loginResponse = await endpoints.login({
          email: formData.email,
          password: formData.password,
        })
        
        // Store in localStorage
        localStorage.setItem('auth_token', loginResponse.data.access_token)
        localStorage.setItem('user_data', JSON.stringify(loginResponse.data.user))
        
        // Update AuthContext
        authLogin(loginResponse.data.access_token, loginResponse.data.user)
        
        // After registration, always go to KYC to complete profile
        window.location.href = '/kyc'
      }
    } catch (err: any) {
      // Handle specific error messages from backend
      const errorMessage = err.response?.data?.detail || err.response?.data?.message
      
      if (errorMessage) {
        setError(errorMessage)
      } else if (err.response?.status === 401) {
        setError('Email ou senha incorretos')
      } else if (err.response?.status === 404) {
        setError('Usuário não encontrado')
      } else if (err.response?.status === 400) {
        setError('Dados inválidos. Verifique os campos e tente novamente.')
      } else {
        setError('Erro ao processar sua solicitação. Por favor, tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-4">
            Barema<span className="text-indigo-200">.ai</span>
          </h1>
          <p className="text-xl text-indigo-100 font-medium">
            Gestão Inteligente de Currículo Médico
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Extração Automática com IA</h3>
              <p className="text-indigo-200">
                Nossa IA extrai dados de certificados automaticamente, economizando horas de trabalho manual.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Validação Humana</h3>
              <p className="text-indigo-200">
                Revise e valide os dados extraídos com interface intuitiva e processo rápido.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Gestão de Editais</h3>
              <p className="text-indigo-200">
                Acompanhe sua pontuação em tempo real e saiba exatamente o que falta para alcançar seus objetivos.
              </p>
            </div>
          </div>
        </div>

        <div className="text-indigo-300 text-sm">
          © 2026 Barema.ai - Todos os direitos reservados
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-black text-indigo-600 mb-2">
              Barema<span className="text-slate-900">.ai</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Gestão de Currículo Médico
            </p>
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
              </h2>
              <p className="text-slate-500">
                {isLogin
                  ? 'Entre com suas credenciais para continuar'
                  : 'Preencha os dados para começar'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="label">Nome Completo</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Dr. João Silva"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">CRM</label>
                      <input
                        type="text"
                        name="crm_number"
                        value={formData.crm_number}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        placeholder="123456"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">UF</label>
                      <select
                        name="crm_state"
                        value={formData.crm_state}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      >
                        <option value="">Selecione</option>
                        {brazilianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field w-full pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processando...
                  </span>
                ) : isLogin ? (
                  'Entrar'
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    crm_number: '',
                    crm_state: '',
                  })
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {isLogin
                  ? 'Não tem uma conta? Cadastre-se'
                  : 'Já tem uma conta? Faça login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
