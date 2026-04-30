import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Scale,
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Heart,
  Leaf,
  ClipboardCheck,
  Lock,
  Eye,
  Award,
  Recycle,
  TrendingDown,
  Database,
  Smartphone,
  Users,
  Target,
  BookOpen,
  PackageX,
  Trash2,
  Sprout,
  Network,
} from "lucide-react"

const conceitos = [
  {
    icon: PackageX,
    title: "Perda de Alimentos",
    description:
      "Ocorre nas etapas iniciais da cadeia produtiva — produção, pós-colheita, processamento e distribuição. Acontece, por exemplo, quando alimentos estragam no transporte, no armazenamento ou durante a manipulação industrial.",
    color: "bg-accent/15 text-accent",
  },
  {
    icon: Trash2,
    title: "Desperdício de Alimentos",
    description:
      "Ocorre nas etapas finais da cadeia — varejo, serviços de alimentação e consumo. Acontece quando alimentos próprios para consumo são descartados por excedente, padrões estéticos, prazos comerciais curtos ou hábitos de consumo.",
    color: "bg-secondary/20 text-secondary",
  },
  {
    icon: Network,
    title: "PNCPDA",
    description:
      "A Política Nacional de Combate à Perda e ao Desperdício de Alimentos é uma diretriz pública que organiza, em todo o território nacional, ações de prevenção, redução e redistribuição, considerando toda a cadeia alimentar.",
    color: "bg-primary/15 text-primary",
  },
]

const principiosLei = [
  {
    icon: Smartphone,
    title: "Incentivo ao uso de tecnologia",
    description:
      "A lei estimula o desenvolvimento de aplicativos, plataformas digitais e sistemas de informação que conectem doadores e receptores, ampliando o alcance da redistribuição de alimentos.",
  },
  {
    icon: Users,
    title: "Responsabilidade compartilhada",
    description:
      "Produtores, distribuidores, comércio, consumidores, poder público e sociedade civil têm papéis complementares no combate à perda e ao desperdício, atuando de forma coordenada.",
  },
  {
    icon: Heart,
    title: "Incentivo à doação",
    description:
      "A política reforça a destinação de alimentos próprios para consumo a pessoas em situação de insegurança alimentar, priorizando o consumo humano antes do descarte.",
  },
  {
    icon: Database,
    title: "Monitoramento e dados",
    description:
      "Estabelece a importância de coletar, sistematizar e divulgar informações sobre perdas, desperdício e doações, gerando indicadores que apoiam a formulação de políticas públicas.",
  },
]

const cadeiaAlimentar = [
  {
    icon: Sprout,
    title: "Produção",
    description: "Acompanhamento de excedentes desde a origem, incluindo agricultura e indústria.",
  },
  {
    icon: Building2,
    title: "Distribuição",
    description: "Identificação de gargalos logísticos que geram perdas em armazéns e transportes.",
  },
  {
    icon: Users,
    title: "Consumo",
    description: "Conexão entre varejo, serviços de alimentação e instituições que recebem doações.",
  },
  {
    icon: Recycle,
    title: "Descarte",
    description: "Direcionamento adequado para consumo animal, compostagem ou reaproveitamento energético.",
  },
]

const destinacoes = [
  {
    priority: 1,
    icon: Heart,
    title: "Consumo humano",
    description:
      "Destinação prioritária. Alimentos próprios para consumo devem, sempre que possível, ser direcionados a pessoas e instituições que atendem populações em situação de insegurança alimentar.",
    badge: "Prioridade máxima",
    color: "bg-primary",
  },
  {
    priority: 2,
    icon: Sprout,
    title: "Consumo animal",
    description:
      "Quando o alimento não pode mais ser destinado ao consumo humano, mas ainda apresenta valor nutricional, pode ser direcionado para alimentação animal, conforme normas sanitárias específicas.",
    badge: "Segunda opção",
    color: "bg-secondary",
  },
  {
    priority: 3,
    icon: Recycle,
    title: "Compostagem e biomassa",
    description:
      "Quando inadequado para consumo humano ou animal, o material orgânico pode ser destinado à compostagem, geração de biogás ou outras formas de reaproveitamento, evitando o aterro sanitário.",
    badge: "Terceira opção",
    color: "bg-accent",
  },
]

