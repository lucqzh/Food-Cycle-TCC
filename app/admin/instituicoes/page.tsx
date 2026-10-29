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
  Heart, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Eye, 
  FileCheck, 
  Download,
  AlertCircle,
  CheckCircle2,
  Package
} from "lucide-react"

interface InstituicaoItem {
  id: number
  cnpj: string | null
  razao_social: string
  tipo_instituicao: string
  capacidade_atend: number | null
  pessoas_atendidas: number | null
  responsavel_tecnico: string | null
  alvara_sanitario: string | null
  validade_alvara: string | null
  cidade: string
  estado: string
  endereco: string
  total_pedidos?: number
}

interface SolicitacaoResumida {
  id: number
  status: string
  data_solicitacao: string
  mensagem: string | null
  doacoes?: {
    tipo_alimento: string
    quantidade_kg: number
    codigo_rastreio: string
  } | null
}

const tipoLabels: Record<string, string> = {
  ong: "ONG",
  religiosa: "Religiosa",
  abrigo: "Abrigo",
  comunitaria: "Comunitária",
  publica: "Pública",
  outra: "Outra"
}

export default function AdminInstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState<InstituicaoItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<InstituicaoItem | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResumida[]>([])
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(false)

  const carregarInstituicoes = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const [instRes, solRes] = await Promise.all([
        supabase.from("instituicoes").select("*").order("id", { ascending: false }),
        supabase.from("solicitacoes").select("id, instituicao_id")
      ])

      if (instRes.data) {
        const solList = solRes.data || []
        const enriquecidas: InstituicaoItem[] = instRes.data.map(inst => ({
          ...inst,
          total_pedidos: solList.filter(s => s.instituicao_id === inst.id).length
        }))
        setInstituicoes(enriquecidas)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarInstituicoes()
  }, [])

  const instituicoesFiltradas = useMemo(() => {
    return instituicoes.filter((inst) => {
      const termo = busca.toLowerCase()
      const matchesBusca =
        inst.razao_social.toLowerCase().includes(termo) ||
        (inst.cnpj && inst.cnpj.includes(termo)) ||
        (inst.responsavel_tecnico && inst.responsavel_tecnico.toLowerCase().includes(termo))

      const matchesTipo = filtroTipo === "todos" || inst.tipo_instituicao === filtroTipo
      const matchesEstado = filtroEstado === "todos" || inst.estado.toUpperCase() === filtroEstado.toUpperCase()

      return matchesBusca && matchesTipo && matchesEstado
    })
  }, [instituicoes, busca, filtroTipo, filtroEstado])

  const estadosDisponiveis = useMemo(() => {
    const setUfs = new Set(instituicoes.map(i => i.estado).filter(Boolean))
    return Array.from(setUfs).sort()
  }, [instituicoes])

  const abrirDetalhes = async (inst: InstituicaoItem) => {
    setInstituicaoSelecionada(inst)
    setModalDetalhesAberto(true)
    setCarregandoSolicitacoes(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("solicitacoes")
        .select(`
          id,
          status,
          data_solicitacao,
          mensagem,
          doacoes (
            tipo_alimento,
            quantidade_kg,
            codigo_rastreio
          )
        `)
        .eq("instituicao_id", inst.id)
        .order("id", { ascending: false })
      setSolicitacoes((data as unknown as SolicitacaoResumida[]) || [])
    } catch (err) {
      console.error(err)
    } finally {
      setCarregandoSolicitacoes(false)
    }
  }

  const exportarCSV = () => {
    if (instituicoesFiltradas.length === 0) return
    const header = "ID,CNPJ,Razao Social,Tipo,Capacidade,Pessoas Atendidas,Cidade,Estado,Alvara Sanitario\n"
    const rows = instituicoesFiltradas.map(i => 
      `${i.id},"${i.cnpj || ''}","${i.razao_social}","${i.tipo_instituicao}",${i.capacidade_atend || 0},${i.pessoas_atendidas || 0},"${i.cidade}","${i.estado}","${i.alvara_sanitario || 'Nao informado'}"`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-instituicoes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Instituições Receptoras</h1>
          <p className="text-muted-foreground">
            Entidades cadastradas para redistribuição de alimentos e atendimento a beneficiários.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={instituicoesFiltradas.length === 0}>
          <Download className="h-4 w-4" />
          Exportar Lista (CSV)
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por Razão Social, CNPJ ou Responsável..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Tipo de Entidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="ong">ONG</SelectItem>
                <SelectItem value="religiosa">Religiosa</SelectItem>
                <SelectItem value="abrigo">Abrigo</SelectItem>
                <SelectItem value="comunitaria">Comunitária</SelectItem>
                <SelectItem value="publica">Pública</SelectItem>
                <SelectItem value="outra">Outra</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full md:w-36">
                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Estado (UF)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estados</SelectItem>
                {estadosDisponiveis.map(uf => (
                  <SelectItem key={uf} value={uf}>{uf.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Instituições */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Instituições Cadastradas ({instituicoesFiltradas.length})</CardTitle>
            <button onClick={carregarInstituicoes} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando instituições...</div>
          ) : instituicoesFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhuma instituição encontrada com os filtros informados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Razão Social</th>
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Localização</th>
                    <th className="pb-3 text-right">Beneficiários</th>
                    <th className="pb-3">Alvará Sanitário</th>
                    <th className="pb-3 text-right">Pedidos</th>
                    <th className="pb-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {instituicoesFiltradas.map((inst) => (
                    <tr key={inst.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-foreground">
                        {inst.razao_social}
                        {inst.cnpj && <div className="font-mono text-xs text-muted-foreground">{inst.cnpj}</div>}
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {tipoLabels[inst.tipo_instituicao] || inst.tipo_instituicao}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{inst.cidade}/{inst.estado}</td>
                      <td className="py-3 text-right font-medium text-foreground">
                        {(inst.pessoas_atendidas || inst.capacidade_atend || 0).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3">
                        {inst.alvara_sanitario ? (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <FileCheck className="h-3.5 w-3.5" /> Informado
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pendente</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-medium text-primary">{inst.total_pedidos}</td>
                      <td className="py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => abrirDetalhes(inst)} title="Ver Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes da Instituição */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{instituicaoSelecionada?.razao_social}</DialogTitle>
            <DialogDescription>
              {tipoLabels[instituicaoSelecionada?.tipo_instituicao || ""] || "Instituição"} • {instituicaoSelecionada?.cidade}/{instituicaoSelecionada?.estado}
            </DialogDescription>
          </DialogHeader>

          {instituicaoSelecionada && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">CNPJ:</span>
                  <p className="font-semibold">{instituicaoSelecionada.cnpj || "Não cadastrado"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Responsável Técnico:</span>
                  <p className="font-semibold">{instituicaoSelecionada.responsavel_tecnico || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Pessoas Atendidas / Capacidade:</span>
                  <p className="font-semibold">{instituicaoSelecionada.pessoas_atendidas || 0} / {instituicaoSelecionada.capacidade_atend || 0}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Alvará Sanitário:</span>
                  <p className="font-semibold">{instituicaoSelecionada.alvara_sanitario || "Não registrado"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground">Endereço Completo:</span>
                  <p className="font-semibold">{instituicaoSelecionada.endereco}, {instituicaoSelecionada.cidade}/{instituicaoSelecionada.estado}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Solicitações de Alimentos Realizadas ({solicitacoes.length})
                </h4>
                {carregandoSolicitacoes ? (
                  <p className="text-xs text-muted-foreground">Carregando pedidos...</p>
                ) : solicitacoes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma solicitação realizada por esta instituição.</p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="p-2">Alimento</th>
                          <th className="p-2">Quantidade</th>
                          <th className="p-2">Rastreio</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {solicitacoes.map(s => (
                          <tr key={s.id}>
                            <td className="p-2 font-medium">{s.doacoes?.tipo_alimento || "Alimento"}</td>
                            <td className="p-2">{s.doacoes?.quantidade_kg ? `${s.doacoes.quantidade_kg} kg` : "-"}</td>
                            <td className="p-2 font-mono text-primary">{s.doacoes?.codigo_rastreio || "-"}</td>
                            <td className="p-2 capitalize">{s.status}</td>
                            <td className="p-2 text-muted-foreground">{new Date(s.data_solicitacao).toLocaleDateString("pt-BR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalDetalhesAberto(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
