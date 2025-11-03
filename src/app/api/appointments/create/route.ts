import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { 
      patientId, 
      doctorId, 
      clinicId, 
      date, 
      time, 
      serviceId,
      patientName,
      patientEmail,
      patientPhone
    } = await request.json()

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (token !== process.env.AGENDMED_API_KEY) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Validações
    if (!date || !time) {
      return NextResponse.json({ error: 'Data e horário são obrigatórios' }, { status: 400 })
    }

    const userId = doctorId || clinicId
    if (!userId) {
      return NextResponse.json({ error: 'ID do médico ou clínica é obrigatório' }, { status: 400 })
    }

    // Verificar se o médico/clínica existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { services: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Médico/Clínica não encontrado' }, { status: 404 })
    }

    // Verificar se o horário está disponível
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        userId,
        appointmentDate: new Date(date + 'T' + time + ':00.000Z'),
        time
      }
    })

    if (existingAppointment) {
      return NextResponse.json({ error: 'Horário não disponível' }, { status: 409 })
    }

    // Buscar ou usar o primeiro serviço disponível
    let selectedService = null
    if (serviceId) {
      selectedService = user.services.find(s => s.id === serviceId)
    } else {
      selectedService = user.services.find(s => s.status) || user.services[0]
    }

    if (!selectedService) {
      return NextResponse.json({ error: 'Nenhum serviço disponível' }, { status: 400 })
    }

    // Dados do paciente (usar patientId se fornecido, senão usar dados diretos)
    let appointmentData = {
      name: patientName || 'Paciente via WhatsApp',
      email: patientEmail || 'nao-informado@agendmed.com',
      phone: patientPhone || 'Não informado',
      appointmentDate: new Date(date + 'T' + time + ':00.000Z'),
      time,
      serviceId: selectedService.id,
      userId
    }

    // Se temos patientId, buscar dados do paciente
    if (patientId) {
      // Assumindo que patientId é um ID de usuário ou dados de paciente
      // Por enquanto, vamos usar os dados fornecidos
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        patientName: appointment.name,
        patientEmail: appointment.email,
        patientPhone: appointment.phone,
        date: appointment.appointmentDate.toISOString().split('T')[0],
        time: appointment.time,
        service: {
          name: appointment.service.name,
          price: appointment.service.price,
          duration: appointment.service.duration
        },
        doctor: {
          id: appointment.user.id,
          name: appointment.user.name,
          email: appointment.user.email,
          phone: appointment.user.phone
        },
        createdAt: appointment.createdAt
      }
    })

  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}