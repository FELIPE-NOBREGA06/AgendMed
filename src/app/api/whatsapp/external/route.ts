import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Solução híbrida: Vercel + Servidor externo para WhatsApp
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    // URL do servidor externo (Railway, Render, etc.)
    const externalServerUrl = process.env.WHATSAPP_SERVER_URL || 'https://agendmed-whatsapp.railway.app'

    if (action === 'connect') {
      // Fazer requisição para servidor externo
      const response = await fetch(`${externalServerUrl}/api/whatsapp/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AGENDMED_API_KEY}`
        },
        body: JSON.stringify({ source: 'vercel' })
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          qrCode: data.qrCode,
          message: 'QR Code gerado no servidor externo',
          serverUrl: externalServerUrl
        })
      } else {
        throw new Error('Servidor externo indisponível')
      }
    }

    if (action === 'status') {
      const response = await fetch(`${externalServerUrl}/api/whatsapp/status`, {
        headers: {
          'Authorization': `Bearer ${process.env.AGENDMED_API_KEY}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    }

    return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 })

  } catch (error) {
    console.error('Erro no servidor externo:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Servidor WhatsApp indisponível',
      message: 'Configure um servidor externo para WhatsApp',
      instructions: [
        '1. Deploy o projeto no Railway ou Render',
        '2. Configure WHATSAPP_SERVER_URL no Vercel',
        '3. Use a URL do servidor externo para WhatsApp'
      ]
    }, { status: 503 })
  }
}