#!/usr/bin/env node

// Bot WhatsApp SIMPLES para agendamento - Teste
console.log('🤖 INICIANDO BOT SIMPLES DE AGENDAMENTO\n');

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

// Estado das conversas (em memória)
const userStates = new Map();

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "agendmed-simple-bot"
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    }
});

// QR Code
client.on('qr', (qr) => {
    console.log('📱 QR CODE GERADO!');
    saveQRForWeb(qr);
});

// Conectado
client.on('ready', () => {
    console.log('🎉 WHATSAPP CONECTADO!');
    const info = client.info;
    console.log(`📱 Número: ${info.wid.user}`);
    saveConnectionStatus(true, info.wid.user, info.pushname);
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
    const text = message.body.toLowerCase().trim();
    
    console.log(`📱 MENSAGEM RECEBIDA de ${from}: "${message.body}"`);
    
    try {
        const response = await processarMensagem(text, from);
        await message.reply(response);
        console.log(`🤖 RESPOSTA ENVIADA: "${response.substring(0, 80)}..."`);
    } catch (error) {
        console.error('❌ ERRO ao processar:', error);
        await message.reply('❌ Erro interno. Tente novamente.');
    }
});

// Processar mensagens com sistema de estados
async function processarMensagem(mensagem, telefone) {
    // Obter ou criar estado do usuário
    let estado = userStates.get(telefone);
    if (!estado) {
        estado = { etapa: 'inicio' };
        userStates.set(telefone, estado);
    }
    
    console.log(`📊 ESTADO ATUAL: ${estado.etapa}`);
    
    // Comandos globais
    if (mensagem.includes('cancelar') || mensagem.includes('sair')) {
        estado.etapa = 'inicio';
        userStates.set(telefone, estado);
        return '❌ Operação cancelada. Digite "oi" para começar novamente.';
    }
    
    if (mensagem.includes('menu') || mensagem.includes('inicio')) {
        estado.etapa = 'inicio';
        userStates.set(telefone, estado);
    }
    
    // Processar baseado na etapa atual
    let resposta = '';
    
    switch (estado.etapa) {
        case 'inicio':
            resposta = await etapaInicio(mensagem, estado);
            break;
            
        case 'especialidade':
            resposta = await etapaEspecialidade(mensagem, estado);
            break;
            
        case 'medico':
            resposta = await etapaMedico(mensagem, estado);
            break;
            
        case 'horario':
            resposta = await etapaHorario(mensagem, estado);
            break;
            
        case 'confirmacao':
            resposta = await etapaConfirmacao(mensagem, estado);
            break;
            
        case 'dados':
            resposta = await etapaDados(mensagem, estado);
            break;
            
        default:
            estado.etapa = 'inicio';
            resposta = await etapaInicio(mensagem, estado);
    }
    
    // Salvar estado atualizado
    userStates.set(telefone, estado);
    console.log(`📊 NOVO ESTADO: ${estado.etapa}`);
    
    return resposta;
}

// ETAPA 1: Início
async function etapaInicio(mensagem, estado) {
    if (mensagem.includes('oi') || mensagem.includes('olá') || mensagem.includes('ola')) {
        return `Olá! 👋 Bem-vindo ao *AgendMed*!

🏥 Sou seu assistente para agendamentos médicos.

*Como posso ajudar?*
• Digite *"agendar"* - Marcar consulta
• Digite *"ajuda"* - Ver opções

O que você precisa? 😊`;
    }
    
    if (mensagem.includes('agendar') || mensagem.includes('consulta')) {
        estado.etapa = 'especialidade';
        return `🏥 *AGENDAR CONSULTA*

*Escolha uma especialidade:*

1️⃣ Cardiologia
2️⃣ Dermatologia  
3️⃣ Ortopedia
4️⃣ Pediatria

*Digite o número (1, 2, 3 ou 4)*`;
    }
    
    if (mensagem.includes('ajuda')) {
        return `🆘 *AJUDA*

*Comandos:*
• "agendar" - Marcar consulta
• "cancelar" - Cancelar operação
• "menu" - Voltar ao início

*Para agendar:*
1. Digite "agendar"
2. Escolha especialidade
3. Escolha médico
4. Escolha horário
5. Confirme dados`;
    }
    
    return `Olá! 👋

Digite *"agendar"* para marcar uma consulta
Digite *"ajuda"* para ver opções`;
}

// ETAPA 2: Especialidade
async function etapaEspecialidade(mensagem, estado) {
    const especialidades = {
        '1': 'Cardiologia',
        '2': 'Dermatologia',
        '3': 'Ortopedia', 
        '4': 'Pediatria'
    };
    
    const numero = mensagem.trim();
    
    if (especialidades[numero]) {
        estado.especialidadeEscolhida = especialidades[numero];
        estado.etapa = 'medico';
        
        return `✅ *${especialidades[numero]}* selecionada!

*Médicos disponíveis:*

1️⃣ Dr. João Silva - R$ 250,00
2️⃣ Dra. Maria Santos - R$ 300,00

*Digite o número do médico (1 ou 2)*`;
    }
    
    return `❌ Opção inválida!

*Escolha uma especialidade:*
1️⃣ Cardiologia
2️⃣ Dermatologia  
3️⃣ Ortopedia
4️⃣ Pediatria

*Digite apenas o número (1, 2, 3 ou 4)*`;
}

