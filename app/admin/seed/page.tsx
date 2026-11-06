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

// ─── Dados de demonstração estritamente alinhados ao schema.sql ────────────────

const EMPRESAS_SEED = [
  {
    razao_social: "Supermercado BomPreço Ltda",
    nome_fantasia: "BomPreço Alimentos",
    cnpj: "11.222.333/0001-01",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    nivel_selo: "ouro" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Distribuidora Alimentos do Norte S.A.",
    nome_fantasia: "Norte Alimentos",
    cnpj: "22.333.444/0001-02",
    endereco: "Rua das Indústrias, 500",
    cidade: "Manaus",
    estado: "AM",
    cep: "69005-010",
    nivel_selo: "prata" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Frigorífico Central Pecuária Ltda",
    nome_fantasia: "FrigoCentral",
    cnpj: "33.444.555/0001-03",
    endereco: "Rodovia BR-163, km 12",
    cidade: "Campo Grande",
    estado: "MS",
    cep: "79002-001",
    nivel_selo: "aderente" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Padaria & Confeitaria Horizonte ME",
    nome_fantasia: "Padaria Horizonte",
    cnpj: "44.555.666/0001-04",
    endereco: "Rua da Bahia, 320",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30160-010",
    nivel_selo: "aderente" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Cooperativa Agro Sul Ltda",
    nome_fantasia: "AgroSul Cooperativa",
    cnpj: "55.666.777/0001-05",
    endereco: "Av. Ipiranga, 2400",
    cidade: "Porto Alegre",
    estado: "RS",
    cep: "90160-090",
    nivel_selo: "ouro" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Restaurante Industrial Nexo S.A.",
    nome_fantasia: "Nexo Refeições Coletivas",
    cnpj: "66.777.888/0001-06",
    endereco: "Rua XV de Novembro, 890",
    cidade: "Curitiba",
    estado: "PR",
    cep: "80020-310",
    nivel_selo: "prata" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Hortifrutti Frescor do Campo Ltda",
    nome_fantasia: "Frescor Horti",
    cnpj: "77.888.999/0001-07",
    endereco: "Av. Orosimbo Maia, 450",
    cidade: "Campinas",
    estado: "SP",
    cep: "13010-211",
    nivel_selo: "ouro" as const,
    data_adesao_selo: new Date().toISOString(),
  },
  {
    razao_social: "Laticínios Vale Verde S.A.",
    nome_fantasia: "Laticínios Vale Verde",
    cnpj: "88.999.000/0001-08",
    endereco: "Rua Halfeld, 120",
    cidade: "Juiz de Fora",
    estado: "MG",
    cep: "36010-000",
    nivel_selo: "ouro" as const,
    data_adesao_selo: new Date().toISOString(),
  },
]

