# 🤖 Chatbot Compatível com Vercel

## ✅ O que funciona no Vercel

Este chatbot foi desenvolvido especificamente para funcionar no ambiente serverless do Vercel:

- **Stateless**: Não mantém estado entre requisições
- **Baseado em webhooks**: Recebe e responde mensagens via HTTP
- **Sem Puppeteer**: Não depende de navegador
- **Timeout curto**: Responde em menos de 10 segundos

## 🚀 Opções de Integração

### 1. WhatsApp Business API (Meta) - Recomendado

**Vantagens:**
- ✅ Oficial do WhatsApp
- ✅ Totalmente compatível com Vercel
- ✅ Escalável e confiável
- ✅ Suporte a mídia e templates

**Configuração:**

1. Crie uma conta no [Meta for Developers](https://developers.facebook.com/)
2. Configure o WhatsApp Business API
3. Obtenha suas credenciais:
   - Phone Number ID
   - Access Token
   - Webhook Verify Token

4. Adicione ao `.env`:
```env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_BUSINESS_TOKEN=seu_access_token
WEBHOOK_VERIFY_TOKEN=seu_token_secreto
```

5. Configure o webhook no Meta:
   - URL: `https://seu-dominio.vercel.app/api/whatsapp/chatbot`
   - Verify Token: mesmo do `.env`

### 2. Twilio WhatsApp

**Vantagens:**
- ✅ Fácil de configurar
- ✅ Sandbox gratuito para testes
- ✅ Documentação excelente

**Configuração:**

1. Crie conta no [Twilio](https://www.twilio.com/)
2. Ative o WhatsApp Sandbox
3. Adicione ao `.env`:
```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 3. Baileys + Servidor Externo

**Vantagens:**
- ✅ Gratuito
- ✅ Sem limites de mensagens
- ✅ Controle total

**Configuração:**

1. Deploy do Baileys no Railway/Render
2. Configure webhook no servidor externo
3. Adicione ao `.env`:
```env
BAILEYS_WEBHOOK_URL=https://seu-servidor-baileys.railway.app/send
```

## 📝 Estrutura do Chatbot

### Fluxo de Mensagens

```
Usuário → WhatsApp → Webhook → /api/whatsapp/chatbot → Resposta
```

### Endpoints

#### POST /api/whatsapp/chatbot
Processa mensagens recebidas:
```json
{
  "message": "oi",
  "from": "5511999999999"
}
```

Resposta:
```json
{
  "success": true,
  "response": "Olá! 👋 Bem-vindo ao AgendMed!...",
  "from": "5511999999999",
  "timestamp": "2024-11-19T10:30:00Z"
}
```

#### POST /api/whatsapp/send
Envia mensagens:
```json
{
  "to": "5511999999999",
  "message": "Sua consulta foi agendada!"
}
```

#### GET /api/whatsapp/chatbot
Verificação do webhook (WhatsApp Business API):
```
?hub.mode=subscribe
&hub.verify_token=seu_token
&hub.challenge=1234567890
```

## 🎯 Funcionalidades do Chatbot

### Menu Principal
- 1️⃣ Agendar consulta
- 2️⃣ Consultar agendamento
- 3️⃣ Cancelar agendamento
- 4️⃣ Especialidades disponíveis
- 5️⃣ Falar com atendente

### Comandos
- `oi`, `olá`, `menu` - Mostra menu principal
- `1` ou `agendar` - Inicia agendamento
- `2` ou `consultar` - Consulta agendamentos
- `3` ou `cancelar` - Cancela agendamento
- `4` ou `especialidades` - Lista especialidades
- `5` ou `atendente` - Transfere para humano

### Detecção Inteligente
- CPF (11 dígitos) - Busca agendamentos
- Data (DD/MM/AAAA) - Sugere horários
- Especialidade - Mostra médicos disponíveis

## 🧪 Testando o Chatbot

### 1. Interface Web
Acesse: `/dashboard/whatsapp/chatbot`

### 2. API Direta
```bash
curl -X POST https://seu-dominio.vercel.app/api/whatsapp/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "oi", "from": "5511999999999"}'
```

### 3. WhatsApp Real
Configure o webhook e envie mensagens pelo WhatsApp

## 🔧 Personalização

### Adicionar Novos Comandos

Edite `src/app/api/whatsapp/chatbot/route.ts`:

```typescript
// Novo comando
if (msg.includes('horarios')) {
  return `🕐 Horários disponíveis:
  
  Manhã: 08:00 - 12:00
  Tarde: 14:00 - 18:00
  
  Digite a especialidade para ver horários específicos.`
}
```

### Integrar com Banco de Dados

```typescript
import { prisma } from '@/lib/prisma'

async function processMessage(message: string, from: string) {
  // Buscar agendamentos reais
  if (/^\d{11}$/.test(msg)) {
    const appointments = await prisma.appointment.findMany({
      where: { patientPhone: from }
    })
    
    return formatAppointments(appointments)
  }
}
```

### Adicionar IA (OpenAI)

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function processMessage(message: string, from: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Você é um assistente de agendamento médico." },
      { role: "user", content: message }
    ]
  })
  
  return completion.choices[0].message.content
}
```

## 📊 Monitoramento

### Logs no Vercel
```bash
vercel logs --follow
```

### Analytics
- Mensagens recebidas
- Tempo de resposta
- Taxa de conversão
- Comandos mais usados

## 🚀 Deploy

### 1. Configurar Variáveis
No Vercel Dashboard:
- Settings → Environment Variables
- Adicione todas as variáveis do `.env`

### 2. Deploy
```bash
git push origin main
# Vercel faz deploy automático
```

### 3. Configurar Webhook
No Meta/Twilio:
- URL: `https://seu-dominio.vercel.app/api/whatsapp/chatbot`
- Método: POST
- Verify Token: mesmo do `.env`

## 💡 Dicas

### Performance
- ✅ Respostas em < 3 segundos
- ✅ Cache de dados frequentes
- ✅ Mensagens curtas e diretas

### UX
- ✅ Menu claro e objetivo
- ✅ Confirmações visuais (emojis)
- ✅ Opção de falar com humano
- ✅ Tratamento de erros amigável

### Segurança
- ✅ Validar webhook token
- ✅ Rate limiting
- ✅ Sanitizar inputs
- ✅ Não expor dados sensíveis

## 🆘 Troubleshooting

### Webhook não recebe mensagens
1. Verifique URL do webhook
2. Confirme verify token
3. Teste com curl
4. Veja logs do Vercel

### Timeout no Vercel
1. Otimize processamento
2. Use cache
3. Responda rápido
4. Processe em background

### Mensagens não enviadas
1. Verifique credenciais
2. Confirme número de destino
3. Veja logs do provedor
4. Teste com Postman

## 📚 Recursos

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Twilio WhatsApp](https://www.twilio.com/docs/whatsapp)
- [Vercel Serverless](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎉 Pronto!

Seu chatbot está funcionando no Vercel! 🚀

Para testar: `/dashboard/whatsapp/chatbot`
