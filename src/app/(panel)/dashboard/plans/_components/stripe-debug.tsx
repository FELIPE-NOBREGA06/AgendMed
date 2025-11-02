"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StripeDebug() {
  const checkStripeConfig = () => {
    const config = {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ? '✅ Configurada' : '❌ Não configurada',
      basicPlan: process.env.STRIPE_PLAN_BASIC ? '✅ Configurada' : '❌ Não configurada',
      professionalPlan: process.env.STRIPE_PLAN_PROFISSIONAL ? '✅ Configurada' : '❌ Não configurada',
    }
    
    console.log('🔍 Configuração do Stripe:', config)
    alert(`Configuração do Stripe:\n\nChave Pública: ${config.publicKey}\nPlano Básico: ${config.basicPlan}\nPlano Profissional: ${config.professionalPlan}`)
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">🔧 Debug do Stripe</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700 mb-3">
          Use este botão para verificar se as variáveis de ambiente estão configuradas corretamente.
        </p>
        <Button 
          onClick={checkStripeConfig}
          variant="outline"
          className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
        >
          Verificar Configuração
        </Button>
      </CardContent>
    </Card>
  )
}