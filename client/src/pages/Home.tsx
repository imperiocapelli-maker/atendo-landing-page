import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, DollarSign, LayoutDashboard, Star, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/10 shadow-sm text-primary text-sm font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Novo: Precificação Inteligente 2.0
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-heading font-extrabold leading-tight text-foreground">
                Gestão, atendimento e <span className="text-primary relative">
                  lucro
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span> em um único sistema
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                O <strong>Atendo</strong> organiza sua agenda, controla seu financeiro e te ensina a precificar certo para crescer de forma previsível.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-xl shadow-soft hover:shadow-soft-hover transition-all transform hover:-translate-y-1">
                  Quero testar o sistema
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-muted/50">
                  Ver planos
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {["Agenda inteligente", "Controle financeiro", "Relatórios claros"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center animate-in slide-in-from-right-10 duration-1000 fade-in delay-200">
              <div className="relative z-10 w-full max-w-md lg:max-w-full">
                <div className="glass-card p-2 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="/images/dashboard-mockup.png" 
                    alt="Dashboard do Sistema Atendo" 
                    className="rounded-xl w-full shadow-2xl border border-border/50"
                  />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 glass p-4 rounded-2xl shadow-soft animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">Receita Hoje</p>
                      <p className="text-lg font-extrabold text-foreground">R$ 1.580,00</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 glass p-4 rounded-2xl shadow-soft animate-bounce duration-[4000ms] delay-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold">Novos Clientes</p>
                      <p className="text-lg font-extrabold text-foreground">+12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Seu negócio cresce, mas o <span className="text-destructive">controle não acompanha</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Salões e clínicas perdem dinheiro todos os dias por falta de controle, agenda desorganizada, preços mal calculados e decisões no “achismo”.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Agenda cheia, lucro baixo", desc: "Você trabalha muito, mas não vê a cor do dinheiro no final do mês.", icon: "😫" },
              { title: "Preço no 'achismo'", desc: "Cobra o que o vizinho cobra e não sabe se está pagando para trabalhar.", icon: "💸" },
              { title: "Falta de dados", desc: "Não sabe qual serviço dá mais lucro ou qual profissional performa melhor.", icon: "📊" }
            ].map((card, i) => (
              <div key={i} className="bg-muted/30 p-8 rounded-3xl border border-border hover:border-primary/30 transition-all hover:shadow-lg group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="/images/hero-salon.jpg" 
                alt="Salão organizado" 
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                A SOLUÇÃO COMPLETA
              </div>
              <h2 className="text-4xl font-heading font-bold">
                O Atendo resolve isso na raiz
              </h2>
              <p className="text-lg text-muted-foreground">
                Criado para quem quer <strong>organização, clareza e crescimento</strong>, o Atendo une gestão, atendimento e estratégia em uma única plataforma simples.
              </p>
              
              <div className="space-y-4">
                {[
                  "Tudo em um só lugar: Agenda, Financeiro e Estoque",
                  "Fácil de usar: Treine sua equipe em minutos",
                  "Pensado para salão, clínica e estética",
                  "Funciona no Brasil, Argentina e Paraguai"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="funcionalidades" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas poderosas simplificadas para o seu dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Agenda Inteligente", icon: <LayoutDashboard className="w-6 h-6" />, desc: "Organize horários por profissional e evite conflitos." },
              { title: "Controle Financeiro", icon: <DollarSign className="w-6 h-6" />, desc: "Saiba exatamente quanto entra e sai do seu caixa." },
              { title: "Gestão de Clientes", icon: <Users className="w-6 h-6" />, desc: "Histórico completo e preferências de cada cliente." },
              { title: "Relatórios Claros", icon: <TrendingUp className="w-6 h-6" />, desc: "Tome decisões baseadas em dados reais, não em achismos." },
              { title: "Metas e Comissões", icon: <Star className="w-6 h-6" />, desc: "Cálculo automático de comissões e acompanhamento de metas." },
              { title: "Automação WhatsApp", icon: <div className="i-lucide-message-circle w-6 h-6" />, desc: "Lembretes automáticos para reduzir faltas." },
              { title: "Assinatura Digital", icon: <div className="i-lucide-pen-tool w-6 h-6" />, desc: "Contratos e termos assinados digitalmente." },
              { title: "Precificação", icon: <div className="i-lucide-calculator w-6 h-6" />, desc: "Calcule o preço ideal para cada serviço." }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 bg-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIAL SECTION */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">
                Pare de cobrar no "achismo"
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                No plano Premium, você tem acesso à <strong>Precificação Inteligente</strong>, com tabelas e métodos claros para definir preços corretos com base nos seus custos, margem e realidade do negócio.
              </p>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Crescimento Seguro</h4>
                    <p className="text-blue-100 text-sm">Negócios que precificam certo crescem com mais segurança e lucro real, não apenas faturamento.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card bg-white/10 p-8 rounded-3xl border border-white/20">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Não é só sistema. É acompanhamento.</h3>
                <p className="text-blue-100">
                  No plano Premium, você recebe <strong>consultoria empresarial</strong> focada em organização, precificação e crescimento.
                </p>
                <ul className="space-y-3">
                  {["Orientação prática de especialistas", "Visão de dono para dono", "Decisões mais seguras", "Crescimento estruturado"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">✓</div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="planos" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Escolha o plano ideal para o seu momento
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece pequeno e cresça com a gente. Sem contratos de fidelidade abusivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ESSENTIAL */}
            <Card className="border-none shadow-soft hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardHeader className="pb-8">
                <div className="w-12 h-1 bg-blue-300 mb-6 rounded-full"></div>
                <CardTitle className="text-2xl">Essencial</CardTitle>
                <CardDescription className="text-base mt-2">Para quem quer sair da bagunça</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Agenda Simples", "Cadastro de Clientes", "Financeiro Básico", "Relatórios Simples"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-blue-100 text-primary hover:bg-blue-200 font-bold">Começar Agora</Button>
              </CardFooter>
            </Card>

            {/* PRO */}
            <Card className="border-2 border-primary shadow-2xl relative transform md:-translate-y-4 z-10">
              <div className="absolute top-0 left-0 w-full bg-primary text-white text-center text-xs font-bold py-1 uppercase tracking-wider">
                Mais Popular
              </div>
              <CardHeader className="pb-8 pt-10">
                <div className="w-12 h-1 bg-primary mb-6 rounded-full"></div>
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <CardDescription className="text-base mt-2">Para quem quer controle e gestão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Tudo do Essencial", "Financeiro Avançado", "Metas e Comissões", "Relatórios Completos", "Múltiplos Profissionais"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <Check size={16} className="text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-primary text-white hover:bg-primary/90 font-bold shadow-lg">Quero mais controle</Button>
              </CardFooter>
            </Card>

            {/* PREMIUM */}
            <Card className="border-none shadow-soft hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gray-900 text-white">
              <CardHeader className="pb-8">
                <div className="w-12 h-1 bg-secondary mb-6 rounded-full"></div>
                <CardTitle className="text-2xl text-white">Premium</CardTitle>
                <CardDescription className="text-base mt-2 text-gray-400">Para quem quer crescer com lucro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Tudo do Profissional", "Precificação Inteligente", "Consultoria Empresarial", "Relatórios Estratégicos", "Prioridade no Suporte"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="bg-secondary/20 p-1 rounded-full">
                      <Check size={12} className="text-secondary" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-secondary text-white hover:bg-secondary/90 font-bold shadow-lg border-none">Quero escalar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">
            Pare de improvisar. <br/>Comece a gerir de verdade.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            O Atendo é a base que seu negócio precisa para crescer com organização e lucro. Junte-se a centenas de gestores que transformaram seus negócios.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-10 py-6 rounded-xl shadow-soft hover:shadow-soft-hover transition-all transform hover:-translate-y-1">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
