import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingDown, 
  Heart, 
  Users, 
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Building2,
  BarChart3,
  Shield,
  Award
} from "lucide-react"

const benefits = [
  {
    icon: TrendingDown,
    title: "Redução de Desperdício",
    description: "Transforme seus excedentes de alimentos em doações, evitando perdas e contribuindo para um sistema alimentar mais sustentável."
  },
  {
    icon: Heart,
    title: "Impacto Social Positivo",
    description: "Suas doações chegam diretamente a instituições que atendem pessoas em situação de vulnerabilidade alimentar."
  },
  {
    icon: Users,
    title: "Rede Solidária",
    description: "Faça parte de uma comunidade de empresas comprometidas com a responsabilidade social e o combate à fome."
  },
  {
    icon: ClipboardList,
    title: "Sistema Organizado",
    description: "Cadastre e gerencie suas doações de forma simples, com registro completo e relatórios de impacto."
  },
  {
    icon: BarChart3,
    title: "Métricas de Impacto",
    description: "Acompanhe o impacto das suas doações com relatórios detalhados de quantidade, categorias e beneficiários."
  },
  {
    icon: Shield,
    title: "Segurança e Transparência",
    description: "Todas as doações são registradas com rastreabilidade completa, garantindo transparência em todo o processo."
  }
]

const features = [
  "Cadastro rápido e gratuito",
  "Painel de controle intuitivo",
  "Gestão de múltiplas doações",
  "Notificações de solicitações",
  "Relatórios de impacto social",
  "Certificados de doação",
  "Suporte dedicado",
  "Integração com ERP"
]

export default function EmpresasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Building2 className="h-4 w-4" />
                Para Empresas
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                Transforme excedentes em <span className="text-primary">impacto social</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed">
                Sua empresa pode fazer a diferença. Cadastre seus excedentes de alimentos e 
                contribua diretamente para o combate à fome na sua cidade.
              </p>
              <Button size="lg" asChild className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/cadastro?tipo=empresa">
                  Cadastrar minha empresa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Vantagens para sua empresa
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Além de contribuir com a comunidade, sua empresa ganha em diversos aspectos.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Tudo que você precisa para doar com facilidade
                </h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Nossa plataforma foi desenvolvida pensando na praticidade do dia a dia empresarial. 
                  Cadastre doações em minutos e acompanhe todo o processo.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">
                    Reconhecimento Social
                  </h3>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    Empresas que doam regularmente recebem selos de reconhecimento, 
                    destacando seu compromisso com a responsabilidade social e o combate à fome.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      Selo Bronze
                    </span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                      Selo Prata
                    </span>
                    <span className="rounded-full bg-primary/30 px-3 py-1 text-sm font-medium text-primary">
                      Selo Ouro
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Comece a fazer a diferença hoje
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                O cadastro é rápido, gratuito e sua primeira doação pode acontecer ainda hoje. 
                Junte-se às empresas que já estão transformando a realidade alimentar da nossa cidade.
              </p>
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/cadastro?tipo=empresa">
                  Cadastrar minha empresa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
