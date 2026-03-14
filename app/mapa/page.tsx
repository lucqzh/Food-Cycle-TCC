"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building2, 
  Heart, 
  Package,
  Filter,
  List,
  Grid,
  Phone,
  Mail
} from "lucide-react"

const locations = [
  {
    id: 1,
    name: "Supermercado Vida",
    type: "empresa",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 1234-5678",
    email: "contato@supermercadovida.com",
    doacoesAtivas: 3,
    position: { top: "25%", left: "45%" }
  },
  {
    id: 2,
    name: "Restaurante Sabor & Cia",
    type: "empresa",
    address: "Av. Principal, 456 - Jardim",
    phone: "(11) 2345-6789",
    email: "contato@saborecia.com",
    doacoesAtivas: 2,
    position: { top: "35%", left: "60%" }
  },
  {
    id: 3,
    name: "Padaria Pão Quente",
    type: "empresa",
    address: "Rua do Comércio, 789 - Vila Nova",
    phone: "(11) 3456-7890",
    email: "paoquente@email.com",
    doacoesAtivas: 1,
    position: { top: "55%", left: "35%" }
  },
  {
    id: 4,
    name: "Hortifruti Verde",
    type: "empresa",
    address: "Av. Brasil, 321 - Centro",
    phone: "(11) 4567-8901",
    email: "verde@hortifruti.com",
    doacoesAtivas: 4,
    position: { top: "40%", left: "25%" }
  },
  {
    id: 5,
    name: "Lar dos Idosos",
    type: "instituicao",
    address: "Rua da Esperança, 100 - Bairro Alto",
    phone: "(11) 5678-9012",
    email: "lardosidosos@email.com",
    beneficiarios: 45,
    position: { top: "20%", left: "70%" }
  },
  {
    id: 6,
    name: "Casa da Criança",
    type: "instituicao",
    address: "Rua dos Sonhos, 200 - Centro",
    phone: "(11) 6789-0123",
    email: "casadacrianca@email.com",
    beneficiarios: 120,
    position: { top: "65%", left: "55%" }
  },
  {
    id: 7,
    name: "Comunidade São José",
    type: "instituicao",
    address: "Rua São José, 300 - Periferia",
    phone: "(11) 7890-1234",
    email: "comunidadesj@email.com",
    beneficiarios: 200,
    position: { top: "75%", left: "30%" }
  },
  {
    id: 8,
    name: "Abrigo Esperança",
    type: "instituicao",
    address: "Av. da Paz, 400 - Jardim Novo",
    phone: "(11) 8901-2345",
    email: "abrigoesp@email.com",
    beneficiarios: 80,
    position: { top: "45%", left: "75%" }
  },
]

export default function MapaPage() {
  const [filter, setFilter] = useState<"all" | "empresa" | "instituicao">("all")
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  
  const filteredLocations = locations.filter(
    loc => filter === "all" || loc.type === filter
  )
  
  const empresas = locations.filter(l => l.type === "empresa")
  const instituicoes = locations.filter(l => l.type === "instituicao")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <MapPin className="h-4 w-4" />
                Localizações
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Mapa de Doações
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Visualize empresas doadoras e instituições beneficiárias na nossa rede.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-muted/30 py-6">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{empresas.length}</p>
                  <p className="text-sm text-muted-foreground">Empresas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{instituicoes.length}</p>
                  <p className="text-sm text-muted-foreground">Instituições</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {empresas.reduce((acc, e) => acc + (e.doacoesAtivas || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Doações Ativas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            {/* Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtrar:</span>
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filter === "empresa" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("empresa")}
                    className="gap-1"
                  >
                    <Building2 className="h-3 w-3" />
                    Empresas
                  </Button>
                  <Button
                    variant={filter === "instituicao" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("instituicao")}
                    className="gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    Instituições
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Map View */}
              {viewMode === "map" && (
                <div className="lg:col-span-2">
                  <Card className="border-border bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-[500px] bg-muted/50">
                        {/* Simulated map background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60">
                          {/* Grid lines to simulate map */}
                          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                        </div>
                        
                        {/* Location markers */}
                        {filteredLocations.map((location) => (
                          <button
                            key={location.id}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                              selectedLocation?.id === location.id ? "scale-125 z-10" : ""
                            }`}
                            style={{ top: location.position.top, left: location.position.left }}
                            onClick={() => setSelectedLocation(location)}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                              location.type === "empresa" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-secondary text-secondary-foreground"
                            }`}>
                              {location.type === "empresa" 
                                ? <Building2 className="h-5 w-5" />
                                : <Heart className="h-5 w-5" />
                              }
                            </div>
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-inherit" />
                          </button>
                        ))}
                        
                        {/* Map legend */}
                        <div className="absolute bottom-4 left-4 rounded-lg bg-card/90 p-3 backdrop-blur">
                          <p className="mb-2 text-xs font-medium text-foreground">Legenda</p>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-primary" />
                              <span className="text-xs text-muted-foreground">Empresa</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-secondary" />
                              <span className="text-xs text-muted-foreground">Instituição</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="lg:col-span-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredLocations.map((location) => (
                      <Card 
                        key={location.id} 
                        className={`border-border bg-card cursor-pointer transition-all hover:border-primary/50 ${
                          selectedLocation?.id === location.id ? "border-primary" : ""
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              location.type === "empresa" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-secondary text-secondary-foreground"
                            }`}>
                              {location.type === "empresa" 
                                ? <Building2 className="h-5 w-5" />
                                : <Heart className="h-5 w-5" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{location.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{location.address}</p>
                              <Badge variant="outline" className="mt-2">
                                {location.type === "empresa" ? "Empresa" : "Instituição"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Details Panel */}
              <div className="lg:col-span-1">
                {selectedLocation ? (
                  <Card className="border-border bg-card sticky top-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          selectedLocation.type === "empresa" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        }`}>
                          {selectedLocation.type === "empresa" 
                            ? <Building2 className="h-6 w-6" />
                            : <Heart className="h-6 w-6" />
                          }
                        </div>
                        <div>
                          <CardTitle className="text-lg">{selectedLocation.name}</CardTitle>
                          <Badge variant="outline">
                            {selectedLocation.type === "empresa" ? "Empresa Doadora" : "Instituição Beneficiária"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{selectedLocation.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{selectedLocation.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{selectedLocation.email}</span>
                        </div>
                        
                        <div className="border-t border-border pt-4">
                          {selectedLocation.type === "empresa" ? (
                            <div className="rounded-lg bg-primary/10 p-3">
                              <p className="text-sm font-medium text-primary">
                                {selectedLocation.doacoesAtivas} doações ativas
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Alimentos disponíveis para redistribuição
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-lg bg-secondary/10 p-3">
                              <p className="text-sm font-medium text-secondary">
                                {selectedLocation.beneficiarios} beneficiários
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Pessoas atendidas pela instituição
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <Button className="w-full" asChild>
                          <Link href="/dashboard/doacoes">
                            {selectedLocation.type === "empresa" 
                              ? "Ver doações disponíveis" 
                              : "Conectar com instituição"
                            }
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border bg-card">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <MapPin className="mb-4 h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mb-2 font-semibold text-foreground">Selecione um local</h3>
                      <p className="text-sm text-muted-foreground">
                        Clique em um marcador no mapa ou na lista para ver mais detalhes.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
