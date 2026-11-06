import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Building2,
  Heart,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale
} from "lucide-react"

const recentDonations = [
  {
    id: 1,
    date: "12/03/2026",
    empresa: "Supermercado Vida",
    instituicao: "Lar dos Idosos Esperança",
    alimentos: "Frutas frescas variadas",
    quantidade: "45 kg",
    status: "Entregue e Auditado"
  },
  {
    id: 2,
    date: "11/03/2026",
    empresa: "Padaria Pão Quente",
    instituicao: "Casa da Criança e Juventude",
    alimentos: "Pães integrais e bolos",
    quantidade: "30 kg",
    status: "Entregue e Auditado"
  },
  {
    id: 3,
    date: "11/03/2026",
    empresa: "Restaurante Sabor & Cia",
    instituicao: "Comunidade São José",
    alimentos: "Refeições prontas higienizadas",
    quantidade: "50 kg",
    status: "Entregue e Auditado"
  },
  {
    id: 4,
    date: "10/03/2026",
    empresa: "Hortifruti Verde",
    instituicao: "Abrigo Esperança",
    alimentos: "Legumes e hortaliças colhidos",
    quantidade: "80 kg",
    status: "Entregue e Auditado"
  },
  {
    id: 5,
    date: "10/03/2026",
    empresa: "Supermercado Vida",
    instituicao: "Creche Arco-Íris",
    alimentos: "Laticínios e derivados pasteurizados",
    quantidade: "25 kg",
    status: "Entregue e Auditado"
  },
]

const monthlyStats = [
  { month: "Janeiro", doacoes: 42, kg: 850, empresas: 28, instituicoes: 18 },
  { month: "Fevereiro", doacoes: 48, kg: 920, empresas: 32, instituicoes: 20 },
  { month: "Março", doacoes: 55, kg: 1100, empresas: 35, instituicoes: 22 },
]

export default function TransparenciaPage() {
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
                <Eye className="h-3.5 w-3.5 text-amber-400" />
                Auditoria Cidadã e Dados Abertos
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-serif">
                Transparência e <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">Prestação de Contas</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Histórico aberto de movimentação de alimentos, certificando a conformidade legal com a Lei nº 15.224/2025 e a integridade de todas as transações sociais.
              </p>
            </div>
          </div>
        </section>

        {/* Tabela de Doações Auditadas */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#071B17]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-6 sm:p-8 backdrop-blur shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-emerald-950/60">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">Livro Público de Entregas</h3>
                  <p className="text-xs text-slate-400 mt-1">Registros recentes de alimentos redistribuídos com atestado de conformidade</p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/40">
                  Totalmente Auditável
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-emerald-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A241F]/60 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-emerald-950">
                    <tr>
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4">Empresa Doadora</th>
                      <th className="py-3.5 px-4">Instituição Receptora</th>
                      <th className="py-3.5 px-4">Lote / Alimentos</th>
                      <th className="py-3.5 px-4">Volume</th>
                      <th className="py-3.5 px-4">Validação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/50">
                    {recentDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-[#0A241F]/30 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono">{d.date}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{d.empresa}</td>
                        <td className="py-3.5 px-4 text-slate-300">{d.instituicao}</td>
                        <td className="py-3.5 px-4 text-slate-300">{d.alimentos}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{d.quantidade}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Consolidado Mensal */}
        <section className="py-20 border-b border-emerald-950/60 bg-[#052E24]/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Consolidação Trimestral</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Resultados Públicos por Período</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {monthlyStats.map((stat) => (
                <div
                  key={stat.month}
                  className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-7 backdrop-blur shadow-xl space-y-4"
                >
                  <h4 className="text-lg font-bold text-white font-serif">{stat.month}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-emerald-950/60">
                      <span className="text-slate-400">Alimentos Salvos:</span>
                      <span className="font-mono font-bold text-emerald-400">{stat.kg} kg</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-emerald-950/60">
                      <span className="text-slate-400">Lotes Entregues:</span>
                      <span className="font-mono text-white">{stat.doacoes}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-emerald-950/60">
                      <span className="text-slate-400">Empresas Participantes:</span>
                      <span className="font-mono text-white">{stat.empresas}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Instituições Atendidas:</span>
                      <span className="font-mono text-white">{stat.instituicoes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-t from-[#040E0B] via-[#071B17] to-[#052E24]">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-serif">
              Faça parte da prestação de contas nacional.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Sua organização com dados protegidos, relatórios automatizados e compliance sanitário absoluto.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/60">
                <Link href="/cadastro">
                  Credenciar Minha Organização
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
