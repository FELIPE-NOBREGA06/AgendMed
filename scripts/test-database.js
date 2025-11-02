#!/usr/bin/env node

// Script para testar conexão com banco de dados
// Execute: node scripts/test-database.js

require('dotenv').config({ path: '.env.local' });

async function testDatabase() {
  console.log('🗄️ Testando conexão com banco de dados...\n');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL não configurada!');
    console.log('📝 Configure no arquivo .env.local');
    return;
  }
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('🔄 Conectando...');
    await prisma.$connect();
    
    console.log('✅ Conexão com banco estabelecida!');
    console.log('🔄 Aplicando migrações...');
    
    // Tentar fazer push do schema
    const { execSync } = require('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Banco de dados configurado com sucesso!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Erro ao conectar com banco:');
    console.log(error.message);
    console.log('\n💡 Verifique:');
    console.log('1. Se a DATABASE_URL está correta');
    console.log('2. Se o banco está acessível');
    console.log('3. Se as credenciais estão corretas');
  }
}

testDatabase();