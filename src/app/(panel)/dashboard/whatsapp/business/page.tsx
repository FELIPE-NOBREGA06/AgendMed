"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  MessageCircle, 
  Phone, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Webhook,
  QrCode
} from 'lucide-react'
import { toast } from 'sonner'

export default function WhatsAppBusinessPage() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messageHistory, setMessageHistory] = useState<any[]>([])
  const [isConfigured, setIsConfigured] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    // Verificar se as variáveis estão configuradas
    const hasToken = process.env.NEXT_PUBLIC_WHATSAPP_CONFIGURED === 'true'
    setIsConfigured(hasToken)
  }

  const sendBusinessMessage = async () => {
    if (!phone || !message) {
      toast.error('Preencha telefone e mensagem')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/whatsapp/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send-message',
          phone, 
          message 
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Mensagem enviada via WhatsApp Business API!')
        
        setMessageHistory(prev => [...prev, {
          id: data.messageId,
          phone: data.phone,
          message: message,
          timestamp: data.timestamp,
          status: 'sent',
          provider: 'whatsapp-business-api'
        }])
        
        setMessage('')
        
      } else {
        if (data.setup_guide) {
          toast.error('Configure WhatsApp Business API', {
            description: 'Veja o guia de configuração'
          })
        } else {
          toast.error(data.error || 'Erro ao enviar mensagem')
        }
      }

    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const setupWebhook = async () => {
    try {
      const response = await fetch('/api/whatsapp/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'webhook-setup' })
      })

      const data = await response.json()

      if (data.success) {
        setWebhookUrl(data.webhookUrl)
        toast.success('Informações do webhook obtidas!')
      }

    } catch (error) {
      toast.error('Erro ao obter informações do webhook')
    }
  }

  const generateBusinessQR = async () => {
    try {
      const response = await fetch('/api/whatsapp/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-qr' })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('QR Code para configuração gerado!')
        // Abrir em nova aba
        window.open(data.setupUrl, '_blank')
      }

    } catch (error) {
      toast.error('Erro ao gerar QR Code')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Business API</h1>
          <p className="text-muted-foreground">
            WhatsApp oficial que funciona 100% no Vercel
          </p>
        </div>
        <Badge variant={isConfigured ? "default" : "secondary"} className="ml-auto">
          {isConfigured ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Configurado
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-1" />
              Não Configurado
            </>
          )}
        </Badge>
      </div>

      {/* Status de Configuração */}
      {!isConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Settings className="w-5 h-5" />
              Configuração Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-700">
                Para usar WhatsApp Business API, você precisa configurar as credenciais.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={generateBusinessQR} variant="outline" className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Configurar Meta Business
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <a href="/docs/WHATSAPP_BUSINESS_SETUP.md" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Guia Completo
                  </a>
                </Button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Variáveis necessárias no Vercel:</h4>
                <ul className="text-sm space-y-1 font-mono">
                  <li>• WHATSAPP_BUSINESS_TOKEN</li>
                  <li>• WHATSAPP_PHONE_NUMBER_ID</li>
                  <li>• WHATSAPP_VERIFY_TOKEN</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Envio de Mensagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Mensagem Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business-phone">Telefone (com DDD)</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="ml-1 text-sm text-gray-600">+55</span>
                </div>
                <Input
                  id="business-phone"
                  placeholder="11999999999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business-message">Mensagem</Label>
              <Textarea
                id="business-message"
                placeholder="Digite sua mensagem real aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={sendBusinessMessage} 
              disabled={loading || !phone || !message}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando via API...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar via Business API
                </>
              )}
            </Button>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>WhatsApp Real:</strong> Mensagens enviadas via API oficial do Meta.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Webhook */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Webhook Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure o webhook para receber mensagens automaticamente.
            </p>

            <Button onClick={setupWebhook} variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Obter Configurações do Webhook
            </Button>

            {webhookUrl && (
              <div className="space-y-3">
                <div>
                  <Label>Webhook URL</Label>
                  <Input value={webhookUrl} readOnly className="font-mono text-xs" />
                </div>
                
                <div>
                  <Label>Verify Token</Label>
                  <Input value="agendmed_webhook_token" readOnly className="font-mono text-xs" />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📋 Configure estes valores no Meta Business Manager
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens Enviadas</CardTitle>
        </CardHeader>
        <CardContent>
          {messageHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma mensagem enviada ainda</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messageHistory.map((msg) => (
                <div key={msg.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">
                      {msg.phone.replace('@s.whatsapp.net', '')}
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {msg.provider}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {msg.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vantagens */}
      <Card>
        <CardHeader>
          <CardTitle>Por que WhatsApp Business API?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Oficial</h3>
              <p className="text-sm text-gray-600">
                API oficial do Meta, totalmente compatível com políticas WhatsApp
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Funciona no Vercel</h3>
              <p className="text-sm text-gray-600">
                Perfeito para ambiente serverless, sem limitações
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Escalável</h3>
              <p className="text-sm text-gray-600">
                Suporta milhares de mensagens por minuto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}