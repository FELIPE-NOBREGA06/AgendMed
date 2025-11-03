import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import { getWhatsAppStatus, clearWhatsAppStatus } from '@/lib/whatsapp-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

let botProcess: any = null

export async function POST(request: NextRequest) {
  try {
    console.log('🔌 Recebida requisição de conexão WhatsApp')

    // Verificar se estamos no Vercel (ambiente serverless)
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      console.log('🔌 Detectado ambiente Vercel - usando versão compatível')
      
      // Redirecionar para versão compatível com Vercel
      const compatibleResponse = await fetch(`${request.nextUrl.origin}/api/whatsapp/vercel-compatible`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'connect' })
      })
      
      if (compatibleResponse.ok) {
        const data = await compatibleResponse.json()
        return NextResponse.json(data)
      } else {
        return NextResponse.json({
          success: false,
          error: 'WhatsApp Web.js não é suportado no Vercel.',
          message: 'Usando versão de demonstração. Para WhatsApp real, use Railway ou Render.',
          alternatives: [
            'Deploy no Railway (recomendado)',
            'Deploy no Render (gratuito)',
            'Use WhatsApp Business API',
            'Configure servidor VPS próprio'
          ],
          documentation: '/docs/RAILWAY_DEPLOY.md'
        }, { status: 501 })
      }
    }

    const { botType = 'webjs' } = await request.json()

    // Parar processo anterior se existir
    if (botProcess) {
      botProcess.kill()
      botProcess = null
    }

    // Verificar se já existe QR code válido
    const currentStatus = getWhatsAppStatus()
    
    if (currentStatus.qrCode && !currentStatus.connected) {
      console.log('✅ QR Code já disponível, retornando imediatamente')
      return NextResponse.json({
        success: true,
        message: 'QR Code já disponível! Escaneie para conectar.',
        botType: currentStatus.botType,
        qrCode: currentStatus.qrCode,
        connected: currentStatus.connected,
        mode: 'headless',
        instructions: [
          'QR Code já está disponível',
          'Abra o WhatsApp no seu celular',
          'Vá em Menu (⋮) → Dispositivos conectados',
          'Clique em "Conectar um dispositivo"',
          'Escaneie o QR Code'
        ]
      })
    }

    // Limpar status anterior apenas se necessário
    clearWhatsAppStatus()

    // Verificar se o Node.js e dependências estão disponíveis
    try {
      const scriptPath = path.join(process.cwd(), 'whatsapp-free/qr-only-bot.js')
      
      // Verificar se o arquivo existe
      if (!require('fs').existsSync(scriptPath)) {
        throw new Error('Script do bot não encontrado')
      }

      console.log('🚀 Iniciando bot WhatsApp QR Code...')
      
      botProcess = spawn('node', [scriptPath], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
        timeout: 60000 // 60 segundos timeout
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

      botProcess.on('error', (error: Error) => {
        console.error('Bot process error:', error)
        botProcess = null
      })

      // Aguardar bot gerar QR Code com verificação ativa
      console.log('⏳ Aguardando QR Code ser gerado...')
      
      let status = getWhatsAppStatus()
      let attempts = 0
      const maxAttempts = 10 // 30 segundos total
      
      while (!status.qrCode && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000))
        status = getWhatsAppStatus()
        attempts++
        
        console.log(`   Tentativa ${attempts}/${maxAttempts}: QR Code ${status.qrCode ? 'encontrado' : 'não encontrado'}`)
        
        if (status.qrCode) {
          console.log('✅ QR Code gerado com sucesso!')
          break
        }
      }

      if (!status.qrCode) {
        throw new Error('Timeout: QR Code não foi gerado em tempo hábil')
      }

      return NextResponse.json({
        success: true,
        message: 'QR Code gerado com sucesso!',
        botType: 'webjs-headless',
        qrCode: status.qrCode,
        connected: status.connected,
        mode: 'headless',
        instructions: [
          'QR Code gerado com sucesso',
          'Abra o WhatsApp no seu celular',
          'Vá em Menu (⋮) → Dispositivos conectados',
          'Clique em "Conectar um dispositivo"',
          'Escaneie o QR Code'
        ]
      })

    } catch (processError) {
      console.error('Erro no processo do bot:', processError)
      throw processError
    }

  } catch (error) {
    console.error('Erro ao iniciar bot:', error)
    
    // Limpar processo se houver erro
    if (botProcess) {
      botProcess.kill()
      botProcess = null
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao gerar QR Code',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      suggestions: [
        'Verifique se todas as dependências estão instaladas',
        'Tente novamente em alguns segundos',
        'Se o problema persistir, use um servidor dedicado'
      ]
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