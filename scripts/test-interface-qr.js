#!/usr/bin/env node

// Teste da interface web para QR Code
console.log('🌐 TESTE: INTERFACE WEB QR CODE - AGENDMED\n');

require('dotenv').config();

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

async function testWebInterface() {
    try {
        console.log('1️⃣ Simulando clique no botão "Gerar QR Code"...');
        
        const response = await fetch(`${BASE_URL}/api/whatsapp/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ botType: 'webjs' })
        });
        
        console.log(`   Status HTTP: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            
            console.log('✅ Resposta da API:');
            console.log(`   Success: ${data.success}`);
            console.log(`   QR Code: ${data.qrCode ? 'Disponível' : 'Não disponível'}`);
            console.log(`   Tamanho: ${data.qrCode ? data.qrCode.length + ' caracteres' : 'N/A'}`);
            console.log(`   Mensagem: ${data.message}`);
            
            if (data.qrCode) {
                console.log('\n🎉 SUCESSO! QR Code está sendo retornado para a interface!');
                console.log('📱 A interface web deve mostrar o QR Code imediatamente.');
                
                // Verificar se é um QR Code válido (base64 PNG)
                if (data.qrCode.startsWith('data:image/png;base64,')) {
                    console.log('✅ Formato válido: Base64 PNG');
                } else {
                    console.log('⚠️ Formato inesperado do QR Code');
                }
            } else {
                console.log('\n❌ QR Code não foi retornado');
                console.log('🔍 Verifique se o bot está rodando corretamente');
            }
            
        } else {
            const errorText = await response.text();
            console.log('❌ Erro na API:', errorText);
        }
        
        console.log('\n2️⃣ Verificando status após conexão...');
        
        const statusResponse = await fetch(`${BASE_URL}/api/whatsapp/status`);
        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            console.log('📊 Status atual:');
            console.log(`   Conectado: ${statusData.connected ? '✅' : '❌'}`);
            console.log(`   QR Code: ${statusData.qrCode ? '✅ Disponível' : '❌ Não disponível'}`);
            console.log(`   Bot Type: ${statusData.botType}`);
            console.log(`   Última atualização: ${statusData.lastSeen}`);
        }
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
    }
}

testWebInterface();