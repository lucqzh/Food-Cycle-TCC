"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"
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
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Heart,
  Edit,
  Crown,
  Lock
} from "lucide-react"

interface UserProfileItem {
  id: string
  email: string
  nome: string
  tipo: "empresa" | "instituicao" | "intermediario" | "admin"
  created_at: string
  organizacao_vinculada?: string | null
}

const roleColors: Record<string, string> = {
  admin: "border-purple-500 text-purple-600 bg-purple-500/10",
  empresa: "border-primary text-primary bg-primary/10",
  instituicao: "border-secondary text-secondary bg-secondary/10",
  intermediario: "border-accent text-accent bg-accent/10"
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UserProfileItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [isCurrentUserMaster, setIsCurrentUserMaster] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UserProfileItem | null>(null)
  const [modalRoleAberto, setModalRoleAberto] = useState(false)
  const [novoTipo, setNovoTipo] = useState<string>("empresa")
  const [salvandoRole, setSalvandoRole] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null)

  const carregarUsuarios = async () => {
    setCarregando(true)
    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()
      const email = authData.user?.email || ""
      setCurrentUserEmail(email)
      const isMaster = email.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
      setIsCurrentUserMaster(isMaster)

      const [profilesRes, empresasRes, instRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("empresas").select("perfil_id, razao_social, nome_fantasia"),
        supabase.from("instituicoes").select("perfil_id, razao_social")
      ])

      const profiles = profilesRes.data || []
      const empresas = empresasRes.data || []
      const insts = instRes.data || []

      const enriquecidos: UserProfileItem[] = profiles.map(p => {
        let org: string | null = null
        const emp = empresas.find(e => e.perfil_id === p.id)
        if (emp) org = emp.nome_fantasia || emp.razao_social
        const inst = insts.find(i => i.perfil_id === p.id)
        if (inst) org = inst.razao_social

        return {
          ...p,
          organizacao_vinculada: org
        }
      })

      setUsuarios(enriquecidos)
    } catch (e: any) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const termo = busca.toLowerCase()
      const matchesBusca =
        (u.email && u.email.toLowerCase().includes(termo)) ||
        (u.nome && u.nome.toLowerCase().includes(termo)) ||
        (u.organizacao_vinculada && u.organizacao_vinculada.toLowerCase().includes(termo))

      const matchesTipo = filtroTipo === "todos" || u.tipo === filtroTipo

      return matchesBusca && matchesTipo
    })
  }, [usuarios, busca, filtroTipo])

  const abrirAlterarRole = (u: UserProfileItem) => {
    const isTargetMaster = u.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
    if (isTargetMaster && !isCurrentUserMaster) {
      setAviso({ tipo: "erro", texto: "Você não tem autorização para alterar a conta do Administrador Mestre." })
      return
    }
    setUsuarioSelecionado(u)
    setNovoTipo(u.tipo)
    setModalRoleAberto(true)
  }

  const salvarRole = async () => {
    if (!usuarioSelecionado) return
    setSalvandoRole(true)
    setAviso(null)

    try {
      const supabase = createClient()
      const { data: auth } = await supabase.auth.getUser()

      // 1. Validação de Administrador Mestre: SOMENTE o email mestre pode atribuir papel de admin
      if (novoTipo === "admin" && !isCurrentUserMaster) {
        throw new Error("Apenas o Administrador Mestre (Dono do Sistema) pode conceder privilégios de Administrador.")
      }

      // 2. Apenas o Mestre pode alterar o cargo de quem já é admin
      if (usuarioSelecionado.tipo === "admin" && !isCurrentUserMaster) {
        throw new Error("Apenas o Administrador Mestre pode alterar ou revogar a função de um Administrador.")
      }

      // 3. Ninguém pode remover o status de admin da conta Mestre
      if (usuarioSelecionado.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase() && novoTipo !== "admin") {
        throw new Error("A conta do Administrador Mestre não pode ter seu cargo alterado.")
      }

      // 4. Não permite auto-remoção acidental
      if (usuarioSelecionado.id === auth.user?.id && novoTipo !== "admin") {
        throw new Error("Você não pode remover seus próprios privilégios de administrador.")
      }

      const { error } = await supabase
        .from("profiles")
        .update({ tipo: novoTipo })
        .eq("id", usuarioSelecionado.id)

      if (error) throw error

      // Registra no log de auditoria
      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "ALTERAR_PAPEL_USUARIO",
        entidade: "profiles",
        entidade_id: usuarioSelecionado.id,
        detalhes: {
          alvo_email: usuarioSelecionado.email,
          papel_anterior: usuarioSelecionado.tipo,
          papel_novo: novoTipo,
          executado_pelo_mestre: isCurrentUserMaster
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Perfil de ${usuarioSelecionado.email} alterado para "${novoTipo.toUpperCase()}".`
      })
      setModalRoleAberto(false)
      await carregarUsuarios()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: err.message || "Erro ao atualizar permissão." })
    } finally {
      setSalvandoRole(false)
    }
  }

  const exportarCSV = () => {
    if (usuariosFiltrados.length === 0) return
    const header = "ID,Email,Nome,Papel (Tipo),Organizacao Vinculada,Data Criacao\n"
    const rows = usuariosFiltrados.map(u => 
      `"${u.id}","${u.email}","${u.nome || ''}","${u.tipo}","${u.organizacao_vinculada || 'Nao vinculado'}","${u.created_at || ''}"`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foodcycle-usuarios-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Usuários & Permissões</span>
            {isCurrentUserMaster && (
              <Badge className="bg-amber-500 text-white font-semibold text-xs flex items-center gap-1">
                <Crown className="h-3 w-3" /> Dono do Sistema
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Controle de identidades, hierarquia de acesso e governança de contas do FoodCycle.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportarCSV} disabled={usuariosFiltrados.length === 0}>
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

      {/* Banner explicativo de hierarquia */}
      <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Hierarquia Mestre:</span>{" "}
            <span className="text-muted-foreground">
              Somente a conta proprietária <strong className="text-foreground font-mono">{ADMIN_MASTER_EMAIL}</strong> possui permissão para nomear ou destituir administradores.
            </span>
          </div>
        </div>
        <div>
          {isCurrentUserMaster ? (
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              Sua sessão: Autoridade Mestre Ativa
            </Badge>
          ) : (
            <Badge variant="outline" className="border-muted text-muted-foreground">
              Sua sessão: Administrador Regular (Somente Leitura de Cargos)
            </Badge>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por Email, Nome ou Organização vinculada..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Papéis</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="empresa">Empresa Doadora</SelectItem>
                <SelectItem value="instituicao">Instituição</SelectItem>
                <SelectItem value="intermediario">Intermediário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Usuários Registrados ({usuariosFiltrados.length})</CardTitle>
            <button onClick={carregarUsuarios} className="text-xs text-primary hover:underline">Atualizar</button>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando usuários do sistema...</div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-3">Usuário</th>
                    <th className="pb-3">Papel / Função</th>
                    <th className="pb-3">Organização Vinculada</th>
                    <th className="pb-3">Data de Registro</th>
                    <th className="pb-3 text-center">Permissões</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usuariosFiltrados.map((u) => {
                    const isMaster = u.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
                    const isTargetAdmin = u.tipo === "admin"
                    const canEditThisUser = isCurrentUserMaster || (!isTargetAdmin && !isMaster)

                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {u.nome || "Usuário"}
                            {isMaster && (
                              <Badge className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-1">
                                <Crown className="h-3 w-3" /> Dono
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">{u.email}</div>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className={`capitalize text-xs font-semibold ${roleColors[u.tipo] || "border-muted"}`}>
                            {u.tipo}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {u.organizacao_vinculada || "Nenhuma organização associada"}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="py-3 text-center">
                          {isMaster ? (
                            <span className="text-xs text-muted-foreground flex items-center justify-center gap-1" title="Cargo fixo do Dono">
                              <Lock className="h-3.5 w-3.5 text-amber-500" />
                            </span>
                          ) : canEditThisUser ? (
                            <Button size="sm" variant="ghost" onClick={() => abrirAlterarRole(u)} title="Alterar Papel">
                              <Edit className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center justify-center gap-1" title="Apenas o Dono pode editar Administradores">
                              <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
                            </span>
                          )}
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

      {/* Modal Alterar Role */}
      <Dialog open={modalRoleAberto} onOpenChange={setModalRoleAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Gerenciar Papel de Acesso</span>
            </DialogTitle>
            <DialogDescription>
              Ajuste de função e privilégios para <strong className="text-foreground">{usuarioSelecionado?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Função do Usuário
              </label>
              <Select value={novoTipo} onValueChange={setNovoTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa">Empresa Doadora</SelectItem>
                  <SelectItem value="instituicao">Instituição Receptora</SelectItem>
                  <SelectItem value="intermediario">Intermediário Logístico</SelectItem>
                  {isCurrentUserMaster ? (
                    <SelectItem value="admin" className="font-semibold text-purple-600">
                      👑 Administrador Geral
                    </SelectItem>
                  ) : (
                    <SelectItem value="admin" disabled className="text-muted-foreground opacity-50">
                      🔒 Administrador Geral (Exclusivo Dono)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {isCurrentUserMaster ? (
              <div className="rounded-lg bg-purple-500/10 p-3 text-xs text-purple-600 border border-purple-500/20 flex items-start gap-2">
                <Crown className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Autoridade Mestre:</strong> Como dono da plataforma, você tem permissão exclusiva para nomear novos administradores ou ajustar qualquer papel de acesso.
                </span>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-600 border border-amber-500/20 flex items-start gap-2">
                <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Restrição de Hierarquia:</strong> Apenas o Administrador Mestre ({ADMIN_MASTER_EMAIL}) pode conceder ou revogar privilégios administrativos.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalRoleAberto(false)} disabled={salvandoRole}>Cancelar</Button>
            <Button onClick={salvarRole} disabled={salvandoRole}>
              {salvandoRole ? "Atualizando..." : "Confirmar Alteração"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
