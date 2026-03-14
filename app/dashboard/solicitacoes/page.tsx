"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Building2, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

const solicitacoes = [
  {
    id: 1,
    alimento: "Arroz Integral",
    empresa: "Supermercado Bom Preço",
    quantidade: "50 kg",
    dataSolicitacao: "2024-06-10",
    status: "aprovada",
    dataRetirada: "2024-06-12"
  },
  {
    id: 2,
    alimento: "Maçãs Fuji",
    empresa: "Hortifruti Central",
    quantidade: "30 kg",
    dataSolicitacao: "2024-06-11",
    status: "pendente",
    dataRetirada: null
  },
  {
    id: 3,
    alimento: "Leite Integral",
    empresa: "Laticínios Sul",
    quantidade: "100 L",
    dataSolicitacao: "2024-06-09",
    status: "concluida",
    dataRetirada: "2024-06-10"
  },
  {
    id: 4,
    alimento: "Pão Francês",
    empresa: "Padaria Trigo Dourado",
    quantidade: "200 un",
    dataSolicitacao: "2024-06-08",
    status: "recusada",
    dataRetirada: null
  }
]

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle }> = {
    pendente: { label: "Pendente", variant: "secondary", icon: Clock },
    aprovada: { label: "Aprovada", variant: "default", icon: CheckCircle },
    concluida: { label: "Concluída", variant: "outline", icon: CheckCircle },
    recusada: { label: "Recusada", variant: "destructive", icon: XCircle }
  }
  
  const { label, variant, icon: Icon } = config[status] || config.pendente
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

export default function SolicitacoesPage() {
  const pendentes = solicitacoes.filter(s => s.status === "pendente").length
  const aprovadas = solicitacoes.filter(s => s.status === "aprovada").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Minhas Solicitações</h1>
        <p className="text-muted-foreground">Acompanhe o status das suas solicitações de doação</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendentes}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aprovadas}</p>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <Package className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {solicitacoes.filter(s => s.status === "concluida").length}
                </p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {solicitacoes.filter(s => s.status === "recusada").length}
                </p>
                <p className="text-sm text-muted-foreground">Recusadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitations List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Histórico de Solicitações</CardTitle>
          <CardDescription>Todas as suas solicitações de doação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitacoes.map((solicitacao) => (
              <div 
                key={solicitacao.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{solicitacao.alimento}</h3>
                    {getStatusBadge(solicitacao.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {solicitacao.empresa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {solicitacao.quantidade}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {solicitacao.dataRetirada && (
                    <p className="text-sm text-primary">
                      Retirada: {new Date(solicitacao.dataRetirada).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                
                {solicitacao.status === "aprovada" && (
                  <Button size="sm">
                    Confirmar Retirada
                  </Button>
                )}
                {solicitacao.status === "pendente" && (
                  <Button size="sm" variant="outline">
                    Cancelar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
