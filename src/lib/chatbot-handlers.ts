// Handlers para integração do chatbot com banco de dados

export interface ChatContext {
  userId?: string
  step?: string
  data?: Record<string, any>
}

// Mock data - substitua com chamadas reais ao banco
export async function getAppointmentsByContact(contact: string) {
  // TODO: Implementar busca real no banco de dados
  // const appointments = await prisma.appointment.findMany({ ... })
  
  // Mock para demonstração
  return [
    {
      id: '1',
      date: new Date('2024-11-25'),
      time: '14:30',
      status: 'scheduled',
      doctor: {
        name: 'João Silva',
        specialty: { name: 'Cardiologia' },
        clinic: { name: 'Clínica Central' }
      }
    }
  ]
}

// Mock - Buscar especialidades disponíveis
export async function getAvailableSpecialties() {
  // TODO: Implementar busca real
  // const specialties = await prisma.specialty.findMany({ ... })
  
  return [
    { id: '1', name: 'Cardiologia', _count: { doctors: 5 } },
    { id: '2', name: 'Dermatologia', _count: { doctors: 3 } },
    { id: '3', name: 'Ortopedia', _count: { doctors: 4 } },
    { id: '4', name: 'Pediatria', _count: { doctors: 6 } }
  ]
}

// Mock - Buscar médicos por especialidade
export async function getDoctorsBySpecialty(specialtyName: string) {
  // TODO: Implementar busca real
  // const doctors = await prisma.doctor.findMany({ ... })
  
  return [
    {
      id: '1',
      name: 'João Silva',
      crm: '12345-SP',
      specialty: { name: specialtyName },
      clinic: { name: 'Clínica Central' }
    },
    {
      id: '2',
      name: 'Maria Santos',
      crm: '67890-SP',
      specialty: { name: specialtyName },
      clinic: { name: 'Hospital São Paulo' }
    }
  ]
}

// Mock - Verificar disponibilidade
export async function checkAvailability(
  doctorId: string,
  date: Date,
  time: string
) {
  // TODO: Implementar verificação real
  // const existing = await prisma.appointment.findFirst({ ... })
  return true
}

// Mock - Criar agendamento
export async function createAppointment(data: {
  patientName: string
  patientPhone: string
  patientCPF?: string
  doctorId: string
  date: Date
  time: string
  notes?: string
}) {
  // TODO: Implementar criação real
  // const appointment = await prisma.appointment.create({ ... })
  
  console.log('Agendamento criado:', data)
  return { id: 'mock-id', ...data }
}

// Mock - Cancelar agendamento
export async function cancelAppointment(appointmentId: string, reason?: string) {
  // TODO: Implementar cancelamento real
  // const appointment = await prisma.appointment.update({ ... })
  
  console.log('Agendamento cancelado:', appointmentId, reason)
  return { id: appointmentId, status: 'cancelled' }
}

// Formatar lista de agendamentos
export function formatAppointmentsList(appointments: any[]) {
  if (appointments.length === 0) {
    return 'Nenhum agendamento encontrado.'
  }

  let message = `📋 Seus agendamentos:\n\n`

  appointments.forEach((apt, index) => {
    const date = new Date(apt.date)
    const dateStr = date.toLocaleDateString('pt-BR')
    const status = apt.status === 'scheduled' ? '✅' : 
                   apt.status === 'completed' ? '✔️' : '❌'

    message += `${index + 1}. ${status} ${dateStr} às ${apt.time}\n`
    message += `   Dr(a). ${apt.doctor.name}\n`
    message += `   ${apt.doctor.specialty.name}\n`
    message += `   ${apt.doctor.clinic.name}\n\n`
  })

  message += `Digite o número do agendamento para mais detalhes.`

  return message
}

// Formatar lista de especialidades
export function formatSpecialtiesList(specialties: any[]) {
  if (specialties.length === 0) {
    return 'Nenhuma especialidade disponível no momento.'
  }

  let message = `🏥 Especialidades disponíveis:\n\n`

  specialties.forEach((spec) => {
    message += `• ${spec.name} (${spec._count.doctors} médicos)\n`
  })

  message += `\nDigite o nome da especialidade para ver os médicos disponíveis.`

  return message
}

// Formatar lista de médicos
export function formatDoctorsList(doctors: any[]) {
  if (doctors.length === 0) {
    return 'Nenhum médico disponível para esta especialidade.'
  }

  let message = `👨‍⚕️ Médicos disponíveis:\n\n`

  doctors.forEach((doc, index) => {
    message += `${index + 1}. Dr(a). ${doc.name}\n`
    message += `   ${doc.specialty.name}\n`
    message += `   ${doc.clinic.name}\n`
    if (doc.crm) message += `   CRM: ${doc.crm}\n`
    message += `\n`
  })

  message += `Digite o número do médico para agendar.`

  return message
}

// Validar CPF
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')
  
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

// Validar telefone
export function isValidPhone(phone: string): boolean {
  phone = phone.replace(/\D/g, '')
  return phone.length >= 10 && phone.length <= 11
}

// Formatar data
export function parseDate(dateStr: string): Date | null {
  // Aceita formatos: DD/MM/AAAA, DD/MM, DD-MM-AAAA
  const patterns = [
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
    /^(\d{2})\/(\d{2})$/,
    /^(\d{2})-(\d{2})-(\d{4})$/
  ]

  for (const pattern of patterns) {
    const match = dateStr.match(pattern)
    if (match) {
      const day = parseInt(match[1])
      const month = parseInt(match[2]) - 1
      const year = match[3] ? parseInt(match[3]) : new Date().getFullYear()

      const date = new Date(year, month, day)
      if (date.getDate() === day && date.getMonth() === month) {
        return date
      }
    }
  }

  return null
}

// Gerar horários disponíveis
export function generateTimeSlots(period: 'morning' | 'afternoon' | 'all' = 'all') {
  const slots: string[] = []

  if (period === 'morning' || period === 'all') {
    for (let hour = 8; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  if (period === 'afternoon' || period === 'all') {
    for (let hour = 14; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  return slots
}
