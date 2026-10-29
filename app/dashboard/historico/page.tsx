"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Building2, 
  Calendar, 
  Download, 
  TrendingUp,
  Scale,
  CheckCircle2,
  Inbox
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoricoItem {
  id: number
  codigo_rastreio: string
  tipo_alimento: string
  quantidade_kg: number
  categoria: string
  status: string
  data_criacao: string
  destino: string
  empresas?: {
    nome_fantasia: string | null
    razao_social: string
  } | null
}

export default function HistoricoPage() {
  const [itens, setItens] = useState<HistoricoItem[]>([])
  const [carregando, setCarregando] = useState(true)

  const carregarHistorico = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("doacoes")
        .select(`
          id,
          codigo_rastreio,
          tipo_alimento,
          quantidade_kg,
          categoria,
          status,
          destino,
          data_criacao,
          empresas (
            nome_fantasia,
            razao_social
          )
        `)
        .order("id", { ascending: false })

      if (error) {
        console.error("Erro ao carregar histórico:", error)
      } else if (data) {
        setItens(data as unknown as HistoricoItem[])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  const totalKg = itens.reduce((acc, item) => acc + Number(item.quantidade_kg || 0), 0)
  const empresasUnicas = new Set(
    itens.map((i) => i.empresas?.nome_fantasia || i.empresas?.razao_social).filter(Boolean)
  ).size
  const categoriasUnicas = new Set(itens.map((i) => i.categoria).filter(Boolean)).size

  const exportarCSV = () => {
    if (itens.length === 0) return

    const cabecalho = "Codigo de Rastreio,Alimento,Empresa Doadora,Categoria,Quantidade (kg),Destinacao PNCPDA,Status,Data\n"
    const linhas = itens.map((i) => {
      const empresa = i.empresas?.nome_fantasia || i.empresas?.razao_social || "Empresa Doadora"
      const data = new Date(i.data_criacao).toLocaleDateString("pt-BR")
      return `"${i.codigo_rastreio}","${i.tipo_alimento}","${empresa}","${i.categoria}",${i.quantidade_kg},"${i.destino}","${i.status}","${data}"`
    }).join("\n")

    const blob = new Blob([cabecalho + linhas], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `foodcycle-relatorio-rastreabilidade-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico e Rastreabilidade</h1>
          <p className="text-muted-foreground">
            Auditoria completa dos lotes de doação conforme a Lei nº 15.224/2025 (PNCPDA)
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={exportarCSV}
          disabled={itens.length === 0}
        >
          <Download className="h-4 w-4" />
          Exportar Relatório CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalKg.toLocaleString("pt-BR")} kg</p>
                <p className="text-sm text-muted-foreground">Volume Total Mapeado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{itens.length}</p>
                <p className="text-sm text-muted-foreground">Lotes Registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Building2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{empresasUnicas || 1}</p>
                <p className="text-sm text-muted-foreground">Empresas Participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
                <Calendar className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categoriasUnicas || 1}</p>
                <p className="text-sm text-muted-foreground">Categorias de Alimentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Lotes e Auditoria de Rastreio</CardTitle>
              <CardDescription>
                Código único gerado por lote para garantia de integridade sanitária e fiscal
              </CardDescription>
            </div>
            <button
              onClick={carregarHistorico}
              className="text-xs text-primary hover:underline focus:outline-none"
            >
              Recarregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex min-h-[180px] items-center justify-center text-muted-foreground text-sm">
              Carregando dados de rastreabilidade...
            </div>
          ) : itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 text-muted-foreground/40 mb-2" />
              <p className="font-medium text-foreground">Nenhum lote registrado ainda</p>
              <p className="text-xs mt-1">
                Ao cadastrar novas doações, os códigos de rastreio serão registrados aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">Código Rastreio</th>
                    <th className="pb-3 font-medium">Alimento</th>
                    <th className="pb-3 font-medium">Empresa Doadora</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Quantidade</th>
                    <th className="pb-3 font-medium">Destinação</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {itens.map((item) => {
                    const empresa =
                      item.empresas?.nome_fantasia ||
                      item.empresas?.razao_social ||
                      "Empresa Doadora"
                    return (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 font-mono font-semibold text-primary">
                          {item.codigo_rastreio}
                        </td>
                        <td className="py-3 font-medium text-foreground">
                          {item.tipo_alimento}
                        </td>
                        <td className="py-3 text-muted-foreground">{empresa}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {item.categoria.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 font-medium text-foreground">
                          {item.quantidade_kg} kg
                        </td>
                        <td className="py-3 text-muted-foreground capitalize">
                          {item.destino}
                        </td>
                        <td className="py-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${
                              item.status === 'disponivel' ? 'border-primary text-primary' :
                              item.status === 'reservado' ? 'border-secondary text-secondary' :
                              'border-muted text-muted-foreground'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(item.data_criacao).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