const INSTITUICOES_SEED = [
  {
    razao_social: "Associação Beneficente Pão da Vida",
    cnpj: "99.111.222/0001-01",
    tipo_instituicao: "ong" as const,
    capacidade_atend: 1000,
    pessoas_atendidas: 850,
    endereco: "Rua da Solidariedade, 45",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000",
    responsavel_tecnico: "Dra. Helena Martins",
    alvara_sanitario: "ALV-SP-2025/9981",
  },
  {
    razao_social: "Instituição de Amparo Mãos Que Acolhem",
    cnpj: "99.222.333/0001-02",
    tipo_instituicao: "ong" as const,
    capacidade_atend: 500,
    pessoas_atendidas: 420,
    endereco: "Rua do Catete, 180",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "22220-000",
    responsavel_tecnico: "Carlos Eduardo Souza",
    alvara_sanitario: "ALV-RJ-2025/1102",
  },
  {
    razao_social: "Abrigo Esperança e Fraternidade",
    cnpj: "99.333.444/0001-03",
    tipo_instituicao: "abrigo" as const,
    capacidade_atend: 200,
    pessoas_atendidas: 180,
    endereco: "Ladeira do Pelourinho, 12",
    cidade: "Salvador",
    estado: "BA",
    cep: "40026-010",
    responsavel_tecnico: "Irmã Maria Clara",
    alvara_sanitario: "ALV-BA-2025/4431",
  },
  {
    razao_social: "Centro Comunitário Raízes do Ceará",
    cnpj: "99.444.555/0001-04",
    tipo_instituicao: "comunitaria" as const,
    capacidade_atend: 400,
    pessoas_atendidas: 310,
    endereco: "Av. Beira Mar, 1050",
    cidade: "Fortaleza",
    estado: "CE",
    cep: "60165-121",
    responsavel_tecnico: "Prof. Francisco Bezerra",
    alvara_sanitario: "ALV-CE-2025/7821",
  },
  {
    razao_social: "Pastoral da Criança e Assistência Social",
    cnpj: "99.555.666/0001-05",
    tipo_instituicao: "religiosa" as const,
    capacidade_atend: 650,
    pessoas_atendidas: 560,
    endereco: "Rua da Aurora, 200",
    cidade: "Recife",
    estado: "PE",
    cep: "50050-000",
    responsavel_tecnico: "Ana Paula Albuquerque",
    alvara_sanitario: "ALV-PE-2025/5519",
  },
  {
    razao_social: "Casa de Acolhimento São Francisco de Assis",
    cnpj: "99.666.777/0001-06",
    tipo_instituicao: "abrigo" as const,
    capacidade_atend: 120,
    pessoas_atendidas: 95,
    endereco: "Travessa Padre Eutíquio, 90",
    cidade: "Belém",
    estado: "PA",
    cep: "66015-000",
    responsavel_tecnico: "Dr. Roberto Caldas",
    alvara_sanitario: "ALV-PA-2025/3340",
  },
]

