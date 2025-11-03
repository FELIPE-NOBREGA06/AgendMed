import { NextRequest, NextResponse } from 'next/server'
import { updateWhatsAppStatus } from '@/lib/whatsapp-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Solução compatível com Vercel - QR Code funcional
export async function POST(request: NextRequest) {
  try {
    console.log('🔌 Gerando QR Code compatível com Vercel')

    const { action = 'connect' } = await request.json()

    if (action === 'connect') {
      // Gerar QR Code real usando biblioteca qrcode
      const qrData = generateWhatsAppQRData()
      const qrCodeImage = await generateQRCodeImage(qrData)
      
      const status = {
        connected: false,
        qrCode: qrCodeImage,
        phone: null,
        name: null,
        lastSeen: new Date().toISOString(),
        botType: 'vercel-compatible',
        mode: 'serverless'
      }

      updateWhatsAppStatus(status)

      return NextResponse.json({
        success: true,
        message: 'QR Code gerado com sucesso!',
        qrCode: qrCodeImage,
        connected: false,
        botType: 'vercel-compatible',
        instructions: [
          'QR Code gerado usando método compatível com Vercel',
          'Abra o WhatsApp no seu celular',
          'Vá em Menu (⋮) → Dispositivos conectados',
          'Clique em "Conectar um dispositivo"',
          'Escaneie o QR Code abaixo',
          'Nota: Este é um QR Code de demonstração'
        ],
        note: 'Para WhatsApp real, use Railway ou Render (veja documentação)'
      })
    }

    if (action === 'simulate-connection') {
      // Simular conexão bem-sucedida
      const status = {
        connected: true,
        qrCode: null,
        phone: '+55 11 99999-9999',
        name: 'AgendMed Bot (Demo)',
        lastSeen: new Date().toISOString(),
        botType: 'vercel-compatible',
        mode: 'demo'
      }

      updateWhatsAppStatus(status)

      return NextResponse.json({
        success: true,
        message: 'Conexão simulada com sucesso!',
        connected: true,
        phone: status.phone,
        name: status.name
      })
    }

    return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 })

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao gerar QR Code',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Gerar dados do QR Code WhatsApp
function generateWhatsAppQRData(): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(7)
  
  // Formato similar ao WhatsApp Web (para demonstração)
  return `1@${randomId},${timestamp},AgendMed,${Buffer.from('demo-session').toString('base64')}`
}

// Gerar imagem QR Code
async function generateQRCodeImage(data: string): Promise<string> {
  try {
    const QRCode = require('qrcode')
    
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    
    // Fallback: SVG simples
    const svgQR = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#fff"/>
        <rect x="20" y="20" width="260" height="260" fill="none" stroke="#000" stroke-width="2"/>
        <text x="150" y="140" text-anchor="middle" font-family="monospace" font-size="12">QR Code Demo</text>
        <text x="150" y="160" text-anchor="middle" font-family="monospace" font-size="10">AgendMed WhatsApp</text>
        <text x="150" y="180" text-anchor="middle" font-family="monospace" font-size="8">Escaneie para conectar</text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${Buffer.from(svgQR).toString('base64')}`
  }
}