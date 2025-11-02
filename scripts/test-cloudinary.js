#!/usr/bin/env node

// Script para testar configuração do Cloudinary
// Execute: node scripts/test-cloudinary.js

require('dotenv').config();

async function testCloudinary() {
  console.log('☁️ TESTANDO CONFIGURAÇÃO CLOUDINARY\n');
  
  // Verificar variáveis de ambiente
  const requiredVars = {
    'CLOUDINARY_NAME': process.env.CLOUDINARY_NAME,
    'CLOUDINARY_KEY': process.env.CLOUDINARY_KEY,
    'CLOUDINARY_SECRET': process.env.CLOUDINARY_SECRET,
  };
  
  console.log('🔐 Verificando variáveis de ambiente:');
  let allConfigured = true;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value && value !== `your-${key.toLowerCase().replace('_', '-')}`) {
      console.log(`✅ ${key}: Configurado`);
    } else {
      console.log(`❌ ${key}: FALTANDO`);
      allConfigured = false;
    }
  });
  
  if (!allConfigured) {
    console.log('\n⚠️  Configure as variáveis do Cloudinary no .env primeiro!');
    console.log('📋 Acesse: https://cloudinary.com/console');
    return;
  }
  
  // Testar conexão com Cloudinary
  console.log('\n☁️ Testando conexão com Cloudinary...');
  try {
    const { v2: cloudinary } = require('cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });
    
    // Testar API do Cloudinary
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary conectado com sucesso!');
    console.log(`📊 Status: ${result.status}`);
    
  } catch (error) {
    console.log('❌ Erro ao conectar com Cloudinary:');
    console.log(error.message);
    console.log('\n💡 Verifique:');
    console.log('1. Se as credenciais estão corretas');
    console.log('2. Se a conta Cloudinary está ativa');
    console.log('3. Se não há limite de uso atingido');
  }
  
  console.log('\n🔗 URLs importantes:');
  console.log('Dashboard: https://cloudinary.com/console');
  console.log('Configurações: https://cloudinary.com/console/settings/security');
}

testCloudinary();