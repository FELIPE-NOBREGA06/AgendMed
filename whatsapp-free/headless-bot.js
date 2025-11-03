#!/usr/bin/env node

// Bot WhatsApp HEADLESS - Apenas QR Code no site
// Execute: node whatsapp-free/headless-bot.js

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

console.log('🤖 INICIANDO WHATSAPP BOT HEADLESS - AGENDMED\n');
console.log('📱 QR Code será gerado APENAS no site (sem abrir navegador)\n');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "agendmed-headless-bot"
    }),
    puppeteer: {
        headless: true, // SEMPRE headless - sem navegador
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--disable-gpu'
        ]
    }
});

// QR Code - APENAS para o site (não no terminal)
client.on('qr', (qr) => {
    console.log('📱 QR CODE GERADO PARA O SITE!');
    console.log('🌐 Acesse o dashboard para ver o QR Code');
    console.log('❌ Navegador NÃO será aberto (modo headless)');
    
    // Salvar QR para interface web
    saveQRForWeb(qr);
    
    console.log('✅ QR Code salvo para o dashboard web\n');
});

// Conectado
client.on('ready', () => {
    console.log('🎉 WHATSAPP CONECTADO COM SUCESSO!');
    console.log('🤖 Bot está pronto para receber mensagens!\n');
    
    const info = client.info;
    console.log(`📱 Número: ${info.wid.user}`);
    console.log(`👤 Nome: ${info.pushname}`);
    
    // Salvar status conectado
    saveConnectionStatus(true, info.wid.user, info.pushname);
    
    // Enviar mensagem de boas-vindas
    setTimeout(async () => {
        try {
            await client.sendMessage(info.wid._serialized, 
                '🎉 *AgendMed Bot Conectado!*\n\n' +
                '✅ Seu assistente virtual está online!\n' +
                '🤖 Pronto para atender pacientes\n' +
                '🌐 Modo headless ativo (sem navegador)\n\n' +
                '🧪 *Teste:* Digite "oi" para começar'
            );
            console.log('✅ Mensagem de boas-vindas enviada!');
        } catch (error) {
            console.log('⚠️ Não foi possível enviar mensagem de boas-vindas');
        }
    }, 3000);
});

// Desconectado
client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp desconectado:', reason);
    saveConnectionStatus(false, null, null);
});

// Receber mensagens
client.on('message', async message => {
    if (message.fromMe || message.from.includes('@g.us')) return;
    
    const from = message.from;
    const text = message.body.toLowerCase();
    
    console.log(`📱 Nova mensagem de ${from}: ${message.body}`);
    
    try {
        const response = await processMessage(text, from);
        await message.reply(response);
        console.log(`🤖 Resposta enviada: ${response.substring(0, 50)}...`);
    } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
        await message.reply('❌ Desculpe, ocorreu um erro. Tente novamente.');
    }
});

// Estado das conversas (em memória)
const userStates = new Map();

// Armazenar agendamentos para lembretes
const agendamentos = new Map();

// Funções para integração com API
async function buscarMedicosAPI(especialidade) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            console.log('⚠️ API_KEY não configurada, usando dados mock');
            return null;
        }
        
        const response = await fetch(`${BASE_URL}/api/doctors/search?specialty=${encodeURIComponent(especialidade)}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Encontrados ${data.doctors?.length || 0} médicos para ${especialidade}`);
            return data.doctors || [];
        } else {
            console.log(`❌ Erro na API: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Erro ao buscar médicos na API:', error.message);
        return null;
    }
}

async function buscarEspecialidades() {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            return ['Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Neurologia', 'Oftalmologia'];
        }
        
        const response = await fetch(`${BASE_URL}/api/doctors/search`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const especialidades = [...new Set(data.doctors?.map(d => d.specialties).flat() || [])];
            return especialidades.length > 0 ? especialidades : ['Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Neurologia', 'Oftalmologia'];
        }
    } catch (error) {
        console.error('❌ Erro ao buscar especialidades:', error.message);
    }
    
    return ['Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Neurologia', 'Oftalmologia'];
}

async function verificarDisponibilidadeAPI(doctorId, date) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            return null;
        }
        
        const response = await fetch(`${BASE_URL}/api/appointments/check-availability?doctorId=${doctorId}&date=${date}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error('❌ Erro ao verificar disponibilidade:', error.message);
        return null;
    }
}

async function criarAgendamentoAPI(dadosAgendamento) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            console.log('⚠️ API_KEY não configurada, simulando agendamento');
            return { success: true, id: 'mock_' + Date.now() };
        }
        
        const response = await fetch(`${BASE_URL}/api/appointments/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAgendamento)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Agendamento criado na API:', data.appointment?.id);
            return data;
        } else {
            console.log(`❌ Erro ao criar agendamento: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Erro ao criar agendamento na API:', error.message);
        return null;
    }
}

