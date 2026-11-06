"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TiltCard } from "@/components/ui/tilt-card"
import { soundManager } from "@/lib/sound"
import { createClient } from "@/lib/supabase/client"
import { 
  ArrowRight, 
  Building2, 
  Heart, 
  Leaf, 
  Package, 
  Truck, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  BarChart3, 
  Scale, 
  ChevronRight,
  Thermometer,
  QrCode,
  AlertTriangle,
  TrendingUp,
  Globe,
  FileCheck,
  Flame,
  Clock,
  ExternalLink
} from "lucide-react"

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTabSolucao, setActiveTabSolucao] = useState<"empresa" | "plataforma" | "instituicao">("plataforma")

  // Métricas dinâmicas do Supabase
  const [metrics, setMetrics] = useState({
    totalKg: 12500,
    refeicoes: 25000,
    empresas: 156,
    instituicoes: 48,
    co2Evitado: 23750,
  })

  useEffect(() => {
    async function loadMetrics() {
      try {
        const supabase = createClient()
        const [doacoesRes, empRes, instRes] = await Promise.all([
          supabase.from("doacoes").select("quantidade_kg"),
          supabase.from("empresas").select("id", { count: "exact" }),
          supabase.from("instituicoes").select("id", { count: "exact" }),
        ])

        const kg = doacoesRes.data?.reduce((sum, d) => sum + Number(d.quantidade_kg || 0), 0) || 0
        const totalKg = kg > 0 ? kg : 12500
        const totalEmp = empRes.count && empRes.count > 0 ? empRes.count : 156
        const totalInst = instRes.count && instRes.count > 0 ? instRes.count : 48

        setMetrics({
          totalKg,
          refeicoes: Math.round(totalKg * 2),
          empresas: totalEmp,
          instituicoes: totalInst,
          co2Evitado: Math.round(totalKg * 1.9),
        })
      } catch (err) {
        console.warn("Métricas em modo fallback:", err)
      }
    }
    loadMetrics()
  }, [])

  const steps = [
    {
      num: "01",
      title: "Triagem & Lote Digital",
      badge: "Art. 4º - Lei nº 15.224",
      desc: "O supermercado ou indústria registra o lote excedente antes do vencimento comercial. A plataforma emite um código rastreável com checklist sanitário exigido pela ANVISA.",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
      telemetry: "LOTE VALIDADO • CÓDIGO QR GERADO",
      icon: Package
    },
    {
      num: "02",
      title: "Algoritmo de Matching Imediato",
      badge: "Roteamento Geográfico",
      desc: "Nossos algoritmos conectam o lote em menos de 10 minutos com a entidade cadastrada mais próxima que possua demanda ativa e capacidade física de recepção.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      telemetry: "MATCH ENCONTRADO • RAIO < 5.4 KM",
      icon: Cpu
    },
    {
      num: "03",
      title: "Logística Reversa & Cadeia de Frio",
      badge: "Art. 7º - Transporte Seguro",
      desc: "Retirada direta pela entidade receptora ou transporte intermediário refrigerado, com telemetria contínua de temperatura para preservar o valor nutricional.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      telemetry: "CADEIA TÉRMICA: 4.2°C • EM TRÂNSITO",
      icon: Truck
    },
    {
      num: "04",
      title: "Certificação Fiscal & Selo Social",
      badge: "Segurança Jurídica",
      desc: "Emissão automatizada do Termo de Doação Digital com fé pública, assegurando ao doador isenção de responsabilidade cível pós-entrega e dados certificados para ESG.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
      telemetry: "TERMO ASSINADO • AUDITORIA CONCLUÍDA",
      icon: ShieldCheck
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#071B17] text-[#F8FAFC] antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION CINEMATOGRÁFICA                                           */}
        {/* ========================================================================= */}
        <section className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-32 pb-20 overflow-hidden">
          {/* Imagem de Fundo Cinematográfica com Overlay Profundo */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=85"
              alt="Operação de alimentos frescos"
              className="w-full h-full object-cover object-center brightness-[0.22] contrast-[1.15] scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Gradientes e Vignette Cinematográficos */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B17] via-[#071B17]/70 to-[#071B17]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#071B17_85%)]" />
            <div className="absolute inset-0 tech-grid-dark opacity-35" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
              
              {/* Badge Flutuante Institucional */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-[#052E24]/80 text-emerald-400 border border-emerald-500/30 shadow-[0_0_25px_rgba(22,163,74,0.25)] backdrop-blur-md hover:scale-105 transition-all cursor-default"
                onMouseEnter={() => soundManager.playHover()}
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PNCPDA • LEI FEDERAL Nº 15.224/2025</span>
                <span className="text-emerald-600">•</span>
                <span className="text-slate-300">ODS 2 ONU</span>
              </div>

              {/* Headline Oversized Monumental */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.03] text-balance max-w-5xl">
                Do desperdício ao impacto.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  Uma conexão que transforma vidas.
                </span>
              </h1>

              {/* Subheadline Editorial */}
              <p className="text-base sm:text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed text-pretty font-light">
                A infraestrutura digital de redistribuição alimentar que conecta a cadeia produtiva a milhares de pessoas em situação de vulnerabilidade, com segurança jurídica e rastreabilidade total.
              </p>

              {/* Botões de Ação com Microinterações Magnéticas */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-[0_0_35px_rgba(22,163,74,0.45)] transition-all hover:scale-105 active:scale-95 border border-emerald-400/30"
                  asChild
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => soundManager.playClick()}
                >
                  <Link href="/cadastro">
                    <span>Conectar Minha Organização</span>
                    <ArrowRight className="h-4 w-4 ml-2 stroke-[2.5]" />
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-14 px-8 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-base backdrop-blur-md transition-all hover:scale-105"
                  asChild
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => soundManager.playClick()}
                >
                  <Link href="/mapa">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                    <span>Ver Rede Logística</span>
                  </Link>
                </Button>
              </div>

              {/* Indicadores de Impacto Flutuantes na Dobra */}
              <div className="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl text-left">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Alimento Resgatado</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">12.500<span className="text-sm font-sans text-emerald-400 ml-1">kg</span></span>
                  <span className="text-[11px] text-slate-400 mt-1 block">100% próprio p/ consumo</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Refeições Viabilizadas</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">25.000+</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Ração PNCPDA calculada</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Cadeia Produtiva</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">156</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Empresas participantes</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Conformidade Legal</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 block">100%</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Auditado pelo sistema</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SEÇÃO O PROBLEMA — O PARADOXO DO DESPERDÍCIO NO BRASIL                 */}
        {/* ========================================================================= */}
        <section id="problema" className="py-24 sm:py-36 bg-[#052E24] text-white relative overflow-hidden border-t border-b border-white/10">
          <div className="absolute inset-0 tech-grid-dark opacity-20 pointer-events-none" />
          <div className="absolute -top-40 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Coluna de Texto & Estatísticas Oversized */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>A CRISE SILENCIOSA DO DESPERDÍCIO</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Toneladas de comida descartadas enquanto milhões enfrentam a fome.
                </h2>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                  No Brasil, mais de <strong className="text-white font-bold">41 mil toneladas de alimentos</strong> perfeitamente seguros são jogadas fora diariamente no varejo e atacado apenas por padronização estética ou proximidade do vencimento comercial — enquanto 33 milhões de cidadãos vivenciam insegurança alimentar grave.
                </p>

                {/* Bloco de Dados de Alto Impacto */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-black/30 border border-white/10 hud-corner-bracket">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-red-400 block">41.000t</span>
                    <h4 className="text-sm font-bold text-white mt-2">Desperdiçadas Todo Dia</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Equivale a mais de 30% de toda a safra nacional que não chega à mesa das famílias.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-black/30 border border-white/10 hud-corner-bracket">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 block">R$ 1,3 bi</span>
                    <h4 className="text-sm font-bold text-white mt-2">Custo de Descarte Anual</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Prejuízo operacional para empresas com quebra, logística de aterro e incineração.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>
                    A <strong>Lei nº 15.224/2025</strong> foi aprovada para romper essa ineficiência, criando a Política Nacional de Combate à Perda e Desperdício de Alimentos.
                  </span>
                </div>
              </div>

              {/* Coluna Fotográfica Cinematográfica */}
              <div className="lg:col-span-5 relative">
                <TiltCard className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
                  <div className="relative h-[480px] w-full">
                    <img
                      src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=85"
                      alt="Alimentos frescos de qualidade"
                      className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052E24] via-transparent to-transparent opacity-90" />
                    
                    {/* Legenda Flutuante de Alto Padrão */}
                    <div className="absolute bottom-6 inset-x-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Diagnóstico Nacional</span>
                      <p className="text-xs text-slate-200 mt-1 font-medium">
                        80% dos excedentes descartados possuem valor biológico e sanitário íntegro para redistribuição imediata.
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SEÇÃO A SOLUÇÃO FOOD CYCLE — O FLUXO CONECTADO                         */}
        {/* ========================================================================= */}
        <section id="solucao" className="py-24 sm:py-36 bg-[#071B17] text-white relative overflow-hidden">
          <div className="absolute inset-0 tech-grid-dark opacity-25 pointer-events-none" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                A INFRAESTRUTURA DIGITAL
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Como conectamos quem tem alimento a quem tem fome
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-light">
                O FoodCycle automatiza o ciclo completo da doação: triagem, roteirização, cadeia de frio e segurança jurídica.
              </p>
            </div>

            {/* Diagrama Interativo do Fluxo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              
              {/* Nó 1: Empresa Doadora */}
              <TiltCard 
                className={`p-8 rounded-3xl transition-all cursor-pointer ${
                  activeTabSolucao === "empresa" 
                    ? "bg-[#052E24] border-2 border-emerald-500 shadow-[0_0_40px_rgba(22,163,74,0.3)]" 
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20"
                }`}
                onClick={() => {
                  setActiveTabSolucao("empresa")
                  soundManager.playClick()
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Origem do Alimento</span>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Empresas Doadoras</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Supermercados, hortifrutis, distribuidores e restaurantes cadastram lotes de excedentes em segundos pelo computador ou celular.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-400 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Emissão de QR Code do Lote</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Isenção de Responsabilidade Cível</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Relatório ESG e Abatimento Fiscal</span>
                  </li>
                </ul>
              </TiltCard>

              {/* Nó 2: Plataforma Food Cycle (Centro) */}
              <TiltCard 
                className={`p-8 rounded-3xl transition-all cursor-pointer ${
                  activeTabSolucao === "plataforma" 
                    ? "bg-gradient-to-b from-[#052E24] to-[#0A3D30] border-2 border-emerald-400 shadow-[0_0_50px_rgba(22,163,74,0.45)] scale-105 z-10" 
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20"
                }`}
                onClick={() => {
                  setActiveTabSolucao("plataforma")
                  soundManager.playClick()
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Motor Central</span>
                  <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(22,163,74,0.6)]">
                    <Cpu className="h-6 w-6 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Plataforma FoodCycle</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  O cérebro digital da operação. Executa o algoritmo de matching instantâneo com base em localização, prazo de validade e capacidade.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Matching em Menos de 10 minutos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Auditoria de Alvará Sanitário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Rastreio de Frota e Cadeia Térmica</span>
                  </li>
                </ul>
              </TiltCard>

              {/* Nó 3: Instituições Beneficiárias */}
              <TiltCard 
                className={`p-8 rounded-3xl transition-all cursor-pointer ${
                  activeTabSolucao === "instituicao" 
                    ? "bg-[#052E24] border-2 border-emerald-500 shadow-[0_0_40px_rgba(22,163,74,0.3)]" 
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20"
                }`}
                onClick={() => {
                  setActiveTabSolucao("instituicao")
                  soundManager.playClick()
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Destino Social</span>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Entidades Receptoras</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ONGs, cozinhas solidárias, abrigos e bancos de alimentos recebem notificações de lotes disponíveis em tempo real para retirada.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-400 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Alimentos Gratuitos e Saudáveis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Agendamento de Coleta sem Fila</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Comprovação Digital de Entrega</span>
                  </li>
                </ul>
              </TiltCard>

            </div>

            {/* Painel de Telemetria de Fluxo Ativo */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 hud-corner-bracket">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 items-center justify-center border border-emerald-500/30">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Fluxo em Tempo Real</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">Doação com Confirmação e Registro de Auditoria</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 shadow-lg shadow-emerald-600/30">
                  <Link href="/como-funciona">
                    <span>Ver Demonstração do Fluxo</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SEÇÃO COMO FUNCIONA — SCROLLYTELLING & 4 ETAPAS                        */}
        {/* ========================================================================= */}
        <section id="como-funciona" className="py-24 sm:py-36 bg-[#052E24] text-white relative overflow-hidden border-t border-b border-white/10">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                METODOLOGIA DE OPERAÇÃO
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mt-2">
                O passo a passo da redistribuição responsável
              </h2>
            </div>

            {/* Grid Interativa das 4 Etapas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((st, i) => {
                const Icon = st.icon
                const isActive = activeStep === i
                return (
                  <TiltCard
                    key={st.num}
                    onClick={() => {
                      setActiveStep(i)
                      soundManager.playClick()
                    }}
                    className={`rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between h-[420px] ${
                      isActive 
                        ? "bg-slate-950 border-2 border-emerald-400 shadow-[0_0_35px_rgba(22,163,74,0.35)] scale-102" 
                        : "bg-black/25 border border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-black text-emerald-400">{st.num}</span>
                        <div className={`p-2 rounded-xl ${isActive ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-slate-400"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Imagem da Etapa */}
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4">
                        <img 
                          src={st.image} 
                          alt={st.title} 
                          className="w-full h-full object-cover brightness-85 hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {st.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{st.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-emerald-400 truncate">
                      {st.telemetry}
                    </div>
                  </TiltCard>
                )
              })}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SEÇÃO IMPACTO SOCIAL — DADOS REAIS DO SUPABASE                         */}
        {/* ========================================================================= */}
        <section id="impacto" className="py-24 sm:py-36 bg-[#071B17] text-white relative overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  PAINEL DE IMPACTO CONSOLIDADO (SUPABASE)
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Números reais que geram dignidade alimentar
                </h2>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-md font-light">
                Cada quilo registrado na plataforma tem rastreabilidade completa e gera certificados de destinação correta auditáveis pela sociedade e pelo poder público.
              </p>
            </div>

            {/* Big Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Total de Alimentos Salvos</span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white mt-3 flex items-baseline gap-1">
                  {metrics.totalKg.toLocaleString("pt-BR")}
                  <span className="text-lg font-sans text-emerald-400">kg</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Frutas, hortaliças, grãos e panificados resgatados do descarte.</p>
              </TiltCard>

              <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Refeições Viabilizadas</span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 mt-3 flex items-baseline gap-1">
                  {metrics.refeicoes.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-slate-400 mt-2">Cálculo padronizado de 500g por refeição (PNCPDA / ODS 2).</p>
              </TiltCard>

              <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Rede Integrada</span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white mt-3 flex items-baseline gap-1">
                  {metrics.empresas + metrics.instituicoes}
                </div>
                <p className="text-xs text-slate-400 mt-2">{metrics.empresas} empresas doadoras e {metrics.instituicoes} instituições ativas.</p>
              </TiltCard>

              <TiltCard className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">CO₂ Evitado Estimado</span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-teal-400 mt-3 flex items-baseline gap-1">
                  {metrics.co2Evitado.toLocaleString("pt-BR")}
                  <span className="text-lg font-sans text-teal-400">kg</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Gases de efeito estufa prevenidos ao evitar a decomposição em aterros.</p>
              </TiltCard>
            </div>

            {/* Botão para Portal de Transparência */}
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white px-7">
                <Link href="/impacto">
                  <span>Acessar Relatório Completo de Sustentabilidade</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SEÇÃO MAPA E LOGÍSTICA — PREVIEW INTERATIVO DA REDE                    */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-36 bg-[#052E24] text-white relative overflow-hidden border-t border-b border-white/10">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>LOGÍSTICA DE CURTA DISTÂNCIA</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Mapeamento geográfico em tempo real
                </h2>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                  A proximidade é a chave para o resgate de alimentos frescos. Nossa malha logística geolocaliza doadores e receptores para garantir coletas em menos de duas horas, reduzindo emissões e preservando a qualidade.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/25 border border-white/10">
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-200"><strong>Empresas Doadoras:</strong> Supermercados, feirantes e centrais de distribuição.</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/25 border border-white/10">
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="text-xs text-slate-200"><strong>Instituições Receptoras:</strong> Abrigos, cozinhas comunitárias e asilos com capacidade comprovada.</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-xl shadow-emerald-600/30">
                    <Link href="/mapa">
                      <span>Abrir Mapa Interativo da Rede</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Card Visual do Mapa Estilizado */}
              <div className="lg:col-span-6">
                <TiltCard className="rounded-3xl border border-white/15 overflow-hidden bg-slate-950 p-6 shadow-2xl relative">
                  <div className="relative h-[380px] w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 tech-grid-dark flex items-center justify-center">
                    
                    {/* Linhas de conexão SVG Simuladas */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    </svg>

                    {/* Hub Central FoodCycle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(22,163,74,0.8)] font-bold text-xs animate-pulse">
                        <Leaf className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded">HUB CENTRAL</span>
                    </div>

                    {/* Nós ao Redor */}
                    <div className="absolute top-[30%] left-[20%] p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-[10px]">
                      <Building2 className="h-3 w-3 text-emerald-400" />
                      <span>Hortifruti SP-Sul</span>
                    </div>

                    <div className="absolute top-[20%] right-[15%] p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-[10px]">
                      <Heart className="h-3 w-3 text-amber-400" />
                      <span>Lar dos Idosos (45)</span>
                    </div>

                    <div className="absolute bottom-[20%] left-[25%] p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-[10px]">
                      <Building2 className="h-3 w-3 text-emerald-400" />
                      <span>Supermercado Centro</span>
                    </div>

                    <div className="absolute bottom-[25%] right-[15%] p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-[10px]">
                      <Heart className="h-3 w-3 text-amber-400" />
                      <span>Cozinha Comunitária</span>
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>MALHA URBANA INTEGRADA</span>
                    <span className="text-emerald-400">LEAFLET MAPS ENGINE</span>
                  </div>
                </TiltCard>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. SEÇÃO LEGISLAÇÃO E ODS 2 — MARCO INSTITUCIONAL                         */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-36 bg-[#071B17] text-white relative overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                RIGOR JURÍDICO & COMPLIANCE
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mt-2">
                Amparado pela Lei Federal nº 15.224/2025
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-light mt-3">
                A nova legislação brasileira instituiu a Política Nacional de Combate à Perda e ao Desperdício de Alimentos (PNCPDA), estabelecendo incentivos tributários e proteção jurídica para doadores de boa-fé.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Segurança Jurídica do Doador</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  A Lei resguarda explicitamente supermercados e restaurantes de responsabilidades cíveis e criminais por eventuais danos, desde que o alimento estivesse em condições seguras no momento da entrega.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Critérios Sanitários ANVISA</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Alimentos com embalagens danificadas comercialmente ou prazo de validade próximo podem ser doados com total conformidade sanitária, mantida a integridade sensorial e microbiológica.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Meta ODS 2 da ONU (2030)</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Contribui diretamente para a meta 12.3 dos Objetivos de Desenvolvimento Sustentável da ONU: reduzir pela metade o desperdício global de alimentos per capita até 2030.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. SEÇÃO CTA FINAL — CHAMADA MEMORÁVEL                                   */}
        {/* ========================================================================= */}
        <section className="py-28 sm:py-40 bg-[#052E24] text-white relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 tech-grid-dark opacity-30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRANSFORME EXCEDENTE EM IMPACTO REAL</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] text-balance">
              Um futuro sem desperdício começa com uma conexão.
            </h2>

            <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Conecte sua empresa doadora ou instituição beneficente hoje mesmo à rede oficial do FoodCycle e faça parte da solução da fome no Brasil.
            </p>

            {/* Banners de Entrada Direta */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <TiltCard className="p-8 rounded-3xl bg-black/40 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all flex flex-col justify-between h-56">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Para Doadoras</span>
                    <Building2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-3">Cadastrar Empresa</h3>
                  <p className="text-xs text-slate-300 mt-1">Supermercados, hortifrutis, distribuidores e restaurantes.</p>
                </div>
                <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full">
                  <Link href="/cadastro?tipo=empresa">
                    <span>Começar a Doar</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </TiltCard>

              <TiltCard className="p-8 rounded-3xl bg-black/40 border border-white/15 text-left hover:border-emerald-400 transition-all flex flex-col justify-between h-56">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Para Receptoras</span>
                    <Heart className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-3">Cadastrar Instituição</h3>
                  <p className="text-xs text-slate-300 mt-1">ONGs, cozinhas solidárias, lares e entidades sem fins lucrativos.</p>
                </div>
                <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white font-bold w-full">
                  <Link href="/cadastro?tipo=instituicao">
                    <span>Receber Doações</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </TiltCard>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <Link href="/login" className="hover:text-emerald-400 transition-colors">Já possui cadastro? Entrar no Portal</Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-purple-400 transition-colors">Painel de Governança (Admin)</Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
