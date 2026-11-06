"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound } from "lucide-react"
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

        // Se não houver sessão ativa através do link de redefinição
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
    <div className="flex min-h-screen">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Food Cycle</span>
            </Link>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                {sucesso ? "Senha redefinida!" : "Redefinir senha"}
              </CardTitle>
              <CardDescription>
                {sucesso
                  ? "Sua nova senha foi gravada com sucesso."
                  : "Crie uma nova senha segura para a sua conta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sucesso ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <CheckCircle2 className="h-12 w-12 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Tudo pronto!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você já pode acessar o sistema com a sua nova senha.
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      router.push("/dashboard")
                      router.refresh()
                    }}
                  >
                    Acessar Dashboard
                  </Button>
                </div>
              ) : verificandoSessao ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Validando link de segurança...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span>{error}</span>
                        {error.includes("expirado") && (
                          <div className="mt-2">
                            <Link
                              href="/recuperar-senha"
                              className="font-medium underline hover:text-destructive/80"
                            >
                              Solicitar novo link
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova senha</Label>
                    <div className="relative">
                      <Input
                        id="nova-senha"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                    <Input
                      id="confirmar-senha"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Repita a nova senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || Boolean(error && error.includes("expirado"))}>
                    {isLoading ? (
                      "Salvando nova senha..."
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4 mr-2" />
                        Alterar senha
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="relative hidden w-0 flex-1 lg:block bg-muted">
        <div className="absolute inset-0 bg-primary/10 flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-md space-y-4">
            <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary mb-2">
              <KeyRound className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Acesso Protegido
            </h2>
            <p className="text-muted-foreground text-sm">
              Mantenha suas credenciais seguras para garantir a integridade dos dados 
              e relatórios oficiais do sistema Food Cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
