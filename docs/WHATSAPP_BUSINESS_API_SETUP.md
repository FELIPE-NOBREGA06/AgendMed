# 📱 Configurar WhatsApp Business API - Guia Completo

## 🎯 Visão Geral

A WhatsApp Business API (Meta) é a solução oficial e recomendada para integração com WhatsApp em produção. É totalmente compatível com Vercel e ambientes serverless.

## ✅ Vantagens

- ✅ **Oficial do WhatsApp** - Suportado pela Meta
- ✅ **Compatível com Vercel** - Funciona em serverless
- ✅ **Escalável** - Suporta milhares de mensagens
- ✅ **Confiável** - 99.9% de uptime
- ✅ **Recursos avançados** - Templates, mídia, botões
- ✅ **Sem QR Code** - Configuração via painel

## 📋 Pré-requisitos

1. **Conta Facebook Business** (gratuita)
2. **Número de telefone** dedicado (não pode estar em uso no WhatsApp)
3. **Cartão de crédito** (para verificação, mas há plano gratuito)
4. **Domínio próprio** (para webhook)

## 🚀 Passo a Passo

### 1. Criar Conta Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Clique em **"Começar"** ou **"Get Started"**
3. Faça login com sua conta Facebook
4. Aceite os termos de uso

### 2. Criar um App

1. No painel, clique em **"Meus Apps"** → **"Criar App"**
2. Selecione **"Empresa"** como tipo de app
3. Preencha:
   - **Nome do app**: AgendMed Bot
   - **Email de contato**: seu@email.com
   - **Conta comercial**: Criar nova ou selecionar existente
4. Clique em **"Criar App"**

### 3. Adicionar WhatsApp ao App

1. No painel do app, procure por **"WhatsApp"**
2. Clique em **"Configurar"** ou **"Set up"**
3. Selecione ou crie uma **Conta Comercial do WhatsApp**

### 4. Configurar Número de Telefone

#### Opção A: Usar Número de Teste (Recomendado para começar)

1. A Meta fornece um número de teste automaticamente
2. Você pode enviar mensagens para até 5 números verificados
3. **Adicionar números de teste:**
   - Vá em **"API Setup"** → **"To"**
   - Clique em **"Add phone number"**
   - Digite o número com código do país (ex: +5511999999999)
   - Você receberá um código via WhatsApp
   - Digite o código para verificar

#### Opção B: Usar Seu Próprio Número (Produção)

1. Vá em **"Phone Numbers"** → **"Add phone number"**
2. Digite seu número (não pode estar em uso no WhatsApp)
3. Escolha método de verificação (SMS ou chamada)
4. Digite o código recebido
5. Aguarde aprovação (pode levar algumas horas)

### 5. Obter Credenciais

#### 5.1. Phone Number ID

1. Vá em **"API Setup"**
2. Copie o **"Phone number ID"** (número longo)
3. Exemplo: `123456789012345`

#### 5.2. Access Token (Temporário)

1. Na mesma página, copie o **"Temporary access token"**
2. ⚠️ **Importante**: Este token expira em 24 horas
3. Exemplo: `EAAxxxxxxxxxxxxx`

#### 5.3. Access Token (Permanente)

Para produção, você precisa de um token permanente:

1. Vá em **"Configurações"** → **"Básico"**
2. Copie o **"ID do App"** e **"Chave Secreta do App"**
3. Vá em **"Ferramentas"** → **"Tokens de Acesso"**
4. Selecione sua página/conta comercial
5. Gere um token com permissões:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Copie e guarde em local seguro

### 6. Configurar Webhook

#### 6.1. Deploy no Vercel (se ainda não fez)

```bash
# No seu projeto
git add .
git commit -m "Add WhatsApp Business API"
git push

# Ou use Vercel CLI
vercel --prod
```

Anote sua URL: `https://seu-app.vercel.app`

#### 6.2. Configurar Webhook no Meta

1. No painel do app, vá em **"WhatsApp"** → **"Configuration"**
2. Clique em **"Edit"** na seção Webhook
3. Preencha:
   - **Callback URL**: `https://seu-app.vercel.app/api/whatsapp/chatbot`
   - **Verify Token**: Crie um token secreto (ex: `meu_token_super_secreto_123`)
4. Clique em **"Verify and Save"**

#### 6.3. Inscrever em Eventos

1. Após salvar o webhook, role para baixo
2. Clique em **"Manage"** em Webhook Fields
3. Marque as opções:
   - ✅ **messages** (mensagens recebidas)
   - ✅ **message_status** (status de entrega)
4. Clique em **"Save"**

### 7. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# WhatsApp Business API (Meta)
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_TOKEN=EAAxxxxxxxxxxxxx
WEBHOOK_VERIFY_TOKEN=meu_token_super_secreto_123

# Opcional: Para tokens permanentes
WHATSAPP_APP_ID=seu_app_id
WHATSAPP_APP_SECRET=sua_app_secret
```

No **Vercel Dashboard**:
1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável
3. Clique em **Save**
4. Faça redeploy: `vercel --prod`

### 8. Testar a Integração

#### 8.1. Testar Webhook

```bash
# Teste se o webhook está respondendo
curl "https://seu-app.vercel.app/api/whatsapp/chatbot?hub.mode=subscribe&hub.verify_token=meu_token_super_secreto_123&hub.challenge=teste123"

# Deve retornar: teste123
```

#### 8.2. Enviar Mensagem de Teste

```bash
curl -X POST https://seu-app.vercel.app/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "message": "Olá! Esta é uma mensagem de teste do AgendMed."
  }'
