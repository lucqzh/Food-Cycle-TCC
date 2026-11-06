-- =============================================================================
-- BANCO DE DADOS: FOOD CYCLE (FOME ZERO)
-- Sistema de Redistribuição de Alimentos
-- Baseado na Lei nº 15.224/2025 (PNCPDA - Política Nacional de Combate
-- à Perda e ao Desperdício de Alimentos) e ODS 2 da ONU
--
-- SGBD: PostgreSQL 15+ (Supabase)
-- Suporte completo a UUID, Row Level Security (RLS) e Triggers
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. TIPOS ENUMERADOS (ENUMS)
-- =============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario') THEN
        CREATE TYPE tipo_usuario AS ENUM ('empresa', 'instituicao', 'intermediario', 'admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_instituicao') THEN
        CREATE TYPE tipo_instituicao AS ENUM ('ong', 'religiosa', 'abrigo', 'comunitaria', 'publica', 'outra');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_intermediario') THEN
        CREATE TYPE tipo_intermediario AS ENUM ('banco_alimentos', 'logistica', 'cooperativa', 'outro');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoria_alimento') THEN
        CREATE TYPE categoria_alimento AS ENUM ('proteina', 'graos_cereais', 'fruta', 'hortalica', 'laticinio', 'ultraprocessado', 'outro');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'condicao_armazenamento_enum') THEN
        CREATE TYPE condicao_armazenamento_enum AS ENUM ('ambiente', 'refrigerado', 'congelado');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'destino_alimento') THEN
        CREATE TYPE destino_alimento AS ENUM ('humano', 'animal', 'compostagem');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_doacao') THEN
        CREATE TYPE status_doacao AS ENUM ('disponivel', 'reservado', 'em_transporte', 'entregue', 'cancelado', 'vencido');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_solicitacao') THEN
        CREATE TYPE status_solicitacao AS ENUM ('pendente', 'aprovado', 'recusado', 'cancelado');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_entrega') THEN
        CREATE TYPE status_entrega AS ENUM ('agendada', 'em_transporte', 'entregue', 'falha', 'cancelada');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'condicao_recebimento_enum') THEN
        CREATE TYPE condicao_recebimento_enum AS ENUM ('otima', 'boa', 'regular', 'ruim');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nivel_selo_enum') THEN
        CREATE TYPE nivel_selo_enum AS ENUM ('aderente', 'prata', 'ouro');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entidade_historico') THEN
        CREATE TYPE entidade_historico AS ENUM ('doacao', 'solicitacao', 'entrega');
    END IF;
END $$;

-- Sequence para códigos de rastreio (FC-YYYY-XXXXXX)
CREATE SEQUENCE IF NOT EXISTS public.seq_codigo_rastreio START 1;