// Processar mensagens
async function processMessage(message, phone) {
    // Integração com AgendMed API
    const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const API_KEY = process.env.AGENDMED_API_KEY;

    try {
        // Buscar/criar paciente
        if (API_KEY) {
            await fetch(`${BASE_URL}/api/patients/find-or-create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone.replace('@c.us', ''),
                    name: 'Usuário WhatsApp'
                })
            });
        }
    } catch (error) {
        console.log('⚠️ Erro na API AgendMed:', error.message);
    }

    // Obter estado do usuário
    const userState = userStates.get(phone) || { step: 'inicio' };
    
    // Processar baseado no estado atual
    const response = await processConversationFlow(message, phone, userState);
    
    // Salvar estado atualizado
    userStates.set(phone, userState);
    
    return response;
}

// Fluxo de conversação com estados
async function processConversationFlow(message, phone, userState) {

    // Resetar conversa
    if (message.includes('cancelar') || message.includes('sair') || message.includes('parar')) {
        userState.step = 'inicio';
        return `❌ *Agendamento cancelado*

Posso ajudar com algo mais?
• Digite *"agendar"* para tentar novamente
• Digite *"ajuda"* para ver opções`;
    }

    // Fluxo baseado no estado atual
    switch (userState.step) {
        case 'inicio':
            return handleInicio(message, userState);
        
        case 'escolher_especialidade':
            return await handleEscolherEspecialidade(message, userState);
        
        case 'escolher_medico':
            return await handleEscolherMedico(message, userState);
        
        case 'escolher_horario':
            return handleEscolherHorario(message, userState);
        
        case 'confirmar_dados':
            return handleConfirmarDados(message, userState);
        
        case 'finalizar':
            return handleFinalizar(message, userState, phone);
        
        default:
            userState.step = 'inicio';
            return handleInicio(message, userState);
    }
}

// Início da conversa
function handleInicio(message, userState) {
    if (message.includes('oi') || message.includes('olá') || message.includes('ola')) {
        return `Olá! 👋 Bem-vindo ao *AgendMed*!

🏥 Sou sua assistente virtual para agendamentos médicos.

📋 *Como posso ajudar?*
• Digite *"agendar"* para marcar consulta
• Digite *"médicos"* para ver especialidades  
• Digite *"ajuda"* para mais opções

O que você precisa hoje? 😊`;
    }

    if (message.includes('agendar') || message.includes('consulta')) {
        userState.step = 'escolher_especialidade';
        return `🏥 *AGENDAR CONSULTA*

📋 *Serviços disponíveis:*

1️⃣ Consulta Médica 👨‍⚕️
2️⃣ Consulta Cardiológica ❤️  
3️⃣ Consulta de Rotina 🩺
4️⃣ Limpeza Dental 🦷
5️⃣ Tratamento de Canal 🦷

💬 *Digite o número ou nome do serviço*
*Exemplo:* "1" ou "consulta médica"`;
    }

    if (message.includes('médicos') || message.includes('especialidade')) {
        return `🏥 *ESPECIALIDADES DISPONÍVEIS:*

👨‍⚕️ *Cardiologia* - Coração e sistema cardiovascular
👩‍⚕️ *Dermatologia* - Pele, cabelo e unhas  
🦴 *Ortopedia* - Ossos, músculos e articulações
👶 *Pediatria* - Saúde infantil
🧠 *Neurologia* - Sistema nervoso
👁️ *Oftalmologia* - Olhos e visão

💬 *Para agendar:* Digite "agendar"`;
    }

    if (message.includes('ajuda') || message.includes('help')) {
        return `🆘 *AJUDA - AgendMed Bot*

📋 *Comandos principais:*
• *"agendar"* - Marcar consulta
• *"médicos"* - Ver especialidades
• *"consultas"* - Ver suas consultas
• *"cancelar"* - Cancelar agendamento

💬 *Exemplos práticos:*
• "Quero agendar uma consulta"
• "Preciso de um cardiologista"
• "Minhas consultas"

🕐 *Atendimento:* 24 horas`;
    }

    if (message.includes('consultas') || message.includes('agendamentos') || message.includes('minhas consultas')) {
        return verificarConsultasUsuario(phone);
    }

    // Resposta padrão
    return `Olá! 👋 

💡 *Como posso ajudar?*
• Digite *"agendar"* para marcar consulta
• Digite *"médicos"* para ver especialidades
• Digite *"ajuda"* para mais opções`;
}

// Escolher especialidade
async function handleEscolherEspecialidade(message, userState) {
    const especialidades = {
        '1': 'cardiologia',
        '2': 'dermatologia', 
        '3': 'ortopedia',
        '4': 'pediatria',
        '5': 'neurologia',
        '6': 'oftalmologia'
    };

    let especialidade = null;

    // Verificar se é número
    if (especialidades[message.trim()]) {
        especialidade = especialidades[message.trim()];
    }
    // Verificar se é nome da especialidade
    else if (message.includes('cardiologia') || message.includes('cardio')) {
        especialidade = 'cardiologia';
    } else if (message.includes('dermatologia') || message.includes('dermato')) {
        especialidade = 'dermatologia';
    } else if (message.includes('ortopedia') || message.includes('ortopedista')) {
        especialidade = 'ortopedia';
    } else if (message.includes('pediatria') || message.includes('pediatra')) {
        especialidade = 'pediatria';
    } else if (message.includes('neurologia') || message.includes('neurologista')) {
        especialidade = 'neurologia';
    } else if (message.includes('oftalmologia') || message.includes('oftalmologista')) {
        especialidade = 'oftalmologia';
    }

    if (especialidade) {
        userState.especialidade = especialidade;
        userState.step = 'escolher_medico';
        
        // Buscar médicos que oferecem esse serviço
        try {
            const todosMedicos = await buscarMedicosAPI();
            
            if (todosMedicos && todosMedicos.length > 0) {
                // Filtrar médicos que têm o serviço escolhido
                const medicosComServico = todosMedicos.filter(medico => 
                    medico.services && medico.services.some(servico => 
                        servico.name.toLowerCase().includes(especialidadeEscolhida.toLowerCase()) ||
                        especialidadeEscolhida.toLowerCase().includes(servico.name.toLowerCase())
                    )
                );
                
                if (medicosComServico.length > 0) {
                    userState.medicosDisponiveis = medicosComServico;
                    
                    let resposta = `👨‍⚕️ *PROFISSIONAIS PARA ${especialidadeEscolhida.toUpperCase()}:*\n\n`;
                    
                    medicosComServico.forEach((medico, index) => {
                        const servicoEscolhido = medico.services.find(s => 
                            s.name.toLowerCase().includes(especialidadeEscolhida.toLowerCase()) ||
                            especialidadeEscolhida.toLowerCase().includes(s.name.toLowerCase())
                        );
                        
                        resposta += `${index + 1}️⃣ *${medico.name}*\n`;
                        resposta += `   💰 R$ ${(servicoEscolhido?.price / 100).toFixed(2)}\n`;
                        resposta += `   📧 ${medico.email}\n`;
                        resposta += `   📞 ${medico.phone || 'Não informado'}\n`;
                        resposta += `   🏥 Serviço: ${servicoEscolhido?.name}\n\n`;
                    });
                    
                    resposta += `💬 *Digite o número do profissional:*\n`;
                    resposta += `*Exemplo:* "1" para ${medicosComServico[0].name}`;
                    
                    return resposta;
                }
            }
        } catch (error) {
            console.error('❌ Erro ao buscar médicos:', error);
        }
        
        // Fallback para médicos mock se API falhar
        return `👨‍⚕️ *MÉDICOS DE ${especialidade.toUpperCase()}:*

1️⃣ *Dr. Carlos Lima (Demo)*
   💰 R$ 280,00
   📅 Seg-Sex: 9h às 17h
   📍 São Paulo - SP
   ⭐ 4.7/5

2️⃣ *Dra. Ana Costa (Demo)*  
   💰 R$ 320,00
   📅 Ter-Sab: 8h às 16h
   📍 São Paulo - SP
   ⭐ 4.9/5

💬 *Digite o número do médico:*
*Exemplo:* "1" para Dr. Carlos Lima`;
    }

    return `❌ *Especialidade não encontrada*

📋 *Escolha uma das opções:*
1️⃣ Cardiologia
2️⃣ Dermatologia  
3️⃣ Ortopedia
4️⃣ Pediatria
5️⃣ Neurologia
6️⃣ Oftalmologia

💬 *Digite o número ou nome da especialidade*`;
}

// Escolher médico
async function handleEscolherMedico(message, userState) {
    const numeroMedico = parseInt(message.trim()) - 1;
    
    // Usar médicos reais se disponíveis
    if (userState.medicosDisponiveis && userState.medicosDisponiveis.length > 0) {
        const medicoEscolhido = userState.medicosDisponiveis[numeroMedico];
        
        if (medicoEscolhido) {
            const servico = medicoEscolhido.services?.[0];
            userState.medico = {
                id: medicoEscolhido.id,
                nome: medicoEscolhido.name,
                email: medicoEscolhido.email,
                preco: servico?.price || 250,
                precoFormatado: `R$ ${(servico?.price || 250).toFixed(2)}`,
                serviceId: servico?.id,
                serviceName: servico?.name || 'Consulta'
            };
            userState.step = 'escolher_horario';
            
            return `👨‍⚕️ *${medicoEscolhido.name}* selecionado!

📅 *HORÁRIOS DISPONÍVEIS HOJE:*

🌅 *Manhã:*
1️⃣ 08:00  2️⃣ 09:00  3️⃣ 10:00  4️⃣ 11:00

🌞 *Tarde:*  
5️⃣ 14:00  6️⃣ 15:00  7️⃣ 16:00  8️⃣ 17:00

💬 *Digite o número do horário:*
*Exemplo:* "5" para 14:00`;
        }
    }
    
    // Usar médicos reais se disponíveis
    if (userState.medicosDisponiveis && userState.medicosDisponiveis[numeroMedico]) {
        const medicoEscolhido = userState.medicosDisponiveis[numeroMedico];
        userState.medico = {
            id: medicoEscolhido.id,
            nome: medicoEscolhido.name,
            preco: `R$ ${medicoEscolhido.consultationFee},00`,
            crm: medicoEscolhido.crm,
            location: medicoEscolhido.location,
            services: medicoEscolhido.services
        };
        userState.step = 'escolher_horario';
        
        // Buscar horários disponíveis da API
        try {
            const hoje = new Date().toISOString().split('T')[0];
            const disponibilidade = await verificarDisponibilidadeAPI(medicoEscolhido.id, hoje);
            
            if (disponibilidade && disponibilidade.availableTimes.length > 0) {
                userState.horariosDisponiveis = disponibilidade.availableTimes;
                
                let resposta = `👨‍⚕️ *${medicoEscolhido.name}* selecionado!\n\n`;
                resposta += `📅 *HORÁRIOS DISPONÍVEIS HOJE:*\n\n`;
                
                disponibilidade.availableTimes.forEach((horario, index) => {
                    const periodo = parseInt(horario.split(':')[0]) < 12 ? '🌅' : '🌞';
                    resposta += `${index + 1}️⃣ ${horario} ${periodo}  `;
                    if ((index + 1) % 4 === 0) resposta += '\n';
                });
                
                resposta += `\n\n💬 *Digite o número do horário:*\n`;
                resposta += `*Exemplo:* "1" para ${disponibilidade.availableTimes[0]}`;
                
                return resposta;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar horários:', error);
        }
        
        // Fallback para horários padrão
        return `👨‍⚕️ *${medicoEscolhido.name}* selecionado!

📅 *HORÁRIOS DISPONÍVEIS HOJE:*

🌅 *Manhã:*
1️⃣ 08:00  2️⃣ 09:00  3️⃣ 10:00  4️⃣ 11:00

🌞 *Tarde:*  
5️⃣ 14:00  6️⃣ 15:00  7️⃣ 16:00  8️⃣ 17:00

💬 *Digite o número do horário:*
*Exemplo:* "5" para 14:00`;
    }

    // Fallback para médicos mock
    const medicos = {
        '1': { nome: 'Dr. Carlos Lima (Demo)', preco: 'R$ 280,00', id: 'demo-1' },
        '2': { nome: 'Dra. Ana Costa (Demo)', preco: 'R$ 320,00', id: 'demo-2' }
    };

    const medicoEscolhido = medicos[message.trim()];

    if (medicoEscolhido) {
        userState.medico = medicoEscolhido;
        userState.step = 'escolher_horario';
        
        return `👨‍⚕️ *${medicoEscolhido.nome}* selecionado!

📅 *HORÁRIOS DISPONÍVEIS HOJE:*

🌅 *Manhã:*
1️⃣ 08:00  2️⃣ 09:00  3️⃣ 10:00  4️⃣ 11:00

🌞 *Tarde:*  
5️⃣ 14:00  6️⃣ 15:00  7️⃣ 16:00  8️⃣ 17:00

💬 *Digite o número do horário:*
*Exemplo:* "5" para 14:00`;
    }

    const totalMedicos = userState.medicosDisponiveis ? userState.medicosDisponiveis.length : 2;
    return `❌ *Médico não encontrado*

💬 *Digite o número do médico (1 a ${totalMedicos}):*`;
}

// Escolher horário
function handleEscolherHorario(message, userState) {
    const numeroHorario = parseInt(message.trim()) - 1;
    
    // Usar horários reais se disponíveis
    if (userState.horariosDisponiveis && userState.horariosDisponiveis[numeroHorario]) {
        const horarioEscolhido = userState.horariosDisponiveis[numeroHorario];
        userState.horario = horarioEscolhido;
        userState.step = 'confirmar_dados';
        
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        return `📋 *CONFIRMAR AGENDAMENTO*

👨‍⚕️ *Médico:* ${userState.medico.nome}
🏥 *Serviço:* ${userState.medico.serviceName}
📅 *Data:* ${hoje}
⏰ *Horário:* ${horarioEscolhido}
💰 *Valor:* ${userState.medico.precoFormatado}

✅ *Digite "confirmar" para agendar*
❌ *Digite "cancelar" para cancelar*`;
    }
    
    // Fallback para horários padrão
    const horarios = {
        '1': '08:00', '2': '09:00', '3': '10:00', '4': '11:00',
        '5': '14:00', '6': '15:00', '7': '16:00', '8': '17:00'
    };

    const horarioEscolhido = horarios[message.trim()];

    if (horarioEscolhido) {
        userState.horario = horarioEscolhido;
        userState.step = 'confirmar_dados';
        
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        return `📋 *CONFIRMAR AGENDAMENTO*

👨‍⚕️ *Médico:* ${userState.medico.nome}
🏥 *Serviço:* ${userState.medico.serviceName}
📅 *Data:* ${hoje}
⏰ *Horário:* ${horarioEscolhido}
💰 *Valor:* ${userState.medico.precoFormatado}

✅ *Digite "confirmar" para agendar*
❌ *Digite "cancelar" para cancelar*`;
    }

    const totalHorarios = userState.horariosDisponiveis ? userState.horariosDisponiveis.length : 8;
    return `❌ *Horário não encontrado*

💬 *Digite o número do horário (1 a ${totalHorarios}):*`;
}

// Confirmar dados
function handleConfirmarDados(message, userState) {
    if (message.includes('confirmar') || message.includes('sim') || message.includes('ok')) {
        userState.step = 'finalizar';
        return `📝 *DADOS PESSOAIS*

Para finalizar o agendamento, preciso de alguns dados:

👤 *Qual seu nome completo?*

💬 *Digite seu nome:*
*Exemplo:* "João da Silva"`;
    }

    if (message.includes('cancelar') || message.includes('não') || message.includes('nao')) {
        userState.step = 'inicio';
        return `❌ *Agendamento cancelado*

Posso ajudar com algo mais?
• Digite *"agendar"* para tentar novamente`;
    }

    return `❓ *Confirmar agendamento?*

✅ Digite *"confirmar"* para prosseguir
❌ Digite *"cancelar"* para cancelar`;
}

// Finalizar agendamento
async function handleFinalizar(message, userState, phone) {
    if (!userState.nomeCompleto) {
        userState.nomeCompleto = message.trim();
        return `📞 *Qual seu telefone para contato?*

💬 *Digite seu telefone:*
*Exemplo:* "(11) 99999-9999"`;
    }

    if (!userState.telefone) {
        userState.telefone = message.trim();
        
        // Criar agendamento real na API
        try {
            const hoje = new Date().toISOString().split('T')[0];
            
            const agendamentoData = {
                patientName: userState.nomeCompleto,
                patientPhone: userState.telefone,
                patientEmail: `${userState.telefone.replace(/\D/g, '')}@whatsapp.agendmed.com`,
                doctorId: userState.medico.id,
                serviceId: userState.medico.serviceId,
                date: hoje,
                time: userState.horario
            };
            
            console.log('📤 Enviando dados para API:', agendamentoData);
            
            // Tentar criar agendamento real
            const agendamentoReal = await criarAgendamentoAPI(agendamentoData);
            
            const agendamento = {
                id: agendamentoReal?.appointment?.id || `whatsapp_${Date.now()}`,
                paciente: userState.nomeCompleto,
                telefone: userState.telefone,
                whatsapp: phone.replace('@c.us', ''),
                medico: userState.medico.nome,
                medicoId: userState.medico.id,
                especialidade: userState.especialidade,
                data: new Date().toLocaleDateString('pt-BR'),
                horario: userState.horario,
                valor: userState.medico.preco,
                status: 'agendado',
                criadoVia: 'WhatsApp',
                agendamentoReal: agendamentoReal ? true : false
            };
            
            console.log('📅 AGENDAMENTO CRIADO:', agendamento);
            
            if (agendamentoReal) {
                console.log('✅ Agendamento salvo no banco de dados');
                console.log('📊 ID do agendamento:', agendamentoReal.appointment.id);
            } else {
                console.log('⚠️ Agendamento criado apenas localmente (API indisponível)');
            }
            
            // Resetar estado
            userState.step = 'inicio';
            
            // Agendar lembrete para o dia da consulta
            agendarLembrete(agendamento, phone);
            
            return `🎉 *AGENDAMENTO CONFIRMADO!*

✅ *Consulta agendada com sucesso*

📋 *DETALHES:*
👤 *Paciente:* ${userState.nomeCompleto}
👨‍⚕️ *Médico:* ${userState.medico.nome}
🏥 *Serviço:* ${userState.medico.serviceName}
📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}
⏰ *Horário:* ${userState.horario}
💰 *Valor:* ${userState.medico.precoFormatado}

🔔 *Você receberá um lembrete via WhatsApp no dia da consulta*
📧 *E-mail de confirmação será enviado*

💬 *Precisa de mais alguma coisa?*
Digite *"agendar"* para nova consulta`;
            
        } catch (error) {
            console.error('❌ Erro ao criar agendamento:', error);
            return `❌ *Erro ao finalizar agendamento*

Tente novamente em alguns minutos ou entre em contato:
📞 (11) 99999-9999`;
        }
    }

    return `❌ *Erro no processo*

Digite *"agendar"* para começar novamente`;
}

// Salvar QR Code para interface web
function saveQRForWeb(qr) {
    try {
        const qrcode = require('qrcode');
        qrcode.toDataURL(qr, (err, url) => {
            if (!err) {
                const status = {
                    connected: false,
                    qrCode: url,
                    phone: null,
                    lastSeen: new Date().toISOString(),
                    botType: 'webjs-headless',
                    mode: 'headless'
                };
                
                fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
                console.log('📊 QR Code salvo para interface web');
                console.log('🌐 Acesse: http://localhost:3000/dashboard/whatsapp');
            }
        });
    } catch (error) {
        console.log('⚠️ Erro ao salvar QR Code:', error.message);
    }
}

// Salvar status de conexão
function saveConnectionStatus(connected, phone, name) {
    try {
        const status = {
            connected,
            qrCode: connected ? null : undefined,
            phone,
            name,
            botType: 'webjs-headless',
            mode: 'headless'
        };
        
        fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
        console.log('📊 Status salvo:', connected ? 'Conectado' : 'Desconectado');
    } catch (error) {
        console.log('⚠️ Erro ao salvar status:', error.message);
    }
}

// Inicializar cliente
console.log('🔄 Inicializando cliente WhatsApp (modo headless)...');
console.log('❌ Navegador NÃO será aberto');
console.log('🌐 QR Code aparecerá apenas no site\n');

client.initialize();

// Sistema de lembretes automáticos
function agendarLembrete(agendamento, phone) {
    try {
        // Calcular quando enviar o lembrete (1 hora antes da consulta)
        const hoje = new Date();
        const [hora, minuto] = agendamento.horario.split(':');
        
        // Data da consulta (hoje para teste, mas pode ser qualquer data)
        const dataConsulta = new Date();
        dataConsulta.setHours(parseInt(hora), parseInt(minuto), 0, 0);
        
        // Lembrete 1 hora antes
        const tempoLembrete = new Date(dataConsulta.getTime() - (60 * 60 * 1000));
        
        // Se o horário já passou, agendar para amanhã (para teste)
        if (tempoLembrete <= hoje) {
            tempoLembrete.setDate(tempoLembrete.getDate() + 1);
            dataConsulta.setDate(dataConsulta.getDate() + 1);
        }
        
        const delayMs = tempoLembrete.getTime() - hoje.getTime();
        
        console.log(`⏰ Lembrete agendado para: ${tempoLembrete.toLocaleString('pt-BR')}`);
        console.log(`📅 Consulta em: ${dataConsulta.toLocaleString('pt-BR')}`);
        
        // Agendar lembrete
        const timeoutId = setTimeout(async () => {
            await enviarLembrete(agendamento, phone);
        }, delayMs);
        
        // Salvar agendamento
        const agendamentoId = `${phone}_${Date.now()}`;
        agendamentos.set(agendamentoId, {
            ...agendamento,
            phone,
            timeoutId,
            dataConsulta: dataConsulta.toISOString(),
            lembreteEnviado: false
        });
        
        // Salvar em arquivo para persistência
        salvarAgendamentos();
        
    } catch (error) {
        console.error('❌ Erro ao agendar lembrete:', error);
    }
}

// Enviar lembrete via WhatsApp
async function enviarLembrete(agendamento, phone) {
    try {
        const mensagemLembrete = `🔔 *LEMBRETE DE CONSULTA*

Olá ${agendamento.paciente}! 👋

⏰ *Sua consulta é em 1 hora:*

👨‍⚕️ *Médico:* ${agendamento.medico}
🏥 *Especialidade:* ${agendamento.especialidade}
📅 *Data:* ${agendamento.data}
⏰ *Horário:* ${agendamento.horario}
📍 *Local:* Clínica AgendMed - São Paulo

📋 *IMPORTANTE:*
• Chegue 15 minutos antes
• Traga documento com foto
• Traga carteirinha do convênio (se houver)

💬 *Dúvidas?* Responda esta mensagem
📞 *Emergência:* (11) 99999-9999

Nos vemos em breve! 😊`;

        await client.sendMessage(phone, mensagemLembrete);
        
        console.log(`🔔 Lembrete enviado para ${phone}`);
        console.log(`👤 Paciente: ${agendamento.paciente}`);
        console.log(`⏰ Consulta: ${agendamento.horario}`);
        
        // Marcar como enviado
        const agendamentoKey = Array.from(agendamentos.keys()).find(key => 
            agendamentos.get(key).phone === phone && 
            agendamentos.get(key).paciente === agendamento.paciente
        );
        
        if (agendamentoKey) {
            const agendamentoData = agendamentos.get(agendamentoKey);
            agendamentoData.lembreteEnviado = true;
            agendamentos.set(agendamentoKey, agendamentoData);
            salvarAgendamentos();
        }
        
    } catch (error) {
        console.error('❌ Erro ao enviar lembrete:', error);
    }
}

// Salvar agendamentos em arquivo
function salvarAgendamentos() {
    try {
        const agendamentosArray = Array.from(agendamentos.entries()).map(([id, data]) => ({
            id,
            ...data,
            timeoutId: null // Não salvar timeout (será recriado)
        }));
        
        fs.writeFileSync('agendamentos-lembretes.json', JSON.stringify(agendamentosArray, null, 2));
        console.log('💾 Agendamentos salvos');
    } catch (error) {
        console.error('❌ Erro ao salvar agendamentos:', error);
    }
}

// Carregar agendamentos do arquivo
function carregarAgendamentos() {
    try {
        if (fs.existsSync('agendamentos-lembretes.json')) {
            const data = fs.readFileSync('agendamentos-lembretes.json', 'utf8');
            const agendamentosArray = JSON.parse(data);
            
            agendamentosArray.forEach(agendamento => {
                // Recriar timeouts para lembretes não enviados
                if (!agendamento.lembreteEnviado) {
                    const dataConsulta = new Date(agendamento.dataConsulta);
                    const tempoLembrete = new Date(dataConsulta.getTime() - (60 * 60 * 1000));
                    const agora = new Date();
                    
                    if (tempoLembrete > agora) {
                        const delayMs = tempoLembrete.getTime() - agora.getTime();
                        
                        const timeoutId = setTimeout(async () => {
                            await enviarLembrete(agendamento, agendamento.phone);
                        }, delayMs);
                        
                        agendamento.timeoutId = timeoutId;
                        console.log(`⏰ Lembrete recarregado para: ${tempoLembrete.toLocaleString('pt-BR')}`);
                    }
                }
                
                agendamentos.set(agendamento.id, agendamento);
            });
            
            console.log(`📋 ${agendamentosArray.length} agendamentos carregados`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar agendamentos:', error);
    }
}

// Verificar lembretes pendentes a cada minuto
function iniciarVerificadorLembretes() {
    setInterval(() => {
        const agora = new Date();
        console.log(`🔍 Verificando lembretes... ${agora.toLocaleTimeString('pt-BR')}`);
        
        agendamentos.forEach((agendamento, id) => {
            if (!agendamento.lembreteEnviado) {
                const dataConsulta = new Date(agendamento.dataConsulta);
                const tempoLembrete = new Date(dataConsulta.getTime() - (60 * 60 * 1000));
                
                // Se passou do horário do lembrete
                if (agora >= tempoLembrete && agora < dataConsulta) {
                    console.log(`⏰ Enviando lembrete atrasado para ${agendamento.paciente}`);
                    enviarLembrete(agendamento, agendamento.phone);
                }
            }
        });
    }, 60000); // Verificar a cada minuto
}

// Comando para listar agendamentos (para debug)
function listarAgendamentos() {
    console.log('\n📋 AGENDAMENTOS ATIVOS:');
    
    if (agendamentos.size === 0) {
        console.log('   Nenhum agendamento encontrado');
        return;
    }
    
    agendamentos.forEach((agendamento, id) => {
        console.log(`\n📅 ID: ${id}`);
        console.log(`   👤 Paciente: ${agendamento.paciente}`);
        console.log(`   👨‍⚕️ Médico: ${agendamento.medico}`);
        console.log(`   ⏰ Horário: ${agendamento.horario}`);
        console.log(`   📱 WhatsApp: ${agendamento.phone}`);
        console.log(`   🔔 Lembrete: ${agendamento.lembreteEnviado ? '✅ Enviado' : '⏳ Pendente'}`);
    });
    
    console.log('');
}

// Inicializar sistema de lembretes
console.log('⏰ Inicializando sistema de lembretes...');
carregarAgendamentos();
iniciarVerificadorLembretes();

// Verificar consultas do usuário
function verificarConsultasUsuario(phone) {
    const consultasUsuario = Array.from(agendamentos.values()).filter(
        agendamento => agendamento.phone === phone
    );
    
    if (consultasUsuario.length === 0) {
        return `📅 *SUAS CONSULTAS*

❌ Você não possui consultas agendadas.

💬 *Quer agendar uma consulta?*
Digite *"agendar"* para começar`;
    }
    
    let resposta = `📅 *SUAS CONSULTAS*\n\n`;
    
    consultasUsuario.forEach((consulta, index) => {
        const dataConsulta = new Date(consulta.dataConsulta);
        const agora = new Date();
        const status = dataConsulta > agora ? '⏳ Agendada' : '✅ Realizada';
        
        resposta += `${index + 1}️⃣ *${consulta.especialidade.toUpperCase()}*\n`;
        resposta += `   👨‍⚕️ ${consulta.medico}\n`;
        resposta += `   📅 ${consulta.data}\n`;
        resposta += `   ⏰ ${consulta.horario}\n`;
        resposta += `   💰 ${consulta.valor}\n`;
        resposta += `   📊 ${status}\n`;
        resposta += `   🔔 Lembrete: ${consulta.lembreteEnviado ? 'Enviado' : 'Pendente'}\n\n`;
    });
    
    resposta += `💬 *Precisa de algo mais?*\n`;
    resposta += `• Digite *"agendar"* para nova consulta`;
    
    return resposta;
}

// Funções de integração com APIs

// Buscar médicos reais da API
async function buscarMedicosAPI(especialidade) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            console.log('⚠️ API_KEY não configurada, usando dados mock');
            return null;
        }
        
        const url = `${BASE_URL}/api/doctors/search?specialty=${encodeURIComponent(especialidade)}&limit=5`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${data.doctors.length} médicos encontrados para ${especialidade}`);
            return data.doctors;
        } else {
            console.log('❌ Erro na API de médicos:', response.status);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar médicos:', error.message);
        return null;
    }
}

