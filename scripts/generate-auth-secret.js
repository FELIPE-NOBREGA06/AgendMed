#!/usr/bin/env node

// Script para gerar AUTH_SECRET seguro
// Execute: node scripts/generate-auth-secret.js

const crypto = require('crypto');

function generateAuthSecret() {
  return crypto.randomBytes(32).toString('hex');
}

const authSecret = generateAuthSecret();

console.log('🔐 AUTH_SECRET gerado com sucesso!\n');
console.log('📋 Copie e cole esta variável:\n');
console.log(`AUTH_SECRET=${authSecret}\n`);
console.log('⚠️  IMPORTANTE:');
console.log('1. Mantenha este valor em segredo');
console.log('2. Use o mesmo valor em desenvolvimento e produção');
console.log('3. Adicione no seu arquivo .env e na Vercel');
console.log('4. Nunca commite este valor no Git\n');

// Salvar no arquivo .env.local se não existir
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envLocalPath)) {
  const envContent = `# Gerado automaticamente - NÃO COMMITAR
AUTH_SECRET=${authSecret}
`;
  
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Arquivo .env.local criado com AUTH_SECRET');
} else {
  console.log('ℹ️  Arquivo .env.local já existe - adicione manualmente se necessário');
}