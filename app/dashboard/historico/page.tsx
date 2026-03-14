"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Building2, 
  Calendar,
  Download,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"

const historico = [
  {
    id: 1,
    alimento: "Arroz Integral",
    empresa: "Supermercado Bom Preço",
    categoria: "Grãos",
    quantidade: "50 kg",
    dataRecebimento: "2024-06-12"
  },
  {
    id: 2,
    alimento: "Leite Integral",
    empresa: "Laticínios Sul",
    categoria: "Laticínios",
    quantidade: "100 L",
    dataRecebimento: "2024-06-10"
  },
  {
    id: 3,
    alimento: "Bananas",
    empresa: "Hortifruti Central",
    categoria: "Frutas",
    quantidade: "40 kg",
    dataRecebimento: "2024-06-08"
  },
  {
    id: 4,
    alimento: "Feijão Preto",
    empresa: "Distribuidora Alimentos SA",
    categoria: "Grãos",
    quantidade: "30 kg",
    dataRecebimento: "2024-06-05"
  },
  {
    id: 5,
    alimento: "Cenouras",
    empresa: "Feira Orgânica",
    categoria: "Legumes",
    quantidade: "25 kg",
    dataRecebimento: "2024-06-03"
  },
  {
    id: 6,
    alimento: "Ovos",
    empresa: "Granja Feliz",
    categoria: "Proteínas",
    quantidade: "300 un",
    dataRecebimento: "2024-06-01"
  },
  {
    id: 7,
    alimento: "Macarrão",
    empresa: "Distribuidora Alimentos SA",
    categoria: "Grãos",
    quantidade: "40 kg",
    dataRecebimento: "2024-05-28"
  },
  {
    id: 8,
    alimento: "Tomates",
    empresa: "Hortifruti Central",
    categoria: "Legumes",
    quantidade: "35 kg",
    dataRecebimento: "2024-05-25"
  }
]

const estatisticas = {
  totalRecebido: "320 kg",
  totalDoacoes: 8,
  empresasParceiras: 5,
  categorias: 5
}

export default function HistoricoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico de Doações</h1>
          <p className="text-muted-foreground">Registro completo das doações recebidas</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estatisticas.totalRecebido}</p>
                <p className="text-sm text-muted-foreground">Total Recebido</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estatisticas.totalDoacoes}</p>
                <p className="text-sm text-muted-foreground">Doações Recebidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                <Building2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estatisticas.empresasParceiras}</p>
                <p className="text-sm text-muted-foreground">Empresas Parceiras</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
                <Calendar className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estatisticas.categorias}</p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Doações Recebidas</CardTitle>
          <CardDescription>Lista completa de todas as doações concluídas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Alimento</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Empresa</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm font-medium text-foreground">{item.alimento}</td>
                    <td className="py-4 text-sm text-muted-foreground">{item.empresa}</td>
                    <td className="py-4">
                      <Badge variant="secondary">{item.categoria}</Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{item.quantidade}</td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {new Date(item.dataRecebimento).toLocaleDateString('pt-BR')}
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
