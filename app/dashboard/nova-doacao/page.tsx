"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Heart, Sprout, Recycle, Scale, Info, Boxes, AlertCircle } from "lucide-react"
import Link from "next/link"

// Enums alinhados com o banco de dados (public.pg_type / schema.sql)
const categorias = [
  { value: "fruta", label: "Frutas" },
  { value: "hortalica", label: "Hortaliças e Legumes" },
  { value: "graos_cereais", label: "Grãos e Cereais" },
  { value: "proteina", label: "Proteínas (Carnes, Ovos)" },
  { value: "laticinio", label: "Laticínios" },
  { value: "ultraprocessado", label: "Alimentos Processados / Industrializados" },
  { value: "outro", label: "Outros" },
]

const condicoes = [
  { value: "ambiente", label: "Temperatura Ambiente" },
  { value: "refrigerado", label: "Refrigerado" },
  { value: "congelado", label: "Congelado" },
]

const destinacoes = [
  {
    value: "humano",
    label: "Consumo humano",
    description: "Destinação prioritária - alimentos próprios para consumo",
    icon: Heart,
    color: "bg-primary text-primary-foreground",
    badge: "Prioridade máxima",
  },
  {
    value: "animal",
    label: "Consumo animal",
    description: "Quando inadequado para humanos, mas com valor nutricional",
    icon: Sprout,
    color: "bg-secondary text-secondary-foreground",
    badge: "Segunda opção",
  },
  {
    value: "compostagem",
    label: "Compostagem ou biomassa",
    description: "Reaproveitamento orgânico evitando aterro sanitário",
    icon: Recycle,
    color: "bg-accent text-accent-foreground",
    badge: "Terceira opção",
  },
]

