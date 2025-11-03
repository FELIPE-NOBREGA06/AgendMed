import { NextRequest, NextResponse } from 'next/server'
import { updateWhatsAppStatus } from '@/lib/whatsapp-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔌 Iniciando conexão WhatsApp com Baileys')

    // Simular QR Code para teste (em produção, usar Baileys real)
    const mockQRCode = generateMockQRCode()
    
    const status = {
      connected: false,
      qrCode: mockQRCode,
      phone: null,
      name: null,
      lastSeen: new Date().toISOString(),
      botType: 'baileys',
      mode: 'serverless'
    }

    updateWhatsAppStatus(status)

    return NextResponse.json({
      success: true,
      message: 'QR Code gerado com sucesso!',
      qrCode: mockQRCode,
      connected: false,
      instructions: [
        'QR Code gerado usando método compatível com Vercel',
        'Abra o WhatsApp no seu celular',
        'Vá em Menu (⋮) → Dispositivos conectados',
        'Clique em "Conectar um dispositivo"',
        'Escaneie o QR Code'
      ]
    })

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return NextResponse.json({ 
      error: 'Erro ao gerar QR Code. Tente novamente.' 
    }, { status: 500 })
  }
}

// Função para gerar QR Code de demonstração
function generateMockQRCode(): string {
  // Em produção, isso seria gerado pelo Baileys
  const qrData = `whatsapp://connect?code=${Math.random().toString(36).substring(7)}&timestamp=${Date.now()}`
  
  // Gerar QR Code usando biblioteca qrcode
  const QRCode = require('qrcode')
  
  try {
    return QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    // Fallback: QR Code base64 simples
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K'
  }
}