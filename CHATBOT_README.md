# 🤖 Chatbot WhatsApp - AgendMed

## ✅ Compatível com Vercel

Este chatbot foi desenvolvido especificamente para funcionar no ambiente serverless do Vercel, sem dependências de Puppeteer ou processos persistentes.

## 🚀 Início Rápido

### 1. Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000/dashboard/whatsapp/chatbot

### 2. Configurar Provedor WhatsApp

Escolha uma das opções:

#### Opção A: WhatsApp Business API (Recomendado)
```env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_BUSINESS_TOKEN=seu_access_token
WEBHOOK_VERIFY_TOKEN=seu_token_secreto
```

#### Opção B: Twilio
```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### Opção C: Baileys (servidor externo)
```env
BAILEYS_WEBHOOK_URL=https://seu-servidor.railway.app/send
```

### 3. Deploy no Vercel

```bash
git add .
git commit -m "Add WhatsApp chatbot"
git push
```

O Vercel fará deploy automático!

### 4. Configurar Webhook

No painel do seu provedor (Meta/Twilio):
- URL: `https://seu-app.vercel.app/api/whatsapp/chatbot`
- Método: POST
- Verify Token: (mesmo do .env)

## 📁 Arquivos Criados

```
src/
├── app/
│   ├── api/
│   │   └── whatsapp/
│   │       ├── chatbot/route.ts          # Chatbot básico
│   │       ├── chatbot-advanced/route.ts # Chatbot com BD
│   │       └── send/route.ts             # Enviar mensagens
│   └── (panel)/
│       └── dashboard/
│           └── whatsapp/
│               └── chatbot/page.tsx      # Interface de teste
└── lib/
    └── chatbot-handlers.ts               # Funções auxiliares

docs/
├── CHATBOT_VERCEL.md                     # Documentação completa
└── CHATBOT_QUICKSTART.md                 # Guia rápido
```

## 🎯 Funcionalidades

### Chatbot Básico (`/api/whatsapp/chatbot`)
- ✅ Menu interativo
- ✅ Comandos simples
- ✅ Respostas automáticas
- ✅ Stateless (sem sessão)

### Chatbot Avançado (`/api/whatsapp/chatbot-advanced`)
- ✅ Integração com banco de dados
- ✅ Fluxo de agendamento completo
- ✅ Contexto de conversa
- ✅ Validações (CPF, telefone, data)

### Envio de Mensagens (`/api/whatsapp/send`)
- ✅ WhatsApp Business API
- ✅ Twilio
- ✅ Baileys (webhook externo)

## 💬 Comandos Disponíveis

```
oi, menu          → Menu principal
1, agendar        → Agendar consulta
2, consultar      → Ver agendamentos
3, cancelar       → Cancelar agendamento
4, especialidades → Listar especialidades
5, atendente      → Falar com humano
```

## 🧪 Testar

### Interface Web
```
http://localhost:3000/dashboard/whatsapp/chatbot
```

### API Direta
```bash
curl -X POST http://localhost:3000/api/whatsapp/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "oi", "from": "5511999999999"}'
```

### Enviar Mensagem
```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"to": "5511999999999", "message": "Olá!"}'
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

Edite `src/lib/chatbot-handlers.ts` e substitua os mocks:

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

### Métricas
- Mensagens recebidas
- Tempo de resposta
- Taxa de conversão
- Comandos mais usados

## 🆘 Troubleshooting

### Webhook não funciona
1. ✅ Verifique URL (https)
2. ✅ Confirme verify token
3. ✅ Veja logs: `vercel logs`
4. ✅ Teste com curl

### Timeout
1. ✅ Otimize código
2. ✅ Use cache
3. ✅ Responda em < 5s

### Mensagens não enviadas
1. ✅ Verifique credenciais
2. ✅ Confirme número
3. ✅ Veja logs do provedor

## 📚 Documentação

- [Guia Completo](./docs/CHATBOT_VERCEL.md)
- [Início Rápido](./docs/CHATBOT_QUICKSTART.md)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Twilio Docs](https://www.twilio.com/docs/whatsapp)

## 🎉 Pronto!

Seu chatbot está funcionando no Vercel! 🚀

**Teste agora:** `/dashboard/whatsapp/chatbot`

## 💡 Próximos Passos

1. Configure um provedor WhatsApp (Meta/Twilio)
2. Faça deploy no Vercel
3. Configure o webhook
4. Personalize as respostas
5. Integre com seu banco de dados
6. Adicione IA para respostas inteligentes

## 🤝 Suporte

Dúvidas? Consulte a documentação completa em `docs/CHATBOT_VERCEL.md`
