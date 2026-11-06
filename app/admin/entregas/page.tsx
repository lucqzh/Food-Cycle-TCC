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
  Truck, 
  Search, 
  Filter, 
  Thermometer, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Edit
} from "lucide-react"

interface EntregaItem {
  id: number
  doacao_id: number
  intermediario_id: number | null
  solicitacao_id: number | null
  data_envio: string | null
  data_entrega: string | null
  data_prevista: string | null
  status: "agendada" | "em_transporte" | "entregue" | "falha" | "cancelada"
  temperatura_envio: number | null
  temperatura_entrega: number | null
  observacoes: string | null
  data_criacao: string
  doacoes?: {
    tipo_alimento: string
    quantidade_kg: number
    codigo_rastreio: string
    condicao_armazenamento: string
    empresas?: {
      nome_fantasia: string | null
      razao_social: string
    } | null
  } | null
  intermediarios?: {
    razao_social: string
    tipo_intermediario: string
  } | null
}

export default function AdminEntregasPage() {
  const [entregas, setEntregas] = useState<EntregaItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")

  const [entregaSelecionada, setEntregaSelecionada] = useState<EntregaItem | null>(null)
  const [modalStatusAberto, setModalStatusAberto] = useState(false)
  const [novoStatus, setNovoStatus] = useState<string>("")
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarEntregas = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("entregas")
        .select(`
          *,
          doacoes (
            tipo_alimento,
            quantidade_kg,
            codigo_rastreio,
            condicao_armazenamento,
            empresas (
              nome_fantasia,
              razao_social
            )
          ),
          intermediarios (
            razao_social,
            tipo_intermediario
          )
        `)
        .order("id", { ascending: false })

      if (error) {
        // Se a tabela ainda não tiver dados ou consultas vazias
        console.warn("Entregas:", error)
      } else if (data) {
        setEntregas((data as unknown as EntregaItem[]) || [])
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarEntregas()
  }, [])

  const entregasFiltradas = useMemo(() => {
    return entregas.filter((e) => {
      const termo = busca.toLowerCase()
      const alimento = e.doacoes?.tipo_alimento || ""
      const rastreio = e.doacoes?.codigo_rastreio || ""
      const intermediario = e.intermediarios?.razao_social || ""
      const empresa = e.doacoes?.empresas?.nome_fantasia || e.doacoes?.empresas?.razao_social || ""

      const matchesBusca =
        alimento.toLowerCase().includes(termo) ||
        rastreio.toLowerCase().includes(termo) ||
        intermediario.toLowerCase().includes(termo) ||
        empresa.toLowerCase().includes(termo)

      const matchesStatus = filtroStatus === "todos" || e.status === filtroStatus

      return matchesBusca && matchesStatus
    })
  }, [entregas, busca, filtroStatus])

  const abrirAlterarStatus = (e: EntregaItem) => {
    setEntregaSelecionada(e)
    setNovoStatus(e.status)
    setModalStatusAberto(true)
  }

  const salvarStatus = async () => {
    if (!entregaSelecionada) return
    setSalvandoStatus(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const camposAtualizacao: Record<string, unknown> = { status: novoStatus }
      if (novoStatus === "em_transporte" && !entregaSelecionada.data_envio) {
        camposAtualizacao.data_envio = new Date().toISOString()
      } else if (novoStatus === "entregue") {
        camposAtualizacao.data_entrega = new Date().toISOString()
        // Atualiza a doação correspondente para entregue
        await supabase.from("doacoes").update({ status: "entregue" }).eq("id", entregaSelecionada.doacao_id)
      }

      const { error } = await supabase
        .from("entregas")
        .update(camposAtualizacao)
        .eq("id", entregaSelecionada.id)

      if (error) throw error

      const { data: auth } = await supabase.auth.getUser()
      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "ALTERAR_STATUS_ENTREGA",
        entidade: "entregas",
        entidade_id: String(entregaSelecionada.id),
        detalhes: {
          doacao_id: entregaSelecionada.doacao_id,
          novo_status: novoStatus
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Status da entrega #${entregaSelecionada.id} atualizado para "${novoStatus.toUpperCase()}".`
      })
      setModalStatusAberto(false)
      await carregarEntregas()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: `Falha ao salvar status da entrega: ${err.message}` })
    } finally {
      setSalvandoStatus(false)
    }
  }

  const exportarCSV = () => {
    if (entregasFiltradas.length === 0) return
    const header = "ID,Rastreio,Alimento,Intermediario,Status,Data Prevista,Temp Envio (C),Temp Entrega (C)\n"
    const rows = entregasFiltradas.map(e => 
      `${e.id},"${e.doacoes?.codigo_rastreio || ''}","${e.doacoes?.tipo_alimento || ''}","${e.intermediarios?.razao_social || 'Entrega Direta'}","${e.status}","${e.data_prevista || ''}",${e.temperatura_envio || ''},${e.temperatura_entrega || ''}`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-entregas-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Logística & Entregas</h1>
          <p className="text-muted-foreground">
            Acompanhamento de transporte, cadeia de frio e confirmação de chegada dos alimentos.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={entregasFiltradas.length === 0}>
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
                placeholder="Buscar por Alimento, Rastreio, Intermediário ou Empresa..."
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
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="em_transporte">Em Transporte</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="falha">Falha</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Entregas */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Remessas em Logística ({entregasFiltradas.length})</CardTitle>
            <button onClick={carregarEntregas} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando remessas logísticas...</div>
          ) : entregasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma entrega em trânsito no momento.
              <p className="text-xs mt-1">Quando doações aprovadas forem despachadas, o rastreamento logístico aparecerá aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Rastreio / Lote</th>
                    <th className="pb-3">Alimento</th>
                    <th className="pb-3">Intermediário Logístico</th>
                    <th className="pb-3">Cadeia de Frio</th>
                    <th className="pb-3">Previsão</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entregasFiltradas.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono font-semibold text-primary">
                        {e.doacoes?.codigo_rastreio || `#${e.doacao_id}`}
                      </td>
                      <td className="py-3 font-medium text-foreground">
                        {e.doacoes?.tipo_alimento || "Alimento"}
                        {e.doacoes?.quantidade_kg && <span className="text-xs text-muted-foreground block">{e.doacoes.quantidade_kg} kg</span>}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {e.intermediarios?.razao_social || "Entrega Direta (Empresa -> Instituição)"}
                      </td>
                      <td className="py-3">
                        {e.temperatura_envio ? (
                          <div className="flex items-center gap-1 text-xs text-cyan-600 font-medium">
                            <Thermometer className="h-3.5 w-3.5" />
                            {e.temperatura_envio}°C
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Ambiente</span>
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {e.data_prevista ? new Date(e.data_prevista).toLocaleDateString("pt-BR") : "A combinar"}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className={`capitalize text-xs ${
                          e.status === 'em_transporte' ? 'border-sky-500 text-sky-500 bg-sky-500/10' :
                          e.status === 'entregue' ? 'border-emerald-500 text-emerald-600 bg-emerald-500/10' :
                          e.status === 'agendada' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                          'border-destructive text-destructive bg-destructive/10'
                        }`}>
                          {e.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => abrirAlterarStatus(e)}>
                          <Edit className="h-4 w-4" />
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

      {/* Modal Alterar Status de Entrega */}
      <Dialog open={modalStatusAberto} onOpenChange={setModalStatusAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status da Entrega</DialogTitle>
            <DialogDescription>
              Registro logístico da remessa #{entregaSelecionada?.id} ({entregaSelecionada?.doacoes?.tipo_alimento}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Novo Status Logístico
              </label>
              <Select value={novoStatus} onValueChange={setNovoStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendada">Agendada para Coleta</SelectItem>
                  <SelectItem value="em_transporte">Em Transporte / Trânsito</SelectItem>
                  <SelectItem value="entregue">Entregue no Destino</SelectItem>
                  <SelectItem value="falha">Falha na Entrega</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              A marcação como "Entregue" conclui o ciclo do lote no sistema e atualiza o histórico sanitário.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalStatusAberto(false)} disabled={salvandoStatus}>Cancelar</Button>
            <Button onClick={salvarStatus} disabled={salvandoStatus}>
              {salvandoStatus ? "Salvando..." : "Atualizar Logística"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
