"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'

export default function WhatsAppTestPage() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messageHistory, setMessageHistory] = useState<any[]>([])

  const sendMessage = async () => {
    if (!phone || !message) {
      toast.error('Preencha telefone e mensagem')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Mensagem enviada com sucesso!')
        
        // Adicionar ao histórico
        setMessageHistory(prev => [...prev, {
          id: data.messageId,
          phone: data.phone,
          message: message,
          timestamp: data.timestamp,
          status: 'sent'
        }])
        
        // Limpar formulário
        setMessage('')
        
      } else {
        toast.error(data.error || 'Erro ao enviar mensagem')
      }

    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">Teste WhatsApp</h1>
          <p className="text-muted-foreground">
            Envie mensagens de teste via WhatsApp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Envio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefone (com DDD)</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="ml-1 text-sm text-gray-600">+55</span>
                </div>
                <Input
                  id="phone"
                  placeholder="11999999999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Exemplo: 11999999999 (DDD + número)
              </p>
            </div>

            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={sendMessage} 
              disabled={loading || !phone || !message}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Este é um teste funcional. 
                No Vercel, as mensagens são simuladas para demonstração.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Mensagens */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Mensagens</CardTitle>
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
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        {msg.status}
                      </span>
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
      </div>

      {/* Informações */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Digite o Telefone</h3>
              <p className="text-sm text-gray-600">
                Informe o número com DDD (ex: 11999999999)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Escreva a Mensagem</h3>
              <p className="text-sm text-gray-600">
                Digite o texto que deseja enviar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Envie</h3>
              <p className="text-sm text-gray-600">
                Clique em enviar e acompanhe o status
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}