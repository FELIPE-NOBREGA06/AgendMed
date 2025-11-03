# 🚂 Deploy no Railway - WhatsApp Funcionando

## 1. Criar Conta e Projeto
1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione: `FELIPE-NOBREGA06/AgendMed`

## 2. Configurar Variáveis de Ambiente
No painel do Railway, vá em **Variables** e adicione **UMA POR VEZ**:

> ⚠️ **Importante**: Use os valores reais do seu arquivo `.env` local. Os valores abaixo são apenas placeholders.

### 🔑 Variáveis Obrigatórias:
```
DATABASE_URL
[sua_url_do_banco_neon]

AUTH_SECRET
[gere_uma_chave_secreta_aleatoria]

NEXTAUTH_SECRET
[mesma_chave_do_auth_secret]

AGENDMED_API_KEY
[sua_api_key_personalizada]
```

### 🔐 OAuth (Opcional):
```
AUTH_GITHUB_ID
[seu_github_client_id]

AUTH_GITHUB_SECRET
[seu_github_client_secret]

AUTH_GOOGLE_ID
[seu_google_client_id]

AUTH_GOOGLE_SECRET
[seu_google_client_secret]
```

### 💳 Stripe (Opcional):
```
STRIPE_SECRET_KEY
[sua_chave_secreta_stripe]

NEXT_PUBLIC_STRIPE_PUBLIC_KEY
[sua_chave_publica_stripe]
```

### 🖼️ Cloudinary (Opcional):
```
CLOUDINARY_NAME
[seu_cloudinary_name]

CLOUDINARY_KEY
[sua_cloudinary_key]

CLOUDINARY_SECRET
[seu_cloudinary_secret]
```

## 3. Configurar Build
O Railway detecta automaticamente, mas se precisar:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## 4. Atualizar Google Console
Quando o deploy terminar, você receberá uma URL como:
`https://agendmed-production-xxxx.up.railway.app`

Adicione no Google Console:
- **Origens JavaScript**: `https://agendmed-production-xxxx.up.railway.app`
- **URLs de redirecionamento**: `https://agendmed-production-xxxx.up.railway.app/api/auth/callback/google`

## 5. Testar WhatsApp
- Acesse: `https://agendmed-production-xxxx.up.railway.app/dashboard/whatsapp`
- Clique em "Gerar QR Code"
- **Funcionará perfeitamente!** ✅

## 🎉 Resultado
- ✅ WhatsApp Web.js funcionando
- ✅ QR Code gerado instantaneamente
- ✅ Conexão persistente
- ✅ Todos os recursos funcionais