import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Heart, 
  Building2, 
  Utensils,
  TrendingUp,
  Users,
  Leaf,
  Award,
  ArrowRight,
  Scale
} from "lucide-react"

const impactStats = [
  {
    value: "12.500",
    unit: "kg",
    label: "Alimentos redistribuídos",
    description: "Total de alimentos que deixaram de ser desperdiçados",
    icon: Package,
    color: "bg-primary"
  },
  {
    value: "48",
    unit: "",
    label: "Instituições atendidas",
    description: "Organizações que receberam doações",
    icon: Heart,
    color: "bg-secondary"
  },
  {
    value: "156",
    unit: "",
    label: "Empresas participantes",
    description: "Empresas que doaram alimentos",
    icon: Building2,
    color: "bg-accent"
  },
  {
    value: "25.000",
    unit: "",
    label: "Refeições estimadas",
    description: "Número aproximado de refeições geradas",
    icon: Utensils,
    color: "bg-primary"
  }
]

const monthlyData = [
  { month: "Jan", kg: 850 },
  { month: "Fev", kg: 920 },
  { month: "Mar", kg: 1100 },
  { month: "Abr", kg: 980 },
  { month: "Mai", kg: 1250 },
  { month: "Jun", kg: 1400 },
]

const categoryData = [
  { name: "Proteínas", percentage: 22, color: "bg-chart-1" },
  { name: "Grãos e Cereais", percentage: 28, color: "bg-chart-2" },
  { name: "Frutas", percentage: 15, color: "bg-chart-3" },
  { name: "Hortaliças", percentage: 18, color: "bg-chart-4" },
  { name: "Laticínios", percentage: 10, color: "bg-chart-5" },
  { name: "Outros", percentage: 7, color: "bg-muted-foreground" },
]

export default function ImpactoPage() {
  const maxKg = Math.max(...monthlyData.map(d => d.kg))
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" />
                Relatório de Impacto
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Impacto Social
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Acompanhe os resultados da nossa plataforma e veja como cada doação 
                faz a diferença na vida de milhares de pessoas.
              </p>
            </div>
          </div>
        </section>

        {/* Main Stats */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat, index) => (
                <Card key={index} className="border-border bg-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`${stat.color} p-4`}>
                      <stat.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">{stat.value}</span>
                        {stat.unit && <span className="text-lg text-muted-foreground">{stat.unit}</span>}
                      </div>
                      <h3 className="mb-1 font-semibold text-foreground">{stat.label}</h3>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Monthly Chart */}
                <Card className="border-border bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Doações por Mês (kg)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 items-end gap-3">
                      {monthlyData.map((data, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                          <div 
                            className="w-full rounded-t-lg bg-primary transition-all hover:bg-primary/80"
                            style={{ height: `${(data.kg / maxKg) * 200}px` }}
                          />
                          <span className="text-xs font-medium text-muted-foreground">{data.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Total no período: 6.500 kg</span>
                      <span className="flex items-center gap-1 text-primary">
                        <TrendingUp className="h-4 w-4" />
                        +12% vs período anterior
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Chart */}
                <Card className="border-border bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-secondary" />
                      Categorias de Alimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryData.map((category, index) => (
                        <div key={index}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-foreground">{category.name}</span>
                            <span className="font-medium text-muted-foreground">{category.percentage}%</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-muted">
                            <div 
                              className={`h-full rounded-full ${category.color}`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Índice de Diversidade:</strong> Boa distribuição 
                        entre categorias alimentares, indicando uma dieta variada para as instituições atendidas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Impacto Ambiental
                </h2>
                <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                  Além do impacto social, a redistribuição de alimentos contribui 
                  significativamente para a redução do impacto ambiental.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-8">
                    <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary/10">
                      <Leaf className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-3xl font-bold text-foreground">18.750</h3>
                    <p className="text-sm text-muted-foreground">kg de CO2 evitados</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-8">
                    <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-secondary/20">
                      <Package className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="mb-2 text-3xl font-bold text-foreground">12.500</h3>
                    <p className="text-sm text-muted-foreground">kg de desperdício evitado</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border bg-card text-center">
                  <CardContent className="p-8">
                    <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-accent/20">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="mb-2 text-3xl font-bold text-foreground">100%</h3>
                    <p className="text-sm text-muted-foreground">reaproveitamento dos excedentes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficiaries */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Quem estamos ajudando
                </h2>
                <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
                  As doações chegam a diferentes tipos de instituições, 
                  impactando comunidades diversas.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { type: "Abrigos", count: 12, icon: Heart },
                  { type: "Creches", count: 15, icon: Users },
                  { type: "Asilos", count: 8, icon: Heart },
                  { type: "Comunidades", count: 13, icon: Building2 },
                ].map((item, index) => (
                  <Card key={index} className="border-border bg-background text-center">
                    <CardContent className="p-6">
                      <item.icon className="mx-auto mb-3 h-10 w-10 text-primary" />
                      <h3 className="mb-1 text-2xl font-bold text-foreground">{item.count}</h3>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-accent-foreground md:text-4xl">
                Faça parte desse impacto
              </h2>
              <p className="mb-8 text-lg text-accent-foreground/80 leading-relaxed">
                Cada empresa e instituição que participa contribui para ampliar nosso alcance 
                e fazer a diferença na vida de mais pessoas.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90" asChild>
                  <Link href="/cadastro" className="gap-2">
                    Participar agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                  <Link href="/transparencia">
                    Ver transparência
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
