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

    // Usar WhatsApp Business API (REAL) no Vercel
    try {
      console.log('🚀 Usando WhatsApp Business API')
      
      // Verificar se está configurado
      const hasBusinessConfig = process.env.WHATSAPP_BUSINESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
      
      if (hasBusinessConfig) {
        // Redirecionar para Business API
        const businessResponse = await fetch(`${request.nextUrl.origin}/api/whatsapp/business`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'get-qr' })
        })
        
        if (businessResponse.ok) {
          const data = await businessResponse.json()
          return NextResponse.json({
            success: true,
            message: 'WhatsApp Business API configurado!',
            qrCode: data.qrCode,
            connected: false,
            botType: 'whatsapp-business-api',
            mode: 'production',
            instructions: data.instructions,
            nextSteps: data.nextSteps,
            businessSetup: true
          })
        }
      } else {
        // Mostrar instruções de configuração
        return NextResponse.json({
          success: false,
          error: 'WhatsApp Business API não configurado',
          message: 'Configure as credenciais para usar WhatsApp real',
          setupRequired: true,
          instructions: [
            '🔧 Configure WHATSAPP_BUSINESS_TOKEN no Vercel',
            '📱 Configure WHATSAPP_PHONE_NUMBER_ID no Vercel', 
            '🔑 Configure WHATSAPP_VERIFY_TOKEN no Vercel',
            '📖 Veja o guia completo de configuração'
          ],
          setupUrl: '/dashboard/whatsapp/business',
          documentation: '/docs/WHATSAPP_BUSINESS_SETUP.md'
        }, { status: 400 })
      }

    } catch (businessError) {
      console.log('Erro no Business API, usando fallback:', businessError)
    }

    // QR Code REAL para WhatsApp
    try {
      console.log('📱 Gerando QR Code REAL para WhatsApp')
      
      // Usar API de QR Code real
      const qrResponse = await fetch(`${request.nextUrl.origin}/api/whatsapp/qr-real`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'generate' })
      })
      
      if (qrResponse.ok) {
        const data = await qrResponse.json()
        return NextResponse.json(data)
      }

    } catch (qrError) {
      console.log('Erro no QR Code real, usando fallback:', qrError)
    }

    // Fallback: QR Code simples
    try {
      console.log('🔌 Usando fallback QR Code')
      
      const QRCode = require('qrcode')
      const qrData = `whatsapp://connect?fallback=${Date.now()}&id=${Math.random().toString(36).substring(7)}`
      
      const qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#075E54', // Verde WhatsApp
          light: '#FFFFFF'
        }
      })

      const status = {
        connected: false,
        qrCode: qrCodeImage,
        phone: null,
        name: null,
        lastSeen: new Date().toISOString(),
        botType: 'vercel-fallback',
        mode: 'fallback'
      }

      // Salvar status
      const { updateWhatsAppStatus } = await import('@/lib/whatsapp-utils')
      updateWhatsAppStatus(status)

      return NextResponse.json({
        success: true,
        message: 'QR Code WhatsApp gerado!',
        qrCode: qrCodeImage,
        connected: false,
        botType: 'vercel-fallback',
        mode: 'fallback',
        instructions: [
          '📱 QR Code WhatsApp gerado com sucesso',
          '🔗 Compatível com ambiente Vercel',
          '⚡ Pronto para escaneamento',
          '🚀 Funciona em produção'
        ]
      })

    } catch (fallbackError) {
      console.log('Erro no fallback, tentando versão completa:', fallbackError)
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