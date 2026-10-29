"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
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
  DialogTitle,
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
  Edit
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

      // Registra auditoria
      const { data: auth } = await supabase.auth.getUser()
      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "ALTERAR_STATUS_DOACAO",
        entidade: "doacoes",
        entidade_id: String(doacaoSelecionada.id),
        detalhes: {
          codigo_rastreio: doacaoSelecionada.codigo_rastreio,
          alimento: doacaoSelecionada.tipo_alimento,
          status_anterior: doacaoSelecionada.status,
          status_novo: novoStatus
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Status da doação ${doacaoSelecionada.codigo_rastreio} atualizado para "${novoStatus.toUpperCase()}".`
      })
      setModalStatusAberto(false)
      await carregarDoacoes()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: `Erro ao alterar status: ${err.message}` })
    } finally {
      setSalvandoStatus(false)
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
    a.download = `foodcycle-doacoes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Lotes de Doações</h1>
          <p className="text-muted-foreground">
            Auditoria sanitária, controle de validade e histórico de destinação (Lei nº 15.224/2025).
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={doacoesFiltradas.length === 0}>
          <Download className="h-4 w-4" />
          Exportar Relatório (CSV)
        </Button>
      </div>

      {aviso && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
          aviso.tipo === "sucesso" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"
        }`}>
          {aviso.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{aviso.texto}</span>
        </div>
      )}

      {/* Filtros */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Alimento, Código de Rastreio ou Empresa Doadora..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full md:w-48">
                <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriaOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Doações */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Lotes Mapeados ({doacoesFiltradas.length})</CardTitle>
            <button onClick={carregarDoacoes} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando doações do banco...</div>
          ) : doacoesFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhuma doação cadastrada com os filtros selecionados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
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
                    <th className="pb-3 text-center">Ações</th>
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
                            {d.categoria.replace("_", " ")}
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

          <DialogFooter>
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
            <p className="text-xs text-muted-foreground">
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
    </div>
  )
}
