#!/usr/bin/env node

// Script para gerar API Key segura para integração n8n
// Execute: node scripts/generate-api-key.js

const crypto = require('crypto');

function generateApiKey() {
  // Gerar uma chave de 32 bytes (256 bits) em formato hexadecimal
  const apiKey = crypto.randomBytes(32).toString('hex');
  return `agendmed_${apiKey}`;
}

const apiKey = generateApiKey();

console.log('🔑 API KEY gerada com sucesso!\n');
console.log('📋 Copie e cole esta variável no seu .env:\n');
console.log(`AGENDMED_API_KEY=${apiKey}\n`);
console.log('⚠️  IMPORTANTE:');
console.log('1. Mantenha esta chave em segredo');
console.log('2. Use apenas para integração n8n');
console.log('3. Adicione no seu arquivo .env');
console.log('4. Configure também no n8n como variável de ambiente');
console.log('5. Nunca commite esta chave no Git\n');

console.log('🔧 Para usar no n8n:');
console.log('1. Vá em Settings → Environment Variables');
console.log('2. Adicione: AGENDMED_API_KEY');
console.log('3. Cole o valor gerado acima');
console.log('4. Use nos headers: Authorization: Bearer {API_KEY}\n');

// Salvar no arquivo .env.local se não existir
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  // Ler arquivo existente
  let envContent = fs.readFileSync(envLocalPath, 'utf8');
  
  // Verificar se já existe AGENDMED_API_KEY
  if (!envContent.includes('AGENDMED_API_KEY')) {
    envContent += `\n# n8n Integration API Key\nAGENDMED_API_KEY=${apiKey}\n`;
    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ API Key adicionada ao .env.local');
  } else {
    console.log('ℹ️  .env.local já contém AGENDMED_API_KEY - atualize manualmente se necessário');
  }
} else {
  const envContent = `# n8n Integration API Key
AGENDMED_API_KEY=${apiKey}
`;
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Arquivo .env.local criado com API Key');
}