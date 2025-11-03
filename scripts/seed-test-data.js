#!/usr/bin/env node

// Script para popular dados de teste para o agente IA
// Execute: node scripts/seed-test-data.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Populando dados de teste para o agente IA...\n');

  try {
    // 1. Criar médicos/clínicas de teste
    const doctors = [
      {
        name: 'Dr. João Silva',
        email: 'joao.silva@agendmed.com',
        phone: '(11) 99999-1111',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        times: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        services: [
          { name: 'Consulta Cardiológica', price: 250, duration: 60 },
          { name: 'Eletrocardiograma', price: 150, duration: 30 },
          { name: 'Ecocardiograma', price: 300, duration: 45 }
        ]
      },
      {
        name: 'Dra. Maria Santos',
        email: 'maria.santos@agendmed.com',
        phone: '(11) 99999-2222',
        address: 'Av. Paulista, 456 - São Paulo, SP',
        times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        services: [
          { name: 'Consulta Dermatológica', price: 300, duration: 45 },
          { name: 'Procedimento Estético', price: 500, duration: 90 },
          { name: 'Biópsia de Pele', price: 400, duration: 60 }
        ]
      },
      {
        name: 'Dr. Carlos Oliveira',
        email: 'carlos.oliveira@agendmed.com',
        phone: '(11) 99999-3333',
        address: 'Rua da Consolação, 789 - São Paulo, SP',
        times: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        services: [
          { name: 'Consulta Ortopédica', price: 280, duration: 50 },
          { name: 'Infiltração', price: 350, duration: 30 },
          { name: 'Avaliação Pós-Cirúrgica', price: 200, duration: 40 }
        ]
      }
    ];

    console.log('👨‍⚕️ Criando médicos e serviços...');
    
    for (const doctorData of doctors) {
      // Verificar se já existe
      const existingDoctor = await prisma.user.findUnique({
        where: { email: doctorData.email }
      });

      if (existingDoctor) {
        console.log(`   ⚠️  ${doctorData.name} já existe, pulando...`);
        continue;
      }

      // Criar médico
      const doctor = await prisma.user.create({
        data: {
          name: doctorData.name,
          email: doctorData.email,
          phone: doctorData.phone,
          address: doctorData.address,
          times: doctorData.times,
          status: true
        }
      });

      // Criar serviços
      for (const serviceData of doctorData.services) {
        await prisma.service.create({
          data: {
            name: serviceData.name,
            price: serviceData.price,
            duration: serviceData.duration,
            status: true,
            userId: doctor.id
          }
        });
      }

      console.log(`   ✅ ${doctorData.name} criado com ${doctorData.services.length} serviços`);
    }

    // 2. Criar alguns agendamentos de exemplo
    console.log('\n📅 Criando agendamentos de exemplo...');
    
    const allDoctors = await prisma.user.findMany({
      where: { 
        email: { in: doctors.map(d => d.email) }
      },
      include: { services: true }
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    for (const doctor of allDoctors.slice(0, 2)) { // Apenas 2 médicos
      if (doctor.services.length > 0) {
        await prisma.appointment.create({
          data: {
            name: 'Paciente Teste',
            email: 'paciente.teste@email.com',
            phone: '(11) 98888-7777',
            appointmentDate: new Date(tomorrowStr + 'T09:00:00.000Z'),
            time: '09:00',
            serviceId: doctor.services[0].id,
            userId: doctor.id
          }
        });
        
        console.log(`   ✅ Agendamento criado para ${doctor.name} às 09:00`);
      }
    }

    console.log('\n🎉 Dados de teste criados com sucesso!');
    console.log('\n📋 Resumo:');
    
    const totalDoctors = await prisma.user.count({
      where: { email: { in: doctors.map(d => d.email) } }
    });
    
    const totalServices = await prisma.service.count({
      where: { 
        user: { email: { in: doctors.map(d => d.email) } }
      }
    });
    
    const totalAppointments = await prisma.appointment.count();
    
    console.log(`   👨‍⚕️ Médicos: ${totalDoctors}`);
    console.log(`   🏥 Serviços: ${totalServices}`);
    console.log(`   📅 Agendamentos: ${totalAppointments}`);

    console.log('\n🧪 Agora execute: node scripts/test-n8n-apis.js');

  } catch (error) {
    console.error('❌ Erro ao popular dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();