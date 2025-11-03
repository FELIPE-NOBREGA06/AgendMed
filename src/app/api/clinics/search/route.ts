import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (token !== process.env.AGENDMED_API_KEY) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Buscar clínicas (usuários com serviços ativos)
    const whereClause: any = {
      status: true,
      services: {
        some: {
          status: true
        }
      }
    }

    // Filtrar por localização (busca no endereço)
    if (location) {
      whereClause.address = {
        contains: location,
        mode: 'insensitive'
      }
    }

    // Filtrar por especialidade (busca nos nomes dos serviços)
    if (specialty) {
      whereClause.services.some.name = {
        contains: specialty,
        mode: 'insensitive'
      }
    }

    const clinics = await prisma.user.findMany({
      where: whereClause,
      take: limit,
      include: {
        services: {
          where: { status: true },
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        },
        _count: {
          select: {
            appointments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedClinics = clinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name || 'Clínica AgendMed',
      email: clinic.email,
      phone: clinic.phone || 'Não informado',
      address: clinic.address || 'Endereço não informado',
      image: clinic.image,
      services: clinic.services,
      totalAppointments: clinic._count.appointments,
      specialties: Array.from(new Set(clinic.services.map(s => s.name))),
      priceRange: clinic.services.length > 0 ? {
        min: Math.min(...clinic.services.map(s => s.price)),
        max: Math.max(...clinic.services.map(s => s.price))
      } : { min: 0, max: 0 },
      status: clinic.status ? 'Ativo' : 'Inativo',
      createdAt: clinic.createdAt
    }))

    return NextResponse.json({
      success: true,
      total: formattedClinics.length,
      clinics: formattedClinics,
      filters: {
        specialty,
        location,
        limit
      }
    })

  } catch (error) {
    console.error('Erro ao buscar clínicas:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}