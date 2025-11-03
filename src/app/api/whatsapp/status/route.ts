import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getWhatsAppStatus } from '../connect/route'

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