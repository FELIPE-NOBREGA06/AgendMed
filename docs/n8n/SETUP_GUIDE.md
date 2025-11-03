# 🤖 Guia de Configuração - Automação n8n AgendMed

## 📋 Visão Geral

Esta automação conecta o AgendMed ao WhatsApp via n8n, permitindo que pacientes interajam com a plataforma através de uma assistente virtual inteligente.

## 🔧 Pré-requisitos

### 1. **Contas Necessárias:**
- Conta n8n (self-hosted ou cloud)
- Conta OpenAI (para IA)
- Instância Evolution API (WhatsApp)
- AgendMed em produção

### 2. **APIs Necessárias:**
- Evolution API configurada
- OpenAI API Key
- AgendMed API Key

## ⚙️ Configuração Passo a Passo

### 1. **Importar Workflow**

1. Acesse seu n8n
2. Clique em "Import from file"
3. Selecione `AgendMed-Automation-v2.json`
4. Clique em "Import"

### 2. **Configurar Credenciais**

#### OpenAI:
1. Vá em Settings → Credentials
2. Adicione nova credencial "OpenAI"
3. Cole sua API Key da OpenAI
4. Nomeie como "OpenAI AgendMed"

#### Evolution API:
- Configure no nó "global" as variáveis:
  - `host_evo`: URL da sua instância Evolution
  - `nomeinstancia_evo`: Nome da instância WhatsApp
  - `apikey_evo`: Chave da Evolution API

#### AgendMed API:
- Configure a variável de ambiente `AGENDMED_API_KEY`
- Atualize `agendmed_api_url` no nó global

### 3. **Configurar Webhook**

1. No nó "Webhook", copie a URL gerada
2. Configure no Evolution API para enviar mensagens para esta URL
3. Teste enviando uma mensagem no WhatsApp

### 4. **Personalizar Assistente IA**

No nó "Assistente IA AgendMed", ajuste:

```
# Informações da Clínica/Plataforma
- Nome da assistente
- Informações de contato
- Horários de funcionamento
- Especialidades disponíveis
- Planos e preços
```

## 🔗 Integrações com AgendMed

### APIs Utilizadas:

#### 1. **Pacientes**
```
POST /api/patients/find-or-create
{
  "phone": "5511999999999",
  "name": "João Silva"
}
```

#### 2. **Agendamentos**
```
POST /api/appointments/check-availability
{
  "date": "2024-11-15",
  "doctorId": "doctor-id",
  "clinicId": "clinic-id"
}

POST /api/appointments/create
{
  "patientId": "patient-id",
  "doctorId": "doctor-id",
  "clinicId": "clinic-id",
  "date": "2024-11-15",
  "time": "14:30",
  "type": "consultation"
}
```

#### 3. **Busca de Médicos**
```
GET /api/doctors/search?specialty=cardiologia&location=sao-paulo
```

#### 4. **Busca de Clínicas**
```
GET /api/clinics/search?specialty=cardiologia&location=sao-paulo
```

## 🎯 Funcionalidades da Assistente

### Para Pacientes:
- ✅ Busca de médicos por especialidade
- ✅ Verificação de disponibilidade
- ✅ Agendamento de consultas
- ✅ Reagendamento/cancelamento
- ✅ Lembretes de consultas
- ✅ Suporte técnico

### Para Médicos/Clínicas:
- ✅ Informações sobre a plataforma
- ✅ Processo de cadastro
- ✅ Demonstração de funcionalidades
- ✅ Suporte para integração

## 🔄 Fluxo de Conversação

### 1. **Recepção da Mensagem**
```
WhatsApp → Evolution API → n8n Webhook → Processamento
```

### 2. **Identificação do Usuário**
```
Busca/Cria paciente no AgendMed → Contexto personalizado
```

### 3. **Processamento IA**
```
Mensagem + Contexto → OpenAI → Resposta personalizada
```

### 4. **Ações Específicas**
```
Agendamento → API AgendMed → Confirmação
Busca → API AgendMed → Resultados
Suporte → Direcionamento apropriado
```

### 5. **Resposta**
```
Resposta IA → Evolution API → WhatsApp
```

## 🛠️ Personalização Avançada

### 1. **Adicionar Novas Funcionalidades**

Para adicionar novos recursos:

1. Crie novos nós HTTP Request
2. Configure endpoints da API AgendMed
3. Atualize o prompt da IA
4. Teste o fluxo completo

### 2. **Integrar com Outros Sistemas**

Exemplos de integrações:
- Sistema de pagamentos (Stripe)
- CRM médico
- Sistema de prontuário
- Laboratórios parceiros

### 3. **Melhorar Respostas da IA**

Ajuste o prompt para:
- Adicionar mais contexto médico
- Incluir protocolos específicos
- Personalizar por especialidade
- Adicionar validações médicas

## 📊 Monitoramento e Analytics

### 1. **Logs Importantes**
- Volume de mensagens por dia
- Tipos de solicitações mais comuns
- Taxa de conversão (consulta → agendamento)
- Tempo de resposta médio

### 2. **Métricas de Sucesso**
- Satisfação do paciente
- Redução de ligações telefônicas
- Aumento de agendamentos
- Eficiência operacional

## 🚨 Troubleshooting

### Problemas Comuns:

#### 1. **Webhook não recebe mensagens**
- Verifique URL do webhook
- Confirme configuração Evolution API
- Teste conectividade

#### 2. **IA não responde adequadamente**
- Verifique API Key OpenAI
- Ajuste prompt system message
- Teste com mensagens simples

#### 3. **Agendamentos não funcionam**
- Verifique API Key AgendMed
- Confirme endpoints da API
- Valide formato dos dados

#### 4. **Respostas não chegam no WhatsApp**
- Verifique credenciais Evolution
- Confirme status da instância
- Teste envio manual

## 🔐 Segurança

### Boas Práticas:

1. **API Keys**
   - Use variáveis de ambiente
   - Rotacione chaves regularmente
   - Monitore uso das APIs

2. **Dados Pessoais**
   - Implemente LGPD compliance
   - Criptografe dados sensíveis
   - Mantenha logs auditáveis

3. **Rate Limiting**
   - Configure limites por usuário
   - Implemente cooldown entre mensagens
   - Monitore uso abusivo

## 📞 Suporte

Para suporte técnico:
- Email: suporte@agendmed.com.br
- WhatsApp: (11) 99999-9999
- Documentação: https://docs.agendmed.com.br

---

**Versão:** 2.0  
**Última atualização:** Novembro 2024  
**Compatibilidade:** n8n v1.0+, AgendMed v2.0+