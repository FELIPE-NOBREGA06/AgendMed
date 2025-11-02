"use server"

import prisma from "@/lib/prisma"

export async function getAllClinics() {
  try {
    const clinics = await prisma.user.findMany({
      include: {
        subscription: true,
        services: true,
        _count: {
          select: {
            appointments: true,
            services: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return clinics
  } catch (error) {
    console.error("Erro ao buscar clínicas:", error)
    return []
  }
}