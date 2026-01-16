# Configuração do Zapier/Make para Automação de Leads

Este documento explica como configurar a integração com Zapier ou Make para automatizar o contato com leads capturados.

## 1. Obter a URL do Webhook

### Opção A: Usando Zapier

1. Acesse [zapier.com](https://zapier.com) e faça login
2. Clique em "Create" → "Zap"
3. Procure por "Webhooks by Zapier"
4. Selecione "Catch Raw Hook"
5. Copie a URL do webhook fornecida (ex: `https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/`)

### Opção B: Usando Make (antigo Integromat)

1. Acesse [make.com](https://make.com) e faça login
2. Clique em "Create a new scenario"
3. Procure por "Webhooks"
4. Selecione "Custom Webhook"
5. Copie a URL do webhook fornecida

## 2. Configurar a Variável de Ambiente

1. Vá para o painel de Secrets do seu projeto Manus
2. Adicione uma nova variável:
   - **Chave**: `ZAPIER_WEBHOOK_URL`
   - **Valor**: Cole a URL do webhook que você copiou

Exemplo:
```
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

## 3. Estrutura do Payload Recebido

Quando um lead é capturado, o seguinte JSON será enviado para seu webhook:

```json
{
  "phoneNumber": "+55 (11) 98765-4321",
  "country": "br",
  "language": "pt",
  "currency": "BRL",
  "source": "exit_intent",
  "timestamp": "2024-01-16T12:34:56.789Z",
  "message": "Novo lead capturado: +55 (11) 98765-4321"
}
```

## 4. Configurar Ações no Zapier

### Exemplo: Enviar mensagem via WhatsApp

1. Após "Catch Raw Hook", clique em "+"
2. Procure por "WhatsApp Business" ou "Twilio"
3. Selecione "Send Message"
4. Mapeie os campos:
   - **To**: `phoneNumber` (do webhook)
   - **Message**: Customize a mensagem de boas-vindas

### Exemplo: Adicionar a Google Sheets

1. Após "Catch Raw Hook", clique em "+"
2. Procure por "Google Sheets"
3. Selecione "Create Spreadsheet Row"
4. Mapeie os campos:
   - **Phone**: `phoneNumber`
   - **Country**: `country`
   - **Language**: `language`
   - **Timestamp**: `timestamp`

### Exemplo: Enviar Email

1. Após "Catch Raw Hook", clique em "+"
2. Procure por "Gmail" ou "SendGrid"
3. Selecione "Send Email"
4. Configure o email de notificação

## 5. Testar a Integração

1. Vá para a página de vendas do Atendo
2. Simule um lead capturando um número de WhatsApp (use o exit-intent popup)
3. Verifique se o webhook foi acionado no Zapier/Make
4. Confirme que as ações foram executadas (email enviado, planilha atualizada, etc.)

## 6. Monitorar Leads

Você pode visualizar o status dos leads capturados através da API:

```bash
# Listar todos os leads
curl https://seu-dominio.com/api/trpc/leads.listLeads

# Listar leads por status
curl https://seu-dominio.com/api/trpc/leads.listLeadsByStatus?input={"status":"new"}

# Obter estatísticas
curl https://seu-dominio.com/api/trpc/leads.getStats
```

## 7. Troubleshooting

### Webhook não está recebendo dados

- Verifique se a URL do webhook está correta em `ZAPIER_WEBHOOK_URL`
- Confirme que o webhook está ativo no Zapier/Make
- Verifique os logs do seu projeto para erros

### Dados incompletos

- Certifique-se de que o lead foi capturado corretamente
- Verifique se todos os campos obrigatórios estão sendo enviados

### Webhook falhou

- O sistema tentará reenviar automaticamente
- Verifique o status do webhook em `zapierWebhookSent` na tabela de leads
- Consulte os logs para mais detalhes

## 8. Próximos Passos

- Configurar automações mais complexas (CRM, SMS, etc.)
- Criar fluxos de follow-up automático
- Integrar com seu sistema de vendas existente
- Configurar relatórios e análises de leads

Para mais informações, consulte:
- [Documentação do Zapier](https://zapier.com/help)
- [Documentação do Make](https://www.make.com/en/help)
