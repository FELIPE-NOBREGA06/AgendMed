# 📱 WhatsApp - Guia de Configuração Completo

## 🎯 Escolha sua Opção

### Opção 1: WhatsApp Business API (Recomendado) ⭐

**Melhor para:** Produção, Vercel, Escalabilidade

✅ **Vantagens:**
- Oficial do WhatsApp (Meta)
- Compatível com Vercel
- Sem QR Code
- 1.000 conversas/mês grátis
- Escalável e confiável

📚 **Guias:**
- [Guia Rápido (10 min)](./docs/WHATSAPP_BUSINESS_RAPIDO.md) ⚡
- [Guia Completo](./docs/WHATSAPP_BUSINESS_API_SETUP.md) 📖

### Opção 2: Twilio WhatsApp

**Melhor para:** Testes rápidos, Sandbox

✅ **Vantagens:**
- Configuração rápida (5 min)
- Sandbox gratuito
- Documentação excelente
- Suporte técnico

📚 **Como configurar:**
1. Crie conta: https://www.twilio.com/
2. Ative WhatsApp Sandbox
3. Configure `.env`:
```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Opção 3: Baileys (Gratuito)

**Melhor para:** Desenvolvimento, Testes locais

✅ **Vantagens:**
- Totalmente gratuito
- Sem limites de mensagens
- Controle total

⚠️ **Limitações:**
- Não funciona no Vercel
- Precisa de servidor dedicado (Railway/Render)
- Requer QR Code

📚 **Como usar:**
- Deploy no Railway: [Guia](./docs/RAILWAY_DEPLOY.md)
- Ou use localmente: `npm run dev`

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Escolha uma opção e adicione ao `.env`:

```env
# Opção 1: WhatsApp Business API (Meta)
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_BUSINESS_TOKEN=seu_access_token
WEBHOOK_VERIFY_TOKEN=seu_token_secreto

# Opção 2: Twilio
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Opção 3: Baileys (servidor externo)
BAILEYS_WEBHOOK_URL=https://seu-servidor.railway.app/send
```

### 2. Testar Configuração

```bash
# Testar WhatsApp Business API
npm run whatsapp:test

# Ou testar manualmente
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"to": "5511999999999", "message": "Teste!"}'
```

### 3. Testar Chatbot

```bash
# Iniciar servidor
npm run dev

# Acessar interface
http://localhost:3001/dashboard/whatsapp/chatbot
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   └── whatsapp/
│   │       ├── chatbot/route.ts          # Chatbot básico
│   │       ├── chatbot-advanced/route.ts # Chatbot com BD
│   │       ├── send/route.ts             # Enviar mensagens
│   │       └── webhook/route.ts          # Receber webhooks
│   └── (panel)/
│       └── dashboard/
│           └── whatsapp/
│               ├── page.tsx              # Dashboard principal
│               ├── chatbot/page.tsx      # Teste do chatbot
│               └── business/page.tsx     # Config Business API
└── lib/
    └── chatbot-handlers.ts               # Funções auxiliares

docs/
├── WHATSAPP_BUSINESS_API_SETUP.md        # Guia completo API
├── WHATSAPP_BUSINESS_RAPIDO.md           # Guia rápido
├── CHATBOT_VERCEL.md                     # Chatbot no Vercel
└── CHATBOT_QUICKSTART.md                 # Início rápido

scripts/
└── test-whatsapp-api.js                  # Script de teste
```

## 🎯 Funcionalidades

### Chatbot Básico
- ✅ Menu interativo
- ✅ 5 opções principais
- ✅ Respostas automáticas
- ✅ Stateless (sem sessão)

### Chatbot Avançado
- ✅ Fluxo de agendamento completo
- ✅ Contexto de conversa
- ✅ Validações (CPF, telefone, data)
- ✅ Integração com banco de dados

### Envio de Mensagens
- ✅ Texto simples
- ✅ Botões interativos
- ✅ Listas
- ✅ Imagens e mídia

## 💬 Comandos do Chatbot

```
oi, menu          → Menu principal
1, agendar        → Agendar consulta
2, consultar      → Ver agendamentos
3, cancelar       → Cancelar agendamento
4, especialidades → Listar especialidades
5, atendente      → Falar com humano
```

## 🧪 Testes

### Teste 1: API Direta

```bash
# Enviar mensagem
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "message": "Olá do AgendMed!"
  }'
