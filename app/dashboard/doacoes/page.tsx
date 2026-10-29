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
  Clock, 
  MapPin, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

const categorias = [
  { value: "todas", label: "Todas as categorias" },
  { value: "fruta", label: "Frutas" },
  { value: "hortalica", label: "Hortaliças e Legumes" },
  { value: "graos_cereais", label: "Grãos e Cereais" },
  { value: "proteina", label: "Proteínas" },
  { value: "laticinio", label: "Laticínios" },
  { value: "ultraprocessado", label: "Ultraprocessados" },
  { value: "outro", label: "Outros" }
]

const categoriaNomes: Record<string, string> = {
  fruta: "Frutas",
  hortalica: "Hortaliças",
  graos_cereais: "Grãos e Cereais",
  proteina: "Proteínas",
  laticinio: "Laticínios",
  ultraprocessado: "Ultraprocessados",
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

      // Procura se o usuário atual é uma instituição
      const { data: inst, error: instError } = await supabase
        .from("instituicoes")
        .select("id")
        .eq("perfil_id", authData.user.id)
        .maybeSingle()

      if (instError || !inst) {
        setAviso({
          tipo: "erro",
          texto: "Apenas contas de Instituição Receptora podem solicitar doações. Complete o perfil correspondente."
        })
        setDialogOpen(false)
        return
      }

      // Registra a solicitação no banco
      const { error: solError } = await supabase.from("solicitacoes").insert({
        instituicao_id: inst.id,
        doacao_id: selectedDoacao.id,
        status: "pendente",
        mensagem: mensagemSolicitacao.trim() || "Solicitação realizada via plataforma FoodCycle",
      })

      if (solError) {
        setAviso({ tipo: "erro", texto: `Erro ao enviar solicitação: ${solError.message}` })
      } else {
        setAviso({ tipo: "sucesso", texto: `Solicitação enviada com sucesso para ${selectedDoacao.tipo_alimento}!` })
      }
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: e.message || "Erro inesperado ao solicitar doação." })
    } finally {
      setEnviandoSolicitacao(false)
      setDialogOpen(false)
    }
  }

  const getCategoriaColor = (cat: string) => {
    const colors: Record<string, string> = {
      fruta: "bg-chart-1/10 text-chart-1",
      hortalica: "bg-chart-2/10 text-chart-2",
      graos_cereais: "bg-chart-3/10 text-chart-3",
      proteina: "bg-chart-4/10 text-chart-4",
      laticinio: "bg-chart-5/10 text-chart-5",
      ultraprocessado: "bg-accent/15 text-accent",
      outro: "bg-muted text-muted-foreground"
    }
    return colors[cat] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doações Disponíveis</h1>
          <p className="text-muted-foreground">
            Alimentos cadastrados para doação em conformidade com a PNCPDA
          </p>
        </div>
        <Button asChild className="gap-2 bg-primary text-primary-foreground">
          <Link href="/dashboard/nova-doacao">
            <PlusCircle className="h-4 w-4" />
            Cadastrar doação
          </Link>
        </Button>
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

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por alimento, empresa ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-full sm:w-56">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredDoacoes.length} doação(ões) encontrada(s)</span>
        <button
          onClick={carregarDoacoes}
          className="text-primary hover:underline focus:outline-none"
        >
          Atualizar lista
        </button>
      </div>

      {carregando ? (
        <div className="flex min-h-[250px] items-center justify-center text-muted-foreground">
          Carregando doações do banco de dados...
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
              <Card key={doacao.id} className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg text-foreground">{doacao.tipo_alimento}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" />
                        {empresaNome}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoriaColor(doacao.categoria)}>
                      {categoriaNomes[doacao.categoria] || doacao.categoria}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4 shrink-0" />
                      <span>{doacao.quantidade_kg} kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{new Date(doacao.data_validade).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{local}</span>
                    </div>
                  </div>

                  {doacao.descricao && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {doacao.descricao}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border">
                    <span>Rastreio: <strong className="text-foreground">{doacao.codigo_rastreio}</strong></span>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {doacao.status}
                    </Badge>
                  </div>

                  <Button 
                    className="w-full mt-2" 
                    onClick={() => handleSolicitar(doacao)}
                    disabled={doacao.status !== "disponivel"}
                  >
                    {doacao.status === "disponivel" ? "Solicitar Doação" : `Status: ${doacao.status}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!carregando && filteredDoacoes.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">Nenhuma doação cadastrada no momento</p>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              Assim que uma empresa cadastrar um lote de alimento na tela de Nova Doação, ele aparecerá aqui para as instituições receptoras.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/nova-doacao">Cadastrar primeiro lote de doação</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Doação</DialogTitle>
            <DialogDescription>
              Você está prestes a registrar um pedido para este lote de alimento:
            </DialogDescription>
          </DialogHeader>

          {selectedDoacao && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Alimento:</span>
                <span className="font-semibold text-foreground">{selectedDoacao.tipo_alimento}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Quantidade:</span>
                <span className="font-semibold text-foreground">{selectedDoacao.quantidade_kg} kg</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Doador:</span>
                <span className="font-semibold text-foreground">
                  {selectedDoacao.empresas?.nome_fantasia || selectedDoacao.empresas?.razao_social || "Empresa"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Validade:</span>
                <span className="font-semibold text-foreground">
                  {new Date(selectedDoacao.data_validade).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-foreground">
                  Mensagem / Justificativa para a empresa:
                </label>
                <Textarea
                  placeholder="Ex: Somos uma entidade que atende 50 famílias..."
                  value={mensagemSolicitacao}
                  onChange={(e) => setMensagemSolicitacao(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={enviandoSolicitacao}>
              Cancelar
            </Button>
            <Button onClick={confirmSolicitar} disabled={enviandoSolicitacao}>
              {enviandoSolicitacao ? "Enviando..." : "Confirmar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
