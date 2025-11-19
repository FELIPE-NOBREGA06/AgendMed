import { NextRequest, NextResponse } from 'next/server'
import {
  getAppointmentsByContact,
  getAvailableSpecialties,
  getDoctorsBySpecialty,
  formatAppointmentsList,
  formatSpecialtiesList,
  formatDoctorsList,
  isValidCPF,
  parseDate,
  generateTimeSlots
} from '@/lib/chatbot-handlers'

// Chatbot avançado com integração ao banco de dados
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, from, context = {} } = body

    // Processa a mensagem com contexto
    const response = await processMessageWithContext(message, from, context)

    return NextResponse.json({
      success: true,
      response: response.message,
      context: response.context,
      from,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro no chatbot avançado:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

interface ChatResponse {
  message: string
  context: Record<string, any>
}

async function processMessageWithContext(
  message: string,
  from: string,
  context: Record<string, any>
): Promise<ChatResponse> {
  const msg = message.toLowerCase().trim()

  // Menu principal
  if (msg === 'oi' || msg === 'olá' || msg === 'menu' || msg === 'inicio') {
    return {
      message: `Olá! 👋 Bem-vindo ao AgendMed!

Escolha uma opção:
1️⃣ Agendar consulta
2️⃣ Consultar agendamento
3️⃣ Cancelar agendamento
4️⃣ Especialidades disponíveis
5️⃣ Falar com atendente

Digite o número da opção desejada.`,
      context: { step: 'menu' }
    }
  }

  // Fluxo de agendamento
  if (msg === '1' || msg.includes('agendar')) {
    const specialties = await getAvailableSpecialties()
    return {
      message: `📅 Vamos agendar sua consulta!\n\n${formatSpecialtiesList(specialties)}`,
      context: { step: 'select_specialty' }
    }
  }

  // Usuário selecionou especialidade
  if (context.step === 'select_specialty') {
    const doctors = await getDoctorsBySpecialty(message)
    
    if (doctors.length === 0) {
      return {
        message: `Desculpe, não encontrei médicos para "${message}".\n\nDigite "menu" para ver as opções ou tente outra especialidade.`,
        context: { step: 'select_specialty' }
      }
    }

    return {
      message: formatDoctorsList(doctors),
      context: { 
        step: 'select_doctor',
        specialty: message,
        doctors: doctors.map((d: any) => ({ id: d.id, name: d.name }))
      }
    }
  }

  // Usuário selecionou médico
  if (context.step === 'select_doctor') {
    const doctorIndex = parseInt(msg) - 1
    
    if (isNaN(doctorIndex) || !context.doctors || doctorIndex >= context.doctors.length) {
      return {
        message: `Por favor, digite o número do médico (1 a ${context.doctors?.length || 0}).`,
        context
      }
    }

    const selectedDoctor = context.doctors[doctorIndex]

    return {
      message: `✅ Médico selecionado: Dr(a). ${selectedDoctor.name}

📅 Agora, informe a data desejada:
Formato: DD/MM/AAAA
Exemplo: 25/11/2024

Ou digite "hoje" ou "amanhã".`,
      context: {
        step: 'select_date',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name
      }
    }
  }

  // Usuário informou data
  if (context.step === 'select_date') {
    let date: Date | null = null

    if (msg === 'hoje') {
      date = new Date()
    } else if (msg === 'amanhã' || msg === 'amanha') {
      date = new Date()
      date.setDate(date.getDate() + 1)
    } else {
      date = parseDate(message)
    }

    if (!date) {
      return {
        message: `Data inválida. Por favor, use o formato DD/MM/AAAA.\nExemplo: 25/11/2024`,
        context
      }
    }

    // Verificar se a data não é passada
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      return {
        message: `Não é possível agendar para datas passadas.\nPor favor, informe uma data futura.`,
        context
      }
    }

    const dateStr = date.toLocaleDateString('pt-BR')
    const slots = generateTimeSlots('all')

    return {
      message: `📅 Data selecionada: ${dateStr}

🕐 Horários disponíveis:

Manhã:
${slots.filter(s => parseInt(s) < 12).join(', ')}

Tarde:
${slots.filter(s => parseInt(s) >= 14).join(', ')}

Digite o horário desejado (ex: 14:30)`,
      context: {
        step: 'select_time',
        doctorId: context.doctorId,
        doctorName: context.doctorName,
        date: date.toISOString()
      }
    }
  }

  // Usuário informou horário
  if (context.step === 'select_time') {
    const timePattern = /^(\d{1,2}):(\d{2})$/
    const match = msg.match(timePattern)

    if (!match) {
      return {
        message: `Horário inválido. Use o formato HH:MM\nExemplo: 14:30`,
        context
      }
    }

    return {
      message: `✅ Resumo do agendamento:

👨‍⚕️ Médico: Dr(a). ${context.doctorName}
📅 Data: ${new Date(context.date).toLocaleDateString('pt-BR')}
🕐 Horário: ${msg}

Para confirmar, preciso de seus dados:
Digite seu nome completo:`,
      context: {
        step: 'get_name',
        doctorId: context.doctorId,
        doctorName: context.doctorName,
        date: context.date,
        time: msg
      }
    }
  }

  // Usuário informou nome
  if (context.step === 'get_name') {
    return {
      message: `Obrigado, ${message}!\n\nAgora, digite seu CPF (apenas números):`,
      context: {
        ...context,
        step: 'get_cpf',
        patientName: message
      }
    }
  }

  // Usuário informou CPF
  if (context.step === 'get_cpf') {
    const cpf = msg.replace(/\D/g, '')

    if (!isValidCPF(cpf)) {
      return {
        message: `CPF inválido. Por favor, digite um CPF válido (11 dígitos):`,
        context
      }
    }

    return {
      message: `Por último, seu telefone com DDD (apenas números):`,
      context: {
        ...context,
        step: 'confirm',
        patientCPF: cpf
      }
    }
  }

  // Confirmação final
  if (context.step === 'confirm') {
    const phone = msg.replace(/\D/g, '')

    if (phone.length < 10) {
      return {
        message: `Telefone inválido. Digite com DDD (ex: 11999999999):`,
        context
      }
    }

    // Aqui você criaria o agendamento no banco
    // const appointment = await createAppointment({ ... })

    return {
      message: `✅ Agendamento confirmado!

📋 Detalhes:
Nome: ${context.patientName}
CPF: ${context.patientCPF}
Telefone: ${phone}
Médico: Dr(a). ${context.doctorName}
Data: ${new Date(context.date).toLocaleDateString('pt-BR')}
Horário: ${context.time}

📱 Você receberá um SMS de confirmação em breve.
💬 Um lembrete será enviado 24h antes da consulta.

Digite "menu" para voltar ao início.`,
      context: { step: 'menu' }
    }
  }

  // Consultar agendamentos
  if (msg === '2' || msg.includes('consultar')) {
    return {
      message: `🔍 Para consultar seus agendamentos, digite seu CPF ou telefone:`,
      context: { step: 'search_appointments' }
    }
  }

  // Buscar agendamentos
  if (context.step === 'search_appointments') {
    const appointments = await getAppointmentsByContact(message)
    
    return {
      message: formatAppointmentsList(appointments),
      context: { step: 'menu' }
    }
  }

  // Especialidades
  if (msg === '4' || msg.includes('especialidade')) {
    const specialties = await getAvailableSpecialties()
    return {
      message: formatSpecialtiesList(specialties),
      context: { step: 'menu' }
    }
  }

  // Atendente
  if (msg === '5' || msg.includes('atendente')) {
    return {
      message: `👤 Transferindo para atendente humano...

Aguarde um momento, em breve você será atendido.
Horário de atendimento: Segunda a Sexta, 8h às 18h.`,
      context: { step: 'human_transfer' }
    }
  }

  // Resposta padrão
  return {
    message: `Desculpe, não entendi sua mensagem. 😕

Digite "menu" para ver as opções disponíveis.`,
    context: { step: 'menu' }
  }
}
