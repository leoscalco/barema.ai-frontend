# 🔍 DEBUG: Profile Data Not Loading

## 🐛 **Problema Reportado**

Ao recarregar a página de perfil, os campos voltam vazios mesmo após salvar, dando a impressão de que não foram persistidos.

---

## ✅ **Logs Adicionados**

### **Frontend (Console do Navegador)**

Adicionados logs detalhados em `src/pages/Profile.tsx`:

```typescript
// Ao carregar dados:
🔍 PROFILE - Loading user data...
🔍 PROFILE - User data received: {...}
🔍 PROFILE - Sample fields: {birth_city, birth_state, father_name, mother_name}
🔍 PROFILE - Setting formData: {...}
✅ PROFILE - formData updated successfully

// Ao salvar:
🔍 PROFILE - Saving profile...
🔍 PROFILE - Current formData: {...}
🔍 PROFILE - Data to send: {...}
✅ PROFILE - Save response: {...}
```

### **Backend (Terminal)**

Logs já existentes:

```
🔍 UPDATE PROFILE - User ID: ...
🔍 UPDATE PROFILE - Received data: {...}
🔍 REPOSITORY - About to flush changes...
✅ REPOSITORY - Changes flushed to database
✅ UPDATE PROFILE - Data saved to database
🔍 DB SESSION - Committing transaction...
✅ DB SESSION - Transaction committed successfully
```

---

## 🧪 **Como Testar**

### **Passo 1: Abrir Console do Navegador**

1. Abrir http://localhost:5173/profile
2. Pressionar **F12** (ou Cmd+Option+I no Mac)
3. Ir na aba **Console**

---

### **Passo 2: Recarregar a Página**

1. Pressionar **Cmd+R** (Mac) ou **Ctrl+R** (Windows)
2. Observar os logs no console:

**✅ Esperado:**
```
🔍 PROFILE - Loading user data...
🔍 PROFILE - User data received: {
  full_name: "João Silva Santos",
  birth_city: "São Paulo",
  birth_state: "SP",
  father_name: "José Silva",
  mother_name: "Maria Silva",
  // ... outros campos
}
🔍 PROFILE - Sample fields: {
  birth_city: "São Paulo",
  birth_state: "SP",
  father_name: "José Silva",
  mother_name: "Maria Silva"
}
🔍 PROFILE - Setting formData: {...}
✅ PROFILE - formData updated successfully
```

**❌ Se aparecer campos null:**
```
🔍 PROFILE - User data received: {
  full_name: "João Silva Santos",
  birth_city: null,  // ❌ PROBLEMA: Backend não retornou
  birth_state: null,
  father_name: null,
  mother_name: null
}
```
**→ Significa que o backend não está retornando os campos**

---

### **Passo 3: Preencher e Salvar**

1. Preencher alguns campos:
   - Nome Completo: João Silva Santos
   - Cidade de Nascimento: São Paulo
   - Estado de Nascimento: SP
   - Nome do Pai: José Silva
   - Nome da Mãe: Maria Silva

2. Clicar em **"Salvar Alterações"**

3. Observar logs no console:

**✅ Esperado:**
```
🔍 PROFILE - Saving profile...
🔍 PROFILE - Current formData: {
  full_name: "João Silva Santos",
  birth_city: "São Paulo",
  birth_state: "SP",
  father_name: "José Silva",
  mother_name: "Maria Silva",
  // ...
}
🔍 PROFILE - Data to send: {
  full_name: "João Silva Santos",
  birth_city: "São Paulo",
  birth_state: "SP",
  father_name: "José Silva",
  mother_name: "Maria Silva"
}
✅ PROFILE - Save response: {
  id: "...",
  full_name: "João Silva Santos",
  birth_city: "São Paulo",  // ✅ Backend retornou
  birth_state: "SP",
  father_name: "José Silva",
  mother_name: "Maria Silva",
  // ...
}
```

4. Observar logs no terminal do backend:

```
🔍 UPDATE PROFILE - User ID: 81369f57...
🔍 UPDATE PROFILE - Received data: {'birth_city': 'São Paulo', ...}
🔍 REPOSITORY - About to flush changes...
✅ REPOSITORY - Changes flushed to database
✅ UPDATE PROFILE - Data saved to database
🔍 DB SESSION - Committing transaction...
✅ DB SESSION - Transaction committed successfully
INFO: "PATCH /api/v1/users/me HTTP/1.1" 200 OK
```

---

### **Passo 4: Recarregar Novamente**

1. Pressionar **Cmd+R** (Mac) ou **Ctrl+R** (Windows)
2. Verificar se os campos aparecem preenchidos
3. Observar logs no console

**✅ Se funcionar:**
- Os campos devem aparecer preenchidos
- Logs devem mostrar `User data received` com os valores salvos

**❌ Se não funcionar:**
- Compartilhar os logs completos do console
- Compartilhar os logs completos do terminal do backend

---

## 🔍 **Diagnóstico de Problemas**

### **Cenário 1: Campos aparecem null no GET**

```javascript
// Console mostra:
birth_city: null,
father_name: null
```

**Causa:** Backend não está retornando os campos no GET `/users/me`

**Solução:** Verificar se o endpoint GET está retornando todos os campos:
```bash
curl -s -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq '{birth_city, birth_state, father_name, mother_name}'
```

---

### **Cenário 2: Save response não retorna os campos**

```javascript
// Console mostra:
✅ PROFILE - Save response: {
  birth_city: null,  // ❌ Backend não retornou após salvar
  father_name: null
}
```

**Causa:** Backend está salvando mas não retornando os campos atualizados no response do PATCH

**Solução:** Verificar se o endpoint PATCH está construindo o `UserResponse` corretamente

---

### **Cenário 3: Dados são salvos mas não aparecem no GET seguinte**

```javascript
// Ao salvar:
✅ PROFILE - Save response: { birth_city: "São Paulo" }

// Ao recarregar:
🔍 PROFILE - User data received: { birth_city: null }
```

**Causa:** Commit não está sendo feito ou há rollback

**Solução:** Verificar logs do backend para confirmar commit:
```
✅ DB SESSION - Transaction committed successfully
```

---

## 📊 **Checklist de Verificação**

Após testar, responda:

- [ ] O console mostra "User data received" com os campos preenchidos?
- [ ] Os campos aparecem preenchidos na tela após recarregar?
- [ ] O "Save response" retorna os campos salvos?
- [ ] O backend mostra "Transaction committed successfully"?
- [ ] Após salvar e recarregar, os dados persistem?

---

## 🎯 **Próximos Passos**

### **Se os campos aparecerem null no GET:**
→ O problema está no endpoint GET `/users/me` do backend

### **Se o Save response não retornar os campos:**
→ O problema está no endpoint PATCH `/users/me` do backend

### **Se tudo parecer funcionar mas não persistir:**
→ O problema está no commit da transação

### **Se persistir mas não carregar:**
→ O problema está no `loadUserData()` do frontend

---

**Criado em:** 2026-02-03  
**Status:** 🔍 AGUARDANDO TESTE COM LOGS