// ETAPA 3: Médico
async function etapaMedico(mensagem, estado) {
    const medicos = {
        '1': { nome: 'Dr. João Silva', preco: 'R$ 250,00' },
        '2': { nome: 'Dra. Maria Santos', preco: 'R$ 300,00' }
    };
    
    const numero = mensagem.trim();
    
    if (medicos[numero]) {
        estado.medicoEscolhido = medicos[numero];
        estado.etapa = 'horario';
        
        return `✅ *${medicos[numero].nome}* selecionado!

*Horários disponíveis hoje:*

1️⃣ 08:00
2️⃣ 09:00  
3️⃣ 14:00
4️⃣ 15:00
5️⃣ 16:00

*Digite o número do horário*`;
    }
    
    return `❌ Médico inválido!

*Escolha um médico:*
1️⃣ Dr. João Silva - R$ 250,00
2️⃣ Dra. Maria Santos - R$ 300,00

*Digite 1 ou 2*`;
}

// ETAPA 4: Horário
async function etapaHorario(mensagem, estado) {
    const horarios = {
        '1': '08:00',
        '2': '09:00',
        '3': '14:00',
        '4': '15:00',
        '5': '16:00'
    };
    
    const numero = mensagem.trim();
    
    if (horarios[numero]) {
        estado.horarioEscolhido = horarios[numero];
        estado.etapa = 'confirmacao';
        
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        return `📋 *CONFIRMAR AGENDAMENTO*

*Dados da consulta:*
👨‍⚕️ Médico: ${estado.medicoEscolhido.nome}
🏥 Especialidade: ${estado.especialidadeEscolhida}
📅 Data: ${hoje}
⏰ Horário: ${horarios[numero]}
💰 Valor: ${estado.medicoEscolhido.preco}

*Confirma o agendamento?*
✅ Digite *"sim"* para confirmar
❌ Digite *"não"* para cancelar`;
    }
    
    return `❌ Horário inválido!

*Horários disponíveis:*
1️⃣ 08:00
2️⃣ 09:00  
3️⃣ 14:00
4️⃣ 15:00
5️⃣ 16:00

*Digite o número do horário*`;
}

// ETAPA 5: Confirmação
async function etapaConfirmacao(mensagem, estado) {
    if (mensagem.includes('sim') || mensagem.includes('confirmar') || mensagem.includes('ok')) {
        estado.etapa = 'dados';
        return `📝 *DADOS PESSOAIS*

Para finalizar, preciso do seu nome completo.

*Digite seu nome:*
Exemplo: João da Silva`;
    }
    
    if (mensagem.includes('não') || mensagem.includes('nao') || mensagem.includes('cancelar')) {
        estado.etapa = 'inicio';
        return `❌ Agendamento cancelado.

Digite *"agendar"* para tentar novamente.`;
    }
    
    return `❓ *Confirma o agendamento?*

✅ Digite *"sim"* para confirmar
❌ Digite *"não"* para cancelar`;
}

// ETAPA 6: Dados pessoais
async function etapaDados(mensagem, estado) {
    if (!estado.nomeCompleto) {
        estado.nomeCompleto = mensagem.trim();
        return `📞 Agora preciso do seu telefone.

*Digite seu telefone:*
Exemplo: (11) 99999-9999`;
    }
    
    if (!estado.telefoneContato) {
        estado.telefoneContato = mensagem.trim();
        
        // FINALIZAR AGENDAMENTO
        const agendamento = {
            paciente: estado.nomeCompleto,
            telefone: estado.telefoneContato,
            medico: estado.medicoEscolhido.nome,
            especialidade: estado.especialidadeEscolhida,
            horario: estado.horarioEscolhido,
            valor: estado.medicoEscolhido.preco,
            data: new Date().toLocaleDateString('pt-BR'),
            timestamp: new Date().toISOString()
        };
        
        console.log('📅 AGENDAMENTO CRIADO:', JSON.stringify(agendamento, null, 2));
        
        // Resetar estado
        estado.etapa = 'inicio';
        estado.nomeCompleto = null;
        estado.telefoneContato = null;
        estado.especialidadeEscolhida = null;
        estado.medicoEscolhido = null;
        estado.horarioEscolhido = null;
        
        return `🎉 *AGENDAMENTO CONFIRMADO!*

✅ *Consulta marcada com sucesso!*

*Resumo:*
👤 Paciente: ${agendamento.paciente}
👨‍⚕️ Médico: ${agendamento.medico}
🏥 Especialidade: ${agendamento.especialidade}
📅 Data: ${agendamento.data}
⏰ Horário: ${agendamento.horario}
💰 Valor: ${agendamento.valor}

📱 Você receberá confirmação por SMS
📧 E-mail será enviado em breve

*Precisa de mais alguma coisa?*
Digite *"agendar"* para nova consulta`;
    }
    
    return `❌ Erro nos dados. Digite *"menu"* para recomeçar.`;
}

// Salvar QR Code
function saveQRForWeb(qr) {
    try {
        const qrcode = require('qrcode');
        qrcode.toDataURL(qr, (err, url) => {
            if (!err) {
                const status = {
                    connected: false,
                    qrCode: url,
                    phone: null,
                    botType: 'simple-agendamento'
                };
                fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
                console.log('📊 QR Code salvo');
            }
        });
    } catch (error) {
        console.log('⚠️ Erro ao salvar QR:', error.message);
    }
}

// Salvar status
function saveConnectionStatus(connected, phone, name) {
    try {
        const status = {
            connected,
            qrCode: connected ? null : undefined,
            phone,
            name,
            botType: 'simple-agendamento'
        };
        fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
        console.log('📊 Status salvo:', connected ? 'Conectado' : 'Desconectado');
    } catch (error) {
        console.log('⚠️ Erro ao salvar status:', error.message);
    }
}

// Inicializar
console.log('🔄 Inicializando bot simples...');
client.initialize();

// Capturar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Parando bot...');
    client.destroy();
    process.exit(0);
});