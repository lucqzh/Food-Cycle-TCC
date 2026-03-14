import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Package, 
  Search, 
  HandHeart, 
  CheckCircle, 
  ClipboardList,
  ArrowRight,
  Building2,
  Heart
} from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Empresa cadastra alimentos disponíveis",
    description: "A empresa acessa o sistema e registra os alimentos que estão disponíveis para doação. Ela informa o nome do alimento, categoria nutricional, quantidade em kg, data de validade, condições de armazenamento e uma breve descrição.",
    icon: Package,
    details: [
      "Cadastro rápido e intuitivo",
      "Informações nutricionais detalhadas",
      "Controle de validade automatizado",
      "Histórico de doações"
    ]
  },
  {
    step: 2,
    title: "Instituições visualizam as doações",
    description: "As instituições cadastradas podem acessar o painel e ver todas as doações disponíveis na região. O sistema mostra informações completas sobre cada alimento, incluindo empresa doadora, quantidade e prazo de validade.",
    icon: Search,
    details: [
      "Filtros por categoria e região",
      "Visualização em tempo real",
      "Informações nutricionais completas",
      "Alertas de novas doações"
    ]
  },
  {
    step: 3,
    title: "Instituição solicita a doação",
    description: "Quando encontra uma doação de interesse, a instituição pode solicitar diretamente pela plataforma. A solicitação inclui a quantidade desejada e informações de contato para coordenar a retirada.",
    icon: HandHeart,
    details: [
      "Solicitação com um clique",
      "Comunicação direta com empresa",
      "Acompanhamento do status",
      "Histórico de solicitações"
    ]
  },
  {
    step: 4,
    title: "Empresa confirma e organiza retirada",
    description: "A empresa recebe a solicitação e pode aprovar ou recusar. Após aprovação, as partes combinam a logística de retirada dos alimentos, seja por coleta ou entrega.",
    icon: CheckCircle,
    details: [
      "Aprovação simplificada",
      "Agendamento flexível",
      "Comunicação integrada",
      "Notificações automáticas"
    ]
  },
  {
    step: 5,
    title: "Sistema registra a entrega",
    description: "Após a conclusão da doação, o sistema registra automaticamente a entrega, gerando métricas de impacto social, relatórios de diversidade alimentar e histórico completo das operações.",
    icon: ClipboardList,
    details: [
      "Registro automático",
      "Métricas de impacto",
      "Relatórios nutricionais",
      "Certificados de doação"
    ]
  }
]

export default function ComoFuncionaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Como Funciona
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Conheça o processo completo de redistribuição de alimentos através da nossa plataforma. 
                Um sistema simples, eficiente e transparente.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-12">
                {steps.map((item, index) => (
                  <div key={item.step} className="relative">
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-8 top-20 hidden h-full w-0.5 bg-border lg:block" />
                    )}
                    
                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                      {/* Step number and icon */}
                      <div className="flex shrink-0 items-start gap-4 lg:w-48 lg:flex-col lg:items-center">
                        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <item.icon className="h-8 w-8" />
                        </div>
                        <div className="lg:text-center">
                          <span className="text-sm font-medium text-primary">Etapa {item.step}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <Card className="flex-1 border-border bg-card">
                        <CardContent className="p-6 md:p-8">
                          <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
                            {item.title}
                          </h2>
                          <p className="mb-6 text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {item.details.map((detail, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                                <span className="text-sm text-muted-foreground">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Cadastre-se agora e faça parte dessa rede solidária de redistribuição de alimentos.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/cadastro?tipo=empresa">
                    <Building2 className="h-5 w-5" />
                    Cadastrar Empresa
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <Link href="/cadastro?tipo=instituicao">
                    <Heart className="h-5 w-5" />
                    Cadastrar Instituição
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
