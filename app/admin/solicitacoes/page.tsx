"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Building2, 
  Heart, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

interface SolicitacaoAdminItem {
  id: number
  instituicao_id: number
  doacao_id: number
  status: "pendente" | "aprovado" | "recusado" | "cancelado"
  motivo_recusa: string | null
  mensagem: string | null
  data_solicitacao: string
  data_resposta: string | null
  doacoes?: {
    id: number
    tipo_alimento: string
    quantidade_kg: number
    codigo_rastreio: string
    categoria: string
    empresa_id: number
    empresas?: {
      nome_fantasia: string | null
      razao_social: string
    } | null
  } | null
  instituicoes?: {
    id: number
    razao_social: string
    cidade: string
    estado: string
  } | null
}

export default function AdminSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdminItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [processandoId, setProcessandoId] = useState<number | null>(null)
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarSolicitacoes = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("solicitacoes")
        .select(`
          *,
          doacoes (
            id,
            tipo_alimento,
            quantidade_kg,
            codigo_rastreio,
            categoria,
            empresa_id,
            empresas (
              nome_fantasia,
              razao_social
            )
          ),
          instituicoes (
            id,
            razao_social,
            cidade,
            estado
          )
        `)
        .order("id", { ascending: false })

      if (error) throw error
      setSolicitacoes((data as unknown as SolicitacaoAdminItem[]) || [])
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarSolicitacoes()
  }, [])

  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoes.filter((s) => {
      const termo = busca.toLowerCase()
      const alimento = s.doacoes?.tipo_alimento || ""
      const rastreio = s.doacoes?.codigo_rastreio || ""
      const inst = s.instituicoes?.razao_social || ""
      const emp = s.doacoes?.empresas?.nome_fantasia || s.doacoes?.empresas?.razao_social || ""

      const matchesBusca =
        alimento.toLowerCase().includes(termo) ||
        rastreio.toLowerCase().includes(termo) ||
        inst.toLowerCase().includes(termo) ||
        emp.toLowerCase().includes(termo)

      const matchesStatus = filtroStatus === "todos" || s.status === filtroStatus

      return matchesBusca && matchesStatus
    })
  }, [solicitacoes, busca, filtroStatus])

  const alterarStatus = async (solId: number, doacaoId: number, novoStatus: "aprovado" | "recusado" | "cancelado") => {
    setProcessandoId(solId)
    setAviso(null)

    try {
      const supabase = createClient()
      const { error: errSol } = await supabase
        .from("solicitacoes")
        .update({
          status: novoStatus,
          data_resposta: new Date().toISOString()
        })
        .eq("id", solId)

      if (errSol) throw errSol

      if (novoStatus === "aprovado") {
        await supabase.from("doacoes").update({ status: "reservado" }).eq("id", doacaoId)
      }

      // Registra auditoria
      const { data: auth } = await supabase.auth.getUser()
      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "MODERACAO_SOLICITACAO",
        entidade: "solicitacoes",
        entidade_id: String(solId),
        detalhes: {
          doacao_id: doacaoId,
          novo_status: novoStatus
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Solicitação #${solId} atualizada para "${novoStatus.toUpperCase()}".`
      })
      await carregarSolicitacoes()
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: e.message || "Erro ao atualizar solicitação." })
    } finally {
      setProcessandoId(null)
    }
  }

  const exportarCSV = () => {
    if (solicitacoesFiltradas.length === 0) return
    const header = "ID,Data Solicitacao,Alimento,Quantidade (kg),Instituicao Receptora,Empresa Doadora,Status,Mensagem\n"
    const rows = solicitacoesFiltradas.map(s => {
      const alimento = s.doacoes?.tipo_alimento || "Alimento"
      const kg = s.doacoes?.quantidade_kg || 0
      const inst = s.instituicoes?.razao_social || "Instituição"
      const emp = s.doacoes?.empresas?.nome_fantasia || s.doacoes?.empresas?.razao_social || "Empresa"
      const data = new Date(s.data_solicitacao).toLocaleDateString("pt-BR")
      return `${s.id},"${data}","${alimento}",${kg},"${inst}","${emp}","${s.status}","${s.mensagem || ''}"`
    }).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-solicitacoes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Solicitações de Doações</h1>
          <p className="text-muted-foreground">
            Mediação e acompanhamento das requisições de alimentos pelas entidades receptoras.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={solicitacoesFiltradas.length === 0}>
          <Download className="h-4 w-4" />
          Exportar Lista (CSV)
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Alimento, Rastreio, Instituição ou Empresa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Solicitações */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Todas as Solicitações ({solicitacoesFiltradas.length})</CardTitle>
            <button onClick={carregarSolicitacoes} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando solicitações...</div>
          ) : solicitacoesFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhuma solicitação encontrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Alimento Solicitado</th>
                    <th className="pb-3">Instituição Receptora</th>
                    <th className="pb-3">Empresa Doadora</th>
                    <th className="pb-3">Data</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Justificativa</th>
                    <th className="pb-3 text-center">Moderação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {solicitacoesFiltradas.map((s) => {
                    const alimento = s.doacoes?.tipo_alimento || "Alimento"
                    const rastreio = s.doacoes?.codigo_rastreio || ""
                    const kg = s.doacoes?.quantidade_kg ? `${s.doacoes.quantidade_kg} kg` : ""
                    const inst = s.instituicoes?.razao_social || "Instituição"
                    const emp = s.doacoes?.empresas?.nome_fantasia || s.doacoes?.empresas?.razao_social || "Empresa"

                    return (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3">
                          <div className="font-semibold text-foreground">{alimento}</div>
                          <div className="text-xs font-mono text-primary">{rastreio} {kg && `• ${kg}`}</div>
                        </td>
                        <td className="py-3 text-foreground font-medium">{inst}</td>
                        <td className="py-3 text-muted-foreground">{emp}</td>
                        <td className="py-3 text-muted-foreground">{new Date(s.data_solicitacao).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3">
                          <Badge variant="outline" className={`capitalize text-xs ${
                            s.status === 'aprovado' ? 'border-emerald-500 text-emerald-600 bg-emerald-500/10' :
                            s.status === 'pendente' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                            s.status === 'recusado' ? 'border-destructive text-destructive bg-destructive/10' :
                            'border-muted text-muted-foreground'
                          }`}>
                            {s.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground max-w-xs truncate" title={s.mensagem || ''}>
                          {s.mensagem || "Sem mensagem"}
                        </td>
                        <td className="py-3 text-center">
                          {s.status === "pendente" ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                disabled={processandoId === s.id}
                                onClick={() => alterarStatus(s.id, s.doacao_id, "aprovado")}
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                                disabled={processandoId === s.id}
                                onClick={() => alterarStatus(s.id, s.doacao_id, "recusado")}
                              >
                                Recusar
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
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
