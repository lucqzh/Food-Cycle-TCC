"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react"
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
              <CardTitle className="text-2xl font-bold text-foreground">Recuperar senha</CardTitle>
              <CardDescription>
                {enviado
                  ? "Instruções enviadas com sucesso"
                  : "Informe seu email cadastrado para redefinir sua senha"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enviado ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <CheckCircle2 className="h-12 w-12 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Verifique sua caixa de entrada</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enviamos um link de recuperação para <strong>{email}</strong>.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Caso não encontre, verifique a pasta de <strong>Spam</strong> ou lixo eletrônico.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setEnviado(false)}
                    >
                      Tentar outro email
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/login">Voltar para o Login</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email cadastrado</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Enviando link..."
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar link de recuperação
                      </>
                    )}
                  </Button>

                  <div className="pt-2 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lado Direito - Imagem e Contexto PNCPDA */}
      <div className="relative hidden w-0 flex-1 lg:block bg-muted">
        <div className="absolute inset-0 bg-primary/10 flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-md space-y-4">
            <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary mb-2">
              <Leaf className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Rede de Solidariedade Food Cycle
            </h2>
            <p className="text-muted-foreground text-sm">
              Conectando doadores de alimentos e instituições receptoras em conformidade com a 
              Política Nacional de Combate à Perda e ao Desperdício de Alimentos (Lei nº 15.224/2025).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
