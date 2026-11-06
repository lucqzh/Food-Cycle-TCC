"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Leaf, Eye, EyeOff, Building2, Heart, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CadastroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipo: "empresa"
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tipo = params.get("tipo")
    if (tipo === "empresa" || tipo === "instituicao") {
      setFormData(prev => ({
        ...prev,
        tipo
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          nome: formData.nome,
          tipo: formData.tipo,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    setSuccess(true)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      {/* Lado Esquerdo - Cinematográfico */}
      <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-14 overflow-hidden bg-gradient-to-br from-[#052E24] via-[#071B17] to-[#020B09] border-r border-emerald-950/40">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6 text-[#071B17] stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                FoodCycle
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Oficial
                </span>
              </span>
              <p className="text-xs text-emerald-400/60 font-mono">Conexão Legal PNCPDA</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-xs font-medium text-emerald-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Cadastre-se na Maior Rede de Redistribuição
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight font-serif mb-6">
            Junte-se à transformação da <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">cadeia alimentar</span>.
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0A241F]/40 border border-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Segurança Jurídica Integral</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Operações 100% respaldadas pela Lei Federal nº 15.224/2025 que isenta doadores de responsabilidade após a entrega conforme as boas práticas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0A241F]/40 border border-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Auditoria em Tempo Real</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rastreabilidade com hash de auditoria, georreferenciamento e termos de entrega padronizados.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-emerald-950/60 text-xs text-slate-400">
          <span>Lei nº 15.224/2025 • ODS 2</span>
          <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> Dados Protegidos (LGPD)</span>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 bg-[#071B17]/95 backdrop-blur-xl">
        <div className="lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-[#071B17]">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white">FoodCycle</span>
          </Link>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-6">
          <div className="mb-6 space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              Criar Nova Conta
            </h1>
            <p className="text-sm text-slate-400">
              Preencha os dados da sua organização para iniciar as operações.
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmação Enviada!</h3>
              <p className="text-sm text-slate-300">
                Enviamos um link de confirmação para <span className="font-semibold text-emerald-400">{formData.email}</span>. Acesse seu email para ativar a conta.
              </p>
              <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold">
                <Link href="/login">Ir para o Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Nome da Empresa / Instituição / Responsável
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: Supermercado Aliança ou Associação Esperança"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Email Corporativo / Oficial
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@organizacao.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 dígitos"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Tipo de Atuação no FoodCycle
                </Label>
                <RadioGroup
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  <div>
                    <RadioGroupItem value="empresa" id="empresa" className="peer sr-only" />
                    <Label
                      htmlFor="empresa"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-xl border border-emerald-900/60 bg-[#0A241F]/50 p-3.5 hover:bg-emerald-900/30 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-950/80 transition-all text-center"
                    >
                      <Building2 className="mb-2 h-6 w-6 text-emerald-400" />
                      <span className="text-sm font-bold text-white">Empresa Doadora</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Supermercado, indústria, agro</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="instituicao" id="instituicao" className="peer sr-only" />
                    <Label
                      htmlFor="instituicao"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-xl border border-emerald-900/60 bg-[#0A241F]/50 p-3.5 hover:bg-emerald-900/30 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-950/80 transition-all text-center"
                    >
                      <Heart className="mb-2 h-6 w-6 text-amber-400" />
                      <span className="text-sm font-bold text-white">Instituição Receptora</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">ONG, abrigo, banco de alimentos</span>
                    </Label>
                  </div>
                </RadioGroup>
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
                {isLoading ? "Processando..." : "Concluir Cadastro"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-emerald-950/60 text-center text-xs text-slate-400">
            Já possui uma conta registrada?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
              Fazer login
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          Ao se cadastrar, você concorda com os termos da Lei nº 15.224/2025 e a Política de Privacidade.
        </div>
      </div>
    </div>
  )
}
