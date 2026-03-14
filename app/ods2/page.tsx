import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  Leaf, 
  Apple, 
  Scale,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Heart,
  Sprout
} from "lucide-react"

const odsGoals = [
  {
    number: "2.1",
    title: "Acesso a alimentos seguros e suficientes",
    description: "Até 2030, acabar com a fome e garantir o acesso de todas as pessoas, em particular os pobres e pessoas em situações vulneráveis, incluindo crianças, a alimentos seguros, nutritivos e suficientes durante todo o ano.",
    icon: Apple,
    color: "bg-primary",
    contribution: [
      "Redistribuímos alimentos ainda em condições de consumo para instituições carentes",
      "Garantimos rastreabilidade e informações sobre validade e armazenamento",
      "Conectamos excedentes de qualidade a quem precisa"
    ]
  },
  {
    number: "2.2",
    title: "Combater a desnutrição e melhorar qualidade nutricional",
    description: "Até 2030, acabar com todas as formas de desnutrição, incluindo atingir, até 2025, as metas acordadas internacionalmente sobre nanismo e definhamento em crianças menores de cinco anos de idade.",
    icon: Scale,
    color: "bg-secondary",
    contribution: [
      "Sistema de categorização nutricional dos alimentos doados",
      "Dashboard de diversidade alimentar para instituições",
      "Alertas sobre excesso de ultraprocessados e baixa diversidade"
    ]
  },
  {
    number: "2.4",
    title: "Sistemas alimentares sustentáveis",
    description: "Até 2030, garantir sistemas sustentáveis de produção de alimentos e implementar práticas agrícolas resilientes, que aumentem a produtividade e a produção.",
    icon: Recycle,
    color: "bg-accent",
    contribution: [
      "Redução do desperdício de alimentos na cadeia de distribuição",
      "Métricas de impacto ambiental através da redistribuição",
      "Incentivo a práticas sustentáveis entre empresas parceiras"
    ]
  }
]

export default function ODS2Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Target className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                  <Globe className="h-4 w-4" />
                  Objetivos de Desenvolvimento Sustentável
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  ODS 2 - Fome Zero e Agricultura Sustentável
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                  Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição, 
                  e promover a agricultura sustentável. Conheça como nossa plataforma contribui 
                  para esses objetivos globais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is ODS */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                    O que são os ODS?
                  </h2>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    Os Objetivos de Desenvolvimento Sustentável (ODS) são um chamado universal 
                    das Nações Unidas para ação contra a pobreza, para proteger o planeta e 
                    garantir que todas as pessoas desfrutem de paz e prosperidade.
                  </p>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    São 17 objetivos interconectados que abordam os desafios globais que 
                    enfrentamos, incluindo pobreza, desigualdade, mudança climática, 
                    degradação ambiental, paz e justiça.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    O <strong className="text-foreground">ODS 2 - Fome Zero</strong> visa acabar com 
                    a fome, alcançar a segurança alimentar e melhorar a nutrição, 
                    promovendo a agricultura sustentável até 2030.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border bg-primary/5">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Sprout className="mb-3 h-10 w-10 text-primary" />
                      <span className="text-2xl font-bold text-foreground">17</span>
                      <span className="text-sm text-muted-foreground">Objetivos Globais</span>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-secondary/10">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Globe className="mb-3 h-10 w-10 text-secondary" />
                      <span className="text-2xl font-bold text-foreground">193</span>
                      <span className="text-sm text-muted-foreground">Países Comprometidos</span>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-accent/10">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Target className="mb-3 h-10 w-10 text-accent" />
                      <span className="text-2xl font-bold text-foreground">2030</span>
                      <span className="text-sm text-muted-foreground">Meta Global</span>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-primary/5">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Heart className="mb-3 h-10 w-10 text-primary" />
                      <span className="text-2xl font-bold text-foreground">690M</span>
                      <span className="text-sm text-muted-foreground">Pessoas com Fome</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Metas trabalhadas pelo projeto
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Nossa plataforma contribui diretamente para três metas específicas do ODS 2.
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-8">
                {odsGoals.map((goal) => (
                  <Card key={goal.number} className="border-border bg-background overflow-hidden">
                    <div className="grid lg:grid-cols-3">
                      <div className={`${goal.color} p-6 lg:p-8`}>
                        <div className="flex h-full flex-col items-center justify-center text-center text-primary-foreground">
                          <goal.icon className="mb-4 h-16 w-16" />
                          <span className="mb-2 text-4xl font-bold">{goal.number}</span>
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6 lg:col-span-2 lg:p-8">
                        <p className="mb-6 text-muted-foreground leading-relaxed">
                          {goal.description}
                        </p>
                        
                        <div className="space-y-1">
                          <h4 className="mb-3 font-semibold text-foreground">
                            Como contribuímos:
                          </h4>
                          {goal.contribution.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Connection */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Nosso compromisso com o futuro
                </h2>
                <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                  Cada doação realizada através da nossa plataforma é um passo em direção 
                  aos objetivos globais de desenvolvimento sustentável.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-primary/10">
                      <Apple className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Segurança Alimentar</h3>
                    <p className="text-sm text-muted-foreground">
                      Garantimos que alimentos de qualidade cheguem a quem precisa
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-secondary/20">
                      <Scale className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Nutrição Equilibrada</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitoramos a diversidade nutricional das doações
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-accent/20">
                      <Leaf className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Sustentabilidade</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduzimos o desperdício e o impacto ambiental
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Leaf className="mx-auto mb-6 h-16 w-16 text-primary-foreground" />
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Junte-se a essa causa
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                Contribua para os Objetivos de Desenvolvimento Sustentável e faça parte 
                da transformação que o mundo precisa.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <Link href="/cadastro">
                    Participar agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/impacto">
                    Ver nosso impacto
                  </Link>
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
