import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Fome Zero</span>
          </Link>
        </div>
        <Card className="border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-foreground">Algo deu errado</CardTitle>
            <CardDescription>
              Não foi possível concluir a autenticação. O link pode ter expirado ou já ter sido usado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
