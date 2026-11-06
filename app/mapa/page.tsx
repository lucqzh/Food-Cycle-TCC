"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Building2, 
  Heart, 
  Package,
  Filter,
  List,
  Grid,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck
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
    name: "Lar dos Idosos Esperança",
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
  const [pontos, setPontos] = useState(locations)
  const [filter, setFilter] = useState<"all" | "empresa" | "instituicao">("all")
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  useEffect(() => {
    async function carregarPontos() {
      try {
        const supabase = createClient()
        const [empRes, instRes, doacoesRes] = await Promise.all([
          supabase.from("empresas").select("id, razao_social, nome_fantasia, endereco, cidade, estado"),
          supabase.from("instituicoes").select("id, razao_social, endereco, cidade, estado, pessoas_atendidas"),
          supabase.from("doacoes").select("empresa_id").eq("status", "disponivel")
        ])

        const empresasDb = empRes.data || []
        const instDb = instRes.data || []
        const doacoesDb = doacoesRes.data || []

        if (empresasDb.length > 0 || instDb.length > 0) {
          const posicoes = [
            { top: "30%", left: "40%" },
            { top: "45%", left: "65%" },
            { top: "60%", left: "30%" },
            { top: "25%", left: "75%" },
            { top: "70%", left: "55%" },
            { top: "35%", left: "20%" },
            { top: "50%", left: "80%" },
            { top: "65%", left: "45%" },
          ]

          let idx = 0
          const formatados = [
            ...empresasDb.map(e => {
              const pos = posicoes[idx % posicoes.length]
              idx++
              const ativas = doacoesDb.filter(d => d.empresa_id === e.id).length
              return {
                id: e.id,
                name: e.nome_fantasia || e.razao_social,
                type: "empresa" as const,
                address: `${e.endereco || "Endereço cadastrado"}, ${e.cidade || "SP"} - ${e.estado || "SP"}`,
                phone: "(11) 3345-6700",
                email: "contato@foodcycle.org.br",
                doacoesAtivas: ativas,
                position: pos
              }
            }),
            ...instDb.map(i => {
              const pos = posicoes[idx % posicoes.length]
              idx++
              return {
                id: i.id + 1000,
                name: i.razao_social,
                type: "instituicao" as const,
                address: `${i.endereco || "Endereço cadastrado"}, ${i.cidade || "SP"} - ${i.estado || "SP"}`,
                phone: "(11) 3345-8800",
                email: "atendimento@foodcycle.org.br",
                beneficiarios: i.pessoas_atendidas || 50,
                position: pos
              }
            })
          ]

          if (formatados.length > 0) {
            setPontos(formatados)
          }
        }
      } catch (err) {
        console.warn("Usando dados de demonstração no mapa:", err)
      }
    }
    carregarPontos()
  }, [])
  
  const filteredLocations = pontos.filter(
    loc => filter === "all" || loc.type === filter
  )
  
  const empresas = pontos.filter(l => l.type === "empresa")
  const instituicoes = pontos.filter(l => l.type === "instituicao")

  return (
    <div className="flex min-h-screen flex-col bg-[#071B17] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 border-b border-emerald-950/60 bg-gradient-to-b from-[#052E24] via-[#071B17] to-[#040E0B]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800/40 px-4 py-1.5 text-xs font-mono text-emerald-300">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                Georreferenciamento Solidário em Tempo Real
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-serif">
                Mapa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">Conexões Alimentares</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Localize empresas doadoras de excedentes e instituições receptoras na sua região para viabilizar retiradas rápidas e com menor impacto logístico.
              </p>
            </div>
          </div>
        </section>

        {/* Stats rápidos */}
        <section className="border-b border-emerald-950/60 bg-[#071B17]/60 py-6">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-white font-mono">{empresas.length}</p>
                  <p className="text-xs text-slate-400">Empresas Conectadas</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-white font-mono">{instituicoes.length}</p>
                  <p className="text-xs text-slate-400">Instituições Receptoras</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Package className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-white font-mono">
                    {empresas.reduce((acc, e) => acc + (e.doacoesAtivas || 0), 0)}
                  </p>
                  <p className="text-xs text-slate-400">Doações Disponíveis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa Interativo */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            {/* Controles de Filtro */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">Visualizar:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      filter === "all"
                        ? "bg-emerald-500 text-[#071B17]"
                        : "bg-[#0A241F]/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilter("empresa")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      filter === "empresa"
                        ? "bg-emerald-500 text-[#071B17]"
                        : "bg-[#0A241F]/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    Empresas
                  </button>
                  <button
                    onClick={() => setFilter("instituicao")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      filter === "instituicao"
                        ? "bg-emerald-500 text-[#071B17]"
                        : "bg-[#0A241F]/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    Instituições
                  </button>
                </div>
              </div>
              
              <div className="flex gap-1.5">
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    viewMode === "map"
                      ? "bg-emerald-500 text-[#071B17]"
                      : "bg-[#0A241F]/60 text-slate-400 hover:text-white"
                  }`}
                  aria-label="Modo Mapa"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-emerald-500 text-[#071B17]"
                      : "bg-[#0A241F]/60 text-slate-400 hover:text-white"
                  }`}
                  aria-label="Modo Lista"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Mapa Gráfico */}
              {viewMode === "map" && (
                <div className="lg:col-span-2">
                  <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-2 backdrop-blur shadow-2xl relative overflow-hidden">
                    <div className="relative h-[520px] rounded-2xl bg-gradient-to-br from-[#052E24]/70 via-[#071B17] to-[#03110E] overflow-hidden border border-emerald-950/60">
                      {/* Grid Cartográfico */}
                      <svg className="h-full w-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="mapgrid" width="45" height="45" patternUnits="userSpaceOnUse">
                            <path d="M 45 0 L 0 0 0 45" fill="none" stroke="#10B981" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mapgrid)" />
                      </svg>

                      {/* Radar sweep */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />

                      {/* Marcadores */}
                      {filteredLocations.map((location) => {
                        const isSelected = selectedLocation?.id === location.id
                        return (
                          <button
                            key={location.id}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer z-10 ${
                              isSelected ? "scale-125 z-20" : ""
                            }`}
                            style={{ top: location.position.top, left: location.position.left }}
                            onClick={() => setSelectedLocation(location)}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-xl transition-all ${
                              location.type === "empresa" 
                                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#071B17] shadow-emerald-950" 
                                : "bg-gradient-to-br from-amber-400 to-amber-600 text-[#071B17] shadow-amber-950"
                            }`}>
                              {location.type === "empresa" 
                                ? <Building2 className="h-5 w-5" />
                                : <Heart className="h-5 w-5" />
                              }
                            </div>
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-ping" />
                            )}
                          </button>
                        )
                      })}

                      {/* Legenda do Mapa */}
                      <div className="absolute bottom-4 left-4 rounded-xl bg-[#071B17]/90 border border-emerald-950/80 p-3 backdrop-blur text-xs space-y-1.5 shadow-xl">
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Legenda</p>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="text-slate-300">Empresas Doadoras</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-slate-300">Instituições Receptoras</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista */}
              {viewMode === "list" && (
                <div className="lg:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc)}
                        className={`rounded-2xl border p-4 backdrop-blur transition-all cursor-pointer ${
                          selectedLocation?.id === loc.id
                            ? "border-emerald-500 bg-[#0A241F]"
                            : "border-emerald-950/80 bg-[#071B17]/90 hover:border-emerald-800/60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            loc.type === "empresa" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {loc.type === "empresa" ? <Building2 className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-bold text-white truncate">{loc.name}</h4>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{loc.address}</p>
                            <span className="inline-block mt-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                              {loc.type === "empresa" ? "Doadora" : "Receptora"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Painel Lateral com Detalhes do Ponto */}
              <div className="lg:col-span-1">
                {selectedLocation ? (
                  <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-6 backdrop-blur shadow-2xl space-y-5 sticky top-28">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-950/60">
                      <div className={`p-3 rounded-2xl ${
                        selectedLocation.type === "empresa" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {selectedLocation.type === "empresa" ? <Building2 className="h-6 w-6" /> : <Heart className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-serif">{selectedLocation.name}</h3>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">
                          {selectedLocation.type === "empresa" ? "Empresa Doadora" : "Instituição Receptora"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5 text-slate-300">
                        <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{selectedLocation.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-mono">{selectedLocation.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-mono truncate">{selectedLocation.email}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0A241F]/60 border border-emerald-950/80 text-xs">
                      {selectedLocation.type === "empresa" ? (
                        <div>
                          <p className="font-bold text-emerald-400 font-mono text-base">
                            {selectedLocation.doacoesAtivas} lotes disponíveis
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Alimentos cadastrados para retirada</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-amber-400 font-mono text-base">
                            {selectedLocation.beneficiarios} pessoas atendidas
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Capacidade de atendimento da instituição</p>
                        </div>
                      )}
                    </div>

                    <Button asChild className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-[#071B17] font-bold text-xs tracking-wide">
                      <Link href="/dashboard/doacoes">
                        {selectedLocation.type === "empresa" ? "Ver Doações Disponíveis" : "Conectar com Instituição"}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-emerald-950/80 bg-[#071B17]/90 p-8 text-center backdrop-blur shadow-2xl space-y-3">
                    <MapPin className="h-10 w-10 text-emerald-500/30 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Selecione um Ponto</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Clique em qualquer marcador no mapa para inspecionar os detalhes cadastrais e lotes disponíveis da organização.
                    </p>
                  </div>
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
