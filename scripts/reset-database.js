const { execSync } = require('child_process');

console.log('🔄 Resetando banco de dados...');

try {
  // Reset das migrações
  console.log('📋 Resetando migrações...');
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  
  // Gerar cliente Prisma
  console.log('🔧 Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Aplicar schema
  console.log('📊 Aplicando schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Banco de dados resetado com sucesso!');
  
} catch (error) {
  console.error('❌ Erro ao resetar banco:', error.message);
  process.exit(1);
}