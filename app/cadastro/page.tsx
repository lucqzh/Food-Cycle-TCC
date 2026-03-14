"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Leaf, Eye, EyeOff, Building2, Heart } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipo: "empresa"
  })

  useEffect(() => {
    const tipo = searchParams.get("tipo")
    if (tipo === "empresa" || tipo === "instituicao") {
      setFormData(prev => ({ ...prev, tipo }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    
    setIsLoading(true)
    
    // Simula cadastro - em produção, fazer chamada API
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image/Brand */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="flex h-full flex-col items-center justify-center px-12 text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
              Junte-se a nós
            </h2>
            <p className="max-w-md text-lg text-primary-foreground/80">
              Faça parte da rede solidária que está transformando excedentes de alimentos em esperança para milhares de pessoas.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Fome Zero</span>
            </Link>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground">Criar conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para se cadastrar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome ou nome da organização"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tipo de usuário</Label>
                  <RadioGroup
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="empresa"
                        id="empresa"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="empresa"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Building2 className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Empresa</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="instituicao"
                        id="instituicao"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="instituicao"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Heart className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Instituição</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Criar conta"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
