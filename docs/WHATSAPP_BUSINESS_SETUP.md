# 📱 WhatsApp Business API - Setup Completo

## 🎯 WhatsApp REAL no Vercel

Esta é a solução oficial para usar WhatsApp **de verdade** no Vercel usando a WhatsApp Business API.

## 🚀 Passo a Passo Completo

### 1. **Criar Conta Meta Business**
1. Acesse: https://business.facebook.com/
2. Crie uma conta business (gratuito)
3. Verifique sua empresa

### 2. **Configurar WhatsApp Business API**
1. No Meta Business Manager, vá em **"WhatsApp"**
2. Clique em **"Começar"**
3. Adicione um número de telefone
4. Verifique o número via SMS

### 3. **Obter Credenciais**
1. Vá em **WhatsApp > Configuração da API**
2. Copie o **Phone Number ID**
3. Gere um **Token de Acesso**
4. Anote o **App ID**

### 4. **Configurar Variáveis no Vercel**
No painel do Vercel, adicione:

```env
WHATSAPP_BUSINESS_TOKEN=seu_token_de_acesso_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token
```

### 5. **Configurar Webhook**
1. No Meta Business Manager, vá em **WhatsApp > Configuração**
2. Configure o Webhook:
   - **URL**: `https://agend-med-pi.vercel.app/api/whatsapp/webhook`
   - **Verify Token**: `agendmed_webhook_token`
3. Ative os eventos:
   - `messages`
   - `message_deliveries`
   - `message_reads`

### 6. **Testar Configuração**
1. Acesse: `https://agend-med-pi.vercel.app/dashboard/whatsapp/business`
2. Teste envio de mensagem
3. Envie mensagem para seu número WhatsApp Business
4. Verifique se recebe resposta automática

## 📋 Checklist de Configuração

- [ ] Conta Meta Business criada
- [ ] Número WhatsApp verificado
- [ ] Phone Number ID obtido
- [ ] Token de acesso gerado
- [ ] Variáveis configuradas no Vercel
- [ ] Webhook configurado
- [ ] Teste de envio funcionando
- [ ] Resposta automática ativa

## 🔧 APIs Disponíveis

### Enviar Mensagem
```javascript
POST /api/whatsapp/business
{
  "action": "send-message",
  "phone": "5511999999999",
  "message": "Olá! Sua consulta foi agendada."
}
```

### Configurar Webhook
```javascript
POST /api/whatsapp/business
{
  "action": "webhook-setup"
}
```

### Receber Mensagens
```javascript
// Webhook automático em /api/whatsapp/webhook
// Respostas automáticas configuradas
```

## 💰 Custos

### WhatsApp Business API:
- **Gratuito**: 1.000 conversas/mês
- **Pago**: $0.005 - $0.09 por conversa
- **Sem taxa de setup**

### Vercel:
- **Hobby**: Gratuito (suficiente para testes)
- **Pro**: $20/mês (recomendado para produção)

## 🎯 Funcionalidades Reais

### ✅ O que funciona:
- **Envio real de mensagens** via API oficial
- **Recebimento de mensagens** via webhook
- **Respostas automáticas** configuráveis
- **Status de entrega** em tempo real
- **Mídia** (imagens, documentos, áudio)
- **Botões interativos** e listas
- **Templates aprovados** pelo WhatsApp

### ❌ Limitações:
- Precisa de aprovação para templates
- Número deve ser business verificado
- Limite de 24h para responder mensagens não solicitadas

## 🚀 Vantagens vs WhatsApp Web.js

| Recurso | WhatsApp Web.js | Business API |
|---------|----------------|--------------|
| **Vercel** | ❌ Não funciona | ✅ Funciona perfeitamente |
| **Oficial** | ❌ Não oficial | ✅ API oficial Meta |
| **Estabilidade** | ❌ Pode quebrar | ✅ Estável e confiável |
| **Escalabilidade** | ❌ Limitada | ✅ Ilimitada |
| **Suporte** | ❌ Comunidade | ✅ Suporte oficial |
| **Compliance** | ❌ Risco | ✅ 100% compliant |

## 🎉 Resultado Final

Com esta configuração você terá:
- ✅ **WhatsApp 100% real** funcionando no Vercel
- ✅ **Envio e recebimento** de mensagens
- ✅ **Respostas automáticas** inteligentes
- ✅ **Interface completa** de gerenciamento
- ✅ **Escalabilidade** para milhares de mensagens
- ✅ **Conformidade** com políticas WhatsApp

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no Vercel
2. Teste as APIs individualmente
3. Consulte a documentação oficial: https://developers.facebook.com/docs/whatsapp
4. Entre em contato com suporte Meta Business