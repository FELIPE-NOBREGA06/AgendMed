import fs from 'fs'
import path from 'path'

// Função para obter status atual do WhatsApp
export function getWhatsAppStatus() {
  try {
    const statusPath = path.join(process.cwd(), 'whatsapp-dashboard-status.json')
    if (fs.existsSync(statusPath)) {
      const data = fs.readFileSync(statusPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Erro ao ler status:', error)
  }
  
  return {
    connected: false,
    qrCode: null,
    phone: null,
    lastSeen: null,
    botType: 'webjs-headless',
    mode: 'headless'
  }
}

// Função para limpar status
export function clearWhatsAppStatus() {
  try {
    const statusPath = path.join(process.cwd(), 'whatsapp-dashboard-status.json')
    const initialStatus = {
      connected: false,
      qrCode: null,
      phone: null,
      lastSeen: null,
      botType: 'webjs-headless',
      mode: 'headless'
    }
    fs.writeFileSync(statusPath, JSON.stringify(initialStatus, null, 2))
  } catch (error) {
    console.error('Erro ao limpar status:', error)
  }
}

// Função para atualizar status
export function updateWhatsAppStatus(status: any) {
  try {
    const statusPath = path.join(process.cwd(), 'whatsapp-dashboard-status.json')
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2))
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}