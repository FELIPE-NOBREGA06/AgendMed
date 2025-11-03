import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Enviar mensagem WhatsApp - Compatível com Vercel
export async function POST(request: NextRequest) {
  try {
    const { phone, message, type = 'text' } = await request.json()

    // Validar dados
    if (!phone || !message) {
      return NextResponse.json({
        success: false,
        error: 'Telefone e mensagem são obrigatórios'
      }, { status: 400 })
    }

    // Formatar telefone
    const formattedPhone = formatPhoneNumber(phone)
    
    // Simular envio de mensagem (em produção, usar Baileys ou WhatsApp Business API)
    const messageResult = await sendWhatsAppMessage(formattedPhone, message, type)

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
      messageId: messageResult.messageId,
      phone: formattedPhone,
      timestamp: new Date().toISOString(),
      status: 'sent'
    })

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao enviar mensagem',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Formatar número de telefone
function formatPhoneNumber(phone: string): string {
  // Remover caracteres especiais
  let cleaned = phone.replace(/\D/g, '')
  
  // Adicionar código do país se não tiver
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned
  }
  
  // Formato: 5511999999999@s.whatsapp.net
  return cleaned + '@s.whatsapp.net'
}

// Enviar mensagem WhatsApp
async function sendWhatsAppMessage(phone: string, message: string, type: string) {
  try {
    // Simular envio (em produção, usar Baileys ou WhatsApp Business API)
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    console.log(`📤 Enviando ${type} para ${phone}:`, message)
    
    // Aqui seria a implementação real:
    // 1. Baileys: sock.sendMessage(phone, { text: message })
    // 2. WhatsApp Business API: fetch('https://graph.facebook.com/...')
    // 3. Twilio: client.messages.create(...)
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      messageId: messageId,
      status: 'sent',
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Erro no envio:', error)
    throw error
  }
}