"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Building2, 
  Heart, 
  Users, 
  Leaf, 
  Package, 
  Truck, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Cpu, 
  BarChart3, 
  FileText, 
  Scale, 
  ChevronRight,
  Thermometer,
  QrCode
} from "lucide-react"

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      num: "01",
      title: "Triagem & Lote Digital",
      badge: "Art. 4º da Lei nº 15.224",
      desc: "A empresa doadora cadastra os excedentes alimentares antes do vencimento comercial. O sistema gera automaticamente um código de rastreabilidade único com checklist sanitário.",
      telemetry: "STATUS: LOTE AUDITADO • RASTREIO ATIVO",
      icon: Package
    },
    {
      num: "02",
      title: "Matching Geográfico Inteligente",
      badge: "Otimização Logística",
      desc: "Nossos algoritmos conectam o lote com a instituição receptora cadastrada mais próxima que possua capacidade comprovada de atendimento e armazenamento.",
      telemetry: "MATCH LOCALIZADO: < 4.2 KM DE DISTÂNCIA",
      icon: Cpu
    },
    {
      num: "03",
      title: "Cadeia de Frio & Logística",
      badge: "Art. 7º - Transporte Seguro",
      desc: "Retirada direta pela entidade ou intermediação logística com controle rigoroso de temperatura e prazo de entrega para garantir integridade biológica.",
      telemetry: "TEMPERATURA MONITORADA: 4.2°C (REFRIGERADO)",
      icon: Truck
    },
    {
      num: "04",
      title: "Certificação Fiscal & ESG",
      badge: "Segurança Jurídica",
      desc: "Comprovação digital de entrega com auditoria pública, resguardando o doador de responsabilidades cíveis e gerando dados certificados para relatórios de sustentabilidade.",
      telemetry: "TERMO DE DESTINAÇÃO REGISTRADO NO BANCO",
      icon: ShieldCheck
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased overflow-x-hidden">
      <Header />

      <main className="flex-1 pt-20 sm:pt-28">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION COM ESTÉTICA HIGH-TECH & SCROLLYTELLING                   */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden tech-grid">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
              
              {/* Floating Regulatory Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-950 text-white border border-white/10 shadow-xl shadow-emerald-500/5 hover:scale-105 transition-transform cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono tracking-wider">PNCPDA ATIVO</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Marco Legal: Lei nº 15.224/2025</span>
              </div>

              {/* High-Impact Cinematic Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] text-balance">
                A infraestrutura inteligente para <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600">erradicar o desperdício</span> de alimentos.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed text-pretty">
                Conectamos empresas geradoras de excedentes a instituições de assistência social com rastreabilidade sanitária, segurança jurídica e logística monitorada em tempo real.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/cadastro">
                    <span>Conectar Minha Organização</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-7 rounded-full border-slate-300 hover:bg-slate-100 text-slate-800 font-medium transition-all"
                  asChild
                >
                  <Link href="/mapa">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>Explorar Rede Logística</span>
                  </Link>
                </Button>
              </div>

              {/* Telemetry Micro-Badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Segurança Jurídica para Doadores</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Critérios Sanitários ANVISA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Alinhado ao ODS 2 da ONU</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SIMULADOR DE TELEMETRIA E LOGÍSTICA (Inspirado no vídeo de demonstração) */}
            {/* ========================================================================= */}
            <div className="mt-14 max-w-5xl mx-auto">
              <div className="relative rounded-2xl bg-slate-950 text-white border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden hud-bracket">
                {/* Tech Grid Lines in Background */}
                <div className="absolute inset-0 tech-grid-dark opacity-40 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

                {/* HUD Header */}
                <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white font-bold tracking-wider">TERMINAL DE FLUXO ATIVO</span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-emerald-400 hidden sm:inline">ROTA: SP-CENTRO ➔ ZONA LESTE</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>LATÊNCIA: 34MS</span>
                    <span>•</span>
                    <span className="text-slate-200">ID: FC-LOG-2026</span>
                  </div>
                </div>

                {/* Interactive Flow Visualizer */}
                <div className="relative py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Node 1: Empresa */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative group hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Origem Doadora</span>
                      <Building2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Supermercado Central</h4>
                    <p className="text-xs text-slate-400">Lote #FC-882: 450 kg de Hortifruti</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-1 rounded inline-block">
                      VALIDAÇÃO: ANVISA OK
                    </div>
                  </div>

                  {/* Node 2: Transporte & Cadeia de Frio (Centro) */}
                  <div className="p-5 rounded-xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 flex flex-col gap-3 relative scale-105 z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Unidade em Trânsito</span>
                      <Truck className="h-4 w-4 text-emerald-400 animate-bounce" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-teal-400" />
                      <span className="text-xs font-mono text-teal-300 font-bold">4.2°C • CADEIA DE FRIO</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-2/3 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">
                      PREVISÃO DE RETIRADA: 18 MIN
                    </p>
                  </div>

                  {/* Node 3: Instituição Receptora */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative group hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Destino Social</span>
                      <Heart className="h-4 w-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Associação Comunitária</h4>
                    <p className="text-xs text-slate-400">Capacidade: 120 Famílias Cadastradas</p>
                    <div className="mt-2 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded inline-block border border-emerald-500/20">
                      SOLICITAÇÃO APROVADA
                    </div>
                  </div>
                </div>

                {/* HUD Footer Telemetry */}
                <div className="relative pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <span>RASTREABILIDADE END-TO-END GARANTIDA</span>
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    100% EM CONFORMIDADE COM LEI Nº 15.224/2025
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SCROLLYTELLING PIPELINE: O CICLO DA LEI Nº 15.224                      */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 tech-grid-dark opacity-20 pointer-events-none" />
          <div className="container relative mx-auto px-4 md:px-6">
            
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                ENGENHARIA DO SISTEMA
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
                Como o FoodCycle operacionaliza a Lei nº 15.224/2025 em 4 etapas
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Do cadastro do alimento excedente até a prestação de contas aos órgãos regulatórios.
              </p>
            </div>

            {/* Interactive Step Navigator */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {steps.map((st, i) => {
                const Icon = st.icon
                const isActive = activeStep === i
                return (
                  <button
                    key={st.num}
                    onClick={() => setActiveStep(i)}
                    className={`text-left p-6 rounded-2xl transition-all duration-300 relative border ${
                      isActive 
                        ? "bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-102" 
                        : "bg-slate-950/60 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-emerald-400">{st.num}</span>
                      <Icon className={`h-5 w-5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-emerald-400">
                      {st.badge}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Step Detail Card */}
            <div className="mt-8 max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Etapa Selecionada: {steps[activeStep].title}</span>
                  <h4 className="text-lg font-bold text-white">{steps[activeStep].telemetry}</h4>
                </div>
              </div>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-full px-6">
                <Link href="/como-funciona">
                  <span>Ver Detalhamento Técnico</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COCKPIT DE IMPACTO & ODS 2 (FOME ZERO & NUTRIÇÃO)                      */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16 max-w-5xl mx-auto">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  MÉTRICAS DA PLATAFORMA EM TEMPO REAL
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  Resultados auditados do impacto social
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base max-w-md">
                Cada lote redistribuído gera registros auditáveis para cumprimento de metas de sustentabilidade (ESG) e conformidade legal.
              </p>
            </div>

            {/* Grid de KPIs Modernos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alimentos Salvos</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Scale className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">12.500<span className="text-lg text-emerald-600 font-sans ml-1">kg</span></div>
                <p className="text-xs text-slate-500 mt-2">Excedentes desviados de aterros sanitários</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refeições Geradas</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Heart className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">25.000+</div>
                <p className="text-xs text-slate-500 mt-2">Média regulatória PNCPDA (500g/refeição)</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresas Doadoras</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">156</div>
                <p className="text-xs text-slate-500 mt-2">Supermercados, hortifrutis e indústrias</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rede Beneficiária</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">48</div>
                <p className="text-xs text-slate-500 mt-2">ONGs e abrigos com alvará sanitário ativo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BANNER FINAL DE CONEXÃO & CALL TO ACTION                               */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 tech-grid-dark opacity-30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-white/15 p-8 sm:p-14 text-center space-y-8 shadow-2xl backdrop-blur-xl">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                REDE PÚBLICA & PRIVADA INTEGRADA
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                Pronto para fazer parte da maior rede de segurança alimentar do Brasil?
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Cadastre sua empresa para destinar excedentes com segurança jurídica ou sua instituição para receber doações regulares.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/cadastro?tipo=empresa">
                    <Building2 className="h-4 w-4 mr-2" />
                    Cadastrar Empresa Doadora
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-8 rounded-full border-white/20 hover:bg-white/10 text-white font-semibold transition-all"
                  asChild
                >
                  <Link href="/cadastro?tipo=instituicao">
                    <Heart className="h-4 w-4 mr-2 text-emerald-400" />
                    Cadastrar Instituição Social
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                <span>ACESSO DIRETO:</span>
                <Link href="/login" className="text-emerald-400 hover:underline">Entrar no Sistema</Link>
                <span>•</span>
                <Link href="/admin" className="text-purple-400 hover:underline">Painel de Governança (Admin)</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
