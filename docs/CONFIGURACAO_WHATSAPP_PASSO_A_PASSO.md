# 📱 Configuração WhatsApp Business - Passo a Passo

## 🎯 Vou configurar para você em 10 minutos!

### ⏰ **PASSO 1: Criar Conta Meta Business (2 minutos)**

1. **Acesse**: https://business.facebook.com/
2. **Clique em**: "Criar conta"
3. **Preencha**:
   - Nome da empresa: "AgendMed"
   - Seu nome completo
   - Email empresarial
4. **Verifique** via email/SMS

---

### 📱 **PASSO 2: Configurar WhatsApp Business (3 minutos)**

1. **Acesse**: https://business.facebook.com/wa/manage/phone-numbers/
2. **Clique em**: "Adicionar número de telefone"
3. **Escolha**: "Usar meu próprio número"
4. **Digite**: Seu número com DDD (ex: 11999999999)
5. **Verifique**: Via código SMS
6. **Aguarde**: Aprovação (1-2 minutos)

---

### 🔑 **PASSO 3: Obter Credenciais (2 minutos)**

1. **Acesse**: https://business.facebook.com/wa/manage/phone-numbers/
2. **Clique**: No seu número de telefone
3. **Vá na aba**: "Configuração da API"
4. **Copie**: Phone Number ID (ex: 123456789012345)
5. **Clique**: "Gerar token de acesso"
6. **Copie**: Token de acesso (ex: EAAxxxxxxxxxxxxx)

---

### ☁️ **PASSO 4: Configurar no Vercel (2 minutos)**

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione**: Projeto "agend-med-pi"
3. **Vá em**: Settings → Environment Variables
4. **Adicione estas 4 variáveis**:

```
WHATSAPP_BUSINESS_TOKEN=EAAxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=agendmed_webhook_token
NEXT_PUBLIC_WHATSAPP_CONFIGURED=true
```

5. **Clique**: "Save" em cada uma
6. **Aguarde**: Deploy automático (1 minuto)

---

### 🔗 **PASSO 5: Configurar Webhook (1 minuto)**

1. **No Meta Business Manager**: WhatsApp → Configuração
2. **Seção Webhook**: Clique em "Configurar"
3. **Configure**:
   - **URL**: `https://agend-med-pi.vercel.app/api/whatsapp/webhook`
   - **Verify Token**: `agendmed_webhook_token`
4. **Ative eventos**: messages, message_deliveries
5. **Clique**: "Verificar e salvar"

---

## 🎉 **PRONTO! TESTE AGORA:**

### ✅ **Teste 1: Enviar Mensagem**
1. **Acesse**: https://agend-med-pi.vercel.app/dashboard/whatsapp/business
2. **Digite**: Um número de teste (ex: seu próprio celular)
3. **Escreva**: "Teste WhatsApp Business"
4. **Clique**: "Enviar via Business API"
5. **Resultado**: Mensagem chegará no WhatsApp! 📱

### ✅ **Teste 2: Receber Mensagem**
1. **Envie mensagem**: Para seu número WhatsApp Business
2. **Escreva**: "Oi"
3. **Resultado**: Receberá resposta automática! 🤖

---

## 📊 **STATUS FINAL:**

- ✅ **Meta Business Account**: Criada e verificada
- ✅ **WhatsApp Business**: Número configurado
- ✅ **API Credentials**: Token e Phone ID obtidos
- ✅ **Vercel Variables**: Configuradas
- ✅ **Webhook**: Ativo para receber mensagens
- ✅ **Envio Real**: Funcionando via API oficial
- ✅ **Recebimento**: Respostas automáticas ativas

---

## 💰 **CUSTOS:**

- **Setup**: 100% GRATUITO
- **Primeiras 1.000 conversas/mês**: GRATUITAS
- **Após 1.000**: $0.005 - $0.09 por conversa
- **Vercel**: Gratuito para este volume

---

## 🆘 **PRECISA DE AJUDA?**

### Se algo não funcionar:

1. **Verifique logs**: Vercel Dashboard → Functions → Logs
2. **Teste credenciais**: Dashboard WhatsApp Business
3. **Webhook status**: Meta Business Manager
4. **Execute script**: `node scripts/setup-whatsapp-business.js`

### Contatos de suporte:
- **Meta Business**: https://business.facebook.com/help/
- **Vercel**: https://vercel.com/help
- **Documentação**: https://developers.facebook.com/docs/whatsapp

---

## 🚀 **RESULTADO FINAL:**

**Você terá WhatsApp REAL funcionando 100% no Vercel!**

- 📱 Envio real de mensagens
- 🤖 Respostas automáticas
- 📊 Dashboard completo
- 📈 Escalável para milhares de mensagens
- ✅ 100% oficial e compliance