export default function NovaDoacaoPage() {
  const router = useRouter()
  const [carregandoUsuario, setCarregandoUsuario] = useState(true)
  const [empresaId, setEmpresaId] = useState<number | null>(null)
  const [empresaNome, setEmpresaNome] = useState<string>("")
  const [erroEmpresa, setErroEmpresa] = useState<string>("")
  const [erro, setErro] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    quantidade: "",
    validade: "",
    condicao: "",
    descricao: "",
    destinacao: "humano",
    microcoleta: false,
    termoConfirmacao: false,
  })

  useEffect(() => {
    async function carregarEmpresa() {
      try {
        const supabase = createClient()
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
          router.replace("/login")
          return
        }

        const uid = authData.user.id

        // Busca o ID da empresa vinculada ao perfil logado
        const { data: emp, error: empError } = await supabase
          .from("empresas")
          .select("id, nome_fantasia, razao_social")
          .eq("perfil_id", uid)
          .maybeSingle()

        if (empError) {
          console.error("Erro ao buscar empresa:", empError)
          setErroEmpresa("Não foi possível carregar os dados da empresa. Tente recarregar.")
        } else if (!emp) {
          setErroEmpresa(
            "Você precisa ter um perfil de Empresa cadastrado para publicar doações. Acesse o menu para completar seu cadastro."
          )
        } else {
          setEmpresaId(emp.id)
          setEmpresaNome(emp.nome_fantasia || emp.razao_social || "Sua Empresa")
        }
      } catch (e) {
        console.error(e)
        setErroEmpresa("Erro de comunicação com o Supabase.")
      } finally {
        setCarregandoUsuario(false)
      }
    }

    carregarEmpresa()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.termoConfirmacao) {
      setErro("Você precisa aceitar o termo de responsabilidade para continuar.")
      return
    }

    if (!empresaId) {
      setErro("Não foi identificado o cadastro da empresa vinculada a esta conta.")
      return
    }

    const qtdNum = Number(formData.quantidade)
    if (isNaN(qtdNum) || qtdNum <= 0) {
      setErro("Informe uma quantidade válida em kg.")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const anoAtual = new Date().getFullYear()
      const aleatorio = Math.floor(100000 + Math.random() * 900000)
      const codigoRastreio = `FC-${anoAtual}-${aleatorio}`

      const { error: insertError } = await supabase.from("doacoes").insert({
        codigo_rastreio: codigoRastreio,
        empresa_id: empresaId,
        tipo_alimento: formData.nome.trim(),
        categoria: formData.categoria,
        quantidade_kg: qtdNum,
        data_validade: formData.validade,
        condicao_armazenamento: formData.condicao,
        destino: formData.destinacao,
        descricao: formData.descricao.trim() || null,
        microcoleta: Boolean(formData.microcoleta),
        status: "disponivel",
        termo_aceite: Boolean(formData.termoConfirmacao),
      })

      if (insertError) {
        console.error("Erro ao inserir doação:", insertError)
        setErro(`Erro ao salvar doação: ${insertError.message}`)
        setIsLoading(false)
        return
      }

      router.push("/dashboard/doacoes")
    } catch (e: any) {
      console.error(e)
      setErro(e.message || "Erro inesperado ao cadastrar doação.")
      setIsLoading(false)
    }
  }

  if (carregandoUsuario) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        Carregando dados da empresa...
      </div>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Nova doação</h1>
          <p className="text-muted-foreground">
            Cadastre um alimento de acordo com a PNCPDA - Lei nº 15.224/2025
            {empresaNome ? ` • Doador: ${empresaNome}` : ""}
          </p>
        </div>
      </div>

      {erroEmpresa && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="flex-1 text-sm font-medium">{erroEmpresa}</div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/completar-cadastro">Completar cadastro</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aviso PNCPDA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm text-foreground">
              <strong>Política Nacional de Combate à Perda e ao Desperdício de Alimentos.</strong> Toda
              doação registrada nesta plataforma deve respeitar as diretrizes da Lei nº 15.224/2025,
              priorizando o consumo humano e garantindo segurança alimentar.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Informações do alimento</CardTitle>
                  <CardDescription>Preencha os dados do alimento que deseja doar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Nome do alimento */}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do alimento *</Label>
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
                    <Label htmlFor="categoria">Categoria nutricional *</Label>
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

                  {/* Quantidade em KG */}
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade total (kg) *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quantidade"
                        type="number"
                        placeholder="Ex: 50"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                        required
                        min="0.1"
                        step="0.1"
                        className="flex-1"
                      />
                      <div className="flex items-center justify-center rounded-md border border-border bg-muted px-3 text-sm font-medium text-muted-foreground">
                        kg
                      </div>
                    </div>
                  </div>

                  {/* Data de validade */}
                  <div className="space-y-2">
                    <Label htmlFor="validade">Data de validade *</Label>
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
                    <Label htmlFor="condicao">Condição de armazenamento *</Label>
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
                    <Label htmlFor="descricao">Descrição adicional</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Marca, lote, observações relevantes sobre o lote..."
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Destinação prevista */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-base">Classificação da destinação</Label>
                    <p className="text-sm text-muted-foreground">
                      Conforme a hierarquia da PNCPDA, indique a destinação prevista do alimento.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {destinacoes.map((d) => (
                      <button
                        type="button"
                        key={d.value}
                        onClick={() => setFormData({ ...formData, destinacao: d.value })}
                        className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                          formData.destinacao === d.value
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${d.color}`}
                        >
                          <d.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground">{d.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {d.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{d.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Microcoleta */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Label htmlFor="microcoleta" className="text-base font-semibold">
                          Microcoleta
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          Pequenas doações
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Marque esta opção se a doação tem pequeno volume. A PNCPDA estimula a
                        organização de microcoletas para integrar pequenos doadores ao sistema, ampliando
                        a captação de excedentes.
                      </p>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="microcoleta"
                          checked={formData.microcoleta}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, microcoleta: Boolean(checked) })
                          }
                        />
                        <label htmlFor="microcoleta" className="text-sm text-foreground cursor-pointer">
                          Esta é uma microcoleta (pequena doação)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Termo de responsabilidade */}
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo"
                      checked={formData.termoConfirmacao}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, termoConfirmacao: Boolean(checked) })
                      }
                      className="mt-1"
                    />
                    <label htmlFor="termo" className="text-sm text-foreground leading-relaxed cursor-pointer">
                      Confirmo que o alimento está dentro do prazo de validade, foi armazenado conforme
                      as condições informadas e está próprio para a destinação selecionada. Declaro
                      atuar de boa-fé e em conformidade com a Lei nº 15.224/2025 (PNCPDA) e com as
                      normas sanitárias vigentes.
                    </label>
                  </div>
                </div>

                {erro && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {erro}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.termoConfirmacao || Boolean(erroEmpresa)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isLoading ? "Publicando no banco..." : "Publicar doação"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar de orientações */}
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Info className="h-5 w-5" />
                </div>
                <CardTitle className="text-foreground">Orientações da PNCPDA</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Hierarquia de destinação:</strong> sempre que
                possível, priorize o consumo humano antes de outras destinações.
              </p>
              <p>
                <strong className="text-foreground">Rastreabilidade:</strong> os dados informados
                geram registro auditável da doação, contribuindo para o monitoramento da política
                pública.
              </p>
              <p>
                <strong className="text-foreground">Boa-fé:</strong> o doador, atuando de boa-fé,
                somente responde por danos em caso de dolo. A doação não configura relação de consumo.
              </p>
              <Button variant="outline" size="sm" asChild className="mt-2 w-full gap-2">
                <Link href="/aspectos-legais">
                  Ver aspectos legais
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Scale className="h-5 w-5 shrink-0 text-accent" />
                <div className="text-sm">
                  <p className="mb-1 font-semibold text-foreground">Limites legais</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Alimentos vencidos ou em condições inadequadas não podem ser doados. A plataforma
                    organiza informações, mas não substitui a fiscalização sanitária.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
