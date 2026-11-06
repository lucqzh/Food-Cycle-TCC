import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
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
  Users,
  Sparkles
} from "lucide-react"

const benefits = [
  {
    icon: Search,
    title: "Acesso Imediato a Excedentes",
    description: "Visualize lotes disponíveis na sua cidade e bairro em tempo real, sem intermediários ou custos."
  },
  {
    icon: Utensils,
    title: "Dignidade e Diversidade Nutricional",
    description: "Alimentos frescos, frutas, verduras, proteínas e grãos que enriquecem o cardápio dos assistidos."
  },
  {
    icon: BarChart3,
    title: "Métricas de Atendimento Comunitário",
    description: "Acompanhe relatórios automáticos de refeições geradas para prestar contas a mantenedores e conselhos."
  },
  {
    icon: History,
    title: "Histórico Seguro e Rastreável",
    description: "Guarda digital de todos os lotes recebidos com confirmação de entrega física para fins regulatórios."
  },
  {
    icon: Bell,
    title: "Alertas de Lotes Próximos",
    description: "Notificações instantâneas quando empresas doadoras da sua região publicarem alimentos disponíveis."
  },
  {
    icon: ShieldCheck,
    title: "Conformidade Sanitária Rigorosa",
    description: "Alimentos que respeitam padrões de temperatura, integridade de embalagens e validade comercial."
  }
]

const features = [
  "Credenciamento 100% gratuito para entidades sociais",
  "Solicitação de doação em 1 clique",
  "Painel com mapa geolocalizado de empresas doadoras",
  "Opção de retirada fracionada (microcoleta)",
  "Relatórios em PDF/CSV para prestação de contas",
  "Termos de recebimento padronizados sob a Lei 15.224/2025",
  "Acompanhamento da qualidade nutricional dos alimentos",
  "Suporte técnico prioritário para instituições sem fins lucrativos"
]

export default function InstituicoesPage() {
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
                <Heart className="h-3.5 w-3.5" />
                Para ONGs, Abrigos, Cozinhas Comunitárias e Coletivos
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight font-serif">
                Acesso desburocratizado a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">alimentos de verdade</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Conecte sua instituição a empresas parceiras e receba doações regulares com controle sanitário, rastreabilidade e dignidade para as famílias atendidas.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                  <Link href="/cadastro?tipo=instituicao">
                    Cadastrar Minha Instituição
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-11 px-8 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white">
                  <Link href="/mapa">Ver Mapa de Doadores</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Vantagens para Instituições</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Alimentação Digna e Contínua</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.title}
                    className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all space-y-3"
                  >
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
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

        {/* Recursos */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-8 sm:p-12 backdrop-blur shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Suporte Operacional</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">O que a sua entidade recebe gratuitamente:</h3>
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
              Receba alimentos para sua comunidade.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Cadastre sua instituição em minutos e conecte-se aos lotes disponíveis em supermercados e produtores parceiros.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro?tipo=instituicao">
                  Cadastrar Instituição Receptora
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
