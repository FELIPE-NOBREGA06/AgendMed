const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAuthData() {
  try {
    console.log('🧹 Limpando dados de autenticação...');

    // Limpar sessões
    await prisma.session.deleteMany({});
    console.log('✅ Sessões removidas');

    // Limpar contas OAuth
    await prisma.account.deleteMany({});
    console.log('✅ Contas OAuth removidas');

    // Limpar tokens de verificação
    await prisma.verificationToken.deleteMany({});
    console.log('✅ Tokens de verificação removidos');

    console.log('🎉 Dados de autenticação limpos com sucesso!');
    console.log('💡 Agora você pode tentar fazer login novamente.');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAuthData();