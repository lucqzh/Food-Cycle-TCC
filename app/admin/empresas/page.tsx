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
  Building2, 
  Search, 
  Filter, 
  Award, 
  MapPin, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ShieldAlert,
  Edit,
  Download
} from "lucide-react"

interface EmpresaItem {
  id: number
  cnpj: string
  nome_fantasia: string | null
  razao_social: string
  cidade: string
  estado: string
  endereco: string
  selo_doador: boolean
  nivel_selo: string | null
  data_criacao: string
  total_doacoes?: number
  total_kg?: number
}

interface DoacaoResumida {
  id: number
  tipo_alimento: string
  quantidade_kg: number
  codigo_rastreio: string
  categoria: string
  status: string
  data_criacao: string
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<EmpresaItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroSelo, setFiltroSelo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  // Modal de Detalhes
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaItem | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [doacoesEmpresa, setDoacoesEmpresa] = useState<DoacaoResumida[]>([])
  const [carregandoDoacoes, setCarregandoDoacoes] = useState(false)

  // Modal de Edição de Selo
  const [modalSeloAberto, setModalSeloAberto] = useState(false)
  const [novoNivelSelo, setNovoNivelSelo] = useState<string>("aderente")
  const [salvandoSelo, setSalvandoSelo] = useState(false)

  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarEmpresas = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const [empRes, doacoesRes] = await Promise.all([
        supabase.from("empresas").select("*").order("id", { ascending: false }),
        supabase.from("doacoes").select("id, empresa_id, quantidade_kg")
      ])

