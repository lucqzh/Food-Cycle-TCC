"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_MASTER_EMAIL } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Leaf, ShieldCheck, ArrowRight, Building2, Heart, Truck, Sparkles } from "lucide-react"

type Tipo = "empresa" | "instituicao" | "intermediario"

const TIPOS: { valor: Tipo; rotulo: string; desc: string; icon: any }[] = [
  { valor: "empresa", rotulo: "Empresa doadora", desc: "Supermercados, produtores, restaurantes", icon: Building2 },
  { valor: "instituicao", rotulo: "Instituição receptora", desc: "ONGs, abrigos, cozinhas comunitárias", icon: Heart },
  { valor: "intermediario", rotulo: "Intermediário logístico", desc: "Bancos de alimentos, frotas de distribuição", icon: Truck },
]

const TIPOS_INSTITUICAO = [
  { valor: "ong", rotulo: "ONG" },
  { valor: "religiosa", rotulo: "Religiosa" },
  { valor: "abrigo", rotulo: "Abrigo" },
  { valor: "comunitaria", rotulo: "Comunitária" },
  { valor: "publica", rotulo: "Pública" },
  { valor: "outra", rotulo: "Outra" },
]

const TIPOS_INTERMEDIARIO = [
  { valor: "banco_alimentos", rotulo: "Banco de alimentos" },
  { valor: "logistica", rotulo: "Logística" },
  { valor: "cooperativa", rotulo: "Cooperativa" },
  { valor: "outro", rotulo: "Outro" },
]

const campoClass =
  "w-full rounded-xl border border-emerald-900/60 bg-[#0A241F]/70 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">{rotulo}</span>
      {children}
    </label>
  )
}

function formatarCnpj(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 14)
  return n
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

