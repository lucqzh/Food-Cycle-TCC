"use client"

import { useEffect, useState } from "react"
import { MapPin, Building2, Heart, Package, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dados fictícios de empresas e instituições
const empresas = [
  {
    id: 1,
    nome: "Supermercado Vida",
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    lat: -23.5631,
    lng: -46.6544,
    tipo: "empresa",
    doacoesAtivas: 3,
    categorias: ["Frutas", "Hortaliças", "Laticínios"]
  },
  {
    id: 2,
    nome: "Restaurante Sabor & Cia",
    endereco: "Rua Augusta, 500 - São Paulo, SP",
    lat: -23.5531,
    lng: -46.6584,
    tipo: "empresa",
    doacoesAtivas: 2,
    categorias: ["Proteínas", "Grãos"]
  },
  {
    id: 3,
    nome: "Padaria Pão Quente",
    endereco: "Rua Oscar Freire, 200 - São Paulo, SP",
    lat: -23.5621,
    lng: -46.6694,
    tipo: "empresa",
    doacoesAtivas: 1,
    categorias: ["Grãos e cereais"]
  },
  {
    id: 4,
    nome: "Hortifruti Verde",
    endereco: "Av. Rebouças, 1500 - São Paulo, SP",
    lat: -23.5681,
    lng: -46.6784,
    tipo: "empresa",
    doacoesAtivas: 5,
    categorias: ["Frutas", "Hortaliças"]
  }
]

const instituicoes = [
  {
    id: 1,
    nome: "Casa de Acolhimento Esperança",
    endereco: "Rua da Consolação, 800 - São Paulo, SP",
    lat: -23.5501,
    lng: -46.6524,
    tipo: "instituicao",
    pessoasAtendidas: 120,
    distancia: "0.8 km"
  },
  {
    id: 2,
    nome: "ONG Alimentar",
    endereco: "Rua Haddock Lobo, 300 - São Paulo, SP",
    lat: -23.5571,
    lng: -46.6654,
    tipo: "instituicao",
    pessoasAtendidas: 85,
    distancia: "1.2 km"
  },
  {
    id: 3,
    nome: "Centro Comunitário União",
    endereco: "Av. Brasil, 1200 - São Paulo, SP",
    lat: -23.5451,
    lng: -46.6424,
    tipo: "instituicao",
    pessoasAtendidas: 200,
    distancia: "1.5 km"
  },
  {
    id: 4,
    nome: "Lar São Francisco",
    endereco: "Rua Bela Cintra, 450 - São Paulo, SP",
    lat: -23.5611,
    lng: -46.6614,
    tipo: "instituicao",
    pessoasAtendidas: 65,
    distancia: "0.5 km"
  },
  {
    id: 5,
    nome: "Associação Pão da Vida",
    endereco: "Rua Frei Caneca, 700 - São Paulo, SP",
    lat: -23.5541,
    lng: -46.6504,
    tipo: "instituicao",
    pessoasAtendidas: 150,
    distancia: "1.0 km"
  }
]

interface DonationMapProps {
  showInstitutions?: boolean
  showEmpresas?: boolean
  className?: string
}

export function DonationMap({ 
  showInstitutions = true, 
  showEmpresas = true,
  className = ""
}: DonationMapProps) {
  const [MapContainer, setMapContainer] = useState<any>(null)
  const [TileLayer, setTileLayer] = useState<any>(null)
  const [Marker, setMarker] = useState<any>(null)
  const [Popup, setPopup] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Import Leaflet dynamically (client-side only)
    import("leaflet").then((L) => {
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
    })

    import("react-leaflet").then((module) => {
      setMapContainer(() => module.MapContainer)
      setTileLayer(() => module.TileLayer)
      setMarker(() => module.Marker)
      setPopup(() => module.Popup)
    })
  }, [])

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
          // Fallback para localização padrão (São Paulo)
          setUserLocation({ lat: -23.5505, lng: -46.6333 })
        }
      )
    }
  }

  if (!isClient || !MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`} style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  const center = userLocation || { lat: -23.5570, lng: -46.6600 }

  return (
    <div className={className}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Empresas doadoras</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Instituições</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Sua localização</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleGetLocation} className="gap-2">
          <Navigation className="h-4 w-4" />
          Usar minha localização
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcadores de empresas */}
          {showEmpresas && empresas.map((empresa) => (
            <Marker key={`emp-${empresa.id}`} position={[empresa.lat, empresa.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{empresa.nome}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{empresa.endereco}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-3 w-3 text-primary" />
                    <span className="text-xs">{empresa.doacoesAtivas} doações ativas</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {empresa.categorias.map((cat) => (
                      <span key={cat} className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Marcadores de instituições */}
          {showInstitutions && instituicoes.map((inst) => (
            <Marker key={`inst-${inst.id}`} position={[inst.lat, inst.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{inst.nome}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{inst.endereco}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {inst.pessoasAtendidas} pessoas atendidas
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

// Componente de lista de instituições próximas
export function NearbyInstitutions() {
  return (
    <div className="space-y-4">
      {instituicoes.map((inst) => (
        <Card key={inst.id} className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{inst.nome}</h3>
                  <p className="text-sm text-muted-foreground">{inst.endereco}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {inst.pessoasAtendidas} pessoas atendidas
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{inst.distancia}</span>
                </div>
                <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Ver detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
