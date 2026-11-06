import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Scale, 
  Heart, 
  Building2, 
  Utensils, 
  Leaf, 
  Droplet, 
  Globe2,
  TrendingUp,
  Package
} from "lucide-react"

export default async function AdminMetricasPage() {
  const supabase = await createClient()

  // Consulta dados reais do banco
  const [doacoesRes, instRes, empRes] = await Promise.all([
    supabase.from("doacoes").select("quantidade_kg, categoria, destino, data_criacao"),
    supabase.from("instituicoes").select("pessoas_atendidas, capacidade_atend"),
    supabase.from("empresas").select("id, selo_doador")
  ])

  const doacoes = doacoesRes.data || []
  const insts = instRes.data || []
  const empresas = empRes.data || []

  const totalKg = doacoes.reduce((acc, d) => acc + Number(d.quantidade_kg || 0), 0)
  // 1 kg equivale em média a 4 refeições nutritivas (estimativa padrão da literatura e schema)
  const totalRefeicoes = Math.round(totalKg * 4)
  const totalBeneficiarios = insts.reduce((acc, i) => acc + Number(i.pessoas_atendidas || i.capacidade_atend || 0), 0)
  const empresasComSelo = empresas.filter(e => e.selo_doador).length

  // Fatores ambientais baseados na literatura FAO / WRI
  // Cada kg de alimento poupado do descarte evita ~2.5 kg de CO2eq e preserva ~1.000 L de água
  const co2EvitadoKg = Math.round(totalKg * 2.5)
  const aguaPoupadaLitros = Math.round(totalKg * 1000)

  // Distribuição por Categoria
  const categoriaMap: Record<string, number> = {}
  doacoes.forEach(d => {
    const c = d.categoria || "outro"
    categoriaMap[c] = (categoriaMap[c] || 0) + Number(d.quantidade_kg || 0)
  })

  // Destinação PNCPDA
  const destinoMap = { humano: 0, animal: 0, compostagem: 0 }
  doacoes.forEach(d => {
    const dest = d.destino as keyof typeof destinoMap
    if (destinoMap[dest] !== undefined) {
      destinoMap[dest] += Number(d.quantidade_kg || 0)
    } else {
      destinoMap.humano += Number(d.quantidade_kg || 0)
    }
  })

  const totalDestino = totalKg > 0 ? totalKg : 1
  const pctHumano = Math.round((destinoMap.humano / totalDestino) * 100)
  const pctAnimal = Math.round((destinoMap.animal / totalDestino) * 100)
  const pctCompostagem = Math.round((destinoMap.compostagem / totalDestino) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Globe2 className="h-3.5 w-3.5" />
          Alinhamento com Meta 12.3 e ODS 2 da ONU
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Métricas de Impacto Social & Ambiental</h1>
        <p className="text-muted-foreground">
          Indicadores consolidados para apresentação de TCC e prestação de contas da PNCPDA (Lei nº 15.224/2025).
        </p>
      </div>

      {/* Grid de Impacto */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alimento Resgatado</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalKg.toLocaleString("pt-BR")} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Excedentes desviados de aterros sanitários</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Refeições Viabilizadas</CardTitle>
            <Utensils className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRefeicoes.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground mt-1">Fórmula documentada: ~4 refeições por kg</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emissões Evitadas</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">~{co2EvitadoKg.toLocaleString("pt-BR")} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Estimativa de CO₂eq retido na cadeia</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Água Preservada</CardTitle>
            <Droplet className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">~{aguaPoupadaLitros.toLocaleString("pt-BR")} L</div>
            <p className="text-xs text-muted-foreground mt-1">Pegada hídrica da produção agrícola</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção 2: Hierarquia Legal PNCPDA */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Hierarquia de Destinação dos Alimentos (Art. 4º da Lei nº 15.224/2025)
              </CardTitle>
              <CardDescription>
                A política nacional impõe a priorização do consumo humano sobre outras destinações.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary">Conformidade Legal</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-xl bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">1. Consumo Humano</span>
                <Badge className="bg-primary text-primary-foreground text-xs">Prioridade Máxima</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{destinoMap.humano.toLocaleString("pt-BR")} kg</p>
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Participação no volume</span>
                <span className="font-semibold text-primary">{pctHumano}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-primary" style={{ width: `${pctHumano}%` }} />
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">2. Alimentação Animal</span>
                <Badge variant="secondary" className="text-xs">Segunda Opção</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{destinoMap.animal.toLocaleString("pt-BR")} kg</p>
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Participação no volume</span>
                <span className="font-semibold text-secondary">{pctAnimal}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-secondary" style={{ width: `${pctAnimal}%` }} />
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">3. Compostagem</span>
                <Badge variant="outline" className="text-xs">Última Opção</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{destinoMap.compostagem.toLocaleString("pt-BR")} kg</p>
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Participação no volume</span>
                <span className="font-semibold text-accent">{pctCompostagem}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-accent" style={{ width: `${pctCompostagem}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Diversidade Alimentar e Selos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Diversidade Nutricional Registrada</CardTitle>
            <CardDescription>Volume absoluto por categoria de alimento cadastrado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoriaMap).map(([cat, kg]) => (
              <div key={cat} className="flex items-center justify-between p-2 rounded bg-muted/20 text-sm">
                <span className="font-medium text-foreground capitalize">{cat.replace("_", " ")}</span>
                <span className="font-bold text-primary">{Math.round(kg)} kg</span>
              </div>
            ))}
            {Object.keys(categoriaMap).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">Aguardando doações para geração do extrato.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Adesão Corporativa e Selos</CardTitle>
            <CardDescription>Participação de empresas nos critérios de incentivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Total de Empresas Doadoras:</span>
                <span className="font-bold text-foreground">{empresas.length}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Empresas Certificadas com Selo:</span>
                <span className="font-bold text-emerald-600">{empresasComSelo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Beneficiários Cobertos:</span>
                <span className="font-bold text-foreground">~{totalBeneficiarios.toLocaleString("pt-BR")} pessoas</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              * O FoodCycle fornece relatórios auditáveis que habilitam empresas doadoras a comprovarem responsabilidade social e ambiental, mitigando riscos de autuações e fortalecendo a governança ESG.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
