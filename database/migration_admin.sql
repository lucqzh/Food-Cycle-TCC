-- =============================================================================
-- FOOD CYCLE — MIGRAÇÃO DO PAINEL ADMINISTRATIVO & AUDITORIA
-- Arquivo: database/migration_admin.sql
-- =============================================================================

-- 1. Assegurar que o enum 'tipo_usuario' possui o valor 'admin'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'tipo_usuario' AND e.enumlabel = 'admin'
    ) THEN
        ALTER TYPE tipo_usuario ADD VALUE 'admin';
    END IF;
END $$;

-- 2. Tabela de Perfis (profiles) vinculada a auth.users (caso não exista ou precise de colunas)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nome TEXT,
    tipo tipo_usuario NOT NULL DEFAULT 'empresa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para manter atualizado o profiles ao criar usuário no auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nome, tipo)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'tipo')::tipo_usuario, 'empresa'::tipo_usuario)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, profiles.nome);
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Tabela de Auditoria Administrativa (admin_audit_logs)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(100) NOT NULL,
    entidade_id TEXT NULL,
    detalhes JSONB NULL,
    ip_origem TEXT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.admin_audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_entidade ON public.admin_audit_logs (entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_audit_data ON public.admin_audit_logs (data_criacao DESC);

-- 4. Função segura de verificação se o usuário atual é ADMIN (usada em RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND tipo = 'admin'
    );
END;
$$;

-- 5. Ativar Row Level Security (RLS) nas tabelas principais
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de RLS para Administradores
-- Políticas para admin_audit_logs: apenas admins podem visualizar e inserir; ninguém edita ou remove histórico
DROP POLICY IF EXISTS "Admins podem visualizar logs de auditoria" ON public.admin_audit_logs;
CREATE POLICY "Admins podem visualizar logs de auditoria"
    ON public.admin_audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins podem registrar logs de auditoria" ON public.admin_audit_logs;
CREATE POLICY "Admins podem registrar logs de auditoria"
    ON public.admin_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Políticas gerais para Profiles
DROP POLICY IF EXISTS "Usuarios visualizam seu proprio perfil ou admins visualizam todos" ON public.profiles;
CREATE POLICY "Usuarios visualizam seu proprio perfil ou admins visualizam todos"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins podem gerenciar perfis" ON public.profiles;
CREATE POLICY "Admins podem gerenciar perfis"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Políticas para Empresas (Admin acesso total de leitura e edição regulatória)
DROP POLICY IF EXISTS "Admins possuem acesso total as empresas" ON public.empresas;
CREATE POLICY "Admins possuem acesso total as empresas"
    ON public.empresas
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Políticas para Instituições
DROP POLICY IF EXISTS "Admins possuem acesso total as instituicoes" ON public.instituicoes;
CREATE POLICY "Admins possuem acesso total as instituicoes"
    ON public.instituicoes
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Políticas para Doações
DROP POLICY IF EXISTS "Admins possuem acesso total as doacoes" ON public.doacoes;
CREATE POLICY "Admins possuem acesso total as doacoes"
    ON public.doacoes
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Políticas para Solicitações
DROP POLICY IF EXISTS "Admins possuem acesso total as solicitacoes" ON public.solicitacoes;
CREATE POLICY "Admins possuem acesso total as solicitacoes"
    ON public.solicitacoes
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =============================================================================
-- 7. ATRIBUIÇÃO DA CONTA ADMINISTRADORA OFICIAL
-- E-mail: santhiagooliveiraparente@gmail.com
-- =============================================================================
DO $$
DECLARE
    target_uid UUID;
BEGIN
    SELECT id INTO target_uid FROM auth.users WHERE email = 'santhiagooliveiraparente@gmail.com';

    IF target_uid IS NOT NULL THEN
        -- Insere ou atualiza o perfil como 'admin'
        INSERT INTO public.profiles (id, email, nome, tipo)
        VALUES (target_uid, 'santhiagooliveiraparente@gmail.com', 'Santhiago Parente (Admin)', 'admin')
        ON CONFLICT (id) DO UPDATE SET tipo = 'admin';

        -- Atualiza também na tabela 'usuarios' se existir
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'usuarios') THEN
            UPDATE public.usuarios SET tipo = 'admin' WHERE email = 'santhiagooliveiraparente@gmail.com';
        END IF;

        RAISE NOTICE '>>> SUCESSO: Conta santhiagooliveiraparente@gmail.com promovida para ADMIN!';
    ELSE
        RAISE NOTICE '>>> AVISO: O usuário santhiagooliveiraparente@gmail.com ainda não concluiu o cadastro em auth.users.';
        RAISE NOTICE '>>> Assim que o cadastro for realizado na tela /cadastro, execute este bloco novamente.';
    END IF;
END $$;
