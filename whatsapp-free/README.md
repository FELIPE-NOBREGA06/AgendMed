# 🆓 WhatsApp Gratuito - AgendMed Bot

## 🚀 Instalação Rápida

```bash
# 1. Instalar automaticamente
node whatsapp-free/install-free-whatsapp.js

# 2. Ou instalar manualmente
npm install @whiskeysockets/baileys qrcode-terminal

# 3. Iniciar bot
node whatsapp-free/baileys-setup.js
```

## 📋 Opções Disponíveis

### 🌟 Baileys (Recomendado)
- ✅ **100% Gratuito**
- ✅ **Mais estável**
- ✅ **Suporte ativo**
- ✅ **Multi-device**

```bash
npm install @whiskeysockets/baileys qrcode-terminal
node whatsapp-free/baileys-setup.js
```

### 🐍 Venom Bot
- ✅ **Gratuito**
- ✅ **Fácil de usar**
- ✅ **Boa documentação**

```bash
npm install venom-bot
node whatsapp-free/venom-setup.js
```

### 🌐 WhatsApp Web.js
- ✅ **Gratuito**
- ✅ **Mais leve**
- ✅ **Simples**

```bash
npm install whatsapp-web.js qrcode-terminal
node whatsapp-free/webjs-setup.js
```

## 🔧 Como Funciona

### 1. **Conectar WhatsApp**
```bash
node whatsapp-free/baileys-setup.js
# Escaneie o QR Code que aparece
```

### 2. **Bot Responde Automaticamente**
```
Usuário: "Oi"
Bot: "Olá! Bem-vindo ao AgendMed! Como posso ajudar?"

Usuário: "Quero agendar cardiologista"
Bot: "Encontrei cardiologistas disponíveis..."
```

### 3. **Integração com AgendMed**
- ✅ Busca médicos automaticamente
- ✅ Verifica disponibilidade
- ✅ Cria agendamentos
- ✅ Salva dados no banco

## 💬 Comandos do Bot

### Comandos Básicos:
- `"oi"` - Iniciar conversa
- `"agendar"` - Marcar consulta
- `"médicos"` - Ver especialidades
- `"ajuda"` - Ver todos comandos

### Exemplos de Uso:
```
"Quero agendar cardiologista"
"Tem dermatologista disponível?"
"Horários para amanhã"
"Cancelar minha consulta"
```

## 🔄 Comparação das Opções

| Recurso | Baileys | Venom | Web.js |
|---------|---------|-------|--------|
| **Gratuito** | ✅ | ✅ | ✅ |
| **Estabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Facilidade** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Suporte** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🛠️ Troubleshooting

### Problema: QR Code não aparece
```bash
# Reinstalar dependências
npm install --force
node whatsapp-free/baileys-setup.js
```

### Problema: Bot não responde
```bash
# Verificar se AgendMed está rodando
npm run dev

# Verificar API Key
echo $AGENDMED_API_KEY
```

### Problema: WhatsApp desconecta
```bash
# Reconectar automaticamente
# O bot já faz isso sozinho
```

## 📱 Vantagens vs Evolution API

| Recurso | Gratuito | Evolution API |
|---------|----------|---------------|
| **Custo** | 🆓 Grátis | 💰 Pago |
| **Configuração** | 🔧 Simples | 🔧 Complexa |
| **Manutenção** | 🔄 Automática | 🔄 Manual |
| **Escalabilidade** | 📈 Boa | 📈 Excelente |
| **Recursos** | 📋 Básicos | 📋 Avançados |

## 🎯 Recomendação

**Para começar**: Use **Baileys** 🌟
- Gratuito
- Estável  
- Fácil de configurar
- Integra perfeitamente com AgendMed

## 🚀 Próximos Passos

1. **Instale uma opção**:
   ```bash
   node whatsapp-free/install-free-whatsapp.js
   ```

2. **Teste o bot**:
   - Envie "oi" para seu número
   - Teste "agendar consulta"

3. **Personalize respostas**:
   - Edite as funções de IA nos arquivos
   - Adicione mais especialidades

4. **Deploy em produção**:
   - Use PM2 para manter rodando
   - Configure domínio se necessário

**🎉 Agora você tem WhatsApp 100% gratuito integrado com AgendMed!**