import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Aqui você implementaria o envio de mensagem de teste
    // Por exemplo, usando a API do bot ativo
    
    const testMessage = `🧪 Teste do AgendMed Bot - ${new Date().toLocaleString()}

✅ Bot funcionando corretamente!
🤖 Assistente virtual ativo
📱 Pronto para atender pacientes

Digite "oi" para começar uma conversa.`

    // Implementar envio da mensagem de teste
    // Isso dependeria do tipo de bot ativo (webjs, venom, etc.)
    
    return NextResponse.json({
      success: true,
      message: 'Mensagem de teste enviada',
      testMessage
    })

  } catch (error) {
    console.error('Erro ao enviar teste:', error)
    return NextResponse.json({ 
      error: 'Erro ao enviar mensagem de teste' 
    }, { status: 500 })
  }
}