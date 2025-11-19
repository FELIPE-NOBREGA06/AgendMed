'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatbotTestPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Digite "menu" para começar.',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('5511999999999')

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/whatsapp/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          from: phoneNumber
        })
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        toast.error('Erro ao processar mensagem')
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🤖 Teste do Chatbot</h1>
        <p className="text-gray-600">
          Chatbot compatível com Vercel - Stateless e baseado em webhooks
        </p>
      </div>

      {/* Configuração */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">📱 Número de Teste</h3>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="5511999999999"
          className="max-w-xs"
        />
      </div>

      {/* Chat */}
      <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <h2 className="font-semibold">AgendMed Bot</h2>
          <p className="text-sm opacity-90">Online</p>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>

      {/* Atalhos */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => setInput('menu')}
          className="w-full"
        >
          📋 Menu
        </Button>
        <Button
          variant="outline"
          onClick={() => setInput('1')}
          className="w-full"
        >
          📅 Agendar
        </Button>
        <Button
          variant="outline"
          onClick={() => setInput('2')}
          className="w-full"
        >
          🔍 Consultar
        </Button>
        <Button
          variant="outline"
          onClick={() => setInput('3')}
          className="w-full"
        >
          ❌ Cancelar
        </Button>
        <Button
          variant="outline"
          onClick={() => setInput('4')}
          className="w-full"
        >
          🏥 Especialidades
        </Button>
        <Button
          variant="outline"
          onClick={() => setInput('5')}
          className="w-full"
        >
          👤 Atendente
        </Button>
      </div>

      {/* Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">ℹ️ Informações</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>✅ Compatível com Vercel (serverless)</li>
          <li>✅ Stateless - não mantém sessão</li>
          <li>✅ Baseado em webhooks</li>
          <li>✅ Suporta WhatsApp Business API, Twilio ou Baileys</li>
        </ul>
      </div>
    </div>
  )
}
