import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
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
  Sprout,
  Sparkles
} from "lucide-react"

const odsGoals = [
  {
    number: "2.1",
    title: "Acesso a Alimentos Seguros e Suficientes",
    description: "Até 2030, acabar com a fome e garantir o acesso de todas as pessoas, em particular pessoas em vulnerabilidade, a alimentos nutritivos durante todo o ano.",
    icon: Apple,
    color: "from-emerald-400 to-emerald-600 text-[#071B17]",
    contribution: [
      "Redistribuição de excedentes frescos antes do término da validade comercial",
      "Rastreabilidade completa com garantias sanitárias da Lei nº 15.224/2025",
      "Eliminação de intermediários onerosos na destinação social"
    ]
  },
  {
    number: "2.2",
    title: "Combate à Desnutrição e Diversidade Nutricional",
    description: "Erradicar todas as formas de desnutrição através de dietas balanceadas com micro e macronutrientes essenciais.",
    icon: Scale,
    color: "from-amber-400 to-amber-600 text-[#071B17]",
    contribution: [
      "Algoritmo que mede e incentiva o equilíbrio de 5 grupos alimentares",
      "Painel de diversidade nutricional para as instituições beneficiárias",
      "Controle ativo sobre o percentual de ultraprocessados"
    ]
  },
  {
    number: "2.4",
    title: "Sistemas Alimentares Sustentáveis e Resilientes",
    description: "Garantir sistemas sustentáveis de produção e consumo, evitando a emissão de metano decorrente do descarte de alimentos em aterros.",
    icon: Recycle,
    color: "from-blue-400 to-blue-600 text-[#071B17]",
    contribution: [
      "Evita o descarte de toneladas de matéria orgânica aproveitável",
      "Redução da pegada de carbono no ecossistema de varejo",
      "Selo ESG reconhecido para empresas parceiras"
    ]
  }
]

export default function ODS2Page() {
  return (
    <div className="flex min-h-screen flex-col bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 border-b border-emerald-950/60 bg-gradient-to-b from-[#052E24] via-[#071B17] to-[#040E0B]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/80 border border-amber-800/40 px-4 py-1.5 text-xs font-mono text-amber-300">
                <Target className="h-3.5 w-3.5" />
                Pacto Global ONU • Agenda 2030
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight font-serif">
                ODS 2: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">Fome Zero</span> e Agricultura Sustentável.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Como nossa arquitetura tecnológica implementa na prática as metas globais de combate à fome e mitigação de perdas ao longo da cadeia de valor brasileira.
              </p>
            </div>
          </div>
        </section>

        {/* Metas Específicas do ODS 2 */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Implementação Prática</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Metas Vinculadas ao FoodCycle</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Alinhamento direto com os sub-objetivos definidos pelas Nações Unidas.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {odsGoals.map((goal) => {
                const Icon = goal.icon
                return (
                  <div
                    key={goal.number}
                    className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${goal.color} font-black text-xl shadow-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-black font-mono text-amber-400">
                          Meta {goal.number}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-serif leading-snug">{goal.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{goal.description}</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-emerald-950/60">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block mb-1">
                        Como o FoodCycle atua:
                      </span>
                      {goal.contribution.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Citação Editorial */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
              <Globe className="h-8 w-8" />
            </div>
            <blockquote className="text-2xl sm:text-3xl font-serif text-white italic leading-relaxed">
              &ldquo;O desperdício de alimentos não é apenas um problema ético e humanitário, mas uma das maiores falhas de eficiência e sustentabilidade da história contemporânea.&rdquo;
            </blockquote>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              ONU • Organização das Nações Unidas para a Alimentação e a Agricultura (FAO)
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Faça sua empresa liderar o cumprimento do ODS 2.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Obtenha relatórios de responsabilidade socioambiental auditáveis e transforme sua gestão de excedentes.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro">
                  Junte-se ao Movimento
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
