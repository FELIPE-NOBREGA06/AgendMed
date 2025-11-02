"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OAuthDebug() {
  const checkOAuthConfig = () => {
    const baseUrl = window.location.origin
    const isProduction = baseUrl.includes('vercel.app') || baseUrl.includes('agend-med')
    
    const config = {
      environment: isProduction ? '🌐 Produção' : '🔧 Desenvolvimento',
      baseUrl: baseUrl,
      callbackUrls: {
        github: `${baseUrl}/api/auth/callback/github`,
        google: `${baseUrl}/api/auth/callback/google`,
      }
    }
    
    console.log('🔍 Configuração OAuth:', config)
    
    const message = `🔍 Debug OAuth - ${config.environment}

🌐 Domínio Atual: ${config.baseUrl}

📋 COPIE ESTAS URLs EXATAS para os provedores:

🐙 GitHub (Authorization callback URL):
${config.callbackUrls.github}

🔍 Google (Authorized redirect URIs):
${config.callbackUrls.google}

${isProduction ? 
  '⚠️ PRODUÇÃO: Cole estas URLs EXATAMENTE como mostrado!' : 
  '💡 DESENVOLVIMENTO: Adicione também as URLs de produção.'
}

🔧 Passos:
1. Google: console.cloud.google.com → APIs & Services → Credentials
2. GitHub: github.com/settings/developers
3. Cole a URL exata mostrada acima
4. Salve e aguarde alguns minutos`
    
    alert(message)
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