"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Apple,
  Carrot,
  Wheat,
  Beef,
  Milk,
  Cookie,
  CheckCircle2,
  AlertCircle,
  Info,
  Award,
  Medal,
  Star,
  ArrowRight,
  Scale,
  Heart,
  Sprout,
  Recycle,
  ShieldCheck,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

const statsCards = [
  {
    title: "Total Recebido",
    value: "1.250 kg",
    description: "Este mês",
    icon: Package,
    trend: "+12%",
    color: "bg-primary"
  },
  {
    title: "Doações Ativas",
    value: "24",
    description: "Disponíveis agora",
    icon: TrendingUp,
    trend: "+5",
    color: "bg-secondary"
  },
  {
    title: "Beneficiários",
    value: "450",
    description: "Pessoas atendidas",
    icon: Users,
    trend: "+8%",
    color: "bg-accent"
  }
]

const categoryData = [
  { name: "Proteínas", value: 275, percentage: 22, color: "hsl(var(--chart-1))", icon: Beef, status: "Bom" },
  { name: "Grãos e Cereais", value: 350, percentage: 28, color: "hsl(var(--chart-2))", icon: Wheat, status: "Excelente" },
  { name: "Frutas", value: 188, percentage: 15, color: "hsl(var(--chart-3))", icon: Apple, status: "Adequado" },
  { name: "Hortaliças", value: 225, percentage: 18, color: "hsl(var(--chart-4))", icon: Carrot, status: "Bom" },
  { name: "Laticínios", value: 125, percentage: 10, color: "hsl(var(--chart-5))", icon: Milk, status: "Baixo" },
  { name: "Ultraprocessados", value: 87, percentage: 7, color: "hsl(var(--accent))", icon: Cookie, status: "Adequado" }
]

const radarData = [
  { category: "Proteínas", value: 75, fullMark: 100 },
  { category: "Grãos", value: 90, fullMark: 100 },
  { category: "Frutas", value: 65, fullMark: 100 },
  { category: "Hortaliças", value: 80, fullMark: 100 },
  { category: "Laticínios", value: 45, fullMark: 100 },
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
    type: "success",
    title: "Boa distribuição nutricional",
    description: "As doações recebidas apresentam boa diversidade de categorias alimentares.",
    icon: CheckCircle2
  },
  {
    type: "warning",
    title: "Baixa em laticínios",
    description: "Apenas 10% das doações são laticínios. Busque novas fontes de cálcio.",
    icon: AlertCircle
  },
  {
    type: "info",
    title: "Ultraprocessados controlados",
    description: "O percentual de ultraprocessados está abaixo de 10%, dentro do ideal.",
    icon: Info
  }
]

const companyBadges = [
  {
    name: "Selo Doador de Alimentos - Ouro",
    description: "Empresa de alto desempenho na PNCPDA: regularidade, diversidade e rastreabilidade completa das doações.",
    icon: Award,
    color: "bg-yellow-500",
    companies: ["Supermercado Vida", "Hortifruti Verde"]
  },
  {
    name: "Selo Doador de Alimentos - Prata",
    description: "Empresa em conformidade com a PNCPDA, com doações regulares e boa diversidade nutricional.",
    icon: Medal,
    color: "bg-gray-400",
    companies: ["Restaurante Sabor & Cia", "Padaria Pão Quente"]
  },
  {
    name: "Selo Aderente PNCPDA",
    description: "Empresa cadastrada e participando ativamente da Política Nacional de Combate à Perda e ao Desperdício.",
    icon: ShieldCheck,
    color: "bg-primary",
    companies: ["Laticínios Sul", "Distribuidora Alimentos"]
  }
]

const destinacaoData = [
  {
    titulo: "Consumo humano",
    valor: "1.080 kg",
    percentual: 86,
    icon: Heart,
    color: "bg-primary text-primary-foreground",
    badge: "Prioridade",
  },
  {
    titulo: "Consumo animal",
    valor: "120 kg",
    percentual: 10,
    icon: Sprout,
    color: "bg-secondary text-secondary-foreground",
    badge: "Segunda opção",
  },
  {
    titulo: "Compostagem / Biomassa",
    valor: "50 kg",
    percentual: 4,
    icon: Recycle,
    color: "bg-accent text-accent-foreground",
    badge: "Última opção",
  },
]

const recentDonations = [
  { alimento: "Arroz integral", empresa: "Supermercado Bom Preço", quantidade: "50 kg", categoria: "Grãos" },
  { alimento: "Maçãs", empresa: "Hortifruti Central", quantidade: "30 kg", categoria: "Frutas" },
  { alimento: "Leite", empresa: "Laticínios Sul", quantidade: "100 L", categoria: "Laticínios" },
  { alimento: "Feijão preto", empresa: "Distribuidora Alimentos", quantidade: "40 kg", categoria: "Grãos" }
]

