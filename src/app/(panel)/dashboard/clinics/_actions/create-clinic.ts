"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createClinic(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string

    if (!name || !email) {
      return { error: "Nome e email são obrigatórios" }
    }

    // Verificar se já existe uma clínica com este email
    const existingClinic = await prisma.user.findUnique({
      where: { email }
    })

    if (existingClinic) {
      return { error: "Já existe uma clínica com este email" }
    }

    // Criar a clínica
    const clinic = await prisma.user.create({
      data: {
        name,
        email,
        address: address || "",
        phone: phone || "",
        status: true,
      }
    })

    // Criar serviços padrão para a clínica
    const defaultServices = [
      { name: 'Consulta de Rotina', price: 12000, duration: 30 },
      { name: 'Limpeza Dental', price: 8000, duration: 60 },
      { name: 'Tratamento de Canal', price: 45000, duration: 90 },
    ]

    for (const service of defaultServices) {
      await prisma.service.create({
        data: {
          ...service,
          userId: clinic.id,
        }
      })
    }

    revalidatePath("/dashboard/clinics")
    revalidatePath("/")

    return { success: true }

  } catch (error) {
    console.error("Erro ao criar clínica:", error)
    return { error: "Erro interno do servidor" }
  }
}