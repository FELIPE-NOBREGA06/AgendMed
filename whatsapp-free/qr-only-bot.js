#!/usr/bin/env node

// Bot WhatsApp APENAS para gerar QR Code
console.log('📱 INICIANDO BOT QR CODE - AGENDMED');

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "agendmed-qr-only"
    }),
    puppeteer: {
        headless: true,
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

// QR Code gerado
client.on('qr', (qr) => {
    console.log('🎉 QR CODE GERADO!');
    
    try {
        const qrcode = require('qrcode');
        qrcode.toDataURL(qr, (err, url) => {
            if (!err) {
                const status = {
                    connected: false,
                    qrCode: url,
                    phone: null,
                    lastSeen: new Date().toISOString(),
                    botType: 'qr-only',
                    mode: 'headless'
                };
                
                fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
                console.log('✅ QR Code salvo para dashboard');
            } else {
                console.error('❌ Erro ao converter QR:', err);
            }
        });
    } catch (error) {
        console.error('❌ Erro ao processar QR:', error);
    }
});

// Cliente pronto
client.on('ready', () => {
    console.log('✅ WhatsApp conectado!');
    
    const info = client.info;
    const status = {
        connected: true,
        qrCode: null,
        phone: info.wid.user,
        name: info.pushname,
        lastSeen: new Date().toISOString(),
        botType: 'qr-only',
        mode: 'headless'
    };
    
    fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
    console.log('📊 Status conectado salvo');
});

// Erro
client.on('auth_failure', (msg) => {
    console.log('❌ Falha na autenticação:', msg);
});

// Desconectado
client.on('disconnected', (reason) => {
    console.log('🔌 Desconectado:', reason);
    
    const status = {
        connected: false,
        qrCode: null,
        phone: null,
        lastSeen: new Date().toISOString(),
        botType: 'qr-only',
        mode: 'headless'
    };
    
    fs.writeFileSync('whatsapp-dashboard-status.json', JSON.stringify(status, null, 2));
});

// Inicializar
console.log('🔄 Inicializando cliente...');
client.initialize();

// Timeout de segurança - manter ativo por mais tempo
setTimeout(() => {
    console.log('⏰ Bot ativo há 5 minutos - mantendo conexão');
}, 300000); // 5 minutos

// Log de progresso
setTimeout(() => {
    console.log('📊 Bot ativo há 30 segundos...');
}, 30000);

// Capturar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Parando bot...');
    client.destroy();
    process.exit(0);
});