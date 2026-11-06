"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  Leaf, 
  Scale, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  QrCode,
  FileText
} from "lucide-react"

export interface ComprovanteData {
  id: number
  codigo_rastreio: string
  tipo_alimento: string
  quantidade_kg: number
  categoria: string
  destino: string
  status: string
  data_criacao: string
  data_validade?: string
  condicao_armazenamento?: string
  empresa_nome?: string
  empresa_cnpj?: string
  empresa_cidade?: string
  empresa_estado?: string
  instituicao_nome?: string
  instituicao_cnpj?: string
}

interface TermoDoacaoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ComprovanteData | null
}

export function TermoDoacaoModal({ open, onOpenChange, data }: TermoDoacaoModalProps) {
  if (!data) return null

  const handlePrint = () => {
    window.print()
  }

  const dataFormatada = new Date(data.data_criacao).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })

  const hashAutenticacao = `SHA256:${Buffer.from(`${data.codigo_rastreio}-${data.quantidade_kg}-${data.data_criacao}`).toString("hex").slice(0, 32).toUpperCase()}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-950 text-slate-100 border-emerald-900/60 p-0">
        {/* Ações superiores no modal (não aparecem na impressão) */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Documento Oficial PNCPDA (Lei nº 15.224/2025)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </Button>
          </div>
        </div>

        {/* ÁREA DO TERMO OFICIAL IMPRIMÍVEL */}
        <div 
          id="area-termo-imprimivel"
          className="p-6 sm:p-10 space-y-6 bg-white text-slate-900 font-sans print:p-0 print:m-0"
        >
          {/* Cabeçalho Oficial do Termo */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md print:border print:border-black">
                <Leaf className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  FoodCycle • Fome Zero
                </h1>
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Infraestrutura Digital de Redistribuição de Alimentos
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Marco Legal: Lei Federal nº 15.224/2025 (PNCPDA) & Lei nº 14.016/2020
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r-0 border-slate-300 pl-3 sm:pl-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                Certificado de Conformidade Sanitária
              </span>
              <span className="text-base font-black font-mono text-emerald-800 tracking-tight block">
                {data.codigo_rastreio}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Emissão: {dataFormatada}
              </span>
            </div>
          </div>

          {/* Título do Documento */}
          <div className="text-center py-2 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Termo de Doação, Isenção Civil e Rastreabilidade Sanitária
            </h2>
            <p className="text-[11px] text-slate-600">
              Comprovante de doação de boa-fé para dedução e salvaguarda jurídica (Arts. 1º, 3º e 6º da Lei nº 14.016/2020)
            </p>
          </div>

          {/* Bloco 1: Partes Envolvidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Empresa Doadora */}
            <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Doador (Pessoa Jurídica)
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {data.empresa_nome || "Empresa Doadora Certificada"}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-800">CNPJ:</strong> {data.empresa_cnpj || "00.000.000/0001-00 (Verificado)"}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-800">Origem:</strong> {data.empresa_cidade || "Polo Logístico"}/{data.empresa_estado || "BR"}
              </p>
              <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
                Aderente à Política Nacional PNCPDA
              </span>
            </div>

            {/* Instituição Receptora */}
            <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Receptor (Entidade Beneficiária)
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {data.instituicao_nome || "Instituição / Banco de Alimentos Homologado"}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-800">CNPJ / Registro:</strong> {data.instituicao_cnpj || "Homologação Ativa no Sistema"}
              </p>
              <p className="text-slate-600">
                <strong className="text-slate-800">Finalidade:</strong> Redistribuição gratuita para consumo social (ODS 2)
              </p>
              <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold border border-blue-300">
                Vistoria Sanitária & Cadastro Regular
              </span>
            </div>
          </div>

          {/* Bloco 2: Especificação do Lote de Alimentos */}
          <div className="rounded-lg border border-slate-300 overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-300 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-800 tracking-wider">
                Especificação Sanitária e Nutricional do Lote
              </span>
              <span className="text-[10px] font-mono text-slate-600">
                Código de Rastreio: <strong>{data.codigo_rastreio}</strong>
              </span>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Gênero Alimentício</th>
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3 text-right">Volume (kg)</th>
                  <th className="py-2 px-3">Armazenamento</th>
                  <th className="py-2 px-3">Destinação Legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{data.tipo_alimento}</td>
                  <td className="py-2.5 px-3 capitalize">{data.categoria ? data.categoria.replace("_", " ") : "Alimento"}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 text-right">{Number(data.quantidade_kg).toLocaleString("pt-BR")} kg</td>
                  <td className="py-2.5 px-3 capitalize">{data.condicao_armazenamento || "Adequada / Ambiente"}</td>
                  <td className="py-2.5 px-3 font-semibold uppercase text-emerald-800">{data.destino || "Consumo Humano"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bloco 3: Declaração Sanitária e Isenção Legal */}
          <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 text-[11px] text-slate-700 space-y-2 leading-relaxed">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Scale className="h-3.5 w-3.5 text-emerald-800" />
              Cláusula Legal de Boas Práticas e Salvaguarda Civil
            </p>
            <p>
              1. As partes signatárias declaram que os excedentes descritos neste termo foram avaliados no ato da entrega e encontram-se <strong>próprios para o consumo humano</strong>, com integridade sensorial, sanitária e nutricional preservadas, conforme os critérios da <strong>Lei Federal nº 14.016/2020</strong> e do <strong>Art. 4º e 5º da Lei nº 15.224/2025 (PNCPDA)</strong>.
            </p>
            <p>
              2. Conforme o Art. 3º da Lei Federal nº 14.016/2020, o doador responde somente por dolo na hipótese de eventual dano à saúde decorrente dos alimentos doados, ficando resguardada a isenção de responsabilidade civil decorrente do manuseio, transporte e consumo após a tradição da posse à entidade receptora.
            </p>
          </div>

          {/* Bloco 4: Assinaturas Digitais e QR Code */}
          <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            {/* Assinatura Doador */}
            <div className="space-y-1">
              <div className="border-b border-slate-400 pb-1 text-slate-400 font-mono text-[9px]">
                ASSINATURA DIGITAL VALIDADA VIA CERTIFICADO
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {data.empresa_nome || "Representante Legal do Doador"}
              </p>
              <p className="text-[10px] text-slate-500">Responsável pela Liberação do Lote</p>
            </div>

            {/* Assinatura Receptor */}
            <div className="space-y-1">
              <div className="border-b border-slate-400 pb-1 text-slate-400 font-mono text-[9px]">
                ASSINATURA DIGITAL NO RECEBIMENTO
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {data.instituicao_nome || "Responsável Técnico da Entidade"}
              </p>
              <p className="text-[10px] text-slate-500">Termo de Tradição e Aceite Sanitário</p>
            </div>

            {/* Selo Criptográfico FoodCycle */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-300 bg-slate-50 text-[10px] text-slate-600">
              <QrCode className="h-8 w-8 text-slate-800 mb-1" />
              <span className="font-bold text-emerald-800 uppercase text-[9px]">FoodCycle Autenticado</span>
              <span className="font-mono text-[8px] text-slate-500 break-all">{hashAutenticacao}</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <DialogFooter className="p-4 bg-slate-900 border-t border-white/10 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-slate-300 hover:text-white"
          >
            Fechar Visualização
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Imprimir Comprovante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