export default function CompletarCadastroPage() {
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const [userId, setUserId] = useState("")
  const [tipo, setTipo] = useState<Tipo | "">("")
  const [tipoFixo, setTipoFixo] = useState(false)
  const [f, setF] = useState<Record<string, string>>({ refrigeracao: "nao" })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((a) => ({ ...a, [k]: e.target.value }))

  useEffect(() => {
    const supabase = createClient()
    async function iniciar() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace("/login")
        return
      }
      const uid = data.user.id
      setUserId(uid)

      const isMaster = data.user.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase()
      const { data: perfil } = await supabase.from("profiles").select("tipo").eq("id", uid).maybeSingle()
      if (perfil?.tipo === "admin" || isMaster) {
        router.replace("/admin")
        return
      }

      const [e, i, m] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("intermediarios").select("id").eq("perfil_id", uid).maybeSingle(),
      ])
      if (e.data || i.data || m.data) {
        router.replace("/dashboard")
        return
      }

      if (perfil?.tipo && ["empresa", "instituicao", "intermediario"].includes(perfil.tipo)) {
        setTipo(perfil.tipo as Tipo)
        setTipoFixo(true)
      }
      setCarregando(false)
    }
    iniciar()
  }, [router])

  const numero = (v?: string) => (v && v.trim() !== "" ? Number(v) : null)

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault()
    setErro("")
    if (!tipo) return setErro("Escolha o tipo de conta.")

    const cnpj = (f.cnpj || "").replace(/\D/g, "")
    const cep = (f.cep || "").replace(/\D/g, "")
    const estado = (f.estado || "").trim().toUpperCase()
    if (!f.razao_social?.trim()) return setErro("Informe a razão social.")
    if (cnpj.length !== 14 && (tipo !== "instituicao" || cnpj.length > 0))
      return setErro("O CNPJ deve ter 14 números.")
    if (!f.endereco?.trim() || !f.cidade?.trim()) return setErro("Informe endereço e cidade.")
    if (estado.length !== 2) return setErro("Informe o estado com 2 letras (ex.: SP).")
    if (cep.length !== 8) return setErro("O CEP deve ter 8 números.")

    const base = {
      perfil_id: userId,
      razao_social: f.razao_social.trim(),
      endereco: f.endereco.trim(),
      cidade: f.cidade.trim(),
      estado,
      cep,
    }

    let tabela = ""
    let dados: Record<string, unknown> = {}
    if (tipo === "empresa") {
      tabela = "empresas"
      dados = {
        ...base,
        cnpj,
        nome_fantasia: f.nome_fantasia?.trim() || null,
        inscricao_est: f.inscricao_est?.trim() || null,
        contato_nome: f.contato_nome?.trim() || null,
        contato_cargo: f.contato_cargo?.trim() || null,
      }
    } else if (tipo === "instituicao") {
      if (!f.tipo_instituicao) return setErro("Escolha o tipo da instituição.")
      tabela = "instituicoes"
      dados = {
        ...base,
        cnpj: cnpj || null,
        tipo_instituicao: f.tipo_instituicao,
        capacidade_atend: numero(f.capacidade_atend),
        pessoas_atendidas: numero(f.pessoas_atendidas),
        responsavel_tecnico: f.responsavel_tecnico?.trim() || null,
        alvara_sanitario: f.alvara_sanitario?.trim() || null,
        validade_alvara: f.validade_alvara || null,
      }
    } else {
      if (!f.tipo_intermediario) return setErro("Escolha o tipo do intermediário.")
      tabela = "intermediarios"
      dados = {
        ...base,
        cnpj,
        tipo_intermediario: f.tipo_intermediario,
        capacidade_armazen: numero(f.capacidade_armazen),
        possui_refrigeracao: f.refrigeracao === "sim",
      }
    }

    setEnviando(true)
    const supabase = createClient()
    const { data: perfilAtual } = await supabase.from("profiles").select("tipo").eq("id", userId).maybeSingle()
    if (perfilAtual && !perfilAtual.tipo) {
      await supabase.from("profiles").update({ tipo }).eq("id", userId)
    }
    const { error } = await supabase.from(tabela).insert(dados)
    setEnviando(false)
    if (error) return setErro("Não foi possível salvar: " + error.message)
    router.replace("/dashboard")
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071B17] text-emerald-400 font-mono text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
        Carregando formulário institucional...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#071B17] text-[#F8FAFC] py-12 px-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-2xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-[#071B17] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FoodCycle</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-[11px] font-medium text-emerald-300 mb-3">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Etapa de Credenciamento Institucional
          </div>
          <h1 className="text-3xl font-black text-white font-serif">
            Complete seu Perfil Operacional
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Dados cadastrais necessários para emissão de termos de doação e relatórios conforme a Lei nº 15.224/2025.
          </p>
        </div>

        {/* Card Formulário */}
        <div className="rounded-2xl border border-emerald-900/50 bg-[#071B17]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <form onSubmit={enviar} className="space-y-5">
            {!tipoFixo && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Tipo de Atuação
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIPOS.map((t) => {
                    const Icon = t.icon
                    const isSelected = tipo === t.valor
                    return (
                      <button
                        key={t.valor}
                        type="button"
                        onClick={() => setTipo(t.valor)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/80 text-white shadow-md shadow-emerald-900/30"
                            : "border-emerald-900/40 bg-[#0A241F]/40 text-slate-400 hover:bg-emerald-950/30 hover:text-slate-200"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                        <span className="text-xs font-bold">{t.rotulo}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {tipoFixo && (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-400">Modalidade de Conta:</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wide">
                  {TIPOS.find((t) => t.valor === tipo)?.rotulo}
                </span>
              </div>
            )}

            {tipo && (
              <>
                <Campo rotulo="Razão Social ou Nome Oficial *">
                  <input
                    className={campoClass}
                    value={f.razao_social || ""}
                    onChange={set("razao_social")}
                    placeholder="Ex: Supermercado Aliança Ltda."
                  />
                </Campo>

                <Campo rotulo={tipo === "instituicao" ? "CNPJ (opcional para coletivos)" : "CNPJ *"}>
                  <input
                    className={campoClass}
                    value={f.cnpj || ""}
                    onChange={(e) => setF((a) => ({ ...a, cnpj: formatarCnpj(e.target.value) }))}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    inputMode="numeric"
                  />
                </Campo>

                {tipo === "empresa" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Nome Fantasia">
                      <input className={campoClass} value={f.nome_fantasia || ""} onChange={set("nome_fantasia")} placeholder="Ex: Super Aliança" />
                    </Campo>
                    <Campo rotulo="Inscrição Estadual">
                      <input className={campoClass} value={f.inscricao_est || ""} onChange={set("inscricao_est")} placeholder="Opcional" />
                    </Campo>
                    <Campo rotulo="Nome do Contato Principal">
                      <input className={campoClass} value={f.contato_nome || ""} onChange={set("contato_nome")} placeholder="Responsável pelo setor" />
                    </Campo>
                    <Campo rotulo="Cargo do Contato">
                      <input className={campoClass} value={f.contato_cargo || ""} onChange={set("contato_cargo")} placeholder="Ex: Gerente de Operações" />
                    </Campo>
                  </div>
                )}

                {tipo === "instituicao" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Tipo da Instituição *">
                      <select className={campoClass} value={f.tipo_instituicao || ""} onChange={set("tipo_instituicao")}>
                        <option value="" className="bg-[#071B17] text-white">Selecione...</option>
                        {TIPOS_INSTITUICAO.map((t) => (
                          <option key={t.valor} value={t.valor} className="bg-[#071B17] text-white">{t.rotulo}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo rotulo="Responsável Técnico / Nutricionista">
                      <input className={campoClass} value={f.responsavel_tecnico || ""} onChange={set("responsavel_tecnico")} placeholder="Opcional" />
                    </Campo>
                    <Campo rotulo="Capacidade de Atendimento (refeições/dia)">
                      <input type="number" min="0" className={campoClass} value={f.capacidade_atend || ""} onChange={set("capacidade_atend")} placeholder="Ex: 150" />
                    </Campo>
                    <Campo rotulo="Pessoas Atendidas Regularmente">
                      <input type="number" min="0" className={campoClass} value={f.pessoas_atendidas || ""} onChange={set("pessoas_atendidas")} placeholder="Ex: 80" />
                    </Campo>
                    <Campo rotulo="Alvará Sanitário (se possuir)">
                      <input className={campoClass} value={f.alvara_sanitario || ""} onChange={set("alvara_sanitario")} placeholder="Nº do registro" />
                    </Campo>
                    <Campo rotulo="Validade do Alvará">
                      <input type="date" className={campoClass} value={f.validade_alvara || ""} onChange={set("validade_alvara")} />
                    </Campo>
                  </div>
                )}

                {tipo === "intermediario" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Tipo do Intermediário *">
                      <select className={campoClass} value={f.tipo_intermediario || ""} onChange={set("tipo_intermediario")}>
                        <option value="" className="bg-[#071B17] text-white">Selecione...</option>
                        {TIPOS_INTERMEDIARIO.map((t) => (
                          <option key={t.valor} value={t.valor} className="bg-[#071B17] text-white">{t.rotulo}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo rotulo="Capacidade de Armazenamento (kg)">
                      <input type="number" min="0" className={campoClass} value={f.capacidade_armazen || ""} onChange={set("capacidade_armazen")} placeholder="Ex: 5000" />
                    </Campo>
                    <Campo rotulo="Possui Refrigeração?">
                      <select className={campoClass} value={f.refrigeracao} onChange={set("refrigeracao")}>
                        <option value="nao" className="bg-[#071B17] text-white">Não</option>
                        <option value="sim" className="bg-[#071B17] text-white">Sim (câmara fria ou baú refrigerado)</option>
                      </select>
                    </Campo>
                  </div>
                )}

                <Campo rotulo="Endereço Completo (Rua, Número, Bairro) *">
                  <input className={campoClass} value={f.endereco || ""} onChange={set("endereco")} placeholder="Av. Paulista, 1000 - Bela Vista" />
                </Campo>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Campo rotulo="Cidade *">
                    <input className={campoClass} value={f.cidade || ""} onChange={set("cidade")} placeholder="São Paulo" />
                  </Campo>
                  <Campo rotulo="Estado (UF) *">
                    <input className={campoClass} maxLength={2} value={f.estado || ""} onChange={set("estado")} placeholder="SP" />
                  </Campo>
                  <Campo rotulo="CEP *">
                    <input className={campoClass} value={f.cep || ""} onChange={set("cep")} placeholder="00000-000" />
                  </Campo>
                </div>
              </>
            )}

            {erro && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                <span className="font-bold">Atenção:</span> {erro}
              </div>
            )}

            <Button
              type="submit"
              disabled={enviando || !tipo}
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#071B17] font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {enviando ? "Gravando Cadastro..." : "Finalizar Credenciamento e Acessar"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Conformidade PNCPDA • Lei nº 15.224/2025
        </div>
      </div>
    </div>
  )
}
