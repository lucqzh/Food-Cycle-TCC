<div align="center">

# 🌱 FoodCycle

**Plataforma Digital de Redistribuição de Alimentos**

> Trabalho de Conclusão de Curso — Engenharia de Software / Ciência da Computação

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![ODS 2](https://img.shields.io/badge/ODS%202-Fome%20Zero-DDA63A)](https://brasil.un.org/pt-br/sdgs/2)
[![Lei PNCPDA](https://img.shields.io/badge/Lei%20nº%2015.224%2F2025-PNCPDA-16A34A)](https://www.planalto.gov.br/)
[![License](https://img.shields.io/badge/Licença-MIT-blue)](LICENSE)

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Alinhamento com ODS 2 e Legislação](#-alinhamento-com-ods-2-e-legislação)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Esquema do Banco de Dados](#-esquema-do-banco-de-dados)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração e Instalação](#-configuração-e-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Execução](#-execução)
- [Deploy em Produção](#-deploy-em-produção)
- [Contexto Acadêmico](#-contexto-acadêmico)
- [Autores](#-autores)

---

## 🌍 Sobre o Projeto

O **FoodCycle** é uma plataforma web full-stack desenvolvida para conectar empresas doadoras de alimentos a instituições beneficiárias, como ONGs, abrigos e bancos de alimentos, atuando em conformidade com a **Lei nº 15.224/2025 — Programa Nacional de Combate ao Desperdício de Alimentos (PNCPDA)** e a **Lei nº 14.016/2020** (Lei de Combate ao Desperdício de Alimentos).

O sistema digitaliza e automatiza toda a cadeia de doação: desde o cadastro de lotes por empresas, passando pela solicitação por instituições, até a emissão de **Termos de Doação Sanitária** com validade legal e rastreabilidade por código de autenticação.

### Problema Abordado

Segundo o IBGE e a FAO, o Brasil desperdiça aproximadamente **46 milhões de toneladas** de alimentos por ano, enquanto mais de **33 milhões de pessoas** vivem em situação de insegurança alimentar. A falta de um sistema formal de rastreabilidade e conformidade sanitária é um dos principais obstáculos à doação organizada de excedentes alimentares.

### Solução Proposta

```
Empresa → [Cadastra Lote] → FoodCycle → [Exibe para Instituições]
                                     ↓
Instituição → [Solicita Lote] → Admin [Aprova/Coordena Entrega]
                                     ↓
                        [Gera Termo Sanitário PDF + Auditoria]
```

---

## ⚖️ Alinhamento com ODS 2 e Legislação

| Referência | Descrição |
|-----------|-----------|
| **ODS 2 — Fome Zero** | Erradicação da fome e promoção da segurança alimentar sustentável (UN Agenda 2030) |
| **Lei nº 15.224/2025** | PNCPDA — Programa Nacional de Combate ao Desperdício de Alimentos; obriga rastreabilidade de doações |
| **Lei nº 14.016/2020** | Autoriza e incentiva a doação de alimentos por empresas do setor produtivo e varejista |
| **ANVISA RDC 724/2022** | Padrões sanitários para transporte e manipulação de alimentos doados |

O FoodCycle implementa diretamente o **Art. 7º da Lei nº 15.224/2025**, que prevê a adoção de sistemas digitais para controle, rastreamento e auditoria das doações de alimentos, com emissão de documento sanitário eletrônico.

---

## ✨ Funcionalidades

### 👥 Portal da Empresa Doadora
- Cadastro e autenticação com Supabase Auth
- Dashboard com métricas em tempo real (kg doados, lotes ativos, destinos)
- Registro de lotes de doação com categoria, validade e quantidade (kg)
- Histórico completo de doações com **Termo de Doação Sanitária** (PDF/Impressão)
- Rastreamento de status: `disponivel → reservado → entregue`

### 🏢 Portal da Instituição Beneficiária
- Visualização de lotes disponíveis com filtros
- Solicitação de lotes com justificativa
- Acompanhamento de status de entregas

### 🛡️ Painel Administrativo
- Dashboard com métricas agregadas em **tempo real** (Supabase Realtime + WebSockets)
- Gestão completa de empresas, instituições, lotes e entregas (CRUD)
- **Controle de métricas em tempo real** com injeção de dados de demonstração
- Exclusão de lotes com **confirmação em modal** (sem `confirm()` nativo)
- **Logs de Auditoria** completos com filtragem por ação e usuário
- Badges coloridos por tipo de ação (criar=verde, editar=roxo, excluir=vermelho)
- Abertura de Termo Sanitário (PDF) por lote

### 📄 Termo de Doação Sanitária
- Documento oficial A4 com formatação de impressão
- Referência legal (Lei nº 15.224/2025 + 14.016/2020)
- Código de autenticação SHA256-style por lote
- Rota pública: `/comprovante/[codigo]`
- Integração com histórico do dashboard da empresa

### 🔔 Notificações em Tempo Real
- Toast notifications (Sonner) ao receber atualizações do admin
- Badge pulsante no dashboard indicando status da conexão Realtime
- Atualização automática de métricas via broadcast channel

### 🎨 UI/UX
- Tema claro/escuro com `next-themes` (padrão: escuro)
- Toggle de tema em todas as sidebars e header
- Design responsivo com Tailwind CSS v4
- Paleta verde-esmeralda (dashboard) e roxo (admin)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                      Next.js 15 (App Router)                │
│                                                             │
│  /                 Landing Page (Server Component)          │
│  /auth/login       Autenticação (Client Component)          │
│  /dashboard/*      Portal Empresa (Server + Client)         │
│  /admin/*          Painel Admin (Server + Client)           │
│  /comprovante/[codigo]  Termo PDF (Server Component)        │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS / WebSocket
┌───────────────────────▼─────────────────────────────────────┐
│                      SUPABASE                               │
│                                                             │
│  Auth        → JWT + RLS policies                           │
│  PostgreSQL  → 8 tabelas + views + funções                  │
│  Realtime    → Channels (broadcast + postgres_changes)      │
│  Storage     → (reservado para imagens futuras)             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação e Controle de Acesso

```
Usuário faz login (email/senha)
        ↓
Supabase Auth emite JWT
        ↓
profiles.tipo_usuario = 'empresa' | 'instituicao' | 'admin'
        ↓
Middleware Next.js valida sessão
        ↓
RLS no PostgreSQL filtra dados por user_id
Admin bypassa via função public.is_admin()
```

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Versão | Função |
|--------|-----------|--------|--------|
| **Framework** | Next.js | 15.x | App Router, RSC, SSR/SSG |
| **Linguagem** | TypeScript | 5.x | Tipagem estática full-stack |
| **Backend/BaaS** | Supabase | — | Auth, PostgreSQL, Realtime, RLS |
| **Banco de Dados** | PostgreSQL | 15 | Dados relacionais com RLS |
| **Estilização** | Tailwind CSS | v4 | Utility-first, tema escuro/claro |
| **Componentes** | shadcn/ui | — | Primitivos acessíveis (Radix UI) |
| **Ícones** | lucide-react | — | Biblioteca de ícones SVG |
| **Toast** | Sonner | 1.7.x | Notificações em tempo real |
| **Tema** | next-themes | 0.4.x | Dark/Light mode sem flash |
| **Mapas** | Leaflet | — | Visualização geográfica de doações |
| **Package Manager** | pnpm | — | Gerenciamento eficiente de deps |

---

## 🗄️ Esquema do Banco de Dados

```sql
profiles          → Dados de perfil de todos os usuários (tipo_usuario, nome)
empresas          → Dados de empresas doadoras (cnpj, nome_fantasia, setor)
instituicoes      → Dados de instituições beneficiárias (cnpj, tipo, capacidade)
intermediarios    → Transportadores / logística de entrega
doacoes           → Lotes de doação (categoria, kg, validade, status, codigo_rastreio)
solicitacoes      → Pedidos de instituições por lotes disponíveis
entregas          → Registro de entregas concluídas com data e responsável
admin_audit_logs  → Log imutável de todas as ações administrativas
```

### Políticas RLS (Row Level Security)

Todas as tabelas possuem RLS habilitado. As políticas garantem:
- **Empresa**: só vê e edita seus próprios dados
- **Instituição**: vê lotes disponíveis; edita apenas suas solicitações
- **Admin**: acesso irrestrito via `public.is_admin()` (verifica email master)
- **Anônimo**: acesso read-only à landing page e comprovantes públicos

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18.17
- [pnpm](https://pnpm.io/) ≥ 8 (`npm install -g pnpm`)
- Conta no [Supabase](https://supabase.com/) (plano gratuito suficiente)
- Git

---

## ⚙️ Configuração e Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Sant1208/Food-Cycle-TCC.git
cd Food-Cycle-TCC

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Configure o banco de dados
# Execute as migrations SQL no Supabase SQL Editor (pasta /supabase/migrations)

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase — encontre no dashboard: Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca** faça commit do `.env.local`. Ele já está listado no `.gitignore`.

Para produção, configure essas variáveis no painel da Vercel em **Settings → Environment Variables**.

---

## 🚀 Execução

```bash
# Desenvolvimento (hot reload)
pnpm dev

# Build de produção
pnpm build

# Servidor de produção local
pnpm start

# Verificação de tipos TypeScript
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

---

## ☁️ Deploy em Produção

### Via Vercel (Recomendado)

1. Faça fork/push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o projeto
3. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Clique em **Deploy**

A Vercel detecta automaticamente o Next.js 15 e configura o build sem necessidade de `vercel.json`.

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** no contexto da disciplina de Engenharia de Software / Desenvolvimento Web Avançado.

### Objetivos Acadêmicos

| Objetivo | Status |
|---------|--------|
| Arquitetura full-stack com BaaS moderno (Supabase) | ✅ Implementado |
| Autenticação e autorização com JWT + RLS | ✅ Implementado |
| Comunicação em tempo real (WebSockets/Realtime) | ✅ Implementado |
| Conformidade legal e sanitária (PNCPDA) | ✅ Implementado |
| Geração de documentos PDF/impressão | ✅ Implementado |
| Logs de auditoria e rastreabilidade | ✅ Implementado |
| Tema acessível (dark/light mode) | ✅ Implementado |
| Alinhamento com ODS 2 (Fome Zero) | ✅ Documentado |
| Deploy em ambiente de produção (Vercel) | ✅ Configurado |

### Contribuição Social

O FoodCycle demonstra como a tecnologia pode atuar diretamente no combate ao desperdício alimentar e na promoção da segurança alimentar, alinhando-se ao **Objetivo de Desenvolvimento Sustentável nº 2 (ODS 2)** da ONU — *Fome Zero e Agricultura Sustentável* — e à legislação brasileira vigente.

---

## 👨‍💻 Autores

<table>
  <tr>
    <td align="center">
      <strong>Santhiago Oliveira Parente</strong><br/>
      <a href="https://github.com/Sant1208">@Sant1208</a>
    </td>
  </tr>
</table>

---

<div align="center">

**FoodCycle** — *Transformando excedentes em esperança* 🌱

Desenvolvido com ❤️ como TCC acadêmico · Licença MIT

</div>
