import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
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
  Award,
  Sparkles,
  Scale
} from "lucide-react"

const benefits = [
  {
    icon: TrendingDown,
    title: "Zero Desperdício e Economia",
    description: "Elimine custos de descarte em aterros sanitários e transforme excedentes em investimento social corporativo."
  },
  {
    icon: Shield,
    title: "Segurança Jurídica Total",
    description: "Amparo da Lei nº 15.224/2025: doações de boa-fé não geram responsabilidade civil nem configuram relação de consumo."
  },
  {
    icon: Award,
    title: "Selo Oficial Doador de Alimentos",
    description: "Certificação governamental reconhecida para relatórios ESG, governança sustentável e balanço social."
  },
  {
    icon: BarChart3,
    title: "Métricas e Telemetria em Tempo Real",
    description: "Monitore o volume exato em kg doado, o número de refeições viabilizadas e o CO2 evitado na atmosfera."
  },
  {
    icon: Users,
    title: "Conexão Direta com a Comunidade",
    description: "Seus alimentos chegam a instituições auditadas e cadastradas na sua própria cidade e região metropolitana."
  },
  {
    icon: ClipboardList,
    title: "Rastreabilidade Auditável",
    description: "Cada lote conta com código de rastreio e confirmação digital de entrega para controle fiscal e sanitário."
  }
]

const features = [
  "Credenciamento gratuito e imediato",
  "Painel de controle institucional B2B",
  "Cadastramento de lotes em menos de 1 minuto",
  "Opção de microcoleta para fracionamento de excedentes",
  "Emissão de termos de entrega digitalizados com timestamp",
  "Pontuação automática para Selo Doador de Alimentos (Bronze, Prata e Ouro)",
  "Relatórios auditáveis em conformidade com a PNCPDA",
  "Geolocalização para retirada ágil por instituições próximas"
]

export default function EmpresasPage() {
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
                <Building2 className="h-3.5 w-3.5 text-amber-400" />
                Para Empresas, Supermercados e Agronegócio
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight font-serif">
                Transforme excedentes em <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">valor ESG e vidas salvas</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Junte-se à maior rede corporativa de redução de desperdício alimentar do país com segurança jurídica da Lei nº 15.224/2025.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                  <Link href="/cadastro?tipo=empresa">
                    Cadastrar Minha Empresa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-11 px-8 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white">
                  <Link href="/aspectos-legais">Ver Segurança Jurídica</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Vantagens Corporativas</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Por que Doar pelo FoodCycle?</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.title}
                    className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all space-y-3"
                  >
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif">{b.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{b.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recursos da Plataforma */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-8 sm:p-12 backdrop-blur shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Recursos Integrados</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">O que a sua empresa recebe:</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0A241F]/40 border border-emerald-950/60 text-xs text-slate-200">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Comece a doar hoje mesmo.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Sem burocracia, 100% digital e com emissão automática de termos de conformidade da Lei nº 15.224/2025.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro?tipo=empresa">
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
