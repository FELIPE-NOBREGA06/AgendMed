#!/usr/bin/env node

// Script para criar um médico de teste
// Execute: node scripts/create-test-doctor.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestDoctor() {
  console.log('👨‍⚕️ Criando médico de teste...\n');

  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: 'dr.joao@agendmed.com' }
    });

    if (existing) {
      console.log('✅ Médico de teste já existe:');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Nome: ${existing.name}`);
      console.log(`   Email: ${existing.email}`);
      
      // Verificar serviços
      const services = await prisma.service.findMany({
        where: { userId: existing.id }
      });
      
      console.log(`   Serviços: ${services.length}`);
      
      if (services.length === 0) {
        console.log('\n🏥 Criando serviços...');
        await prisma.service.create({
          data: {
            name: 'Consulta Cardiológica',
            price: 250,
            duration: 60,
            status: true,
            userId: existing.id
          }
        });
        console.log('✅ Serviço criado!');
      }
      
      return existing.id;
    }

    // Criar novo médico
    const doctor = await prisma.user.create({
      data: {
        name: 'Dr. João Silva',
        email: 'dr.joao@agendmed.com',
        phone: '(11) 99999-1111',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        times: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        status: true
      }
    });

    // Criar serviços
    await prisma.service.create({
      data: {
        name: 'Consulta Cardiológica',
        price: 250,
        duration: 60,
        status: true,
        userId: doctor.id
      }
    });

    console.log('✅ Médico de teste criado:');
    console.log(`   ID: ${doctor.id}`);
    console.log(`   Nome: ${doctor.name}`);
    console.log(`   Email: ${doctor.email}`);
    console.log('✅ Serviço criado!');

    return doctor.id;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

createTestDoctor().then(doctorId => {
  if (doctorId) {
    console.log(`\n🧪 Agora teste com: node scripts/test-specific-apis.js`);
    console.log(`📋 ID do médico: ${doctorId}`);
  }
});