// Verificar disponibilidade de horários
async function verificarDisponibilidadeAPI(medicoId, data) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            console.log('⚠️ API_KEY não configurada');
            return null;
        }
        
        const response = await fetch(`${BASE_URL}/api/appointments/check-availability`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctorId: medicoId,
                date: data
            })
        });
        
        if (response.ok) {
            const disponibilidade = await response.json();
            console.log(`✅ ${disponibilidade.availableTimes.length} horários disponíveis para ${data}`);
            return disponibilidade;
        } else {
            console.log('❌ Erro na API de disponibilidade:', response.status);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar disponibilidade:', error.message);
        return null;
    }
}

// Criar agendamento real na API
async function criarAgendamentoAPI(agendamentoData) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const API_KEY = process.env.AGENDMED_API_KEY;
        
        if (!API_KEY) {
            console.log('⚠️ API_KEY não configurada, agendamento não será salvo no banco');
            return null;
        }
        
        const response = await fetch(`${BASE_URL}/api/appointments/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamentoData)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Agendamento criado na API:', resultado.appointment.id);
            return resultado;
        } else {
            const erro = await response.json();
            console.log('❌ Erro na API de agendamento:', erro.error);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error.message);
        return null;
    }
}

// Comando para debug (listar agendamentos)
process.on('SIGUSR1', () => {
    listarAgendamentos();
});

// Capturar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Parando bot headless...');
    
    // Salvar agendamentos antes de sair
    salvarAgendamentos();
    
    // Limpar timeouts
    agendamentos.forEach(agendamento => {
        if (agendamento.timeoutId) {
            clearTimeout(agendamento.timeoutId);
        }
    });
    
    client.destroy();
    process.exit(0);
});