# Atendo - Landing Page TODO

## Funcionalidades Completadas
- [x] Design Neumorfismo Suave com cores azul sereno e coral
- [x] Página de vendas completa com todas as seções
- [x] Botão flutuante de WhatsApp
- [x] Suporte multilíngue (Português e Espanhol)
- [x] Conversão automática de moedas (BRL, ARS, PYG)
- [x] Seletor de idioma flutuante
- [x] Seletor de moeda flutuante
- [x] Upgrade para backend com banco de dados

## Funcionalidades em Progresso
- [x] Integração com Stripe para pagamentos (estrutura)
- [x] Tabela de pedidos no banco de dados
- [x] Rotas de checkout do Stripe no backend
- [x] Botões de pagamento nos planos
- [ ] Webhooks do Stripe (pendente de configuração)
- [x] Página de sucesso/erro de pagamento
- [x] Histórico de pedidos do usuário

## Funcionalidades Futuras
- [x] Vídeo de Demonstração do sistema (carrossel animado)
- [x] Calculadora de ROI
- [x] Tabela de comparação interativa dos planos
- [x] Botão de agendamento Calendly (conectado com https://calendly.com/agendo-suporte)
- [x] FAQ dinâmico por região
- [x] Integração com chatbot de IA
- [x] Pop-up de captura de WhatsApp (exit-intent)
- [x] Integração com ferramenta de automação (Zapier/Make)
- [x] Dashboard de leads
- [x] Envio automático de mensagem WhatsApp
- [x] Seção de depoimentos de clientes
- [x] Reposicionar botão WhatsApp para canto inferior esquerdo
- [x] Adicionar logo do Atendo na Navbar e Footer
- [ ] Termos legais em PT e ES
- [x] Navbar com fundo azul e logo em texto branco
- [x] Animação de fade-in suave para itens do menu da navbar
- [x] Aumentar altura do modal Calendly para melhor visualização
- [x] Modal Calendly responsivo para dispositivos móveis
- [x] Corrigir modal Calendly cortado em mobile durante carregamento
- [x] Corrigir carregamento dos horários disponíveis do Calendly
- [x] Corrigir widget Calendly com iframe direto para carregar horários
- [x] Sincronização automática de agendamentos Calendly com WhatsApp
- [ ] Configurar CALENDLY_API_KEY para sincronização automática (opcional)

## Melhorias de UI/UX

- [x] Hero Section com background visual mais impactante (gradient background)
- [x] Seção de Features expandida com grid de 3-4 cards e animações stagger
- [x] Destaque do plano recomendado com badge "Mais Popular" e animação scale
- [x] CTAs flutuantes com FloatingCTA component
- [x] Seção de depoimentos com Social Proof (TestimonialsSection)
- [x] Animações e micro-interações (slide-in, scale, float, hover effects)
- [x] Otimização de responsividade mobile (FloatingCTA e Footer responsivos)
- [x] Footer melhorado com conteúdo útil (FooterImproved com newsletter)

## Funcionalidade de Cálculo de Custos e Precificação

- [x] Criar tabelas de banco de dados para custos fixos
- [x] Implementar API de cálculo de custos com tRPC
- [x] Criar serviço de cálculo de precificação inteligente
- [x] Implementar sugestão de precificação com margem de lucro
- [x] Adicionar testes unitários (9 testes passando)
- [ ] Criar interface de calculadora de custos para clientes
- [ ] Criar dashboard de visualização de custos

## Dashboard de Precificação Inteligente

- [x] Criar tabelas de banco para serviços e precificação
- [x] Implementar API tRPC para gerenciar serviços
- [x] Criar aba Parâmetros com inputs e gráfico pizza
- [x] Criar aba Definição de Serviços com tabela de serviços
- [x] Criar aba Dashboard de Preço com tabela completa e gráficos (bar, line, KPIs)
- [x] Integrar todas as abas em página única
- [x] Rota /dashboard/pricing disponível
- [x] Recriar Dashboard de Precificação exatamente como modelo do Google Sheets
- [x] Criar guia rápido (tutorial) sobre como preencher Parâmetros
- [x] Adicionar link do Dashboard de Precificação na seção de Funcionalidades

## Autenticação e Persistência de Dados

- [x] Atualizar schema para associar parâmetros ao usuário
- [x] Criar API tRPC para CRUD de configurações por usuário
- [x] Integrar autenticação no Dashboard de Precificação
- [x] Implementar persistência de dados no frontend
- [x] Criar testes unitários para autenticação e persistência (6 testes passando)
- [x] Proteger rota /dashboard/pricing com autenticação
- [x] Salvar configurações por usuário no banco de dados

## Nova Aba de Precificação com Isolamento por Usuário

- [x] Criar nova página `/dashboard/precificacao` separada
- [x] Integrar autenticação obrigatória na nova página
- [x] Implementar carregamento de dados por usuário
- [x] Adicionar rota no App.tsx
- [x] Testar isolamento de dados entre usuários
- [x] Testar adição de novo serviço (Pedicure Completo)
- [x] Verificar que dados são isolados por usuário

## Redesenho da Página Baseado em Planilha Google Sheets

- [x] Implementar estrutura de abas (Parâmetros, Como Atualizar, Dashboard de Preço)
- [x] Aba Parâmetros: Dados Financeiros com gráficos de pizza
- [x] Aba Como Atualizar: Tabela de Serviços, Comissões e Custos
- [x] Aba Dashboard de Preço: Tabela completa com cálculos e cores
- [x] Implementar fórmulas de cálculo automático
- [x] Adicionar gráficos (pizza, barras, linha)
- [x] Testar cálculos e visualizações
- [x] Verificar isolamento de dados por usuário
- [x] Corrigir cálculo de lucro médio

## Autenticação de Teste

- [x] Criar página de login de teste
- [x] Implementar endpoint de login de teste no backend
- [x] Integrar login de teste no frontend
- [x] Testar acesso à página de Precificação com usuário de teste
- [x] Página de login disponível em /test-login
- [x] Credenciais: teste@example.com / senha123

## Correção do Botão de Login de Teste

- [x] Investigar por que o botão "Entrar" não funciona
- [x] Corrigir endpoint tRPC de autenticação de teste
- [x] Criar página de demo sem autenticação (/demo)
- [x] Testar todas as abas do Dashboard
- [x] Verificar cálculos automáticos
- [x] Página de demo disponível e funcionando 100%

## Campos Editáveis de Precificação

- [x] Adicionar campos de entrada para Lucro Desejado
- [x] Adicionar campos de entrada para Marketing
- [x] Adicionar campos de entrada para Taxa de Cartão
- [x] Adicionar campos de entrada para Imposto
- [x] Adicionar campos de entrada para Custo Fixo + Investimento
- [x] Implementar atualização em tempo real do gráfico de pizza
- [x] Atualizar cálculos da tabela Dashboard de Preço em tempo real
- [x] Testar edição de parâmetros
- [x] Implementar botão "Restaurar Valores Padrão"
- [x] Página de demo disponível em /demo com campos editáveis

## Logo Atendo Consistente em Todo o Site

- [x] Criar componente de logo reutilizável
- [x] Atualizar paleta de cores (#175EF0, #FFFFFF, #3D4450)
- [x] Adicionar logo na Navbar
- [x] Adicionar logo no Footer
- [x] Adicionar logo no Dashboard de Precificação
- [x] Testar responsividade do logo
- [x] Garantir consistência visual em todas as páginas
- [x] Logo aparecendo em todas as páginas do site

## Favicon e Título da Aba do Navegador

- [x] Criar favicon do logo Atendo
- [x] Adicionar favicon em index.html
- [x] Atualizar título padrão da página
- [x] Adicionar título dinâmico em cada página
- [x] Testar favicon em todas as páginas
- [x] Testar título em todas as páginas
- [x] Favicon aparecendo em todas as abas do navegador
- [x] Título dinâmico funcionando em Home e Dashboard

## Melhorias no Logo Atendo

- [x] Atualizar letra "A" para branco
- [x] Aumentar tamanho e destaque do logo
- [x] Atualizar favicon com letra branca
- [x] Testar logo em todas as páginas
- [x] Logo com letra branca muito mais destacada
- [x] Favicon atualizado com letra branca
- [x] Consistência visual em todas as páginas

## Correção de Espaçamento de Texto

- [x] Corrigir "lucroem" para "lucro em" na página Home
- [x] Texto renderizado corretamente com espaço entre "lucro" e "em"
- [x] Testado no navegador e funcionando

## Correção de Cor do Logo na Navbar

- [x] Alterar letra "A" do logo de preto para branco
- [x] Testar logo branco na Navbar
- [x] Logo agora aparece em branco na Navbar
- [x] Adicionado prop textColor ao componente AtendoLogo

## Integração Stripe - Pagamento de Planos/Assinatura

- [x] Adicionar feature Stripe ao projeto
- [x] Criar tabelas de Planos e Assinaturas no banco
- [x] Implementar endpoints tRPC para criar/gerenciar assinaturas
- [x] Criar página de Planos com botões de "Assinar"
- [x] Integrar Stripe Checkout
- [x] Implementar webhook para processar eventos
- [x] Criar testes unitários para subscription (5 testes passando)
- [x] Criar seed automático de planos na inicialização
- [x] Página de planos exibindo 3 planos corretamente
- [x] Fluxo de Stripe Checkout funcionando
- [ ] Criar dashboard de assinatura para usuário
- [ ] Testar fluxo completo de assinatura com pagamento real

## Configuração de Chaves API do Stripe

- [x] Obter chaves API do Stripe (Publishable Key e Secret Key)
- [x] Configurar variáveis de ambiente STRIPE_PUBLISHABLE_KEY e STRIPE_SECRET_KEY
- [x] Testar conexão com Stripe (27 testes passando)
- [x] Página /planos exibindo 3 planos de assinatura
- [x] Fluxo de checkout Stripe funcionando
- [ ] Validar webhooks do Stripe com pagamentos reais

## Fluxo de Pagamento Sem Autenticação

- [x] Remover requisito de autenticação do endpoint createCheckoutSession
- [x] Permitir checkout com email apenas (sem login)
- [x] Atualizar página Plans.tsx para remover verificação de isAuthenticated
- [x] Campo de email adicionado na página de planos
- [x] Fluxo completo testado: email -> checkout Stripe funcionando
- [ ] Atualizar webhook para criar usuário após pagamento bem-sucedido
- [ ] Criar página de sucesso após pagamento (checkout-success)

## Email de Boas-vindas com Credenciais

- [x] Criar tabela de usuários pendentes (pending_users)
- [x] Gerar senha temporária após pagamento
- [x] Implementar webhook customer.subscription.created
- [x] Configurar envio de email com credenciais (nodemailer)
- [x] Criar página /checkout-success com instruções
- [x] Adicionar rota /checkout-success no App.tsx
- [x] Criar testes de email service (7 testes passando)
- [ ] Testar fluxo completo: pagamento -> email -> login (manual)

## Debug - Bot\u00e3o de Assinatura n\u00e3o Funciona

- [ ] Verificar console do navegador para erros
- [ ] Testar endpoint createCheckoutSession
- [ ] Verificar se email est\u00e1 sendo preenchido corretamente
- [ ] Corrigir problema e testar novamente

## Debug - Bot\u00f5## Debug - Botões de Assinatura não Funcionam

- [x] Identificar qual página de planos está sendo usada (Plans.tsx)
- [x] Encontrar problema: import de useState faltando
- [x] Adicionar import de useState ao Plans.tsx
- [x] Testar botões - FUNCIONANDO 100%

## Fluxo de Checkout Direto (com Modal)

- [x] Criar modal para solicitar email ao clicar em "Assinar Agora"
- [x] Validar email antes de ir ao Stripe
- [x] Redirecionar para Stripe Checkout com sucesso
- [x] Testar fluxo completo: clique -> modal -> Stripe (FUNCIONANDO 100%)
- [x] Todos os 4 botões de planos funcionando corretamente
- [x] Modal aparecendo com email pré-preenchido
- [x] Redirecionamento para Stripe Checkout confirmado

## Debug - Erro## Debug - Botão Premium não Mostra Modal

- [x] Verificar arquivo Home.tsx para ver como botão Premium está configurado
- [x] Encontrar problema: mapeamento duplicado de "premium" e "scale" para "Enterprise"
- [x] Corrigir PlanCheckoutButton.tsx com lógica especial para Scale
- [x] Testar botão Premium - FUNCIONANDO 100%
- [x] Todos os 4 botões de planos funcionando perfeitamente

## Teste Grátis por 15 Dias

- [ ] Criar botão destacado na homepage para "Teste Grátis por 15 Dias"
- [ ] Implementar lógica de trial de 15 dias no banco de dados
- [ ] Adicionar campo trial_end_date na tabela de usuários
- [ ] Integrar com Stripe para cobrança automática após 15 dias
- [ ] Criar webhook para processar fim do trial e cobrar automaticamente
- [ ] Testar fluxo completo de trial -> cobrança automática
- [ ] Criar página de boas-vindas para usuários em trial
- [ ] Adicionar indicador visual de dias restantes do trial

## Indicador Visual de Trial

- [x] Criar componente de indicador de dias restantes do trial
- [x] Integrar indicador no painel/dashboard do usuário
- [x] Adicionar barra de progresso visual
- [x] Testar indicador em diferentes cenários (1 dia, 7 dias, 14 dias)

## Ícones das Funcionalidades

- [x] Adicionar ícones para as 8 funcionalidades (Agenda, Financeiro, Clientes, Relatórios, Metas, WhatsApp, Assinatura, Precificação)
