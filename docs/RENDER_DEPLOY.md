# 🎨 Deploy no Render - Gratuito

## 1. Criar Conta
1. Acesse: https://render.com
2. Login com GitHub
3. "New" → "Web Service"
4. Conecte repositório: `FELIPE-NOBREGA06/AgendMed`

## 2. Configurar Serviço
- **Name**: `agendmed`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## 3. Variáveis de Ambiente
Adicione as mesmas variáveis do Railway (veja RAILWAY_DEPLOY.md)

## 4. Deploy
- Clique em "Create Web Service"
- Aguarde o build (5-10 minutos)
- Receberá URL: `https://agendmed.onrender.com`

## 5. Atualizar Google Console
Adicione a nova URL no Google Console

## ✅ Vantagens do Render
- Gratuito para sempre
- SSL automático
- Deploy automático do GitHub
- Suporte completo ao Node.js