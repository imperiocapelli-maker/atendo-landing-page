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

## Toggle Mensal/Anual com Preços Separados

- [x] Criar toggle "Mensal / Anual" na página de planos
- [x] Adicionar preços mensais e anuais ao banco de dados
- [x] Criar preços separados no Stripe (Mensal e Anual)
- [x] Adicionar badges de economia "Economize 25% no anual"
- [x] Testar toggle e mudança de preços
- [ ] Validar checkout com ambos os períodos


## Sistema de Pagamento com Parcelamento (2x, 3x, 6x, 12x)

- [x] Atualizar preços anuais no banco (1.332, 2.232, 3.732, 5.976)
- [x] Criar preços parcelados no Stripe (2x, 3x, 6x, 12x para cada plano)
- [x] Implementar modal de checkout com seleção: Mensal vs Anual
- [x] Se Anual, mostrar opções de parcelamento (2x, 3x, 6x, 12x)
- [x] Integrar lógica de parcelamento no backend
- [x] Atualizar PlanCheckoutButton para novo fluxo
- [x] Criar componente PaymentOptionsModal
- [x] Testar fluxo completo de pagamento com parcelamento
- [x] Validar cálculo correto de parcelas sem juros
- [x] Testes unitários para sistema de parcelamento


## Seletor de Moeda Multi-Moeda (BRL, USD, ARS, PYG)

- [x] Criar contexto de moeda com suporte a múltiplas moedas
- [x] Adicionar seletor de moeda no header
- [x] Integrar conversão de preços em tempo real
- [x] Salvar preferência de moeda no localStorage
- [x] Testar conversão em todos os planos

## Correção de Preços Anuais com Desconto de 20%

- [x] Atualizar fórmula: Preço Anual = (Mensal × 12 × 0.80)
- [x] Essencial: R$ 1.065,60/ano (R$ 111 × 12 × 0.80)
- [x] Profissional: R$ 1.785,60/ano (R$ 186 × 12 × 0.80)
- [x] Premium: R$ 2.985,60/ano (R$ 311 × 12 × 0.80)
- [x] Scale: R$ 4.780,80/ano (R$ 498 × 12 × 0.80)
- [x] Recalcular preços parcelados com novos valores anuais
- [x] Testar conversão de moedas com novos preços

## Bug Fix: Opções de Parcelamento Duplicadas

- [x] Identificar duplicação de planos parcelados no banco (64 registros)
- [x] Remover planos parcelados duplicados (64 -> 16)
- [x] Testar fluxo de pagamento sem duplicação
- [x] Confirmar que aparecem apenas 6 opções (Mensal, Anual, 2x, 3x, 6x, 12x)
- [x] Validar preços corretos em todas as moedas (BRL, USD, ARS, PYG)


## Sistema de Cupom de Desconto

- [x] Criar tabela de cupons no banco de dados
- [x] Criar API para validar e aplicar cupons
- [x] Adicionar componente de input de cupom no modal de pagamento
- [x] Integrar desconto no resumo e checkout do Stripe
- [x] Testar fluxo completo de cupom de desconto
- [x] Criar cupons de teste (ex: DESCONTO10, PROMO20)
- [x] Testar cupom TESTE10 (10% desconto universal)
- [x] Validar desconto em plano Mensal
- [x] Validar desconto em plano Anual
- [x] Validar desconto em parcelamento (2x, 3x, 6x, 12x)
- [x] Criar cupom universal sem restrição de plano
- [x] Verificar cálculo correto de desconto em todas as moedas

## Bug: Botão "Continuar para Pagamento" Não Aparece

- [x] Diagnosticar por que botão estava fora da área visível
- [x] Corrigir altura/scroll do modal (adicionado max-h-[90vh] overflow-y-auto)
- [x] Testar se botão aparece em todas as resoluções
- [x] Validar fluxo completo de pagamento
- [x] Botão agora visível e acessível no modal

## Bug: Página de Planos com Duplicação e Nomes Errados

- [x] Investigar por que aparecem planos duplicados (Premium - 6x, Scale - 2x, etc)
- [x] Limpar dados duplicados do banco de dados (58 registros -> 28 corretos)
- [x] Recriar planos com preços corretos
- [x] Testar se página exibe apenas 4 planos principais
- [x] Página de planos agora exibindo corretamente

## Bug: Preço Diferente ao Escolher Parcelamento e Prosseguir

- [x] Investigar por que preço mudava ao escolher parcelamento (problema de centavos)
- [x] Corrigir cálculo de preço: dividir por 100 na API
- [x] Validar se preço enviado para Stripe está correto
- [x] Testar fluxo: escolher plano → escolher parcelas → prosseguir → validar preço
- [x] Preços agora corretos em todas as opções de pagamento
## 🔄 INTEGRAÇÃO STRIPE COM CUPOM DE DESCONTO

- [x] Analisar estrutura atual de checkout
- [x] Atualizar endpoint POST /api/checkout para validar e aplicar cupom

## 🎨 AJUSTES VISUAIS - LANDING PAGE

- [x] Corrigir imagem do salão que não está aparecendo (/images/hero-salon.jpg)
- [x] Corrigir overflow/clipping de conteúdo nas seções
- [x] Adicionar ícones nas funcionalidades (features section)
- [x] Melhorar responsividade mobile para imagens
- [x] Validar todas as imagens estão carregando corretamente lógica de desconto no Stripe (discount object)
- [x] Adicionar testes vitest para validação de desconto
- [x] Testar fluxo completo: aplicar cupom → checkout → Stripe
- [x] Validar que o cliente vê o desconto refletido no Stripe Checkout

