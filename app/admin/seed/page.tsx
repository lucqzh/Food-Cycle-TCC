"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { broadcastMetricsUpdate } from "@/lib/donation-metrics"
import { logAdminAudit } from "@/lib/admin-audit"
import { toast } from "sonner"
import {
  Database,
  Zap,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  Building2,
  Heart,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Dados de demonstração ────────────────────────────────────────────────────

const EMPRESAS_SEED = [
  { razao_social: "Supermercado BomPreço Ltda", nome_fantasia: "BomPreço", cnpj: "11.222.333/0001-01", cidade: "São Paulo", estado: "SP", setor: "varejo_alimentar", selo_doador: true, nivel_selo: "ouro" },
  { razao_social: "Distribuidora Alimentos do Norte S.A.", nome_fantasia: "NorteAlim", cnpj: "22.333.444/0001-02", cidade: "Manaus", estado: "AM", setor: "distribuicao", selo_doador: true, nivel_selo: "prata" },
  { razao_social: "Frigorífico Central Pecuária Ltda", nome_fantasia: "FrigoCentral", cnpj: "33.444.555/0001-03", cidade: "Campo Grande", estado: "MS", setor: "frigorifico", selo_doador: false, nivel_selo: null },
  { razao_social: "Padaria & Confeitaria Horizonte ME", nome_fantasia: "Padaria Horizonte", cnpj: "44.555.666/0001-04", cidade: "Belo Horizonte", estado: "MG", setor: "panificacao", selo_doador: true, nivel_selo: "bronze" },
  { razao_social: "Cooperativa Agro Sul Ltda", nome_fantasia: "AgroSul", cnpj: "55.666.777/0001-05", cidade: "Porto Alegre", estado: "RS", setor: "cooperativa", selo_doador: true, nivel_selo: "ouro" },
  { razao_social: "Restaurante Industrial Nexo S.A.", nome_fantasia: "Nexo Food", cnpj: "66.777.888/0001-06", cidade: "Curitiba", estado: "PR", setor: "restaurante_industrial", selo_doador: false, nivel_selo: null },
  { razao_social: "Hortifrutti Premium Comércio Ltda", nome_fantasia: "HortiFresh", cnpj: "77.888.999/0001-07", cidade: "Campinas", estado: "SP", setor: "hortifruti", selo_doador: true, nivel_selo: "prata" },
  { razao_social: "Laticínios Vale Verde Ltda", nome_fantasia: "Vale Verde", cnpj: "88.999.000/0001-08", cidade: "Juiz de Fora", estado: "MG", setor: "laticinios", selo_doador: true, nivel_selo: "ouro" },
]

const INSTITUICOES_SEED = [
  { razao_social: "Associação Pão da Vida", nome_fantasia: "Pão da Vida", cnpj: "99.111.222/0001-01", tipo_instituicao: "banco_de_alimentos", cidade: "São Paulo", estado: "SP", pessoas_atendidas: 850 },
  { razao_social: "ONG Mãos Que Alimentam", nome_fantasia: "Mãos Solidárias", cnpj: "99.222.333/0001-02", tipo_instituicao: "ong", cidade: "Rio de Janeiro", estado: "RJ", pessoas_atendidas: 420 },
  { razao_social: "Abrigo Esperança da Criança", nome_fantasia: "Abrigo Esperança", cnpj: "99.333.444/0001-03", tipo_instituicao: "abrigo", cidade: "Salvador", estado: "BA", pessoas_atendidas: 180 },
  { razao_social: "Centro Comunitário Raízes do Norte", nome_fantasia: "Raízes do Norte", cnpj: "99.444.555/0001-04", tipo_instituicao: "centro_comunitario", cidade: "Fortaleza", estado: "CE", pessoas_atendidas: 310 },
  { razao_social: "Instituto Alimento e Dignidade", nome_fantasia: "IAD", cnpj: "99.555.666/0001-05", tipo_instituicao: "instituto", cidade: "Recife", estado: "PE", pessoas_atendidas: 560 },
  { razao_social: "Casa de Acolhimento São Francisco", nome_fantasia: "Casa São Francisco", cnpj: "99.666.777/0001-06", tipo_instituicao: "abrigo", cidade: "Belém", estado: "PA", pessoas_atendidas: 95 },
]

type SeedStep = {
  label: string
  status: "pending" | "running" | "done" | "error"
  count?: number
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SeedPage() {
  const [steps, setSteps] = useState<SeedStep[]>([
    { label: "Inserir empresas doadoras de demonstração", status: "pending" },
    { label: "Inserir instituições beneficiárias de demonstração", status: "pending" },
    { label: "Gerar lotes de doação variados", status: "pending" },
    { label: "Registrar log de auditoria", status: "pending" },
    { label: "Transmitir atualização em tempo real", status: "pending" },
  ])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [clearing, setClearing] = useState(false)

  const updateStep = (index: number, patch: Partial<SeedStep>) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s))
  }

  const handleSeed = async () => {
    setRunning(true)
    setDone(false)
    setSteps(prev => prev.map(s => ({ ...s, status: "pending" })))

    const supabase = createClient()
    let empresaIds: string[] = []
    let instituicaoIds: string[] = []

    try {
      // ── STEP 0: Empresas ──────────────────────────────────────────────────
      updateStep(0, { status: "running" })
      const { data: empData, error: empErr } = await supabase
        .from("empresas")
        .insert(EMPRESAS_SEED.map(e => ({ ...e, verificada: true })))
        .select("id")
      if (empErr) throw new Error(`Empresas: ${empErr.message}`)
      empresaIds = (empData || []).map((e: { id: string }) => e.id)
      updateStep(0, { status: "done", count: empresaIds.length })

      // ── STEP 1: Instituições ──────────────────────────────────────────────
      updateStep(1, { status: "running" })
      const { data: instData, error: instErr } = await supabase
        .from("instituicoes")
        .insert(INSTITUICOES_SEED.map(i => ({ ...i, verificada: true })))
        .select("id")
      if (instErr) throw new Error(`Instituições: ${instErr.message}`)
      instituicaoIds = (instData || []).map((i: { id: string }) => i.id)
      updateStep(1, { status: "done", count: instituicaoIds.length })

      // ── STEP 2: Lotes de doação ───────────────────────────────────────────
      updateStep(2, { status: "running" })

      const categorias = ["hortifruti", "graos_cereais", "laticinios", "proteinas", "panificacao", "bebidas", "conservas", "temperos"]
      const statuses = ["disponivel", "disponivel", "disponivel", "reservado", "entregue", "entregue"]
      const destinos = ["banco_de_alimentos", "ong", "abrigo", "cozinha_comunitaria", "escola_publica"]

      const hoje = new Date()
      const lotes = Array.from({ length: 24 }, (_, i) => {
        const validade = new Date(hoje)
        validade.setDate(hoje.getDate() + Math.floor(Math.random() * 60) + 5)
        const categoria = categorias[i % categorias.length]
        const status = statuses[i % statuses.length]
        const empresaId = empresaIds[i % empresaIds.length]
        const destinoInstId = instituicaoIds[i % instituicaoIds.length]
        const codigo = `FC-${new Date().getFullYear()}-${String(100000 + i + 1)}`

        return {
          empresa_id: empresaId,
          categoria,
          descricao: `Lote de ${categoria.replace(/_/g, " ")} para doação — Demonstração PNCPDA`,
          quantidade_kg: Math.round((Math.random() * 450 + 50) * 10) / 10,
          data_validade: validade.toISOString().split("T")[0],
          status,
          destino: destinos[i % destinos.length],
          instituicao_destino_id: status !== "disponivel" ? destinoInstId : null,
          codigo_rastreio: codigo,
          condicoes_armazenamento: ["refrigerado", "temperatura_ambiente", "congelado"][i % 3],
          certificado_sanitario: true,
          observacoes: "Dados de demonstração — TCC FoodCycle",
        }
      })

      const { data: loteData, error: loteErr } = await supabase
        .from("doacoes")
        .insert(lotes)
        .select("id")
      if (loteErr) throw new Error(`Lotes: ${loteErr.message}`)
      updateStep(2, { status: "done", count: (loteData || []).length })

      // ── STEP 3: Audit log ─────────────────────────────────────────────────
      updateStep(3, { status: "running" })
      await logAdminAudit({
        acao: "SEED_DADOS_DEMONSTRACAO",
        entidade: "seed",
        detalhes: {
          empresas_inseridas: empresaIds.length,
          instituicoes_inseridas: instituicaoIds.length,
          lotes_inseridos: (loteData || []).length,
          fonte: "Painel Admin → Seed de Demonstração",
        },
      })
      updateStep(3, { status: "done" })

      // ── STEP 4: Realtime broadcast ────────────────────────────────────────
      updateStep(4, { status: "running" })
      await broadcastMetricsUpdate()
      updateStep(4, { status: "done" })

      setDone(true)
      toast.success("🌱 Seed concluído com sucesso!", {
        description: `${empresaIds.length} empresas, ${instituicaoIds.length} instituições e ${(loteData || []).length} lotes inseridos.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      toast.error("Erro durante o seed", { description: msg })
      setSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s))
    } finally {
      setRunning(false)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    const supabase = createClient()
    try {
      await supabase.from("doacoes").delete().like("observacoes", "%Dados de demonstração%")
      await supabase.from("instituicoes").delete().in("cnpj", INSTITUICOES_SEED.map(i => i.cnpj))
      await supabase.from("empresas").delete().in("cnpj", EMPRESAS_SEED.map(e => e.cnpj))
      await logAdminAudit({ acao: "LIMPAR_SEED_DEMONSTRACAO", entidade: "seed", detalhes: { origem: "Painel Admin → Seed" } })
      await broadcastMetricsUpdate()
      setDone(false)
      setSteps(prev => prev.map(s => ({ ...s, status: "pending" })))
      toast.info("🧹 Dados de demonstração removidos.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      toast.error("Erro ao limpar seed", { description: msg })
    } finally {
      setClearing(false)
    }
  }

  const statusIcon = (s: SeedStep["status"]) => {
    if (s === "running") return <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
    if (s === "done") return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    if (s === "error") return <AlertCircle className="h-4 w-4 text-red-400" />
    return <div className="h-4 w-4 rounded-full border border-slate-600" />
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/80 border border-purple-800/40 px-3 py-1 text-xs font-mono text-purple-300 w-fit">
          <Database className="h-3.5 w-3.5 text-purple-400" />
          Seed de Dados · Apresentação Acadêmica
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
          Carga de Dados de Demonstração
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Popula o banco com dados realistas de empresas, instituições e lotes de doação para apresentação do TCC. Todos os registros são marcados como <code className="text-purple-400 text-xs bg-purple-950/40 px-1 py-0.5 rounded">demonstração</code> para fácil identificação e remoção.
        </p>
      </div>

      {/* Stats de o que será inserido */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { icon: Building2, label: "Empresas Doadoras", count: EMPRESAS_SEED.length, color: "emerald" },
          { icon: Heart, label: "Instituições Receptoras", count: INSTITUICOES_SEED.length, color: "purple" },
          { icon: Package, label: "Lotes de Doação", count: 24, color: "amber" },
        ].map(({ icon: Icon, label, count, color }) => (
          <div key={label} className={`rounded-2xl border border-${color}-900/40 bg-${color}-950/20 p-5 text-center`}>
            <Icon className={`h-6 w-6 mx-auto mb-2 text-${color}-400`} />
            <p className="text-2xl font-black text-white font-mono">{count}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Progresso */}
      <div className="rounded-2xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#071B17]/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            Etapas de Execução
          </h2>
          {done && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
            </span>
          )}
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {statusIcon(step.status)}
              <span className={`text-sm flex-1 ${step.status === "done" ? "text-slate-900 dark:text-white" : step.status === "error" ? "text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
                {step.label}
              </span>
              {step.count !== undefined && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  +{step.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleSeed}
          disabled={running || clearing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 px-6"
        >
          {running ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Carregando dados...</>
          ) : (
            <><Zap className="h-4 w-4" /> Executar Seed de Demonstração</>
          )}
        </Button>

        {done && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={clearing}
            className="border-red-900/60 text-red-400 hover:bg-red-950/30 hover:text-red-300 gap-2"
          >
            {clearing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Limpando...</>
            ) : (
              <><Trash2 className="h-4 w-4" /> Limpar Dados de Demonstração</>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setSteps(prev => prev.map(s => ({ ...s, status: "pending" })))}
          disabled={running}
          className="text-slate-500 dark:text-slate-400 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Resetar Status
        </Button>
      </div>

      {/* Aviso */}
      <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 text-xs text-amber-300 leading-relaxed">
        <strong className="text-amber-200">⚠️ Atenção:</strong> Este seed insere dados reais no banco de dados do Supabase. Use apenas em ambiente de desenvolvimento ou demonstração acadêmica. Os registros podem ser removidos pelo botão &quot;Limpar Dados de Demonstração&quot; após a apresentação.
      </div>
    </div>
  )
}
