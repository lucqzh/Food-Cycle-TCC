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
import { ArrowLeft, Package, Heart, Sprout, Recycle, Scale, Info, AlertCircle, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"

const categorias = [
  { value: "fruta", label: "Frutas Frescas" },
  { value: "hortalica", label: "Hortaliças e Legumes" },
  { value: "graos_cereais", label: "Grãos e Cereais" },
  { value: "proteina", label: "Proteínas (Carnes, Ovos)" },
  { value: "laticinio", label: "Laticínios" },
  { value: "ultraprocessado", label: "Alimentos Processados / Industrializados" },
  { value: "outro", label: "Outros" },
]

const condicoes = [
  { value: "ambiente", label: "Temperatura Ambiente" },
  { value: "refrigerado", label: "Refrigerado (0°C a 10°C)" },
  { value: "congelado", label: "Congelado (-18°C ou inferior)" },
]

const destinacoes = [
  {
    value: "humano",
    label: "Consumo Humano",
    description: "Destinação prioritária - alimentos próprios para consumo",
    icon: Heart,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badge: "Prioridade Legal",
  },
  {
    value: "animal",
    label: "Consumo Animal",
    description: "Quando inadequado para humanos, mas com valor nutricional",
    icon: Sprout,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "2ª Opção",
  },
  {
    value: "compostagem",
    label: "Compostagem ou Biomassa",
    description: "Reaproveitamento orgânico evitando aterro sanitário",
    icon: Recycle,
    color: "text-slate-300 bg-slate-500/10 border-slate-500/20",
    badge: "3ª Opção",
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
            "Você precisa ter um perfil de Empresa cadastrado para publicar doações. Complete seu cadastro institucional."
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

    if (!formData.nome.trim()) {
      setErro("Informe o nome do alimento.")
      return
    }

    if (!formData.categoria) {
      setErro("Por favor, selecione uma Categoria Nutricional para o alimento.")
      return
    }

    if (!formData.validade) {
      setErro("Informe a data de validade.")
      return
    }

    const anoValidade = Number(formData.validade.split("-")[0])
    const anoAtual = new Date().getFullYear()
    if (isNaN(anoValidade) || anoValidade < anoAtual || anoValidade > anoAtual + 2) {
      setErro(`O ano da data de validade deve ser entre ${anoAtual} e ${anoAtual + 2}.`)
      return
    }

    if (!formData.condicao) {
      setErro("Por favor, selecione a condição de armazenamento.")
      return
    }

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
      <div className="flex min-h-[300px] items-center justify-center font-mono text-xs text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
        Carregando dados da empresa doadora...
      </div>
    )
  }

  const inputClass = "h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-emerald-950/60">
        <Button variant="outline" size="icon" asChild className="h-10 w-10 border-emerald-950 bg-[#071B17] text-slate-300 hover:text-white">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 mb-1">
            <Scale className="h-3 w-3 text-amber-400" />
            Lei nº 15.224/2025 • Rastreabilidade Aberta
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">Cadastrar Nova Doação</h1>
          <p className="text-xs text-slate-400">
            {empresaNome ? `Empresa Doadora: ${empresaNome}` : "Disponibilize excedentes alimentares para a rede"}
          </p>
        </div>
      </div>

      {erroEmpresa && (
        <div className="p-4 rounded-xl border border-red-800/80 bg-red-950/60 text-red-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{erroEmpresa}</span>
          </div>
          <Button size="sm" asChild className="bg-red-900/80 hover:bg-red-800 text-white text-xs h-7">
            <Link href="/completar-cadastro">Completar Cadastro</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulário */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 sm:p-8 backdrop-blur shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-950/60">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ficha Técnica do Lote</h3>
                <p className="text-xs text-slate-400">Dados nutricionais e de conservação do alimento</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nome" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Nome do Alimento *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Arroz Integral, Maçãs Gala, Pães..."
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="categoria" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Categoria Nutricional *
                  </Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    required
                  >
                    <SelectTrigger className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white rounded-xl">
                      <SelectValue placeholder="Selecione a categoria..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#071B17] border-emerald-900 text-white">
                      {categorias.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="focus:bg-emerald-950 focus:text-white">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quantidade" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Volume em KG *
                  </Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 50"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    required
                    min="0.1"
                    step="0.1"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="validade" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Data Limite de Validade *
                  </Label>
                  <Input
                    id="validade"
                    type="date"
                    value={formData.validade}
                    onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="condicao" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Condição de Armazenamento Exigida *
                </Label>
                <Select
                  value={formData.condicao}
                  onValueChange={(value) => setFormData({ ...formData, condicao: value })}
                  required
                >
                  <SelectTrigger className="h-11 bg-[#0A241F]/70 border-emerald-900/60 text-white rounded-xl">
                    <SelectValue placeholder="Selecione a temperatura de guarda..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071B17] border-emerald-900 text-white">
                    {condicoes.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="focus:bg-emerald-950 focus:text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destinação */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Destinação Sugerida (PNCPDA Art. 4º)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {destinacoes.map((dest) => {
                    const Icon = dest.icon
                    const isSelected = formData.destinacao === dest.value
                    return (
                      <button
                        key={dest.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, destinacao: dest.value })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/80 text-white shadow-md shadow-emerald-900/40"
                            : "border-emerald-950 bg-[#0A241F]/30 text-slate-400 hover:bg-emerald-950/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${dest.color}`}>
                            {dest.badge}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white">{dest.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">{dest.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descricao" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Observações e Instruções de Retirada (Opcional)
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Ex: Embalado em caixas plásticas higienizadas. Retirada pela doca 2 das 08h às 14h."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="bg-[#0A241F]/70 border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-500 rounded-xl"
                />
              </div>

              {/* Microcoleta */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0A241F]/40 border border-emerald-950/60">
                <Checkbox
                  id="microcoleta"
                  checked={formData.microcoleta}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, microcoleta: Boolean(checked) })
                  }
                />
                <label htmlFor="microcoleta" className="text-xs text-slate-300 cursor-pointer">
                  Habilitar Microcoleta (Permite fracionamento do lote entre várias instituições receptoras)
                </label>
              </div>

              {/* Termo de Responsabilidade */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <Checkbox
                  id="termo"
                  checked={formData.termoConfirmacao}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, termoConfirmacao: Boolean(checked) })
                  }
                  className="mt-0.5"
                />
                <label htmlFor="termo" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  Declaro que os alimentos cumprem rigorosamente os padrões de segurança alimentar,
                  encontram-se dentro do prazo de validade e foram armazenados conforme as normas sanitárias
                  vigentes, sob proteção da Lei nº 15.224/2025.
                </label>
              </div>

              {erro && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{erro}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" asChild className="h-10 border-emerald-950 text-slate-300 hover:text-white">
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.termoConfirmacao || Boolean(erroEmpresa)}
                  className="h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                >
                  {isLoading ? "Registrando Lote no Supabase..." : "Publicar Doação no Painel"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar com orientações */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="text-sm font-bold text-white">Segurança Jurídica do Doador</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nos termos da Lei nº 15.224/2025, a responsabilidade do doador cessa no momento da primeira entrega física ou transporte pelo intermediário, desde que observadas as condições declaradas.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-5 backdrop-blur shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Sparkles className="h-5 w-5" />
              <h4 className="text-sm font-bold text-white">Selo ESG e Rastreio</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada doação confirmada gera pontuação para emissão do <strong className="text-emerald-400">Selo Doador de Alimentos</strong>, válido para relatórios de sustentabilidade e compensações públicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