```

### Teste 2: Chatbot

```bash
# Testar chatbot
curl -X POST http://localhost:3001/api/whatsapp/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "oi",
    "from": "5511999999999"
  }'
```

### Teste 3: Interface Visual

```
http://localhost:3001/dashboard/whatsapp/chatbot
```

### Teste 4: Script Automatizado

```bash
npm run whatsapp:test
```

## 🔧 Personalização

### Adicionar Novo Comando

Edite `src/app/api/whatsapp/chatbot/route.ts`:

```typescript
if (msg.includes('horarios')) {
  return `🕐 Horários disponíveis:
  Manhã: 08:00 - 12:00
  Tarde: 14:00 - 18:00`
}
```

### Integrar com Banco de Dados

Edite `src/lib/chatbot-handlers.ts`:

```typescript
export async function getAppointmentsByContact(contact: string) {
  const appointments = await prisma.appointment.findMany({
    where: { patientPhone: contact }
  })
  return appointments
}
```

### Adicionar IA (OpenAI)

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "Você é um assistente médico." },
    { role: "user", content: message }
  ]
})
```

## 📊 Monitoramento

### Logs do Vercel

```bash
vercel logs --follow
```

### Logs Locais

```bash
# Terminal onde o servidor está rodando
# Veja logs em tempo real
```

### Métricas

- Mensagens enviadas/recebidas
- Tempo de resposta
- Taxa de conversão
- Comandos mais usados

## 🆘 Troubleshooting

### Erro: "Invalid phone number"
```
✅ Use formato internacional: +5511999999999
✅ Remova espaços e caracteres especiais
✅ Verifique se está registrado (modo teste)
```

### Webhook não funciona
```bash
# Teste manualmente
curl "https://seu-app.vercel.app/api/whatsapp/chatbot?hub.mode=subscribe&hub.verify_token=seu_token&hub.challenge=teste"
```

### Mensagens não enviadas
```
✅ Verifique credenciais no .env
✅ Confirme número está verificado
✅ Veja logs: vercel logs
✅ Teste com script: npm run whatsapp:test
```

### Token expirado
```
✅ Gere token permanente no Meta
✅ Use System User Token
✅ Configure renovação automática
```

## 💰 Custos

### WhatsApp Business API
- **Grátis:** 1.000 conversas/mês
- **Pago:** ~$0.005 - $0.09 por conversa
- **Dica:** Responda em 24h (janela gratuita)

### Twilio
- **Sandbox:** Gratuito (limitado)
- **Produção:** ~$0.005 por mensagem

### Baileys
- **Totalmente gratuito** 🎉

## 📚 Documentação

### Guias Principais
- [WhatsApp Business API - Rápido](./docs/WHATSAPP_BUSINESS_RAPIDO.md) ⚡
- [WhatsApp Business API - Completo](./docs/WHATSAPP_BUSINESS_API_SETUP.md) 📖
- [Chatbot no Vercel](./docs/CHATBOT_VERCEL.md)
- [Início Rápido Chatbot](./docs/CHATBOT_QUICKSTART.md)

### Documentação Oficial
- [Meta WhatsApp API](https://developers.facebook.com/docs/whatsapp)
- [Twilio WhatsApp](https://www.twilio.com/docs/whatsapp)
- [Baileys](https://github.com/WhiskeySockets/Baileys)

## 🎉 Pronto!

Seu chatbot WhatsApp está configurado! 🚀

**Próximos passos:**
1. ✅ Escolha um provedor (Meta/Twilio/Baileys)
2. ✅ Configure variáveis de ambiente
3. ✅ Teste com `npm run whatsapp:test`
4. ✅ Personalize as respostas
5. ✅ Deploy no Vercel
6. ✅ Configure webhook (se usar Meta)

**Precisa de ajuda?**
- Consulte os guias em `/docs`
- Teste a interface em `/dashboard/whatsapp/chatbot`
- Execute `npm run whatsapp:test` para diagnóstico

## 🤝 Suporte

Dúvidas? Consulte:
1. [Guia Rápido](./docs/WHATSAPP_BUSINESS_RAPIDO.md) - 10 minutos
2. [Guia Completo](./docs/WHATSAPP_BUSINESS_API_SETUP.md) - Detalhado
3. [Troubleshooting](#-troubleshooting) - Problemas comuns
