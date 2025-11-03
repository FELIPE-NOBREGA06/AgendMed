# 📱 Configuração WhatsApp - Evolution API + n8n

## 🔧 Pré-requisitos

1. **Evolution API** rodando (self-hosted ou cloud)
2. **n8n** configurado
3. **AgendMed APIs** funcionando
4. **OpenAI API Key**

## 📋 Passo 1: Configurar Evolution API

### Opção A: Docker (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Configure as variáveis
cp .env.example .env

# Edite o .env com suas configurações
nano .env

# Inicie com Docker
docker-compose up -d
```

### Opção B: Cloud (Mais Fácil)
1. Acesse: https://evolution-api.com
2. Crie uma conta
3. Configure uma instância
4. Anote a URL e API Key

## 📋 Passo 2: Criar Instância WhatsApp

### Via API:
```bash
curl -X POST "https://sua-evolution-api.com/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "instanceName": "agendmed-bot",
    "token": "token-seguro-123",
    "qrcode": true,
    "webhook": "https://seu-n8n.com/webhook/whatsapp"
  }'
```

### Via Interface:
1. Acesse o painel da Evolution API
2. Clique em "Nova Instância"
3. Nome: `agendmed-bot`
4. Configure webhook: `https://seu-n8n.com/webhook/whatsapp`
5. Escaneie o QR Code com WhatsApp

## 📋 Passo 3: Configurar Webhook no n8n

1. **Importe o workflow** `AgendMed-Automation-v2.json`
2. **Configure o nó Webhook**:
   - Method: POST
   - Path: `/webhook/whatsapp`
   - Response: JSON
3. **Copie a URL** gerada pelo webhook
4. **Configure na Evolution API**

## 📋 Passo 4: Configurar Credenciais

### No n8n, configure:

#### 1. OpenAI:
```
Name: OpenAI AgendMed
API Key: sk-proj-sua-openai-key
```

#### 2. HTTP Request (Evolution API):
```
Name: Evolution API
Authentication: Header Auth
Header Name: apikey
Header Value: SUA_EVOLUTION_API_KEY
```

#### 3. Variáveis Globais:
```javascript
// No nó "Set" global, configure:
{
  "evolution_api_url": "https://sua-evolution-api.com",
  "evolution_instance": "agendmed-bot",
  "agendmed_api_url": "http://localhost:3000",
  "agendmed_api_key": "agendmed_8a6355c111a5349c0e84767c3c283d37bb6e976afcc6d65493fd45388b97aa55"
}
```

## 🤖 Fluxo de Conversação

### 1. **Recepção da Mensagem**
```
WhatsApp → Evolution API → n8n Webhook
```

### 2. **Processamento**
```javascript
// Extrair dados da mensagem
const message = $json.data.message.conversation;
const phone = $json.data.key.remoteJid.replace('@s.whatsapp.net', '');
const userName = $json.data.pushName || 'Usuário';
```

### 3. **Identificar Usuário**
```javascript
// Buscar/criar paciente
const patient = await fetch('/api/patients/find-or-create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${agendmed_api_key}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: phone,
    name: userName
  })
});
```

### 4. **Processar com IA**
```javascript
// Prompt para OpenAI
const systemPrompt = `
Você é a assistente virtual da AgendMed, uma plataforma de agendamento médico.

INFORMAÇÕES DO USUÁRIO:
- Nome: ${userName}
- Telefone: ${phone}
- ID: ${patientId}

FUNCIONALIDADES DISPONÍVEIS:
1. 🔍 Buscar médicos por especialidade
2. 📅 Verificar disponibilidade
3. 🗓️ Agendar consultas
4. ❌ Cancelar agendamentos
5. ℹ️ Informações sobre a plataforma

INSTRUÇÕES:
- Seja amigável e profissional
- Pergunte especialidade, data preferida
- Confirme dados antes de agendar
- Use emojis para deixar mais amigável
- Se não entender, peça esclarecimento

EXEMPLO DE AGENDAMENTO:
1. Usuário: "Quero agendar cardiologista"
2. Você: "🏥 Encontrei médicos cardiologistas! Qual data prefere?"
3. Usuário: "Amanhã de manhã"
4. Você: "📅 Verificando disponibilidade para amanhã..."
5. Mostrar horários disponíveis
6. Confirmar agendamento

Responda sempre em português brasileiro.
`;

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: message }
  ]
});
```

