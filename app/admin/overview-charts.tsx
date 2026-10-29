"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"

interface StatusItem {
  name: string
  value: number
  color: string
}

interface CategoryItem {
  categoria: string
  kg: number
}

export function AdminOverviewCharts({
  statusData,
  categoryData,
  totalKg,
}: {
  statusData: StatusItem[]
  categoryData: CategoryItem[]
  totalKg: number
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Gráfico 1: Status das Doações */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Distribuição por Status</CardTitle>
          <CardDescription>Visão em funil dos lotes de doação no ecossistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            {statusData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhum lote de doação registrado ainda.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(val: number, name: string) => [`${val} doação(ões)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong className="text-foreground">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico 2: Volume por Categoria Nutricional */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Volume por Categoria (kg)</CardTitle>
          <CardDescription>Proporção nutricional conforme diretrizes da PNCPDA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            {categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Aguardando primeiros cadastros de alimentos.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="categoria"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(val: number) => [`${val} kg`, "Volume"]}
                  />
                  <Bar dataKey="kg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Total de alimentos cadastrados no banco: <strong className="text-foreground">{totalKg.toLocaleString("pt-BR")} kg</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
