"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type Donation = {
  id: string
  alimento: string
  quantidade: number
  categoria: string | null
  empresa: string | null
  instituicao: string | null
  created_at: string
}

export type DonationMetrics = {
  totalKg: number
  donationCount: number
  donations: Donation[]
  byCategory: { name: string; value: number }[]
  monthly: { name: string; value: number }[]
}

const emptyMetrics: DonationMetrics = { totalKg: 0, donationCount: 0, donations: [], byCategory: [], monthly: [] }

export function useDonationMetrics() {
  const [metrics, setMetrics] = useState<DonationMetrics>(emptyMetrics)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data, error: queryError } = await supabase
      .from("doacoes")
      .select("id, alimento, quantidade, categoria, empresa, instituicao, created_at")
      .order("created_at", { ascending: false })
    if (queryError) {
      setError("Não foi possível carregar os indicadores.")
      setIsLoading(false)
      return
    }
    const rows = (data ?? []) as Donation[]
    const byCategory = Object.entries(rows.reduce<Record<string, number>>((acc, row) => {
      const key = row.categoria || "Outros"
      acc[key] = (acc[key] || 0) + Number(row.quantidade || 0)
      return acc
    }, {})).map(([name, value]) => ({ name, value }))
    const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    const monthly = Object.entries(rows.reduce<Record<string, number>>((acc, row) => {
      const date = new Date(row.created_at)
      const key = monthFormatter.format(date).replace(".", "")
      acc[key] = (acc[key] || 0) + Number(row.quantidade || 0)
      return acc
    }, {})).slice(-6).map(([name, value]) => ({ name, value }))
    setMetrics({ totalKg: rows.reduce((sum, row) => sum + Number(row.quantidade || 0), 0), donationCount: rows.length, donations: rows, byCategory, monthly })
    setError(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void load()
    const supabase = createClient()
    const channel = supabase.channel("doacoes-metrics").on("postgres_changes", { event: "*", schema: "public", table: "doacoes" }, () => void load()).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [load])

  return { metrics, isLoading, error }
}
