"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Leaf, ArrowRight, Volume2, VolumeX, ShieldCheck, Sparkles } from "lucide-react"
import { soundManager } from "@/lib/sound"

const navLinks = [
  { href: "#problema", label: "O Problema" },
  { href: "#solucao", label: "A Solução" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#impacto", label: "Impacto" },
  { href: "/mapa", label: "Rede Logística" },
  { href: "/aspectos-legais", label: "Lei nº 15.224" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25)

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSound = () => {
    const active = soundManager.toggle()
    setSoundEnabled(active)
  }

  return (
    <>
      {/* Barra de Progresso Cinematográfica no Topo */}
      <div 
        id="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          scrolled 
            ? "glass-pill-dark w-full max-w-5xl scale-[0.99]" 
            : "glass-pill-dark w-full max-w-5xl"
        }`}>
          {/* Logo & Status Badge */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group"
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => soundManager.playClick()}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.6)] transition-transform group-hover:scale-110">
              <Leaf className="h-4 w-4 fill-current stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                FoodCycle
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PNCPDA 2026
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
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
                className="text-xs font-medium text-slate-300 px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs & Sound Toggle */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Desativar experiência sonora" : "Ativar experiência sonora"}
              className={`p-2 rounded-full border transition-all ${
                soundEnabled 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(22,163,74,0.3)]" 
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Toggle áudio"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
            </button>

            <Link
              href="/login"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="hidden sm:inline-block text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Conectar</span>
              <ArrowRight className="h-3 w-3 stroke-[2.5]" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              className="md:hidden p-1.5 text-slate-300 hover:text-white focus:outline-none ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto fixed top-20 inset-x-4 max-w-sm mx-auto p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Navegação</span>
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
                  className="text-sm font-medium text-slate-200 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
              >
                Acessar Portal
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                Cadastrar Organização
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
