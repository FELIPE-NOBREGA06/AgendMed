"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OAuthDebug() {
  const checkOAuthConfig = () => {
    const config = {
      githubId: process.env.NEXT_PUBLIC_GITHUB_ID ? '✅ Configurado' : '❌ Não configurado',
      googleId: process.env.NEXT_PUBLIC_GOOGLE_ID ? '✅ Configurado' : '❌ Não configurado',
      authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET ? '✅ Configurado' : '❌ Não configurado',
      baseUrl: window.location.origin,
      callbackUrls: {
        github: `${window.location.origin}/api/auth/callback/github`,
        google: `${window.location.origin}/api/auth/callback/google`,
      }
    }
    
    console.log('🔍 Configuração OAuth:', config)
    alert(`Configuração OAuth:\n\nGitHub ID: ${config.githubId}\nGoogle ID: ${config.googleId}\n\nURLs de Callback:\nGitHub: ${config.callbackUrls.github}\nGoogle: ${config.callbackUrls.google}`)
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800">🔧 Debug OAuth</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-700 mb-3">
          Use este botão para verificar as configurações OAuth e obter as URLs de callback.
        </p>
        <Button 
          onClick={checkOAuthConfig}
          variant="outline"
          className="border-blue-300 text-blue-800 hover:bg-blue-100"
        >
          Verificar OAuth
        </Button>
      </CardContent>
    </Card>
  )
}