# Configuração do Twilio para Envio de Mensagens WhatsApp

## Visão Geral

O sistema Atendo agora envia automaticamente mensagens de boas-vindas via WhatsApp para novos leads capturados. As mensagens são personalizadas por país (Brasil, Argentina, Paraguai) e idioma.

## Passo 1: Criar Conta no Twilio

1. Acesse [twilio.com](https://www.twilio.com)
2. Clique em "Sign Up" e crie uma conta
3. Verifique seu email
4. Complete o perfil com informações da sua empresa

## Passo 2: Obter Credenciais

### Account SID e Auth Token

1. Acesse o [Console do Twilio](https://console.twilio.com)
2. No menu esquerdo, clique em **Account** → **Settings** (ou ícone de engrenagem)
3. Você verá:
   - **Account SID**: Identificador único da sua conta
   - **Auth Token**: Chave de autenticação secreta
4. Copie ambos os valores

### Número de WhatsApp

1. No menu esquerdo, vá para **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Você verá um número como `+1234567890` - este é seu **WhatsApp Sandbox Number**
3. Copie este número (será usado como `TWILIO_WHATSAPP_NUMBER`)

## Passo 3: Configurar Credenciais no Atendo

1. Acesse o painel de administração do Atendo
2. Vá para **Settings** → **Secrets**
3. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `TWILIO_ACCOUNT_SID` | Seu Account SID |
| `TWILIO_AUTH_TOKEN` | Seu Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | Seu número de WhatsApp (ex: +1234567890) |

4. Clique em **Save**

## Passo 4: Testar

1. Acesse a página de vendas do Atendo
2. Abra o pop-up de captura de WhatsApp (exit-intent)
3. Insira seu próprio número de telefone
4. Você deve receber uma mensagem de boas-vindas via WhatsApp em segundos

## Mensagens Personalizadas

As mensagens são automaticamente personalizadas por país:

### Brasil 🇧🇷
```
Olá! 👋 Bem-vindo ao Atendo!

Recebemos seu interesse em nosso sistema de gestão B2B para salões e clínicas.

Estamos aqui para ajudar você a:
✅ Organizar sua agenda
✅ Controlar seu financeiro
✅ Aumentar seus lucros com precificação inteligente

Um especialista entrará em contato em breve para agendar sua demonstração gratuita.

Dúvidas? Estamos aqui! 😊
```

### Argentina 🇦🇷
```
¡Hola! 👋 ¡Bienvenido a Atendo!

Recibimos tu interés en nuestro sistema de gestión B2B para salones y clínicas.

Estamos aquí para ayudarte a:
✅ Organizar tu agenda
✅ Controlar tus finanzas
✅ Aumentar tus ganancias con precios inteligentes

Un especialista se pondrá en contacto pronto para agendar tu demostración gratuita.

¿Preguntas? ¡Estamos aquí! 😊
```

### Paraguai 🇵🇾
Mesma mensagem que Argentina (espanhol neutro)

## Solução de Problemas

### Mensagens não estão sendo enviadas

1. **Verifique as credenciais**: Certifique-se de que `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` e `TWILIO_WHATSAPP_NUMBER` estão corretos
2. **Verifique o saldo**: Sua conta Twilio deve ter crédito suficiente
3. **Verifique os logs**: Acesse os logs do servidor para ver mensagens de erro
4. **Teste manualmente**: Use o console do Twilio para enviar um teste

### Erro: "Invalid phone number"

- Certifique-se de que o número inclui o código de país (ex: +5511987654321)
- O número deve estar em formato internacional

### Erro: "Unauthorized"

- Verifique se o `TWILIO_AUTH_TOKEN` está correto
- Regenere o token no console do Twilio se necessário

## Custos

Cada mensagem WhatsApp enviada via Twilio custa aproximadamente **$0.01 USD** (valores podem variar por país).

Você pode monitorar seus custos no [Console do Twilio](https://console.twilio.com) → **Billing** → **Usage**.

## Próximos Passos

1. **Escalabilidade**: Para enviar em massa, considere usar a função `sendBulkWhatsAppMessages()`
2. **Templates Customizados**: Edite os templates em `server/whatsapp.ts` para personalizar as mensagens
3. **Webhooks**: Configure webhooks do Twilio para rastrear entregas e leituras das mensagens

## Documentação Oficial

- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [Pricing](https://www.twilio.com/en-us/messaging/whatsapp/pricing)
