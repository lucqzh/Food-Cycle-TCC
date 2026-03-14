import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  BarChart3, 
  History, 
  Bell,
  CheckCircle,
  ArrowRight,
  Heart,
  Utensils,
  ShieldCheck,
  Users
} from "lucide-react"

const benefits = [
  {
    icon: Search,
    title: "Acesso Organizado a Alimentos",
    description: "Visualize todas as doações disponíveis na sua região em um painel organizado e fácil de navegar."
  },
  {
    icon: Utensils,
    title: "Variedade Alimentar",
    description: "Encontre diferentes categorias de alimentos para garantir uma dieta diversificada aos beneficiários."
  },
  {
    icon: BarChart3,
    title: "Dashboard Nutricional",
    description: "Acompanhe a diversidade alimentar das doações recebidas com métricas e gráficos detalhados."
  },
  {
    icon: History,
    title: "Histórico Completo",
    description: "Mantenha registro de todas as doações recebidas, facilitando relatórios e prestação de contas."
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Receba notificações sobre novas doações disponíveis e alertas sobre excesso de ultraprocessados."
  },
  {
    icon: ShieldCheck,
    title: "Segurança Alimentar",
    description: "Todas as doações passam por verificação de validade e condições de armazenamento."
  }
]

const features = [
  "Cadastro rápido e gratuito",
  "Painel de doações em tempo real",
  "Solicitação com um clique",
  "Filtros por categoria alimentar",
  "Métricas de diversidade nutricional",
  "Histórico de recebimentos",
  "Alertas personalizados",
  "Relatórios para prestação de contas"
]

export default function InstituicoesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4" />
                Para Instituições
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                Acesso facilitado a <span className="text-primary">alimentos de qualidade</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed">
                Conecte-se a uma rede de empresas doadoras e garanta alimentação 
                diversificada para quem mais precisa.
              </p>
              <Button size="lg" asChild className="gap-2">
                <Link href="/cadastro?tipo=instituicao">
                  Cadastrar minha instituição
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
                Vantagens para sua instituição
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Nossa plataforma foi pensada para facilitar o acesso a doações de alimentos 
                de forma organizada e eficiente.
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
              <Card className="border-border bg-card order-2 lg:order-1">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">
                    Impacto Real
                  </h3>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    Com a plataforma Fome Zero, sua instituição pode atender mais pessoas 
                    com alimentação de qualidade e diversificada, contribuindo para a 
                    segurança alimentar da comunidade.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Doações mensais</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Empresas parceiras</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="order-1 lg:order-2">
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Funcionalidades pensadas para você
                </h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Desenvolvemos ferramentas específicas para ajudar sua instituição a 
                  gerenciar doações de forma eficiente e transparente.
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Cadastre sua instituição gratuitamente
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                Em poucos minutos, sua instituição estará conectada a uma rede de empresas 
                doadoras e poderá começar a receber alimentos de qualidade.
              </p>
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/cadastro?tipo=instituicao">
                  Cadastrar minha instituição
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
