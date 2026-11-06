"use server"

import { requireAdminOrRedirect } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export interface UserProfileItem {
  id: string
  email: string
  nome: string
  tipo: "empresa" | "instituicao" | "intermediario" | "admin"
  created_at: string
  organizacao_vinculada?: string | null
}

export async function listarUsuariosAdmin(): Promise<{
  usuarios: UserProfileItem[]
  erro?: string
}> {
  try {
    await requireAdminOrRedirect()
    const supabase = await createClient()

    // No schema do banco public.profiles a coluna é 'criado_em'
    const [profilesRes, empresasRes, instRes] = await Promise.all([
      supabase.from("profiles").select("*").order("criado_em", { ascending: false }),
      supabase.from("empresas").select("perfil_id, razao_social, nome_fantasia"),
      supabase.from("instituicoes").select("perfil_id, razao_social"),
    ])

    let profiles: any[] = profilesRes.data || []

    if (profilesRes.error) {
      console.warn("Tentando buscar profiles sem ordenação:", profilesRes.error.message)
      const fallback = await supabase.from("profiles").select("*")
      if (fallback.error) {
        return { usuarios: [], erro: fallback.error.message }
      }
      profiles = fallback.data || []
    }

    const empresas = empresasRes.data || []
    const insts = instRes.data || []

    const enriquecidos: UserProfileItem[] = profiles.map((p: any) => {
      let org: string | null = null
      const emp = empresas.find((e: any) => e.perfil_id === p.id)
      if (emp) org = emp.nome_fantasia || emp.razao_social
      const inst = insts.find((i: any) => i.perfil_id === p.id)
      if (inst) org = inst.razao_social

      return {
        id: p.id,
        email: p.email || "",
        nome: p.nome || "Usuário",
        tipo: p.tipo || "empresa",
        created_at: p.criado_em || p.created_at || "",
        organizacao_vinculada: org,
      }
    })

    return { usuarios: enriquecidos }
  } catch (err: any) {
    console.error("Falha em listarUsuariosAdmin:", err)
    return { usuarios: [], erro: err.message || "Erro desconhecido" }
  }
}
