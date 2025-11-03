export default function TestAuth() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Configuração OAuth</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Variáveis de Ambiente:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>AUTH_GOOGLE_ID: {process.env.AUTH_GOOGLE_ID ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>AUTH_GOOGLE_SECRET: {process.env.AUTH_GOOGLE_SECRET ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>AUTH_SECRET: {process.env.AUTH_SECRET ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Não configurado'}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">URLs de Callback Esperadas:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Desenvolvimento: http://localhost:3000/api/auth/callback/google</li>
            <li>Produção: https://seu-dominio.vercel.app/api/auth/callback/google</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Próximos Passos:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Verifique se as URLs de callback estão configuradas no Google Console</li>
            <li>Certifique-se de que o domínio está autorizado</li>
            <li>Verifique se a tela de consentimento OAuth está configurada</li>
            <li>Teste novamente o login com Google</li>
          </ol>
        </div>
      </div>
    </div>
  )
}