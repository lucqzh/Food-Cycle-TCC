import Link from "next/link"
import { Leaf, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Fome Zero</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conectando empresas e instituições para reduzir o desperdício de alimentos e combater a fome.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Links Rápidos</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary">
                Sobre o Projeto
              </Link>
              <Link href="/como-funciona" className="text-sm text-muted-foreground hover:text-primary">
                Como Funciona
              </Link>
              <Link href="/ods2" className="text-sm text-muted-foreground hover:text-primary">
                ODS 2 - Fome Zero
              </Link>
              <Link href="/empresas" className="text-sm text-muted-foreground hover:text-primary">
                Para Empresas
              </Link>
              <Link href="/instituicoes" className="text-sm text-muted-foreground hover:text-primary">
                Para Instituições
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Dados e Impacto</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/impacto" className="text-sm text-muted-foreground hover:text-primary">
                Impacto Social
              </Link>
              <Link href="/transparencia" className="text-sm text-muted-foreground hover:text-primary">
                Transparência
              </Link>
              <Link href="/mapa" className="text-sm text-muted-foreground hover:text-primary">
                Mapa de Doações
              </Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                Entrar / Cadastrar
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Contato</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contato@fomezero.org</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2024 Fome Zero. Projeto de TCC - ODS 2.
          </p>
          <p className="text-sm text-muted-foreground">
            Desenvolvido com o objetivo de erradicar a fome.
          </p>
        </div>
      </div>
    </footer>
  )
}
