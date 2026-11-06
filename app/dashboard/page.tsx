"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"
import { useDonationMetrics } from "@/lib/donation-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Package, 
  TrendingUp, 
  Users, 
  Apple, 
  Carrot, 
  Wheat, 
  Beef, 
  Milk, 
  Cookie, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Award, 
  Medal, 
  ArrowRight, 
  Scale, 
  Heart, 
  Sprout, 
  Recycle, 
  ShieldCheck,
  Sparkles
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

const fallbackCategories = [
  { name: "Proteínas", value: 275, percentage: 22, color: "#10B981", icon: Beef, status: "Bom" },
  { name: "Grãos e Cereais", value: 350, percentage: 28, color: "#F59E0B", icon: Wheat, status: "Excelente" },
  { name: "Frutas", value: 188, percentage: 15, color: "#34D399", icon: Apple, status: "Adequado" },
  { name: "Hortaliças", value: 225, percentage: 18, color: "#059669", icon: Carrot, status: "Bom" },
  { name: "Laticínios", value: 125, percentage: 10, color: "#6EE7B7", icon: Milk, status: "Baixo" },
  { name: "Ultraprocessados", value: 87, percentage: 7, color: "#F87171", icon: Cookie, status: "Adequado" }
]

const fallbackMonthly = [
  { mes: "Jan", quantidade: 800 },
  { mes: "Fev", quantidade: 950 },
  { mes: "Mar", quantidade: 1100 },
  { mes: "Abr", quantidade: 980 },
  { mes: "Mai", quantidade: 1250 },
  { mes: "Jun", quantidade: 1400 }
]

