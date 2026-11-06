import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
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
  Database,
  Smartphone,
  Users,
  BookOpen,
  PackageX,
  Trash2,
  Sprout,
  Network,
  Sparkles
} from "lucide-react"

const conceitos = [
  {
    icon: PackageX,
    title: "Perda de Alimentos",
    description:
      "Ocorre nas etapas iniciais da cadeia produtiva — colheita, pós-colheita, transporte e beneficiamento industrial, antes de chegar ao varejo.",
    color: "from-amber-400 to-amber-600 text-[#071B17]",
  },
  {
    icon: Trash2,
    title: "Desperdício de Alimentos",
    description:
      "Ocorre nas etapas finais da cadeia — supermercados, restaurantes, feiras e consumo doméstico, descartando itens próprios para nutrição humana.",
    color: "from-red-400 to-red-600 text-[#071B17]",
  },
  {
    icon: Network,
    title: "PNCPDA (Lei nº 15.224/2025)",
    description:
      "A Política Nacional organiza diretrizes públicas federais de prevenção, logística reversa solidária e monitoramento de dados em escala nacional.",
    color: "from-emerald-400 to-emerald-600 text-[#071B17]",
  },
]

const garantiasDoadores = [
  {
    icon: Shield,
    title: "Inexistência de Relação de Consumo",
    description:
      "A doação gratuita de alimentos não é equiparada a relação de consumo. O Código de Defesa do Consumidor (CDC) não incide sobre o doador de boa-fé.",
  },
  {
    icon: Lock,
    title: "Responsabilidade Restrita ao Dolo",
    description:
      "O doador responde civilmente apenas em hipótese de dolo comprovado (intenção manifesta de causar dano). Atos de boa-fé são juridicamente resguardados.",
  },
  {
    icon: FileCheck,
    title: "Segurança Regulatória Efetiva",
    description:
      "Empresas podem doar excedentes com respaldo explícito da Lei nº 15.224/2025, eliminando receios históricos de litígios fiscais ou sanitários.",
  },
  {
    icon: Award,
    title: "Selo Oficial Doador de Alimentos",
    description:
      "Reconhecimento público emitido pela governança da plataforma para certificação em relatórios ESG, auditorias e benefícios públicos.",
  },
]

const responsabilidades = [
  {
    icon: ClipboardCheck,
    title: "Controle Rigoroso de Validade",
    description:
      "Apenas alimentos próprios para consumo e dentro do prazo podem ser cadastrados, respeitando os dados técnicos do fabricante.",
  },
  {
    icon: Lock,
    title: "Manutenção da Cadeia Sanitária",
    description:
      "Higiene, refrigeração e integridade da embalagem devem ser mantidas rigorosamente até o momento da entrega física ao beneficiário.",
  },
  {
    icon: Database,
    title: "Rastreabilidade Auditável",
    description:
      "Cada lote é identificado por hash único no Supabase, registrando peso, categoria, doador e termo de recebimento com timestamp.",
  },
  {
    icon: Eye,
    title: "Boa-fé e Transparência de Dados",
    description:
      "Doador e receptor declaram atuar com veracidade em todas as etapas, assegurando a confiabilidade da rede pública.",
  },
]

const destinacoes = [
  {
    priority: 1,
    icon: Heart,
    title: "Consumo Humano",
    description:
      "Prioridade absoluta da Lei. Todo alimento seguro deve ser encaminhado para consumo direto por populações em insegurança alimentar.",
    badge: "Prioridade Máxima",
    color: "border-emerald-500/40 bg-emerald-950/60 text-emerald-300",
  },
  {
    priority: 2,
    icon: Sprout,
    title: "Consumo Animal",
    description:
      "Caso o alimento perca a atratividade para consumo humano mas mantenha nutrientes seguros, pode ser destinado à nutrição animal.",
    badge: "2ª Opção Prioritária",
    color: "border-amber-500/40 bg-amber-950/60 text-amber-300",
  },
  {
    priority: 3,
    icon: Recycle,
    title: "Compostagem e Biomassa",
    description:
      "Resíduos orgânicos não consumíveis são convertidos em adubo e biogás, eliminando a destinação em aterros sanitários.",
    badge: "3ª Opção (Economia Circular)",
    color: "border-blue-500/40 bg-blue-950/60 text-blue-300",
  },
]

export default function AspectosLegaisPage() {
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
                Segurança Regulatória e Conformidade Legal
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-serif">
                A Lei nº 15.224/2025 e a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">Proteção ao Doador</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Entenda os direitos, garantias, critérios sanitários e responsabilidades que balizam a redistribuição legal de alimentos no Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Conceitos Básicos */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Definições Jurídicas</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Conceitos Essenciais da PNCPDA</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {conceitos.map((c) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.title}
                    className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl space-y-4"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} shadow-lg font-bold`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-serif">{c.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Garantias aos Doadores */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Segurança Jurídica</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Por que Doar com o FoodCycle é Seguro?</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                A Lei nº 15.224/2025 protege a empresa doadora que opera de boa-fé.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {garantiasDoadores.map((g) => {
                const Icon = g.icon
                return (
                  <div
                    key={g.title}
                    className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all space-y-3"
                  >
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{g.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Hierarquia de Destinação */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Ordem de Prioridade</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Hierarquia Legal de Destinação (Art. 4º)</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {destinacoes.map((d) => {
                const Icon = d.icon
                return (
                  <div
                    key={d.title}
                    className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${d.color}`}>
                        {d.badge}
                      </span>
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-serif">{d.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Responsabilidades e Compliance */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Boas Práticas</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Deveres e Critérios Sanitários</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {responsabilidades.map((r) => {
                const Icon = r.icon
                return (
                  <div
                    key={r.title}
                    className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-3"
                  >
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{r.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Opere com segurança jurídica comprovada.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Cadastre sua empresa e faça doações de excedentes com respaldo total da Lei nº 15.224/2025.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro">
                  Cadastrar Empresa Doadora
                  <ArrowRight className="ml-2 h-4 w-4" />
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
