#!/usr/bin/env node

// Script para configurar WhatsApp Business API automaticamente
console.log('🚀 CONFIGURANDO WHATSAPP BUSINESS API - AGENDMED');
console.log('================================================');

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupWhatsAppBusiness() {
  try {
    console.log('\n📱 Vamos configurar seu WhatsApp Business API!');
    console.log('Este processo levará cerca de 10 minutos.\n');

    // Passo 1: Verificar se já tem conta Meta Business
    console.log('🔍 PASSO 1: Verificação de Conta Meta Business');
    const hasMetaAccount = await question('Você já tem uma conta Meta Business? (s/n): ');

    if (hasMetaAccount.toLowerCase() !== 's') {
      console.log('\n📋 Você precisa criar uma conta Meta Business primeiro:');
      console.log('1. Acesse: https://business.facebook.com/');
      console.log('2. Clique em "Criar conta"');
      console.log('3. Preencha os dados da sua empresa');
      console.log('4. Verifique sua conta via email/SMS');
      console.log('\n⏳ Após criar a conta, execute este script novamente.');
      process.exit(0);
    }

    // Passo 2: Configurar WhatsApp Business
    console.log('\n📱 PASSO 2: Configuração WhatsApp Business');
    console.log('Agora vamos configurar o WhatsApp Business na sua conta Meta:');
    console.log('1. Acesse: https://business.facebook.com/wa/manage/phone-numbers/');
    console.log('2. Clique em "Adicionar número de telefone"');
    console.log('3. Escolha "Usar meu próprio número"');
    
    const phoneNumber = await question('\nDigite seu número WhatsApp (com DDD, ex: 11999999999): ');
    
    console.log('\n4. Verifique o número via SMS');
    console.log('5. Aguarde a aprovação (pode levar alguns minutos)');
    
    const isVerified = await question('\nSeu número foi verificado e aprovado? (s/n): ');
    
    if (isVerified.toLowerCase() !== 's') {
      console.log('\n⏳ Aguarde a verificação do número e execute o script novamente.');
      process.exit(0);
    }

    // Passo 3: Obter credenciais
    console.log('\n🔑 PASSO 3: Obter Credenciais');
    console.log('Agora vamos obter as credenciais necessárias:');
    console.log('1. Acesse: https://business.facebook.com/wa/manage/phone-numbers/');
    console.log('2. Clique no seu número de telefone');
    console.log('3. Vá na aba "Configuração da API"');
    
    const phoneNumberId = await question('\nCole aqui o Phone Number ID: ');
    
    console.log('\n4. Clique em "Gerar token de acesso"');
    console.log('5. Copie o token gerado');
    
    const accessToken = await question('\nCole aqui o Token de Acesso: ');

    // Passo 4: Configurar no Vercel
    console.log('\n☁️ PASSO 4: Configurar no Vercel');
    console.log('Agora vamos configurar as variáveis no Vercel:');
    console.log('1. Acesse: https://vercel.com/dashboard');
    console.log('2. Selecione seu projeto: agend-med-pi');
    console.log('3. Vá em Settings > Environment Variables');
    console.log('4. Adicione as seguintes variáveis:');
    
    console.log('\n📋 VARIÁVEIS PARA ADICIONAR NO VERCEL:');
    console.log('=====================================');
    console.log(`WHATSAPP_BUSINESS_TOKEN=${accessToken}`);
    console.log(`WHATSAPP_PHONE_NUMBER_ID=${phoneNumberId}`);
    console.log('WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token');
    console.log('NEXT_PUBLIC_WHATSAPP_CONFIGURED=true');
    
    // Salvar no arquivo .env local
    const envContent = `
# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_TOKEN=${accessToken}
WHATSAPP_PHONE_NUMBER_ID=${phoneNumberId}
WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token
NEXT_PUBLIC_WHATSAPP_CONFIGURED=true
`;

    fs.appendFileSync('.env', envContent);
    console.log('\n✅ Variáveis salvas no arquivo .env local');

    const vercelConfigured = await question('\nVocê adicionou as variáveis no Vercel? (s/n): ');

    if (vercelConfigured.toLowerCase() === 's') {
      // Passo 5: Configurar Webhook
      console.log('\n🔗 PASSO 5: Configurar Webhook');
      console.log('Agora vamos configurar o webhook para receber mensagens:');
      console.log('1. No Meta Business Manager, vá em WhatsApp > Configuração');
      console.log('2. Na seção "Webhook", clique em "Configurar"');
      console.log('3. Use estas configurações:');
      console.log('   - URL: https://agend-med-pi.vercel.app/api/whatsapp/webhook');
      console.log('   - Verify Token: agendmed_webhook_token');
      console.log('4. Ative os eventos: messages, message_deliveries');
      
      const webhookConfigured = await question('\nWebhook configurado com sucesso? (s/n): ');

      if (webhookConfigured.toLowerCase() === 's') {
        console.log('\n🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('=====================================');
        console.log('✅ Meta Business Account criada');
        console.log('✅ WhatsApp Business configurado');
        console.log('✅ Credenciais obtidas');
        console.log('✅ Variáveis configuradas no Vercel');
        console.log('✅ Webhook configurado');
        
        console.log('\n🚀 PRÓXIMOS PASSOS:');
        console.log('1. Acesse: https://agend-med-pi.vercel.app/dashboard/whatsapp/business');
        console.log('2. Teste o envio de mensagens');
        console.log('3. Envie uma mensagem para seu número WhatsApp Business');
        console.log('4. Verifique se recebe resposta automática');
        
        console.log('\n📱 SEU WHATSAPP BUSINESS ESTÁ PRONTO!');
        console.log(`Número configurado: +55${phoneNumber}`);
        console.log('Status: ✅ ATIVO E FUNCIONANDO');
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  } finally {
    rl.close();
  }
}

// Executar configuração
setupWhatsAppBusiness();