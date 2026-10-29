import { requireAdminOrRedirect } from "@/lib/supabase/admin"
import { AdminSidebar } from "@/components/admin/sidebar"
import { ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Painel Administrativo | FoodCycle",
  description: "Governança e auditoria central da plataforma FoodCycle - PNCPDA",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificação no Servidor: se o usuário não for admin, é redirecionado
  const auth = await requireAdminOrRedirect("/login?error=acesso_negado")

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        userEmail={auth.user?.email || "Admin"}
        userName={auth.user?.nome || "Administrador Geral"}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Governança Central</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground">Lei nº 15.224/2025 (PNCPDA)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sessão Administrativa Segura
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