      if (empRes.data) {
        const doacoesList = doacoesRes.data || []
        const enriquecidas: EmpresaItem[] = empRes.data.map((emp) => {
          const doacoesDaEmp = doacoesList.filter(d => d.empresa_id === emp.id)
          const kg = doacoesDaEmp.reduce((acc, d) => acc + Number(d.quantidade_kg || 0), 0)
          return {
            ...emp,
            total_doacoes: doacoesDaEmp.length,
            total_kg: kg
          }
        })
        setEmpresas(enriquecidas)
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarEmpresas()
  }, [])

  // Filtragem
  const empresasFiltradas = useMemo(() => {
    return empresas.filter((emp) => {
      const termo = busca.toLowerCase()
      const matchesBusca =
        emp.razao_social.toLowerCase().includes(termo) ||
        (emp.nome_fantasia && emp.nome_fantasia.toLowerCase().includes(termo)) ||
        emp.cnpj.includes(termo)

      const matchesSelo =
        filtroSelo === "todos" ||
        (filtroSelo === "com_selo" && emp.selo_doador) ||
        (filtroSelo === "sem_selo" && !emp.selo_doador) ||
        emp.nivel_selo === filtroSelo

      const matchesEstado =
        filtroEstado === "todos" || emp.estado.toUpperCase() === filtroEstado.toUpperCase()

      return matchesBusca && matchesSelo && matchesEstado
    })
  }, [empresas, busca, filtroSelo, filtroEstado])

  const estadosDisponiveis = useMemo(() => {
    const setUfs = new Set(empresas.map((e) => e.estado).filter(Boolean))
    return Array.from(setUfs).sort()
  }, [empresas])

  const abrirDetalhes = async (emp: EmpresaItem) => {
    setEmpresaSelecionada(emp)
    setModalDetalhesAberto(true)
    setCarregandoDoacoes(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("doacoes")
        .select("id, tipo_alimento, quantidade_kg, codigo_rastreio, categoria, status, data_criacao")
        .eq("empresa_id", emp.id)
        .order("id", { ascending: false })
      setDoacoesEmpresa(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setCarregandoDoacoes(false)
    }
  }

  const abrirEdicaoSelo = (emp: EmpresaItem) => {
    setEmpresaSelecionada(emp)
    setNovoNivelSelo(emp.nivel_selo || "aderente")
    setModalSeloAberto(true)
  }

  const salvarSelo = async () => {
    if (!empresaSelecionada) return
    setSalvandoSelo(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("empresas")
        .update({
          selo_doador: true,
          nivel_selo: novoNivelSelo,
          data_validade_selo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
        })
        .eq("id", empresaSelecionada.id)

      if (error) throw error

      // Grava log de auditoria
      const { data: auth } = await supabase.auth.getUser()
      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "ATUALIZAR_SELO_PNCPDA",
        entidade: "empresas",
        entidade_id: String(empresaSelecionada.id),
        detalhes: {
          empresa: empresaSelecionada.razao_social,
          novo_nivel: novoNivelSelo,
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Selo PNCPDA da empresa ${empresaSelecionada.razao_social} atualizado para "${novoNivelSelo.toUpperCase()}".`
      })

      setModalSeloAberto(false)
      await carregarEmpresas()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: `Falha ao salvar selo: ${err.message}` })
    } finally {
      setSalvandoSelo(false)
    }
  }

  const exportarCSV = () => {
    if (empresasFiltradas.length === 0) return
    const header = "ID,CNPJ,Razao Social,Nome Fantasia,Cidade,Estado,Selo Doador,Nivel Selo,Doacoes,Total Kg\n"
    const rows = empresasFiltradas.map(e => 
      `${e.id},"${e.cnpj}","${e.razao_social}","${e.nome_fantasia || ''}","${e.cidade}","${e.estado}",${e.selo_doador ? 'SIM' : 'NAO'},"${e.nivel_selo || 'nenhum'}",${e.total_doacoes || 0},${e.total_kg || 0}`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-empresas-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Empresas Doadoras</h1>
          <p className="text-muted-foreground">
            Gestão regulatória, concessão de Selos PNCPDA e histórico de conformidade.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={empresasFiltradas.length === 0}>
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

      {/* Filtros e Busca */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por Razão Social, Nome Fantasia ou CNPJ..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroSelo} onValueChange={setFiltroSelo}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Selo PNCPDA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Selos</SelectItem>
                <SelectItem value="com_selo">Com Selo Ativo</SelectItem>
                <SelectItem value="sem_selo">Sem Selo</SelectItem>
                <SelectItem value="ouro">Nível Ouro</SelectItem>
                <SelectItem value="prata">Nível Prata</SelectItem>
                <SelectItem value="aderente">Nível Aderente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full md:w-36">
                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Estado (UF)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estados</SelectItem>
                {estadosDisponiveis.map(uf => (
                  <SelectItem key={uf} value={uf}>{uf.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Empresas */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Empresas Cadastradas ({empresasFiltradas.length})</CardTitle>
            <button onClick={carregarEmpresas} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando empresas do banco...</div>
          ) : empresasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhuma empresa encontrada com os filtros aplicados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Empresa</th>
                    <th className="pb-3">CNPJ</th>
                    <th className="pb-3">Localização</th>
                    <th className="pb-3">Selo PNCPDA</th>
                    <th className="pb-3 text-right">Doações</th>
                    <th className="pb-3 text-right">Volume (kg)</th>
                    <th className="pb-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {empresasFiltradas.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-foreground">{emp.nome_fantasia || emp.razao_social}</div>
                        {emp.nome_fantasia && (
                          <div className="text-xs text-muted-foreground">{emp.razao_social}</div>
                        )}
                      </td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">{emp.cnpj}</td>
                      <td className="py-3 text-muted-foreground">{emp.cidade}/{emp.estado}</td>
                      <td className="py-3">
                        {emp.selo_doador ? (
                          <Badge variant="outline" className={`capitalize text-xs font-semibold ${
                            emp.nivel_selo === 'ouro' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                            emp.nivel_selo === 'prata' ? 'border-slate-400 text-slate-400 bg-slate-400/10' :
                            'border-primary text-primary bg-primary/10'
                          }`}>
                            <Award className="h-3 w-3 mr-1" />
                            {emp.nivel_selo || "Aderente"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem selo</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-medium text-foreground">{emp.total_doacoes}</td>
                      <td className="py-3 text-right font-medium text-primary">{(emp.total_kg || 0).toLocaleString("pt-BR")} kg</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => abrirDetalhes(emp)} title="Ver Detalhes">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => abrirEdicaoSelo(emp)} title="Atribuir Selo">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes da Empresa */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{empresaSelecionada?.nome_fantasia || empresaSelecionada?.razao_social}</DialogTitle>
            <DialogDescription>CNPJ: {empresaSelecionada?.cnpj}</DialogDescription>
          </DialogHeader>

          {empresaSelecionada && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Razão Social:</span>
                  <p className="font-semibold">{empresaSelecionada.razao_social}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Endereço:</span>
                  <p className="font-semibold">{empresaSelecionada.endereco}, {empresaSelecionada.cidade}/{empresaSelecionada.estado}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Selo Doador:</span>
                  <p className="font-semibold capitalize">{empresaSelecionada.selo_doador ? `Ativo (${empresaSelecionada.nivel_selo})` : "Não aderente"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Data de Adesão:</span>
                  <p className="font-semibold">{new Date(empresaSelecionada.data_criacao).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Lotes de Alimentos Doados ({doacoesEmpresa.length})
                </h4>
                {carregandoDoacoes ? (
                  <p className="text-xs text-muted-foreground">Carregando histórico...</p>
                ) : doacoesEmpresa.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma doação cadastrada por esta empresa.</p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="p-2">Rastreio</th>
                          <th className="p-2">Alimento</th>
                          <th className="p-2">Quantidade</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {doacoesEmpresa.map(d => (
                          <tr key={d.id}>
                            <td className="p-2 font-mono font-semibold text-primary">{d.codigo_rastreio}</td>
                            <td className="p-2 font-medium">{d.tipo_alimento}</td>
                            <td className="p-2">{d.quantidade_kg} kg</td>
                            <td className="p-2 capitalize">{d.status}</td>
                            <td className="p-2 text-muted-foreground">{new Date(d.data_criacao).toLocaleDateString("pt-BR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalDetalhesAberto(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Concessão de Selo PNCPDA */}
      <Dialog open={modalSeloAberto} onOpenChange={setModalSeloAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conceder / Atualizar Selo PNCPDA</DialogTitle>
            <DialogDescription>
              Certificação de conformidade com a Lei nº 15.224/2025 para {empresaSelecionada?.razao_social}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Nível do Selo de Doação
              </label>
              <Select value={novoNivelSelo} onValueChange={setNovoNivelSelo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aderente">Aderente PNCPDA (Regularidade básica)</SelectItem>
                  <SelectItem value="prata">Prata (Diversidade e rastreabilidade comprovada)</SelectItem>
                  <SelectItem value="ouro">Ouro (Alto volume e destinação contínua)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              A concessão do selo habilita a empresa aos incentivos de boas práticas fiscais e institucionais previstos na Política Nacional.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalSeloAberto(false)} disabled={salvandoSelo}>Cancelar</Button>
            <Button onClick={salvarSelo} disabled={salvandoSelo}>
              {salvandoSelo ? "Salvando..." : "Confirmar e Registrar Auditoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
