import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Target, 
  Eye, 
  Heart, 
  Leaf,
  Globe,
  Users,
  ArrowRight
} from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Solidariedade",
    description: "Acreditamos no poder da colaboração e da generosidade para transformar realidades."
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Comprometidos com a redução do desperdício alimentar e a preservação do meio ambiente."
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Construímos pontes entre empresas e instituições para fortalecer nossa sociedade."
  },
  {
    icon: Globe,
    title: "Impacto Global",
    description: "Contribuímos para os Objetivos de Desenvolvimento Sustentável da ONU."
  }
]

const ods = [
  {
    number: "2",
    title: "Fome Zero",
    description: "Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição."
  },
  {
    number: "12",
    title: "Consumo Responsável",
    description: "Assegurar padrões de produção e de consumo sustentáveis."
  },
  {
    number: "17",
    title: "Parcerias",
    description: "Fortalecer os meios de implementação e revitalizar parcerias globais."
  }
]

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Sobre o Projeto
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                O Fome Zero nasceu da necessidade de conectar quem tem excedentes de alimentos 
                com quem precisa, criando uma rede solidária de redistribuição alimentar.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Nossa Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Reduzir o desperdício de alimentos e combater a fome através de uma 
                    plataforma tecnológica que conecta empresas doadoras a instituições 
                    carentes, promovendo a redistribuição eficiente e organizada de 
                    alimentos na nossa cidade.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Eye className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Nossa Visão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser referência em redistribuição de alimentos, criando um modelo 
                    replicável que possa ser adotado em outras cidades e regiões, 
                    contribuindo para a erradicação da fome e a construção de um 
                    sistema alimentar mais justo e sustentável.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Nossos Valores
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Princípios que guiam todas as nossas ações e decisões.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-card text-center">
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

        {/* ODS Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Objetivos de Desenvolvimento Sustentável
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                O projeto Fome Zero está alinhado com os Objetivos de Desenvolvimento Sustentável 
                da ONU, contribuindo diretamente para as seguintes metas:
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {ods.map((item) => (
                <Card key={item.number} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <span className="text-2xl font-bold">{item.number}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">ODS {item.number}: {item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TCC Info */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <Card className="border-border bg-card">
                <CardContent className="p-8 md:p-12">
                  <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl text-center">
                    Projeto de TCC
                  </h2>
                  <p className="mb-6 text-muted-foreground leading-relaxed text-center">
                    Este projeto foi desenvolvido como Trabalho de Conclusão de Curso, 
                    com o objetivo de criar uma solução tecnológica para um problema 
                    social real: o desperdício de alimentos em um país com milhões 
                    de pessoas em situação de insegurança alimentar.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    Através da tecnologia, buscamos criar uma ponte entre empresas que 
                    possuem excedentes de alimentos e instituições que precisam desses 
                    recursos, contribuindo para a construção de uma sociedade mais 
                    justa e sustentável.
                  </p>
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
                Faça parte dessa mudança
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                Seja uma empresa doadora ou uma instituição beneficiária, 
                cadastre-se e ajude a transformar a realidade alimentar da nossa cidade.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <Link href="/cadastro">
                    Cadastrar agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
