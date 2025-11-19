# 🔗 Configurar Webhook - WhatsApp Business API

## ✅ Status Atual

- ✅ Credenciais configuradas
- ✅ Mensagens sendo enviadas com sucesso
- ✅ API local funcionando
- ⏳ Webhook pendente (para receber mensagens)

## 🚀 Próximos Passos

### 1. Deploy no Vercel (Obrigatório para Webhook)

O webhook precisa de uma URL pública (https). Vamos fazer deploy:

```bash
# Se ainda não tem Vercel CLI instalado
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

Anote sua URL: `https://seu-app.vercel.app`

### 2. Configurar Variáveis no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:

```
WHATSAPP_PHONE_NUMBER_ID = 828176483721572
WHATSAPP_BUSINESS_TOKEN = EAARNNowaOo0BPzQWIDCfGsOjzxtdYREqMPMacZAiYz7yxPF6HmOjC1EbQS7oOShBMmyfZA9U1ZC46ZC7ZCRbZAqcyyjbhJPRwvFtfXNhYHskgxZAQ684uTHZB7nDWjlYgcMnUOnzWXzXGKvUUQ4JumrlqcQr9gV8myFk0qTLaVYt3lJgdIpEW8MZAmEbZAeUHyvb6K4ZCmJHAQZB9HdEi9ZCVabOnHOHyzUvqT7kIQsavp6Xo7HJStE1y8OaTBxPRtn25irXtYISFBmT061uyKrXtFlx5mEmR
WEBHOOK_VERIFY_TOKEN = agendmed_webhook_secreto_2024
```

5. Clique em **Save**
6. Faça redeploy: `vercel --prod`

### 3. Configurar Webhook no Meta

1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app
3. Vá em **WhatsApp** → **Configuration**
4. Na seção **Webhook**, clique em **Edit**

5. Preencha:
   - **Callback URL**: `https://seu-app.vercel.app/api/whatsapp/chatbot`
   - **Verify Token**: `agendmed_webhook_secreto_2024`

6. Clique em **Verify and Save**

7. Se der erro, teste manualmente:
```bash
curl "https://seu-app.vercel.app/api/whatsapp/chatbot?hub.mode=subscribe&hub.verify_token=agendmed_webhook_secreto_2024&hub.challenge=teste123"

# Deve retornar: teste123
```

### 4. Inscrever em Eventos

1. Após salvar o webhook, role para baixo
2. Clique em **Manage** em **Webhook Fields**
3. Marque:
   - ✅ **messages** (mensagens recebidas)
   - ✅ **message_status** (status de entrega)
4. Clique em **Save**

### 5. Testar o Chatbot

Agora você pode testar o chatbot completo:

1. Abra o WhatsApp no seu celular (número: **+55 65 99236-8778**)
2. Envie uma mensagem para: **+1 555 176 0380** (número de teste)
3. Digite: **oi**
4. Você deve receber o menu do chatbot! 🎉

## 📱 Comandos Disponíveis

```
oi, menu          → Menu principal
1, agendar        → Agendar consulta
2, consultar      → Ver agendamentos
3, cancelar       → Cancelar agendamento
4, especialidades → Listar especialidades
5, atendente      → Falar com humano
```

## 🧪 Testar Localmente (Sem Webhook)

Enquanto não configura o webhook, você pode testar localmente:

### Interface Visual
```
http://localhost:3001/dashboard/whatsapp/chatbot
```

### API Direta
```bash
# Enviar mensagem
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5565992368778",
    "message": "Olá! Esta é uma mensagem de teste."
  }'

# Testar chatbot
curl -X POST http://localhost:3001/api/whatsapp/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "oi",
    "from": "5565992368778"
  }'
```

## 🔍 Verificar Logs

### Vercel
```bash
vercel logs --follow
```

### Meta Dashboard
1. Vá em **WhatsApp** → **Insights**
2. Veja mensagens enviadas/recebidas
3. Verifique erros

## 🆘 Troubleshooting

### Webhook não verifica
```
✅ Verifique se a URL está correta (https)
✅ Confirme o verify token
✅ Teste manualmente com curl
✅ Veja logs do Vercel
```

### Mensagens não chegam no chatbot
```
✅ Webhook configurado?
✅ Eventos marcados (messages)?
✅ Veja logs: vercel logs
✅ Teste enviando "oi"
```

### Token expirado
```
⚠️ O token temporário expira em 24-72 horas
✅ Gere um token permanente:
   1. Meta Dashboard → Ferramentas → Tokens de Acesso
   2. Selecione sua conta comercial
   3. Gere token com permissões whatsapp_business_*
   4. Atualize no .env e Vercel
```

## 💡 Dicas

- ✅ Token temporário expira - gere um permanente
- ✅ Responda em 24h para não ser cobrado
- ✅ Use templates aprovados para mensagens proativas
- ✅ Monitore os logs regularmente

## 📊 Monitoramento

### Métricas Importantes
- Mensagens enviadas/recebidas
- Taxa de entrega
- Tempo de resposta
- Erros e falhas

### Ver no Meta Dashboard
1. **WhatsApp** → **Insights**
2. Veja gráficos e estatísticas
3. Monitore qualidade da conta

## 🎉 Pronto!

Após configurar o webhook, seu chatbot estará 100% funcional! 🚀

**Fluxo completo:**
```
Usuário envia "oi" → Webhook recebe → Chatbot processa → Responde com menu
```

**Teste agora:**
1. Configure o webhook (passos acima)
2. Envie "oi" no WhatsApp
3. Receba o menu do chatbot
4. Teste os comandos (1, 2, 3, 4, 5)

## 📚 Documentação

- [Guia Completo](./docs/WHATSAPP_BUSINESS_API_SETUP.md)
- [Guia Rápido](./docs/WHATSAPP_BUSINESS_RAPIDO.md)
- [Chatbot no Vercel](./docs/CHATBOT_VERCEL.md)

## 🤝 Suporte

Dúvidas? Consulte a documentação ou teste a interface visual em:
```
http://localhost:3001/dashboard/whatsapp/chatbot
```
