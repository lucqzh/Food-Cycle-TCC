"use client"

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

const categoriaData = [
  { categoria: "Frutas", quantidade: 85, meta: 100, icon: Apple, color: "hsl(var(--chart-1))" },
  { categoria: "Legumes", quantidade: 92, meta: 100, icon: Carrot, color: "hsl(var(--chart-2))" },
  { categoria: "Grãos", quantidade: 78, meta: 100, icon: Wheat, color: "hsl(var(--chart-3))" },
  { categoria: "Proteínas", quantidade: 45, meta: 100, icon: Beef, color: "hsl(var(--chart-4))" },
  { categoria: "Laticínios", quantidade: 60, meta: 100, icon: Milk, color: "hsl(var(--chart-5))" }
]

const radarData = [
  { subject: "Frutas", valor: 85, fullMark: 100 },
  { subject: "Legumes", valor: 92, fullMark: 100 },
  { subject: "Grãos", valor: 78, fullMark: 100 },
  { subject: "Proteínas", valor: 45, fullMark: 100 },
  { subject: "Laticínios", valor: 60, fullMark: 100 }
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
    description: "As doações de proteínas estão 55% abaixo da meta recomendada. Considere buscar parcerias com frigoríficos e granjas."
  },
  {
    type: "info",
    icon: Info,
    title: "Laticínios abaixo do ideal",
    description: "A categoria de laticínios está 40% abaixo da meta. Busque parcerias com laticínios da região."
  },
  {
    type: "success",
    icon: CheckCircle,
    title: "Excelente diversidade em legumes",
    description: "O consumo de legumes está 92% da meta. Continue mantendo essa categoria bem abastecida."
  }
]

export default function MetricasPage() {
  const indiceDiversidade = Math.round(
    categoriaData.reduce((acc, cat) => acc + cat.quantidade, 0) / categoriaData.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Métricas Nutricionais</h1>
        <p className="text-muted-foreground">Análise da diversidade alimentar das doações recebidas</p>
      </div>

      {/* Diversity Index */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Índice de Diversidade Alimentar</CardTitle>
          <CardDescription>Baseado na proporção de categorias nutricionais recebidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-8 border-primary bg-primary/10">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{indiceDiversidade}</span>
                <span className="block text-lg text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-muted-foreground">
                O índice de diversidade alimentar mede a variedade nutricional das doações recebidas. 
                Um índice acima de 70 indica uma boa diversidade, enquanto abaixo de 50 sugere 
                necessidade de buscar novas fontes de alimentos.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Bom em Frutas
                </Badge>
                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                  Ótimo em Legumes
                </Badge>
                <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                  Baixo em Proteínas
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
          <CardDescription>Comparação entre quantidade recebida e meta recomendada</CardDescription>
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
                    {cat.quantidade}% da meta
                  </span>
                </div>
                <Progress 
                  value={cat.quantidade} 
                  className="h-2"
                  style={{ 
                    // @ts-ignore
                    '--progress-foreground': cat.color 
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Alertas e Recomendações</CardTitle>
          <CardDescription>Sugestões para melhorar a diversidade alimentar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertas.map((alerta, index) => (
            <div 
              key={index}
              className={`flex items-start gap-4 rounded-lg p-4 ${
                alerta.type === 'warning' 
                  ? 'bg-destructive/10' 
                  : alerta.type === 'success'
                    ? 'bg-primary/10'
                    : 'bg-muted'
              }`}
            >
              <alerta.icon className={`h-5 w-5 shrink-0 mt-0.5 ${
                alerta.type === 'warning' 
                  ? 'text-destructive' 
                  : alerta.type === 'success'
                    ? 'text-primary'
                    : 'text-muted-foreground'
              }`} />
              <div>
                <p className="font-medium text-foreground">{alerta.title}</p>
                <p className="text-sm text-muted-foreground">{alerta.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
