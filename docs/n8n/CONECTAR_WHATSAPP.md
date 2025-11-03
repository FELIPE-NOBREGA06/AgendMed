# 📱 Como Conectar seu WhatsApp - Guia Completo

## 🚀 Método 1: Evolution API Cloud (Recomendado)

### Passo 1: Criar Conta
1. **Acesse**: https://evolution-api.com
2. **Clique em "Sign Up"** (Cadastrar)
3. **Preencha seus dados**:
   - Nome
   - Email
   - Senha
4. **Confirme o email**

### Passo 2: Criar Instância WhatsApp
1. **Faça login** no painel
2. **Clique em "New Instance"** (Nova Instância)
3. **Configure**:
   ```
   Instance Name: agendmed-bot
   Webhook URL: https://seu-n8n.com/webhook/whatsapp-webhook
   Events: messages.upsert
   ```
4. **Clique em "Create"**

### Passo 3: Conectar seu WhatsApp
1. **Clique na instância criada**
2. **Clique em "Connect"**
3. **Aparecerá um QR Code**
4. **No seu celular**:
   - Abra o WhatsApp
   - Vá em **Menu (⋮) → Dispositivos conectados**
   - Clique em **"Conectar um dispositivo"**
   - **Escaneie o QR Code** da tela
5. **Aguarde a confirmação** ✅

### Passo 4: Testar Conexão
```bash
# Enviar mensagem de teste
curl -X POST "https://sua-evolution-api.com/message/sendText/agendmed-bot" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511999999999",
    "text": "🤖 Bot AgendMed conectado com sucesso!"
  }'
```

---

## 🐳 Método 2: Self-Hosted (Docker)

### Passo 1: Instalar Docker
```bash
# Windows (baixe do site oficial)
https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

# Ou via Chocolatey
choco install docker-desktop
```

### Passo 2: Clonar Evolution API
```bash
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
```

### Passo 3: Configurar Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações
notepad .env
```

**Configure no .env:**
```env
# Servidor
SERVER_URL=http://localhost:8080
PORT=8080

# Banco de dados
DATABASE_ENABLED=true
DATABASE_CONNECTION_URI=mongodb://root:root@localhost:27017/evolution?authSource=admin

# Webhook
WEBHOOK_GLOBAL_URL=https://seu-n8n.com/webhook/whatsapp-webhook
WEBHOOK_GLOBAL_ENABLED=true

# Logs
LOG_LEVEL=ERROR
LOG_COLOR=true

# QR Code
QRCODE_LIMIT=30
```

### Passo 4: Iniciar com Docker
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar se está rodando
docker-compose ps

# Ver logs
docker-compose logs -f evolution-api
```

### Passo 5: Acessar Interface
1. **Abra**: http://localhost:8080
2. **Crie uma instância**:
   ```json
   {
     "instanceName": "agendmed-bot",
     "token": "token-seguro-123",
     "qrcode": true,
     "webhook": "https://seu-n8n.com/webhook/whatsapp-webhook"
   }
   ```

### Passo 6: Conectar WhatsApp
1. **Acesse**: http://localhost:8080/instance/qrcode/agendmed-bot
2. **Escaneie o QR Code** com seu WhatsApp
3. **Aguarde confirmação**

---

## 📋 Método 3: Via API (Programático)

### Criar Instância via cURL
```bash
# Criar instância
curl -X POST "https://sua-evolution-api.com/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "instanceName": "agendmed-bot",
    "token": "token-seguro-agendmed-2024",
    "qrcode": true,
    "webhook": "https://seu-n8n.com/webhook/whatsapp-webhook",
    "webhookByEvents": true,
    "events": [
      "APPLICATION_STARTUP",
      "QRCODE_UPDATED", 
      "MESSAGES_UPSERT",
      "CONNECTION_UPDATE"
    ]
  }'
```

### Obter QR Code
```bash
# Buscar QR Code
curl -X GET "https://sua-evolution-api.com/instance/connect/agendmed-bot" \
  -H "apikey: SUA_API_KEY"
```

### Verificar Status
```bash
# Status da conexão
curl -X GET "https://sua-evolution-api.com/instance/connectionState/agendmed-bot" \
  -H "apikey: SUA_API_KEY"
```

---

