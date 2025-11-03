import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get('id')

    if (!clinicId) {
      return NextResponse.json({ error: 'ID da clínica é obrigatório' }, { status: 400 })
    }

    // Verificar se a clínica existe
    const clinic = await prisma.user.findUnique({
      where: { id: clinicId },
      include: {
        appointments: true,
        services: true
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 })
    }

    // Verificar se há agendamentos ativos
    const activeAppointments = clinic.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate)
      return appointmentDate > new Date()
    })

    if (activeAppointments.length > 0) {
      return NextResponse.json({ 
        error: `Não é possível excluir a clínica. Há ${activeAppointments.length} agendamento(s) ativo(s).`,
        activeAppointments: activeAppointments.length
      }, { status: 409 })
    }

    // Excluir em ordem (relacionamentos primeiro)
    await prisma.$transaction(async (tx) => {
      // 1. Excluir agendamentos históricos
      await tx.appointment.deleteMany({
        where: { userId: clinicId }
      })

      // 2. Excluir serviços
      await tx.service.deleteMany({
        where: { userId: clinicId }
      })

      // 3. Excluir a clínica (usuário)
      await tx.user.delete({
        where: { id: clinicId }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Clínica excluída com sucesso',
      deletedClinic: {
        id: clinic.id,
        name: clinic.name,
        email: clinic.email
      }
    })

  } catch (error) {
    console.error('Erro ao excluir clínica:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// Método POST para exclusão via body (alternativo)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { clinicId } = await request.json()

    if (!clinicId) {
      return NextResponse.json({ error: 'ID da clínica é obrigatório' }, { status: 400 })
    }

    // Reutilizar a lógica do DELETE
    const deleteUrl = new URL(request.url)
    deleteUrl.searchParams.set('id', clinicId)
    
    const deleteRequest = new NextRequest(deleteUrl, {
      method: 'DELETE',
      headers: request.headers
    })

    return await DELETE(deleteRequest)

  } catch (error) {
    console.error('Erro ao excluir clínica via POST:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}