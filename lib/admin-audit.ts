import { createClient } from "@/lib/supabase/client"

export interface AuditLogPayload {
  acao: string
  entidade: string
  entidade_id?: string | number | null
  detalhes?: Record<string, unknown>
}

/**
 * Registra um evento de auditoria administrativa na tabela public.admin_audit_logs.
 * Captura automaticamente o id e email do administrador autenticado.
 */
export async function logAdminAudit(payload: AuditLogPayload): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    const adminEmail = user?.email || "admin@foodcycle.app"
    const adminId = user?.id || null

    const { error } = await supabase.from("admin_audit_logs").insert({
      admin_id: adminId,
      admin_email: adminEmail,
      acao: payload.acao,
      entidade: payload.entidade,
      entidade_id: payload.entidade_id ? String(payload.entidade_id) : null,
      detalhes: {
        ...payload.detalhes,
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
      },
    })

    if (error) {
      console.warn("Aviso ao registrar log de auditoria:", error.message)
      return false
    }

    return true
  } catch (err) {
    console.error("Falha ao registrar log de auditoria:", err)
    return false
  }
}
