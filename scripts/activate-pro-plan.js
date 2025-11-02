const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function activateProPlan() {
  try {
    console.log('🚀 Ativando plano Professional...');

    // Buscar o usuário (assumindo que há apenas um usuário ou você quer ativar para o primeiro)
    const user = await prisma.user.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!user) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }

    console.log(`👤 Usuário encontrado: ${user.email}`);

    // Verificar se já existe uma assinatura
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id
      }
    });

    if (existingSubscription) {
      // Atualizar assinatura existente
      await prisma.subscription.update({
        where: {
          id: existingSubscription.id
        },
        data: {
          status: 'active',
          plan: 'PROFESSIONAL',
          priceId: process.env.STRIPE_PLAN_PROFISSIONAL || 'price_1SOsZZRwJcy7k5WIZWL93YRT'
        }
      });
      console.log('✅ Assinatura existente atualizada para Professional');
    } else {
      // Criar nova assinatura
      await prisma.subscription.create({
        data: {
          id: `sub_test_${Date.now()}`, // ID temporário para teste
          userId: user.id,
          status: 'active',
          plan: 'PROFESSIONAL',
          priceId: process.env.STRIPE_PLAN_PROFISSIONAL || 'price_1SOsZZRwJcy7k5WIZWL93YRT'
        }
      });
      console.log('✅ Nova assinatura Professional criada');
    }

    console.log('🎉 Plano Professional ativado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao ativar plano:', error);
  } finally {
    await prisma.$disconnect();
  }
}

activateProPlan();