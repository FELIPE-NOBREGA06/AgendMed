# 🚀 Guia Completo de Deploy - AgendMed na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel**: https://vercel.com
2. **Banco de dados PostgreSQL** (recomendo: Neon, Supabase ou Railway)
3. **Contas OAuth configuradas** (GitHub e Google)

## 🔧 Passo 1: Preparar o Banco de Dados

### Opção A: Neon (Recomendado - Gratuito)
1. Acesse: https://neon.tech
2. Crie uma conta e um novo projeto
3. Copie a `DATABASE_URL` fornecida

### Opção B: Supabase
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em Settings → Database
4. Copie a connection string

## 🔧 Passo 2: Configurar OAuth

### GitHub OAuth
1. Acesse: https://github.com/settings/developers
2. Clique em "New OAuth App"
3. Preencha:
   - **Application name**: AgendMed
   - **Homepage URL**: `https://seu-projeto.vercel.app`
   - **Authorization callback URL**: `https://seu-projeto.vercel.app/api/auth/callback/github`
4. Copie o `Client ID` e `Client Secret`

### Google OAuth
1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" → "Credentials"
4. Clique em "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://seu-projeto.vercel.app/api/auth/callback/google`
6. Copie o `Client ID` e `Client Secret`

## 🚀 Passo 3: Deploy na Vercel

### Via GitHub (Recomendado)
1. Faça push do código para o GitHub
2. Acesse: https://vercel.com/dashboard
3. Clique em "New Project"
4. Importe seu repositório
5. Configure as variáveis de ambiente (próximo passo)

### Via CLI da Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings → Environment Variables** e adicione:

### 🔐 Autenticação
```
AUTH_SECRET=gere-uma-string-aleatoria-segura
NEXTAUTH_URL=https://seu-projeto.vercel.app
AUTH_GITHUB_ID=seu-github-client-id
AUTH_GITHUB_SECRET=seu-github-client-secret
AUTH_GOOGLE_ID=seu-google-client-id
AUTH_GOOGLE_SECRET=seu-google-client-secret
```

### 🗄️ Banco de Dados
```
DATABASE_URL=sua-connection-string-postgresql
```

### 🌐 URLs da Aplicação
```
NEXT_PUBLIC_URL=https://seu-projeto.vercel.app
```

### 💳 Stripe (Opcional - para pagamentos)
```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SECRET_WEBHOOK_KEY=whsec_...
STRIPE_PLAN_BASIC=price_...
STRIPE_PLAN_PROFISSIONAL=price_...
STRIPE_SUCCESS_URL=https://seu-projeto.vercel.app/dashboard/plans
STRIPE_CANCEL_URL=https://seu-projeto.vercel.app/dashboard/plans
```

### 📸 Cloudinary (Opcional - para upload de imagens)
```
CLOUDINARY_NAME=seu-cloudinary-name
CLOUDINARY_KEY=sua-cloudinary-key
CLOUDINARY_SECRET=seu-cloudinary-secret
```

## 🔄 Passo 5: Redeploy e Teste

1. Após configurar as variáveis, faça **redeploy** na Vercel
2. Aguarde o build completar
3. Teste o login com GitHub e Google
4. Verifique se não há erros no console da Vercel

## 🐛 Solução de Problemas Comuns

### Erro: "Configuration"
- Verifique se todas as variáveis OAuth estão corretas
- Confirme se as URLs de callback estão exatas

### Erro: "AccessDenied"
- Verifique se o usuário tem permissão no OAuth provider
- Confirme se as URLs de callback estão corretas

### Erro de Banco de Dados
- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco está acessível publicamente

### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Confirme se não há erros de TypeScript

## 📱 Passo 6: Domínio Personalizado (Opcional)

1. Na Vercel, vá em **Settings → Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções da Vercel
4. **IMPORTANTE**: Atualize as URLs de callback OAuth para o novo domínio

## ✅ Checklist Final

- [ ] Banco de dados configurado e acessível
- [ ] OAuth GitHub configurado com URL correta
- [ ] OAuth Google configurado com URL correta
- [ ] Todas as variáveis de ambiente adicionadas na Vercel
- [ ] Projeto fez deploy com sucesso
- [ ] Login funciona em produção
- [ ] Não há erros no console da Vercel

---

**🎯 Dica**: Use o componente `OAuthDebug` na sua aplicação para verificar as URLs de callback em tempo real!