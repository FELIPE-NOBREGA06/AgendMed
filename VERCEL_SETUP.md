# 🚀 Configuração da Vercel - AgendMed

## 📋 Variáveis de Ambiente Necessárias

Acesse: https://vercel.com/seu-usuario/agendmed/settings/environment-variables

Adicione estas variáveis:

### 🔐 Autenticação
```
AUTH_SECRET=your-auth-secret-here
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 🗄️ Banco de Dados
```
DATABASE_URL=your-database-connection-string
```

### 🌐 URLs
```
NEXT_PUBLIC_URL=https://agend-med-525q.vercel.app
NEXTAUTH_URL=https://agend-med-525q.vercel.app
```

### 💳 Stripe
```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_SECRET_WEBHOOK_KEY=whsec_your_webhook_secret
STRIPE_PLAN_BASIC=price_your_basic_plan_id
STRIPE_PLAN_PROFISSIONAL=price_your_professional_plan_id
STRIPE_SUCCESS_URL=https://agend-med-525q.vercel.app/dashboard/plans
STRIPE_CANCEL_URL=https://agend-med-525q.vercel.app/dashboard/plans
```

### 📸 Cloudinary
```
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

## 🔧 URLs de Callback OAuth

### GitHub
- Desenvolvimento: `http://localhost:3000/api/auth/callback/github`
- Produção: `https://agend-med-525q.vercel.app/api/auth/callback/github`

### Google
- Desenvolvimento: `http://localhost:3000/api/auth/callback/google`
- Produção: `https://agend-med-525q.vercel.app/api/auth/callback/google`

## ⚡ Após Configurar

1. **Redeploy** o projeto na Vercel
2. **Teste o login** em produção
3. **Verifique os logs** se houver erro

---

**🎯 Importante:** Sempre que mudar o domínio, atualize as URLs de callback nos provedores OAuth!