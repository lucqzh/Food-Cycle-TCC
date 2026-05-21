"use client"

import dynamic from "next/dynamic"

const DonationMap = dynamic(
  () => import("@/components/map/donation-map").then((mod) => mod.DonationMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center bg-muted rounded-xl"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
)

export function DonationMapDynamic() {
  return <DonationMap />
}