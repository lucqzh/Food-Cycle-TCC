import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Calendar,
  Package,
  Building2,
  Heart,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react"

const recentDonations = [
  {
    id: 1,
    date: "12/03/2026",
    empresa: "Supermercado Vida",
    instituicao: "Lar dos Idosos",
    alimentos: "Frutas variadas",
    quantidade: "45 kg",
    status: "Entregue"
  },
  {
    id: 2,
    date: "11/03/2026",
    empresa: "Padaria Pão Quente",
    instituicao: "Casa da Criança",
    alimentos: "Pães e bolos",
    quantidade: "30 kg",
    status: "Entregue"
  },
  {
    id: 3,
    date: "11/03/2026",
    empresa: "Restaurante Sabor & Cia",
    instituicao: "Comunidade São José",
    alimentos: "Marmitas prontas",
    quantidade: "50 unidades",
    status: "Entregue"
  },
  {
    id: 4,
    date: "10/03/2026",
    empresa: "Hortifruti Verde",
    instituicao: "Abrigo Esperança",
    alimentos: "Legumes e verduras",
    quantidade: "80 kg",
    status: "Entregue"
  },
  {
    id: 5,
    date: "10/03/2026",
    empresa: "Supermercado Vida",
    instituicao: "Creche Arco-Íris",
    alimentos: "Laticínios",
    quantidade: "25 kg",
    status: "Entregue"
  },
]

const monthlyStats = [
  { month: "Janeiro", doacoes: 42, kg: 850, empresas: 28, instituicoes: 18 },
  { month: "Fevereiro", doacoes: 48, kg: 920, empresas: 32, instituicoes: 20 },
  { month: "Março", doacoes: 55, kg: 1100, empresas: 35, instituicoes: 22 },
]

const categoryBreakdown = [
  { categoria: "Proteínas", kg: 2750, percentual: 22 },
  { categoria: "Grãos e Cereais", kg: 3500, percentual: 28 },
  { categoria: "Frutas", kg: 1875, percentual: 15 },
  { categoria: "Hortaliças", kg: 2250, percentual: 18 },
  { categoria: "Laticínios", kg: 1250, percentual: 10 },
  { categoria: "Ultraprocessados", kg: 500, percentual: 4 },
  { categoria: "Outros", kg: 375, percentual: 3 },
]

export default function TransparenciaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Eye className="h-4 w-4" />
                Dados Públicos
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Transparência
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                Acreditamos na transparência total. Aqui você encontra o histórico completo 
                de doações, dados mensais e informações detalhadas sobre nossa operação.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Donations */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                  Histórico de Doações
                </h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
              
              <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Empresa</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Instituição</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Alimentos</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDonations.map((donation) => (
                        <tr key={donation.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {donation.date}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              {donation.empresa}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-secondary" />
                              {donation.instituicao}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">{donation.alimentos}</td>
                          <td className="px-4 py-4 text-sm font-medium text-foreground">{donation.quantidade}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              <CheckCircle2 className="h-3 w-3" />
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                  <p className="text-center text-sm text-muted-foreground">
                    Mostrando as 5 doações mais recentes. 
                    <Link href="/dashboard" className="ml-1 text-primary hover:underline">
                      Ver histórico completo
                    </Link>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Monthly Data */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
                Dados Mensais
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {monthlyStats.map((stat, index) => (
                  <Card key={index} className="border-border bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-primary" />
                        {stat.month} 2026
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.doacoes}</p>
                          <p className="text-xs text-muted-foreground">Doações</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.kg}</p>
                          <p className="text-xs text-muted-foreground">kg redistribuídos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.empresas}</p>
                          <p className="text-xs text-muted-foreground">Empresas ativas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.instituicoes}</p>
                          <p className="text-xs text-muted-foreground">Instituições atendidas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Breakdown */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
                Categorias de Alimentos Doados
              </h2>
              
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {categoryBreakdown.map((category, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 shrink-0">
                          <span className="text-sm font-medium text-foreground">{category.categoria}</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-6 w-full rounded-full bg-muted">
                            <div 
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ 
                                width: `${category.percentual}%`,
                                backgroundColor: index === 5 ? 'hsl(var(--accent))' : undefined
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm font-medium text-foreground">{category.kg} kg</span>
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-sm text-muted-foreground">{category.percentual}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Nota de transparência:</strong> Mantemos 
                        o percentual de ultraprocessados abaixo de 10% para garantir uma redistribuição 
                        de alimentos nutritivos e saudáveis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reports */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
                Relatórios Disponíveis
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: "Relatório Anual 2025", description: "Dados consolidados do ano anterior", date: "Janeiro 2026" },
                  { title: "Relatório de Impacto Q1 2026", description: "Primeiro trimestre de 2026", date: "Março 2026" },
                  { title: "Análise Nutricional", description: "Diversidade alimentar das doações", date: "Fevereiro 2026" },
                  { title: "Relatório Ambiental", description: "Impacto na redução de desperdício", date: "Março 2026" },
                ].map((report, index) => (
                  <Card key={index} className="border-border bg-background">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                          <p className="text-xs text-muted-foreground">{report.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                Contribua para esses números
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
                Cada doação conta. Faça parte dessa rede e ajude a aumentar o impacto 
                da redistribuição de alimentos na nossa cidade.
              </p>
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/cadastro">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
