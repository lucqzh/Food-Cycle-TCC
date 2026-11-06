import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Heart, 
  Users, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Utensils, 
  Scale,
  ArrowUpRight,
  Zap
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
  // Métrica válida documentada no schema do FoodCycle (1 kg ~ 4 refeições)
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
    { name: "Em Transporte", value: statusCountMap.em_transporte, color: "#3b82f6" },
    { name: "Entregue", value: statusCountMap.entregue, color: "#7C3AED" },
    { name: "Cancelado/Vencido", value: statusCountMap.cancelado + statusCountMap.vencido, color: "#ef4444" },
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
      title: "Volume de Alimentos",
      value: `${totalKg.toLocaleString("pt-BR")} kg`,
      sub: `${refeicoesEstimadas.toLocaleString("pt-BR")} refeições estimadas`,
      icon: Package,
      iconColor: "#16A34A",
      iconBg: "rgba(22,163,74,0.12)",
      glowColor: "rgba(22,163,74,0.08)",
      borderColor: "rgba(22,163,74,0.2)",
    },
    {
      title: "Doações Publicadas",
      value: String(totalDoacoes),
      sub: `${doacoesDisponiveis} disponíveis · ${doacoesConcluidas} concluídas`,
      icon: TrendingUp,
      iconColor: "#7C3AED",
      iconBg: "rgba(124,58,237,0.12)",
      glowColor: "rgba(124,58,237,0.06)",
      borderColor: "rgba(124,58,237,0.2)",
    },
    {
      title: "Empresas Doadoras",
      value: String(totalEmpresas),
      sub: `${empresas.filter(e => e.selo_doador).length} com Selo PNCPDA`,
      icon: Building2,
      iconColor: "#F59E0B",
      iconBg: "rgba(245,158,11,0.12)",
      glowColor: "rgba(245,158,11,0.06)",
      borderColor: "rgba(245,158,11,0.2)",
    },
    {
      title: "Instituições Receptoras",
      value: String(totalInstituicoes),
      sub: `${solicitacoesPendentes} solicitações pendentes`,
      icon: Heart,
      iconColor: "#16A34A",
      iconBg: "rgba(22,163,74,0.12)",
      glowColor: "rgba(22,163,74,0.06)",
      borderColor: "rgba(22,163,74,0.2)",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Controle Geral</h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Acompanhamento em tempo real de doadores, receptores, estoque de alimentos e fluxo da PNCPDA.
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{
            background: "rgba(22,163,74,0.08)",
            border: "1px solid rgba(22,163,74,0.2)",
            color: "#16A34A",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Conectado ao Supabase
        </div>
      </div>

      {/* Grid de Cards - Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl p-5 transition-all duration-200"
            style={{
              background: `radial-gradient(ellipse at top left, ${card.glowColor}, transparent 70%), #0A1A14`,
              border: `1px solid ${card.borderColor}`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#64748B" }}>
                {card.title}
              </p>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: card.iconBg }}
              >
                <card.icon className="h-4 w-4" style={{ color: card.iconColor }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-xs" style={{ color: card.iconColor }}>{card.sub}</p>
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
        {[
          {
            title: "Empresas e Selos",
            desc: "Valide o cumprimento de requisitos para concessão do Selo Doador de Alimentos.",
            href: "/admin/empresas",
            accent: "#16A34A",
          },
          {
            title: "Lotes & Auditoria Sanitária",
            desc: "Rastreabilidade de validade, acondicionamento e conformidade PNCPDA.",
            href: "/admin/doacoes",
            accent: "#7C3AED",
          },
          {
            title: "Auditoria & Logs",
            desc: "Registro imutável de todas as ações administrativas executadas.",
            href: "/admin/auditoria",
            accent: "#F59E0B",
          },
        ].map((shortcut) => (
          <div
            key={shortcut.href}
            className="rounded-xl p-5 transition-all duration-200 group"
            style={{
              background: "#0A1A14",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${shortcut.accent}33`
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">{shortcut.title}</h3>
              <Link
                href={shortcut.href}
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: shortcut.accent }}
              >
                Acessar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-xs" style={{ color: "#64748B" }}>{shortcut.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
