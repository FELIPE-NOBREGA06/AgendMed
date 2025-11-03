import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Webhook para receber mensagens do WhatsApp Business API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Verificação do webhook (Meta Business Manager)
    if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'agendmed_webhook_token')) {
      console.log('✅ Webhook verificado com sucesso!')
      return new Response(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'Token de verificação inválido' }, { status: 403 })

  } catch (error) {
    console.error('Erro na verificação do webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📨 Webhook recebido:', JSON.stringify(body, null, 2))

    // Processar mensagens recebidas
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await processWhatsAppMessage(change.value)
          }
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Processar mensagem recebida
async function processWhatsAppMessage(messageData: any) {
  try {
    const messages = messageData.messages || []
    
    for (const message of messages) {
      const from = message.from
      const messageId = message.id
      const timestamp = message.timestamp
      
      let messageText = ''
      let messageType = message.type

      // Extrair texto da mensagem
      if (message.text) {
        messageText = message.text.body
      } else if (message.interactive) {
        messageText = message.interactive.button_reply?.title || message.interactive.list_reply?.title || ''
      }

      console.log(`📱 Mensagem recebida de ${from}: ${messageText}`)

      // Processar mensagem (aqui você pode adicionar sua lógica de negócio)
      await handleIncomingMessage({
        from,
        messageId,
        text: messageText,
        type: messageType,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString()
      })
    }

  } catch (error) {
    console.error('Erro ao processar mensagem:', error)
  }
}

// Lidar com mensagem recebida
async function handleIncomingMessage(message: any) {
  try {
    const { from, text, messageId } = message

    // Resposta automática simples
    if (text.toLowerCase().includes('oi') || text.toLowerCase().includes('olá')) {
      await sendAutoReply(from, '👋 Olá! Bem-vindo ao AgendMed! Como posso ajudá-lo?')
    } else if (text.toLowerCase().includes('agendamento')) {
      await sendAutoReply(from, '📅 Para agendar uma consulta, acesse nosso site: https://agend-med-pi.vercel.app')
    } else if (text.toLowerCase().includes('horário')) {
      await sendAutoReply(from, '🕐 Nosso atendimento é de segunda a sexta, das 8h às 18h.')
    } else {
      await sendAutoReply(from, '🤖 Mensagem recebida! Nossa equipe responderá em breve.')
    }

    // Salvar mensagem no banco (opcional)
    console.log(`💾 Mensagem salva: ${messageId}`)

  } catch (error) {
    console.error('Erro ao lidar com mensagem:', error)
  }
}

// Enviar resposta automática
async function sendAutoReply(to: string, message: string) {
  try {
    const WHATSAPP_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.log('⚠️ Tokens não configurados para resposta automática')
      return
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        text: {
          body: message
        }
      })
    })

    if (response.ok) {
      console.log(`✅ Resposta automática enviada para ${to}`)
    } else {
      console.error('❌ Erro ao enviar resposta automática')
    }

  } catch (error) {
    console.error('Erro na resposta automática:', error)
  }
}