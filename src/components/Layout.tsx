import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '../utils/cn'
import { useUser } from '../contexts/UserContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Upload', href: '/upload', icon: ArrowUpTrayIcon },
  { name: 'Validação', href: '/validation', icon: CheckCircleIcon },
  { name: 'Meus Editais', href: '/edicts', icon: DocumentTextIcon },
  { name: 'Perfil', href: '/profile', icon: UserCircleIcon },
]

export default function Layout() {
  const location = useLocation()
  const { user } = useUser()
  
  const userInitials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'DR'
  
  const userName = user?.full_name || 'Dr. Usuário'
  const userPlan = user?.subscription_tier || 'free'

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-black text-indigo-600">
            Barema<span className="text-slate-900">.ai</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Gestão de Currículo Médico
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500">
                Plano {userPlan === 'free' ? 'Free' : userPlan === 'basic' ? 'Básico' : 'Premium'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {navigation.find((item) => item.href === location.pathname)?.name}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  Última sincronização: há 2 minutos
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