const garantiasDoadores = [
  {
    icon: Shield,
    title: "Doação não configura relação de consumo",
    description:
      "A relação entre o doador e o recebedor de alimentos doados não é equiparada à relação de consumo. Isso significa que as regras do Código de Defesa do Consumidor não se aplicam automaticamente ao ato de doar.",
  },
  {
    icon: Lock,
    title: "Responsabilidade limitada ao dolo",
    description:
      "O doador, em regra, somente responde por danos decorrentes de ato praticado com dolo, ou seja, com intenção de causar dano. A doação feita de boa-fé, com alimentos adequados, não gera responsabilidade automática.",
  },
  {
    icon: FileCheck,
    title: "Segurança jurídica",
    description:
      "A política pública oferece um ambiente regulatório mais claro, no qual empresas podem doar excedentes sem medo de serem responsabilizadas indevidamente, desde que cumpram os requisitos sanitários e atuem de boa-fé.",
  },
  {
    icon: Award,
    title: "Reconhecimento institucional",
    description:
      "Empresas que aderem a programas de doação alinhados à PNCPDA podem ser reconhecidas publicamente, fortalecendo sua imagem e contribuindo para o cumprimento de metas socioambientais.",
  },
]

const responsabilidades = [
  {
    icon: ClipboardCheck,
    title: "Controle de validade",
    description:
      "É dever do doador verificar e respeitar prazos de validade. Apenas alimentos próprios para consumo podem ser doados, observando-se as informações do fabricante e a legislação sanitária vigente.",
  },
  {
    icon: Lock,
    title: "Condições de armazenamento",
    description:
      "Refrigeração, temperatura, umidade e higiene devem ser mantidas em todas as etapas. O doador deve assegurar que o alimento foi conservado de forma adequada até o momento da doação.",
  },
  {
    icon: Database,
    title: "Registro das doações",
    description:
      "Cada doação deve ser registrada com informações sobre tipo, quantidade, validade, condições de armazenamento e destinação, garantindo rastreabilidade e transparência.",
  },
  {
    icon: Eye,
    title: "Boa-fé e transparência",
    description:
      "Tanto doador quanto recebedor devem agir de boa-fé, prestando informações verdadeiras sobre os alimentos e seu manuseio, e zelando pela segurança alimentar dos beneficiários finais.",
  },
]

const limitacoes = [
  {
    icon: XCircle,
    title: "Alimentos vencidos não podem ser doados",
    description:
      "Produtos com prazo de validade expirado, ou cuja segurança não possa ser garantida, devem ser descartados conforme as normas sanitárias. A doação não é uma alternativa ao descarte de itens impróprios.",
  },
  {
    icon: AlertTriangle,
    title: "Condições inadequadas inviabilizam a doação",
    description:
      "Alimentos que sofreram quebra da cadeia de frio, contaminação, embalagem violada ou armazenamento inadequado não devem ser doados, mesmo que ainda dentro do prazo de validade.",
  },
  {
    icon: Scale,
    title: "Não substitui órgãos de fiscalização",
    description:
      "A plataforma e o sistema de registro não substituem a atuação da vigilância sanitária, dos órgãos de defesa do consumidor ou de qualquer autoridade pública. Apenas organizam informações entre as partes.",
  },
  {
    icon: BookOpen,
    title: "Cumprimento das normas sanitárias",
    description:
      "Todas as etapas devem observar as normas da Anvisa, do Ministério da Agricultura e dos órgãos estaduais e municipais aplicáveis, conforme o tipo de alimento e a atividade exercida.",
  },
]