## 🛠️ Configuração Avançada

### Webhook Personalizado
```bash
# Configurar webhook específico
curl -X POST "https://sua-evolution-api.com/webhook/set/agendmed-bot" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "url": "https://seu-n8n.com/webhook/whatsapp-webhook",
    "events": [
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE", 
      "MESSAGES_DELETE",
      "SEND_MESSAGE"
    ],
    "webhook_by_events": true
  }'
```

### Configurar Grupos (Opcional)
```bash
# Permitir grupos
curl -X PUT "https://sua-evolution-api.com/instance/settings/agendmed-bot" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "rejectCall": true,
    "msgCall": "Não atendemos ligações. Use mensagens de texto.",
    "groupsIgnore": false,
    "alwaysOnline": true,
    "readMessages": true,
    "readStatus": true
  }'
```

---

## 🧪 Testando a Conexão

### Script de Teste Completo
```javascript
// test-whatsapp-connection.js
const EVOLUTION_API_URL = 'https://sua-evolution-api.com';
const API_KEY = 'SUA_API_KEY';
const INSTANCE = 'agendmed-bot';

async function testConnection() {
  try {
    // 1. Verificar status da instância
    const statusResponse = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${INSTANCE}`, {
      headers: { 'apikey': API_KEY }
    });
    
    const status = await statusResponse.json();
    console.log('Status:', status);
    
    if (status.instance.state === 'open') {
      console.log('✅ WhatsApp conectado!');
      
      // 2. Enviar mensagem de teste
      const testMessage = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        },
        body: JSON.stringify({
          number: '5511999999999', // Seu número para teste
          text: '🤖 AgendMed Bot conectado e funcionando!'
        })
      });
      
      if (testMessage.ok) {
        console.log('✅ Mensagem de teste enviada!');
      }
    } else {
      console.log('❌ WhatsApp não conectado. Status:', status.instance.state);
    }
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

testConnection();
```

### Executar Teste
```bash
node test-whatsapp-connection.js
```

---

## 🔍 Troubleshooting

### Problemas Comuns:

#### 1. QR Code não aparece
```bash
# Verificar se instância existe
curl -X GET "https://sua-evolution-api.com/instance/fetchInstances" \
  -H "apikey: SUA_API_KEY"

# Recriar instância se necessário
curl -X DELETE "https://sua-evolution-api.com/instance/delete/agendmed-bot" \
  -H "apikey: SUA_API_KEY"
```

#### 2. WhatsApp desconecta
```bash
# Reconectar
curl -X GET "https://sua-evolution-api.com/instance/connect/agendmed-bot" \
  -H "apikey: SUA_API_KEY"

# Verificar logs
curl -X GET "https://sua-evolution-api.com/instance/logs/agendmed-bot" \
  -H "apikey: SUA_API_KEY"
```

#### 3. Webhook não funciona
```bash
# Testar webhook
curl -X POST "https://seu-n8n.com/webhook/whatsapp-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "message": "Teste de webhook"
  }'
```

---

## 📱 Usando WhatsApp Business

### Vantagens:
- ✅ Perfil profissional
- ✅ Informações da empresa
- ✅ Catálogo de produtos/serviços
- ✅ Mensagens automáticas
- ✅ Estatísticas

### Como configurar:
1. **Baixe WhatsApp Business** (se não tiver)
2. **Configure perfil da clínica**:
   - Nome: "AgendMed - Agendamentos"
   - Categoria: "Serviços médicos"
   - Descrição: "Agendamento de consultas médicas"
   - Horário de funcionamento
   - Endereço
3. **Use o mesmo processo** de conexão acima

---

## ✅ Checklist Final

- [ ] Evolution API configurada
- [ ] Instância criada (agendmed-bot)
- [ ] QR Code escaneado
- [ ] WhatsApp conectado (status: open)
- [ ] Webhook configurado
- [ ] Mensagem de teste enviada
- [ ] n8n recebendo webhooks
- [ ] Bot respondendo mensagens

---

## 🎯 Próximo Passo

Após conectar o WhatsApp:

1. **Configure o n8n** com o webhook
2. **Importe o workflow** AgendMed
3. **Teste uma conversa** completa
4. **Ajuste as respostas** da IA

**🎉 Seu bot estará pronto para atender pacientes!**