import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Listar todas as clínicas
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const clinics = await prisma.user.findMany({
      take: limit,
      skip: offset,
      include: {
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            status: true
          }
        },
        appointments: {
          select: {
            id: true,
            appointmentDate: true,
            name: true
          }
        },
        _count: {
          select: {
            appointments: true,
            services: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedClinics = clinics.map(clinic => {
      const activeAppointments = clinic.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate)
        return appointmentDate > new Date()
      })

      return {
        id: clinic.id,
        name: clinic.name || 'Usuário WhatsApp',
        email: clinic.email,
        phone: clinic.phone || 'Não informado',
        address: clinic.address || 'Não informado',
        image: clinic.image,
        status: clinic.status ? 'Ativo' : 'Inativo',
        createdAt: clinic.createdAt,
        services: clinic.services,
        totalServices: clinic._count.services,
        totalAppointments: clinic._count.appointments,
        activeAppointments: activeAppointments.length,
        canDelete: activeAppointments.length === 0
      }
    })

    return NextResponse.json({
      success: true,
      clinics: formattedClinics,
      total: formattedClinics.length
    })

  } catch (error) {
    console.error('Erro ao listar clínicas:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// Criar nova clínica
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { name, email, phone, address } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Nome e email são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Email já está em uso' 
      }, { status: 409 })
    }

    // Criar clínica
    const clinic = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        status: true
      },
      include: {
        services: true,
        _count: {
          select: {
            appointments: true,
            services: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Clínica criada com sucesso',
      clinic: {
        id: clinic.id,
        name: clinic.name,
        email: clinic.email,
        phone: clinic.phone,
        address: clinic.address,
        status: clinic.status ? 'Ativo' : 'Inativo',
        createdAt: clinic.createdAt,
        services: clinic.services,
        totalServices: clinic._count.services,
        totalAppointments: clinic._count.appointments,
        canDelete: true
      }
    })

  } catch (error) {
    console.error('Erro ao criar clínica:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}