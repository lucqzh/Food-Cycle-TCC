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
  X
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
    title: "Instituições",
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
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop / Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header do Admin */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">FoodCycle</span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
        </div>

        {/* Perfil Administrador */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
              {userName ? userName[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{userName || "Administrador"}</p>
              <p className="text-xs text-muted-foreground truncate" title={userEmail}>{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer com link para Dashboard comum e Logout */}
        <div className="border-t border-border p-3 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span>Ir para Portal do Usuário</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sair do Painel</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
