#!/usr/bin/env node

// Script para testar todas as configurações
// Execute: node scripts/test-all-config.js

require('dotenv').config();

async function testAllConfig() {
  console.log('🧪 TESTANDO TODAS AS CONFIGURAÇÕES\n');
  
  // Verificar variáveis essenciais
  const requiredVars = {
    'AUTH_SECRET': process.env.AUTH_SECRET,
    'DATABASE_URL': process.env.DATABASE_URL,
    'AUTH_GITHUB_ID': process.env.AUTH_GITHUB_ID,
    'AUTH_GITHUB_SECRET': process.env.AUTH_GITHUB_SECRET,
    'AUTH_GOOGLE_ID': process.env.AUTH_GOOGLE_ID,
    'AUTH_GOOGLE_SECRET': process.env.AUTH_GOOGLE_SECRET,
  };
  
  console.log('🔐 Verificando variáveis de ambiente:');
  let allConfigured = true;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value && value !== `COLE_SEU_${key}_AQUI` && value !== 'COLE_SUA_DATABASE_URL_AQUI') {
      console.log(`✅ ${key}: Configurado`);
    } else {
      console.log(`❌ ${key}: FALTANDO`);
      allConfigured = false;
    }
  });
  
  if (!allConfigured) {
    console.log('\n⚠️  Configure as variáveis faltantes no .env.local primeiro!');
    return;
  }
  
  // Testar banco de dados
  console.log('\n🗄️ Testando conexão com banco...');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    console.log('✅ Banco conectado com sucesso!');
    
    // Aplicar schema
    console.log('🔄 Aplicando schema do banco...');
    const { execSync } = require('child_process');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
    console.log('✅ Schema aplicado!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Erro no banco:', error.message);
  }
  
  // Verificar URLs de callback
  console.log('\n🔗 URLs de callback configuradas:');
  console.log(`GitHub: http://localhost:3000/api/auth/callback/github`);
  console.log(`Google: http://localhost:3000/api/auth/callback/google`);
  
  console.log('\n🚀 Próximos passos:');
  console.log('1. Reinicie o servidor: npm run dev');
  console.log('2. Acesse: http://localhost:3000');
  console.log('3. Teste o login com GitHub e Google');
  console.log('4. Se funcionar, faça deploy na Vercel!');
}

testAllConfig();