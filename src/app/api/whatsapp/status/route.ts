import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppStatus } from '@/lib/whatsapp-utils'

export async function GET(request: NextRequest) {
  try {
    // Obter status atual do arquivo ou memória
    const status = getWhatsAppStatus()

    return NextResponse.json(status)

  } catch (error) {
    console.error('Erro ao verificar status WhatsApp:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}