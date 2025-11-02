<<<<<<< HEAD
# 🏥 AgendMed - Sistema de Agendamento para Clínicas

> **Projeto Integrador II - Sistemas de Informação**  
> Sistema web completo para gerenciamento de agendamentos médicos e odontológicos

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Sobre o Projeto

O **AgendMed** é uma plataforma web moderna desenvolvida para facilitar o agendamento de consultas médicas e odontológicas. O sistema conecta pacientes e profissionais de saúde através de uma interface intuitiva e funcionalidades robustas.

### 🎯 Objetivos do Projeto Integrador

- Aplicar conhecimentos de desenvolvimento web full-stack
- Implementar sistema de autenticação e autorização
- Integrar gateway de pagamento (Stripe)
- Desenvolver interface responsiva e acessível
- Aplicar boas práticas de engenharia de software
- Implementar arquitetura escalável e maintível

## ✨ Funcionalidades Principais

### 👥 Para Pacientes
- 🔍 **Busca de Clínicas**: Encontre profissionais próximos
- 📅 **Agendamento Online**: Marque consultas de forma prática
- 📱 **Interface Responsiva**: Acesse de qualquer dispositivo
- ⭐ **Avaliações**: Veja avaliações de outros pacientes

### 🏥 Para Clínicas
- 📊 **Dashboard Administrativo**: Gerencie sua clínica
- 📋 **Gestão de Serviços**: Cadastre e organize seus serviços
- 📅 **Controle de Agenda**: Visualize e gerencie agendamentos
- 💰 **Sistema de Assinaturas**: Planos Basic e Professional
- 👤 **Perfil Personalizado**: Configure informações da clínica

### 💳 Sistema de Pagamentos
- 💎 **Plano Basic**: R$ 27,90/mês - Até 3 serviços
- 🚀 **Plano Professional**: R$ 97,90/mês - Até 50 serviços
- 🔒 **Pagamentos Seguros**: Integração com Stripe
- 📊 **Relatórios Financeiros**: Acompanhe suas receitas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação OAuth

### Integrações
- **Stripe** - Gateway de pagamento
- **Cloudinary** - Armazenamento de imagens
- **Google OAuth** - Autenticação social
- **GitHub OAuth** - Autenticação social

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- PostgreSQL
- Conta no Stripe (para pagamentos)
- Contas OAuth (Google/GitHub)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/agendmed.git
cd agendmed
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Copie o arquivo `.example.env` para `.env` e configure:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendmed"

# NextAuth
AUTH_SECRET="seu-auth-secret"
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"
AUTH_GITHUB_ID="seu-github-client-id"
AUTH_GITHUB_SECRET="seu-github-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_SECRET_WEBHOOK_KEY="whsec_..."
STRIPE_PLAN_BASIC="price_..."
STRIPE_PLAN_PROFISSIONAL="price_..."

# URLs
NEXT_PUBLIC_URL="http://localhost:3000"
STRIPE_SUCCESS_URL="http://localhost:3000/dashboard/plans"
STRIPE_CANCEL_URL="http://localhost:3000/dashboard/plans"
```

### 4. Configure o Banco de Dados
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:push
```

### 5. Configure o Stripe
```bash
# Criar produtos automaticamente
npm run stripe:setup

# Para desenvolvimento local (webhook)
npm run stripe:listen
```

### 6. Execute o Projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
agendmed/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (public)/          # Páginas públicas
│   │   ├── (panel)/           # Dashboard administrativo
│   │   └── api/               # API Routes
│   ├── components/            # Componentes reutilizáveis
│   │   └── ui/               # Componentes de interface
│   ├── lib/                  # Configurações e utilitários
│   ├── utils/                # Funções auxiliares
│   └── types/                # Definições de tipos
├── prisma/                   # Schema e migrações
├── public/                   # Arquivos estáticos
├── scripts/                  # Scripts de automação
└── docs/                     # Documentação
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Inicia servidor de produção

# Banco de Dados
npm run db:generate     # Gera cliente Prisma
npm run db:push         # Aplica mudanças no schema
npm run db:migrate      # Executa migrações
npm run db:studio       # Interface visual do banco

# Stripe
npm run stripe:setup    # Configura produtos no Stripe
npm run stripe:listen   # Escuta webhooks localmente

# Utilitários
npm run activate:pro    # Ativa plano Professional (dev)
npm run create:clinics  # Cria clínicas de teste
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores Primárias**: Verde esmeralda (#10B981)
- **Tipografia**: Inter (texto) + JetBrains Mono (código)
- **Componentes**: Radix UI + Tailwind CSS
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first approach

## 🔐 Segurança

- ✅ Autenticação OAuth segura
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ HTTPS obrigatório em produção
- ✅ Webhooks assinados (Stripe)
- ✅ Variáveis de ambiente protegidas

## 📊 Arquitetura

```mermaid
graph TB
    A[Cliente Web] --> B[Next.js Frontend]
    B --> C[Next.js API Routes]
    C --> D[Prisma ORM]
    D --> E[PostgreSQL]
    C --> F[Stripe API]
    C --> G[OAuth Providers]
    B --> H[Cloudinary]
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📈 Roadmap

### Versão 2.0
- [ ] Sistema de notificações
- [ ] Chat em tempo real
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com calendários externos
- [ ] Sistema de avaliações
- [ ] Relatórios avançados

### Versão 2.1
- [ ] Telemedicina
- [ ] Prescrições digitais
- [ ] Integração com laboratórios
- [ ] Dashboard analytics

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor Full-Stack**: [Seu Nome]
- **Orientador**: [Nome do Professor]
- **Instituição**: [Nome da Faculdade]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

=======
# AgendMed
>>>>>>> 4b7cb62bbfc655b95ded7acee864f3027f5173e3
