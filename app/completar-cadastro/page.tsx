"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Tipo = "empresa" | "instituicao" | "intermediario"

const TIPOS: { valor: Tipo; rotulo: string }[] = [
  { valor: "empresa", rotulo: "Empresa doadora" },
  { valor: "instituicao", rotulo: "Instituição receptora" },
  { valor: "intermediario", rotulo: "Intermediário" },
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

const campo =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-foreground">{rotulo}</span>
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

      const [e, i, m] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("intermediarios").select("id").eq("perfil_id", uid).maybeSingle(),
      ])
      if (e.data || i.data || m.data) {
        router.replace("/dashboard")
        return
      }

      const { data: perfil } = await supabase.from("profiles").select("tipo").eq("id", uid).maybeSingle()
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
    const { error } = await supabase.from(tabela).insert(dados)
    setEnviando(false)
    if (error) return setErro("Não foi possível salvar: " + error.message)
    router.replace("/dashboard")
  }

  if (carregando) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="mx-auto max-w-2xl p-4 py-10">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Completar cadastro</CardTitle>
          <CardDescription>Preencha os dados da sua organização para acessar o FoodCycle.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="space-y-4">
            {!tipoFixo && (
              <Campo rotulo="Tipo de conta">
                <select className={campo} value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}>
                  <option value="">Selecione...</option>
                  {TIPOS.map((t) => (
                    <option key={t.valor} value={t.valor}>{t.rotulo}</option>
                  ))}
                </select>
              </Campo>
            )}
            {tipoFixo && (
              <p className="text-sm text-muted-foreground">
                Tipo de conta: <strong className="text-foreground">{TIPOS.find((t) => t.valor === tipo)?.rotulo}</strong>
              </p>
            )}

            {tipo && (
              <>
                <Campo rotulo="Razão social *">
                  <input className={campo} value={f.razao_social || ""} onChange={set("razao_social")} />
                </Campo>
                <Campo rotulo={tipo === "instituicao" ? "CNPJ (opcional)" : "CNPJ *"}>
                 <input
  className={campo}
  value={f.cnpj || ""}
  onChange={(e) => setF((a) => ({ ...a, cnpj: formatarCnpj(e.target.value) }))}
  placeholder="00.000.000/0000-00"
  maxLength={18}
  inputMode="numeric"
/>
                </Campo>

                {tipo === "empresa" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Nome fantasia">
                      <input className={campo} value={f.nome_fantasia || ""} onChange={set("nome_fantasia")} />
                    </Campo>
                    <Campo rotulo="Inscrição estadual">
                      <input className={campo} value={f.inscricao_est || ""} onChange={set("inscricao_est")} />
                    </Campo>
                    <Campo rotulo="Nome do contato">
                      <input className={campo} value={f.contato_nome || ""} onChange={set("contato_nome")} />
                    </Campo>
                    <Campo rotulo="Cargo do contato">
                      <input className={campo} value={f.contato_cargo || ""} onChange={set("contato_cargo")} />
                    </Campo>
                  </div>
                )}

                {tipo === "instituicao" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Tipo da instituição *">
                      <select className={campo} value={f.tipo_instituicao || ""} onChange={set("tipo_instituicao")}>
                        <option value="">Selecione...</option>
                        {TIPOS_INSTITUICAO.map((t) => (
                          <option key={t.valor} value={t.valor}>{t.rotulo}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo rotulo="Responsável técnico">
                      <input className={campo} value={f.responsavel_tecnico || ""} onChange={set("responsavel_tecnico")} />
                    </Campo>
                    <Campo rotulo="Capacidade de atendimento">
                      <input type="number" min="0" className={campo} value={f.capacidade_atend || ""} onChange={set("capacidade_atend")} />
                    </Campo>
                    <Campo rotulo="Pessoas atendidas">
                      <input type="number" min="0" className={campo} value={f.pessoas_atendidas || ""} onChange={set("pessoas_atendidas")} />
                    </Campo>
                    <Campo rotulo="Alvará sanitário">
                      <input className={campo} value={f.alvara_sanitario || ""} onChange={set("alvara_sanitario")} />
                    </Campo>
                    <Campo rotulo="Validade do alvará">
                      <input type="date" className={campo} value={f.validade_alvara || ""} onChange={set("validade_alvara")} />
                    </Campo>
                  </div>
                )}

                {tipo === "intermediario" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo rotulo="Tipo do intermediário *">
                      <select className={campo} value={f.tipo_intermediario || ""} onChange={set("tipo_intermediario")}>
                        <option value="">Selecione...</option>
                        {TIPOS_INTERMEDIARIO.map((t) => (
                          <option key={t.valor} value={t.valor}>{t.rotulo}</option>
                        ))}
                      </select>
                    </Campo>
                    <Campo rotulo="Capacidade de armazenamento (kg)">
                      <input type="number" min="0" className={campo} value={f.capacidade_armazen || ""} onChange={set("capacidade_armazen")} />
                    </Campo>
                    <Campo rotulo="Possui refrigeração?">
                      <select className={campo} value={f.refrigeracao} onChange={set("refrigeracao")}>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                      </select>
                    </Campo>
                  </div>
                )}

                <Campo rotulo="Endereço *">
                  <input className={campo} value={f.endereco || ""} onChange={set("endereco")} />
                </Campo>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Campo rotulo="Cidade *">
                    <input className={campo} value={f.cidade || ""} onChange={set("cidade")} />
                  </Campo>
                  <Campo rotulo="Estado (UF) *">
                    <input className={campo} maxLength={2} value={f.estado || ""} onChange={set("estado")} placeholder="SP" />
                  </Campo>
                  <Campo rotulo="CEP *">
                    <input className={campo} value={f.cep || ""} onChange={set("cep")} placeholder="00000-000" />
                  </Campo>
                </div>
              </>
            )}

            {erro && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}

            <Button type="submit" disabled={enviando || !tipo} className="w-full">
              {enviando ? "Salvando..." : "Salvar cadastro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
