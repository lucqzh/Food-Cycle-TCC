"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [verificandoSessao, setVerificandoSessao] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    async function checarSessao() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setError("Link de redefinição inválido ou expirado. Por favor, solicite um novo link.")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setVerificandoSessao(false)
      }
    }

    checarSessao()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (senha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (senha !== confirmarSenha) {
      setError("As senhas informadas não coincidem.")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: senha,
      })

      if (updateError) {
        throw updateError
      }

      setSucesso(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Erro ao atualizar a senha. Tente novamente.")
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
              <p className="text-xs text-emerald-400/60 font-mono">Redefinição de Credenciais</p>
            </div>
          </Link>
        </div>

        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              {sucesso ? "Senha Atualizada!" : "Criar Nova Senha"}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {sucesso
                ? "Sua nova chave de segurança foi registrada com sucesso."
                : "Defina uma combinação segura com no mínimo 6 dígitos."}
            </p>
          </div>

          {sucesso ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-950/60 rounded-2xl border border-emerald-800/80">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
                <h3 className="font-bold text-white text-base">Acesso Liberado</h3>
                <p className="text-xs text-slate-300 mt-2">
                  Você já pode acessar todas as funcionalidades da sua conta.
                </p>
              </div>

              <Button
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold"
                onClick={() => {
                  router.push("/dashboard")
                  router.refresh()
                }}
              >
                Acessar Meu Painel
              </Button>
            </div>
          ) : verificandoSessao ? (
            <div className="py-12 text-center text-xs font-mono text-emerald-400/80 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Validando sessão criptográfica...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 text-xs text-red-200 bg-red-950/60 border border-red-800/60 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span>{error}</span>
                    {error.includes("expirado") && (
                      <div className="mt-2">
                        <Link
                          href="/recuperar-senha"
                          className="font-bold underline text-amber-400 hover:text-amber-300"
                        >
                          Solicitar novo link de acesso
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="nova-senha" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="nova-senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmar-senha" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmar-senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Repita a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 font-mono"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 transition-all cursor-pointer"
                disabled={isLoading || Boolean(error && error.includes("expirado"))}
              >
                {isLoading ? (
                  "Gravando credenciais..."
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Salvar Nova Senha
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-emerald-950/40 pt-4">
          <span>Segurança Ponta a Ponta</span>
          <span className="flex items-center gap-1 text-emerald-500/80"><ShieldCheck className="h-3 w-3" /> Hash SHA-256</span>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center p-14 overflow-hidden bg-gradient-to-br from-[#052E24] via-[#071B17] to-[#03110E]">
        <div className="relative z-10 max-w-md mx-auto text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-800/40 text-emerald-400 shadow-xl shadow-emerald-950">
            <KeyRound className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-white font-serif">
            Controle de Identidade
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sua conta tem papel ativo na validação da entrega de alimentos e relatórios da Lei nº 15.224/2025.
          </p>
        </div>
      </div>
    </div>
  )
}
