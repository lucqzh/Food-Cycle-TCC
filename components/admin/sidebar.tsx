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
  ChevronRight,
  Sun,
  Moon,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
  {
    title: "Seed de Demonstração",
    href: "/admin/seed",
    icon: Database,
  },
]

export function AdminSidebar({ userEmail, userName }: { userEmail: string; userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Suporte a troca de tema (Claro / Escuro)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const isLight = mounted && theme === "light"

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
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#040E0B] text-slate-800 dark:text-[#F8FAFC] transition-all duration-300 lg:translate-x-0 selection:bg-purple-500 selection:text-white shadow-xl lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header do Admin */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 dark:border-emerald-950/60 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 shadow-md shadow-purple-950/60 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                FoodCycle
                <span className="text-[9px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800/60 px-1.5 py-0.5 rounded">
                  GOV
                </span>
              </span>
              <p className="text-[10px] text-purple-600 dark:text-purple-400/60 font-mono">Governança Central</p>
            </div>
          </Link>
        </div>

        {/* Identificação do Usuário Admin */}
        <div className="p-4 border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50 dark:bg-[#071B17]/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-700 dark:text-purple-300 font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{userName}</p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 font-mono">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navegação Administrativa */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Módulos de Auditoria
          </div>

          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            const isSeed = item.href === "/admin/seed"
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800/60 font-semibold shadow-sm"
                    : isSeed
                    ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#071B17] hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-purple-600 dark:text-purple-400"
                      : isSeed
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                  )} />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer com link para Dashboard comum, Botão de Tema e Logout */}
        <div className="border-t border-slate-200 dark:border-emerald-950/60 p-4 space-y-2 bg-slate-50 dark:bg-[#040E0B] transition-colors">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors"
          >
            <span>Ir para Portal do Usuário</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Botão de Alternância de Tema (Claro / Escuro) */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#071B17] text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            title={isLight ? "Mudar para Tema Escuro" : "Mudar para Tema Claro"}
          >
            {isLight ? (
              <>
                <Moon className="h-3.5 w-3.5 text-indigo-500" />
                <span>Mudar para Tema Escuro</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Mudar para Tema Claro</span>
              </>
            )}
          </Button>

          {/* Botão de Sair do Painel */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#071B17] text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            Sair do Painel
          </Button>
        </div>
      </aside>
    </>
  )
}
