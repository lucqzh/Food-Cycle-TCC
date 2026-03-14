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
  Recycle
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Leaf className="h-4 w-4" />
                ODS 2 - Fome Zero e Agricultura Sustentável
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                Transformando excedentes em <span className="text-primary">esperança</span>
              </h1>
              <p className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed text-pretty">
                Conectamos empresas com excedentes de alimentos a instituições que precisam. 
                Juntos, reduzimos o desperdício e combatemos a fome na nossa cidade.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/cadastro?tipo=empresa">
                    <Building2 className="h-5 w-5" />
                    Sou Empresa
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <Link href="/cadastro?tipo=instituicao">
                    <Heart className="h-5 w-5" />
                    Sou Instituição
                  </Link>
                </Button>
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
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20">
                    <Package className="h-8 w-8 text-secondary" />
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
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Nossa solução
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                O Fome Zero é uma plataforma que conecta empresas que possuem excedentes de alimentos 
                com instituições carentes que precisam desses alimentos, de forma organizada e eficiente.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Para Empresas</h3>
                  <p className="text-muted-foreground">
                    Cadastre seus excedentes de alimentos e contribua com a comunidade, 
                    reduzindo perdas e gerando impacto social positivo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Para Instituições</h3>
                  <p className="text-muted-foreground">
                    Acesse doações disponíveis na sua região, visualize informações nutricionais 
                    e gerencie o recebimento de alimentos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Recycle className="h-6 w-6 text-primary" />
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
            
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                {/* Vertical line for desktop */}
                <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:left-1/2 md:-ml-px md:block" />
                
                <div className="flex flex-col gap-8">
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
                      title: "Confirmação e retirada",
                      description: "A empresa confirma e organiza a retirada ou entrega dos alimentos.",
                      icon: CheckCircle2
                    },
                    {
                      step: 5,
                      title: "Registro da entrega",
                      description: "O sistema registra a entrega, gerando métricas de impacto e histórico.",
                      icon: Utensils
                    }
                  ].map((item, index) => (
                    <div key={item.step} className={`flex items-start gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground md:mx-auto">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <Card className={`flex-1 border-border bg-card ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                        <CardContent className="p-6">
                          <div className="mb-1 text-sm font-medium text-primary">Etapa {item.step}</div>
                          <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
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

        {/* CTA Section */}
        <section className="bg-primary py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Faça parte dessa rede solidária
              </h2>
              <p className="mb-10 text-lg text-primary-foreground/80 leading-relaxed">
                Junte-se a empresas e instituições que já estão transformando excedentes em esperança. 
                Cadastre-se agora e comece a fazer a diferença.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/cadastro">Cadastrar agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
