#!/usr/bin/env node

// Debug da geração de QR Code
console.log('🔍 DEBUG: GERAÇÃO DE QR CODE - AGENDMED\n');

require('dotenv').config();

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

async function debugQRGeneration() {
    try {
        console.log('1️⃣ Testando API de status...');
        
        // Verificar status atual
        const statusResponse = await fetch(`${BASE_URL}/api/whatsapp/status`);
        console.log(`   Status HTTP: ${statusResponse.status}`);
        
        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            console.log('   Status atual:', {
                connected: statusData.connected,
                hasQrCode: !!statusData.qrCode,
                botType: statusData.botType
            });
        }
        
        console.log('\n2️⃣ Testando API de conexão...');
        
        // Tentar conectar
        const connectResponse = await fetch(`${BASE_URL}/api/whatsapp/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ botType: 'webjs' })
        });
        
        console.log(`   Status HTTP: ${connectResponse.status}`);
        
        if (connectResponse.ok) {
            const connectData = await connectResponse.json();
            console.log('   Resposta da conexão:', {
                success: connectData.success,
                hasQrCode: !!connectData.qrCode,
                message: connectData.message
            });
            
            if (connectData.qrCode) {
                console.log('✅ QR Code retornado imediatamente!');
                console.log(`   Tamanho: ${connectData.qrCode.length} caracteres`);
            } else {
                console.log('⏳ QR Code não retornado imediatamente, aguardando...');
                
                // Verificar status a cada 3 segundos por 30 segundos
                for (let i = 0; i < 10; i++) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    const checkResponse = await fetch(`${BASE_URL}/api/whatsapp/status`);
                    if (checkResponse.ok) {
                        const checkData = await checkResponse.json();
                        
                        console.log(`   Verificação ${i + 1}/10:`, {
                            connected: checkData.connected,
                            hasQrCode: !!checkData.qrCode,
                            botType: checkData.botType
                        });
                        
                        if (checkData.qrCode) {
                            console.log('✅ QR Code gerado!');
                            console.log(`   Tamanho: ${checkData.qrCode.length} caracteres`);
                            break;
                        }
                    }
                }
            }
        } else {
            const errorText = await connectResponse.text();
            console.log('❌ Erro na API de conexão:', errorText);
        }
        
        console.log('\n3️⃣ Verificando arquivo de status local...');
        
        // Verificar se o arquivo foi criado
        const fs = require('fs');
        if (fs.existsSync('whatsapp-dashboard-status.json')) {
            const fileData = fs.readFileSync('whatsapp-dashboard-status.json', 'utf8');
            const fileStatus = JSON.parse(fileData);
            
            console.log('   Arquivo local encontrado:', {
                connected: fileStatus.connected,
                hasQrCode: !!fileStatus.qrCode,
                botType: fileStatus.botType,
                lastSeen: fileStatus.lastSeen
            });
        } else {
            console.log('   ❌ Arquivo de status não encontrado');
        }
        
        console.log('\n4️⃣ Verificando processos Node.js...');
        
        // Verificar processos (Windows)
        const { spawn } = require('child_process');
        const tasklist = spawn('tasklist', ['/FI', 'IMAGENAME eq node.exe']);
        
        let processOutput = '';
        tasklist.stdout.on('data', (data) => {
            processOutput += data.toString();
        });
        
        tasklist.on('close', (code) => {
            const lines = processOutput.split('\n').filter(line => line.includes('node.exe'));
            console.log(`   Processos Node.js ativos: ${lines.length}`);
            
            if (lines.length > 0) {
                console.log('   Alguns processos encontrados:');
                lines.slice(0, 3).forEach((line, index) => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        console.log(`     ${index + 1}. PID: ${parts[1]}`);
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Erro durante debug:', error.message);
    }
}

debugQRGeneration();