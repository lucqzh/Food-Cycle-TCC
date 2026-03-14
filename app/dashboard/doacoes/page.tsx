"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  Package,
  Clock,
  MapPin
} from "lucide-react"

const doacoes = [
  {
    id: 1,
    alimento: "Arroz Integral",
    empresa: "Supermercado Bom Preço",
    categoria: "Grãos",
    quantidade: "50 kg",
    validade: "2024-08-15",
    condicao: "Temperatura Ambiente",
    descricao: "Arroz integral tipo 1, pacotes de 5kg. Em perfeito estado de conservação.",
    localizacao: "Centro, São Paulo"
  },
  {
    id: 2,
    alimento: "Maçãs Fuji",
    empresa: "Hortifruti Central",
    categoria: "Frutas",
    quantidade: "30 kg",
    validade: "2024-06-20",
    condicao: "Refrigerado",
    descricao: "Maçãs fuji frescas, colhidas recentemente. Calibre médio.",
    localizacao: "Vila Mariana, São Paulo"
  },
  {
    id: 3,
    alimento: "Leite Integral",
    empresa: "Laticínios Sul",
    categoria: "Laticínios",
    quantidade: "100 L",
    validade: "2024-06-25",
    condicao: "Refrigerado",
    descricao: "Leite integral UHT, caixas de 1 litro.",
    localizacao: "Mooca, São Paulo"
  },
  {
    id: 4,
    alimento: "Feijão Preto",
    empresa: "Distribuidora Alimentos SA",
    categoria: "Grãos",
    quantidade: "40 kg",
    validade: "2024-09-01",
    condicao: "Temperatura Ambiente",
    descricao: "Feijão preto tipo 1, pacotes de 1kg.",
    localizacao: "Brás, São Paulo"
  },
  {
    id: 5,
    alimento: "Cenouras",
    empresa: "Feira Orgânica",
    categoria: "Legumes",
    quantidade: "25 kg",
    validade: "2024-06-18",
    condicao: "Refrigerado",
    descricao: "Cenouras orgânicas, tamanho médio a grande.",
    localizacao: "Pinheiros, São Paulo"
  },
  {
    id: 6,
    alimento: "Pão Francês",
    empresa: "Padaria Trigo Dourado",
    categoria: "Processados",
    quantidade: "200 unidades",
    validade: "2024-06-15",
    condicao: "Temperatura Ambiente",
    descricao: "Pães franceses frescos do dia, embalados.",
    localizacao: "Liberdade, São Paulo"
  }
]

const categorias = [
  { value: "todas", label: "Todas as categorias" },
  { value: "frutas", label: "Frutas" },
  { value: "legumes", label: "Legumes" },
  { value: "graos", label: "Grãos" },
  { value: "proteinas", label: "Proteínas" },
  { value: "laticinios", label: "Laticínios" },
  { value: "processados", label: "Processados" }
]

export default function DoacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [selectedDoacao, setSelectedDoacao] = useState<typeof doacoes[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredDoacoes = doacoes.filter((doacao) => {
    const matchesSearch = doacao.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doacao.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoria === "todas" || 
                             doacao.categoria.toLowerCase() === categoria.toLowerCase()
    return matchesSearch && matchesCategoria
  })

  const handleSolicitar = (doacao: typeof doacoes[0]) => {
    setSelectedDoacao(doacao)
    setDialogOpen(true)
  }

  const confirmSolicitar = () => {
    // Em produção, fazer chamada API
    setDialogOpen(false)
    alert(`Solicitação enviada para: ${selectedDoacao?.alimento}`)
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      "Frutas": "bg-chart-1/10 text-chart-1",
      "Legumes": "bg-chart-2/10 text-chart-2",
      "Grãos": "bg-chart-3/10 text-chart-3",
      "Proteínas": "bg-chart-4/10 text-chart-4",
      "Laticínios": "bg-chart-5/10 text-chart-5",
      "Processados": "bg-muted-foreground/10 text-muted-foreground"
    }
    return colors[categoria] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Doações Disponíveis</h1>
        <p className="text-muted-foreground">Encontre alimentos disponíveis para sua instituição</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por alimento ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredDoacoes.length} doação(ões) encontrada(s)
      </p>

      {/* Donations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoacoes.map((doacao) => (
          <Card key={doacao.id} className="border-border bg-card transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{doacao.alimento}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3" />
                    {doacao.empresa}
                  </CardDescription>
                </div>
                <Badge className={getCategoriaColor(doacao.categoria)}>
                  {doacao.categoria}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{doacao.quantidade}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(doacao.validade).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{doacao.localizacao}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {doacao.descricao}
              </p>
              
              <Button 
                className="w-full" 
                onClick={() => handleSolicitar(doacao)}
              >
                Solicitar Doação
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoacoes.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">Nenhuma doação encontrada</p>
            <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Solicitação</DialogTitle>
            <DialogDescription>
              Você está prestes a solicitar a seguinte doação:
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoacao && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alimento:</span>
                <span className="font-medium text-foreground">{selectedDoacao.alimento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantidade:</span>
                <span className="font-medium text-foreground">{selectedDoacao.quantidade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empresa:</span>
                <span className="font-medium text-foreground">{selectedDoacao.empresa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validade:</span>
                <span className="font-medium text-foreground">
                  {new Date(selectedDoacao.validade).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSolicitar}>
              Confirmar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
