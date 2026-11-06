"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  Package, 
  MapPin, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

const categorias = [
  { value: "todas", label: "Todas as Categorias" },
  { value: "fruta", label: "Frutas" },
  { value: "hortalica", label: "Hortaliças e Legumes" },
  { value: "graos_cereais", label: "Grãos e Cereais" },
  { value: "proteina", label: "Proteínas" },
  { value: "laticinio", label: "Laticínios" },
  { value: "ultraprocessado", label: "Processados" },
  { value: "outro", label: "Outros" }
]

const categoriaNomes: Record<string, string> = {
  fruta: "Frutas",
  hortalica: "Hortaliças",
  graos_cereais: "Grãos e Cereais",
  proteina: "Proteínas",
  laticinio: "Laticínios",
  ultraprocessado: "Processados",
  outro: "Outros"
}

interface DoacaoItem {
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
  empresa_id: number
  empresas?: {
    id: number
    nome_fantasia: string | null
    razao_social: string
    cidade: string
    estado: string
  } | null
}

export default function DoacoesPage() {
  const [doacoes, setDoacoes] = useState<DoacaoItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [selectedDoacao, setSelectedDoacao] = useState<DoacaoItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mensagemSolicitacao, setMensagemSolicitacao] = useState("")
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarDoacoes = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
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
          descricao,
          microcoleta,
          status,
          empresa_id,
          empresas (
            id,
            nome_fantasia,
            razao_social,
            cidade,
            estado
          )
        `)
        .order("id", { ascending: false })

      if (error) {
        console.error("Erro ao listar doações:", error)
      } else if (data) {
        setDoacoes(data as unknown as DoacaoItem[])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDoacoes()
  }, [])

  const filteredDoacoes = doacoes.filter((doacao) => {
    const nomeEmpresa = doacao.empresas?.nome_fantasia || doacao.empresas?.razao_social || ""
    const matchesSearch =
      doacao.tipo_alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doacao.codigo_rastreio && doacao.codigo_rastreio.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategoria =
      categoria === "todas" || doacao.categoria.toLowerCase() === categoria.toLowerCase()

    return matchesSearch && matchesCategoria
  })

  const handleSolicitar = (doacao: DoacaoItem) => {
    setSelectedDoacao(doacao)
    setMensagemSolicitacao("")
    setDialogOpen(true)
  }

  const confirmSolicitar = async () => {
    if (!selectedDoacao) return
    setEnviandoSolicitacao(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        setAviso({ tipo: "erro", texto: "Você precisa estar conectado para solicitar." })
        setDialogOpen(false)
        return
      }

      const { data: inst, error: instError } = await supabase
        .from("instituicoes")
        .select("id")
        .eq("perfil_id", authData.user.id)
        .maybeSingle()

      if (instError || !inst) {
        setAviso({
          tipo: "erro",
          texto: "Apenas contas de Instituição Receptora podem solicitar doações. Complete seu cadastro como instituição."
        })
        setDialogOpen(false)
        return
      }

      const { error: solError } = await supabase.from("solicitacoes").insert({
        instituicao_id: inst.id,
        doacao_id: selectedDoacao.id,
        status: "pendente",
        mensagem: mensagemSolicitacao.trim() || "Solicitação realizada via plataforma FoodCycle",
      })

      if (solError) {
        setAviso({ tipo: "erro", texto: `Erro ao enviar solicitação: ${solError.message}` })
      } else {
        setAviso({ tipo: "sucesso", texto: `Solicitação registrada com sucesso para ${selectedDoacao.tipo_alimento}!` })
      }
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: e.message || "Erro inesperado ao solicitar doação." })
    } finally {
      setEnviandoSolicitacao(false)
      setDialogOpen(false)
    }
  }

  const getCategoriaBadge = (cat: string) => {
    const badges: Record<string, string> = {
      fruta: "bg-emerald-950 text-emerald-300 border-emerald-800/40",
      hortalica: "bg-green-950 text-green-300 border-green-800/40",
      graos_cereais: "bg-amber-950 text-amber-300 border-amber-800/40",
      proteina: "bg-red-950 text-red-300 border-red-800/40",
      laticinio: "bg-blue-950 text-blue-300 border-blue-800/40",
      ultraprocessado: "bg-purple-950 text-purple-300 border-purple-800/40",
      outro: "bg-slate-900 text-slate-300 border-slate-700/40"
    }
    return badges[cat] || "bg-slate-900 text-slate-300 border-slate-700/40"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 mb-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Lotes Ativos para Redistribuição
          </div>
          <h1 className="text-3xl font-extrabold text-white font-serif">Doações Disponíveis</h1>
          <p className="text-xs text-slate-400">
            Alimentos cadastrados por empresas doadoras em conformidade com a PNCPDA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarDoacoes}
            className="h-10 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${carregando ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button asChild className="h-10 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/60 cursor-pointer">
            <Link href="/dashboard/nova-doacao">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Cadastrar Doação
            </Link>
          </Button>
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

      {/* Filtros */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-4 backdrop-blur shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por alimento, empresa doadora ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full sm:w-60 h-10 bg-[#0A241F]/70 border-emerald-900/60 text-white rounded-xl">
              <Filter className="mr-2 h-4 w-4 text-emerald-400" />
              <SelectValue placeholder="Categoria Nutricional" />
            </SelectTrigger>
            <SelectContent className="bg-[#071B17] border-emerald-900 text-white">
              {categorias.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="focus:bg-emerald-950 focus:text-white">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listagem */}
      {carregando ? (
        <div className="flex min-h-[300px] items-center justify-center font-mono text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
          Consultando lotes ativos no Supabase...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoacoes.map((doacao) => {
            const empresaNome =
              doacao.empresas?.nome_fantasia ||
              doacao.empresas?.razao_social ||
              "Empresa Doadora"
            const local =
              doacao.empresas?.cidade && doacao.empresas?.estado
                ? `${doacao.empresas.cidade}/${doacao.empresas.estado}`
                : "Local a combinar"

            return (
              <div
                key={doacao.id}
                className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/70 to-[#071B17]/90 p-5 backdrop-blur shadow-xl hover:border-emerald-800/60 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {doacao.tipo_alimento}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <Building2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        {empresaNome}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getCategoriaBadge(doacao.categoria)}`}>
                      {categoriaNomes[doacao.categoria] || doacao.categoria}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#071B17]/60 border border-emerald-950/40 text-slate-300">
                      <Package className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono font-bold text-white">{doacao.quantidade_kg} kg</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#071B17]/60 border border-emerald-950/40 text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono">{new Date(doacao.data_validade).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-slate-400 text-[11px] px-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{local}</span>
                    </div>
                  </div>

                  {doacao.descricao && (
                    <p className="text-xs text-slate-400 line-clamp-2 px-1 leading-relaxed">
                      {doacao.descricao}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-950/60 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>ID: <strong className="text-slate-300">{doacao.codigo_rastreio}</strong></span>
                    <span className={`px-2 py-0.2 rounded-full uppercase text-[9px] font-bold ${
                      doacao.status === "disponivel"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                        : "bg-amber-950 text-amber-400 border border-amber-800/40"
                    }`}>
                      {doacao.status}
                    </span>
                  </div>

                  <Button
                    className={`w-full h-10 font-bold text-xs cursor-pointer ${
                      doacao.status === "disponivel"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-[#071B17]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                    onClick={() => handleSolicitar(doacao)}
                    disabled={doacao.status !== "disponivel"}
                  >
                    {doacao.status === "disponivel" ? (
                      <>
                        Solicitar Este Lote
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </>
                    ) : (
                      `Status: ${doacao.status}`
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!carregando && filteredDoacoes.length === 0 && (
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-12 text-center max-w-md mx-auto space-y-3">
          <Package className="h-12 w-12 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum lote disponível encontrado</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nenhum lote corresponde aos filtros informados. Você pode publicar um novo lote como empresa ou limpar o filtro.
          </p>
        </div>
      )}

      {/* Modal de Solicitação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#071B17] border-emerald-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white font-serif">Solicitar Lote de Alimentos</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Sua instituição registrará um pedido oficial de recebimento sob a Lei nº 15.224/2025.
            </DialogDescription>
          </DialogHeader>

          {selectedDoacao && (
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0A241F]/60 border border-emerald-950 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Alimento:</span>
                  <span className="font-bold text-white">{selectedDoacao.tipo_alimento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantidade:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedDoacao.quantidade_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Empresa Doadora:</span>
                  <span className="text-slate-200">
                    {selectedDoacao.empresas?.nome_fantasia || selectedDoacao.empresas?.razao_social || "Empresa"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mensagem / Justificativa para a Empresa:
                </label>
                <Textarea
                  placeholder="Ex: Somos uma entidade que atende 60 famílias no bairro..."
                  value={mensagemSolicitacao}
                  onChange={(e) => setMensagemSolicitacao(e.target.value)}
                  rows={3}
                  className="bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={enviandoSolicitacao} className="border-emerald-950 text-slate-300">
              Cancelar
            </Button>
            <Button
              onClick={confirmSolicitar}
              disabled={enviandoSolicitacao}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold"
            >
              {enviandoSolicitacao ? "Enviando..." : "Confirmar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
