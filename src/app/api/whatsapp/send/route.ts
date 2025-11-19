import { NextRequest, NextResponse } from 'next/server'

// Enviar mensagem via WhatsApp Business API (compatível com Vercel)
export async function POST(request: NextRequest) {
  try {
    const { to, message, type = 'text' } = await request.json()

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Telefone e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Opção 1: WhatsApp Business API (Meta)
    if (process.env.WHATSAPP_BUSINESS_TOKEN) {
      return await sendViaBusinessAPI(to, message, type)
    }

    // Opção 2: Twilio
    if (process.env.TWILIO_ACCOUNT_SID) {
      return await sendViaTwilio(to, message)
    }

    // Opção 3: Baileys (requer servidor externo)
    if (process.env.BAILEYS_WEBHOOK_URL) {
      return await sendViaBaileys(to, message)
    }

    return NextResponse.json(
      { error: 'Nenhum provedor de WhatsApp configurado' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}

// WhatsApp Business API (Meta)
async function sendViaBusinessAPI(to: string, message: string, type: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_BUSINESS_TOKEN

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: type,
        text: { body: message }
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro ao enviar mensagem')
  }

  return NextResponse.json({
    success: true,
    messageId: data.messages[0].id,
    provider: 'whatsapp-business-api'
  })
}

// Twilio WhatsApp
async function sendViaTwilio(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${to}`,
        Body: message
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao enviar via Twilio')
  }

  return NextResponse.json({
    success: true,
    messageId: data.sid,
    provider: 'twilio'
  })
}

// Baileys via webhook externo
async function sendViaBaileys(to: string, message: string) {
  const webhookUrl = process.env.BAILEYS_WEBHOOK_URL

  const response = await fetch(webhookUrl!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message })
  })

  const data = await response.json()

  return NextResponse.json({
    success: true,
    messageId: data.messageId,
    provider: 'baileys'
  })
}
