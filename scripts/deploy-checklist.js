#!/usr/bin/env node

// Script de checklist para deploy na Vercel
// Execute: node scripts/deploy-checklist.js

const fs = require('fs');
const path = require('path');

console.log('🚀 CHECKLIST DE DEPLOY - AGENDMED\n');

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'src/lib/auth.ts',
  'prisma/schema.prisma',
  'vercel.json'
];

console.log('📁 Verificando arquivos essenciais:');
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO FALTANDO!`);
  }
});

// Verificar variáveis de ambiente
console.log('\n🔐 Variáveis de ambiente necessárias:');
const requiredEnvVars = [
  'AUTH_SECRET',
  'DATABASE_URL',
  'AUTH_GITHUB_ID',
  'AUTH_GITHUB_SECRET',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - FALTANDO!`);
  }
});

console.log('\n📋 PRÓXIMOS PASSOS:\n');

console.log('1. 🔐 Gerar AUTH_SECRET:');
console.log('   node scripts/generate-auth-secret.js\n');

console.log('2. 🗄️ Configurar banco de dados:');
console.log('   - Neon: https://neon.tech');
console.log('   - Supabase: https://supabase.com\n');

console.log('3. 🔧 Configurar OAuth:');
console.log('   - GitHub: https://github.com/settings/developers');
console.log('   - Google: https://console.cloud.google.com\n');

console.log('4. 🚀 Deploy na Vercel:');
console.log('   - Push para GitHub');
console.log('   - Conectar repositório na Vercel');
console.log('   - Configurar variáveis de ambiente\n');

console.log('5. ✅ Testar em produção:');
console.log('   - Login com GitHub');
console.log('   - Login com Google');
console.log('   - Verificar logs da Vercel\n');

console.log('📖 Guia completo: DEPLOY_GUIDE.md');
console.log('🔧 Debug OAuth: Use o componente OAuthDebug na aplicação');