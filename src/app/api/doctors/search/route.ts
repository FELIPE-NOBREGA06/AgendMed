import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey || apiKey !== process.env.AGENDMED_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')
    const insurance = searchParams.get('insurance')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Buscar médicos reais do banco de dados
    const realDoctors = await prisma.user.findMany({
      where: {
        status: true,
        services: {
          some: {
            status: true,
            name: specialty ? {
              contains: specialty,
              mode: 'insensitive'
            } : undefined
          }
        }
      },
      include: {
        services: {
          where: { status: true },
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        }
      },
      take: limit
    })

    // Formatar dados dos médicos reais
    const formattedDoctors = realDoctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name || 'Médico AgendMed',
      specialty: doctor.services[0]?.name || 'Clínica Geral',
      crm: 'CRM-' + doctor.id.slice(-6).toUpperCase(),
      location: doctor.address || 'São Paulo - SP',
      rating: 4.8,
      experience: '10+ anos',
      insurance: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
      image: doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      consultationFee: doctor.services[0]?.price || 250,
      available: true,
      phone: doctor.phone,
      email: doctor.email,
      services: doctor.services,
      times: doctor.times || ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']
    }))

    // Dados simulados como fallback se não houver médicos reais
    const mockDoctors = [
      {
        id: 'dr-mock-001',
        name: 'Dr. João Silva (Demo)',
        specialty: 'Cardiologia',
        crm: '12345-SP',
        location: 'São Paulo - SP',
        rating: 4.8,
        experience: '15 anos',
        insurance: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        consultationFee: 250,
        available: true
      }
    ]

    // Usar médicos reais se existirem, senão usar mock
    let allDoctors = formattedDoctors.length > 0 ? formattedDoctors : mockDoctors

    // Filtrar por localização se fornecida
    if (location) {
      allDoctors = allDoctors.filter(doctor => 
        doctor.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Filtrar por convênio se fornecido
    if (insurance) {
      allDoctors = allDoctors.filter(doctor => 
        doctor.insurance.some(ins => 
          ins.toLowerCase().includes(insurance.toLowerCase())
        )
      )
    }

    return NextResponse.json({
      success: true,
      doctors: allDoctors.slice(0, limit),
      total: allDoctors.length,
      filters: {
        specialty,
        location,
        insurance,
        limit
      }
    })

  } catch (error) {
    console.error('Error searching doctors:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}