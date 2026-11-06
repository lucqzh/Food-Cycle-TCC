"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Building2, 
  Heart, 
  Package, 
  ClipboardList, 
  Truck, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  Leaf, 
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const adminNavItems = [
  {
    title: "Visão Geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Empresas Doadoras",
    href: "/admin/empresas",
    icon: Building2,
  },
  {
    title: "Instituições Receptoras",
    href: "/admin/instituicoes",
    icon: Heart,
  },
  {
    title: "Lotes de Doações",
    href: "/admin/doacoes",
    icon: Package,
  },
  {
    title: "Solicitações",
    href: "/admin/solicitacoes",
    icon: ClipboardList,
  },
  {
    title: "Entregas & Logística",
    href: "/admin/entregas",
    icon: Truck,
  },
  {
    title: "Usuários & Acessos",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Métricas & ODS 2",
    href: "/admin/metricas",
    icon: BarChart3,
  },
  {
    title: "Auditoria do Sistema",
    href: "/admin/auditoria",
    icon: ShieldCheck,
  },
]

export function AdminSidebar({ userEmail, userName }: { userEmail: string; userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-950/60 lg:hidden"
        aria-label="Alternar menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-emerald-950/60 bg-[#040E0B] text-[#F8FAFC] transition-transform duration-300 lg:translate-x-0 selection:bg-purple-500 selection:text-white",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header do Admin - Aponta para /admin */}
        <div className="flex h-20 items-center gap-3 border-b border-emerald-950/60 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 shadow-md shadow-purple-950/60 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold text-white flex items-center gap-1.5">
                FoodCycle
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 border border-purple-800/60 px-1.5 py-0.2 rounded">
                  GOV
                </span>
              </span>
              <p className="text-[10px] text-purple-400/80 font-mono">Governança Central</p>
            </div>
          </Link>
        </div>

        {/* Perfil Administrador */}
        <div className="p-4 border-b border-emerald-950/60 bg-[#071B17]/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-sm">
              {userName ? userName[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName || "Administrador"}</p>
              <p className="text-[10px] text-purple-300/60 truncate font-mono" title={userEmail}>{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Módulos de Auditoria
          </div>

          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-purple-950/80 text-purple-200 border border-purple-800/60 font-semibold shadow-md shadow-purple-950/40"
                    : "text-slate-400 hover:bg-[#071B17] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-purple-400" : "text-slate-400 group-hover:text-purple-400"
                  )} />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer com link para Dashboard comum e Logout */}
        <div className="border-t border-emerald-950/60 p-4 space-y-2 bg-[#040E0B]">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 hover:bg-emerald-950/60 transition-colors"
          >
            <span>Ir para Portal do Usuário</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/30 transition-all cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sair do Painel
          </Button>
        </div>
      </aside>
    </>
  )
}
