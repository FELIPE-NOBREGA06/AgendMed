import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (API Key ou sessão)
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey || apiKey !== process.env.AGENDMED_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, name } = body

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }

    // Buscar paciente existente pelo telefone
    let patient = await prisma.user.findFirst({
      where: {
        phone: phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true
      }
    })

    // Se não encontrou, criar novo paciente
    if (!patient) {
      patient = await prisma.user.create({
        data: {
          name: name || `Paciente ${phone}`,
          phone: phone,
          email: `${phone}@temp.agendmed.com`, // Email temporário
          // Outros campos padrão podem ser adicionados aqui
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          createdAt: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      patient: patient,
      isNew: !patient.createdAt || 
        (new Date().getTime() - new Date(patient.createdAt).getTime()) < 60000 // Criado nos últimos 60 segundos
    })

  } catch (error) {
    console.error('Error in find-or-create patient:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}