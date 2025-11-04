Projeto Extencionista Integrador II


# 🏥 AgendMed - Sistema de Agendamento Médico

Sistema completo de agendamento médico com integração WhatsApp, desenvolvido com Next.js, React, Prisma 

## 🚀 Funcionalidades

### 📱 **WhatsApp Bot**
- Agendamento automático via WhatsApp
- QR Code gerado diretamente no dashboard
- Lembretes automáticos para pacientes
- Integração completa com banco de dados

### 🏥 **Dashboard Médico**
- Gestão de consultas e horários
- Cadastro de médicos e serviços
- Relatórios de agendamentos
- Interface responsiva e moderna

### 🔧 **APIs RESTful**
- Busca de médicos por especialidade
- Verificação de disponibilidade
- Criação de agendamentos
- Autenticação segura

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco**: PostgreSQL (Neon)
- **WhatsApp**: whatsapp-web.js
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe

## ⚡ Instalação Rápida

```bash
# Clone o repositório
git clone <repository-url>
cd agendmed

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute as migrações do banco
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📱 WhatsApp Bot

### Iniciar o Bot
```bash
node whatsapp-free/headless-bot.js
```

### Conectar WhatsApp
1. Acesse: `http://localhost:3000/dashboard/whatsapp`
2. Clique em "Gerar QR Code"
3. Escaneie com seu WhatsApp
4. Bot estará ativo para agendamentos

### Comandos do Bot
- `"oi"` - Iniciar conversa
- `"agendar"` - Marcar consulta
- `"consultas"` - Ver agendamentos
- `"médicos"` - Ver especialidades
- `"ajuda"` - Ver comandos

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
# Banco de Dados
DATABASE_URL="postgresql://..."

# Autenticação
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Google OAuth (opcional)
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."

# API Key para WhatsApp
AGENDMED_API_KEY="agendmed_..."
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (panel)/           # Dashboard protegido
│   │   ├── api/               # API Routes
│   │   └── auth/              # Autenticação
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilitários e configurações
│   └── types/                 # Tipos TypeScript
├── whatsapp-free/             # Bots WhatsApp
│   ├── headless-bot.js        # Bot principal (produção)
│   ├── qr-only-bot.js         # Bot apenas QR Code
│   └── simple-agendamento-bot.js # Bot simplificado
├── scripts/                   # Scripts utilitários
│   ├── dev-tools/             # Ferramentas de desenvolvimento
│   ├── create-test-doctor.js  # Criar médicos de teste
│   └── seed-test-data.js      # Popular banco com dados
├── docs/                      # Documentação
└── prisma/                    # Schema e migrações
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Servidor de produção

# Banco de Dados
npx prisma migrate dev   # Executar migrações
npx prisma studio       # Interface visual do banco
npx prisma generate     # Gerar cliente Prisma

# WhatsApp Bot
node whatsapp-free/headless-bot.js    # Bot completo
node whatsapp-free/qr-only-bot.js     # Apenas QR Code

# Utilitários
node scripts/create-test-doctor.js    # Criar médicos de teste
node scripts/seed-test-data.js        # Popular banco
```

## 🔒 Segurança

- Autenticação obrigatória para dashboard
- API Keys para integração WhatsApp
- Validação de dados em todas as APIs
- Sanitização de inputs do usuário

## 📊 Monitoramento

- Logs detalhados do WhatsApp Bot
- Status de conexão em tempo real
- Relatórios de agendamentos
- Métricas de uso do sistema

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Conecte seu repositório ao Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```
## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**AgendMed** - Simplificando o agendamento médico com tecnologia moderna 🏥✨