-- =============================================================================
-- 2. TABELA: PROFILES (Perfis integrados ao Supabase Auth)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nome TEXT,
    tipo TEXT CHECK (tipo IN ('empresa', 'instituicao', 'intermediario', 'admin')),
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. TABELA: EMPRESAS (Doadoras de Alimentos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.empresas (
    id SERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    usuario_id INT NULL,
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(200) NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    inscricao_est VARCHAR(50) NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    contato_nome VARCHAR(150) NULL,
    contato_cargo VARCHAR(100) NULL,
    nivel_selo nivel_selo_enum DEFAULT 'aderente',
    data_adesao_selo TIMESTAMPTZ NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL
);

-- =============================================================================
-- 4. TABELA: INSTITUICOES (Receptoras - ONGs, Abrigos, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.instituicoes (
    id SERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    usuario_id INT NULL,
    razao_social VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) NULL UNIQUE,
    tipo_instituicao tipo_instituicao NOT NULL DEFAULT 'ong',
    capacidade_atend INT NULL,
    pessoas_atendidas INT NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    responsavel_tecnico VARCHAR(150) NULL,
    alvara_sanitario VARCHAR(100) NULL,
    validade_alvara DATE NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL
);

-- =============================================================================
-- 5. TABELA: INTERMEDIARIOS (Bancos de Alimentos / Logística)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.intermediarios (
    id SERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    usuario_id INT NULL,
    razao_social VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    tipo_intermediario tipo_intermediario NOT NULL DEFAULT 'banco_alimentos',
    capacidade_armazen INT NULL,
    possui_refrigeracao BOOLEAN DEFAULT FALSE,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL
);

-- =============================================================================
-- 6. TABELA: DOACOES (Lotes de Alimentos Disponibilizados)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.doacoes (
    id SERIAL PRIMARY KEY,
    empresa_id INT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    codigo_rastreio VARCHAR(50) NOT NULL UNIQUE,
    titulo VARCHAR(255) NULL,
    tipo_alimento VARCHAR(255) NULL,
    descricao TEXT NULL,
    categoria categoria_alimento NOT NULL,
    quantidade_kg NUMERIC(10, 2) NOT NULL,
    data_validade DATE NOT NULL,
    armazenamento condicao_armazenamento_enum NULL,
    condicao_armazenamento VARCHAR(50) NULL,
    destino_recomendado destino_alimento NULL DEFAULT 'humano',
    destino VARCHAR(50) NULL DEFAULT 'humano',
    microcoleta BOOLEAN DEFAULT FALSE,
    termo_aceite BOOLEAN DEFAULT TRUE,
    status status_doacao DEFAULT 'disponivel',
    data_disponivel TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data_recolha_limite TIMESTAMPTZ NULL
);

-- =============================================================================
-- 7. TABELA: SOLICITACOES (Pedidos de Instituições sobre Doações)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.solicitacoes (
    id SERIAL PRIMARY KEY,
    instituicao_id INT NOT NULL REFERENCES public.instituicoes(id) ON DELETE CASCADE,
    doacao_id INT NOT NULL REFERENCES public.doacoes(id) ON DELETE CASCADE,
    quantidade_solic NUMERIC(10, 2) NULL,
    status status_solicitacao DEFAULT 'pendente',
    mensagem TEXT NULL,
    motivo_recusa TEXT NULL,
    data_solicitacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMPTZ NULL
);

-- =============================================================================
-- 8. TABELA: ENTREGAS (Rastreamento logístico da doação)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.entregas (
    id SERIAL PRIMARY KEY,
    doacao_id INT NOT NULL REFERENCES public.doacoes(id) ON DELETE CASCADE,
    solicitacao_id INT NOT NULL REFERENCES public.solicitacoes(id) ON DELETE CASCADE,
    intermediario_id INT NULL REFERENCES public.intermediarios(id) ON DELETE SET NULL,
    data_agendada TIMESTAMPTZ NOT NULL,
    data_entrega TIMESTAMPTZ NULL,
    status status_entrega DEFAULT 'agendada',
    condicao_recebimento condicao_recebimento_enum NULL,
    observacoes TEXT NULL
);

-- =============================================================================
-- 9. TABELA: HISTORICO_STATUS (Auditoria de transições de status)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.historico_status (
    id SERIAL PRIMARY KEY,
    entidade entidade_historico NOT NULL,
    entidade_id INT NOT NULL,
    status_anterior VARCHAR(50) NULL,
    status_novo VARCHAR(50) NOT NULL,
    observacao TEXT NULL,
    data_alteracao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 10. TABELA: METRICAS (Indicadores de Impacto Socioambiental)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.metricas (
    id SERIAL PRIMARY KEY,
    empresa_id INT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    instituicao_id INT NULL REFERENCES public.instituicoes(id) ON DELETE CASCADE,
    total_kg_doados NUMERIC(12, 2) DEFAULT 0,
    total_refeicoes INT DEFAULT 0,
    co2_evitado_kg NUMERIC(12, 2) DEFAULT 0,
    data_atualizacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
