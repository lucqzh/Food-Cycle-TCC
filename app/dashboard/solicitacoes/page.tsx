"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
  Inbox,
  Truck,
  Sparkles,
  ArrowRight
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
    status?: string
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

      const [emp, inst] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
      ])

      let role: "empresa" | "instituicao" | "outro" = "outro"
      if (emp.data) role = "empresa"
      else if (inst.data) role = "instituicao"
      setTipoUsuario(role)

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
            status,
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
        let filtradas = data as unknown as SolicitacaoItem[]
        const instId = inst.data?.id
        const empId = emp.data?.id
        if (role === "instituicao" && instId) {
          filtradas = filtradas.filter((s) => s.instituicao_id === instId)
        } else if (role === "empresa" && empId) {
          filtradas = filtradas.filter((s) => s.doacoes?.empresa_id === empId)
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

  const confirmarEntrega = async (solicitacaoId: number, doacaoId: number) => {
    setProcessandoId(solicitacaoId)
    setAviso(null)

    try {
      const supabase = createClient()

      const { error: errDoacao } = await supabase
        .from("doacoes")
        .update({ status: "entregue" })
        .eq("id", doacaoId)

      if (errDoacao) throw errDoacao

      const agora = new Date().toISOString()
      const { error: errEntrega } = await supabase
        .from("entregas")
        .insert({
          doacao_id: doacaoId,
          solicitacao_id: solicitacaoId,
          data_agendada: agora,
          data_entrega: agora,
          status: "entregue",
          condicao_recebimento: "otima",
          observacoes: "Entrega física confirmada via portal FoodCycle."
        })

      if (errEntrega) {
        console.warn("Aviso ao registrar entrega:", errEntrega.message)
      }

      try {
        await supabase.from("historico_status").insert({
          entidade: "doacao",
          entidade_id: doacaoId,
          status_anterior: "reservado",
          status_novo: "entregue",
          observacao: "Alimento recebido pela instituição receptora."
        })
      } catch (errHist) {
        console.warn("Aviso ao registrar histórico:", errHist)
      }

      setAviso({
        tipo: "sucesso",
        texto: "Entrega física confirmada com sucesso! O ciclo de vida desta doação foi concluído."
      })
      await carregarDados()
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: e.message || "Erro ao confirmar entrega." })
    } finally {
      setProcessandoId(null)
    }
  }

  const atualizarStatus = async (solicitacaoId: number, doacaoId: number, novoStatus: "aprovado" | "recusado" | "cancelado") => {
    setProcessandoId(solicitacaoId)
    setAviso(null)

    try {
      const supabase = createClient()

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
      { label: string; badgeClass: string; icon: typeof CheckCircle }
    > = {
      pendente: { label: "Pendente", badgeClass: "bg-amber-950 text-amber-300 border-amber-800/40", icon: Clock },
      aprovado: { label: "Aprovada", badgeClass: "bg-emerald-950 text-emerald-300 border-emerald-800/40", icon: CheckCircle },
      recusado: { label: "Recusada", badgeClass: "bg-red-950 text-red-300 border-red-800/40", icon: XCircle },
      cancelado: { label: "Cancelada", badgeClass: "bg-slate-900 text-slate-400 border-slate-700/40", icon: XCircle },
    }

    const item = config[status] || config.pendente
    const Icon = item.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${item.badgeClass}`}>
        <Icon className="h-3 w-3" />
        {item.label}
      </span>
    )
  }

  const pendentes = solicitacoes.filter((s) => s.status === "pendente").length
  const aprovadas = solicitacoes.filter((s) => s.status === "aprovado").length
  const concluidas = solicitacoes.filter((s) => s.status === "recusado" || s.status === "cancelado").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 mb-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Fluxo de Destinação Legal
          </div>
          <h1 className="text-3xl font-extrabold text-white font-serif">
            {tipoUsuario === "empresa" ? "Solicitações Recebidas" : "Minhas Solicitações"}
          </h1>
          <p className="text-xs text-slate-400">
            {tipoUsuario === "empresa"
              ? "Aprove ou recuse pedidos de instituições receptoras para liberação física de lotes"
              : "Acompanhe o status e a autorização de retirada dos alimentos solicitados"}
          </p>
        </div>
      </div>

      {aviso && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-xs font-semibold ${
            aviso.tipo === "sucesso"
              ? "border border-emerald-800/80 bg-emerald-950/60 text-emerald-200"
              : "border border-red-800/80 bg-red-950/60 text-red-200"
          }`}
        >
          {aviso.tipo === "sucesso" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{aviso.texto}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pendentes de Análise</p>
          <p className="mt-2 text-3xl font-black text-amber-400 font-mono">{pendentes}</p>
        </div>
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aprovadas / Reservadas</p>
          <p className="mt-2 text-3xl font-black text-emerald-400 font-mono">{aprovadas}</p>
        </div>
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Finalizadas</p>
          <p className="mt-2 text-3xl font-black text-slate-300 font-mono">{concluidas}</p>
        </div>
      </div>

      {/* Lista de Solicitações */}
      {carregando ? (
        <div className="flex min-h-[300px] items-center justify-center font-mono text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
          Carregando solicitações do Supabase...
        </div>
      ) : solicitacoes.length === 0 ? (
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-12 text-center max-w-md mx-auto space-y-3">
          <Inbox className="h-12 w-12 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhuma solicitação encontrada</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Assim que instituições solicitarem doações ou você enviar um pedido, os registros aparecerão aqui com status em tempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitacoes.map((item) => {
            const doacao = item.doacoes
            const inst = item.instituicoes
            const isEmpresa = tipoUsuario === "empresa"
            const doacaoEntregue = doacao?.status === "entregue"

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/60 to-[#071B17]/90 p-6 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {doacao?.tipo_alimento || "Lote de Alimento"}
                      </h3>
                      {getStatusBadge(item.status)}
                      {doacaoEntregue && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-blue-950 text-blue-300 border border-blue-800/40 font-bold uppercase">
                          Entregue
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Rastreio: <strong className="text-emerald-400">{doacao?.codigo_rastreio}</strong> • {doacao?.quantidade_kg} kg
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-slate-400 font-mono">
                    <div>Solicitado em: {new Date(item.data_solicitacao).toLocaleDateString("pt-BR")}</div>
                    {item.data_resposta && (
                      <div className="text-slate-500">Respondido em: {new Date(item.data_resposta).toLocaleDateString("pt-BR")}</div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-[#071B17]/80 border border-emerald-950/60">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Instituição Receptora:</span>
                    <p className="font-bold text-white mt-0.5">{inst?.razao_social || "Instituição"}</p>
                    <p className="text-slate-400 text-[11px]">{inst?.cidade} / {inst?.estado}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#071B17]/80 border border-emerald-950/60">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Empresa Doadora:</span>
                    <p className="font-bold text-white mt-0.5">
                      {doacao?.empresas?.nome_fantasia || doacao?.empresas?.razao_social || "Empresa"}
                    </p>
                  </div>
                </div>

                {item.mensagem && (
                  <div className="p-3 rounded-xl bg-[#0A241F]/40 border border-emerald-950/40 text-xs text-slate-300">
                    <span className="font-bold text-slate-400">Mensagem: </span>
                    {item.mensagem}
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-emerald-950/60">
                  {isEmpresa && item.status === "pendente" && doacao && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarStatus(item.id, doacao.id, "recusado")}
                        disabled={processandoId === item.id}
                        className="h-9 border-red-900/60 text-red-300 hover:bg-red-950/40 text-xs"
                      >
                        Recusar Solicitação
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => atualizarStatus(item.id, doacao.id, "aprovado")}
                        disabled={processandoId === item.id}
                        className="h-9 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs"
                      >
                        Aprovar e Reservar Lote
                      </Button>
                    </>
                  )}

                  {/* Botão de confirmação de entrega física */}
                  {item.status === "aprovado" && doacao && !doacaoEntregue && (
                    <Button
                      size="sm"
                      onClick={() => confirmarEntrega(item.id, doacao.id)}
                      disabled={processandoId === item.id}
                      className="h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#071B17] font-bold text-xs tracking-wide shadow-md shadow-amber-950/60"
                    >
                      <Truck className="h-4 w-4 mr-1.5" />
                      {processandoId === item.id ? "Gravando Entrega..." : "Confirmar Retirada / Recebimento"}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