const termosPlataforma = [
  {
    icon: FileCheck,
    title: "Termo de adesão à PNCPDA",
    description:
      "Ao se cadastrar, doadores e instituições aceitam atuar conforme os princípios da Política Nacional de Combate à Perda e ao Desperdício de Alimentos.",
  },
  {
    icon: ClipboardCheck,
    title: "Confirmação digital de doação",
    description:
      "Cada doação publicada exige confirmação digital do doador atestando validade, integridade e condições de armazenamento dos alimentos cadastrados.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmação de recebimento",
    description:
      "A instituição recebedora confirma digitalmente o recebimento, registrando data, quantidade e condição em que os alimentos foram entregues.",
  },
  {
    icon: Eye,
    title: "Rastreabilidade completa",
    description:
      "Todo o histórico fica registrado de forma auditável, permitindo monitoramento da política pública e geração de indicadores de impacto social.",
  },
]

export default function AspectosLegaisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Scale className="h-4 w-4" />
                Lei nº 15.224/2025 - PNCPDA
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                Aspectos legais da redistribuição de alimentos
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed text-pretty">
                A plataforma está alinhada à{" "}
                <strong className="text-foreground">
                  Política Nacional de Combate à Perda e ao Desperdício de Alimentos (PNCPDA)
                </strong>
                , instituída pela Lei nº 15.224/2025, que estabelece diretrizes para reduzir perdas e
                desperdício e ampliar a redistribuição segura em toda a cadeia alimentar.
              </p>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        {/* Conceitos fundamentais */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Conceitos fundamentais
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A lei diferencia perda e desperdício e organiza, sob uma única política, ações para reduzir
                ambos os fenômenos ao longo da cadeia alimentar.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {conceitos.map((conceito) => (
                <Card key={conceito.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${conceito.color}`}>
                      <conceito.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{conceito.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{conceito.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cadeia alimentar */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Visão sistêmica da cadeia alimentar
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A PNCPDA reconhece que perda e desperdício acontecem em diferentes etapas. Por isso, a
                política e a plataforma consideram toda a trajetória do alimento, da produção ao descarte.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {cadeiaAlimentar.map((etapa, index) => (
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
          </div>
        </section>

        {/* Princípios da Lei */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Principais pontos da Lei nº 15.224/2025
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A política nacional estrutura-se em quatro eixos centrais que orientam a atuação de
                empresas, instituições e do poder público.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {principiosLei.map((principio) => (
                <Card key={principio.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <principio.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{principio.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {principio.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hierarquia de destinação */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Hierarquia de destinação dos alimentos
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A PNCPDA estabelece uma ordem de prioridade para a destinação de alimentos, sempre buscando
                evitar que produtos próprios para consumo sejam descartados.
              </p>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {destinacoes.map((destino) => (
                <Card key={destino.priority} className="border-border bg-background">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex items-center gap-4 md:shrink-0">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${destino.color} text-primary-foreground`}
                        >
                          <destino.icon className="h-8 w-8" />
                        </div>
                        <div className="text-5xl font-bold text-muted-foreground/20">
                          0{destino.priority}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{destino.title}</h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {destino.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {destino.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Garantias para doadores */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Garantias para empresas e doadores
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A política pública oferece segurança jurídica para que empresas possam doar alimentos
                próprios para consumo sem receio de responsabilização indevida.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {garantiasDoadores.map((garantia) => (
                <Card key={garantia.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <garantia.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{garantia.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {garantia.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Destaque jurídico */}
            <Card className="mx-auto mt-10 max-w-4xl border-primary/30 bg-primary/5">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 shrink-0 text-primary" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Destaque jurídico</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A doação de alimentos realizada no âmbito da PNCPDA{" "}
                      <strong className="text-foreground">não configura relação de consumo</strong> entre
                      doador e recebedor. O doador, atuando de boa-fé e cumprindo as normas sanitárias,
                      somente responde por danos quando estes decorrerem de{" "}
                      <strong className="text-foreground">ato praticado com dolo</strong> — ou seja, com
                      intenção deliberada de causar prejuízo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Responsabilidades */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Responsabilidades no processo
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A segurança alimentar exige cuidados em todas as etapas. As partes envolvidas devem
                observar normas técnicas, sanitárias e procedimentos de registro.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {responsabilidades.map((resp) => (
                <Card key={resp.title} className="border-border bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                        <resp.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{resp.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{resp.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Termos digitais na plataforma */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Termos de responsabilidade na plataforma
              </h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                Para garantir transparência e rastreabilidade, a plataforma utiliza confirmações digitais
                em cada etapa do processo de doação.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {termosPlataforma.map((termo) => (
                <Card key={termo.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <termo.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{termo.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{termo.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Limitações Legais */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Limitações e cuidados</h2>
              <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                A política pública não autoriza a doação de qualquer alimento em qualquer condição. É
                fundamental compreender os limites legais para garantir a segurança alimentar.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {limitacoes.map((lim) => (
                <Card key={lim.title} className="border-destructive/20 bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                        <lim.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{lim.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{lim.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mx-auto mt-10 max-w-4xl border-accent/30 bg-accent/5">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <Eye className="h-8 w-8 shrink-0 text-accent" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      A plataforma não substitui a fiscalização sanitária
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      O sistema apenas organiza informações entre doadores e instituições, registra
                      doações e gera indicadores.{" "}
                      <strong className="text-foreground">
                        A responsabilidade sanitária permanece com o doador
                      </strong>{" "}
                      e a fiscalização cabe aos órgãos competentes — Anvisa, vigilâncias sanitárias
                      estaduais e municipais e demais autoridades públicas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Relação com a ODS 2 */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                  Conexão com a ODS 2 - Fome Zero
                </h2>
                <p className="text-lg text-primary-foreground/90 leading-relaxed">
                  A Lei nº 15.224/2025 viabiliza, no plano legal, ações que dialogam diretamente com a
                  Agenda 2030 da ONU, em especial com o Objetivo de Desenvolvimento Sustentável 2.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                  <CardContent className="p-6">
                    <Heart className="mb-4 h-8 w-8 text-primary-foreground" />
                    <h3 className="mb-2 font-semibold text-primary-foreground">Segurança alimentar</h3>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">
                      Ao garantir um ambiente legal seguro, a lei amplia a oferta de alimentos saudáveis
                      para populações em situação de vulnerabilidade.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                  <CardContent className="p-6">
                    <TrendingDown className="mb-4 h-8 w-8 text-primary-foreground" />
                    <h3 className="mb-2 font-semibold text-primary-foreground">Redução do desperdício</h3>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">
                      Ao tratar perda e desperdício como problema estrutural, a política induz mudanças em
                      toda a cadeia produtiva e de distribuição.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                  <CardContent className="p-6">
                    <Leaf className="mb-4 h-8 w-8 text-primary-foreground" />
                    <h3 className="mb-2 font-semibold text-primary-foreground">Sistemas sustentáveis</h3>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">
                      A redistribuição organizada e o monitoramento de dados apoiam a construção de
                      sistemas alimentares mais justos e sustentáveis.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="mt-10 text-center text-base text-primary-foreground/85 leading-relaxed">
                Em síntese, a legislação cria condições jurídicas, institucionais e tecnológicas para que
                a redistribuição de alimentos aconteça de forma segura, transparente e em larga escala —
                contribuindo de modo direto para o cumprimento das metas da ODS 2 e para a redução
                estrutural do desperdício de alimentos no Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="mx-auto max-w-4xl border-border bg-card">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                    Atue dentro da PNCPDA
                  </h2>
                  <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                    Cadastre sua empresa ou instituição e participe de uma rede alinhada à Política
                    Nacional de Combate à Perda e ao Desperdício de Alimentos.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <Link href="/cadastro?tipo=empresa">
                        <Building2 className="h-5 w-5" />
                        Cadastrar empresa
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2">
                      <Link href="/cadastro?tipo=instituicao">
                        <Heart className="h-5 w-5" />
                        Cadastrar instituição
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-6">
                    <Button variant="ghost" asChild className="gap-2 text-primary">
                      <Link href="/como-funciona">
                        Ver como funciona o processo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
