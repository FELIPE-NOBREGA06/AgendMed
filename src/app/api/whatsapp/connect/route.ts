import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import { getWhatsAppStatus, clearWhatsAppStatus } from '@/lib/whatsapp-utils'

let botProcess: any = null

export async function POST(request: NextRequest) {
  try {
    // Temporariamente sem autenticação para teste
    console.log('🔌 Recebida requisição de conexão WhatsApp')

    const { botType = 'webjs' } = await request.json()

    // Parar processo anterior se existir
    if (botProcess) {
      botProcess.kill()
      botProcess = null
    }

    // Limpar status anterior
    clearWhatsAppStatus()

    // Iniciar bot apenas para QR Code
    console.log('🚀 Iniciando bot WhatsApp QR Code...')
    
    const scriptPath = path.join(process.cwd(), 'whatsapp-free/qr-only-bot.js')
    
    botProcess = spawn('node', [scriptPath], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    })

    botProcess.stdout.on('data', (data: Buffer) => {
      console.log('Bot:', data.toString())
    })

    botProcess.stderr.on('data', (data: Buffer) => {
      console.error('Bot Error:', data.toString())
    })

    botProcess.on('close', (code: number) => {
      console.log(`Bot process exited with code ${code}`)
      botProcess = null
    })

    // Aguardar bot gerar QR Code
    await new Promise(resolve => setTimeout(resolve, 8000))

    // Verificar se QR Code foi gerado
    const status = getWhatsAppStatus()

    return NextResponse.json({
      success: true,
      message: 'Bot WhatsApp iniciado em modo headless! QR Code aparecerá apenas no site.',
      botType: 'webjs-headless',
      qrCode: status.qrCode,
      connected: status.connected,
      mode: 'headless',
      instructions: [
        'QR Code será gerado APENAS no site (sem abrir navegador)',
        'Aguarde o QR Code aparecer (pode levar até 30 segundos)',
        'Abra o WhatsApp no seu celular',
        'Vá em Menu (⋮) → Dispositivos conectados',
        'Clique em "Conectar um dispositivo"',
        'Escaneie o QR Code quando aparecer no dashboard'
      ]
    })

  } catch (error) {
    console.error('Erro ao iniciar bot:', error)
    return NextResponse.json({ 
      error: 'Erro ao iniciar bot WhatsApp' 
    }, { status: 500 })
  }
}

// Função para parar bot
function stopBot() {
  if (botProcess) {
    botProcess.kill()
    botProcess = null
    clearWhatsAppStatus()
    console.log('Bot parado')
  }
}