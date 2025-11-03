"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface WhatsAppStatus {
  connected: boolean
  qrCode?: string | null
  phone?: string | null
  name?: string | null
}

export default function WhatsAppPage() {
  const [status, setStatus] = useState<WhatsAppStatus>({ connected: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkWhatsAppStatus()
    
    const interval = setInterval(() => {
      if (status.qrCode || loading) {
        checkWhatsAppStatus()
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [status.qrCode, loading])

  const checkWhatsAppStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }

  const connectWhatsApp = async () => {
    setLoading(true)
    toast.loading('Gerando QR Code...')
    
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus({
          connected: false,
          qrCode: data.qrCode || null,
          phone: null
        })
        
        toast.dismiss()
        toast.success('QR Code gerado! Escaneie com seu WhatsApp')
        
      } else {
        toast.dismiss()
        
        // Verificar se é erro do Vercel
        if (response.status === 501) {
          toast.error('WhatsApp não suportado no Vercel', {
            description: 'Use um servidor dedicado para WhatsApp Web.js'
          })
          
          // Mostrar alternativas
          console.log('Alternativas:', data.alternatives)
        } else {
          toast.error(data.error || 'Erro ao gerar QR Code', {
            description: data.details || 'Tente novamente'
          })
        }
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Erro ao conectar WhatsApp', {
        description: 'Verifique sua conexão e tente novamente'
      })
    } finally {
      setLoading(false)
    }
  }

  const disconnectWhatsApp = async () => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST'
      })

      if (response.ok) {
        setStatus({ connected: false })
        toast.success('WhatsApp desconectado')
      }
    } catch (error) {
      toast.error('Erro ao desconectar')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp</h1>
          <p className="text-muted-foreground">
            Conecte seu WhatsApp para atendimento automático
          </p>
        </div>
        
        <Badge variant={status.connected ? "default" : "secondary"} className="text-sm">
          {status.connected ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Conectado
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-1" />
              Desconectado
            </>
          )}
        </Badge>
      </div>

      {/* Mensagem de Sucesso quando Conectado */}
      {status.connected && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">WhatsApp Conectado!</h3>
                <p className="text-green-700">
                  {status.name && `Conectado como: ${status.name}`}
                  {status.phone && ` (${status.phone})`}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Seu bot está ativo e pronto para atender clientes
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={disconnectWhatsApp} variant="outline" size="sm">
                Desconectar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles */}
        {!status.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Conectar WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Gere um QR Code para conectar seu WhatsApp
              </p>

              <Button 
                onClick={connectWhatsApp} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando QR Code...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* QR Code */}
        {status.qrCode && !status.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Escaneie o QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border text-center">
                  <img 
                    src={status.qrCode} 
                    alt="QR Code WhatsApp" 
                    className="w-full max-w-sm mx-auto"
                    onError={() => {
                      toast.error('Erro ao carregar QR Code')
                    }}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Como conectar:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Vá em Menu → Dispositivos conectados</li>
                    <li>Toque em "Conectar um dispositivo"</li>
                    <li>Escaneie o QR Code acima</li>
                  </ol>
                </div>

                <Button 
                  onClick={connectWhatsApp} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar Novo QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-muted-foreground">Gerando QR Code...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}