### 5. **Executar Ações**
```javascript
// Se IA identificar intenção de agendamento
if (response.includes("AGENDAR")) {
  // Buscar médicos
  const doctors = await fetch('/api/doctors/search?specialty=cardiologia');
  
  // Verificar disponibilidade
  const availability = await fetch('/api/appointments/check-availability', {
    method: 'POST',
    body: JSON.stringify({
      date: '2024-11-15',
      doctorId: doctorId
    })
  });
  
  // Criar agendamento
  const appointment = await fetch('/api/appointments/create', {
    method: 'POST',
    body: JSON.stringify({
      patientId: patientId,
      doctorId: doctorId,
      date: '2024-11-15',
      time: '14:00'
    })
  });
}
```

### 6. **Enviar Resposta**
```javascript
// Enviar mensagem via Evolution API
await fetch(`${evolution_api_url}/message/sendText/${evolution_instance}`, {
  method: 'POST',
  headers: {
    'apikey': evolution_api_key,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    number: phone,
    text: response
  })
});
```

## 💬 Exemplos de Conversação

### Exemplo 1: Agendamento Simples
```
👤 Usuário: Oi, quero agendar um cardiologista

🤖 Bot: Olá! 👋 Vou te ajudar a agendar uma consulta cardiológica.

Encontrei estes médicos disponíveis:
🏥 Dr. João Silva - Cardiologia
📍 São Paulo - SP
💰 R$ 250,00

Qual data você prefere? 📅

👤 Usuário: Amanhã de tarde

🤖 Bot: 📅 Verificando disponibilidade para amanhã à tarde...

Horários disponíveis:
⏰ 14:00
⏰ 15:00  
⏰ 16:00
⏰ 17:00

Qual horário prefere?

👤 Usuário: 15:00

🤖 Bot: ✅ Perfeito! Confirmando seu agendamento:

📋 RESUMO DO AGENDAMENTO:
👨‍⚕️ Médico: Dr. João Silva
🏥 Especialidade: Cardiologia
📅 Data: 03/11/2024
⏰ Horário: 15:00
💰 Valor: R$ 250,00

Confirma o agendamento? (Sim/Não)

👤 Usuário: Sim

🤖 Bot: 🎉 Agendamento confirmado!

📱 Você receberá um lembrete 1 dia antes.
📧 Confirmação enviada por email.

Precisa de mais alguma coisa?
```

### Exemplo 2: Busca por Especialidade
```
👤 Usuário: Tem dermatologista disponível?

🤖 Bot: 🔍 Buscando dermatologistas para você...

Encontrei estes profissionais:
👩‍⚕️ Dra. Maria Santos - Dermatologia
📍 São Paulo - SP  
⭐ 4.9/5 - 12 anos de experiência
💰 R$ 300,00

Gostaria de agendar uma consulta?
```

## 🛠️ Configuração Avançada

### 1. **Múltiplas Intenções**
```javascript
// Detectar intenção da mensagem
const intents = {
  agendar: ['agendar', 'marcar', 'consulta', 'médico'],
  cancelar: ['cancelar', 'desmarcar', 'remover'],
  reagendar: ['reagendar', 'remarcar', 'mudar'],
  informacao: ['info', 'informação', 'como funciona']
};
```

### 2. **Contexto de Conversa**
```javascript
// Salvar contexto no n8n
const context = {
  userId: patientId,
  step: 'selecting_time', // waiting_specialty, selecting_doctor, etc.
  selectedDoctor: doctorId,
  selectedDate: date,
  lastMessage: message
};
```

### 3. **Validações**
```javascript
// Validar data
const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date > today && date < new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
};

// Validar horário
const isValidTime = (time, availableTimes) => {
  return availableTimes.includes(time);
};
```

## 🚀 Deploy e Produção

### 1. **Variáveis de Ambiente**
```bash
# .env do n8n
AGENDMED_API_URL=https://seu-agendmed.vercel.app
AGENDMED_API_KEY=agendmed_sua_api_key
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua_evolution_key
OPENAI_API_KEY=sk-proj-sua-openai-key
```

### 2. **Monitoramento**
- Logs de conversas
- Taxa de conversão
- Erros de API
- Tempo de resposta

### 3. **Backup**
- Exportar workflow regularmente
- Backup das configurações
- Documentar mudanças

## 📞 Suporte

Se precisar de ajuda:
1. Verifique logs do n8n
2. Teste APIs individualmente
3. Valide webhook da Evolution API
4. Confirme credenciais OpenAI

---

**Agora você tem tudo para configurar agendamentos pelo WhatsApp!** 🚀