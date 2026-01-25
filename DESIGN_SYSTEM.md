# Barema.ai Frontend - Design System

## 🎨 Paleta de Cores

### Cores Principais
- **Primária (Ação e Marca)**: `indigo-600` (#4F46E5), `indigo-700` (#4338CA)
- **Fundo de Aplicação**: `slate-50` (#F8FAFC)
- **Texto Principal**: `slate-900` (#0F172A)
- **Texto Secundário**: `slate-500` (#64748B)
- **Sucesso/Validação**: `emerald-500` (#10B981)
- **Atenção/Gaps**: `amber-500` (#F59E0B)
- **Bordas e Divisores**: `slate-200` (#E2E8F0)

## 📝 Tipografia

### Fontes
- **Sans Serif (Interface)**: Inter
- **Serif (Preview de Currículo)**: Playfair Display

### Escalamento
- **Títulos de Seção**: `text-2xl font-black tracking-tight`
- **Labels de Input**: `text-[10px] font-bold uppercase tracking-widest text-slate-400`
- **Texto de Dados**: `font-medium text-slate-700`

## 🎯 Componentes Base

### Cards
```css
.card {
  @apply bg-white border border-slate-200 rounded-3xl shadow-sm;
}
```

### Botões
```css
.btn-primary {
  @apply bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-indigo-700 transition-all duration-300;
}

.btn-secondary {
  @apply bg-white text-slate-700 font-medium py-3 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-300;
}
```

### Inputs
```css
.input-field {
  @apply bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all;
}

.label {
  @apply text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block;
}
```

## ✨ Micro-interações

- **Hover**: Transições suaves de 300ms
- **Loading IA**: Efeito shimmer (animação de pulso)
- **HITL Feedback**: Campo brilha em verde quando salvo (`ring-success-pulse`)

## 📐 Layout

- **Gutter Principal**: `p-8` (desktop), `p-4` (mobile)
- **Largura Máxima**: `max-w-6xl`
- **Gap entre Grids**: `gap-6` ou `gap-8`
- **Sidebar**: 256px (`w-64`)
- **Border Radius**: `rounded-3xl` (cards), `rounded-2xl` (botões), `rounded-xl` (inputs)

## 🔧 Utilitários Customizados

### Shimmer Loading
```css
.shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    to right,
    #f1f5f9 0%,
    #e2e8f0 20%,
    #f1f5f9 40%,
    #f1f5f9 100%
  );
}
```

### Success Ring Animation
```css
.ring-success-pulse {
  animation: success-ring 0.6s ease-out;
}
```
