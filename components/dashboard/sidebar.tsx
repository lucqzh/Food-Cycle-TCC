"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  History, 
  BarChart3, 
  LogOut, 
  Leaf, 
  Plus, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"

const menuItems = [
  {
    title: "Visão Geral",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Doações Disponíveis",
    href: "/dashboard/doacoes",
    icon: Package
  },
  {
    title: "Minhas Solicitações",
    href: "/dashboard/solicitacoes",
    icon: ClipboardList
  },
  {
    title: "Histórico de Entregas",
    href: "/dashboard/historico",
    icon: History
  },
  {
    title: "Métricas Nutricionais",
    href: "/dashboard/metricas",
    icon: BarChart3
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [profile, setProfile] = useState<{ nome: string; email: string }>({
    nome: "Usuário",
    email: "",
  })

  // Suporte a troca de tema (Claro / Escuro)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from("profiles")
        .select("nome, tipo")
        .eq("id", user.id)
        .maybeSingle()

      const isMaster = user.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
      const hasAdmin = data?.tipo === "admin"
      setIsAdmin(isMaster || hasAdmin)

      setProfile({
        nome: data?.nome || user.email?.split("@")[0] || "Usuário",
        email: user.email || "",
      })
    })
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
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-[#071B17] shadow-lg shadow-emerald-500/20 lg:hidden"
        aria-label="Abrir menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#071B17] text-slate-800 dark:text-[#F8FAFC] transition-all duration-300 lg:translate-x-0 selection:bg-emerald-500 selection:text-white shadow-xl lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo - leva para o início do Dashboard */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 dark:border-emerald-950/60 px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white dark:text-[#071B17] stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                FoodCycle
                <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/60 px-1.5 py-0.2 rounded">
                  PORTAL
                </span>
              </span>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400/60 font-mono">Lei nº 15.224/2025</p>
            </div>
          </Link>
        </div>

        {/* CTA Nova Doação */}
        <div className="p-4">
          <Button
            asChild
            className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white dark:text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
          >
            <Link href="/dashboard/nova-doacao" onClick={() => setMobileOpen(false)}>
              <Plus className="h-4 w-4 mr-1.5 stroke-[3]" />
              Cadastrar Nova Doação
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Navegação Principal
          </div>

          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                  isActive 
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-semibold" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/40 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  )} />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
              </Link>
            )
          })}

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-emerald-950/60">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-500/80">
                Acesso Especial
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Painel de Governança</span>
                </div>
                <span className="text-[9px] bg-amber-200 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono uppercase">
                  Admin
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* User section com botão de Alternar Tema e Logout */}
        <div className="border-t border-slate-200 dark:border-emerald-950/60 p-4 bg-slate-50/80 dark:bg-[#052E24]/30 transition-colors">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <span>{profile.nome ? profile.nome.charAt(0).toUpperCase() : "U"}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{profile.nome}</p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 font-mono">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            {/* Botão de Alternância de Tema (Claro / Escuro) */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8.5 border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#071B17] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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

            {/* Botão de Desconectar */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8.5 border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#071B17] text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Desconectar Sessão
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
