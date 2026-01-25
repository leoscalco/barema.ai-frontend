import React from 'react'
import { useUser } from '../contexts/UserContext'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Profile() {
  const { user } = useUser()

  const planComparison = {
    free: {
      name: 'Plano Free',
      price: 'R$ 0',
      features: [
        { name: '10 uploads por mês', included: true },
        { name: 'Extração com IA básica', included: true },
        { name: '2 editais simultâneos', included: true },
        { name: 'Validação manual', included: true },
        { name: 'Exportação Lattes XML', included: false },
        { name: 'Exportação Curriculum Vitae PDF', included: false },
        { name: 'Uploads ilimitados', included: false },
        { name: 'IA avançada com alta confiança', included: false },
        { name: 'Editais ilimitados', included: false },
        { name: 'Suporte prioritário', included: false },
        { name: 'Análise de gaps avançada', included: false },
        { name: 'Recomendações personalizadas', included: false },
      ],
    },
    pro: {
      name: 'Plano Pro',
      price: 'R$ 49,90/mês',
      features: [
        { name: '10 uploads por mês', included: true },
        { name: 'Extração com IA básica', included: true },
        { name: '2 editais simultâneos', included: true },
        { name: 'Validação manual', included: true },
        { name: 'Exportação Lattes XML', included: true },
        { name: 'Exportação Curriculum Vitae PDF', included: true },
        { name: 'Uploads ilimitados', included: true },
        { name: 'IA avançada com alta confiança', included: true },
        { name: 'Editais ilimitados', included: true },
        { name: 'Suporte prioritário', included: true },
        { name: 'Análise de gaps avançada', included: true },
        { name: 'Recomendações personalizadas', included: true },
      ],
    },
  }

  return (
    <div className="max-w-4xl">
      <h1 className="section-title mb-8">Meu Perfil</h1>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Informações Pessoais</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">Nome Completo</label>
              <input
                type="text"
                className="input-field w-full"
                defaultValue={user?.full_name || 'Dr. João Silva Santos'}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field w-full"
                defaultValue={user?.email || 'dev@barema.ai'}
              />
            </div>
            <div>
              <label className="label">CRM</label>
              <input
                type="text"
                className="input-field w-full"
                defaultValue={user?.crm || '123456-SP'}
              />
            </div>
            <div>
              <label className="label">Especialidade</label>
              <input
                type="text"
                className="input-field w-full"
                defaultValue={user?.specialty || 'Cardiologia'}
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Plano Atual</h2>
          <p className="text-slate-500 mb-6">Gerencie sua assinatura</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Free Plan */}
            <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-600 flex items-center justify-center text-white font-bold text-xl">
                  ★
                </div>
                <div>
                  <div className="font-black text-lg text-slate-900">{planComparison.free.name}</div>
                  <div className="text-sm text-slate-500">{planComparison.free.price}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {planComparison.free.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={feature.included ? 'text-slate-700' : 'text-slate-400 line-through'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 relative">
              <div className="absolute -top-3 right-6">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  RECOMENDADO
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  ★★
                </div>
                <div>
                  <div className="font-black text-lg text-slate-900">{planComparison.pro.name}</div>
                  <div className="text-sm text-slate-500">{planComparison.pro.price}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {planComparison.pro.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={feature.included ? 'text-slate-700' : 'text-slate-400 line-through'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn-primary w-full">
            Fazer Upgrade para Pro →
          </button>
        </div>

        {/* Export Options */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Exportar Currículo</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left">
              <div className="text-3xl mb-3">📄</div>
              <div className="font-bold text-slate-900 mb-1">Lattes (XML)</div>
              <div className="text-sm text-slate-500">Formato oficial CNPq</div>
            </button>

            <button className="p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left">
              <div className="text-3xl mb-3">📋</div>
              <div className="font-bold text-slate-900 mb-1">Curriculum Vitae (PDF)</div>
              <div className="text-sm text-slate-500">Versão formatada</div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn-primary">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}
