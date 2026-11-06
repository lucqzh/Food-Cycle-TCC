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

const DARK_TOOLTIP_STYLE = {
  backgroundColor: "#0A1A14",
  border: "1px solid rgba(22,163,74,0.2)",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontSize: "12px",
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
      <div
        className="rounded-xl p-5"
        style={{ background: "#0A1A14", border: "1px solid rgba(22,163,74,0.15)" }}
      >
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Distribuição por Status</h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            Visão em funil dos lotes de doação no ecossistema
          </p>
        </div>
        <div className="h-[240px]">
          {statusData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm" style={{ color: "#64748B" }}>
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
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number, name: string) => [`${val} doação(ões)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}: <strong className="text-white">{item.value}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico 2: Volume por Categoria Nutricional */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0A1A14", border: "1px solid rgba(124,58,237,0.15)" }}
      >
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Volume por Categoria (kg)</h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            Proporção nutricional conforme diretrizes da PNCPDA
          </p>
        </div>
        <div className="h-[240px]">
          {categoryData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm" style={{ color: "#64748B" }}>
              Aguardando primeiros cadastros de alimentos.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="categoria"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val} kg`, "Volume"]}
                />
                <Bar dataKey="kg" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-3 text-center text-xs" style={{ color: "#64748B" }}>
          Total cadastrado no banco: <strong className="text-white">{totalKg.toLocaleString("pt-BR")} kg</strong>
        </div>
      </div>
    </div>
  )
}
