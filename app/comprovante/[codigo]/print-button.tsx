"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function TermoPrintButton() {
  return (
    <Button
      size="sm"
      onClick={() => window.print()}
      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5" />
      <span>Imprimir / Salvar PDF</span>
    </Button>
  )
}
