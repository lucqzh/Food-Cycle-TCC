"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { broadcastMetricsUpdate, DonationRecord } from "@/lib/donation-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Radio, 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  Package, 
  RefreshCw,
  Send,
  Sparkles,
  AlertCircle
} from "lucide-react"

interface EmpresaOption {
  id: number
  nome: string
}

export function RealtimeMetricasController() {
  const [doacoes, setDoacoes] = useState<DonationRecord[]>([])
  const [empresas, setEmpresas] = useState<EmpresaOption[]>([])
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  // Modal de Criação / Edição
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    tipo_alimento: "",
    quantidade_kg: 100,
    categoria: "fruta",
    destino: "humano",
    status: "disponivel",
    empresa_id: 0,
  })

  // Carregar dados iniciais
  const carregarDados = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const [doacoesRes, empRes] = await Promise.all([
        supabase
          .from("doacoes")
          .select(`
            id,
            codigo_rastreio,
            tipo_alimento,
            categoria,
            quantidade_kg,
            data_validade,
            condicao_armazenamento,
            destino,
            status,
            data_criacao,
            empresas (
              id,
              nome_fantasia,
              razao_social
            )
          `)
          .order("id", { ascending: false })
          .limit(10),
        supabase.from("empresas").select("id, razao_social, nome_fantasia").limit(20)
      ])

      const listDoacoes = (doacoesRes.data as unknown as DonationRecord[]) || []
      setDoacoes(listDoacoes)

      const listEmpresas = (empRes.data || []).map(e => ({
        id: e.id,
        nome: e.nome_fantasia || e.razao_social || `Empresa #${e.id}`
      }))
      setEmpresas(listEmpresas)

      if (listEmpresas.length > 0 && formData.empresa_id === 0) {
        setFormData(prev => ({ ...prev, empresa_id: listEmpresas[0].id }))
      }
    } catch (e: any) {
      console.error(e)
      setErro("Falha ao carregar dados do Supabase")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarSucesso = (texto: string) => {
    setMensagemSucesso(texto)
    setTimeout(() => {
      setMensagemSucesso(null)
    }, 4000)
  }

  // Ação Rápida de Injeção de Carga (+100kg, +250kg, etc.)
  const dispararAcaoRapida = async (
    tipoAlimento: string, 
    kg: number, 
    categoria: string, 
    destino: string
  ) => {
    setEnviando(true)
    setErro(null)

    try {
      const supabase = createClient()
      const anoAtual = new Date().getFullYear()
      const aleatorio = Math.floor(100000 + Math.random() * 900000)
      const codigoRastreio = `FC-${anoAtual}-${aleatorio}`

      let targetEmpresaId = empresas[0]?.id
      if (!targetEmpresaId) {
        // Se não houver empresas cadastradas, busca qualquer perfil ou cria
        const { data: firstEmp } = await supabase.from("empresas").select("id").limit(1).maybeSingle()
        targetEmpresaId = firstEmp?.id || 1
      }

      const validadeData = new Date()
      validadeData.setDate(validadeData.getDate() + 15)
      const dataValidadeStr = validadeData.toISOString().split("T")[0]

      const { error: insertError } = await supabase.from("doacoes").insert({
        codigo_rastreio: codigoRastreio,
        empresa_id: targetEmpresaId,
        tipo_alimento: tipoAlimento,
        categoria: categoria,
        quantidade_kg: kg,
        data_validade: dataValidadeStr,
        condicao_armazenamento: "ambiente",
        destino: destino,
        status: "disponivel",
        termo_aceite: true
      })

      if (insertError) throw insertError

      // Dispara broadcast Realtime para todos os navegadores abertos no Dashboard
      await broadcastMetricsUpdate(`Lote rápido de ${kg}kg de ${tipoAlimento} adicionado pelo Admin`)

      mostrarSucesso(`⚡ Lote de ${kg} kg de "${tipoAlimento}" transmitido ao Dashboard em tempo real!`)
      await carregarDados()
    } catch (e: any) {
      console.error(e)
      setErro(`Erro ao disparar lote rápido: ${e.message}`)
    } finally {
      setEnviando(false)
    }
  }

  // Avançar status do lote mais recente para "entregue"
  const concluirEntregaLoteMaisRecente = async () => {
    const doacaoDisponivel = doacoes.find(d => d.status === "disponivel" || d.status === "reservado")
    if (!doacaoDisponivel) {
      setErro("Nenhum lote disponível ou reservado encontrado para marcar como entregue.")
      return
    }

    setEnviando(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("doacoes")
        .update({ status: "entregue" })
        .eq("id", doacaoDisponivel.id)

      if (updateError) throw updateError

      await broadcastMetricsUpdate(`Lote #${doacaoDisponivel.id} marcado como Entregue`)
      mostrarSucesso(`⚡ Lote #${doacaoDisponivel.id} (${doacaoDisponivel.tipo_alimento}) marcado como "ENTREGUE"! Métricas recalculadas.`)
      await carregarDados()
    } catch (e: any) {
      console.error(e)
      setErro(`Erro ao atualizar status: ${e.message}`)
    } finally {
      setEnviando(false)
    }
  }

  // Abrir Modal de Criação ou Edição
  const abrirModalCriar = () => {
    setEditandoId(null)
    setFormData({
      tipo_alimento: "",
      quantidade_kg: 150,
      categoria: "graos_cereais",
      destino: "humano",
      status: "disponivel",
      empresa_id: empresas[0]?.id || 1,
    })
    setModalAberto(true)
  }

  const abrirModalEditar = (d: DonationRecord) => {
    setEditandoId(d.id)
    setFormData({
      tipo_alimento: d.tipo_alimento,
      quantidade_kg: Number(d.quantidade_kg),
      categoria: d.categoria || "outro",
      destino: d.destino || "humano",
      status: d.status || "disponivel",
      empresa_id: d.empresas?.id || empresas[0]?.id || 1,
    })
    setModalAberto(true)
  }

  // Salvar criação ou edição de lote
  const salvarLote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tipo_alimento.trim()) {
      setErro("Informe o nome do alimento.")
      return
    }
    if (formData.quantidade_kg <= 0) {
      setErro("A quantidade deve ser superior a zero.")
      return
    }

    setEnviando(true)
    setErro(null)

    try {
      const supabase = createClient()

      if (editandoId) {
        // Edição de Lote Existente
        const { error: updateError } = await supabase
          .from("doacoes")
          .update({
            tipo_alimento: formData.tipo_alimento.trim(),
            quantidade_kg: formData.quantidade_kg,
            categoria: formData.categoria,
            destino: formData.destino,
            status: formData.status,
          })
          .eq("id", editandoId)

        if (updateError) throw updateError

        await broadcastMetricsUpdate(`Lote #${editandoId} alterado pelo Admin (${formData.quantidade_kg}kg)`)
        mostrarSucesso(`⚡ Lote #${editandoId} atualizado para ${formData.quantidade_kg} kg! Dashboard sincronizado.`)
      } else {
        // Criação de Novo Lote
        const anoAtual = new Date().getFullYear()
        const aleatorio = Math.floor(100000 + Math.random() * 900000)
        const codigoRastreio = `FC-${anoAtual}-${aleatorio}`

        const validadeData = new Date()
        validadeData.setDate(validadeData.getDate() + 20)

        const { error: insertError } = await supabase.from("doacoes").insert({
          codigo_rastreio: codigoRastreio,
          empresa_id: formData.empresa_id || empresas[0]?.id || 1,
          tipo_alimento: formData.tipo_alimento.trim(),
          categoria: formData.categoria,
          quantidade_kg: formData.quantidade_kg,
          data_validade: validadeData.toISOString().split("T")[0],
          condicao_armazenamento: "ambiente",
          destino: formData.destino,
          status: formData.status,
          termo_aceite: true
        })

        if (insertError) throw insertError

        await broadcastMetricsUpdate(`Novo lote de ${formData.quantidade_kg}kg de ${formData.tipo_alimento} transmitido pelo Admin`)
        mostrarSucesso(`⚡ Novo lote de ${formData.quantidade_kg} kg registrado e transmitido ao Dashboard!`)
      }

      setModalAberto(false)
      await carregarDados()
    } catch (e: any) {
      console.error(e)
      setErro(`Erro ao salvar lote: ${e.message}`)
    } finally {
      setEnviando(false)
    }
  }

  // Deletar Lote
  const excluirLote = async (id: number) => {
    if (!confirm(`Deseja realmente excluir o lote #${id}? O impacto será recalculado no dashboard.`)) {
      return
    }

    setEnviando(true)
    try {
      const supabase = createClient()
      const { error: delError } = await supabase.from("doacoes").delete().eq("id", id)
      if (delError) throw delError

      await broadcastMetricsUpdate(`Lote #${id} removido pelo Admin`)
      mostrarSucesso(`⚡ Lote #${id} removido. O Dashboard foi recalculado em tempo real!`)
      await carregarDados()
    } catch (e: any) {
      console.error(e)
      setErro(`Erro ao excluir: ${e.message}`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Card Principal de Transmissão */}
      <Card className="border-purple-800/40 bg-gradient-to-br from-purple-950/40 via-[#071B17] to-[#040E0B] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <CardHeader className="pb-3 border-b border-purple-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium mb-2">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                <span>CANAL WEBSOCKET ATIVO • SUPABASE REALTIME</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                Console de Controle em Tempo Real do Dashboard
              </CardTitle>
              <CardDescription className="text-slate-300 text-xs sm:text-sm mt-1">
                Qualquer lote inserido, alterado ou finalizado aqui atualiza o <strong>Dashboard Operacional</strong> instantaneamente sem precisar recarregar a página.
              </CardDescription>
            </div>

            <Button
              onClick={abrirModalCriar}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-xs shadow-lg shadow-emerald-950/50 cursor-pointer h-10 px-4"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[3]" />
              Novo Lote Personalizado
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Alertas de Sucesso e Erro */}
          {mensagemSucesso && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{mensagemSucesso}</span>
            </div>
          )}

          {erro && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Seção 1: Gatilhos Rápidos de Demonstração / Injeção */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Injeção Rápida de Cargas de Demonstração (1 Clique)
              </span>
              <span className="text-[11px] text-slate-400">Transmissão com latência zero</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <Button
                variant="outline"
                size="sm"
                disabled={enviando}
                onClick={() => dispararAcaoRapida("Frango Congelado", 250, "proteina", "humano")}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 border-emerald-800/40 bg-emerald-950/20 hover:bg-emerald-900/40 hover:border-emerald-500 text-emerald-300 text-xs text-left"
              >
                <span className="font-bold text-white flex items-center gap-1">
                  ⚡ +250 kg Proteína
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Consumo Humano</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={enviando}
                onClick={() => dispararAcaoRapida("Arroz Integral", 400, "graos_cereais", "humano")}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 border-amber-800/40 bg-amber-950/20 hover:bg-amber-900/40 hover:border-amber-500 text-amber-300 text-xs text-left"
              >
                <span className="font-bold text-white flex items-center gap-1">
                  ⚡ +400 kg Grãos
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Consumo Humano</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={enviando}
                onClick={() => dispararAcaoRapida("Maçãs e Laranjas", 180, "fruta", "humano")}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 border-teal-800/40 bg-teal-950/20 hover:bg-teal-900/40 hover:border-teal-500 text-teal-300 text-xs text-left"
              >
                <span className="font-bold text-white flex items-center gap-1">
                  ⚡ +180 kg Frutas
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Consumo Humano</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={enviando}
                onClick={() => dispararAcaoRapida("Hortaliças Diversas", 120, "hortalica", "animal")}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 border-slate-700/60 bg-slate-900/40 hover:bg-slate-800 text-slate-200 text-xs text-left"
              >
                <span className="font-bold text-white flex items-center gap-1">
                  ⚡ +120 kg Vegetal
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Consumo Animal</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={enviando}
                onClick={concluirEntregaLoteMaisRecente}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 border-purple-800/40 bg-purple-950/30 hover:bg-purple-900/50 hover:border-purple-400 text-purple-200 text-xs text-left col-span-2 sm:col-span-1"
              >
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  ✓ Entregar Lote
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Eleva Refeições</span>
              </Button>
            </div>
          </div>

          {/* Seção 2: Tabela de Lotes para Edição Rápida de KG / Destino */}
          <div className="space-y-3 pt-4 border-t border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Lotes no Banco de Dados (Altere valores e veja o Dashboard reagir ao vivo)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={carregarDados}
                disabled={carregando}
                className="h-7 text-xs text-slate-400 hover:text-white"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${carregando ? "animate-spin" : ""}`} />
                Atualizar Lista
              </Button>
            </div>

            <div className="rounded-xl border border-emerald-950/80 bg-[#071B17]/90 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#052E24]/60 text-slate-400 font-mono border-b border-emerald-950/60">
                    <tr>
                      <th className="py-2.5 px-3">Cód. Rastreio</th>
                      <th className="py-2.5 px-3">Alimento</th>
                      <th className="py-2.5 px-3">Quantidade</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3">Destino PNCPDA</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/40 text-slate-200">
                    {doacoes.map((d) => (
                      <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-400 font-medium">
                          {d.codigo_rastreio}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {d.tipo_alimento}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">
                          {Number(d.quantidade_kg).toLocaleString("pt-BR")} kg
                        </td>
                        <td className="py-2.5 px-3 capitalize text-slate-300">
                          {d.categoria ? d.categoria.replace("_", " ") : "Outro"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            d.destino === "animal" 
                              ? "bg-amber-950/80 text-amber-300 border border-amber-800/50"
                              : d.destino === "compostagem"
                                ? "bg-slate-800 text-slate-300 border border-slate-700"
                                : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                          }`}>
                            {d.destino || "Humano"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            d.status === "entregue"
                              ? "bg-purple-950/80 text-purple-300 border border-purple-800/50"
                              : d.status === "disponivel"
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                                : "bg-blue-950/80 text-blue-300 border border-blue-800/50"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirModalEditar(d)}
                              className="h-7 px-2 text-[11px] border-emerald-900/60 bg-[#0A241F] hover:bg-emerald-900/50 text-emerald-300 cursor-pointer"
                              title="Editar quantidade ou destino em tempo real"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Editar
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => excluirLote(d.id)}
                              className="h-7 px-2 text-[11px] border-red-950 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 cursor-pointer"
                              title="Excluir Lote"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {doacoes.length === 0 && !carregando && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-500 font-mono text-xs">
                          Nenhum lote registrado. Use o botão acima para injetar um lote demonstrativo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação / Edição de Lote */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-md bg-[#0A241F] border-emerald-900/80 text-[#F8FAFC]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              {editandoId ? `Editar Lote #${editandoId}` : "Novo Lote com Transmissão em Tempo Real"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Os dados salvos serão refletidos imediatamente no Dashboard de todos os usuários logados.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvarLote} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-slate-300">Nome / Tipo do Alimento *</Label>
              <Input
                value={formData.tipo_alimento}
                onChange={e => setFormData({ ...formData, tipo_alimento: e.target.value })}
                placeholder="Ex: Frango Congelado, Arroz, Maçãs..."
                className="mt-1 h-9 bg-[#071B17] border-emerald-900/60 text-white rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-300">Quantidade (kg) *</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.quantidade_kg}
                  onChange={e => setFormData({ ...formData, quantidade_kg: Number(e.target.value) })}
                  className="mt-1 h-9 bg-[#071B17] border-emerald-900/60 text-white rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-slate-300">Categoria Nutricional</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={v => setFormData({ ...formData, categoria: v })}
                >
                  <SelectTrigger className="mt-1 h-9 bg-[#071B17] border-emerald-900/60 text-white rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071B17] border-emerald-900/60 text-white">
                    <SelectItem value="proteina">Proteínas</SelectItem>
                    <SelectItem value="graos_cereais">Grãos e Cereais</SelectItem>
                    <SelectItem value="fruta">Frutas</SelectItem>
                    <SelectItem value="hortalica">Hortaliças e Legumes</SelectItem>
                    <SelectItem value="laticinio">Laticínios</SelectItem>
                    <SelectItem value="ultraprocessado">Ultraprocessados</SelectItem>
                    <SelectItem value="outro">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-300">Destinação Legal (PNCPDA)</Label>
                <Select
                  value={formData.destino}
                  onValueChange={v => setFormData({ ...formData, destino: v })}
                >
                  <SelectTrigger className="mt-1 h-9 bg-[#071B17] border-emerald-900/60 text-white rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071B17] border-emerald-900/60 text-white">
                    <SelectItem value="humano">Consumo Humano (Prioridade)</SelectItem>
                    <SelectItem value="animal">Consumo Animal (2ª Opção)</SelectItem>
                    <SelectItem value="compostagem">Compostagem (Última)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-slate-300">Status Operacional</Label>
                <Select
                  value={formData.status}
                  onValueChange={v => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="mt-1 h-9 bg-[#071B17] border-emerald-900/60 text-white rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071B17] border-emerald-900/60 text-white">
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="em_transporte">Em Transporte</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalAberto(false)}
                className="border-emerald-900/60 text-slate-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={enviando}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold"
              >
                {enviando ? "Transmitindo..." : "Salvar & Transmitir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
