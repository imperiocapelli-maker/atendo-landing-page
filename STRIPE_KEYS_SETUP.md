# Configurar Chaves do Stripe no Manus

## Passo 1: Obter as Chaves do Stripe

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Clique em **"Developers"** no menu superior
3. Clique em **"API Keys"**
4. Você verá duas chaves:
   - **Publishable Key** (começa com `pk_test_` ou `pk_live_`)
   - **Secret Key** (começa com `sk_test_` ou `sk_live_`)

## Passo 2: Adicionar as Chaves no Manus

### Via Management UI (Recomendado):

1. Acesse o Management UI do seu projeto Atendo
2. Clique em **"Settings"** (engrenagem no painel)
3. Clique em **"Secrets"** na barra lateral
4. Procure por `STRIPE_PUBLIC_KEY` e `STRIPE_SECRET_KEY`
5. Se não existirem, clique em **"Add Secret"** e adicione:
   - **Key:** `STRIPE_PUBLIC_KEY`
   - **Value:** Cole sua Publishable Key do Stripe
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Cole sua Secret Key do Stripe

### Via CLI (Alternativa):

```bash
# Adicionar Stripe Public Key
manus secret set STRIPE_PUBLIC_KEY "pk_test_..."

# Adicionar Stripe Secret Key
manus secret set STRIPE_SECRET_KEY "sk_test_..."
```

## Passo 3: Testar o Checkout

1. Volte para a página do Atendo
2. Clique em qualquer botão **"Começar Agora"** em um plano
3. Use o cartão de teste do Stripe:
   - **Número:** `4242 4242 4242 4242`
   - **Data:** Qualquer data futura (ex: 12/25)
   - **CVC:** Qualquer número de 3 dígitos (ex: 123)

## Passo 4: Migrar para Produção

Quando estiver pronto para aceitar pagamentos reais:

1. No Stripe Dashboard, clique em **"Activate your account"**
2. Complete o processo de verificação
3. Obtenha suas chaves de produção (`pk_live_` e `sk_live_`)
4. Atualize as chaves no Manus com as chaves de produção
5. Teste novamente com um cartão real

## Troubleshooting

### Erro: "STRIPE_SECRET_KEY is not configured"
- Verifique se você adicionou a chave no painel Secrets
- Reinicie o servidor após adicionar a chave
- Verifique se a chave começa com `sk_test_` ou `sk_live_`

### Erro: "Invalid API Key"
- Verifique se você copiou a chave completa (sem espaços)
- Verifique se está usando a chave correta (Secret Key, não Publishable Key)
- Verifique se a chave não foi revogada no Stripe Dashboard

### Erro: "Unsupported currency"
- Verifique se está usando BRL, ARS ou PYG
- Verifique se o Stripe suporta a moeda selecionada

## Documentação Oficial

- [Stripe API Keys](https://stripe.com/docs/keys)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
