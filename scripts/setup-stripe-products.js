const Stripe = require('stripe');

// Carrega a chave secreta do Stripe das variáveis de ambiente
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function setupStripeProducts() {
  try {
    console.log('🚀 Configurando produtos no Stripe...');

    // Criar produto Basic
    const basicProduct = await stripe.products.create({
      name: 'AgendMed Basic',
      description: 'Plano básico para clínicas menores',
    });

    // Criar preço para o produto Basic (R$ 27,90/mês)
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 2790, // R$ 27,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });

    // Criar produto Professional
    const professionalProduct = await stripe.products.create({
      name: 'AgendMed Professional',
      description: 'Plano profissional para clínicas grandes',
    });

    // Criar preço para o produto Professional (R$ 97,90/mês)
    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 9790, // R$ 97,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });

    console.log('✅ Produtos criados com sucesso!');
    console.log('\n📋 Adicione estas variáveis ao seu arquivo .env:');
    console.log(`STRIPE_PLAN_BASIC=${basicPrice.id}`);
    console.log(`STRIPE_PLAN_PROFISSIONAL=${professionalPrice.id}`);
    
    console.log('\n🔗 Links dos produtos no Dashboard:');
    console.log(`Basic: https://dashboard.stripe.com/test/products/${basicProduct.id}`);
    console.log(`Professional: https://dashboard.stripe.com/test/products/${professionalProduct.id}`);

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error.message);
  }
}

setupStripeProducts();