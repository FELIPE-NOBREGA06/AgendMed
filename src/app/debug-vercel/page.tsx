export default function DebugVercel() {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'Server Side'
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Vercel - Google OAuth</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold text-blue-800 mb-2">URL Atual:</h2>
          <p className="text-blue-700 font-mono">{currentUrl}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold text-yellow-800 mb-2">Variáveis de Ambiente (Server Side):</h2>
          <ul className="space-y-1 text-yellow-700">
            <li>AUTH_GOOGLE_ID: {process.env.AUTH_GOOGLE_ID ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>AUTH_GOOGLE_SECRET: {process.env.AUTH_GOOGLE_SECRET ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>AUTH_SECRET: {process.env.AUTH_SECRET ? '✅ Configurado' : '❌ Não configurado'}</li>
            <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || '❌ Não configurado'}</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold text-green-800 mb-2">URLs que devem estar no Google Console:</h2>
          <div className="text-green-700 space-y-2">
            <div>
              <strong>Origens JavaScript autorizadas:</strong>
              <ul className="list-disc list-inside ml-4 font-mono text-sm">
                <li>http://localhost:3000</li>
                <li>https://agend-med-pi.vercel.app</li>
              </ul>
            </div>
            <div>
              <strong>URLs de redirecionamento:</strong>
              <ul className="list-disc list-inside ml-4 font-mono text-sm">
                <li>http://localhost:3000/api/auth/callback/google</li>
                <li>https://agend-med-pi.vercel.app/api/auth/callback/google</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-semibold text-red-800 mb-2">Checklist para Vercel:</h2>
          <ol className="list-decimal list-inside space-y-1 text-red-700">
            <li>Variáveis de ambiente configuradas no painel Vercel</li>
            <li>URLs corretas no Google Console</li>
            <li>Tela de consentimento OAuth publicada</li>
            <li>Deploy realizado após configurar variáveis</li>
          </ol>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold text-gray-800 mb-2">Como configurar no Vercel:</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
            <li>Acesse o painel do Vercel</li>
            <li>Vá em Settings → Environment Variables</li>
            <li>Adicione cada variável de ambiente</li>
            <li>Faça um novo deploy</li>
          </ol>
        </div>
      </div>
    </div>
  )
}