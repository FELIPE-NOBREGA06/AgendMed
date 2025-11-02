#!/usr/bin/env node

// Script para configurar variáveis de ambiente na Vercel
// Execute: node scripts/setup-vercel-env.js

const { execSync } = require('child_process');
require('dotenv').config();

const VERCEL_PROJECT_URL = 'https://agend-med-seven.vercel.app';

const envVars = {
  'AUTH_SECRET': process.env.AUTH_SECRET,
  'NEXTAUTH_URL': VERCEL_PROJECT_URL,
  'NEXT_PUBLIC_URL': VERCEL_PROJECT_URL,
  'DATABASE_URL': process.env.DATABASE_URL,
  'AUTH_GITHUB_ID': process.env.AUTH_GITHUB_ID,
  'AUTH_GITHUB_SECRET': process.env.AUTH_GITHUB_SECRET,
  'AUTH_GOOGLE_ID': process.env.AUTH_GOOGLE_ID,
  'AUTH_GOOGLE_SECRET': process.env.AUTH_GOOGLE_SECRET,
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'STRIPE_SECRET_WEBHOOK_KEY': process.env.STRIPE_SECRET_WEBHOOK_KEY,
  'STRIPE_PLAN_BASIC': process.env.STRIPE_PLAN_BASIC,
  'STRIPE_PLAN_PROFISSIONAL': process.env.STRIPE_PLAN_PROFISSIONAL,
  'STRIPE_SUCCESS_URL': `${VERCEL_PROJECT_URL}/dashboard/plans`,
  'STRIPE_CANCEL_URL': `${VERCEL_PROJECT_URL}/dashboard/plans`,
  'CLOUDINARY_NAME': process.env.CLOUDINARY_NAME,
  'CLOUDINARY_KEY': process.env.CLOUDINARY_KEY,
  'CLOUDINARY_SECRET': process.env.CLOUDINARY_SECRET,
};

console.log('🚀 Configurando variáveis de ambiente na Vercel...\n');

console.log('📋 Variáveis que serão configuradas:');
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    const displayValue = key.includes('SECRET') || key.includes('KEY') || key.includes('DATABASE') 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  } else {
    console.log(`❌ ${key}: MISSING`);
  }
});

console.log('\n🔧 Para configurar manualmente na Vercel:');
console.log('1. Acesse: https://vercel.com/dashboard');
console.log('2. Vá para seu projeto → Settings → Environment Variables');
console.log('3. Adicione cada variável mostrada acima');
console.log('4. Faça redeploy do projeto');

console.log('\n🌐 URLs de callback OAuth:');
console.log(`Google: ${VERCEL_PROJECT_URL}/api/auth/callback/google`);
console.log(`GitHub: ${VERCEL_PROJECT_URL}/api/auth/callback/github`);