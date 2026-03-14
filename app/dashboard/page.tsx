"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Apple,
  Carrot,
  Wheat,
  Beef
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

const statsCards = [
  {
    title: "Total Recebido",
    value: "1.250 kg",
    description: "Este mês",
    icon: Package,
    trend: "+12%"
  },
  {
    title: "Doações Ativas",
    value: "24",
    description: "Disponíveis agora",
    icon: TrendingUp,
    trend: "+5"
  },
  {
    title: "Beneficiários",
    value: "450",
    description: "Pessoas atendidas",
    icon: Users,
    trend: "+8%"
  }
]

const categoryData = [
  { name: "Frutas", value: 320, color: "hsl(var(--chart-1))" },
  { name: "Legumes", value: 280, color: "hsl(var(--chart-2))" },
  { name: "Grãos", value: 240, color: "hsl(var(--chart-3))" },
  { name: "Proteínas", value: 180, color: "hsl(var(--chart-4))" },
  { name: "Laticínios", value: 150, color: "hsl(var(--chart-5))" },
  { name: "Outros", value: 80, color: "hsl(var(--muted-foreground))" }
]

const monthlyData = [
  { mes: "Jan", quantidade: 800 },
  { mes: "Fev", quantidade: 950 },
  { mes: "Mar", quantidade: 1100 },
  { mes: "Abr", quantidade: 980 },
  { mes: "Mai", quantidade: 1250 },
  { mes: "Jun", quantidade: 1400 }
]

const alerts = [
  {
    type: "warning",
    title: "Excesso de ultraprocessados",
    description: "35% das doações recentes são ultraprocessados. Considere diversificar."
  },
  {
    type: "info",
    title: "Baixa em proteínas",
    description: "Apenas 14% das doações são fontes de proteína. Busque novas fontes."
  }
]

const recentDonations = [
  { alimento: "Arroz integral", empresa: "Supermercado Bom Preço", quantidade: "50 kg", categoria: "Grãos" },
  { alimento: "Maçãs", empresa: "Hortifruti Central", quantidade: "30 kg", categoria: "Frutas" },
  { alimento: "Leite", empresa: "Laticínios Sul", quantidade: "100 L", categoria: "Laticínios" },
  { alimento: "Feijão preto", empresa: "Distribuidora Alimentos", quantidade: "40 kg", categoria: "Grãos" }
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das doações e métricas nutricionais</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stat.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição por Categoria</CardTitle>
            <CardDescription>Categorias nutricionais das doações recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} kg`, 'Quantidade']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Evolução Mensal</CardTitle>
            <CardDescription>Quantidade de alimentos recebidos por mês (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
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
                    formatter={(value: number) => [`${value} kg`, 'Quantidade']}
                  />
                  <Bar 
                    dataKey="quantidade" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diversity Index & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Diversity Index */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Índice de Diversidade Alimentar</CardTitle>
            <CardDescription>Baseado nas categorias nutricionais recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary bg-primary/10">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">7.2</span>
                  <span className="block text-sm text-muted-foreground">/10</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-chart-1" />
                  <span className="text-sm text-foreground">Frutas: Bom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Carrot className="h-5 w-5 text-chart-2" />
                  <span className="text-sm text-foreground">Legumes: Bom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-chart-3" />
                  <span className="text-sm text-foreground">Grãos: Adequado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Beef className="h-5 w-5 text-chart-4" />
                  <span className="text-sm text-foreground">Proteínas: Baixo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Alertas Nutricionais</CardTitle>
            <CardDescription>Atenção para equilíbrio alimentar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 rounded-lg p-4 ${
                  alert.type === 'warning' 
                    ? 'bg-destructive/10' 
                    : 'bg-primary/10'
                }`}
              >
                <AlertTriangle className={`h-5 w-5 shrink-0 ${
                  alert.type === 'warning' 
                    ? 'text-destructive' 
                    : 'text-primary'
                }`} />
                <div>
                  <p className="font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Doações Recentes</CardTitle>
          <CardDescription>Últimas doações disponíveis na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Alimento</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Empresa</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map((donation, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm font-medium text-foreground">{donation.alimento}</td>
                    <td className="py-4 text-sm text-muted-foreground">{donation.empresa}</td>
                    <td className="py-4 text-sm text-muted-foreground">{donation.quantidade}</td>
                    <td className="py-4">
                      <Badge variant="secondary">{donation.categoria}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
