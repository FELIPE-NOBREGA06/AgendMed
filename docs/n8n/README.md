# 🤖 Integração n8n - AgendMed

## 📋 Visão Geral

Esta integração permite que o AgendMed funcione como um assistente virtual inteligente via WhatsApp, utilizando n8n para orquestrar o fluxo de conversação e IA para processar as mensagens.

## 🎯 Funcionalidades

### Para Pacientes:
- ✅ **Agendamento inteligente** - Busca horários disponíveis e agenda consultas
- ✅ **Busca de médicos** - Encontra profissionais por especialidade e localização  
- ✅ **Busca de clínicas** - Localiza clínicas por região e convênios
- ✅ **Suporte 24/7** - Atendimento automatizado via WhatsApp
- ✅ **Processamento de áudio** - Transcreve mensagens de voz
- ✅ **Análise de imagens** - Interpreta imagens enviadas pelos pacientes

### Para Médicos/Clínicas:
- ✅ **Captação de leads** - Apresenta a plataforma para novos profissionais
- ✅ **Demonstrações** - Agenda apresentações da plataforma
- ✅ **Suporte técnico** - Ajuda com dúvidas sobre funcionalidades

## 🏗️ Arquitetura

```
WhatsApp → Evolution API → n8n Webhook → AgendMed APIs → OpenAI → Resposta
```

### Componentes:

1. **Evolution API** - Conecta WhatsApp ao n8n
2. **n8n Workflow** - Orquestra o fluxo de conversação
3. **AgendMed APIs** - Gerencia dados de pacientes e agendamentos
4. **OpenAI** - Processa linguagem natural e gera respostas
5. **Redis** (opcional) - Buffer de mensagens para agrupamento

## 📁 Arquivos

```
n8n/
├── AgendMed-Automation-v2.json    # Workflow principal do n8n
├── SETUP_GUIDE.md                 # Guia detalhado de configuração
├── README.md                      # Este arquivo
└── Agent IA Clinica Agendamentos.json  # Workflow original (referência)
```

## 🚀 Quick Start

### 1. **Gerar API Key**
```bash
node scripts/generate-api-key.js
```

### 2. **Testar APIs**
```bash
npm run dev
node scripts/test-n8n-apis.js
```

### 3. **Importar Workflow**
1. Abra seu n8n
2. Importe `AgendMed-Automation-v2.json`
3. Configure credenciais (OpenAI, Evolution API)
4. Ative o workflow

### 4. **Configurar WhatsApp**
1. Configure Evolution API
2. Aponte webhook para n8n
3. Teste enviando mensagem

## 🔧 APIs Disponíveis

### Pacientes
```http
POST /api/patients/find-or-create
Authorization: Bearer {AGENDMED_API_KEY}
Content-Type: application/json

{
  "phone": "5511999999999",
  "name": "João Silva"
}
```

### Agendamentos
```http
POST /api/appointments/check-availability
Authorization: Bearer {AGENDMED_API_KEY}

{
  "date": "2024-11-15",
  "doctorId": "dr-001",
  "time": "14:30"
}

POST /api/appointments/create
Authorization: Bearer {AGENDMED_API_KEY}

{
  "patientId": "patient-id",
  "doctorId": "dr-001",
  "date": "2024-11-15",
  "time": "14:30",
  "specialty": "Cardiologia"
}
```

### Busca
```http
GET /api/doctors/search?specialty=cardiologia&location=sao-paulo
GET /api/clinics/search?specialty=cardiologia&location=sao-paulo
Authorization: Bearer {AGENDMED_API_KEY}
```

## 🎨 Personalização

### Modificar Assistente IA

Edite o prompt no nó "Assistente IA AgendMed":

```javascript
# PAPEL
Você é a Ana, assistente virtual do AgendMed...

# INSTRUÇÕES
1. Seja concisa (máximo 2-3 linhas)
2. Use linguagem natural e acolhedora
3. Sempre confirme agendamentos
4. Direcione para canais apropriados

# CONTEXTO
- Plataforma: AgendMed
- Especialidades: [suas especialidades]
- Horários: [seus horários]
- Contatos: [seus contatos]
```

### Adicionar Novas Funcionalidades

1. **Criar nova API** em `src/app/api/`
2. **Adicionar nó HTTP Request** no n8n
3. **Atualizar prompt da IA** com nova funcionalidade
4. **Testar fluxo completo**

## 📊 Monitoramento

### Métricas Importantes:
- Volume de mensagens/dia
- Taxa de conversão (conversa → agendamento)
- Tempo de resposta médio
- Satisfação do usuário

### Logs:
- n8n: Execuções do workflow
- AgendMed: Logs das APIs
- Evolution: Status do WhatsApp

## 🔐 Segurança

### Boas Práticas:
- ✅ API Key segura (256 bits)
- ✅ Validação de entrada
- ✅ Rate limiting
- ✅ Logs auditáveis
- ✅ LGPD compliance

### Configurações:
```env
# Produção
AGENDMED_API_KEY=agendmed_[64-char-hex]
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
```

## 🐛 Troubleshooting

### Problemas Comuns:

#### Webhook não recebe mensagens
```bash
# Verificar URL do webhook
curl -X POST https://seu-n8n.com/webhook/agendmed-webhook

# Testar Evolution API
curl -X GET https://evolution-api.com/instance/status
```

#### IA não responde
```bash
# Verificar API Key OpenAI
curl -H "Authorization: Bearer sk-..." https://api.openai.com/v1/models

# Testar prompt
node scripts/test-openai-prompt.js
```

#### Agendamentos falham
```bash
# Testar APIs AgendMed
node scripts/test-n8n-apis.js

# Verificar banco de dados
npx prisma studio
```

## 📞 Suporte

- **Documentação**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Issues**: GitHub Issues
- **Email**: suporte@agendmed.com.br
- **WhatsApp**: (11) 99999-9999

## 🔄 Atualizações

### v2.0 (Atual)
- ✅ Integração completa com AgendMed
- ✅ APIs RESTful padronizadas
- ✅ Processamento de áudio e imagem
- ✅ Buffer inteligente de mensagens
- ✅ Suporte a múltiplos tipos de usuário

### Roadmap v2.1
- 🔄 Integração com calendários externos
- 🔄 Notificações push
- 🔄 Analytics avançados
- 🔄 Multi-idioma
- 🔄 Integração com telemedicina

---

**Desenvolvido com ❤️ para o AgendMed**