"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"
import { listarUsuariosAdmin, UserProfileItem } from "./actions"
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
  Download, 
  CheckCircle2, 
  AlertCircle,
  Edit,
  Crown,
  Lock,
  RefreshCw,
  Sparkles
} from "lucide-react"

const roleColors: Record<string, string> = {
  admin: "border-purple-500/40 text-purple-300 bg-purple-950/60",
  empresa: "border-emerald-500/40 text-emerald-300 bg-emerald-950/60",
  instituicao: "border-amber-500/40 text-amber-300 bg-amber-950/60",
  intermediario: "border-blue-500/40 text-blue-300 bg-blue-950/60"
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

      // Busca através da Server Action para garantir acesso seguro com autoridade administrativa
      const { usuarios: lista, erro } = await listarUsuariosAdmin()

      if (erro) {
        setAviso({ tipo: "erro", texto: `Falha ao carregar lista de usuários: ${erro}` })
      } else {
        setUsuarios(lista)
      }
    } catch (e: any) {
      console.error(e)
      setAviso({ tipo: "erro", texto: e.message || "Erro inesperado ao consultar usuários." })
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

      if (novoTipo === "admin" && !isCurrentUserMaster) {
        throw new Error("Apenas o Administrador Mestre (Dono do Sistema) pode conceder privilégios de Administrador.")
      }

      if (usuarioSelecionado.tipo === "admin" && !isCurrentUserMaster) {
        throw new Error("Apenas o Administrador Mestre pode alterar ou revogar a função de um Administrador.")
      }

      if (usuarioSelecionado.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase() && novoTipo !== "admin") {
        throw new Error("A conta do Administrador Mestre não pode ter seu cargo alterado.")
      }

      if (usuarioSelecionado.id === auth.user?.id && novoTipo !== "admin") {
        throw new Error("Você não pode remover seus próprios privilégios de administrador.")
      }

      const { error } = await supabase
        .from("profiles")
        .update({ tipo: novoTipo })
        .eq("id", usuarioSelecionado.id)

      if (error) throw error

      await supabase.from("admin_audit_logs").insert({
        admin_id: auth.user?.id,
        admin_email: auth.user?.email || "admin",
        acao: "ALTERAR_PAPEL_USUARIO",
        entidade: "profiles",
        entidade_id: usuarioSelecionado.id,
        detalhes: {
          usuario_afetado: usuarioSelecionado.email,
          papel_anterior: usuarioSelecionado.tipo,
          papel_novo: novoTipo,
          executado_por_mestre: isCurrentUserMaster,
        }
      })

      setAviso({
        tipo: "sucesso",
        texto: `Papel de "${usuarioSelecionado.nome || usuarioSelecionado.email}" alterado para "${novoTipo.toUpperCase()}" com sucesso.`
      })

      setModalRoleAberto(false)
      await carregarUsuarios()
    } catch (err: any) {
      setAviso({ tipo: "erro", texto: err.message || "Erro ao salvar alteração de papel." })
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-emerald-950/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800/40 text-[10px] font-mono text-purple-300 mb-1">
            <ShieldCheck className="h-3 w-3 text-purple-400" />
            Controle de Identidades & Acessos
          </div>
          <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-2">
            <span>Usuários & Permissões</span>
            {isCurrentUserMaster && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold uppercase flex items-center gap-1">
                <Crown className="h-3 w-3" /> Dono do Sistema
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400">
            Controle de identidades, hierarquia de acesso e governança de contas do FoodCycle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarUsuarios}
            className="h-10 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${carregando ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            className="h-10 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white text-xs gap-1.5"
            onClick={exportarCSV}
            disabled={usuariosFiltrados.length === 0}
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {aviso && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
          aviso.tipo === "sucesso"
            ? "bg-emerald-950/80 text-emerald-200 border border-emerald-800/80"
            : "bg-red-950/80 text-red-200 border border-red-800/80"
        }`}>
          {aviso.tipo === "sucesso" ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
          <span>{aviso.texto}</span>
        </div>
      )}

      {/* Banner explicativo de hierarquia */}
      <div className="p-4 rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white">Hierarquia Mestre:</span>{" "}
            <span className="text-slate-400">
              Somente a conta proprietária <strong className="text-emerald-400 font-mono">{ADMIN_MASTER_EMAIL}</strong> possui permissão para nomear ou destituir administradores.
            </span>
          </div>
        </div>
        <div>
          {isCurrentUserMaster ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono border border-emerald-500/40 text-emerald-300 bg-emerald-950/60 font-bold uppercase">
              Autoridade Mestre Ativa
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono border border-slate-700 text-slate-400 bg-slate-900/60">
              Administrador Regular (Somente Leitura de Cargos)
            </span>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-4 backdrop-blur shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Pesquisar por email, nome ou organização vinculada..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-10 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 rounded-xl text-xs"
            />
          </div>

          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-full sm:w-56 h-10 bg-[#0A241F]/70 border-emerald-900/60 text-white rounded-xl text-xs">
              <Filter className="h-3.5 w-3.5 mr-2 text-emerald-400" />
              <SelectValue placeholder="Filtrar por Papel" />
            </SelectTrigger>
            <SelectContent className="bg-[#071B17] border-emerald-900 text-white text-xs">
              <SelectItem value="todos">Todos os Papéis</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="empresa">Empresa Doadora</SelectItem>
              <SelectItem value="instituicao">Instituição Receptora</SelectItem>
              <SelectItem value="intermediario">Intermediário Logístico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Usuários Registrados ({usuariosFiltrados.length})
          </h3>
          <button onClick={carregarUsuarios} className="text-xs text-emerald-400 hover:underline">
            Recarregar Lista
          </button>
        </div>

        {carregando ? (
          <div className="py-12 text-center text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Consultando perfis de usuários no Supabase...
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Nenhum usuário encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-emerald-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A241F]/60 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-emerald-950">
                <tr>
                  <th className="py-3.5 px-4">Usuário</th>
                  <th className="py-3.5 px-4">Papel / Função</th>
                  <th className="py-3.5 px-4">Organização Vinculada</th>
                  <th className="py-3.5 px-4">Data de Registro</th>
                  <th className="py-3.5 px-4 text-center">Permissões</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/50">
                {usuariosFiltrados.map((u) => {
                  const isMaster = u.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
                  const isTargetAdmin = u.tipo === "admin"
                  const canEditThisUser = isCurrentUserMaster || (!isTargetAdmin && !isMaster)

                  return (
                    <tr key={u.id} className="hover:bg-[#0A241F]/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {u.nome || "Usuário"}
                          {isMaster && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-bold flex items-center gap-1">
                              <Crown className="h-2.5 w-2.5" /> Mestre
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${roleColors[u.tipo] || "border-slate-700 text-slate-400"}`}>
                          {u.tipo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {u.organizacao_vinculada || (
                          <span className="text-slate-500 italic text-[11px]">Nenhuma organização vinculada</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "N/D"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {canEditThisUser ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white text-xs gap-1"
                            onClick={() => abrirAlterarRole(u)}
                          >
                            <Edit className="h-3 w-3" />
                            Editar Papel
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" /> Bloqueado
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
      </div>

      {/* Modal de Alteração de Cargo */}
      <Dialog open={modalRoleAberto} onOpenChange={setModalRoleAberto}>
        <DialogContent className="bg-[#071B17] border-emerald-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white font-serif">Alterar Cargo / Papel de Acesso</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Defina as permissões operacionais do usuário no FoodCycle.
            </DialogDescription>
          </DialogHeader>

          {usuarioSelecionado && (
            <div className="space-y-4 py-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0A241F]/60 border border-emerald-950 space-y-1.5">
                <p className="font-bold text-white">{usuarioSelecionado.nome || "Usuário"}</p>
                <p className="text-slate-400 font-mono">{usuarioSelecionado.email}</p>
                <p className="text-[11px] text-slate-500">
                  Cargo atual: <strong className="text-emerald-400 uppercase">{usuarioSelecionado.tipo}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Novo Cargo / Papel
                </label>
                <Select value={novoTipo} onValueChange={setNovoTipo}>
                  <SelectTrigger className="h-10 bg-[#0A241F]/70 border-emerald-900/60 text-white rounded-xl text-xs">
                    <SelectValue placeholder="Selecione o novo papel..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071B17] border-emerald-900 text-white text-xs">
                    <SelectItem value="empresa">Empresa Doadora</SelectItem>
                    <SelectItem value="instituicao">Instituição Receptora</SelectItem>
                    <SelectItem value="intermediario">Intermediário Logístico</SelectItem>
                    {isCurrentUserMaster && (
                      <SelectItem value="admin">Administrador Geral</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setModalRoleAberto(false)} disabled={salvandoRole} className="border-emerald-950 text-slate-300 text-xs">
              Cancelar
            </Button>
            <Button
              onClick={salvarRole}
              disabled={salvandoRole}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs"
            >
              {salvandoRole ? "Gravando..." : "Salvar Alteração"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
