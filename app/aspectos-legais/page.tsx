"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Scale, 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  Users,
  Leaf,
  BookOpen,
  ClipboardCheck,
  FileText,
  Ban,
  Target,
  Handshake
} from "lucide-react"

export default function AspectosLegaisPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 border-primary text-primary">
                <Scale className="h-3 w-3 mr-1" />
                Legislacao e Compliance
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Aspectos Legais da Redistribuicao de Alimentos
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Entenda o marco legal brasileiro que regulamenta a doacao de alimentos 
                e como a plataforma Fome Zero opera em conformidade com a legislacao vigente, 
                garantindo seguranca juridica para doadores e beneficiarios.
              </p>
            </div>
          </div>
        </section>

        {/* Introducao a Legislacao */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Legislacao Brasileira sobre Doacao de Alimentos
                  </h2>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <Card className="border-l-4 border-l-primary mb-8">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      No Brasil, a doacao de alimentos por empresas e estabelecimentos comerciais 
                      foi historicamente cercada de incertezas juridicas. Muitos doadores em potencial 
                      hesitavam em doar alimentos excedentes por receio de responsabilizacao civil ou 
                      criminal em caso de eventuais problemas de saude nos beneficiarios.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Esse cenario mudou significativamente com a promulgacao da <strong className="text-foreground">Lei 
                      n 14.016, de 23 de junho de 2020</strong>, popularmente conhecida como 
                      <strong className="text-foreground"> Lei do Bom Samaritano</strong>. Essa legislacao 
                      representa um marco fundamental para viabilizar a redistribuicao de alimentos no pais, 
                      estabelecendo diretrizes claras que protegem os doadores e incentivam a reducao do 
                      desperdicio alimentar.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      A lei esta alinhada com os principios da <strong className="text-foreground">Politica Nacional 
                      de Seguranca Alimentar e Nutricional (PNSAN)</strong> e contribui diretamente para o 
                      alcance das metas estabelecidas pela ODS 2 - Fome Zero e Agricultura Sustentavel.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Lei do Bom Samaritano */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Lei n 14.016/2020 - Lei do Bom Samaritano
                  </h2>
                </div>
              </div>

              <Card className="mb-8 border-accent/30">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <FileText className="h-5 w-5" />
                    Sobre a Lei
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A Lei do Bom Samaritano dispoe sobre o combate ao desperdicio de alimentos 
                    e a doacao de excedentes de alimentos para o consumo humano. Seu objetivo 
                    principal e criar um ambiente juridico seguro que incentive a doacao de 
                    alimentos proprios para consumo, removendo barreiras legais que anteriormente 
                    desencorajavam essa pratica.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    A legislacao autoriza expressamente que estabelecimentos dedicados a producao 
                    e ao fornecimento de alimentos, incluindo restaurantes, supermercados, 
                    padarias, hortifruti e industrias alimenticias, doem os excedentes nao 
                    comercializados, desde que ainda estejam proprios para o consumo humano.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      O que a Lei Permite
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Doacao de alimentos preparados e nao comercializados
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Doacao de produtos com data de validade proxima ao vencimento
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Doacao de produtos com embalagens danificadas (desde que o conteudo esteja integro)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Doacao de alimentos fora do padrao de comercializacao (estetica)
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-secondary" />
                      Destinatarios Previstos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Bancos de alimentos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Instituicoes de assistencia social
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Entidades beneficentes de assistencia social
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                        <span className="text-muted-foreground">
                          Pessoas em situacao de vulnerabilidade ou risco alimentar
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Garantias para Doadores */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Garantias e Protecoes para Empresas Doadoras
                  </h2>
                </div>
              </div>

              <Card className="border-l-4 border-l-primary mb-8">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Um dos aspectos mais relevantes da Lei do Bom Samaritano e a <strong className="text-foreground">
                    protecao juridica conferida aos doadores</strong>. A legislacao estabelece que o 
                    doador e o intermediario da doacao nao serao responsabilizados civil ou 
                    penalmente pelos danos ou prejuizos eventualmente causados aos beneficiarios, 
                    desde que observadas determinadas condicoes.
                  </p>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold text-foreground mb-6">
                Condicoes para Isencao de Responsabilidade
              </h3>

              <div className="grid gap-4 mb-8">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Ausencia de Dolo</h4>
                        <p className="text-muted-foreground">
                          O doador nao pode ter agido com intencao deliberada de causar dano. 
                          A doacao deve ser feita de boa-fe, com o objetivo genuino de contribuir 
                          para a reducao do desperdicio e combate a fome.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Ausencia de Negligencia</h4>
                        <p className="text-muted-foreground">
                          O doador deve ter tomado os cuidados razoaveis para garantir que os 
                          alimentos doados estejam proprios para consumo. Isso inclui verificar 
                          validade, condicoes de armazenamento e integridade dos produtos.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Alimentos Proprios para Consumo</h4>
                        <p className="text-muted-foreground">
                          Os alimentos doados devem estar dentro do prazo de validade e em 
                          condicoes adequadas de higiene e conservacao. A lei nao protege a 
                          doacao de alimentos improprios para consumo humano.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-accent shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Importante</h4>
                      <p className="text-muted-foreground">
                        A protecao legal se estende tambem aos <strong className="text-foreground">intermediarios 
                        da doacao</strong>, como plataformas digitais e bancos de alimentos, desde que 
                        estes atuem de boa-fe e observem os mesmos criterios de diligencia no 
                        manuseio e distribuicao dos alimentos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Responsabilidades */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Responsabilidades no Processo de Doacao
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                Embora a Lei do Bom Samaritano oferca protecao aos doadores, ela nao os isenta 
                de responsabilidades. O processo de doacao de alimentos requer o cumprimento 
                de determinadas obrigacoes para garantir a seguranca alimentar dos beneficiarios.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Responsabilidades da Empresa Doadora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Controle de Validade</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Verificar e registrar as datas de validade dos alimentos antes da doacao
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Condicoes de Armazenamento</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Garantir que os alimentos foram armazenados corretamente ate o momento da doacao
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Registro das Doacoes</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Manter documentacao das doacoes realizadas para fins de rastreabilidade
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Informacoes do Produto</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fornecer informacoes precisas sobre categoria, quantidade e condicoes do alimento
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-secondary/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      Responsabilidades da Instituicao Receptora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Verificacao no Recebimento</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Inspecionar os alimentos no momento do recebimento quanto a integridade e validade
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Armazenamento Adequado</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Manter os alimentos em condicoes apropriadas ate a distribuicao final
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Distribuicao Responsavel</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Garantir que os alimentos sejam distribuidos dentro do prazo de consumo
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Registro de Recebimento</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Documentar os alimentos recebidos para fins de controle e prestacao de contas
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Termos de Responsabilidade na Plataforma */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Termos de Responsabilidade na Plataforma
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                Para garantir a seguranca juridica de todos os envolvidos e assegurar a 
                conformidade com a legislacao vigente, a plataforma Fome Zero implementa 
                um sistema de termos de responsabilidade e confirmacoes digitais que 
                formalizam os compromissos de cada parte.
              </p>

              <div className="grid gap-6 mb-8">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Confirmacoes da Empresa Doadora
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ao cadastrar uma doacao na plataforma, a empresa deve confirmar digitalmente que:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Os alimentos estao dentro do prazo de validade
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        As condicoes de armazenamento foram adequadamente mantidas
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Os alimentos estao proprios para consumo humano
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        As informacoes fornecidas sao verdadeiras e precisas
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        A doacao e realizada de boa-fe, sem intencao de dolo
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      Confirmacoes da Instituicao Receptora
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ao solicitar e receber uma doacao, a instituicao deve confirmar que:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Verificou as condicoes dos alimentos no momento do recebimento
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Possui estrutura adequada para armazenamento temporario
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Compromete-se a distribuir os alimentos dentro do prazo de consumo
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Destinara os alimentos exclusivamente a populacao atendida
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Nao comercializara os alimentos recebidos
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Handshake className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Transparencia e Rastreabilidade
                      </h4>
                      <p className="text-muted-foreground">
                        Todas as confirmacoes digitais sao registradas na plataforma com data, 
                        hora e identificacao do responsavel, criando um historico auditavel que 
                        garante transparencia e permite rastrear todo o ciclo da doacao. Esse 
                        sistema de documentacao digital e essencial para demonstrar a boa-fe 
                        das partes em caso de eventuais questionamentos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Limitacoes Legais */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Ban className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Limitacoes Legais e Restricoes
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                E fundamental compreender que a Lei do Bom Samaritano e a plataforma Fome Zero 
                possuem limitacoes claras. O marco legal nao permite a doacao de qualquer tipo 
                de alimento em qualquer condicao, e a plataforma nao substitui os orgaos 
                competentes de fiscalizacao sanitaria.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-destructive/20">
                  <CardHeader className="bg-destructive/5">
                    <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                      <Ban className="h-5 w-5" />
                      O que NAO Pode Ser Doado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive font-bold">X</span>
                        <span className="text-muted-foreground">
                          Alimentos com prazo de validade vencido
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive font-bold">X</span>
                        <span className="text-muted-foreground">
                          Produtos com sinais de deterioracao ou contaminacao
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive font-bold">X</span>
                        <span className="text-muted-foreground">
                          Alimentos que quebraram a cadeia de frio
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive font-bold">X</span>
                        <span className="text-muted-foreground">
                          Produtos sem identificacao ou rotulagem adequada
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive font-bold">X</span>
                        <span className="text-muted-foreground">
                          Alimentos armazenados em condicoes inadequadas
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader className="bg-accent/5">
                    <CardTitle className="text-lg flex items-center gap-2 text-accent">
                      <AlertTriangle className="h-5 w-5" />
                      Limitacoes da Plataforma
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          Nao substitui a fiscalizacao da Vigilancia Sanitaria
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          Nao realiza inspecao fisica dos alimentos doados
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          Nao certifica a qualidade dos produtos cadastrados
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          Nao se responsabiliza por informacoes falsas fornecidas
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-1" />
                        <span className="text-muted-foreground">
                          Nao realiza transporte ou logistica das doacoes
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    A plataforma Fome Zero atua como <strong className="text-foreground">facilitadora 
                    da conexao</strong> entre doadores e beneficiarios, fornecendo ferramentas para 
                    registro, rastreabilidade e gestao das doacoes. No entanto, a responsabilidade 
                    final pela qualidade e seguranca dos alimentos permanece com as partes envolvidas, 
                    que devem observar todas as normas sanitarias vigentes e as boas praticas de 
                    manipulacao de alimentos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Relacao com ODS 2 */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Contribuicao para a ODS 2 - Fome Zero
                  </h2>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                A Lei do Bom Samaritano e as praticas adotadas pela plataforma Fome Zero 
                estao diretamente alinhadas com os Objetivos de Desenvolvimento Sustentavel 
                da ONU, especialmente a ODS 2 - Fome Zero e Agricultura Sustentavel. A 
                legislacao brasileira cria as condicoes necessarias para viabilizar a 
                redistribuicao segura de alimentos, contribuindo para multiplas metas.
              </p>

              <div className="grid gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Meta 2.1 - Acesso a Alimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      <em>Acabar com a fome e garantir o acesso de todas as pessoas a alimentos 
                      seguros, nutritivos e suficientes durante todo o ano.</em>
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="text-foreground">
                        <strong>Como a legislacao contribui:</strong> Ao proteger juridicamente 
                        os doadores, a Lei do Bom Samaritano remove uma barreira significativa 
                        que impedia empresas de doar alimentos excedentes, ampliando o acesso 
                        de populacoes vulneraveis a alimentos seguros e nutritivos.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-secondary" />
                      Meta 2.2 - Qualidade Nutricional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      <em>Acabar com todas as formas de desnutricao e garantir as necessidades 
                      nutricionais de todas as pessoas.</em>
                    </p>
                    <div className="bg-secondary/5 p-4 rounded-lg">
                      <p className="text-foreground">
                        <strong>Como a legislacao contribui:</strong> A exigencia legal de que 
                        os alimentos doados estejam proprios para consumo garante que a 
                        redistribuicao contribua efetivamente para a nutricao adequada, e nao 
                        apenas para saciar a fome com alimentos de baixa qualidade.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-accent" />
                      Meta 2.4 - Reducao do Desperdicio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      <em>Garantir sistemas sustentaveis de producao de alimentos e implementar 
                      praticas agricolas resilientes que aumentem a produtividade.</em>
                    </p>
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <p className="text-foreground">
                        <strong>Como a legislacao contribui:</strong> Ao incentivar a doacao 
                        de alimentos excedentes em vez de seu descarte, a legislacao promove 
                        sistemas alimentares mais sustentaveis, reduzindo o desperdicio e 
                        otimizando o uso dos recursos ja empregados na producao de alimentos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusao */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Scale className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Consideracoes Finais</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      A Lei n 14.016/2020 representa um avanco significativo na legislacao 
                      brasileira voltada para a seguranca alimentar e o combate ao desperdicio. 
                      Ao estabelecer um marco juridico claro e protetor, a legislacao incentiva 
                      a participacao de empresas e estabelecimentos comerciais no esforco coletivo 
                      de redistribuicao de alimentos.
                    </p>
                    <p>
                      A plataforma Fome Zero opera em conformidade com essa legislacao, 
                      implementando mecanismos de controle, rastreabilidade e documentacao 
                      que garantem seguranca juridica para todos os participantes. Os termos 
                      de responsabilidade e confirmacoes digitais asseguram que as doacoes 
                      sejam realizadas de forma consciente e responsavel.
                    </p>
                    <p>
                      E importante ressaltar que a efetividade desse sistema depende do 
                      compromisso de todas as partes envolvidas em observar as normas 
                      estabelecidas. A legislacao oferece protecao, mas tambem exige 
                      responsabilidade. Juntos, lei e pratica responsavel criam as condicoes 
                      necessarias para que a redistribuicao de alimentos seja uma ferramenta 
                      eficaz no combate a fome e ao desperdicio no Brasil.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Referencias */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">Referencias Legais</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  BRASIL. Lei n 14.016, de 23 de junho de 2020. Dispoe sobre o combate ao 
                  desperdicio de alimentos e a doacao de excedentes de alimentos para o 
                  consumo humano. Diario Oficial da Uniao, Brasilia, DF, 24 jun. 2020.
                </li>
                <li>
                  BRASIL. Lei n 11.346, de 15 de setembro de 2006. Cria o Sistema Nacional 
                  de Seguranca Alimentar e Nutricional - SISAN. Diario Oficial da Uniao, 
                  Brasilia, DF, 18 set. 2006.
                </li>
                <li>
                  ONU. Transformando Nosso Mundo: A Agenda 2030 para o Desenvolvimento 
                  Sustentavel. Organizacao das Nacoes Unidas, 2015.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
