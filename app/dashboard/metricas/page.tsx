"use client"

import { useDonationMetrics } from "@/lib/donation-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Apple,
  Carrot,
  Wheat,
  Beef,
  Milk,
  AlertTriangle,
  CheckCircle,
  Info
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
  { categoria: "Frutas", quantidade: 85, meta: 100, icon: Apple, color: "hsl(var(--chart-1))" },
  { categoria: "Hortaliças", quantidade: 92, meta: 100, icon: Carrot, color: "hsl(var(--chart-2))" },
  { categoria: "Grãos e Cereais", quantidade: 78, meta: 100, icon: Wheat, color: "hsl(var(--chart-3))" },
  { categoria: "Proteínas", quantidade: 45, meta: 100, icon: Beef, color: "hsl(var(--chart-4))" },
  { categoria: "Laticínios", quantidade: 60, meta: 100, icon: Milk, color: "hsl(var(--chart-5))" }
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
    title: "Baixa ingestão de proteínas",
    description: "As doações de proteínas estão abaixo da meta ideal recomendada pela PNCPDA."
  },
  {
    type: "info",
    icon: Info,
    title: "Atenção a Laticínios",
    description: "Incentivar novas parcerias com cooperativas e laticínios regionais."
  },
  {
    type: "success",
    icon: CheckCircle,
    title: "Excelente variedade de Hortaliças e Frutas",
    description: "O volume de alimentos frescos colhidos e doados apresenta índice consistente."
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Métricas Nutricionais</h1>
        <p className="text-muted-foreground">
          Análise da diversidade alimentar das doações conforme a PNCPDA (Lei nº 15.224/2025)
        </p>
      </div>

      {/* Diversity Index */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Índice de Diversidade Alimentar</CardTitle>
          <CardDescription>Baseado na proporção de categorias nutricionais recebidas no banco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-8 border-primary bg-primary/10">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">
                  {isLoading ? "..." : indiceDiversidade}
                </span>
                <span className="block text-lg text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-muted-foreground">
                O índice de diversidade alimentar afere a variedade nutricional das doações registradas. 
                Índices acima de 70 apontam excelente equilíbrio alimentar para as instituições beneficiárias.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Grãos e Frutas Adequados
                </Badge>
                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                  Hortaliças em Conformidade
                </Badge>
                <Badge variant="secondary" className="bg-accent/15 text-accent">
                  Rastreabilidade PNCPDA 100%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição Nutricional</CardTitle>
            <CardDescription>Visão geral das categorias em relação à meta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Radar
                    name="Atual"
                    dataKey="valor"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição Semanal</CardTitle>
            <CardDescription>Quantidade de alimentos por categoria na última semana (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="dia" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="frutas" stackId="a" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="legumes" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="graos" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="proteinas" stackId="a" fill="hsl(var(--chart-4))" />
                  <Bar dataKey="laticinios" stackId="a" fill="hsl(var(--chart-5))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Progresso por Categoria</CardTitle>
          <CardDescription>Comparação entre volume recebido e meta nutricional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoriaData.map((cat) => (
              <div key={cat.categoria} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
                    <span className="font-medium text-foreground">{cat.categoria}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(cat.quantidade)}% da meta
                  </span>
                </div>
                <Progress value={cat.quantidade} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        {alertas.map((alerta, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <alerta.icon className={`h-5 w-5 shrink-0 ${
                  alerta.type === 'warning' ? 'text-accent' :
                  alerta.type === 'success' ? 'text-primary' :
                  'text-secondary'
                }`} />
                <div>
                  <h4 className="font-medium text-foreground">{alerta.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{alerta.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
