import { requireAdminOrRedirect } from "@/lib/supabase/admin"
import { AdminSidebar } from "@/components/admin/sidebar"
import { ShieldCheck, Lock } from "lucide-react"

export const metadata = {
  title: "Painel Administrativo | FoodCycle",
  description: "Governança e auditoria central da plataforma FoodCycle - PNCPDA",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await requireAdminOrRedirect("/login?error=acesso_negado")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071B17] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <AdminSidebar
        userEmail={auth.user?.email || "Admin"}
        userName={auth.user?.nome || "Administrador Geral"}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-emerald-950/60 bg-white/90 dark:bg-[#071B17]/90 backdrop-blur-md px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">Governança Central</span>
            <span className="text-slate-400 dark:text-slate-600 font-mono">/</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-medium">Lei nº 15.224/2025 (PNCPDA)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 px-3 py-1 rounded-full font-mono font-medium">
              <Lock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              Sessão Administrativa Mestre
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