export default function DashboardPage() {
   const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    async function verificarCadastro() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return
      const uid = data.user.id

      const [e, i, m] = await Promise.all([
        supabase.from("empresas").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("instituicoes").select("id").eq("perfil_id", uid).maybeSingle(),
        supabase.from("intermediarios").select("id").eq("perfil_id", uid).maybeSingle(),
      ])

      // Se deu erro na consulta, não redireciona (evita mandar o usuário pra lugar errado)
      if (e.error || i.error || m.error) return

      if (!e.data && !i.data && !m.data) {
        router.replace("/completar-cadastro")
      }
    }
    verificarCadastro()
  }, [router])
  // Calculate diversity index
  const diversityIndex = 7.8
  const diversityStatus = diversityIndex >= 7 ? "Boa" : diversityIndex >= 5 ? "Moderada" : "Baixa"
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Scale className="h-3.5 w-3.5" />
            Monitoramento PNCPDA - Lei nº 15.224/2025
          </div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das doações, métricas nutricionais e indicadores da política pública
          </p>
        </div>
        <Button asChild className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/dashboard/doacoes">
            Ver doações disponíveis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
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
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} text-primary-foreground`}>
                    <stat.icon className="h-5 w-5" />
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

      {/* Hierarquia de destinação - PNCPDA */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Scale className="h-5 w-5 text-primary" />
                Hierarquia de destinação
              </CardTitle>
              <CardDescription>
                Distribuição das doações conforme a ordem de prioridade da PNCPDA
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/aspectos-legais">Ver legislação</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {destinacaoData.map((item) => (
              <div
                key={item.titulo}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{item.titulo}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{item.valor}</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Participação</span>
                    <span className="font-medium text-foreground">{item.percentual}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diversity Index & Category Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Diversity Index with Radar */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Índice de Diversidade Alimentar</CardTitle>
            <CardDescription>Análise da variedade nutricional das doações recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Score Circle */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <svg className="h-36 w-36 -rotate-90 transform">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="hsl(var(--primary))"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(diversityIndex / 10) * 377} 377`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-4xl font-bold text-primary">{diversityIndex}</span>
                    <span className="block text-sm text-muted-foreground">/10</span>
                  </div>
                </div>
                <Badge className={`mt-4 ${diversityIndex >= 7 ? 'bg-primary' : diversityIndex >= 5 ? 'bg-accent' : 'bg-destructive'}`}>
                  Diversidade {diversityStatus}
                </Badge>
              </div>
              
              {/* Category Status */}
              <div className="space-y-3">
                {categoryData.slice(0, 5).map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" style={{ color: category.color }} />
                      <span className="text-sm text-foreground">{category.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        category.status === "Excelente" ? "border-primary text-primary" :
                        category.status === "Bom" ? "border-secondary text-secondary" :
                        category.status === "Adequado" ? "border-muted-foreground text-muted-foreground" :
                        "border-accent text-accent"
                      }
                    >
                      {category.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Radar Chart */}
            <div className="mt-6 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Radar
                    name="Distribuição"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição por Categoria</CardTitle>
            <CardDescription>Percentual de cada categoria nutricional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
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
                    formatter={(value: number, name: string) => [`${value} kg (${categoryData.find(c => c.name === name)?.percentage}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-xs text-muted-foreground">{category.name} ({category.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Alertas Nutricionais</CardTitle>
          <CardDescription>Monitoramento da qualidade alimentar das doações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 rounded-lg p-4 ${
                  alert.type === 'success' ? 'bg-primary/10' :
                  alert.type === 'warning' ? 'bg-accent/10' :
                  'bg-muted'
                }`}
              >
                <alert.icon className={`h-5 w-5 shrink-0 ${
                  alert.type === 'success' ? 'text-primary' :
                  alert.type === 'warning' ? 'text-accent' :
                  'text-muted-foreground'
                }`} />
                <div>
                  <p className="font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend & Company Badges */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Evolução Mensal</CardTitle>
            <CardDescription>Quantidade de alimentos recebidos por mês (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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

        {/* Company Badges / Incentive System */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Selos Doador de Alimentos</CardTitle>
            <CardDescription>
              Reconhecimento concedido a empresas que aderem à PNCPDA com regularidade, diversidade e
              rastreabilidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyBadges.map((badge, index) => (
                <div key={index} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${badge.color}`}>
                      <badge.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {badge.companies.map((company, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Doações Recentes</CardTitle>
            <CardDescription>Últimas doações disponíveis na plataforma</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/doacoes">Ver todas</Link>
          </Button>
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
