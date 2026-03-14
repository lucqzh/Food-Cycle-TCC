"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Doações Disponíveis",
    href: "/dashboard/doacoes",
    icon: Package
  },
  {
    title: "Nova Doação",
    href: "/dashboard/nova-doacao",
    icon: Plus
  },
  {
    title: "Minhas Solicitações",
    href: "/dashboard/solicitacoes",
    icon: ClipboardList
  },
  {
    title: "Histórico",
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
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Fome Zero</span>
        </div>

        {/* New Donation Button */}
        <div className="p-4">
          <Button asChild className="w-full gap-2">
            <Link href="/dashboard/nova-doacao">
              <Plus className="h-4 w-4" />
              Nova Doação
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Usuário</p>
              <p className="truncate text-xs text-sidebar-foreground/60">usuario@email.com</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full gap-2" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" />
              Sair
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
