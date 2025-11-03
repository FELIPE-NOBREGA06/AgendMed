import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// WhatsApp Business API - REAL e funciona no Vercel
export async function POST(request: NextRequest) {
  try {
    const { action, phone, message } = await request.json()

    if (action === 'send-message') {
      return await sendWhatsAppBusinessMessage(phone, message)
    }

    if (action === 'get-qr') {
      return await generateBusinessQR()
    }

    if (action === 'webhook-setup') {
      return await setupWebhook()
    }

    return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 })

  } catch (error) {
    console.error('Erro WhatsApp Business API:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro na API do WhatsApp Business',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Enviar mensagem via WhatsApp Business API
async function sendWhatsAppBusinessMessage(phone: string, message: string) {
  try {
    // Configurações da WhatsApp Business API
    const WHATSAPP_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
    
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return NextResponse.json({
        success: false,
        error: 'Configure WHATSAPP_BUSINESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID',
        setup_guide: 'Veja /docs/WHATSAPP_BUSINESS_SETUP.md'
      }, { status: 400 })
    }

    // Formatar telefone (remover caracteres especiais)
    const cleanPhone = phone.replace(/\D/g, '')
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone

    // Enviar via WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        text: {
          body: message
        }
      })
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Mensagem enviada via WhatsApp Business API!',
        messageId: data.messages[0].id,
        phone: formattedPhone,
        timestamp: new Date().toISOString(),
        provider: 'whatsapp-business-api'
      })
    } else {
      throw new Error(data.error?.message || 'Erro na API do WhatsApp')
    }

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao enviar mensagem',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Gerar QR Code para WhatsApp Business
async function generateBusinessQR() {
  try {
    // Para WhatsApp Business, o QR Code é gerado no Meta Business Manager
    // Aqui vamos criar um QR Code que direciona para o setup
    
    const QRCode = require('qrcode')
    const setupUrl = `https://business.facebook.com/wa/manage/phone-numbers/`
    
    const qrCodeImage = await QRCode.toDataURL(setupUrl, {
      width: 350,
      margin: 3,
      color: {
        dark: '#075E54', // Verde WhatsApp
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'QR Code para configuração WhatsApp Business',
      qrCode: qrCodeImage,
      setupUrl: setupUrl,
      instructions: [
        '📱 Este QR Code leva ao Meta Business Manager',
        '🔧 Configure sua conta WhatsApp Business',
        '🔑 Obtenha seu token de acesso',
        '⚙️ Configure as variáveis de ambiente'
      ],
      nextSteps: [
        '1. Acesse Meta Business Manager',
        '2. Configure WhatsApp Business API',
        '3. Obtenha Phone Number ID e Token',
        '4. Configure no Vercel: WHATSAPP_BUSINESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID'
      ]
    })

  } catch (error) {
    console.error('Erro ao gerar QR Business:', error)
    throw error
  }
}

// Configurar webhook para receber mensagens
async function setupWebhook() {
  try {
    const webhookUrl = `${process.env.NEXTAUTH_URL || 'https://agend-med-pi.vercel.app'}/api/whatsapp/webhook`
    
    return NextResponse.json({
      success: true,
      message: 'Configure o webhook no Meta Business Manager',
      webhookUrl: webhookUrl,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'agendmed_webhook_token',
      instructions: [
        '1. Acesse Meta Business Manager',
        '2. Vá em WhatsApp > Configuração',
        '3. Configure Webhook URL: ' + webhookUrl,
        '4. Use Verify Token: agendmed_webhook_token',
        '5. Ative eventos: messages, message_deliveries'
      ]
    })

  } catch (error) {
    console.error('Erro no setup webhook:', error)
    throw error
  }
}