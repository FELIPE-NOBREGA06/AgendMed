"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  Phone,
  Key,
  Webhook,
  MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function WhatsAppSetupPage() {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para área de transferência!')
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const testConfiguration = async () => {
    try {
      const response = await fetch('/api/whatsapp/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send-message',
          phone: phoneNumber,
          message: 'Teste de configuração WhatsApp Business - AgendMed'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Configuração testada com sucesso!')
        setIsConfigured(true)
      } else {
        toast.error('Erro na configuração: ' + data.error)
      }

    } catch (error) {
      toast.error('Erro ao testar configuração')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Configuração WhatsApp Business</h1>
          <p className="text-muted-foreground">
            Vou configurar seu WhatsApp Business API em 5 passos simples
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < 5 && (
              <div className={`w-12 h-1 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Meta Business Account */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Passo 1: Criar Conta Meta Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Primeiro, você precisa de uma conta Meta Business (gratuita):</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">O que fazer:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse business.facebook.com</li>
                <li>Clique em "Criar conta"</li>
                <li>Preencha dados da empresa: "AgendMed"</li>
                <li>Verifique via email/SMS</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="default">
                <a href="https://business.facebook.com/" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Meta Business
                </a>
              </Button>
              <Button onClick={nextStep} variant="outline">
                Já tenho conta, próximo passo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: WhatsApp Business Setup */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Passo 2: Configurar WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Agora vamos adicionar seu número WhatsApp:</p>
            
            <div>
              <Label htmlFor="phone">Seu número WhatsApp (com DDD)</Label>
              <Input
                id="phone"
                placeholder="11999999999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Instruções:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse: business.facebook.com/wa/manage/phone-numbers/</li>
                <li>Clique em "Adicionar número de telefone"</li>
                <li>Escolha "Usar meu próprio número"</li>
                <li>Digite: {phoneNumber || 'seu número'}</li>
                <li>Verifique via SMS</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="default">
                <a href="https://business.facebook.com/wa/manage/phone-numbers/" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configurar WhatsApp
                </a>
              </Button>
              <Button onClick={nextStep} variant="outline" disabled={!phoneNumber}>
                Número verificado, próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Get Credentials */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Passo 3: Obter Credenciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Agora vamos obter as credenciais da API:</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone-id">Phone Number ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-id"
                    placeholder="123456789012345"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(phoneNumberId)}
                    disabled={!phoneNumberId}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="token">Access Token</Label>
                <div className="flex gap-2">
                  <Input
                    id="token"
                    placeholder="EAAxxxxxxxxxxxxx"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(accessToken)}
                    disabled={!accessToken}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Como obter:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse: business.facebook.com/wa/manage/phone-numbers/</li>
                <li>Clique no seu número: {phoneNumber}</li>
                <li>Vá na aba "Configuração da API"</li>
                <li>Copie o "Phone Number ID"</li>
                <li>Clique em "Gerar token de acesso"</li>
                <li>Copie o token gerado</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="default">
                <a href="https://business.facebook.com/wa/manage/phone-numbers/" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Obter Credenciais
                </a>
              </Button>
              <Button 
                onClick={nextStep} 
                variant="outline" 
                disabled={!phoneNumberId || !accessToken}
              >
                Credenciais obtidas, próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Vercel Configuration */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Passo 4: Configurar no Vercel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Configure estas variáveis no Vercel:</p>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span>WHATSAPP_BUSINESS_TOKEN={accessToken}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`WHATSAPP_BUSINESS_TOKEN=${accessToken}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span>WHATSAPP_PHONE_NUMBER_ID={phoneNumberId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`WHATSAPP_PHONE_NUMBER_ID=${phoneNumberId}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span>WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span>NEXT_PUBLIC_WHATSAPP_CONFIGURED=true</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('NEXT_PUBLIC_WHATSAPP_CONFIGURED=true')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Como configurar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse: vercel.com/dashboard</li>
                <li>Selecione projeto: agend-med-pi</li>
                <li>Vá em Settings → Environment Variables</li>
                <li>Adicione cada variável acima</li>
                <li>Aguarde deploy automático</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="default">
                <a href="https://vercel.com/dashboard" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Vercel
                </a>
              </Button>
              <Button onClick={nextStep} variant="outline">
                Variáveis configuradas, próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Test Configuration */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Passo 5: Testar Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Vamos testar se tudo está funcionando:</p>

            <div className="space-y-4">
              <Button onClick={testConfiguration} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Testar Envio de Mensagem
              </Button>

              {isConfigured && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Configuração Concluída!</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    Seu WhatsApp Business API está funcionando perfeitamente!
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <a href="/dashboard/whatsapp/business">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ir para Dashboard WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Configurar Webhook (Opcional):</h4>
              <p className="text-sm mb-2">Para receber mensagens automaticamente:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>URL: https://agend-med-pi.vercel.app/api/whatsapp/webhook</li>
                <li>Verify Token: agendmed_webhook_token</li>
                <li>Eventos: messages, message_deliveries</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}