# 🚀 Chatbot - Início Rápido

## ⚡ 5 Minutos para Começar

### 1. Teste Local (Sem configuração)

```bash
# Acesse a interface de teste
http://localhost:3000/dashboard/whatsapp/chatbot
```

Digite "menu" e comece a testar! ✅

### 2. WhatsApp Business API (Produção)

#### Passo 1: Criar Conta Meta
1. Acesse: https://developers.facebook.com/
2. Crie um app → WhatsApp → Business
3. Anote: Phone Number ID e Access Token

#### Passo 2: Configurar Variáveis
```env
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_BUSINESS_TOKEN=EAAxxxxx
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

#### Passo 3: Deploy no Vercel
```bash
git add .
git commit -m "Add chatbot"
git push
```

#### Passo 4: Configurar Webhook
No Meta Dashboard:
- URL: `https://seu-app.vercel.app/api/whatsapp/chatbot`
- Verify Token: `meu_token_secreto_123`
- Subscribe: messages, messaging_postbacks

#### Passo 5: Testar
Envie "oi" para seu número WhatsApp Business! 🎉

### 3. Twilio (Mais Rápido)

#### Passo 1: Criar Conta
1. Acesse: https://www.twilio.com/
2. Console → Messaging → Try WhatsApp
3. Siga instruções do Sandbox

#### Passo 2: Configurar
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### Passo 3: Webhook
No Twilio Console:
- When a message comes in: `https://seu-app.vercel.app/api/whatsapp/chatbot`

#### Passo 4: Testar
Envie "join [seu-codigo]" para +1 415 523 8886

## 🎯 Comandos Disponíveis

```
oi, menu          → Menu principal
1, agendar        → Agendar consulta
2, consultar      → Ver agendamentos
3, cancelar       → Cancelar agendamento
4, especialidades → Listar especialidades
5, atendente      → Falar com humano
```

## 🧪 Testar API Diretamente

```bash
# Enviar mensagem
curl -X POST http://localhost:3000/api/whatsapp/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "oi", "from": "5511999999999"}'

# Enviar WhatsApp
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"to": "5511999999999", "message": "Teste!"}'
```

## 📱 Fluxo Completo

```
1. Usuário: "oi"
   Bot: Menu com opções

2. Usuário: "1"
   Bot: Solicita especialidade

3. Usuário: "Cardiologia"
   Bot: Mostra horários disponíveis

4. Usuário: "25/11, manhã"
   Bot: Confirma agendamento
```

## 🔧 Personalizar Respostas

Edite: `src/app/api/whatsapp/chatbot/route.ts`

```typescript
// Adicionar novo comando
if (msg.includes('preço')) {
  return `💰 Valores das consultas:
  
  Consulta particular: R$ 150
  Retorno: R$ 80
  
  Aceitamos convênios!`
}
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel --prod
```

### Railway
```bash
railway up
```

### Render
```bash
# Conecte seu GitHub no dashboard
```

## 📊 Monitorar

```bash
# Logs em tempo real
vercel logs --follow

# Ou no dashboard
https://vercel.com/seu-usuario/seu-projeto/logs
```

## 🆘 Problemas Comuns

### Webhook não funciona
✅ Verifique URL (https, não http)
✅ Confirme verify token
✅ Veja logs: `vercel logs`

### Mensagens não chegam
✅ Teste API diretamente (curl)
✅ Verifique credenciais
✅ Confirme número de telefone

### Timeout
✅ Otimize código
✅ Use cache
✅ Responda em < 5 segundos

## 💡 Próximos Passos

1. ✅ Integrar com banco de dados
2. ✅ Adicionar IA (OpenAI)
3. ✅ Criar fluxos complexos
4. ✅ Analytics e métricas
5. ✅ Suporte a mídia (imagens, áudio)

## 📚 Documentação Completa

- [Guia Completo](./CHATBOT_VERCEL.md)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Twilio Docs](https://www.twilio.com/docs/whatsapp)

## 🎉 Pronto!

Seu chatbot está funcionando! 🚀

Teste agora: `/dashboard/whatsapp/chatbot`
