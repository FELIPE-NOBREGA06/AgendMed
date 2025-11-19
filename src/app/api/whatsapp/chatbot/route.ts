import { NextRequest, NextResponse } from 'next/server'

// Chatbot compatível com Vercel - Stateless e baseado em webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, from, type = 'text' } = body

    // Processa a mensagem do usuário
    const response = await processMessage(message, from)

    return NextResponse.json({
      success: true,
      response,
      from,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro no chatbot:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

// Webhook para receber mensagens (WhatsApp Business API)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Verificação do webhook (WhatsApp Business API)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verificação falhou' }, { status: 403 })
}

// Lógica do chatbot
async function processMessage(message: string, from: string): Promise<string> {
  const msg = message.toLowerCase().trim()

  // Menu principal
  if (msg === 'oi' || msg === 'olá' || msg === 'menu' || msg === 'inicio') {
    return `Olá! 👋 Bem-vindo ao AgendMed!

Escolha uma opção:
1️⃣ Agendar consulta
2️⃣ Consultar agendamento
3️⃣ Cancelar agendamento
4️⃣ Especialidades disponíveis
5️⃣ Falar com atendente

Digite o número da opção desejada.`
  }

  // Opção 1: Agendar consulta
  if (msg === '1' || msg.includes('agendar')) {
    return `📅 Para agendar sua consulta, preciso de algumas informações:

Por favor, me informe:
- Especialidade desejada
- Data preferencial
- Período (manhã/tarde)

Exemplo: "Cardiologia, 25/11, manhã"

Ou digite "especialidades" para ver a lista completa.`
  }

  // Opção 2: Consultar agendamento
  if (msg === '2' || msg.includes('consultar')) {
    return `🔍 Para consultar seu agendamento, preciso do seu CPF.

Digite seu CPF (apenas números):
Exemplo: 12345678900`
  }

  // Opção 3: Cancelar agendamento
  if (msg === '3' || msg.includes('cancelar')) {
    return `❌ Para cancelar seu agendamento, preciso:

1. Seu CPF
2. Código do agendamento (enviado por SMS/WhatsApp)

Digite no formato: CPF CODIGO
Exemplo: 12345678900 AG12345`
  }

  // Opção 4: Especialidades
  if (msg === '4' || msg.includes('especialidade')) {
    return `🏥 Especialidades disponíveis:

• Cardiologia
• Dermatologia
• Ortopedia
• Pediatria
• Ginecologia
• Oftalmologia
• Neurologia
• Psiquiatria

Digite o nome da especialidade para ver horários disponíveis.`
  }

  // Opção 5: Atendente
  if (msg === '5' || msg.includes('atendente')) {
    return `👤 Transferindo para atendente humano...

Aguarde um momento, em breve você será atendido.
Horário de atendimento: Segunda a Sexta, 8h às 18h.`
  }

  // Detecção de CPF
  if (/^\d{11}$/.test(msg.replace(/\D/g, ''))) {
    const cpf = msg.replace(/\D/g, '')
    return `✅ CPF ${formatCPF(cpf)} localizado!

Encontrei os seguintes agendamentos:
📅 25/11/2024 - 14:30 - Dr. João Silva - Cardiologia
📅 30/11/2024 - 10:00 - Dra. Maria Santos - Dermatologia

Digite o número do agendamento para mais detalhes ou "cancelar" para cancelar.`
  }

  // Resposta padrão
  return `Desculpe, não entendi sua mensagem. 😕

Digite "menu" para ver as opções disponíveis ou "atendente" para falar com um humano.`
}

// Formatar CPF
function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
