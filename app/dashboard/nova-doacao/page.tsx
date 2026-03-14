"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

const categorias = [
  { value: "frutas", label: "Frutas" },
  { value: "legumes", label: "Legumes e Verduras" },
  { value: "graos", label: "Grãos e Cereais" },
  { value: "proteinas", label: "Proteínas (Carnes, Ovos)" },
  { value: "laticinios", label: "Laticínios" },
  { value: "bebidas", label: "Bebidas" },
  { value: "processados", label: "Alimentos Processados" },
  { value: "outros", label: "Outros" }
]

const condicoes = [
  { value: "refrigerado", label: "Refrigerado" },
  { value: "congelado", label: "Congelado" },
  { value: "temperatura-ambiente", label: "Temperatura Ambiente" },
  { value: "seco", label: "Local Seco e Arejado" }
]

export default function NovaDoacaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    quantidade: "",
    unidade: "kg",
    validade: "",
    condicao: "",
    descricao: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simula envio - em produção, fazer chamada API
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/doacoes")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Doação</h1>
          <p className="text-muted-foreground">Cadastre um novo alimento para doação</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Informações do Alimento</CardTitle>
              <CardDescription>Preencha os dados do alimento que deseja doar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome do alimento */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Alimento</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Arroz integral, Maçãs, Leite..."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria Nutricional</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 50"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    required
                    min="1"
                    className="flex-1"
                  />
                  <Select
                    value={formData.unidade}
                    onValueChange={(value) => setFormData({ ...formData, unidade: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="unidades">un</SelectItem>
                      <SelectItem value="litros">L</SelectItem>
                      <SelectItem value="caixas">cx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data de validade */}
              <div className="space-y-2">
                <Label htmlFor="validade">Data de Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={formData.validade}
                  onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                  required
                />
              </div>

              {/* Condição de armazenamento */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="condicao">Condição de Armazenamento</Label>
                <Select
                  value={formData.condicao}
                  onValueChange={(value) => setFormData({ ...formData, condicao: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a condição de armazenamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicoes.map((cond) => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição Adicional</Label>
                <Textarea
                  id="descricao"
                  placeholder="Informações adicionais sobre o alimento, como marca, lote, observações..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Publicando..." : "Publicar Doação"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
