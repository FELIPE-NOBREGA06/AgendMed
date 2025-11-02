const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const testClinics = [
  {
    name: 'Clínica Odonto Smile',
    email: 'contato@odontosmile.com',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-1234',
    status: true,
  },
  {
    name: 'Dental Care Premium',
    email: 'atendimento@dentalcare.com',
    address: 'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
    phone: '(11) 88888-5678',
    status: true,
  },
  {
    name: 'Clínica Sorriso Perfeito',
    email: 'info@sorrisoperfeito.com',
    address: 'Rua Augusta, 789 - Consolação, São Paulo - SP',
    phone: '(11) 77777-9012',
    status: true,
  },
  {
    name: 'OdontoVida Especialidades',
    email: 'contato@odontovida.com',
    address: 'Rua Oscar Freire, 321 - Jardins, São Paulo - SP',
    phone: '(11) 66666-3456',
    status: true,
  },
  {
    name: 'Clínica Dental Excellence',
    email: 'atendimento@dentalexcellence.com',
    address: 'Av. Faria Lima, 654 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 55555-7890',
    status: true,
  }
];

async function createTestClinics() {
  try {
    console.log('🏥 Criando clínicas de teste...');

    for (const clinic of testClinics) {
      // Verificar se já existe
      const existingClinic = await prisma.user.findUnique({
        where: { email: clinic.email }
      });

      if (existingClinic) {
        console.log(`⚠️  Clínica já existe: ${clinic.name}`);
        continue;
      }

      // Criar clínica
      const newClinic = await prisma.user.create({
        data: {
          ...clinic,
          id: `clinic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
      });

      console.log(`✅ Clínica criada: ${newClinic.name}`);

      // Criar alguns serviços para cada clínica
      const services = [
        { name: 'Limpeza Dental', price: 8000, duration: 60 }, // R$ 80,00
        { name: 'Consulta de Rotina', price: 12000, duration: 30 }, // R$ 120,00
        { name: 'Tratamento de Canal', price: 45000, duration: 90 }, // R$ 450,00
      ];

      for (const service of services) {
        await prisma.service.create({
          data: {
            ...service,
            userId: newClinic.id,
          }
        });
      }

      console.log(`   📋 Serviços criados para ${newClinic.name}`);
    }

    console.log('🎉 Todas as clínicas de teste foram criadas!');
    
  } catch (error) {
    console.error('❌ Erro ao criar clínicas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestClinics();