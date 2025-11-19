// Script para testar WhatsApp Business API
require('dotenv').config()

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN
const TEST_NUMBER = process.env.TEST_PHONE_NUMBER || '5511999999999'

async function testWhatsAppAPI() {
  console.log('🧪 Testando WhatsApp Business API...\n')

  // Verificar configuração
  console.log('📋 Verificando configuração:')
  console.log(`   Phone Number ID: ${PHONE_NUMBER_ID ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log(`   Access Token: ${ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log(`   Número de teste: ${TEST_NUMBER}\n`)

  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error('❌ Erro: Configure WHATSAPP_PHONE_NUMBER_ID e WHATSAPP_BUSINESS_TOKEN no .env')
    process.exit(1)
  }

  // Teste 1: Enviar mensagem simples
  console.log('📤 Teste 1: Enviando mensagem simples...')
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: TEST_NUMBER.replace(/\D/g, ''),
          type: 'text',
          text: {
            body: '🤖 Teste do AgendMed Bot!\n\nSe você recebeu esta mensagem, a integração está funcionando! ✅'
          }
        })
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Mensagem enviada com sucesso!')
      console.log(`   Message ID: ${data.messages[0].id}`)
      console.log(`   Status: ${data.messages[0].message_status || 'sent'}\n`)
    } else {
      console.error('❌ Erro ao enviar mensagem:')
      console.error(`   Código: ${data.error?.code}`)
      console.error(`   Mensagem: ${data.error?.message}`)
      console.error(`   Detalhes: ${data.error?.error_data?.details}\n`)
      
      if (data.error?.code === 131026) {
        console.log('💡 Dica: O número precisa estar registrado como número de teste.')
        console.log('   Vá em: API Setup → To → Add phone number\n')
      }
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
  }

  // Teste 2: Verificar informações da conta
  console.log('📊 Teste 2: Verificando informações da conta...')
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Informações da conta:')
      console.log(`   Nome: ${data.verified_name || 'N/A'}`)
      console.log(`   Número: ${data.display_phone_number || 'N/A'}`)
      console.log(`   Qualidade: ${data.quality_rating || 'N/A'}`)
      console.log(`   Status: ${data.account_mode || 'N/A'}\n`)
    } else {
      console.error('❌ Erro ao buscar informações:', data.error?.message)
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
  }

  // Teste 3: Testar via API local
  console.log('🌐 Teste 3: Testando API local...')
  try {
    const response = await fetch('http://localhost:3001/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: TEST_NUMBER,
        message: '🧪 Teste via API local do AgendMed!'
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ API local funcionando!')
      console.log(`   Provider: ${data.provider}`)
      console.log(`   Message ID: ${data.messageId}\n`)
    } else {
      console.error('❌ Erro na API local:', data.error)
      console.log('💡 Certifique-se que o servidor está rodando: npm run dev\n')
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com API local:', error.message)
    console.log('💡 Inicie o servidor: npm run dev\n')
  }

  console.log('✅ Testes concluídos!')
  console.log('\n📚 Próximos passos:')
  console.log('   1. Verifique se recebeu as mensagens no WhatsApp')
  console.log('   2. Responda "oi" para testar o chatbot')
  console.log('   3. Configure o webhook no Meta Dashboard')
  console.log('   4. Acesse: /dashboard/whatsapp/chatbot para testar visualmente')
}

// Executar testes
testWhatsAppAPI().catch(console.error)
