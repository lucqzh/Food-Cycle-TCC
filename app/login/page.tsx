"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, Building2, HeartHandshake } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setIsLoading(false)
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : error.message,
      )
      return
    }

    const isMaster = formData.email.trim().toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
    if (isMaster) {
      router.push("/admin")
      router.refresh()
      return
    }

    const { data: authData } = await supabase.auth.getUser()
    if (authData.user) {
      const { data: profile } = await supabase.from("profiles").select("tipo").eq("id", authData.user.id).maybeSingle()
      if (profile?.tipo === "admin") {
        router.push("/admin")
        router.refresh()
        return
      }
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 border-r border-emerald-950/40 bg-[#071B17]/95 backdrop-blur-xl">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6 text-[#071B17] stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                FoodCycle
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  PNCPDA
                </span>
              </span>
              <p className="text-xs text-emerald-400/60 font-mono">Plataforma Solidária Oficial</p>
            </div>
          </Link>
        </div>

        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
              Entrar no FoodCycle
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Acesse a infraestrutura de redistribuição segura de alimentos e acompanhamento de impacto social.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Email de Acesso
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="empresa@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Senha de Segurança
                </Label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Alternar visibilidade da senha"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-start gap-2">
                <span className="font-bold">Erro:</span> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 transition-all cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Acessar Plataforma"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-emerald-950/60 text-center text-xs text-slate-400">
            Não tem uma conta cadastrada?{" "}
            <Link href="/cadastro" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
              Cadastre sua instituição ou empresa
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-emerald-950/40 pt-4">
          <span>Lei nº 15.224/2025 • ODS 2</span>
          <span className="flex items-center gap-1 text-emerald-500/80"><ShieldCheck className="h-3 w-3" /> Criptografia de Ponta</span>
        </div>
      </div>

      {/* Lado Direito - Cinematográfico */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-14 overflow-hidden bg-gradient-to-br from-[#052E24] via-[#071B17] to-[#03110E]">
        {/* Glow de fundo */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-xs font-medium text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Rede Nacional de Redução do Desperdício
          </span>
          <span className="text-xs text-slate-400 font-mono">v2.4 • Produção</span>
        </div>

        <div className="relative z-10 my-auto max-w-xl">
          <h2 className="text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.08] font-serif mb-6">
            Do excedente ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">impacto real</span>.
          </h2>
          <p className="text-lg text-slate-300 font-light leading-relaxed mb-10">
            Conectamos doadores a comunidades com rastreabilidade criptográfica, auditoria transparente e validação nutricional em conformidade com o marco regulatório brasileiro.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#071B17]/70 border border-emerald-900/40 backdrop-blur">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Para Empresas</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gestão simplificada de lotes excedentes com benefícios tributários e selo ESG reconhecido.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#071B17]/70 border border-emerald-900/40 backdrop-blur">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Para Instituições</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Acesso transparente a alimentos nutritivos com suporte logístico geolocalizado.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-emerald-950/60 text-xs text-slate-400">
          <span>FoodCycle • Todos os direitos reservados</span>
          <span className="font-mono text-emerald-400/80">Pacto Global ONU • ODS 2 Fome Zero</span>
        </div>
      </div>
    </div>
  )
}
