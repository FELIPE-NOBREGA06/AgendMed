# 🤖 Fluxo de Agendamento WhatsApp - AgendMed

## ✅ **Problema Resolvido:**
O bot agora tem um **fluxo completo de agendamento** que prossegue corretamente quando o usuário quer agendar uma consulta.

## 🔄 **Fluxo Implementado:**

### **1. Início da Conversa**
```
Usuário: "oi"
Bot: Bem-vindo! Digite "agendar" para marcar consulta
```

### **2. Escolher Especialidade**
```
Usuário: "agendar"
Bot: Escolha uma especialidade:
     1️⃣ Cardiologia ❤️
     2️⃣ Dermatologia 👩‍⚕️
     3️⃣ Ortopedia 🦴
     4️⃣ Pediatria 👶
     5️⃣ Neurologia 🧠
     6️⃣ Oftalmologia 👁️
```

### **3. Escolher Médico**
```
Usuário: "1" (cardiologia)
Bot: Cardiologistas disponíveis:
     1️⃣ Dr. João Silva - R$ 250,00
     2️⃣ Dra. Maria Santos - R$ 300,00
```

### **4. Escolher Horário**
```
Usuário: "1" (Dr. João Silva)
Bot: Horários disponíveis:
     🌅 Manhã: 1️⃣ 08:00  2️⃣ 09:00  3️⃣ 10:00  4️⃣ 11:00
     🌞 Tarde: 5️⃣ 14:00  6️⃣ 15:00  7️⃣ 16:00  8️⃣ 17:00
```

### **5. Confirmar Dados**
```
Usuário: "5" (14:00)
Bot: CONFIRMAR AGENDAMENTO:
     👨‍⚕️ Médico: Dr. João Silva
     📅 Data: hoje
     ⏰ Horário: 14:00
     💰 Valor: R$ 250,00
     
     ✅ Digite "confirmar" para agendar
```

### **6. Dados Pessoais**
```
Usuário: "confirmar"
Bot: Qual seu nome completo?

Usuário: "João da Silva"
Bot: Qual seu telefone?

Usuário: "(11) 99999-8888"
Bot: 🎉 AGENDAMENTO CONFIRMADO!
```

## 🧠 **Sistema de Estados:**

O bot agora usa um **sistema de conversação com estados** que mantém o contexto da conversa:

- `inicio` - Saudação inicial
- `escolher_especialidade` - Seleção da especialidade
- `escolher_medico` - Seleção do médico
- `escolher_horario` - Seleção do horário
- `confirmar_dados` - Confirmação dos dados
- `finalizar` - Coleta de dados pessoais

## 🔧 **Funcionalidades Implementadas:**

### **✅ Navegação Intuitiva:**
- Números para seleção rápida (1, 2, 3...)
- Nomes por extenso também funcionam ("cardiologia")
- Comandos de cancelamento ("cancelar", "sair")

### **✅ Validação de Entrada:**
- Verifica se a opção escolhida é válida
- Mensagens de erro claras
- Retorna ao passo anterior se necessário

### **✅ Persistência de Estado:**
- Mantém dados da conversa em memória
- Cada usuário tem seu próprio estado
- Reset automático após agendamento

### **✅ Integração com API:**
- Busca/cria paciente automaticamente
- Salva agendamento no sistema
- Log detalhado para debug

## 📱 **Comandos Disponíveis:**

| Comando | Função |
|---------|--------|
| `"oi"` | Iniciar conversa |
| `"agendar"` | Começar agendamento |
| `"médicos"` | Ver especialidades |
| `"ajuda"` | Ver comandos |
| `"cancelar"` | Cancelar agendamento |
| `1-6` | Escolher especialidade |
| `1-2` | Escolher médico |
| `1-8` | Escolher horário |
| `"confirmar"` | Confirmar dados |

## 🚀 **Como Testar:**

1. **Conectar WhatsApp:**
   ```bash
   node whatsapp-free/headless-bot.js
   ```

2. **Testar Fluxo:**
   ```bash
   node scripts/test-agendamento-flow.js
   ```

3. **Enviar Mensagem:**
   - Envie "oi" para seu WhatsApp conectado
   - Siga o fluxo: agendar → 1 → 1 → 5 → confirmar → nome → telefone

## 🎯 **Resultado:**
O bot agora **prossegue corretamente** com o agendamento, guiando o usuário passo a passo até a confirmação final da consulta!