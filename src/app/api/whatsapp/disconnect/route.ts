import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateWhatsAppStatus } from '@/lib/whatsapp-utils'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Atualizar status para desconectado
    updateWhatsAppStatus({
      connected: false,
      qrCode: null,
      phone: null,
      lastSeen: null
    })

    // Aqui você pode adicionar lógica para parar o processo do bot
    // Por exemplo, enviar sinal para o processo ou limpar sessões

    return NextResponse.json({
      success: true,
      message: 'WhatsApp desconectado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error)
    return NextResponse.json({ 
      error: 'Erro ao desconectar WhatsApp' 
    }, { status: 500 })
  }
}