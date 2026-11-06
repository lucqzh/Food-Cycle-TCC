import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const ADMIN_MASTER_EMAIL = "santhiagooliveiraparente@gmail.com"

export interface AdminAuthResult {
  isAdmin: boolean
  user: {
    id: string
    email: string
    nome?: string
  } | null
  profile: {
    id: string
    email: string
    nome: string
    tipo: string
  } | null
}

/**
 * Validação segura de Administrador no Servidor (Server Components / Server Actions)
 * NUNCA confia apenas em parâmetros da requisição ou estado de frontend.
 */
export async function getAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
      return { isAdmin: false, user: null, profile: null }
    }

    // Consulta perfil na tabela de perfis protegida por RLS
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, nome, tipo")
      .eq("id", user.id)
      .maybeSingle()

    // O usuário é admin se tiver a role 'admin' no banco OU for o email mestre autorizado
    const isMasterEmail = user.email.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
    const hasAdminRole = profile?.tipo === "admin"

    const isAdmin = Boolean(hasAdminRole || isMasterEmail)

    return {
      isAdmin,
      user: {
        id: user.id,
        email: user.email,
        nome: profile?.nome || user.user_metadata?.nome || user.email.split("@")[0],
      },
      profile: profile || null,
    }
  } catch (err) {
    console.error("Erro na verificação de admin:", err)
    return { isAdmin: false, user: null, profile: null }
  }
}

/**
 * Proteção de rota servidora: se não for admin, redireciona imediatamente.
 */
export async function requireAdminOrRedirect(redirectUrl: string = "/login?error=acesso_negado") {
  const auth = await getAdminAuth()
  if (!auth.isAdmin || !auth.user) {
    redirect(redirectUrl)
  }
  return auth
}

/**
 * Registro de ação de auditoria administrativa no Supabase
 */
export async function registrarAuditoria(params: {
  acao: string
  entidade: string
  entidadeId?: string | number
  detalhes?: Record<string, unknown>
}) {
  try {
    const auth = await getAdminAuth()
    if (!auth.user) return

    const supabase = await createServerSupabase()
    await supabase.from("admin_audit_logs").insert({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      acao: params.acao,
      entidade: params.entidade,
      entidade_id: params.entidadeId ? String(params.entidadeId) : null,
      detalhes: params.detalhes || null,
    })
  } catch (err) {
    console.error("Falha ao gravar log de auditoria:", err)
  }
}
