import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { date, doctorId, clinicId } = await request.json()

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (token !== process.env.AGENDMED_API_KEY) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    if (!date) {
      return NextResponse.json({ error: 'Data é obrigatória' }, { status: 400 })
    }

    // Buscar clínica/médico
    const userId = doctorId || clinicId
    if (!userId) {
      return NextResponse.json({ error: 'ID do médico ou clínica é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        services: { where: { status: true } },
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date(date + 'T00:00:00.000Z'),
              lt: new Date(date + 'T23:59:59.999Z')
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Médico/Clínica não encontrado' }, { status: 404 })
    }

    // Horários padrão (8h às 18h, de hora em hora)
    const defaultTimes = [
      '08:00', '09:00', '10:00', '11:00', 
      '14:00', '15:00', '16:00', '17:00'
    ]

    // Usar horários configurados ou padrão
    const availableTimes = user.times.length > 0 ? user.times : defaultTimes

    // Horários já ocupados
    const bookedTimes = user.appointments.map(apt => apt.time)

    // Horários livres
    const freeTimes = availableTimes.filter(time => !bookedTimes.includes(time))

    return NextResponse.json({
      success: true,
      date,
      doctor: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      totalAvailable: freeTimes.length,
      availableTimes: freeTimes,
      bookedTimes,
      services: user.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration
      }))
    })

  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}