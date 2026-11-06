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
  ArrowUpRight
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
    { name: "Disponível", value: statusCountMap.disponivel, color: "#10b981" },
    { name: "Reservado", value: statusCountMap.reservado, color: "#f59e0b" },
    { name: "Em Transporte", value: statusCountMap.em_transporte, color: "#3b82f6" },
    { name: "Entregue", value: statusCountMap.entregue, color: "#6366f1" },
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

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel de Controle Geral</h1>
          <p className="text-muted-foreground">
            Acompanhamento em tempo real de doadores, receptores, estoque de alimentos e fluxo da PNCPDA.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Conectado ao Supabase
        </div>
      </div>

      {/* Grid de Cards - Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume de Alimentos</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalKg.toLocaleString("pt-BR")} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              {refeicoesEstimadas.toLocaleString("pt-BR")} refeições estimadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Doações Publicadas</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalDoacoes}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {doacoesDisponiveis} disponíveis • {doacoesConcluidas} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Empresas Doadoras</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {empresas.filter(e => e.selo_doador).length} com Selo PNCPDA
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Instituições Receptoras</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Heart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalInstituicoes}</div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {solicitacoesPendentes} solicitações pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos com Dados Reais */}
      <AdminOverviewCharts
        statusData={statusPieData}
        categoryData={categoryBarData}
        totalKg={totalKg}
      />

      {/* Atalhos Rápidos para Gestão */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-foreground">Empresas e Selos</CardTitle>
              <Link href="/admin/empresas" className="text-primary hover:underline text-xs flex items-center gap-1">
                Acessar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <CardDescription>
              Valide o cumprimento de requisitos para concessão do Selo Doador de Alimentos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-foreground">Lotes & Auditoria Sanitária</CardTitle>
              <Link href="/admin/doacoes" className="text-primary hover:underline text-xs flex items-center gap-1">
                Acessar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <CardDescription>
              Rastreabilidade de validade, acondicionamento e conformidade PNCPDA.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-foreground">Auditoria & Logs</CardTitle>
              <Link href="/admin/auditoria" className="text-primary hover:underline text-xs flex items-center gap-1">
                Acessar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <CardDescription>
              Registro imutável de todas as ações administrativas executadas.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
