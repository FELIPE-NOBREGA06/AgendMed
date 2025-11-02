"use client"

import { Button } from "@/components/ui/button"
import { Plan } from "@prisma/client"
import { createSubscription } from '../_actions/create-subscription'
import { toast } from 'sonner'
import { getStripeJs } from '@/utils/stripe-js'
import { useState } from 'react'

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateBilling() {
    try {
      setIsLoading(true)
      
      console.log('🚀 Iniciando processo de assinatura para:', type)
      
      const { sessionId, error } = await createSubscription({ type: type })

      if (error) {
        console.error('❌ Erro na criação da assinatura:', error)
        toast.error(error)
        return;
      }

      if (!sessionId) {
        console.error('❌ SessionId não retornado')
        toast.error('Erro interno: SessionId não encontrado')
        return;
      }

      console.log('✅ SessionId criado:', sessionId)
      
      const stripe = await getStripeJs();

      if (!stripe) {
        console.error('❌ Stripe não carregado')
        toast.error('Erro ao carregar Stripe. Verifique sua conexão.')
        return;
      }

      console.log('✅ Stripe carregado, redirecionando para checkout...')
      
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: sessionId })
      
      if (stripeError) {
        console.error('❌ Erro no redirecionamento:', stripeError)
        toast.error('Erro no redirecionamento: ' + stripeError.message)
      }

    } catch (error) {
      console.error('❌ Erro geral:', error)
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className={`w-full ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400"}`}
      onClick={handleCreateBilling}
      disabled={isLoading}
    >
      {isLoading ? 'Processando...' : 'Ativar assinatura'}
    </Button>
  )
}