const companyBadges = [
  {
    name: "Selo Doador de Alimentos - Ouro",
    description: "Empresa de alto desempenho na PNCPDA: regularidade, diversidade e rastreabilidade completa das doações.",
    icon: Award,
    color: "from-amber-400 to-amber-600 text-[#071B17]",
    companies: ["Supermercado Vida", "Hortifruti Verde"]
  },
  {
    name: "Selo Doador de Alimentos - Prata",
    description: "Empresa em conformidade com a PNCPDA, com doações regulares e boa diversidade nutricional.",
    icon: Medal,
    color: "from-slate-300 to-slate-500 text-[#071B17]",
    companies: ["Restaurante Sabor & Cia", "Padaria Pão Quente"]
  },
  {
    name: "Selo Aderente PNCPDA",
    description: "Empresa cadastrada e participando ativamente da Política Nacional de Combate à Perda e ao Desperdício.",
    icon: ShieldCheck,
    color: "from-emerald-400 to-emerald-600 text-[#071B17]",
    companies: ["Laticínios Sul", "Distribuidora Alimentos"]
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { metrics, isLoading } = useDonationMetrics()

  useEffect(() => {
    const supabase = createClient()
    async function verificarCadastro() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return
      const uid = data.user.id

      const isMaster = data.user.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
      const { data: perfil } = await supabase.from("profiles").select("tipo").eq("id", uid).maybeSingle()
      if (perfil?.tipo === "admin" || isMaster) {
        return
      }

      const [e, i, m] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("intermediarios").select("id").eq("perfil_id", uid).maybeSingle(),
      ])

      if (e.error || i.error || m.error) return

      if (!e.data && !i.data && !m.data) {
        router.replace("/completar-cadastro")
      }
    }
    verificarCadastro()
  }, [router])

  const displayTotalKg = metrics.totalKg > 0 ? metrics.totalKg : 1250
  const displayAtivas = metrics.totalKg > 0 ? metrics.doacoesAtivas : 24
  const displayBeneficiarios = metrics.beneficiarios > 0 ? metrics.beneficiarios : 450
  const monthlyData = metrics.totalKg > 0 ? metrics.monthlyData : fallbackMonthly

  const destinacaoData = [
    {
      titulo: "Consumo Humano",
      valor: `${Math.round(displayTotalKg * 0.86).toLocaleString("pt-BR")} kg`,
      percentual: 86,
      icon: Heart,
      badge: "Prioridade Legal (PNCPDA)",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      titulo: "Consumo Animal",
      valor: `${Math.round(displayTotalKg * 0.10).toLocaleString("pt-BR")} kg`,
      percentual: 10,
      icon: Sprout,
      badge: "2ª Opção Prioritária",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      titulo: "Compostagem / Biomassa",
      valor: `${Math.round(displayTotalKg * 0.04).toLocaleString("pt-BR")} kg`,
      percentual: 4,
      icon: Recycle,
      badge: "Última Instância",
      color: "text-slate-300 bg-slate-500/10 border-slate-500/20"
    },
  ]

  const statsCards = [
    {
      title: "Total de Alimentos Salvos",
      value: isLoading ? "..." : `${displayTotalKg.toLocaleString("pt-BR")} kg`,
      description: metrics.totalKg > 0 ? "Registrados em blockchain/banco" : "Volume acumulado na rede",
      icon: Package,
      trend: `${metrics.totalDoacoes || 8} lotes ativos`,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      title: "Doações Disponíveis para Retirada",
      value: isLoading ? "..." : `${displayAtivas}`,
      description: "Lotes aguardando instituição",
      icon: TrendingUp,
      trend: "Tempo real",
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    {
      title: "Pessoas Beneficiadas",
      value: isLoading ? "..." : `${displayBeneficiarios.toLocaleString("pt-BR")}`,
      description: "Impacto social mapeado",
      icon: Users,
      trend: "ODS 2 Fome Zero",
      iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  ]

  const recentList = metrics.recentDonations.length > 0
    ? metrics.recentDonations
    : [
        { alimento: "Arroz Integral", empresa: "Supermercado Bom Preço", quantidade: "50 kg", categoria: "Graos" },
        { alimento: "Maçãs Gala", empresa: "Hortifruti Central", quantidade: "30 kg", categoria: "Frutas" },
        { alimento: "Leite Pasteurizado", empresa: "Laticínios Sul", quantidade: "100 L", categoria: "Laticinios" },
        { alimento: "Feijão Preto Tipo 1", empresa: "Distribuidora Alimentos", quantidade: "40 kg", categoria: "Graos" }
      ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 text-xs font-medium text-emerald-300">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            Conformidade Integral Lei nº 15.224/2025 • PNCPDA
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Painel Operacional
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão de excedentes, rastreabilidade de lotes e metas de combate à fome.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/60 cursor-pointer">
            <Link href="/dashboard/doacoes">
              Ver Doações Disponíveis
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-6 backdrop-blur shadow-xl relative overflow-hidden group hover:border-emerald-800/60 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.title}</p>
                <p className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{stat.value}</p>
                <p className="mt-1.5 text-xs text-slate-400">{stat.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.iconBg}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hierarquia de destinação - PNCPDA */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 sm:p-8 backdrop-blur shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-emerald-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" />
              Hierarquia Legal de Destinação (Art. 4º da PNCPDA)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direcionamento obrigatório para maximizar o aproveitamento de alimentos próprios para consumo humano.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="h-8 border-emerald-900/60 text-slate-300 hover:text-white hover:bg-emerald-950/40 text-xs">
            <Link href="/aspectos-legais">Ver Marco Legal</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {destinacaoData.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.titulo}
                className="rounded-xl border border-emerald-950/60 bg-[#0A241F]/40 p-5 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.badge}
                  </span>
                  <Icon className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white font-mono">{item.valor}</span>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">({item.percentual}%)</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-emerald-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gráficos e Selos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico Mensal */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Evolução Mensal de Arrecadação</h3>
              <p className="text-xs text-slate-400">Quilogramas de alimentos salvos nos últimos meses</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              Meta ODS 2
            </span>
          </div>

          <div className="h-[260px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#052E24" />
                <XAxis dataKey="mes" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#071B17",
                    border: "1px solid #052E24",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                  formatter={(value: any) => [`${value} kg`, "Volume"]}
                />
                <Bar dataKey="quantidade" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selos da PNCPDA */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Selos Oficiais Doador de Alimentos
            </h3>
            <p className="text-xs text-slate-400">
              Certificação pública de conformidade ESG e impacto social
            </p>
          </div>

          <div className="space-y-3">
            {companyBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-emerald-950/60 bg-[#0A241F]/40 p-4 flex items-start gap-3.5"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${badge.color} shadow-md shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{badge.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {badge.companies.map((c, i) => (
                        <span key={i} className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabela de Doações Recentes */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Doações e Excedentes Recentes</h3>
            <p className="text-xs text-slate-400">Últimos registros de alimentos integrados na rede</p>
          </div>
          <Button variant="outline" size="sm" asChild className="h-8 border-emerald-900/60 text-slate-300 hover:text-white hover:bg-emerald-950/40 text-xs">
            <Link href="/dashboard/doacoes">Explorar Todos os Lotes</Link>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-emerald-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A241F]/60 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-emerald-950">
              <tr>
                <th className="py-3 px-4">Alimento</th>
                <th className="py-3 px-4">Empresa / Doador</th>
                <th className="py-3 px-4">Quantidade</th>
                <th className="py-3 px-4">Categoria Nutricional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/50">
              {recentList.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#0A241F]/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{item.alimento}</td>
                  <td className="py-3.5 px-4 text-slate-300">{item.empresa}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">{item.quantidade}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {item.categoria}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
