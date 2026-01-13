# Configuração do Calendly na Landing Page Atendo

## O que é Calendly?

Calendly é uma ferramenta de agendamento online que permite que seus visitantes marquem demonstrações e consultoria diretamente na sua landing page, sem necessidade de emails ou ligações.

## Como Configurar

### Passo 1: Criar Conta no Calendly

1. Acesse [calendly.com](https://calendly.com)
2. Clique em "Sign Up" (Inscrever-se)
3. Escolha entre:
   - **Free**: Até 1 tipo de evento, calendário básico
   - **Premium**: Múltiplos eventos, automações, integrações avançadas (recomendado)
4. Complete o cadastro com seus dados

### Passo 2: Criar um Evento de Demonstração

1. No painel do Calendly, clique em "Create Event Type"
2. Configure:
   - **Event Name**: "Demonstração Atendo" ou "Demo Atendo"
   - **Duration**: 30 minutos (recomendado)
   - **Event Color**: Escolha uma cor que combine com sua marca (azul primário)
   - **Description**: "Conheça o Atendo e veja como pode transformar seu negócio"
   - **Location**: Videoconferência (Zoom, Google Meet, etc.)

3. Configure a disponibilidade:
   - Defina os dias e horários que você está disponível
   - Adicione um buffer entre agendamentos (ex: 15 minutos)
   - Configure fuso horário (Brasil: UTC-3, Argentina: UTC-3, Paraguai: UTC-4)

4. Salve o evento

### Passo 3: Obter sua URL do Calendly

1. Após criar o evento, copie a URL que aparece
2. Deve ser algo como: `https://calendly.com/seu-usuario/demo`
3. Você também pode acessar seu perfil e copiar o link do evento

### Passo 4: Integrar na Landing Page Atendo

1. Abra o arquivo `client/src/pages/Home.tsx`
2. Procure pela linha:
   ```typescript
   const calendlyUrl = "https://calendly.com/seu-usuario/demo";
   ```
3. Substitua `seu-usuario` pelo seu usuário do Calendly
4. Substitua `demo` pelo nome do seu evento (se diferente)
5. Salve o arquivo

**Exemplo:**
```typescript
// Antes:
const calendlyUrl = "https://calendly.com/seu-usuario/demo";

// Depois:
const calendlyUrl = "https://calendly.com/joao-silva/demo-atendo";
```

### Passo 5: Testar a Integração

1. Acesse a landing page do Atendo
2. Clique em qualquer botão "Agendar Demonstração"
3. O modal do Calendly deve abrir
4. Teste agendando um horário para confirmar que funciona

## Locais onde o Botão Aparece

O botão "Agendar Demonstração" está integrado em 3 locais principais:

1. **Hero Section** (topo da página)
   - Botão secundário ao lado do CTA principal
   - Texto: "Agendar Demo"

2. **Seção de Comparação de Planos**
   - Botão abaixo da tabela de comparação
   - Texto: "Agendar Demonstração Agora"

3. **CTA Final**
   - Botão ao lado do CTA principal
   - Texto: "Agendar Demonstração"

## Personalizações Avançadas

### Pré-preenchimento de Dados

Você pode passar informações do visitante para o Calendly usando parâmetros de URL:

```typescript
const calendlyUrl = "https://calendly.com/seu-usuario/demo?name=João&email=joao@email.com";
```

### Múltiplos Tipos de Evento

Se você tiver diferentes tipos de demonstração (ex: para salões vs clínicas):

```typescript
// Para salões
const calendlyUrlSalao = "https://calendly.com/seu-usuario/demo-salao";

// Para clínicas
const calendlyUrlClinica = "https://calendly.com/seu-usuario/demo-clinica";
```

### Customizar Cores do Modal

Edite o arquivo `client/src/components/CalendlyModal.tsx` para mudar cores e estilos.

## Integrações Recomendadas

Configure no Calendly para melhorar a experiência:

1. **Zoom/Google Meet**: Cria automaticamente link de videoconferência
2. **Email**: Envia confirmação automática para o visitante
3. **CRM**: Integre com seu sistema de gestão de leads (se tiver)
4. **Slack**: Receba notificações quando alguém agendar

## Troubleshooting

### O Calendly não aparece no modal

- Verifique se a URL está correta
- Certifique-se de que o evento está publicado no Calendly
- Limpe o cache do navegador (Ctrl+Shift+Delete)

### Horários não aparecem

- Verifique se você configurou disponibilidade no Calendly
- Confirme que o fuso horário está correto
- Adicione mais horários disponíveis

### Visitantes recebem erro 404

- A URL pode estar incorreta
- O evento pode ter sido deletado no Calendly
- Verifique se o usuário/evento existem

## Dicas de Conversão

1. **Ofereça valor claro**: Na descrição, deixe claro o que o visitante ganhará com a demo
2. **Horários flexíveis**: Ofereça múltiplos horários (manhã, tarde, noite)
3. **Timezone automático**: O Calendly detecta automaticamente o fuso horário do visitante
4. **Follow-up**: Configure emails automáticos após o agendamento
5. **Lembrete**: Calendly envia lembretes automáticos para reduzir no-shows

## Suporte

- **Documentação Calendly**: https://help.calendly.com
- **Email**: support@calendly.com
- **Chat**: Disponível no site do Calendly

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
