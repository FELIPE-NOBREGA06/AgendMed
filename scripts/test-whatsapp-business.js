#!/usr/bin/env node

// Script para testar WhatsApp Business API
console.log('🧪 TESTANDO WHATSAPP BUSINESS API - AGENDMED');
console.log('==========================================');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testWhatsAppBusiness() {
  try {
    console.log('\n📱 Vamos testar seu WhatsApp Business API!');
    
    // Verificar variáveis de ambiente
    console.log('\n🔍 VERIFICANDO CONFIGURAÇÃO...');
    
    const hasToken = process.env.WHATSAPP_BUSINESS_TOKEN;
    const hasPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const hasVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    console.log(`Token de Acesso: ${hasToken ? '✅ Configurado' : '❌ Não encontrado'}`);
    console.log(`Phone Number ID: ${hasPhoneId ? '✅ Configurado' : '❌ Não encontrado'}`);
    console.log(`Verify Token: ${hasVerifyToken ? '✅ Configurado' : '❌ Não encontrado'}`);
    
    if (!hasToken || !hasPhoneId) {
      console.log('\n❌ CONFIGURAÇÃO INCOMPLETA!');
      console.log('Execute: node scripts/setup-whatsapp-business.js');
      process.exit(1);
    }
    
    console.log('\n✅ CONFIGURAÇÃO OK!');
    
    // Teste de envio
    console.log('\n📤 TESTE DE ENVIO DE MENSAGEM');
    const phoneNumber = await question('Digite um número para teste (com DDD, ex: 11999999999): ');
    const message = await question('Digite a mensagem de teste: ');
    
    console.log('\n🚀 Enviando mensagem...');
    
    try {
      const response = await fetch('https://agend-med-pi.vercel.app/api/whatsapp/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send-message',
          phone: phoneNumber,
          message: message
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ MENSAGEM ENVIADA COM SUCESSO!');
        console.log(`📱 Para: +55${phoneNumber}`);
        console.log(`💬 Mensagem: ${message}`);
        console.log(`🆔 Message ID: ${data.messageId}`);
        console.log(`⏰ Timestamp: ${data.timestamp}`);
      } else {
        console.log('❌ ERRO AO ENVIAR MENSAGEM:');
        console.log(data.error);
      }
      
    } catch (error) {
      console.log('❌ ERRO NA REQUISIÇÃO:');
      console.log(error.message);
    }
    
    // Teste de webhook
    console.log('\n🔗 TESTE DE WEBHOOK');
    console.log('Para testar o recebimento de mensagens:');
    console.log(`1. Envie uma mensagem para seu número WhatsApp Business`);
    console.log(`2. Escreva "oi" ou "olá"`);
    console.log(`3. Você deve receber uma resposta automática`);
    
    const webhookTest = await question('\nVocê recebeu resposta automática? (s/n): ');
    
    if (webhookTest.toLowerCase() === 's') {
      console.log('✅ WEBHOOK FUNCIONANDO!');
    } else {
      console.log('⚠️ WEBHOOK PODE PRECISAR DE CONFIGURAÇÃO');
      console.log('Verifique: https://business.facebook.com/wa/manage/phone-numbers/');
    }
    
    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DO TESTE');
    console.log('===========================');
    console.log('✅ Configuração: OK');
    console.log(`${data?.success ? '✅' : '❌'} Envio de mensagens: ${data?.success ? 'FUNCIONANDO' : 'COM PROBLEMAS'}`);
    console.log(`${webhookTest.toLowerCase() === 's' ? '✅' : '⚠️'} Recebimento: ${webhookTest.toLowerCase() === 's' ? 'FUNCIONANDO' : 'VERIFICAR'}`);
    
    if (data?.success && webhookTest.toLowerCase() === 's') {
      console.log('\n🎉 PARABÉNS! SEU WHATSAPP BUSINESS ESTÁ 100% FUNCIONAL!');
      console.log('Acesse: https://agend-med-pi.vercel.app/dashboard/whatsapp/business');
    } else {
      console.log('\n🔧 ALGUNS AJUSTES PODEM SER NECESSÁRIOS');
      console.log('Consulte: docs/CONFIGURACAO_WHATSAPP_PASSO_A_PASSO.md');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    rl.close();
  }
}

// Executar teste
testWhatsAppBusiness();