"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Package, 
  Building2, 
  Calendar, 
  Download, 
  TrendingUp, 
  Scale, 
  CheckCircle2, 
  Inbox,
  Sparkles,
  RefreshCw,
  FileSpreadsheet
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 mb-1">
            <Scale className="h-3 w-3 text-amber-400" />
            Auditoria Contínua • Lei nº 15.224/2025
          </div>
          <h1 className="text-3xl font-extrabold text-white font-serif">Histórico e Rastreabilidade</h1>
          <p className="text-xs text-slate-400">
            Registro imutável de movimentação de alimentos para fins sanitários e de responsabilidade legal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarHistorico}
            className="h-10 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${carregando ? "animate-spin" : ""}`} />
            Recarregar
          </Button>
          <Button
            onClick={exportarCSV}
            disabled={itens.length === 0}
            className="h-10 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/60 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Exportar CSV Oficial
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Volume Total Mapeado</p>
          <p className="mt-2 text-2xl font-black text-white font-mono">{totalKg.toLocaleString("pt-BR")} kg</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lotes Registrados</p>
          <p className="mt-2 text-2xl font-black text-emerald-400 font-mono">{itens.length}</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Empresas Participantes</p>
          <p className="mt-2 text-2xl font-black text-amber-400 font-mono">{empresasUnicas || 1}</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Diversidade Nutricional</p>
          <p className="mt-2 text-2xl font-black text-blue-400 font-mono">{categoriasUnicas || 1} grupos</p>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Trilhas de Rastreabilidade Geradas</h3>
          <p className="text-xs text-slate-400">Código único por lote para conformidade com o marco legal</p>
        </div>

        {carregando ? (
          <div className="flex min-h-[250px] items-center justify-center font-mono text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
            Carregando trilhas de auditoria...
          </div>
        ) : itens.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Inbox className="h-10 w-10 text-emerald-500/40 mx-auto" />
            <p className="font-bold text-white text-sm">Nenhum lote registrado no histórico</p>
            <p className="text-xs max-w-sm mx-auto">
              Conforme doações forem cadastradas e confirmadas, as trilhas de auditoria aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-emerald-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A241F]/60 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-emerald-950">
                <tr>
                  <th className="py-3 px-4">Código Rastreio</th>
                  <th className="py-3 px-4">Alimento</th>
                  <th className="py-3 px-4">Doador</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Destinação</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/50">
                {itens.map((item) => {
                  const empresa =
                    item.empresas?.nome_fantasia ||
                    item.empresas?.razao_social ||
                    "Empresa Doadora"
                  return (
                    <tr key={item.id} className="hover:bg-[#0A241F]/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{item.codigo_rastreio}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{item.tipo_alimento}</td>
                      <td className="py-3.5 px-4 text-slate-300">{empresa}</td>
                      <td className="py-3.5 px-4 text-slate-400 capitalize">{item.categoria}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{item.quantidade_kg} kg</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          {item.destino}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                          item.status === "entregue"
                            ? "bg-blue-950 text-blue-300 border border-blue-800/40"
                            : item.status === "disponivel"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                            : "bg-amber-950 text-amber-300 border border-amber-800/40"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {new Date(item.data_criacao).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
