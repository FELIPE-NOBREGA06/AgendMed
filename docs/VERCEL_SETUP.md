# Configuração do Vercel para Google OAuth

## 🚨 Problema Comum
O Google OAuth funciona localmente mas falha no Vercel devido a variáveis de ambiente não configuradas.

## ✅ Solução: Configurar Variáveis no Vercel

### 1. Acesse o Painel do Vercel
- Vá para: https://vercel.com/dashboard
- Selecione seu projeto: `agend-med-five`

### 2. Configure as Variáveis de Ambiente
- Clique em **Settings** → **Environment Variables**
- Adicione as seguintes variáveis:

```
AUTH_GOOGLE_ID=41138152614-vcpftd0d915s5pgb50a685v6qaah0kmf.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=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
AUTH_SECRET=ECuuvHxy3Hm+XxPMB1pWwQgGUtvLfp05m0VNVNsBVEA=
NEXTAUTH_URL=https://agend-med-pi.vercel.app
DATABASE_URL=postgresql://neondb_owner:npg_CKzWX3obj8Sr@ep-old-hat-acou6rl7-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
AGENDMED_API_KEY=agendmed_8a6355c111a5349c0e84767c3c283d37bb6e976afcc6d65493fd45388b97aa55
```

### 3. Configurar para Todos os Ambientes
- Marque: **Production**, **Preview**, **Development**
- Isso garante que funcione em todos os deploys

### 4. Fazer Novo Deploy
- Após adicionar as variáveis, faça um novo deploy
- Ou vá em **Deployments** → **Redeploy**

### 5. Verificar URLs no Google Console
Certifique-se de que estas URLs estão configuradas:

**Origens JavaScript autorizadas:**
- `https://agend-med-pi.vercel.app`

**URLs de redirecionamento autorizados:**
- `https://agend-med-pi.vercel.app/api/auth/callback/google`

### 6. Testar
- Acesse: `https://agend-med-five.vercel.app/debug-vercel`
- Verifique se todas as variáveis aparecem como "✅ Configurado"
- Teste o login com Google

## 🔧 Troubleshooting

### Se ainda não funcionar:
1. **Limpe o cache do navegador**
2. **Use aba anônima**
3. **Verifique se a tela de consentimento OAuth está publicada**
4. **Aguarde alguns minutos após configurar as variáveis**

### Logs de Debug:
- Acesse: `https://agend-med-five.vercel.app/debug-vercel`
- Verifique se todas as variáveis estão configuradas