#!/usr/bin/env node

// Script para verificar configurações OAuth
// Execute: node scripts/verify-oauth.js

require('dotenv').config();

function verifyOAuth() {
  console.log('🔍 VERIFICANDO CONFIGURAÇÕES OAUTH\n');
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  console.log('🌐 URLs Base:');
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
  console.log(`NEXT_PUBLIC_URL: ${process.env.NEXT_PUBLIC_URL}\n`);
  
  console.log('🔑 Credenciais OAuth:');
  console.log(`GitHub ID: ${process.env.AUTH_GITHUB_ID ? '✅ Configurado' : '❌ Faltando'}`);
  console.log(`GitHub Secret: ${process.env.AUTH_GITHUB_SECRET ? '✅ Configurado' : '❌ Faltando'}`);
  console.log(`Google ID: ${process.env.AUTH_GOOGLE_ID ? '✅ Configurado' : '❌ Faltando'}`);
  console.log(`Google Secret: ${process.env.AUTH_GOOGLE_SECRET ? '✅ Configurado' : '❌ Faltando'}\n`);
  
  console.log('🔗 URLs de Callback (COPIE EXATAMENTE):');
  console.log(`GitHub: ${baseUrl}/api/auth/callback/github`);
  console.log(`Google: ${baseUrl}/api/auth/callback/google\n`);
  
  console.log('📋 Verificar nos Provedores:');
  console.log('1. GitHub: https://github.com/settings/developers');
  console.log('   - Verifique se a Authorization callback URL está EXATA');
  console.log('2. Google: https://console.cloud.google.com');
  console.log('   - Verifique se a Authorized redirect URI está EXATA\n');
  
  console.log('🧪 Teste Manual:');
  console.log(`1. Acesse: ${baseUrl}/api/auth/signin`);
  console.log('2. Clique em um provedor');
  console.log('3. Verifique se redireciona corretamente');
}

verifyOAuth();