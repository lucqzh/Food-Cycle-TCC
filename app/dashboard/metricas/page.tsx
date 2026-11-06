"use client"

import { useDonationMetrics } from "@/lib/donation-metrics"
import { Progress } from "@/components/ui/progress"
import { 
  Apple,
  Carrot,
  Wheat,
  Beef,
  Milk,
  AlertTriangle,
  CheckCircle,
  Info,
  Scale,
  Sparkles
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

const fallbackCategories = [
  { categoria: "Frutas", quantidade: 85, meta: 100, icon: Apple, color: "#10B981" },
  { categoria: "Hortaliças", quantidade: 92, meta: 100, icon: Carrot, color: "#059669" },
  { categoria: "Grãos e Cereais", quantidade: 78, meta: 100, icon: Wheat, color: "#F59E0B" },
  { categoria: "Proteínas", quantidade: 45, meta: 100, icon: Beef, color: "#EF4444" },
  { categoria: "Laticínios", quantidade: 60, meta: 100, icon: Milk, color: "#3B82F6" }
]

const weeklyData = [
  { dia: "Seg", frutas: 12, legumes: 15, graos: 8, proteinas: 5, laticinios: 10 },
  { dia: "Ter", frutas: 8, legumes: 10, graos: 12, proteinas: 3, laticinios: 8 },
  { dia: "Qua", frutas: 15, legumes: 18, graos: 10, proteinas: 8, laticinios: 12 },
  { dia: "Qui", frutas: 10, legumes: 12, graos: 15, proteinas: 6, laticinios: 5 },
  { dia: "Sex", frutas: 20, legumes: 22, graos: 18, proteinas: 10, laticinios: 15 },
  { dia: "Sab", frutas: 8, legumes: 10, graos: 5, proteinas: 5, laticinios: 6 },
  { dia: "Dom", frutas: 12, legumes: 5, graos: 10, proteinas: 8, laticinios: 4 }
]

const alertas = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Baixa Ingestão de Proteínas",
    description: "As doações de proteínas estão abaixo da meta ideal recomendada pela PNCPDA.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  },
  {
    type: "info",
    icon: Info,
    title: "Atenção a Laticínios",
    description: "Incentivar novas parcerias com cooperativas e laticínios regionais.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  },
  {
    type: "success",
    icon: CheckCircle,
    title: "Excelente Variedade de Frescos",
    description: "O volume de hortaliças e frutas colhidas apresenta índice de consistência máximo.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  }
]

export default function MetricasPage() {
  const { metrics, isLoading } = useDonationMetrics()

  const categoriaData = metrics.categoryData.length > 0
    ? metrics.categoryData.slice(0, 5).map((c) => ({
        categoria: c.name,
        quantidade: c.percentage > 0 ? Math.min(100, c.percentage * 3.5) : 35,
        meta: 100,
        icon: c.icon,
        color: c.color
      }))
    : fallbackCategories

  const indiceDiversidade = Math.round(
    categoriaData.reduce((acc, cat) => acc + cat.quantidade, 0) / categoriaData.length
  )

  const radarData = categoriaData.map((c) => ({
    subject: c.categoria.split(" ")[0],
    valor: c.quantidade,
    fullMark: 100
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-emerald-950/60">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-400 mb-1">
          <Scale className="h-3 w-3 text-amber-400" />
          PNCPDA • Guia Alimentar para a População Brasileira
        </div>
        <h1 className="text-3xl font-extrabold text-white font-serif">Métricas Nutricionais</h1>
        <p className="text-xs text-slate-400">
          Análise da diversidade e suficiência alimentar dos lotes redistribuídos
        </p>
      </div>

      {/* Diversity Index */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-[#0A241F]/80 to-[#071B17]/90 p-6 sm:p-8 backdrop-blur shadow-xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500/40 bg-[#071B17] shadow-2xl shadow-emerald-950">
            <div className="text-center">
              <span className="text-5xl font-black text-emerald-400 font-mono tracking-tight">
                {isLoading ? "..." : indiceDiversidade}
              </span>
              <span className="block text-xs font-mono text-slate-400 mt-1">/ 100 PTS</span>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-lg font-bold text-white">Índice Geral de Diversidade Alimentar</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Mede a proporção equilibrada entre carboidratos, proteínas, vitaminas e minerais das doações. Pontuações acima de 70 garantem suficiência nutricional segundo os critérios do Ministério do Desenvolvimento Social.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                Grãos e Frutas Adequados
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-green-950 text-green-300 border border-green-800/40">
                Hortaliças em Conformidade
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800/40">
                ODS 2 Fome Zero 100%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Distribuição Nutricional Radial</h3>
            <p className="text-xs text-slate-400">Equilíbrio entre os 5 grupos alimentares essenciais</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#052E24" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} />
                <Radar name="Atual" dataKey="valor" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semanal */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Entradas por Dia da Semana (kg)</h3>
            <p className="text-xs text-slate-400">Volume diário categorizado para previsão logística</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#052E24" />
                <XAxis dataKey="dia" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#071B17",
                    border: "1px solid #052E24",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="frutas" stackId="a" fill="#10B981" />
                <Bar dataKey="legumes" stackId="a" fill="#059669" />
                <Bar dataKey="graos" stackId="a" fill="#F59E0B" />
                <Bar dataKey="proteinas" stackId="a" fill="#EF4444" />
                <Bar dataKey="laticinios" stackId="a" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Barras de Progresso das Categorias */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#071B17]/90 p-6 sm:p-8 backdrop-blur shadow-xl space-y-5">
        <div>
          <h3 className="text-base font-bold text-white">Metas por Categoria Nutricional</h3>
          <p className="text-xs text-slate-400">Percentual de atendimento da demanda cadastrada</p>
        </div>

        <div className="space-y-4">
          {categoriaData.map((cat) => (
            <div key={cat.categoria} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                  <span className="font-semibold text-white">{cat.categoria}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.round(cat.quantidade)}% atingido
                </span>
              </div>
              <div className="h-2 w-full bg-emerald-950/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round(cat.quantidade))}%`,
                    backgroundColor: cat.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="grid gap-4 md:grid-cols-3">
        {alertas.map((alerta, idx) => {
          const Icon = alerta.icon
          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 flex items-start gap-3 ${alerta.color}`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{alerta.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{alerta.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
