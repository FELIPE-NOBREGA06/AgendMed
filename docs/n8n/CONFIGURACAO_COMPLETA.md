# 🤖 Configuração Completa - Agente IA WhatsApp

## 📋 Pré-requisitos

✅ **Já temos funcionando:**
- AgendMed APIs (todas testadas e funcionando)
- Banco de dados PostgreSQL (Neon)
- API Key gerada: `agendmed_8a6355c111a5349c0e84767c3c283d37bb6e976afcc6d65493fd45388b97aa55`

🔧 **Precisamos configurar:**
- Evolution API (WhatsApp)
- n8n (Automação)
- OpenAI API Key (IA)

## 🚀 Passo 1: Configurar Evolution API

### Opção A: Usar Serviço Cloud (Mais Fácil)

1. **Acesse**: https://evolution-api.com
2. **Crie uma conta gratuita**
3. **Crie uma instância**:
   - Nome: `agendmed-bot`
   - Webhook URL: `https://seu-n8n.com/webhook/whatsapp-webhook`
4. **Anote as credenciais**:
   - URL da API
   - API Key
   - Nome da instância

### Opção B: Self-Hosted (Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# 2. Configure o ambiente
cp .env.example .env

# 3. Edite as configurações
nano .env

# 4. Inicie com Docker
docker-compose up -d

# 5. Acesse: http://localhost:8080
```

## 🧠 Passo 2: Configurar OpenAI

1. **Acesse**: https://platform.openai.com
2. **Crie uma conta** (se não tiver)
3. **Gere uma API Key**:
   - Vá em "API Keys"
   - Clique em "Create new secret key"
   - Anote a chave: `sk-proj-...`
4. **Adicione créditos** (mínimo $5)

## ⚙️ Passo 3: Configurar n8n

### Opção A: n8n Cloud (Recomendado)

1. **Acesse**: https://n8n.cloud
2. **Crie uma conta gratuita**
3. **Importe o workflow**:
   - Clique em "Import from file"
   - Selecione `AgendMed-WhatsApp-Complete.json`
   - Clique em "Import"

### Opção B: Self-Hosted

```bash
# Via Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Via npm
npm install n8n -g
n8n start

# Acesse: http://localhost:5678
```

## 🔧 Passo 4: Configurar Credenciais no n8n

### 1. OpenAI Credential

1. Vá em **Settings → Credentials**
2. Clique em **"Add Credential"**
3. Selecione **"OpenAI"**
4. Configure:
   ```
   Name: OpenAI AgendMed
   API Key: sk-proj-SUA_OPENAI_KEY_AQUI
   ```
5. Clique em **"Save"**

### 2. Configurar Variáveis no Workflow

No nó **"Extrair Dados da Mensagem"**, atualize:

```javascript
// AgendMed API
agendmed_api_url: "http://localhost:3000"  // ou sua URL de produção
agendmed_api_key: "agendmed_8a6355c111a5349c0e84767c3c283d37bb6e976afcc6d65493fd45388b97aa55"

// Evolution API
evolution_api_url: "https://sua-evolution-api.com"
evolution_api_key: "SUA_EVOLUTION_API_KEY"
evolution_instance: "agendmed-bot"
```

## 📱 Passo 5: Conectar WhatsApp

### 1. Configurar Webhook

1. No n8n, **ative o workflow**
2. **Copie a URL do webhook**: `https://seu-n8n.com/webhook/whatsapp-webhook`
3. **Configure na Evolution API**:

```bash
curl -X POST "https://sua-evolution-api.com/webhook/set/agendmed-bot" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "url": "https://seu-n8n.com/webhook/whatsapp-webhook",
    "events": ["messages.upsert"]
  }'
```

### 2. Conectar WhatsApp

1. **Gere QR Code**:
```bash
curl -X GET "https://sua-evolution-api.com/instance/connect/agendmed-bot" \
  -H "apikey: SUA_API_KEY"
```

2. **Escaneie com WhatsApp**:
   - Abra WhatsApp no celular
   - Vá em "Dispositivos conectados"
   - Escaneie o QR Code

## 🧪 Passo 6: Testar o Bot

