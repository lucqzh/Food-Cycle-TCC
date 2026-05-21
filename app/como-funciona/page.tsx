import Link from "next/link"
import { DonationMapDynamic } from "@/components/map/donation-map-dynamic"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NearbyInstitutions } from "@/components/map/donation-map"
import {
  Package,
  Search,
  HandHeart,
  CheckCircle,
  ClipboardList,
  Building2,
  Heart,
  Truck,
  ArrowDown,
  MapPin
} from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Empresa cadastra alimentos disponíveis",
    description: "A empresa acessa o sistema e registra os alimentos que estão disponíveis para doação. Ela informa o nome do alimento, categoria nutricional, quantidade em kg, data de validade, condições de armazenamento e uma breve descrição.",
    icon: Package,
    color: "bg-primary",
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
    color: "bg-secondary",
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
    color: "bg-accent",
    details: [
      "Solicitação com um clique",
      "Comunicação direta com empresa",
      "Acompanhamento do status",
      "Histórico de solicitações"
    ]
  },
  {
    step: 4,
    title: "Empresa confirma a doação",
    description: "A empresa recebe a solicitação e pode aprovar ou recusar. Após aprovação, as partes combinam a logística de retirada dos alimentos, seja por coleta ou entrega.",
    icon: CheckCircle,
    color: "bg-primary",
    details: [
      "Aprovação simplificada",
      "Agendamento flexível",
      "Comunicação integrada",
      "Notificações automáticas"
    ]
  },
  {
    step: 5,
    title: "Entrega é realizada",
    description: "A instituição realiza a retirada dos alimentos no local e horário combinados, ou a empresa organiza a entrega. O processo é acompanhado pela plataforma.",
    icon: Truck,
    color: "bg-secondary",
    details: [
      "Logística coordenada",
      "Confirmação de entrega",
      "Rastreamento do processo",
      "Comunicação em tempo real"
    ]
  },
  {
    step: 6,
    title: "Sistema registra a doação",
    description: "Após a conclusão da doação, o sistema registra automaticamente a entrega, gerando métricas de impacto social, relatórios de diversidade alimentar e histórico completo das operações.",
    icon: ClipboardList,
    color: "bg-accent",
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
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Como Funciona
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Conheça o processo completo de redistribuição de alimentos através da nossa plataforma.
                Um sistema simples, eficiente e transparente em 6 etapas.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {steps.map((item, index) => (
                  <div key={item.step} className="relative">
                    <Card className="h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
                      <CardContent className="p-6">
                        {/* Step header */}
                        <div className="mb-4 flex items-center gap-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-primary-foreground`}>
                            <item.icon className="h-7 w-7" />
                          </div>
                          <span className="text-4xl font-bold text-muted-foreground/30">
                            {item.step.toString().padStart(2, '0')}
                          </span>
                        </div>

                        {/* Content */}
                        <h2 className="mb-3 text-lg font-semibold text-foreground">
                          {item.title}
                        </h2>
                        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2">
                          {item.details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                              <span className="text-xs text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arrow connector for mobile */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-4 md:hidden">
                        <ArrowDown className="h-6 w-6 text-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Visual Flow */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
                Fluxo Simplificado
              </h2>

              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                {/* Empresa */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Building2 className="h-10 w-10" />
                  </div>
                  <span className="font-semibold text-foreground">Empresa</span>
                  <span className="text-sm text-muted-foreground">Cadastra alimentos</span>
                </div>

                {/* Arrow */}
                <div className="hidden h-1 flex-1 bg-gradient-to-r from-primary to-secondary md:block" />
                <ArrowDown className="h-8 w-8 text-primary md:hidden" />

                {/* Plataforma */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <Package className="h-10 w-10" />
                  </div>
                  <span className="font-semibold text-foreground">Plataforma</span>
                  <span className="text-sm text-muted-foreground">Conecta e organiza</span>
                </div>

                {/* Arrow */}
                <div className="hidden h-1 flex-1 bg-gradient-to-r from-secondary to-primary md:block" />
                <ArrowDown className="h-8 w-8 text-secondary md:hidden" />

                {/* Instituição */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Heart className="h-10 w-10" />
                  </div>
                  <span className="font-semibold text-foreground">Instituição</span>
                  <span className="text-sm text-muted-foreground">Recebe alimentos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa de Doações */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <MapPin className="h-4 w-4" />
                  Mapa Interativo
                </div>
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                  Encontre doações perto de você
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Visualize empresas doadoras e instituições beneficiárias na sua região.
                  O mapa é atualizado em tempo real conforme novas doações são cadastradas.
                </p>
              </div>

              <DonationMap className="mb-8" />
            </div>
          </div>
        </section>

        {/* Instituições Próximas */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                  <Heart className="h-4 w-4" />
                  Rede Solidária
                </div>
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                  Instituições próximas de você
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Conheça as instituições cadastradas na plataforma que estão recebendo doações
                  e fazendo a diferença na comunidade.
                </p>
              </div>

              <NearbyInstitutions />

              <div className="mt-8 text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/mapa">
                    Ver todas as instituições
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                Cadastre-se agora e faça parte dessa rede solidária de redistribuição de alimentos.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <Link href="/cadastro?tipo=empresa">
                    <Building2 className="h-5 w-5" />
                    Cadastrar Empresa
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
