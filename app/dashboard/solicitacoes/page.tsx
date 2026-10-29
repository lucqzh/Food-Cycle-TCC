"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  CheckCircle2,
  Inbox
} from "lucide-react"

interface SolicitacaoItem {
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
      id: number
      nome_fantasia: string | null
      razao_social: string
    } | null
  } | null
  instituicoes?: {
    id: number
    razao_social: string
    tipo_instituicao: string
    cidade: string
    estado: string
  } | null
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [tipoUsuario, setTipoUsuario] = useState<"empresa" | "instituicao" | "outro">("outro")
  const [perfilId, setPerfilId] = useState<string>("")
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)
  const [processandoId, setProcessandoId] = useState<number | null>(null)

  const carregarDados = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        setCarregando(false)
        return
      }

      const uid = authData.user.id
      setPerfilId(uid)

      // Identifica o papel do usuário
      const [emp, inst] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
      ])

      let role: "empresa" | "instituicao" | "outro" = "outro"
      if (emp.data) role = "empresa"
      else if (inst.data) role = "instituicao"
      setTipoUsuario(role)

      // Busca as solicitações no banco com joins
      const { data, error } = await supabase
        .from("solicitacoes")
        .select(`
          id,
          instituicao_id,
          doacao_id,
          status,
          motivo_recusa,
          mensagem,
          data_solicitacao,
          data_resposta,
          doacoes (
            id,
            tipo_alimento,
            quantidade_kg,
            codigo_rastreio,
            categoria,
            empresa_id,
            empresas (
              id,
              nome_fantasia,
              razao_social
            )
          ),
          instituicoes (
            id,
            razao_social,
            tipo_instituicao,
            cidade,
            estado
          )
        `)
        .order("id", { ascending: false })

      if (error) {
        console.error("Erro ao carregar solicitações:", error)
      } else if (data) {
        // Se for instituição, filtra as dela. Se for empresa, filtra as doações dela.
        let filtradas = data as unknown as SolicitacaoItem[]
        if (role === "instituicao" && inst.data) {
          filtradas = filtradas.filter((s) => s.instituicao_id === inst.data.id)
        } else if (role === "empresa" && emp.data) {
          filtradas = filtradas.filter((s) => s.doacoes?.empresa_id === emp.data.id)
        }
        setSolicitacoes(filtradas)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const atualizarStatus = async (solicitacaoId: number, doacaoId: number, novoStatus: "aprovado" | "recusado" | "cancelado") => {
    setProcessandoId(solicitacaoId)
    setAviso(null)

    try {
      const supabase = createClient()

      // Atualiza o status da solicitação
      const { error: errSol } = await supabase
        .from("solicitacoes")
        .update({
          status: novoStatus,
          data_resposta: new Date().toISOString(),
        })
        .eq("id", solicitacaoId)

      if (errSol) {
        setAviso({ tipo: "erro", texto: `Falha ao atualizar solicitação: ${errSol.message}` })
        setProcessandoId(null)
        return
      }

      // Se for aprovado, muda o status da doação para 'reservado'
      if (novoStatus === "aprovado") {
        await supabase
          .from("doacoes")
          .update({ status: "reservado" })
          .eq("id", doacaoId)
      }

      setAviso({
        tipo: "sucesso",
        texto: `Solicitação ${novoStatus === "aprovado" ? "aprovada" : novoStatus === "recusado" ? "recusada" : "cancelada"} com sucesso!`
      })
      await carregarDados()
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: e.message || "Erro inesperado." })
    } finally {
      setProcessandoId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle }
    > = {
      pendente: { label: "Pendente", variant: "secondary", icon: Clock },
      aprovado: { label: "Aprovada", variant: "default", icon: CheckCircle },
      recusado: { label: "Recusada", variant: "destructive", icon: XCircle },
      cancelado: { label: "Cancelada", variant: "outline", icon: XCircle },
    }

    const item = config[status] || config.pendente
    const Icon = item.icon

    return (
      <Badge variant={item.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {item.label}
      </Badge>
    )
  }

  const pendentes = solicitacoes.filter((s) => s.status === "pendente").length
  const aprovadas = solicitacoes.filter((s) => s.status === "aprovado").length
  const concluidas = solicitacoes.filter((s) => s.status === "recusado" || s.status === "cancelado").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {tipoUsuario === "empresa" ? "Solicitações Recebidas" : "Minhas Solicitações"}
        </h1>
        <p className="text-muted-foreground">
          {tipoUsuario === "empresa"
            ? "Gerencie os pedidos feitos por instituições para os seus lotes de doação"
            : "Acompanhe o andamento das solicitações de alimentos para a sua instituição"}
        </p>
      </div>

      {aviso && (
        <div
          className={`flex items-center gap-3 rounded-lg p-4 text-sm font-medium ${
            aviso.tipo === "sucesso"
              ? "border border-primary/30 bg-primary/10 text-primary"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {aviso.tipo === "sucesso" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{aviso.texto}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendentes}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aprovadas}</p>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{concluidas}</p>
                <p className="text-sm text-muted-foreground">Recusadas / Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitations List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Histórico de Solicitações</CardTitle>
              <CardDescription>Lista atualizada diretamente do banco de dados</CardDescription>
            </div>
            <button
              onClick={carregarDados}
              className="text-xs text-primary hover:underline focus:outline-none"
            >
              Recarregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="flex min-h-[180px] items-center justify-center text-muted-foreground text-sm">
              Carregando solicitações do banco de dados...
            </div>
          ) : solicitacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 text-muted-foreground/40 mb-2" />
              <p className="font-medium text-foreground">Nenhuma solicitação encontrada</p>
              <p className="text-xs mt-1">
                Quando uma instituição solicitar uma doação na tela de Doações, o pedido aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitacoes.map((sol) => {
                const doacaoNome = sol.doacoes?.tipo_alimento || "Alimento"
                const quantidade = sol.doacoes?.quantidade_kg ? `${sol.doacoes.quantidade_kg} kg` : ""
                const empresaNome =
                  sol.doacoes?.empresas?.nome_fantasia ||
                  sol.doacoes?.empresas?.razao_social ||
                  "Empresa Doadora"
                const instituicaoNome = sol.instituicoes?.razao_social || "Instituição Receptora"

                return (
                  <div
                    key={sol.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{doacaoNome}</h3>
                        {getStatusBadge(sol.status)}
                        {sol.doacoes?.codigo_rastreio && (
                          <Badge variant="outline" className="text-[10px]">
                            {sol.doacoes.codigo_rastreio}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {tipoUsuario === "empresa" ? `Solicitante: ${instituicaoNome}` : `Doador: ${empresaNome}`}
                        </span>
                        {quantidade && (
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {quantidade}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(sol.data_solicitacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {sol.mensagem && (
                        <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-1 italic">
                          "{sol.mensagem}"
                        </p>
                      )}
                    </div>

                    {/* Ações para a Empresa: Aprovar ou Recusar */}
                    {tipoUsuario === "empresa" && sol.status === "pendente" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/10"
                          disabled={processandoId === sol.id}
                          onClick={() => atualizarStatus(sol.id, sol.doacao_id, "recusado")}
                        >
                          Recusar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={processandoId === sol.id}
                          onClick={() => atualizarStatus(sol.id, sol.doacao_id, "aprovado")}
                        >
                          Aprovar
                        </Button>
                      </div>
                    )}

                    {/* Ações para a Instituição: Cancelar */}
                    {tipoUsuario === "instituicao" && sol.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processandoId === sol.id}
                        onClick={() => atualizarStatus(sol.id, sol.doacao_id, "cancelado")}
                      >
                        Cancelar pedido
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
