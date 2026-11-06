import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
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
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Solidariedade Ativa",
    description: "Acreditamos no poder da colaboração direta e da generosidade para transformar vidas e reduzir vulnerabilidades.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade Sistêmica",
    description: "Comprometidos com a mitigação do desperdício de alimentos e a preservação dos recursos naturais do planeta.",
  },
  {
    icon: Users,
    title: "Responsabilidade Compartilhada",
    description: "Atuação articulada entre produtores, supermercados, instituições beneficentes e o poder público.",
  },
  {
    icon: Globe,
    title: "Impacto Mensurável",
    description: "Rastreabilidade completa com dados públicos que comprovam o destino ético de cada quilograma doado.",
  },
]

const cadeia = [
  {
    icon: Sprout,
    title: "Produção & Agro",
    description: "Identificação de excedentes agrícolas desde a colheita e indústrias de processamento.",
  },
  {
    icon: Building2,
    title: "Distribuição & Varejo",
    description: "Monitoramento de perdas em centros logísticos, atacados e redes de supermercados.",
  },
  {
    icon: Users,
    title: "Consumo & Comunidades",
    description: "Conexão georreferenciada imediata com cozinhas comunitárias, abrigos e ONGs cadastradas.",
  },
  {
    icon: Recycle,
    title: "Destinação Circular",
    description: "Encaminhamento prioritário ao consumo humano, seguido por consumo animal e compostagem.",
  },
]

const eixos = [
  {
    icon: Smartphone,
    title: "Plataforma Inteligente",
    description: "Reduz fricção burocrática conectando doadores e receptores em minutos com geolocalização.",
  },
  {
    icon: Heart,
    title: "Dignidade Nutricional",
    description: "Garantia de variedade de nutrientes com frutas, hortaliças, proteínas e grãos frescos.",
  },
  {
    icon: Database,
    title: "Dados Abertos e Auditoria",
    description: "Geração de relatórios criptografados em conformidade com as diretrizes da PNCPDA.",
  },
  {
    icon: Network,
    title: "Rede Solidária Nacional",
    description: "Articulação contínua com entidades da sociedade civil e instâncias governamentais.",
  },
]

const ods = [
  {
    number: "2",
    title: "Fome Zero e Agricultura Sustentável",
    description: "Erradicar a fome, alcançar a segurança alimentar e promover a nutrição adequada a todos.",
    color: "from-amber-500 to-amber-700 text-[#071B17]"
  },
  {
    number: "12",
    title: "Consumo e Produção Responsáveis",
    description: "Reduzir pela metade o desperdício global de alimentos per capita no varejo e pós-colheita.",
    color: "from-emerald-500 to-emerald-700 text-[#071B17]"
  },
  {
    number: "17",
    title: "Parcerias para os Objetivos",
    description: "Mobilizar recursos e conhecimento compartilhado entre setor privado, sociedade e Estado.",
    color: "from-blue-500 to-blue-700 text-[#071B17]"
  },
]

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 border-b border-emerald-950/60 bg-gradient-to-b from-[#052E24] via-[#071B17] to-[#040E0B]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800/40 px-4 py-1.5 text-xs font-mono text-emerald-300">
                <Scale className="h-3.5 w-3.5 text-amber-400" />
                Marco Regulatório • Lei Federal nº 15.224/2025
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] font-serif">
                A tecnologia que transforma o <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">excedente em esperança</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                O FoodCycle é a infraestrutura digital estruturada para operacionalizar a Política Nacional de Combate à Perda e ao Desperdício de Alimentos (PNCPDA), unindo segurança jurídica e impacto social.
              </p>
            </div>
          </div>
        </section>

        {/* Pilares Institucionais */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-8 backdrop-blur shadow-xl space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Nossa Missão Institucional</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Erradicar o desperdício de alimentos comercializáveis no Brasil conectando quem produz e distribui a quem mais necessita, com rastreabilidade auditável, respeito rigoroso à legislação sanitária e transparência total.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-8 backdrop-blur shadow-xl space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Nossa Visão Estratégica</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Consolidar-se como o padrão nacional de infraestrutura tecnológica e de dados para o cumprimento das metas do ODS 2 da ONU até 2030, tornando a doação corporativa segura, eficiente e desburocratizada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Princípios Norteadores</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Valores Fundamentais</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Critérios éticos que regem o desenvolvimento de software e a governança de dados no FoodCycle.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div
                    key={v.title}
                    className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all space-y-3"
                  >
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{v.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Cadeia Alimentar */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Visão Integrada</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Toda a Cadeia Alimentar Conectada</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Atuamos nos 4 elos cruciais da cadeia para evitar perdas precoces e destinação em aterros.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cadeia.map((c, idx) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-emerald-950/80 bg-[#0A241F]/40 p-6 backdrop-blur space-y-3 relative overflow-hidden"
                  >
                    <span className="absolute top-4 right-4 text-3xl font-black font-mono text-emerald-500/10">0{idx + 1}</span>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ODS */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Agenda 2030 ONU</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Compromisso com os ODS</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Metas globais diretamente endereçadas pela arquitetura de software e governança do FoodCycle.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {ods.map((item) => (
                <div
                  key={item.number}
                  className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} font-black text-xl shadow-lg`}>
                    {item.number}
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Faça parte da rede que conecta o Brasil contra a fome.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Empresas e instituições receptoras contam com uma plataforma estruturada, segura e alinhada à Lei nº 15.224/2025.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro">
                  Cadastrar Organização
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-11 px-8 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white">
                <Link href="/como-funciona">Ver Como Funciona</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
