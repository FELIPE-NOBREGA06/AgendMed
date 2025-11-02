#!/bin/bash

# Script para configurar variáveis de ambiente na Vercel
# Execute: chmod +x scripts/vercel-env-setup.sh && ./scripts/vercel-env-setup.sh

echo "🚀 Configurando variáveis de ambiente na Vercel..."

# Instalar Vercel CLI se não estiver instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Fazer login na Vercel
echo "🔐 Fazendo login na Vercel..."
vercel login

# Configurar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."

# Autenticação
vercel env add AUTH_SECRET production
vercel env add AUTH_GITHUB_ID production
vercel env add AUTH_GITHUB_SECRET production
vercel env add AUTH_GOOGLE_ID production
vercel env add AUTH_GOOGLE_SECRET production

# URLs
vercel env add NEXT_PUBLIC_URL production
vercel env add NEXTAUTH_URL production

# Banco de dados
vercel env add DATABASE_URL production

# Stripe
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_WEBHOOK_KEY production
vercel env add STRIPE_PLAN_BASIC production
vercel env add STRIPE_PLAN_PROFISSIONAL production
vercel env add STRIPE_SUCCESS_URL production
vercel env add STRIPE_CANCEL_URL production

# Cloudinary
vercel env add CLOUDINARY_NAME production
vercel env add CLOUDINARY_KEY production
vercel env add CLOUDINARY_SECRET production

echo "✅ Configuração concluída!"
echo "🔄 Faça um redeploy do projeto para aplicar as mudanças."