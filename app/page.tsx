import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Building2, 
  Heart, 
  Leaf, 
  Package, 
  TrendingDown, 
  Users,
  CheckCircle2,
  Utensils,
  Recycle,
  Target,
  Award,
  MapPin,
  Handshake
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-card py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Leaf className="h-4 w-4" />
                  Alinhado à PNCPDA - Lei nº 15.224/2025
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                  Combate à perda e ao <span className="text-primary">desperdício</span> de alimentos
                </h1>
                <p className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed text-pretty">
                  Plataforma alinhada à Política Nacional de Combate à Perda e ao Desperdício de
                  Alimentos. Atuamos em toda a cadeia — da produção ao descarte — conectando empresas,
                  instituições e poder público com rastreabilidade e transparência.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href="/cadastro?tipo=empresa">
                      <Building2 className="h-5 w-5" />
                      Sou Empresa
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href="/cadastro?tipo=instituicao">
                      <Heart className="h-5 w-5" />
                      Sou Instituição
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Hero Illustration */}
              <div className="relative hidden lg:block">
                <div className="relative mx-auto h-96 w-96">
                  {/* Central circle */}
                  <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-lg">
                    <Utensils className="h-16 w-16 text-primary-foreground" />
                  </div>
                  
                  {/* Orbiting elements */}
                  <div className="absolute left-0 top-1/4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent shadow-md">
                    <Building2 className="h-10 w-10 text-accent-foreground" />
                  </div>
                  <div className="absolute right-0 top-1/4 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary shadow-md">
                    <Heart className="h-10 w-10 text-secondary-foreground" />
                  </div>
                  <div className="absolute bottom-8 left-1/4 flex h-16 w-16 items-center justify-center rounded-xl bg-muted shadow-md">
                    <Recycle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute bottom-8 right-1/4 flex h-16 w-16 items-center justify-center rounded-xl bg-muted shadow-md">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Connecting lines */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 384 384">
                    <path d="M80 130 L160 192" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-border" fill="none" />
                    <path d="M304 130 L224 192" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-border" fill="none" />
                    <path d="M120 320 L176 224" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-border" fill="none" />
                    <path d="M264 320 L208 224" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-border" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        {/* Problem Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                O problema do desperdício de alimentos
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                No Brasil, toneladas de alimentos são desperdiçados diariamente enquanto milhões de pessoas passam fome. 
                Esse paradoxo precisa acabar.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-foreground">30%</h3>
                  <p className="text-muted-foreground">
                    dos alimentos produzidos são desperdiçados antes de chegar ao consumidor
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-foreground">33 milhões</h3>
                  <p className="text-muted-foreground">
                    de brasileiros vivem em situação de insegurança alimentar grave
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
                    <Package className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-foreground">46 milhões</h3>
                  <p className="text-muted-foreground">
                    de toneladas de alimentos são perdidos anualmente no país
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Nossa solução</h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Mais que um app de doação, o Fome Zero é uma solução tecnológica alinhada a uma política
                pública nacional. Atuamos em toda a cadeia alimentar — produção, distribuição, consumo e
                descarte — promovendo redistribuição segura, monitoramento de dados e responsabilidade
                compartilhada.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border bg-background transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Para Empresas</h3>
                  <p className="text-muted-foreground">
                    Cadastre seus excedentes de alimentos e contribua com a comunidade, 
                    reduzindo perdas e gerando impacto social positivo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-background transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Para Instituições</h3>
                  <p className="text-muted-foreground">
                    Acesse doações disponíveis na sua região, visualize informações nutricionais 
                    e gerencie o recebimento de alimentos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-background transition-shadow hover:shadow-lg md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Recycle className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Sustentabilidade</h3>
                  <p className="text-muted-foreground">
                    Contribua para os Objetivos de Desenvolvimento Sustentável da ONU, 
                    especialmente o ODS 2 - Fome Zero.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Como funciona
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Um processo simples e organizado para conectar quem tem com quem precisa.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  step: 1,
                  title: "Empresa cadastra alimentos",
                  description: "A empresa registra os alimentos disponíveis para doação, informando quantidade, validade e condições.",
                  icon: Package
                },
                {
                  step: 2,
                  title: "Instituições visualizam",
                  description: "Instituições cadastradas podem ver todas as doações disponíveis na região.",
                  icon: Users
                },
                {
                  step: 3,
                  title: "Solicitação de doação",
                  description: "A instituição interessada solicita a doação diretamente pela plataforma.",
                  icon: Heart
                },
                {
                  step: 4,
                  title: "Confirmação da empresa",
                  description: "A empresa confirma a solicitação e organiza os detalhes.",
                  icon: CheckCircle2
                },
                {
                  step: 5,
                  title: "Entrega realizada",
                  description: "A instituição retira ou recebe os alimentos no local combinado.",
                  icon: MapPin
                },
                {
                  step: 6,
                  title: "Registro no sistema",
                  description: "O sistema registra a entrega, gerando métricas de impacto e histórico.",
                  icon: Target
                }
              ].map((item) => (
                <Card key={item.step} className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <span className="text-3xl font-bold text-primary/30">{item.step.toString().padStart(2, '0')}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/como-funciona">
                  Ver detalhes completos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-primary py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Nosso impacto social
              </h2>
              <p className="mb-12 text-lg text-primary-foreground/80 leading-relaxed">
                Cada doação faz a diferença. Veja os resultados da nossa rede solidária.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "12.500", label: "Kg de alimentos redistribuídos", icon: Package },
                { value: "48", label: "Instituições atendidas", icon: Heart },
                { value: "156", label: "Empresas participantes", icon: Building2 },
                { value: "25.000", label: "Refeições estimadas", icon: Utensils },
              ].map((stat, index) => (
                <Card key={index} className="border-0 bg-primary-foreground/10 backdrop-blur">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20">
                      <stat.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="mb-1 text-3xl font-bold text-primary-foreground">{stat.value}</h3>
                    <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/impacto">
                  Ver relatório completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Parceiros e apoiadores
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Empresas e organizações que acreditam na nossa missão e fazem a diferença.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Supermercado Vida", type: "Empresa Doadora" },
                { name: "Restaurante Sabor & Cia", type: "Empresa Doadora" },
                { name: "Padaria Pão Quente", type: "Empresa Doadora" },
                { name: "Lar dos Idosos", type: "Instituição Beneficiada" },
                { name: "Casa da Criança", type: "Instituição Beneficiada" },
                { name: "Comunidade São José", type: "Instituição Beneficiada" },
                { name: "Prefeitura Municipal", type: "Apoiador Institucional" },
                { name: "ONG Alimentar", type: "Apoiador Institucional" },
              ].map((partner, index) => (
                <Card key={index} className="border-border bg-card">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Handshake className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">{partner.name}</h3>
                    <p className="text-xs text-muted-foreground">{partner.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/cadastro">
                  Seja um parceiro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Award className="mx-auto mb-6 h-16 w-16 text-accent-foreground" />
              <h2 className="mb-6 text-3xl font-bold text-accent-foreground md:text-4xl">
                Faça parte dessa rede solidária
              </h2>
              <p className="mb-10 text-lg text-accent-foreground/80 leading-relaxed">
                Junte-se a empresas e instituições que já estão transformando excedentes em esperança. 
                Cadastre-se agora e comece a fazer a diferença.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90" asChild>
                  <Link href="/cadastro">Cadastrar agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                  <Link href="/sobre">Saiba mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
