# ⚡ WhatsApp Business API - Guia Rápido (10 minutos)

## 🎯 Configuração Rápida

### 1️⃣ Criar Conta (2 min)

```
1. Acesse: https://developers.facebook.com/
2. Clique em "Começar"
3. Faça login com Facebook
4. Aceite os termos
```

### 2️⃣ Criar App (2 min)

```
1. "Meus Apps" → "Criar App"
2. Tipo: "Empresa"
3. Nome: "AgendMed Bot"
4. Email: seu@email.com
5. Criar App
```

### 3️⃣ Adicionar WhatsApp (1 min)

```
1. Procure "WhatsApp"
2. Clique em "Configurar"
3. Selecione/Crie conta comercial
```

### 4️⃣ Copiar Credenciais (2 min)

```
1. Vá em "API Setup"
2. Copie:
   - Phone Number ID: 123456789012345
   - Access Token: EAAxxxxxxxxxxxxx
3. Guarde em local seguro
```

### 5️⃣ Adicionar Número de Teste (1 min)

```
1. Em "API Setup" → "To"
2. Clique "Add phone number"
3. Digite: +5511999999999
4. Receba código no WhatsApp
5. Digite o código
```

### 6️⃣ Configurar .env (1 min)

```env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_TOKEN=EAAxxxxxxxxxxxxx
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

### 7️⃣ Deploy no Vercel (1 min)

```bash
git add .
git commit -m "Add WhatsApp config"
git push
```

Anote sua URL: `https://seu-app.vercel.app`

### 8️⃣ Configurar Webhook (2 min)

```
1. No Meta: "WhatsApp" → "Configuration"
2. Clique "Edit" em Webhook
3. Preencha:
   - URL: https://seu-app.vercel.app/api/whatsapp/chatbot
   - Token: meu_token_secreto_123
4. "Verify and Save"
5. Marque: ✅ messages ✅ message_status
6. Save
```

### 9️⃣ Testar! (1 min)

```
1. Abra WhatsApp no celular
2. Envie "oi" para o número configurado
3. Receba o menu do bot! 🎉
```

## 🧪 Teste Rápido via API

```bash
# Enviar mensagem
curl -X POST https://seu-app.vercel.app/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "message": "Olá do AgendMed!"
  }'
```

## ✅ Checklist

- [ ] Conta Meta criada
- [ ] App criado
- [ ] WhatsApp adicionado
- [ ] Credenciais copiadas
- [ ] Número de teste adicionado
- [ ] .env configurado
- [ ] Deploy feito
- [ ] Webhook configurado
- [ ] Teste realizado

## 🎉 Pronto!

Seu chatbot está funcionando! 🚀

**Teste agora:**
- Envie "oi" no WhatsApp
- Ou acesse: `/dashboard/whatsapp/chatbot`

## 📚 Próximos Passos

1. [Guia Completo](./WHATSAPP_BUSINESS_API_SETUP.md)
2. [Personalizar Chatbot](./CHATBOT_VERCEL.md)
3. [Adicionar IA](./CHATBOT_VERCEL.md#adicionar-ia)

## 🆘 Problemas?

### Webhook não funciona
```bash
# Teste manualmente
curl "https://seu-app.vercel.app/api/whatsapp/chatbot?hub.mode=subscribe&hub.verify_token=meu_token_secreto_123&hub.challenge=teste"
```

### Mensagem não envia
- ✅ Verifique token no .env
- ✅ Confirme número está verificado
- ✅ Veja logs: `vercel logs`

### Não recebe mensagens
- ✅ Webhook configurado?
- ✅ Eventos marcados?
- ✅ URL correta (https)?

## 💡 Dicas

- Token temporário expira em 24h
- Use número de teste para começar
- 1.000 conversas/mês grátis
- Responda em 24h (janela gratuita)

## 🔗 Links Úteis

- [Meta Developers](https://developers.facebook.com/)
- [Documentação](https://developers.facebook.com/docs/whatsapp)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
