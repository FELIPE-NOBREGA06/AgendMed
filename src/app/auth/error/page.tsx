'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Erro de Configuração',
          message: 'Há um problema na configuração do sistema de autenticação.',
          suggestion: 'Entre em contato com o suporte técnico.'
        }
      case 'AccessDenied':
        return {
          title: 'Acesso Negado',
          message: 'Você não tem permissão para acessar este sistema.',
          suggestion: 'Verifique se está usando a conta correta.'
        }
      case 'Verification':
        return {
          title: 'Erro de Verificação',
          message: 'Não foi possível verificar sua identidade.',
          suggestion: 'Tente fazer login novamente.'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Conta Não Vinculada',
          message: 'Esta conta já está associada a outro método de login.',
          suggestion: 'Tente usar o método de login original ou entre em contato com o suporte.'
        }
      default:
        return {
          title: 'Erro de Autenticação',
          message: 'Ocorreu um erro durante o processo de login.',
          suggestion: 'Tente novamente ou use outro método de login.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {errorInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {errorInfo.message}
            </p>
            <p className="text-sm text-gray-500">
              {errorInfo.suggestion}
            </p>
          </div>

          {error && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">
                Código do erro: <code className="bg-gray-200 px-1 rounded">{error}</code>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Precisa de ajuda? Entre em contato com o{' '}
              <a href="mailto:suporte@agendmed.com" className="text-blue-600 hover:underline">
                suporte técnico
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}