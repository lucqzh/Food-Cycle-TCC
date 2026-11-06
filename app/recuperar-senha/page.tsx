"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, Mail, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const redirectUrl = `${window.location.origin}/auth/callback?next=/redefinir-senha`

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      })

      if (error) {
        throw error
      }

      setEnviado(true)
    } catch (err: any) {
      console.error(err)
      setError(
        err.message || "Erro ao enviar email de recuperação. Verifique o endereço e tente novamente."
      )
    } finally {
      setIsLoading(false)
    }
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
              </span>
              <p className="text-xs text-emerald-400/60 font-mono">Recuperação de Acesso</p>
            </div>
          </Link>
        </div>

        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              Recuperar Senha
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Informe seu email cadastrado para receber instruções seguras de redefinição de credenciais.
            </p>
          </div>

          {enviado ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-950/60 rounded-2xl border border-emerald-800/80">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
                <h3 className="font-bold text-white text-base">Verifique sua caixa de entrada</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Enviamos as instruções com token de recuperação para <strong className="text-emerald-400">{email}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 mt-3 font-mono">
                  Caso não receba em alguns minutos, verifique a pasta de Spam.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-emerald-800/60 text-slate-300 hover:text-white hover:bg-emerald-950/50"
                  onClick={() => setEnviado(false)}
                >
                  Tentar outro email
                </Button>
                <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold">
                  <Link href="/login">Voltar para o Login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-200 bg-red-950/60 border border-red-800/60 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Email Cadastrado
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Enviando link..."
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Link de Recuperação
                  </>
                )}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-emerald-950/40 pt-4">
          <span>Segurança PNCPDA</span>
          <span className="flex items-center gap-1 text-emerald-500/80"><ShieldCheck className="h-3 w-3" /> Token Criptografado</span>
        </div>
      </div>

      {/* Lado Direito - Cinematográfico */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center p-14 overflow-hidden bg-gradient-to-br from-[#052E24] via-[#071B17] to-[#03110E]">
        <div className="relative z-10 max-w-md mx-auto text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-800/40 text-emerald-400 shadow-xl shadow-emerald-950">
            <Leaf className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-white font-serif">
            Acesso Seguro e Protegido
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Todas as transações e doações no FoodCycle operam sob políticas estritas de rastreabilidade e governança corporativa.
          </p>
        </div>
      </div>
    </div>
  )
}
