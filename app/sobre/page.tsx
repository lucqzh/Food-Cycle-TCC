import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Eye,
  Heart,
  Leaf,
  Globe,
  Users,
  ArrowRight,
  Scale,
  Sprout,
  Building2,
  Recycle,
  Network,
  Database,
  Smartphone,
} from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Solidariedade",
    description: "Acreditamos no poder da colaboração e da generosidade para transformar realidades.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Comprometidos com a redução do desperdício alimentar e a preservação do meio ambiente.",
  },
  {
    icon: Users,
    title: "Responsabilidade compartilhada",
    description: "Atuação conjunta entre empresas, instituições, poder público e sociedade civil.",
  },
  {
    icon: Globe,
    title: "Impacto sistêmico",
    description: "Olhar integrado sobre toda a cadeia alimentar — da produção ao descarte.",
  },
]

const cadeia = [
  {
    icon: Sprout,
    title: "Produção",
    description: "Identificação de excedentes desde a origem, em produtores e indústrias.",
  },
  {
    icon: Building2,
    title: "Distribuição",
    description: "Acompanhamento de perdas em transporte, armazenamento e logística.",
  },
  {
    icon: Users,
    title: "Consumo",
    description: "Conexão entre varejo, serviços de alimentação e instituições recebedoras.",
  },
  {
    icon: Recycle,
    title: "Descarte",
    description: "Direcionamento adequado para consumo animal, compostagem ou biomassa.",
  },
]

const eixos = [
  {
    icon: Smartphone,
    title: "Tecnologia",
    description: "Plataforma digital que organiza informações, conecta atores e reduz fricções.",
  },
  {
    icon: Heart,
    title: "Doação",
    description: "Estímulo à destinação de alimentos próprios para consumo a quem precisa.",
  },
  {
    icon: Database,
    title: "Dados",
    description: "Geração de indicadores que apoiam o monitoramento da política pública.",
  },
  {
    icon: Network,
    title: "Rede",
    description: "Articulação entre empresas, instituições e poder público em rede colaborativa.",
  },
]

const ods = [
  {
    number: "2",
    title: "Fome Zero",
    description: "Acabar com a fome, alcançar a segurança alimentar e melhorar a nutrição.",
  },
  {
    number: "12",
    title: "Consumo Responsável",
    description: "Assegurar padrões de produção e de consumo sustentáveis.",
  },
  {
    number: "17",
    title: "Parcerias",
    description: "Fortalecer os meios de implementação e revitalizar parcerias globais.",
  },
]

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Scale className="h-4 w-4" />
                Alinhado à Lei nº 15.224/2025 - PNCPDA
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Sobre o projeto
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                O Fome Zero é uma plataforma alinhada à Política Nacional de Combate à Perda e ao
                Desperdício de Alimentos (PNCPDA). Atuamos na redução do desperdício e na redistribuição
                segura de alimentos, com visão integrada de toda a cadeia alimentar.
              </p>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        {/* O que é o projeto */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-foreground">Nossa missão</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Reduzir a perda e o desperdício de alimentos e ampliar a segurança alimentar por
                      meio de uma plataforma tecnológica que conecta empresas, instituições e poder
                      público, alinhada às diretrizes da Política Nacional de Combate à Perda e ao
                      Desperdício de Alimentos.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Eye className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-foreground">Nossa visão</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Ser referência nacional como solução tecnológica para a PNCPDA, oferecendo
                      infraestrutura digital para que cidades, estados e organizações implementem
                      programas estruturados de redistribuição de alimentos com rastreabilidade e
                      transparência.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Visão sistêmica da cadeia */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Visão sistêmica
              </Badge>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Atuamos em toda a cadeia alimentar
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A PNCPDA reconhece que perda e desperdício acontecem em diferentes etapas. Por isso, nossa
                plataforma considera todo o caminho do alimento — da produção ao descarte adequado.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {cadeia.map((etapa, index) => (
                <Card key={etapa.title} className="border-border bg-background">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <etapa.icon className="h-7 w-7" />
                    </div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Etapa {index + 1}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{etapa.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{etapa.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/aspectos-legais">
                  Saiba mais sobre a Lei nº 15.224/2025
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Eixos de atuação */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Eixos de atuação da plataforma
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Quatro eixos que estruturam nossa contribuição para a Política Nacional de Combate à
                Perda e ao Desperdício de Alimentos.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {eixos.map((eixo) => (
                <Card key={eixo.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <eixo.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{eixo.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{eixo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Nossos valores</h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Princípios que orientam todas as nossas decisões.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-background text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ODS */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Alinhamento com a Agenda 2030
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Nossa atuação contribui para os Objetivos de Desenvolvimento Sustentável da ONU.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {ods.map((item) => (
                <Card key={item.number} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <span className="text-2xl font-bold">{item.number}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      ODS {item.number}: {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Faça parte dessa rede
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/85 leading-relaxed">
                Cadastre sua empresa ou instituição e participe de uma plataforma alinhada à Política
                Nacional de Combate à Perda e ao Desperdício de Alimentos.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/cadastro">
                    Cadastrar agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/como-funciona">Ver como funciona</Link>
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