## 🔧 CORREÇÃO: CONFLITO ENTRE allow_promotion_codes E discounts

- [x] Diagnosticar erro: "You may only specify one of these parameters: allow_promotion_codes, discounts"
- [x] Corrigir lógica em subscription.ts para usar APENAS discounts quando cupom aplicado
- [x] Usar allow_promotion_codes APENAS quando sem cupom aplicado
- [x] Testar fluxo corrigido no navegador
- [x] ✅ SUCESSO: Desconto refletido corretamente no Stripe Checkout

## Remover Página de Planos Desnecessária

- [x] Excluir arquivo client/src/pages/Plans.tsx
- [x] Remover rota /planos do App.tsx
- [x] Remover link "Planos" da navegação (Navbar)
- [x] Footer usa links dinâmicos (não precisa alterar)
- [x] Testar navegação e verificar links quebrados
- [x] Validar que fluxo de pagamento funciona apenas pela home
- [x] Página de planos removida com sucesso

## Corrigir Valores de Preços

- [x] Atualizar preços no banco de dados (111, 186, 311, 498)
- [x] Corrigir cálculo de conversão de moeda
- [x] Testar preços em todas as moedas
- [x] Validar que preços aparecem corretos na página
- [x] Preços agora exibindo corretamente: Essencial $30.698,16, Profissional $51.440,16, Premium $86.010,16, Scale $137.726,88


## Otimização de Taxa de Conversão

- [ ] Analisar funil de conversão atual (visitantes → clientes pagantes)
- [ ] Otimizar CTAs (Call-to-Action) - textos mais persuasivos
- [ ] Melhorar destaque da proposta de valor na home
- [ ] Adicionar mais depoimentos e social proof
- [ ] Otimizar formulário de checkout (remover campos desnecessários)
- [ ] Adicionar garantia de satisfação ou período de teste
- [ ] Implementar urgência (ex: "Oferta válida até...")
- [ ] Testar variações de cores nos botões
- [ ] Testar variações de textos nos CTAs
- [ ] Adicionar FAQ mais visível na home
- [ ] Implementar live chat para suporte em tempo real
- [ ] Criar página de objeções comuns e respostas


## Atualizar Pre\u00e7os Confirmados pelo Usu\u00e1rio

- [ ] Atualizar pre\u00e7os no banco de dados para os valores confirmados
- [ ] Atualizar pre\u00e7os hardcoded na p\u00e1gina Home.tsx
- [ ] Testar pre\u00e7os em todas as moedas (BRL, ARS, PYG)
- [ ] Validar modal de pagamento com novos pre\u00e7os
- [ ] Validar cupom de desconto com novos pre\u00e7os
- [ ] Fazer checkpoint final com pre\u00e7os corretos


## Atualizar Preços Confirmados

- [x] Atualizar preços no banco de dados (111, 186, 311, 498)
- [x] Atualizar preços hardcoded na página Home.tsx
- [x] Testar preços em BRL
- [x] Validar modal de pagamento
- [x] Validar todas as opções de parcelamento
- [x] Preços confirmados: Essencial R$ 111, Profissional R$ 186, Premium R$ 311, Scale R$ 498
- [x] Todos os preços exibindo corretamente em BRL
- [x] Parcelamento funcionando: 2x R$ 532,80, 3x R$ 355,20, 6x R$ 177,60, 12x R$ 88,80


## Criar Cupom HOMEPRO (30% Desconto Anual)

- [ ] Criar cupom HOMEPRO no banco de dados
- [ ] Configurar desconto de 30% apenas para planos anuais
- [ ] Testar cupom HOMEPRO no modal de pagamento
- [ ] Validar desconto em todos os 4 planos anuais
- [ ] Confirmar cálculo correto: Anual - 30% = novo valor


## ✅ CUPOM HOMEPRO CRIADO E TESTADO COM SUCESSO

- [x] Cupom HOMEPRO com 30% de desconto no plano anual
- [x] Testado e validado: R$ 1.065,60 -> R$ 745,92
- [x] Desconto aplicado: R$ 319,68 (30%)
- [x] Sistema 100% funcional

## 🔄 INTEGRAÇÃO STRIPE COM CUPOM DE DESCONTO

- [ ] Analisar estrutura atual de checkout
- [ ] Atualizar endpoint POST /api/checkout para validar e aplicar cupom
- [ ] Implementar lógica de desconto no Stripe (discount object)
- [ ] Adicionar testes vitest para validação de desconto
- [ ] Testar fluxo completo: aplicar cupom → checkout → Stripe
- [ ] Validar que o cliente vê o desconto refletido no Stripe Checkout

## Correções Mobile - Landing Page v2

- [x] Corrigir tamanho do título hero no mobile (text-3xl sm:text-4xl lg:text-6xl)
- [x] Aumentar tamanho dos ícones no mobile (w-8 h-8, container w-16 h-16)
- [x] Reduzir padding das seções no mobile (py-12 md:py-16 lg:py-24)
- [x] Reduzir gap entre colunas no mobile (gap-8 md:gap-12 lg:gap-16)
- [x] Corrigir altura da imagem do salão no mobile (h-[300px] md:h-[400px] lg:h-[500px])
