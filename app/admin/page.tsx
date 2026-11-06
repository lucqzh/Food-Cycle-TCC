import { createClient } from "@/lib/supabase/server"
import { 
  Building2, 
  Heart, 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Scale
} from "lucide-react"
import Link from "next/link"
import { AdminOverviewCharts } from "./overview-charts"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Consultas agregadas e seguras no Supabase
  const [
    empresasRes,
    instituicoesRes,
    profilesRes,
    doacoesRes,
    solicitacoesRes,
    entregasRes
  ] = await Promise.all([
    supabase.from("empresas").select("id, nome_fantasia, razao_social, cidade, estado, selo_doador, nivel_selo"),
    supabase.from("instituicoes").select("id, razao_social, tipo_instituicao, pessoas_atendidas"),
    supabase.from("profiles").select("id, tipo"),
    supabase.from("doacoes").select("id, quantidade_kg, status, categoria, destino, data_criacao, empresa_id"),
    supabase.from("solicitacoes").select("id, status"),
    supabase.from("entregas").select("id, status").maybeSingle()
  ])

  const empresas = empresasRes.data || []
  const instituicoes = instituicoesRes.data || []
  const profiles = profilesRes.data || []
  const doacoes = doacoesRes.data || []
  const solicitacoes = solicitacoesRes.data || []

  // Indicadores Numéricos Reais
  const totalEmpresas = empresas.length
  const totalInstituicoes = instituicoes.length
  const totalUsuarios = profiles.length || (totalEmpresas + totalInstituicoes)
  const totalDoacoes = doacoes.length
  const doacoesDisponiveis = doacoes.filter((d) => d.status === "disponivel").length
  const doacoesConcluidas = doacoes.filter((d) => d.status === "entregue").length
  const solicitacoesPendentes = solicitacoes.filter((s) => s.status === "pendente").length

  const totalKg = doacoes.reduce((acc, d) => acc + Number(d.quantidade_kg || 0), 0)
  const refeicoesEstimadas = Math.round(totalKg * 4)

  // Distribuição por Status das doações
  const statusCountMap: Record<string, number> = {
    disponivel: 0,
    reservado: 0,
    em_transporte: 0,
    entregue: 0,
    cancelado: 0,
    vencido: 0,
  }
  doacoes.forEach((d) => {
    if (d.status && statusCountMap[d.status] !== undefined) {
      statusCountMap[d.status]++
    }
  })

  const statusPieData = [
    { name: "Disponível", value: statusCountMap.disponivel, color: "#16A34A" },
    { name: "Reservado", value: statusCountMap.reservado, color: "#F59E0B" },
    { name: "Em Transporte", value: statusCountMap.em_transporte, color: "#3B82F6" },
    { name: "Entregue", value: statusCountMap.entregue, color: "#8B5CF6" },
    { name: "Cancelado/Vencido", value: statusCountMap.cancelado + statusCountMap.vencido, color: "#EF4444" },
  ].filter(item => item.value > 0 || totalDoacoes === 0)

  // Distribuição por Categoria de Alimento
  const categoriaMap: Record<string, number> = {}
  doacoes.forEach((d) => {
    const cat = d.categoria || "outro"
    categoriaMap[cat] = (categoriaMap[cat] || 0) + Number(d.quantidade_kg || 0)
  })
  const categoryBarData = Object.entries(categoriaMap).map(([name, kg]) => ({
    categoria: name.replace("_", " "),
    kg: Math.round(kg)
  }))

  const kpiCards = [
    {
      title: "Volume Total Mapeado",
      value: `${totalKg.toLocaleString("pt-BR")} kg`,
      sub: `${refeicoesEstimadas.toLocaleString("pt-BR")} refeições potenciais`,
      icon: Package,
      iconColor: "#10B981",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Lotes de Doações",
      value: String(totalDoacoes),
      sub: `${doacoesDisponiveis} disponíveis • ${doacoesConcluidas} concluídas`,
      icon: TrendingUp,
      iconColor: "#8B5CF6",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Empresas Doadoras",
      value: String(totalEmpresas),
      sub: `${empresas.filter(e => e.selo_doador).length} com Selo PNCPDA ativo`,
      icon: Building2,
      iconColor: "#F59E0B",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Instituições Receptoras",
      value: String(totalInstituicoes),
      sub: `${solicitacoesPendentes} solicitações aguardando`,
      icon: Heart,
      iconColor: "#10B981",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ]

  const shortcuts = [
    {
      title: "Empresas e Selos PNCPDA",
      desc: "Validação de conformidade técnica e emissão dos Selos Doador de Alimentos.",
      href: "/admin/empresas",
      badgeClass: "text-emerald-400 border-emerald-800/40 bg-emerald-950/40",
      hoverBorder: "hover:border-emerald-500/40"
    },
    {
      title: "Lotes e Auditoria Sanitária",
      desc: "Rastreabilidade de validade, acondicionamento e conformidade de cada lote.",
      href: "/admin/doacoes",
      badgeClass: "text-purple-400 border-purple-800/40 bg-purple-950/40",
      hoverBorder: "hover:border-purple-500/40"
    },
    {
      title: "Logs e Auditoria do Sistema",
      desc: "Registro imutável de todas as ações administrativas executadas na governança.",
      href: "/admin/auditoria",
      badgeClass: "text-amber-400 border-amber-800/40 bg-amber-950/40",
      hoverBorder: "hover:border-amber-500/40"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-950/80 border border-purple-800/40 px-3 py-1 text-xs font-mono text-purple-300">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            Governança Central da PNCPDA • Lei nº 15.224/2025
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Painel Geral de Controle
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitoramento em tempo real de doadores, receptores, estoque de alimentos e fluxo da política pública.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-mono bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Telemetria Supabase Ativa
        </div>
      </div>

      {/* Grid de Cards - Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-6 backdrop-blur shadow-xl relative overflow-hidden group hover:border-emerald-800/60 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.iconBg}`}>
                <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono tracking-tight mb-1">{card.value}</p>
            <p className="text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficos com Dados Reais */}
      <AdminOverviewCharts
        statusData={statusPieData}
        categoryData={categoryBarData}
        totalKg={totalKg}
      />

      {/* Atalhos Rápidos para Gestão */}
      <div className="grid gap-4 md:grid-cols-3">
        {shortcuts.map((s) => (
          <div
            key={s.href}
            className={`rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl transition-all ${s.hoverBorder} group`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white font-serif">{s.title}</h3>
              <Link
                href={s.href}
                className="text-xs font-mono flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                Acessar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
