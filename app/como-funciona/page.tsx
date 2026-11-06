import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
  Package,
  Search,
  HandHeart,
  CheckCircle,
  ClipboardList,
  Building2,
  Heart,
  Truck,
  ArrowRight,
  Sparkles,
  Scale
} from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Empresa Cadastra o Excedente",
    description: "A empresa doadora registra alimentos próprios para consumo, indicando peso em kg, validade, temperatura de conservação e lote rastreável.",
    icon: Package,
    color: "from-emerald-400 to-emerald-600 text-[#071B17]",
    details: [
      "Cadastro rápido e intuitivo",
      "Geração automática de código de rastreio",
      "Classificação nutricional prévia",
      "Respaldo legal da Lei 15.224/2025"
    ]
  },
  {
    step: 2,
    title: "Mapeamento em Tempo Real",
    description: "As instituições cadastradas visualizam os lotes disponíveis no mapa georreferenciado e recebem telemetria de frescor.",
    icon: Search,
    color: "from-teal-400 to-teal-600 text-[#071B17]",
    details: [
      "Filtros por proximidade e categoria",
      "Visualização de requisitos sanitários",
      "Informações nutricionais transparentes",
      "Alertas automáticos de lotes prioritários"
    ]
  },
  {
    step: 3,
    title: "Solicitação Institucional",
    description: "A entidade beneficiária solicita a reserva do lote informando a estimativa de pessoas e famílias a serem contempladas.",
    icon: HandHeart,
    color: "from-amber-400 to-amber-600 text-[#071B17]",
    details: [
      "Solicitação direta sem intermediários",
      "Justificativa de atendimento comunitário",
      "Acompanhamento de status em tempo real",
      "Histórico institucional preservado"
    ]
  },
  {
    step: 4,
    title: "Aprovação e Reserva do Lote",
    description: "A empresa doadora revisa a solicitação e aprova o pedido, mudando o status para 'Reservado' e agendando a janela de coleta.",
    icon: CheckCircle,
    color: "from-emerald-400 to-emerald-600 text-[#071B17]",
    details: [
      "Aprovação segura em 1 clique",
      "Janela de retirada sincronizada",
      "Emissão de protocolo com QR/código",
      "Notificação instantânea para ambas as partes"
    ]
  },
  {
    step: 5,
    title: "Logística e Retirada Física",
    description: "A instituição ou intermediário logístico retira os alimentos no local acordado, seguindo as boas práticas sanitárias.",
    icon: Truck,
    color: "from-blue-400 to-blue-600 text-[#071B17]",
    details: [
      "Verificação da integridade das embalagens",
      "Transporte adequado à temperatura exigida",
      "Termo de entrega física com timestamp",
      "Isenção de responsabilidade do doador de boa-fé"
    ]
  },
  {
    step: 6,
    title: "Rastreio e Selo ESG",
    description: "O sistema valida a conclusão da entrega, atualiza os indicadores municipais da PNCPDA e computa pontos para o Selo Doador de Alimentos.",
    icon: ClipboardList,
    color: "from-purple-400 to-purple-600 text-[#071B17]",
    details: [
      "Registro de auditoria criptográfica",
      "Cálculo de refeições salvas e CO2 evitado",
      "Relatórios exportáveis em CSV/PDF",
      "Reconhecimento público de impacto social"
    ]
  }
]

export default function ComoFuncionaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 border-b border-emerald-950/60 bg-gradient-to-b from-[#052E24] via-[#071B17] to-[#040E0B]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800/40 px-4 py-1.5 text-xs font-mono text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Fluxo Operacional Descomplicado
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-serif">
                Como Funciona a Conexão que <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">Salva Alimentos</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Da identificação do excedente na gôndola à refeição servida na instituição comunitária. Um processo em 6 etapas estruturado para garantir agilidade e conformidade sanitária.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Grid */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-7 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg font-bold`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <span className="text-3xl font-black font-mono text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                        0{item.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-serif">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-emerald-950/60">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fluxo Diagramático */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Arquitetura de Conexão</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">O Ciclo Completo em 3 Pilares</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 text-center space-y-3">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Building2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-white">Empresa Doadora</h4>
                <p className="text-xs text-slate-400">Cadastra excedentes, evita custos de descarte e garante selo de responsabilidade socioambiental.</p>
              </div>

              <div className="rounded-2xl border border-emerald-800/80 bg-[#0A241F]/80 p-6 text-center space-y-3 shadow-xl shadow-emerald-950">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Package className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-white">FoodCycle Engine</h4>
                <p className="text-xs text-slate-400">Rastreia o lote, valida requisitos da Lei 15.224/2025 e coordena a destinação rápida.</p>
              </div>

              <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 text-center space-y-3">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Heart className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-white">Instituição Receptora</h4>
                <p className="text-xs text-slate-400">Recebe alimentos seguros e frescos para converter em refeições nutritivas à comunidade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Pronto para transformar sua operação?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Cadastre sua organização em menos de 2 minutos e tenha acesso imediato à infraestrutura de redistribuição de alimentos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro">
                  Começar Agora
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