```

#### 8.3. Testar Recebimento

1. Envie uma mensagem do WhatsApp para o número configurado
2. Digite: **"oi"**
3. Você deve receber o menu do chatbot

### 9. Verificar Logs

#### No Vercel:
```bash
vercel logs --follow
```

#### No Meta Dashboard:
1. Vá em **"WhatsApp"** → **"Insights"**
2. Veja mensagens enviadas/recebidas
3. Verifique erros

## 🎨 Personalizar Mensagens

### Mensagem Simples

```typescript
// src/app/api/whatsapp/send/route.ts
const response = await fetch(
  `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: '5511999999999',
      type: 'text',
      text: { body: 'Olá! Como posso ajudar?' }
    })
  }
)
```

### Mensagem com Botões

```typescript
body: JSON.stringify({
  messaging_product: 'whatsapp',
  to: '5511999999999',
  type: 'interactive',
  interactive: {
    type: 'button',
    body: {
      text: 'Escolha uma opção:'
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'agendar',
            title: 'Agendar'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'consultar',
            title: 'Consultar'
          }
        }
      ]
    }
  }
})
```

### Mensagem com Lista

```typescript
body: JSON.stringify({
  messaging_product: 'whatsapp',
  to: '5511999999999',
  type: 'interactive',
  interactive: {
    type: 'list',
    body: {
      text: 'Especialidades disponíveis:'
    },
    action: {
      button: 'Ver opções',
      sections: [
        {
          title: 'Especialidades',
          rows: [
            { id: 'cardio', title: 'Cardiologia' },
            { id: 'dermato', title: 'Dermatologia' },
            { id: 'ortopedia', title: 'Ortopedia' }
          ]
        }
      ]
    }
  }
})
```

### Enviar Imagem

```typescript
body: JSON.stringify({
  messaging_product: 'whatsapp',
  to: '5511999999999',
  type: 'image',
  image: {
    link: 'https://seu-dominio.com/imagem.jpg',
    caption: 'Sua consulta foi agendada!'
  }
})
```

## 💰 Custos

### Plano Gratuito
- **1.000 conversas/mês** grátis
- Conversas iniciadas pelo usuário são gratuitas (primeiras 24h)
- Ideal para começar e testar

### Planos Pagos
- Após 1.000 conversas: ~$0.005 - $0.09 por conversa
- Varia por país
- Conversas iniciadas pelo negócio são cobradas
- Templates aprovados têm custo menor

### Dicas para Economizar
- ✅ Responda dentro de 24h (janela gratuita)
- ✅ Use templates aprovados
- ✅ Evite mensagens desnecessárias
- ✅ Agrupe informações em uma mensagem

## 🔒 Segurança

### Proteger Tokens

```typescript
// Nunca exponha tokens no frontend
// Use apenas em API routes (server-side)

// ❌ ERRADO
const token = 'EAAxxxxx' // hardcoded

// ✅ CORRETO
const token = process.env.WHATSAPP_BUSINESS_TOKEN
```

### Validar Webhook

```typescript
// Sempre valide o verify token
const verifyToken = searchParams.get('hub.verify_token')
if (verifyToken !== process.env.WEBHOOK_VERIFY_TOKEN) {
  return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
}
```

### Rate Limiting

```typescript
// Implemente rate limiting para evitar spam
const rateLimiter = new Map()

function checkRateLimit(phone: string): boolean {
  const now = Date.now()
  const lastMessage = rateLimiter.get(phone) || 0
  
  if (now - lastMessage < 1000) { // 1 segundo entre mensagens
    return false
  }
  
  rateLimiter.set(phone, now)
  return true
}
```

## 📊 Monitoramento

### Métricas Importantes

1. **Taxa de entrega** - Mensagens entregues vs enviadas
2. **Taxa de leitura** - Mensagens lidas vs entregues
3. **Tempo de resposta** - Quanto tempo para responder
4. **Taxa de conversão** - Agendamentos vs conversas

### Implementar Analytics

```typescript
// src/lib/analytics.ts
export async function trackMessage(data: {
  phone: string
  type: 'sent' | 'received'
  message: string
}) {
  // Salvar no banco de dados
  await prisma.messageLog.create({
    data: {
      ...data,
      timestamp: new Date()
    }
  })
}
```

## 🆘 Troubleshooting

### Erro: "Invalid phone number"
- ✅ Use formato internacional: +5511999999999
- ✅ Remova espaços e caracteres especiais
- ✅ Verifique se o número está registrado (modo teste)

### Erro: "Message not sent"
- ✅ Verifique se o token está válido
- ✅ Confirme que o número está verificado
- ✅ Veja logs no Meta Dashboard

### Webhook não recebe mensagens
- ✅ Verifique URL do webhook (https)
- ✅ Confirme verify token
- ✅ Veja logs: `vercel logs`
- ✅ Teste manualmente com curl

### Token expirado
- ✅ Gere um token permanente
- ✅ Use System User Token
- ✅ Configure renovação automática

## 📚 Recursos Úteis

- [Documentação Oficial](https://developers.facebook.com/docs/whatsapp)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Webhooks Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## 🎉 Pronto!

Sua WhatsApp Business API está configurada! 🚀

**Próximos passos:**
1. Teste enviando mensagens
2. Configure templates personalizados
3. Implemente analytics
4. Solicite aprovação para produção

**Precisa de ajuda?**
- Consulte a documentação completa
- Veja exemplos em `/docs/CHATBOT_VERCEL.md`
- Teste a interface em `/dashboard/whatsapp/chatbot`
