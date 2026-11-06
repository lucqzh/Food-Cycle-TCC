"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Leaf, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/mapa", label: "Rede Logística" },
  { href: "/aspectos-legais", label: "Lei nº 15.224" },
  { href: "/impacto", label: "Impacto ODS 2" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/90 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] w-full max-w-5xl" 
          : "bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-2xl w-full max-w-5xl"
      }`}>
        {/* Logo & Status Badge */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-110">
            <Leaf className="h-4 w-4 fill-current stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              FoodCycle
              <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PNCPDA ATIVO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-300 px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95"
          >
            <span>Conectar</span>
            <ArrowRight className="h-3 w-3 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="sm:hidden p-1.5 text-slate-300 hover:text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-20 inset-x-4 max-w-sm mx-auto p-5 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navegação</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Lei nº 15.224/2025
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-200 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
            >
              Acessar Conta
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
            >
              Cadastrar Organização
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
