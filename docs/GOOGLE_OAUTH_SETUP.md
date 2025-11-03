# Configuração do Google OAuth

## Problema Atual
Erro de configuração ao tentar fazer login com Google.

## Solução: Configurar Google Console

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Selecione seu projeto ou crie um novo

### 2. Ativar a API do Google+
- No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
- Procure por "Google+ API" e ative
- Procure por "Google Identity" e ative

### 3. Configurar OAuth 2.0
- Vá em "APIs e Serviços" > "Credenciais"
- Clique em "Criar Credenciais" > "ID do cliente OAuth 2.0"

### 4. Configurar URLs Autorizadas

#### Para Desenvolvimento (localhost):
```
Origens JavaScript autorizadas:
- http://localhost:3000

URIs de redirecionamento autorizados:
- http://localhost:3000/api/auth/callback/google
```

#### Para Produção (Vercel):
```
Origens JavaScript autorizadas:
- https://seu-dominio.vercel.app

URIs de redirecionamento autorizados:
- https://seu-dominio.vercel.app/api/auth/callback/google
```

### 5. Configurar Tela de Consentimento OAuth
- Vá em "APIs e Serviços" > "Tela de consentimento OAuth"
- Escolha "Externo" se for para usuários públicos
- Preencha as informações obrigatórias:
  - Nome do aplicativo: "AgendMed"
  - Email de suporte do usuário: seu-email@gmail.com
  - Domínio autorizado: seu-dominio.vercel.app (para produção)

### 6. Adicionar Escopos Necessários
```
- email
- profile
- openid
```

### 7. Verificar Variáveis de Ambiente
Certifique-se de que as variáveis estão corretas no .env:
```
AUTH_GOOGLE_ID=seu-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=seu-client-secret
```

### 8. URLs de Callback Corretas
- Desenvolvimento: `http://localhost:3000/api/auth/callback/google`
- Produção: `https://seu-dominio.vercel.app/api/auth/callback/google`

## Teste
Após configurar, teste o login com Google novamente.