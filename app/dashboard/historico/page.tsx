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
  FileSpreadsheet,
  FileText,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TermoDoacaoModal, ComprovanteData } from "@/components/comprovante/termo-doacao-modal"

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

  // Modal do Termo Sanitário
  const [modalTermoAberto, setModalTermoAberto] = useState(false)
  const [comprovanteSelecionado, setComprovanteSelecionado] = useState<ComprovanteData | null>(null)

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

  const abrirTermo = (item: HistoricoItem) => {
    setComprovanteSelecionado({
      id: item.id,
      codigo_rastreio: item.codigo_rastreio,
      tipo_alimento: item.tipo_alimento,
      quantidade_kg: item.quantidade_kg,
      categoria: item.categoria,
      destino: item.destino,
      status: item.status,
      data_criacao: item.data_criacao,
      empresa_nome: item.empresas?.nome_fantasia || item.empresas?.razao_social || "Empresa Doadora",
    })
    setModalTermoAberto(true)
  }

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 text-xs font-medium text-emerald-300">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            Rastreabilidade Digital Conforme Lei nº 15.224/2025
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Histórico de Entregas & Termos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registro imutável de excedentes doados, comprovantes sanitários para fins fiscais e relatórios ESG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarHistorico}
            disabled={carregando}
            className="h-10 border-emerald-900/60 bg-[#071B17] text-slate-300 hover:text-white hover:bg-emerald-950/40 text-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${carregando ? "animate-spin" : ""}`} />
            Atualizar
          </Button>

          <Button
            onClick={exportarCSV}
            disabled={itens.length === 0}
            className="h-10 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/60 cursor-pointer"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas do Histórico */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Volume Total Salvo</span>
            <Package className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalKg.toLocaleString("pt-BR")} kg</p>
          <p className="text-[10px] text-slate-400">Total histórico registrado</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Lotes Intermediados</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{itens.length}</p>
          <p className="text-[10px] text-slate-400">Operações na plataforma</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Empresas Envolvidas</span>
            <Building2 className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{empresasUnicas}</p>
          <p className="text-[10px] text-slate-400">Doadoras ativas</p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Diversidade Alimentar</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{categoriasUnicas} tipos</p>
          <p className="text-[10px] text-slate-400">Categorias nutricionais</p>
        </div>
      </div>

      {/* Tabela do Histórico */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Lotes e Trilha Sanitária
            </h3>
            <p className="text-xs text-slate-400">
              Clique em &quot;Termo (PDF)&quot; para visualizar ou emitir o Comprovante Sanitário oficial para cada lote.
            </p>
          </div>
        </div>

        {carregando ? (
          <div className="py-16 text-center text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-2" />
            Carregando histórico do banco de dados...
          </div>
        ) : itens.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Nenhum lote registrado no histórico.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando doações forem cadastradas ou entregues, os registros aparecerão aqui com comprovante sanitário para download.
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
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4">Destinação</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-center">Comprovante Legal</th>
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
                      <td className="py-3.5 px-4 text-slate-400 capitalize">{item.categoria ? item.categoria.replace("_", " ") : "Alimento"}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-right">{Number(item.quantidade_kg).toLocaleString("pt-BR")} kg</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40 capitalize">
                          {item.destino || "humano"}
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
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => abrirTermo(item)}
                          className="h-7 text-[11px] border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:text-white hover:bg-emerald-900/60 cursor-pointer flex items-center gap-1.5 mx-auto shadow-sm"
                        >
                          <FileText className="h-3 w-3 text-emerald-400" />
                          <span>Termo (PDF)</span>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal do Termo Sanitário Imprimível */}
      <TermoDoacaoModal
        open={modalTermoAberto}
        onOpenChange={setModalTermoAberto}
        data={comprovanteSelecionado}
      />
    </div>
  )
}
