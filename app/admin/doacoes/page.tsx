"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { broadcastMetricsUpdate } from "@/lib/donation-metrics"
import { logAdminAudit } from "@/lib/admin-audit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Package, 
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  Scale, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  Download,
  Edit,
  Trash2,
  ShieldCheck,
  Zap,
  FileText,
  ExternalLink
} from "lucide-react"

interface DoacaoAdminItem {
  id: number
  codigo_rastreio: string
  tipo_alimento: string
  categoria: string
  quantidade_kg: number
  data_validade: string
  condicao_armazenamento: string
  destino: string
  descricao: string | null
  microcoleta: boolean
  status: string
  termo_aceite: boolean
  data_criacao: string
  empresa_id: number
  empresas?: {
    nome_fantasia: string | null
    razao_social: string
    cidade: string
    estado: string
  } | null
}

const statusOptions = [
  { value: "todos", label: "Todos os Status" },
  { value: "disponivel", label: "Disponível" },
  { value: "reservado", label: "Reservado" },
  { value: "em_transporte", label: "Em Transporte" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
  { value: "vencido", label: "Vencido" },
]

const categoriaOptions = [
  { value: "todas", label: "Todas as Categorias" },
  { value: "fruta", label: "Frutas" },
  { value: "hortalica", label: "Hortaliças e Legumes" },
  { value: "graos_cereais", label: "Grãos e Cereais" },
  { value: "proteina", label: "Proteínas" },
  { value: "laticinio", label: "Laticínios" },
  { value: "ultraprocessado", label: "Ultraprocessados" },
  { value: "outro", label: "Outros" },
]

export default function AdminDoacoesPage() {
  const [doacoes, setDoacoes] = useState<DoacaoAdminItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")

  const [doacaoSelecionada, setDoacaoSelecionada] = useState<DoacaoAdminItem | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [modalStatusAberto, setModalStatusAberto] = useState(false)
  const [novoStatus, setNovoStatus] = useState<string>("")
  const [salvandoStatus, setSalvandoStatus] = useState(false)

  // Modal de Exclusão com Auditoria
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [doacaoParaExcluir, setDoacaoParaExcluir] = useState<DoacaoAdminItem | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarDoacoes = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("doacoes")
        .select(`
          *,
          empresas (
            nome_fantasia,
            razao_social,
            cidade,
            estado
          )
        `)
        .order("id", { ascending: false })

      if (error) throw error
      setDoacoes((data as unknown as DoacaoAdminItem[]) || [])
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDoacoes()
  }, [])

  const doacoesFiltradas = useMemo(() => {
    return doacoes.filter((d) => {
      const termo = busca.toLowerCase()
      const empresaNome = d.empresas?.nome_fantasia || d.empresas?.razao_social || ""
      const matchesBusca =
        d.tipo_alimento.toLowerCase().includes(termo) ||
        (d.codigo_rastreio && d.codigo_rastreio.toLowerCase().includes(termo)) ||
        empresaNome.toLowerCase().includes(termo)

      const matchesStatus = filtroStatus === "todos" || d.status === filtroStatus
      const matchesCategoria = filtroCategoria === "todas" || d.categoria === filtroCategoria

      return matchesBusca && matchesStatus && matchesCategoria
    })
  }, [doacoes, busca, filtroStatus, filtroCategoria])

  const abrirDetalhes = (d: DoacaoAdminItem) => {
    setDoacaoSelecionada(d)
    setModalDetalhesAberto(true)
  }

  const abrirAlterarStatus = (d: DoacaoAdminItem) => {
    setDoacaoSelecionada(d)
    setNovoStatus(d.status)
    setModalStatusAberto(true)
  }

  const abrirModalExcluir = (d: DoacaoAdminItem) => {
    setDoacaoParaExcluir(d)
    setModalExcluirAberto(true)
  }

  // Alterar Status com Log de Auditoria e Sincronização em Tempo Real
  const salvarStatus = async () => {
    if (!doacaoSelecionada) return
    setSalvandoStatus(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("doacoes")
        .update({ status: novoStatus })
        .eq("id", doacaoSelecionada.id)

      if (error) throw error

      // Registra Log de Auditoria
      await logAdminAudit({
        acao: "ALTERAR_STATUS_DOACAO",
        entidade: "doacoes",
        entidade_id: doacaoSelecionada.id,
        detalhes: {
          codigo_rastreio: doacaoSelecionada.codigo_rastreio,
          alimento: doacaoSelecionada.tipo_alimento,
          status_anterior: doacaoSelecionada.status,
          status_novo: novoStatus,
          quantidade_kg: doacaoSelecionada.quantidade_kg
        }
      })

      // Transmissão via Realtime WebSocket para todos os Dashboards
      await broadcastMetricsUpdate(`Status da doação ${doacaoSelecionada.codigo_rastreio} alterado para ${novoStatus.toUpperCase()}`)

      setAviso({
        tipo: "sucesso",
        texto: `Status da doação ${doacaoSelecionada.codigo_rastreio} atualizado para "${novoStatus.toUpperCase()}". Log de auditoria registrado.`
      })
      setModalStatusAberto(false)
      await carregarDoacoes()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: `Erro ao alterar status: ${err.message}` })
    } finally {
      setSalvandoStatus(false)
    }
  }

  // Excluir Lote com Confirmação, Log de Auditoria e Sincronização em Tempo Real
  const confirmarExclusao = async () => {
    if (!doacaoParaExcluir) return
    setExcluindo(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("doacoes")
        .delete()
        .eq("id", doacaoParaExcluir.id)

      if (error) throw error

      // Registra Log de Auditoria Rigoroso
      await logAdminAudit({
        acao: "EXCLUIR_DOACAO",
        entidade: "doacoes",
        entidade_id: doacaoParaExcluir.id,
        detalhes: {
          id: doacaoParaExcluir.id,
          codigo_rastreio: doacaoParaExcluir.codigo_rastreio,
          tipo_alimento: doacaoParaExcluir.tipo_alimento,
          quantidade_kg: doacaoParaExcluir.quantidade_kg,
          categoria: doacaoParaExcluir.categoria,
          destino: doacaoParaExcluir.destino,
          status_no_momento_exclusao: doacaoParaExcluir.status,
          empresa_id: doacaoParaExcluir.empresa_id,
          motivo: "Exclusão administrativa via Painel de Lotes"
        }
      })

      // Transmissão via Realtime WebSocket para abater o volume do Dashboard imediatamente
      await broadcastMetricsUpdate(`Lote #${doacaoParaExcluir.id} (${doacaoParaExcluir.codigo_rastreio}) removido pelo Admin`)

      setAviso({
        tipo: "sucesso",
        texto: `Lote ${doacaoParaExcluir.codigo_rastreio} (${doacaoParaExcluir.tipo_alimento}) excluído com sucesso! Log de auditoria gerado e Dashboard sincronizado.`
      })
      setModalExcluirAberto(false)
      setDoacaoParaExcluir(null)
      await carregarDoacoes()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: `Erro ao excluir lote: ${err.message}` })
    } finally {
      setExcluindo(false)
    }
  }

  const exportarCSV = () => {
    if (doacoesFiltradas.length === 0) return
    const header = "Codigo Rastreio,Alimento,Empresa,Categoria,Quantidade (kg),Validade,Armazenamento,Destino,Status,Data\n"
    const rows = doacoesFiltradas.map(d => {
      const emp = d.empresas?.nome_fantasia || d.empresas?.razao_social || "Empresa"
      return `"${d.codigo_rastreio}","${d.tipo_alimento}","${emp}","${d.categoria}",${d.quantidade_kg},"${d.data_validade}","${d.condicao_armazenamento}","${d.destino}","${d.status}","${d.data_criacao.slice(0, 10)}"`
    }).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-lotes-doacoes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              Auditoria de Excedentes
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              <Zap className="h-3 w-3" />
              Sincronização Realtime Ativa
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Lotes de Doações</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Rastreabilidade integral de todos os excedentes disponibilizados pelas empresas doadoras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportarCSV} disabled={doacoesFiltradas.length === 0}>
            <Download className="h-4 w-4 mr-1.5" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Aviso de feedback */}
      {aviso && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-200 ${
          aviso.tipo === "sucesso" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          <div className="flex items-center gap-2">
            {aviso.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{aviso.texto}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setAviso(null)}>Fechar</Button>
        </div>
      )}

      {/* Filtros e Busca */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por alimento, código ou empresa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriaOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Lotes */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-foreground">Lotes Cadastrados</CardTitle>
              <CardDescription>
                Exibindo {doacoesFiltradas.length} de {doacoes.length} lotes registrados no ecossistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-muted-foreground font-mono text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping mr-2" />
              Carregando lotes do Supabase...
            </div>
          ) : doacoesFiltradas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Nenhum lote de doação encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Código Rastreio</th>
                    <th className="pb-3">Alimento</th>
                    <th className="pb-3">Empresa Doadora</th>
                    <th className="pb-3">Categoria</th>
                    <th className="pb-3 text-right">Volume</th>
                    <th className="pb-3">Validade</th>
                    <th className="pb-3">Destinação</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-center">Ações (Auditadas)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {doacoesFiltradas.map((d) => {
                    const empresaNome = d.empresas?.nome_fantasia || d.empresas?.razao_social || "Empresa"
                    return (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-semibold text-primary">{d.codigo_rastreio}</td>
                        <td className="py-3 font-semibold text-foreground">{d.tipo_alimento}</td>
                        <td className="py-3 text-muted-foreground">{empresaNome}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {d.categoria ? d.categoria.replace("_", " ") : "Outro"}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-semibold text-foreground">{d.quantidade_kg} kg</td>
                        <td className="py-3 text-muted-foreground">{new Date(d.data_validade).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3 capitalize text-muted-foreground">{d.destino}</td>
                        <td className="py-3">
                          <Badge variant="outline" className={`capitalize text-xs ${
                            d.status === 'disponivel' ? 'border-emerald-500 text-emerald-600 bg-emerald-500/10' :
                            d.status === 'reservado' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                            d.status === 'entregue' ? 'border-indigo-500 text-indigo-500 bg-indigo-500/10' :
                            'border-muted text-muted-foreground'
                          }`}>
                            {d.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button size="sm" variant="ghost" onClick={() => abrirDetalhes(d)} title="Ver Detalhes">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => abrirAlterarStatus(d)} title="Alterar Status">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => abrirModalExcluir(d)} 
                              title="Excluir Lote e Gerar Log"
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Modal de Detalhes da Doação */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Lote de Alimento: {doacaoSelecionada?.tipo_alimento}</DialogTitle>
            <DialogDescription>Código de Rastreabilidade: {doacaoSelecionada?.codigo_rastreio}</DialogDescription>
          </DialogHeader>

          {doacaoSelecionada && (
            <div className="space-y-3 text-sm p-2">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Empresa Doadora:</span>
                  <p className="font-semibold">{doacaoSelecionada.empresas?.nome_fantasia || doacaoSelecionada.empresas?.razao_social}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Localização de Origem:</span>
                  <p className="font-semibold">{doacaoSelecionada.empresas?.cidade}/{doacaoSelecionada.empresas?.estado}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Quantidade Registrada:</span>
                  <p className="font-semibold">{doacaoSelecionada.quantidade_kg} kg</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Condição de Armazenamento:</span>
                  <p className="font-semibold capitalize">{doacaoSelecionada.condicao_armazenamento}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Data de Validade:</span>
                  <p className="font-semibold">{new Date(doacaoSelecionada.data_validade).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Destinação PNCPDA:</span>
                  <p className="font-semibold capitalize">{doacaoSelecionada.destino}</p>
                </div>
              </div>

              {doacaoSelecionada.descricao && (
                <div>
                  <span className="text-xs text-muted-foreground">Observações / Marca / Lote:</span>
                  <p className="bg-background border p-2 rounded text-xs">{doacaoSelecionada.descricao}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Microcoleta: <strong className="text-foreground">{doacaoSelecionada.microcoleta ? "Sim" : "Não"}</strong></span>
                <span>Termo de Responsabilidade: <strong className="text-foreground">{doacaoSelecionada.termo_aceite ? "Assinado Digitalmente" : "Pendente"}</strong></span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-emerald-500 border-emerald-500/40 hover:bg-emerald-500/10">
              <a href={`/comprovante/${doacaoSelecionada?.codigo_rastreio}`} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5" />
                <span>Abrir Termo Sanitário (PDF)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" onClick={() => setModalDetalhesAberto(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Alterar Status Administrativo */}
      <Dialog open={modalStatusAberto} onOpenChange={setModalStatusAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Lote</DialogTitle>
            <DialogDescription>
              Ajuste de status operacional para {doacaoSelecionada?.codigo_rastreio} ({doacaoSelecionada?.tipo_alimento}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Novo Status do Lote
              </label>
              <Select value={novoStatus} onValueChange={setNovoStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível para Solicitação</SelectItem>
                  <SelectItem value="reservado">Reservado para Instituição</SelectItem>
                  <SelectItem value="em_transporte">Em Transporte / Logística</SelectItem>
                  <SelectItem value="entregue">Entregue e Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="vencido">Vencido / Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              Esta ação será auditada e gravada no histórico de segurança da plataforma.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalStatusAberto(false)} disabled={salvandoStatus}>Cancelar</Button>
            <Button onClick={salvarStatus} disabled={salvandoStatus}>
              {salvandoStatus ? "Salvando..." : "Salvar Alteração"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão com Confirmação e Aviso Legal */}
      <Dialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Excluir Lote de Doação
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este lote permanentemente do banco de dados?
            </DialogDescription>
          </DialogHeader>

          {doacaoParaExcluir && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Código de Rastreio:</span>
                <span className="font-mono text-primary font-bold">{doacaoParaExcluir.codigo_rastreio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alimento:</span>
                <span className="font-bold text-foreground">{doacaoParaExcluir.tipo_alimento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume Abatido:</span>
                <span className="font-mono font-bold text-foreground">{doacaoParaExcluir.quantidade_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status Atual:</span>
                <span className="capitalize text-foreground font-semibold">{doacaoParaExcluir.status}</span>
              </div>

              <div className="pt-2 border-t border-destructive/20 text-[11px] text-muted-foreground flex items-start gap-1.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <span>Esta operação registrará um log de auditoria irreversível nos registros de conformidade e recalculará o Dashboard em tempo real.</span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={excluindo}
              onClick={() => {
                setModalExcluirAberto(false)
                setDoacaoParaExcluir(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={excluindo}
              onClick={confirmarExclusao}
              className="font-bold"
            >
              {excluindo ? "Excluindo..." : "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