### 1. Teste Básico

Envie uma mensagem para o número conectado:
```
"Oi, quero agendar uma consulta"
```

**Resposta esperada:**
```
Olá! 👋 Sou a assistente da AgendMed. 
Qual especialidade médica você precisa? 🏥
```

### 2. Teste de Agendamento

```
Usuário: "Quero cardiologista"
Bot: "Encontrei cardiologistas disponíveis! Para qual data?"

Usuário: "Amanhã de manhã"  
Bot: "Horários disponíveis amanhã: ⏰ 09:00, 10:00, 11:00"

Usuário: "09:00"
Bot: "✅ Agendamento confirmado para amanhã às 09:00!"
```

## 🔍 Passo 7: Monitoramento e Debug

### 1. Logs do n8n

- Vá em **Executions** para ver logs
- Verifique erros em cada nó
- Use **"Test workflow"** para debug

### 2. Logs da Evolution API

```bash
# Ver logs da instância
curl -X GET "https://sua-evolution-api.com/instance/fetchInstances" \
  -H "apikey: SUA_API_KEY"
```

### 3. Testar APIs Individualmente

```bash
# Testar AgendMed API
node scripts/test-specific-apis.js

# Testar fluxo completo
node scripts/test-whatsapp-flow.js
```

## 🚀 Passo 8: Deploy em Produção

### 1. Atualizar URLs

No workflow n8n, altere:
```javascript
agendmed_api_url: "https://seu-agendmed.vercel.app"
```

### 2. Configurar Domínio

- Configure domínio personalizado no n8n
- Atualize webhook na Evolution API
- Teste em produção

## 💬 Exemplos de Conversas

### Agendamento Completo
```
👤: "Oi"
🤖: "Olá! 👋 Sou a assistente da AgendMed. Como posso ajudar?"

👤: "Quero agendar cardiologista"
🤖: "🏥 Encontrei cardiologistas disponíveis! Para qual data você prefere?"

👤: "Amanhã"
🤖: "📅 Verificando disponibilidade para amanhã...
     
     Médicos disponíveis:
     👨‍⚕️ Dr. João Silva - Cardiologia
     💰 R$ 250,00
     
     Horários livres:
     ⏰ 09:00  ⏰ 10:00  ⏰ 11:00
     ⏰ 14:00  ⏰ 15:00  ⏰ 16:00
     
     Qual horário prefere?"

👤: "09:00"
🤖: "✅ Perfeito! Confirmando agendamento:
     
     📋 RESUMO:
     👨‍⚕️ Dr. João Silva - Cardiologia  
     📅 03/11/2024 às 09:00
     💰 R$ 250,00
     
     Confirma? (Sim/Não)"

👤: "Sim"
🤖: "🎉 Agendamento confirmado!
     
     📱 Você receberá lembrete 1 dia antes
     📧 Confirmação enviada por email
     
     Precisa de mais alguma coisa?"
```

## 🛠️ Troubleshooting

### Problemas Comuns:

#### 1. Bot não responde
- ✅ Verificar se webhook está ativo
- ✅ Verificar logs do n8n
- ✅ Testar Evolution API

#### 2. Erro de API
- ✅ Verificar API Keys
- ✅ Testar endpoints individualmente
- ✅ Verificar URLs de produção

#### 3. IA não funciona
- ✅ Verificar OpenAI API Key
- ✅ Verificar créditos OpenAI
- ✅ Testar prompt manualmente

## 📊 Métricas de Sucesso

- 📱 **Mensagens processadas por dia**
- 📅 **Agendamentos realizados via bot**
- ⏱️ **Tempo médio de resposta**
- 😊 **Satisfação do usuário**

---

## ✅ Checklist Final

- [ ] Evolution API configurada
- [ ] WhatsApp conectado via QR Code
- [ ] n8n workflow importado
- [ ] OpenAI API Key configurada
- [ ] Webhook funcionando
- [ ] Teste de conversa realizado
- [ ] Agendamento teste criado
- [ ] URLs de produção configuradas

**🎉 Parabéns! Seu agente IA está pronto para atender pacientes via WhatsApp!**