# Barema.ai Frontend - Setup Completo ✅

## 📦 Estrutura do Projeto

```
barema.ai-frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   └── Layout.tsx     # Sidebar + Header
│   ├── pages/             # Páginas da aplicação
│   │   ├── Dashboard.tsx  # Visão geral + Gamificação
│   │   ├── Upload.tsx     # Upload inteligente de certificados
│   │   ├── Validation.tsx # Human-in-the-Loop (HITL)
│   │   ├── Edicts.tsx     # Editais + Barema + Ranking
│   │   └── Profile.tsx    # Perfil + Exportação
│   ├── hooks/             # Hooks personalizados
│   │   ├── useAuth.ts     # Autenticação
│   │   └── useCurriculum.ts # Gestão de certificados
│   ├── services/          # Cliente API
│   │   └── api.ts         # Axios + Interceptors
│   ├── types/             # TypeScript types
│   │   └── index.ts       # Interfaces principais
│   ├── utils/             # Utilidades
│   │   └── cn.ts          # Merge de classes Tailwind
│   ├── App.tsx            # Router principal
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind + Design System
└── package.json           # Dependências

```

## 🎨 Design System Implementado

### Paleta de Cores
- **Primária**: `indigo-600` / `indigo-700`
- **Fundo**: `slate-50`
- **Sucesso**: `emerald-500`
- **Atenção**: `amber-500`
- **Texto**: `slate-900` / `slate-500`

### Componentes CSS
```css
.card                 → Cards com bg-white, border-slate-200, rounded-3xl
.btn-primary          → Botões principais (indigo)
.btn-secondary        → Botões secundários (white)
.input-field          → Inputs estilizados
.label                → Labels uppercase com tracking
.section-title        → Títulos de seção
.shimmer              → Loading effect para IA
.ring-success-pulse   → Animação de sucesso (HITL)
```

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.2.3 | Framework UI |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.3.1 | Build Tool |
| Tailwind CSS | 4.1.18 | Design System |
| React Router | 7.13.0 | Navegação |
| Axios | 1.13.3 | Cliente HTTP |
| Heroicons | 2.2.0 | Ícones |

## 📋 Páginas Implementadas

### 1. Dashboard (`/dashboard`)
- ✅ Cards de estatísticas (Total, Pontuação, Pendentes)
- ✅ Progress Rings por categoria (Cursos, Publicações, Monitoria, Eventos)
- ✅ Recomendações da IA (cards clicáveis com impacto de pontos)

### 2. Upload (`/upload`)
- ✅ Drag & Drop zone
- ✅ Grid de categorias com ícones e contadores
- ✅ Lista de arquivos recentes com status (Success, Processing, Pending)
- ✅ Efeito shimmer em itens processando

### 3. Validação (`/validation`)
- ✅ Split-screen (Documento | Formulário)
- ✅ Campos com badges de confiança da IA (98%, 95%, 72%)
- ✅ Botões "Confirmar e Salvar" e "Reportar Erro"
- ✅ Queue info (5 certificados pendentes)

### 4. Editais (`/edicts`)
- ✅ Busca de editais
- ✅ Score Card (Pontuação / Máximo)
- ✅ Posição no ranking
- ✅ Análise de Gaps (categorias faltantes com +pontos)

### 5. Perfil (`/profile`)
- ✅ Formulário de informações pessoais
- ✅ Card de assinatura (Plano Free)
- ✅ Exportação (Lattes XML / Curriculum Vitae PDF)

## 🔌 API Integration

### Cliente API (`src/services/api.ts`)
```typescript
endpoints.register()              // POST /users/register
endpoints.login()                 // POST /users/login
endpoints.profile()               // GET /users/profile
endpoints.getCertificates()       // GET /certificates/
endpoints.uploadCertificate()     // POST /certificates/upload
endpoints.updateCertificate()     // PATCH /certificates/{id}
endpoints.getGlobalRanking()      // GET /ranking/global
endpoints.getRegionalRanking()    // GET /ranking/regional/{state}
endpoints.getEdicts()             // GET /edicts/
endpoints.evaluateEdict()         // POST /edicts/{id}/evaluate
endpoints.exportLattes()          // GET /lattes/export
```

### Hooks Personalizados
- `useAuth()` → Autenticação (login, logout, user state)
- `useCurriculum()` → Certificados (fetch, refresh, stats)

## 🎯 Features Técnicas

### Micro-interações
- ✅ Transições suaves (300ms)
- ✅ Shimmer effect para loading IA
- ✅ Success ring animation (HITL)
- ✅ Hover states em todos os botões/cards

### Responsividade
- ✅ Grid adaptativos (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- ✅ Padding responsivo (`p-8` desktop, `p-4` mobile)
- ✅ Sidebar fixa 256px (`w-64`)

### UX Highlights
- ✅ Navegação ativa (highlight indigo)
- ✅ Status badges coloridos (Success, Warning, Processing)
- ✅ Confidence scores da IA em cada campo (HITL)
- ✅ Gamificação visual (progress rings, recomendações)

## 🖥️ Como Rodar

```bash
cd barema.ai-frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

Backend API (deve estar rodando): **http://localhost:8000**

## 📝 Próximos Passos

1. **Autenticação**: Implementar telas de Login/Register
2. **Upload Real**: Integrar drag-drop com FormData
3. **PDF Viewer**: Adicionar `react-pdf` na página de Validação
4. **WebSocket**: Real-time updates no status de processamento
5. **Charts**: Adicionar `recharts` para gráficos de evolução
6. **Toast Notifications**: Feedback visual para ações
7. **Filtros Avançados**: Search e filtros nas listagens
8. **Dark Mode**: Toggle de tema

## 📚 Documentação de Referência

- [Design System](./DESIGN_SYSTEM.md)
- [Tailwind Config](./TAILWIND_CONFIG.md)
- [API Backend](../barema.ai-backend/API_FLOW.md)

---

**Status**: ✅ Base completa | 🎨 Design System implementado | 🔌 API integrada | 📱 Responsivo
