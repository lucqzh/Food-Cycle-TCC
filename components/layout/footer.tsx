import Link from "next/link"
import { Leaf, Mail, MapPin, Phone, ShieldCheck, ExternalLink, Globe, Cpu, Award } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-slate-950 text-slate-300 overflow-hidden">
      {/* Background Tech Grid & Glow */}
      <div className="absolute inset-0 tech-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Telemetry Status Strip */}
      <div className="relative border-b border-white/10 bg-slate-900/60 backdrop-blur-sm px-4 py-3 text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-semibold">REDE PNCPDA:</span>
            <span className="text-emerald-400">TELEMETRIA ATIVA (LEI Nº 15.224/2025)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">CRIPTOGRAFIA RLS ATIVA</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">ODS 2: FOME ZERO & AGRICULTURA SUSTENTÁVEL</span>
            <span>•</span>
            <span className="text-slate-300">HUB BRASIL</span>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <Leaf className="h-5 w-5 fill-current stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">FoodCycle</span>
                <span className="block text-[10px] font-mono text-emerald-400 tracking-wider uppercase">
                  Infraestrutura Digital Fome Zero
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Plataforma tecnológica nacional de intermediação, logística reversa e rastreabilidade sanitária para doação de excedentes de alimentos.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Em conformidade com a Lei nº 15.224/2025</span>
              </div>
            </div>
          </div>

          {/* Column 2: Plataforma */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Ecossistema
            </h3>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link href="/como-funciona" className="text-slate-400 hover:text-white transition-colors">
                Como Funciona o Ciclo
              </Link>
              <Link href="/mapa" className="text-slate-400 hover:text-white transition-colors">
                Mapa da Rede Logística
              </Link>
              <Link href="/impacto" className="text-slate-400 hover:text-white transition-colors">
                Métricas de Impacto
              </Link>
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                Portal do Usuário
              </Link>
              <Link href="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                <span>Painel de Governança</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/20 text-purple-400 rounded">Admin</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: Marco Regulatório */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Marco Legal
            </h3>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link href="/aspectos-legais" className="text-slate-400 hover:text-white transition-colors">
                Lei nº 15.224/2025 (PNCPDA)
              </Link>
              <Link href="/aspectos-legais" className="text-slate-400 hover:text-white transition-colors">
                Segurança Jurídica do Doador
              </Link>
              <Link href="/aspectos-legais" className="text-slate-400 hover:text-white transition-colors">
                Critérios Sanitários (ANVISA)
              </Link>
              <Link href="/ods2" className="text-slate-400 hover:text-white transition-colors">
                Metas ODS 2 (Fome Zero)
              </Link>
              <Link href="/transparencia" className="text-slate-400 hover:text-white transition-colors">
                Portal da Transparência
              </Link>
            </nav>
          </div>

          {/* Column 4: Conexão */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Institucional
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>São Paulo, SP • Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>contato@foodcycle.org.br</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:underline"
                >
                  <span>Portal das Organizações</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 FoodCycle / Fome Zero. Projeto Acadêmico de Conclusão de Curso (TCC).
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>NEXT.JS 16 • TURBOPACK</span>
            <span>•</span>
            <span>TAILWIND 4</span>
            <span>•</span>
            <span>POSTGRES RLS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
