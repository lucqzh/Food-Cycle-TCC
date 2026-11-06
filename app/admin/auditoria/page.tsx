"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  FileText,
  AlertCircle,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Zap
} from "lucide-react"

interface AuditLogItem {
  id: number
  admin_id: string | null
  admin_email: string
  acao: string
  entidade: string
  entidade_id: string | null
  detalhes: Record<string, unknown> | null
  data_criacao: string
}

export function formatDetalhes(detalhes: Record<string, unknown> | null): string {
  if (!detalhes) return "—"
  const keys = Object.keys(detalhes).filter(k => k !== "user_agent" && k !== "timestamp")
  if (keys.length === 0) return JSON.stringify(detalhes)
  return keys.map(k => `${k}: ${detalhes[k]}`).join(" • ")
}

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroEntidade, setFiltroEntidade] = useState("todas")

  const carregarLogs = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select("*")
        .order("id", { ascending: false })
        .limit(100)

      if (error) {
        console.warn("admin_audit_logs:", error)
      } else if (data) {
        setLogs(data as unknown as AuditLogItem[])
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarLogs()
  }, [])

  const logsFiltrados = useMemo(() => {
    return logs.filter((log) => {
      const termo = busca.toLowerCase()
      const acao = log.acao.toLowerCase()
      const email = log.admin_email.toLowerCase()
      const entidade = log.entidade.toLowerCase()
      const detalhesStr = log.detalhes ? JSON.stringify(log.detalhes).toLowerCase() : ""

      const matchesBusca =
        acao.includes(termo) ||
        email.includes(termo) ||
        entidade.includes(termo) ||
        detalhesStr.includes(termo)

      const matchesEntidade = filtroEntidade === "todas" || log.entidade === filtroEntidade

      return matchesBusca && matchesEntidade
    })
  }, [logs, busca, filtroEntidade])

  const exportarCSV = () => {
    if (logsFiltrados.length === 0) return
    const header = "ID,Data/Hora,Admin,Acao,Entidade,Entidade ID,Detalhes\n"
    const rows = logsFiltrados.map(l => {
      const detalhes = l.detalhes ? JSON.stringify(l.detalhes).replace(/"/g, '""') : ""
      return `${l.id},"${l.data_criacao}","${l.admin_email}","${l.acao}","${l.entidade}","${l.entidade_id || ''}","${detalhes}"`
    }).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-auditoria-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Governança & Rastreabilidade PNCPDA (Lei nº 15.224/2025)
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Auditoria do Sistema</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Trilha de auditoria imutável de todas as ações de criação, alteração e exclusão realizadas por administradores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={carregarLogs} disabled={carregando} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${carregando ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={exportarCSV} disabled={logsFiltrados.length === 0}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Ação, E-mail do Admin, Código ou Detalhes..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <Select value={filtroEntidade} onValueChange={setFiltroEntidade}>
              <SelectTrigger className="w-full sm:w-48 text-xs">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Entidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Entidades</SelectItem>
                <SelectItem value="doacoes">Doações</SelectItem>
                <SelectItem value="empresas">Empresas</SelectItem>
                <SelectItem value="instituicoes">Instituições</SelectItem>
                <SelectItem value="solicitacoes">Solicitações</SelectItem>
                <SelectItem value="entregas">Entregas</SelectItem>
                <SelectItem value="profiles">Perfis / Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-foreground">Eventos Registrados ({logsFiltrados.length})</CardTitle>
              <CardDescription className="text-xs">
                Registros criptograficamente auditados no PostgreSQL com carimbo de data/hora
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping mr-2" />
              Carregando trilha de auditoria do banco...
            </div>
          ) : logsFiltrados.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="font-medium text-foreground">Nenhum evento registrado com os filtros aplicados</p>
              <p className="text-xs mt-1">
                Todas as ações (criar, editar, excluir lotes, aprovações de selos) aparecerão automaticamente aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Data / Horário</th>
                    <th className="pb-3">Administrador</th>
                    <th className="pb-3">Ação Realizada</th>
                    <th className="pb-3">Entidade</th>
                    <th className="pb-3">Trilha de Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logsFiltrados.map((log) => {
                    const isDelete = log.acao.includes("EXCLUIR") || log.acao.includes("DELETAR")
                    const isCreate = log.acao.includes("CRIAR") || log.acao.includes("INSERIR")
                    const isUpdate = log.acao.includes("EDITAR") || log.acao.includes("ALTERAR") || log.acao.includes("CONCLUIR")

                    return (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.data_criacao).toLocaleString("pt-BR")}
                        </td>
                        <td className="py-3 font-medium text-foreground text-xs font-mono">
                          {log.admin_email}
                        </td>
                        <td className="py-3">
                          <Badge 
                            variant="outline" 
                            className={`font-mono text-[10px] uppercase font-bold flex items-center gap-1 w-fit ${
                              isDelete
                                ? "border-red-500/50 text-red-400 bg-red-950/20"
                                : isCreate
                                  ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/20"
                                  : isUpdate
                                    ? "border-purple-500/50 text-purple-400 bg-purple-950/20"
                                    : "border-primary/40 text-primary bg-primary/5"
                            }`}
                          >
                            {isDelete && <Trash2 className="h-3 w-3" />}
                            {isCreate && <Plus className="h-3 w-3" />}
                            {isUpdate && <Edit className="h-3 w-3" />}
                            <span>{log.acao}</span>
                          </Badge>
                        </td>
                        <td className="py-3 capitalize text-muted-foreground text-xs font-medium">
                          {log.entidade} {log.entidade_id ? <span className="font-mono text-foreground font-bold">#{log.entidade_id}</span> : ""}
                        </td>
                        <td className="py-3 text-xs text-muted-foreground max-w-md font-mono" title={log.detalhes ? JSON.stringify(log.detalhes, null, 2) : ""}>
                          <span className="truncate block">
                            {formatDetalhes(log.detalhes)}
                          </span>
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
