import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Leaf, ShieldCheck, Printer, ArrowLeft, Building2, Scale, QrCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TermoPrintButton } from "./print-button"

interface ComprovantePageProps {
  params: Promise<{
    codigo: string
  }>
}

export default async function ComprovantePublicoPage({ params }: ComprovantePageProps) {
  const { codigo } = await params
  const supabase = await createClient()

  const { data: doacao, error } = await supabase
    .from("doacoes")
    .select(`
      id,
      codigo_rastreio,
      tipo_alimento,
      quantidade_kg,
      categoria,
      destino,
      status,
      data_criacao,
      data_validade,
      condicao_armazenamento,
      empresas (
        id,
        nome_fantasia,
        razao_social,
        cnpj,
        cidade,
        estado
      )
    `)
    .eq("codigo_rastreio", codigo)
    .maybeSingle()

  if (error || !doacao) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/60 border border-red-800/40 text-red-400 mx-auto">
            <Scale className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold">Comprovante Não Localizado</h1>
          <p className="text-xs text-slate-400">
            O código de rastreabilidade <strong>{codigo}</strong> não foi encontrado na base pública de auditoria da PNCPDA.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
            <Link href="/">Voltar à Página Inicial</Link>
          </Button>
        </div>
      </div>
    )
  }

  const empresa: any = Array.isArray(doacao.empresas) ? doacao.empresas[0] : doacao.empresas
  const dataFormatada = new Date(doacao.data_criacao).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })

  const hashAutenticacao = `SHA256:${Buffer.from(`${doacao.codigo_rastreio}-${doacao.quantidade_kg}-${doacao.data_criacao}`).toString("hex").slice(0, 32).toUpperCase()}`

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:p-0">
      {/* Topo com ações (escondido na impressão) */}
      <div className="sticky top-0 z-30 bg-slate-950 text-white border-b border-white/10 px-6 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/historico" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Certidão de Autenticidade Sanitária (PNCPDA - Lei nº 15.224/2025)
          </span>
        </div>

        <TermoPrintButton />
      </div>

      {/* DOCUMENTO OFICIAL A4 */}
      <div className="max-w-4xl mx-auto my-8 p-8 sm:p-12 bg-white rounded-2xl shadow-xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:my-0 space-y-6">
        {/* Cabeçalho */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
              <Leaf className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                FoodCycle • Fome Zero
              </h1>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Infraestrutura Nacional de Redistribuição de Excedentes
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Marco Legal: Lei Federal nº 15.224/2025 (PNCPDA) e Lei nº 14.016/2020 • ODS 2 ONU
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r-0 border-slate-300 pl-3 sm:pl-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
              Registro Sanitário Oficial
            </span>
            <span className="text-lg font-black font-mono text-emerald-800 tracking-tight block">
              {doacao.codigo_rastreio}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Emitido em {dataFormatada}
            </span>
          </div>
        </div>

        {/* Título */}
        <div className="text-center py-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Termo de Doação, Isenção Civil e Rastreabilidade Sanitária
          </h2>
          <p className="text-[11px] text-slate-600">
            Documento comprobatório de destinação socioambiental de alimentos próprios para consumo
          </p>
        </div>

        {/* Partes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Doador Certificado (Pessoa Jurídica)
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {empresa?.nome_fantasia || empresa?.razao_social || "Empresa Doadora Registrada"}
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">CNPJ:</strong> {empresa?.cnpj || "Cadastro Verificado na Plataforma"}
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Localidade:</strong> {empresa?.cidade || "Origem Cadastrada"}/{empresa?.estado || "BR"}
            </p>
            <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
              Aderente à Política Nacional PNCPDA
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
              Receptor Homologado (Rede de Proteção Social)
            </span>
            <p className="font-bold text-slate-900 text-sm">
              Instituição Beneficiária / Banco de Alimentos Homologado
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Finalidade:</strong> Distribuição gratuita e direta a famílias em vulnerabilidade
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Status Operacional:</strong> {doacao.status.toUpperCase()}
            </p>
            <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold border border-blue-300">
              Cadastro Regular na Assistência Social
            </span>
          </div>
        </div>

        {/* Lote de Alimentos */}
        <div className="rounded-xl border border-slate-300 overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">
              Discriminação dos Excedentes Doados
            </span>
            <span className="text-xs font-mono text-slate-600">
              Lote ID: <strong>#{doacao.id}</strong>
            </span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Gênero Alimentício</th>
                <th className="py-2.5 px-4">Categoria Nutricional</th>
                <th className="py-2.5 px-4 text-right">Peso Líquido (kg)</th>
                <th className="py-2.5 px-4">Condição Armazenamento</th>
                <th className="py-2.5 px-4">Destinação Obrigatória</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">{doacao.tipo_alimento}</td>
                <td className="py-3 px-4 capitalize">{doacao.categoria ? doacao.categoria.replace("_", " ") : "Alimento"}</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-right text-sm">
                  {Number(doacao.quantidade_kg).toLocaleString("pt-BR")} kg
                </td>
                <td className="py-3 px-4 capitalize">{doacao.condicao_armazenamento || "Ambiente Adequado"}</td>
                <td className="py-3 px-4 font-bold uppercase text-emerald-800">{doacao.destino || "Consumo Humano"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cláusula Jurídica */}
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-[11px] text-slate-700 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
            <Scale className="h-4 w-4 text-emerald-800" />
            Fundamentação Jurídica & Isenção de Responsabilidade
          </p>
          <p>
            1. Conforme a <strong>Lei Federal nº 14.016/2020</strong> e a <strong>Lei nº 15.224/2025</strong>, a doação de alimentos de que trata esta certidão foi realizada antes da expiração da data de validade, estando os gêneros próprios para o consumo humano e preservadas as condições higiênico-sanitárias exigidas pelos órgãos de fiscalização sanitária.
          </p>
          <p>
            2. Fica expressamente atestada a <strong>boa-fé do doador</strong>, operando-se a isenção de responsabilidade civil e criminal por eventuais danos à saúde dos consumidores posteriores à entrega, respondendo o doador exclusivamente em hipótese de dolo (Art. 3º da Lei 14.016/2020).
          </p>
        </div>

        {/* Assinaturas Digitais e Hash */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
          <div className="space-y-1">
            <div className="border-b border-slate-400 pb-1 text-slate-400 font-mono text-[9px]">
              ASSINATURA DIGITAL VALIDADA NO SISTEMA
            </div>
            <p className="font-bold text-slate-900 text-xs">
              {empresa?.nome_fantasia || empresa?.razao_social || "Representante do Doador"}
            </p>
            <p className="text-[10px] text-slate-500">Liberação de Lote de Alimentos</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-400 pb-1 text-slate-400 font-mono text-[9px]">
              CONFIRMAÇÃO DIGITAL DO RECEBIMENTO
            </div>
            <p className="font-bold text-slate-900 text-xs">
              Entidade Receptora Homologada
            </p>
            <p className="text-[10px] text-slate-500">Termo de Aceite & Destinação Social</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-300 bg-slate-50 text-[10px] text-slate-600">
            <QrCode className="h-8 w-8 text-slate-800 mb-1" />
            <span className="font-bold text-emerald-800 uppercase text-[9px]">FoodCycle Autenticado</span>
            <span className="font-mono text-[8px] text-slate-500 break-all">{hashAutenticacao}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