type SeedStep = {
  label: string
  status: "pending" | "running" | "done" | "error"
  count?: number
}

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
    let empresaIds: number[] = []
    let instituicaoIds: number[] = []

    try {
      // ── STEP 0: Empresas ──────────────────────────────────────────────────
      updateStep(0, { status: "running" })

      // Upsert/Insert tolerante: busca se já existem ou insere novos
      const { data: empExistentes } = await supabase
        .from("empresas")
        .select("id, cnpj")
        .in("cnpj", EMPRESAS_SEED.map(e => e.cnpj))

      const cnpjsCadastrados = new Set((empExistentes || []).map(e => e.cnpj))
      const empresasParaInserir = EMPRESAS_SEED.filter(e => !cnpjsCadastrados.has(e.cnpj))

      if (empresasParaInserir.length > 0) {
        const { data: empData, error: empErr } = await supabase
          .from("empresas")
          .insert(empresasParaInserir)
          .select("id")
        if (empErr) throw new Error(`Empresas: ${empErr.message}`)
        empresaIds = [
          ...(empExistentes || []).map(e => e.id),
          ...(empData || []).map(e => e.id),
        ]
      } else {
        empresaIds = (empExistentes || []).map(e => e.id)
      }
      updateStep(0, { status: "done", count: empresaIds.length })

      // ── STEP 1: Instituições ──────────────────────────────────────────────
      updateStep(1, { status: "running" })

      const { data: instExistentes } = await supabase
        .from("instituicoes")
        .select("id, cnpj")
        .in("cnpj", INSTITUICOES_SEED.map(i => i.cnpj))

      const cnpjsInstCadastrados = new Set((instExistentes || []).map(i => i.cnpj))
      const instParaInserir = INSTITUICOES_SEED.filter(i => !cnpjsInstCadastrados.has(i.cnpj))

      if (instParaInserir.length > 0) {
        const { data: instData, error: instErr } = await supabase
          .from("instituicoes")
          .insert(instParaInserir)
          .select("id")
        if (instErr) throw new Error(`Instituições: ${instErr.message}`)
        instituicaoIds = [
          ...(instExistentes || []).map(i => i.id),
          ...(instData || []).map(i => i.id),
        ]
      } else {
        instituicaoIds = (instExistentes || []).map(i => i.id)
      }
      updateStep(1, { status: "done", count: instituicaoIds.length })

      // ── STEP 2: Lotes de doação ───────────────────────────────────────────
      updateStep(2, { status: "running" })

      // Enums válidos segundo o schema.sql
      const categoriasValidas = [
        "proteina",
        "graos_cereais",
        "fruta",
        "hortalica",
        "laticinio",
        "ultraprocessado",
        "outro",
      ] as const

      const statusesValidos = [
        "disponivel",
        "disponivel",
        "disponivel",
        "reservado",
        "entregue",
        "entregue",
      ] as const

      const armazenamentos = ["ambiente", "refrigerado", "congelado"] as const

      const titulosExemplo = [
        "Lote de Arroz e Feijão Orgânico",
        "Frutas Selecionadas da Estação",
        "Cortes de Frango Congelados",
        "Hortaliças e Legumes Frescos",
        "Leite Integral e Derivados",
        "Pães e Alimentos Processados",
        "Iogurtes e Queijos Pasteurizados",
        "Maçãs e Bananas Climatizadas",
      ]

      const hoje = new Date()
      const timestampBase = Date.now().toString().slice(-6)

      const lotes = Array.from({ length: 24 }, (_, i) => {
        const validade = new Date(hoje)
        validade.setDate(hoje.getDate() + Math.floor(Math.random() * 45) + 5)
        const categoria = categoriasValidas[i % categoriasValidas.length]
        const status = statusesValidos[i % statusesValidos.length]
        const empresaId = empresaIds[i % empresaIds.length]
        const armaz = armazenamentos[i % armazenamentos.length]
        const codigo = `FC-${hoje.getFullYear()}-${timestampBase}${String(i + 1).padStart(2, "0")}`

        return {
          empresa_id: empresaId,
          codigo_rastreio: codigo,
          titulo: titulosExemplo[i % titulosExemplo.length],
          tipo_alimento: categoria.replace(/_/g, " "),
          descricao: `Lote de ${categoria.replace(/_/g, " ")} para doação em conformidade com o PNCPDA — Demonstração PNCPDA TCC`,
          categoria,
          quantidade_kg: Math.round((Math.random() * 450 + 50) * 10) / 10,
          data_validade: validade.toISOString().split("T")[0],
          armazenamento: armaz,
          condicao_armazenamento: armaz,
          destino_recomendado: "humano" as const,
          destino: "humano",
          status,
          microcoleta: false,
          termo_aceite: true,
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
          empresas_cadastradas: empresaIds.length,
          instituicoes_cadastradas: instituicaoIds.length,
          lotes_gerados: (loteData || []).length,
          timestamp: new Date().toISOString(),
          origem: "Painel Admin → Seed Acadêmico",
        },
      })
      updateStep(3, { status: "done" })

      // ── STEP 4: Realtime broadcast ────────────────────────────────────────
      updateStep(4, { status: "running" })
      await broadcastMetricsUpdate()
      updateStep(4, { status: "done" })

      setDone(true)
      toast.success("🌱 Seed concluído com sucesso!", {
        description: `${empresaIds.length} empresas, ${instituicaoIds.length} instituições e ${(loteData || []).length} lotes prontos para a banca.`,
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
      await supabase.from("doacoes").delete().like("descricao", "%Demonstração PNCPDA TCC%")
      await supabase.from("instituicoes").delete().in("cnpj", INSTITUICOES_SEED.map(i => i.cnpj))
      await supabase.from("empresas").delete().in("cnpj", EMPRESAS_SEED.map(e => e.cnpj))
      await logAdminAudit({
        acao: "LIMPAR_SEED_DEMONSTRACAO",
        entidade: "seed",
        detalhes: { origem: "Painel Admin → Seed" },
      })
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
          Popula o banco com dados realistas de empresas, instituições e lotes de doação para apresentação do TCC. Todos os registros são marcados para fácil identificação e remoção posterior.
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
