-- =============================================================================
-- BANCO DE DADOS: FOME ZERO
-- Sistema de Redistribuição de Alimentos
-- Baseado na Lei nº 15.224/2025 (PNCPDA - Política Nacional de Combate
-- à Perda e ao Desperdício de Alimentos)
--
-- SGBD: MySQL 8.0+
-- Charset: utf8mb4 (suporte completo a UTF-8, incluindo emojis)
-- Engine: InnoDB (suporte a chaves estrangeiras e transações)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CRIAÇÃO DO BANCO DE DADOS
-- -----------------------------------------------------------------------------
DROP DATABASE IF EXISTS fome_zero;
CREATE DATABASE fome_zero
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fome_zero;

-- =============================================================================
-- 2. TABELA: USUARIOS
-- -----------------------------------------------------------------------------
-- Tabela central de autenticação. Armazena todos os usuários do sistema,
-- independentemente do tipo (empresa, instituição, intermediário ou admin).
-- Os dados específicos de cada perfil são armazenados em tabelas separadas
-- (empresas, instituicoes, intermediarios), relacionadas por usuario_id.
-- =============================================================================
CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    senha           VARCHAR(255)        NOT NULL COMMENT 'Hash da senha (bcrypt/argon2)',
    tipo            ENUM('empresa', 'instituicao', 'intermediario', 'admin') NOT NULL,
    telefone        VARCHAR(20)         NULL,
    ativo           BOOLEAN             NOT NULL DEFAULT TRUE,
    data_criacao    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_tipo  (tipo)
) ENGINE=InnoDB COMMENT='Usuários do sistema (empresas, instituições, intermediários e admins)';


-- =============================================================================
-- 3. TABELA: EMPRESAS
-- -----------------------------------------------------------------------------
-- Empresas doadoras de alimentos (mercados, restaurantes, padarias, indústrias).
-- O selo_doador segue a lógica do "Selo Doador de Alimentos" da PNCPDA,
-- concedido a empresas em conformidade com a política nacional.
-- =============================================================================
CREATE TABLE empresas (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id            INT             NOT NULL UNIQUE,
    cnpj                  VARCHAR(18)     NOT NULL UNIQUE COMMENT 'Formato: 00.000.000/0000-00',
    nome_empresa          VARCHAR(200)    NOT NULL,
    razao_social          VARCHAR(200)    NULL,
    ramo_atividade        VARCHAR(100)    NULL COMMENT 'Mercado, restaurante, padaria, indústria, etc.',
    endereco              VARCHAR(255)    NOT NULL,
    cidade                VARCHAR(100)    NOT NULL,
    estado                CHAR(2)         NOT NULL,
    cep                   VARCHAR(9)      NULL,
    latitude              DECIMAL(10, 8)  NULL,
    longitude             DECIMAL(11, 8)  NULL,
    selo_doador           BOOLEAN         NOT NULL DEFAULT FALSE COMMENT 'Selo Doador de Alimentos (PNCPDA)',
    nivel_selo            ENUM('aderente', 'prata', 'ouro') NULL,
    data_validade_selo    DATE            NULL,
    data_criacao          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_empresas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_empresas_cnpj   (cnpj),
    INDEX idx_empresas_cidade (cidade, estado),
    INDEX idx_empresas_selo   (selo_doador)
) ENGINE=InnoDB COMMENT='Empresas doadoras de alimentos cadastradas na plataforma';


-- =============================================================================
-- 4. TABELA: INSTITUICOES
-- -----------------------------------------------------------------------------
-- Instituições receptoras (ONGs, instituições religiosas, abrigos, etc.)
-- que recebem as doações de alimentos para distribuição a beneficiários.
-- =============================================================================
CREATE TABLE instituicoes (
    id                       INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id               INT             NOT NULL UNIQUE,
    cnpj                     VARCHAR(18)     NULL UNIQUE,
    nome_instituicao         VARCHAR(200)    NOT NULL,
    tipo                     ENUM('ong', 'religiosa', 'abrigo', 'comunitaria', 'publica', 'outra') NOT NULL,
    capacidade_atendimento   INT             NULL COMMENT 'Número de pessoas atendidas regularmente',
    endereco                 VARCHAR(255)    NOT NULL,
    cidade                   VARCHAR(100)    NOT NULL,
    estado                   CHAR(2)         NOT NULL,
    cep                      VARCHAR(9)      NULL,
    latitude                 DECIMAL(10, 8)  NULL,
    longitude                DECIMAL(11, 8)  NULL,
    responsavel              VARCHAR(150)    NULL,
    data_criacao             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_instituicoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_instituicoes_cidade (cidade, estado),
    INDEX idx_instituicoes_tipo   (tipo)
) ENGINE=InnoDB COMMENT='Instituições receptoras (ONGs, abrigos, etc.) cadastradas na plataforma';


-- =============================================================================
-- 5. TABELA: INTERMEDIARIOS
-- -----------------------------------------------------------------------------
-- Bancos de alimentos e operadores logísticos que fazem a ponte entre
-- empresas doadoras e instituições receptoras (ex.: Mesa Brasil SESC,
-- bancos municipais de alimentos, transportadoras parceiras).
-- =============================================================================
CREATE TABLE intermediarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT             NOT NULL UNIQUE,
    cnpj            VARCHAR(18)     NULL UNIQUE,
    nome            VARCHAR(200)    NOT NULL,
    tipo            ENUM('banco_alimentos', 'logistica', 'cooperativa', 'outro') NOT NULL,
    endereco        VARCHAR(255)    NOT NULL,
    cidade          VARCHAR(100)    NOT NULL,
    estado          CHAR(2)         NOT NULL,
    cep             VARCHAR(9)      NULL,
    raio_atuacao_km INT             NULL COMMENT 'Raio geográfico de atuação em km',
    data_criacao    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_intermediarios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_intermediarios_cidade (cidade, estado),
    INDEX idx_intermediarios_tipo   (tipo)
) ENGINE=InnoDB COMMENT='Bancos de alimentos e intermediários logísticos';


-- =============================================================================
-- 6. TABELA: DOACOES
-- -----------------------------------------------------------------------------
-- Doações cadastradas pelas empresas. Cada registro representa um lote de
-- alimento disponibilizado. O campo "destino" segue a hierarquia da PNCPDA:
-- 1º consumo humano, 2º consumo animal, 3º compostagem/biomassa.
-- A rastreabilidade é garantida pelo campo "codigo_rastreio" (único).
-- =============================================================================
CREATE TABLE doacoes (
    id                       INT AUTO_INCREMENT PRIMARY KEY,
    codigo_rastreio          VARCHAR(20)     NOT NULL UNIQUE COMMENT 'Código único de rastreamento (ex.: FZ-2025-000001)',
    empresa_id               INT             NOT NULL,
    tipo_alimento            VARCHAR(150)    NOT NULL COMMENT 'Nome do alimento (ex.: Arroz integral)',
    categoria                ENUM('proteina', 'graos_cereais', 'fruta', 'hortalica', 'laticinio', 'ultraprocessado', 'outro') NOT NULL,
    quantidade_kg            DECIMAL(10, 2)  NOT NULL,
    data_validade            DATE            NOT NULL,
    condicao_armazenamento   ENUM('ambiente', 'refrigerado', 'congelado') NOT NULL,
    destino                  ENUM('humano', 'animal', 'compostagem') NOT NULL DEFAULT 'humano'
                              COMMENT 'Hierarquia PNCPDA: humano > animal > compostagem',
    descricao                TEXT            NULL,
    microcoleta              BOOLEAN         NOT NULL DEFAULT FALSE
                              COMMENT 'Indica se faz parte de um programa de microcoleta',
    status                   ENUM('disponivel', 'reservado', 'em_transporte', 'entregue', 'cancelado', 'vencido') NOT NULL DEFAULT 'disponivel',
    termo_aceite             BOOLEAN         NOT NULL DEFAULT FALSE
                              COMMENT 'Confirmação digital do termo de responsabilidade (PNCPDA)',
    data_criacao             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_doacoes_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_doacoes_quantidade
        CHECK (quantidade_kg > 0),

    INDEX idx_doacoes_status      (status),
    INDEX idx_doacoes_categoria   (categoria),
    INDEX idx_doacoes_validade    (data_validade),
    INDEX idx_doacoes_empresa     (empresa_id),
    INDEX idx_doacoes_rastreio    (codigo_rastreio)
) ENGINE=InnoDB COMMENT='Lotes de alimentos doados pelas empresas';


-- =============================================================================
-- 7. TABELA: SOLICITACOES
-- -----------------------------------------------------------------------------
-- Solicitações feitas por instituições para receber uma doação específica.
-- Uma doação pode receber várias solicitações, mas apenas uma será aprovada
-- (controlado em nível de aplicação, podendo ser reforçado por trigger).
-- =============================================================================
CREATE TABLE solicitacoes (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    instituicao_id      INT             NOT NULL,
    doacao_id           INT             NOT NULL,
    status              ENUM('pendente', 'aprovado', 'recusado', 'cancelado') NOT NULL DEFAULT 'pendente',
    motivo_recusa       VARCHAR(255)    NULL,
    mensagem            TEXT            NULL COMMENT 'Mensagem da instituição justificando o pedido',
    data_solicitacao    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_resposta       DATETIME        NULL,

    CONSTRAINT fk_solicitacoes_instituicao
        FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_solicitacoes_doacao
        FOREIGN KEY (doacao_id) REFERENCES doacoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Evita que a mesma instituição faça solicitações duplicadas para a mesma doação
    UNIQUE KEY uk_solicitacoes_instituicao_doacao (instituicao_id, doacao_id),

    INDEX idx_solicitacoes_status     (status),
    INDEX idx_solicitacoes_doacao     (doacao_id),
    INDEX idx_solicitacoes_instituicao (instituicao_id)
) ENGINE=InnoDB COMMENT='Solicitações de doações feitas pelas instituições';


-- =============================================================================
-- 8. TABELA: ENTREGAS
-- -----------------------------------------------------------------------------
-- Controle logístico das entregas. O intermediário (banco de alimentos /
-- transportadora) é responsável por levar a doação da empresa até a
-- instituição. Cada entrega tem datas de envio e de entrega registradas.
-- =============================================================================
CREATE TABLE entregas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    doacao_id           INT             NOT NULL UNIQUE,
    intermediario_id    INT             NULL COMMENT 'NULL quando a entrega é direta empresa -> instituição',
    solicitacao_id      INT             NULL,
    data_envio          DATETIME        NULL,
    data_entrega        DATETIME        NULL,
    data_prevista       DATETIME        NULL,
    status              ENUM('agendada', 'em_transporte', 'entregue', 'falha', 'cancelada') NOT NULL DEFAULT 'agendada',
    observacoes         TEXT            NULL,
    temperatura_envio   DECIMAL(5, 2)   NULL COMMENT 'Para alimentos refrigerados/congelados',
    temperatura_entrega DECIMAL(5, 2)   NULL,
    data_criacao        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_entregas_doacao
        FOREIGN KEY (doacao_id) REFERENCES doacoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_entregas_intermediario
        FOREIGN KEY (intermediario_id) REFERENCES intermediarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_entregas_solicitacao
        FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_entregas_status         (status),
    INDEX idx_entregas_intermediario  (intermediario_id)
) ENGINE=InnoDB COMMENT='Entregas das doações (logística e rastreamento)';


-- =============================================================================
-- 9. TABELA: REGISTROS
-- -----------------------------------------------------------------------------
-- Confirmação de recebimento da doação pela instituição. Este registro
-- fecha o ciclo de rastreabilidade exigido pela PNCPDA, comprovando que
-- o alimento chegou ao destino e em que condições.
-- =============================================================================
CREATE TABLE registros (
    id                       INT AUTO_INCREMENT PRIMARY KEY,
    doacao_id                INT             NOT NULL,
    instituicao_id           INT             NOT NULL,
    entrega_id               INT             NULL,
    recebido                 BOOLEAN         NOT NULL,
    quantidade_recebida_kg   DECIMAL(10, 2)  NULL COMMENT 'Pode ser diferente do total doado em caso de perda no transporte',
    condicao_recebimento     ENUM('otima', 'boa', 'regular', 'ruim') NULL,
    pessoas_beneficiadas     INT             NULL COMMENT 'Estimativa de pessoas que receberam o alimento',
    observacoes              TEXT            NULL,
    data_registro            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registros_doacao
        FOREIGN KEY (doacao_id) REFERENCES doacoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_registros_instituicao
        FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_registros_entrega
        FOREIGN KEY (entrega_id) REFERENCES entregas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_registros_doacao      (doacao_id),
    INDEX idx_registros_instituicao (instituicao_id),
    INDEX idx_registros_data        (data_registro)
) ENGINE=InnoDB COMMENT='Registros de confirmação de recebimento das doações';


-- =============================================================================
-- 10. TABELA: HISTORICO_STATUS
-- -----------------------------------------------------------------------------
-- DIFERENCIAL: tabela de auditoria que registra todas as mudanças de status
-- de doações, solicitações e entregas. Garante rastreabilidade completa
-- exigida pela PNCPDA e permite análises de funil e tempo de ciclo.
-- =============================================================================
CREATE TABLE historico_status (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    entidade        ENUM('doacao', 'solicitacao', 'entrega') NOT NULL,
    entidade_id     INT             NOT NULL COMMENT 'ID do registro na tabela correspondente',
    status_anterior VARCHAR(30)     NULL,
    status_novo     VARCHAR(30)     NOT NULL,
    usuario_id      INT             NULL COMMENT 'Usuário que provocou a mudança',
    motivo          VARCHAR(255)    NULL,
    data_mudanca    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historico_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_historico_entidade (entidade, entidade_id),
    INDEX idx_historico_data     (data_mudanca)
) ENGINE=InnoDB COMMENT='Histórico de mudanças de status (auditoria e rastreabilidade)';


-- =============================================================================
-- 11. TABELA: METRICAS
-- -----------------------------------------------------------------------------
-- Snapshots periódicos de métricas globais do sistema, usados para alimentar
-- dashboards de impacto social e relatórios da PNCPDA.
-- =============================================================================
CREATE TABLE metricas (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    total_kg              DECIMAL(14, 2)  NOT NULL DEFAULT 0,
    total_doacoes         INT             NOT NULL DEFAULT 0,
    total_empresas        INT             NOT NULL DEFAULT 0,
    total_instituicoes    INT             NOT NULL DEFAULT 0,
    total_intermediarios  INT             NOT NULL DEFAULT 0,
    total_refeicoes       INT             NOT NULL DEFAULT 0 COMMENT 'Estimativa: 1 kg ~ 4 refeições',
    kg_humano             DECIMAL(14, 2)  NOT NULL DEFAULT 0,
    kg_animal             DECIMAL(14, 2)  NOT NULL DEFAULT 0,
    kg_compostagem        DECIMAL(14, 2)  NOT NULL DEFAULT 0,
    data_atualizacao      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_metricas_data (data_atualizacao)
) ENGINE=InnoDB COMMENT='Snapshots de métricas globais do sistema (dashboard de impacto)';


-- =============================================================================
-- 12. TABELA: CATEGORIAS_NUTRICIONAIS (suporte a métricas por instituição)
-- -----------------------------------------------------------------------------
-- DIFERENCIAL: armazena o consumo por categoria nutricional de cada
-- instituição, permitindo o cálculo do índice de diversidade alimentar e
-- a geração de alertas (baixa diversidade, excesso de ultraprocessados).
-- =============================================================================
CREATE TABLE diversidade_instituicao (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    instituicao_id      INT             NOT NULL,
    categoria           ENUM('proteina', 'graos_cereais', 'fruta', 'hortalica', 'laticinio', 'ultraprocessado', 'outro') NOT NULL,
    total_kg            DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    mes_referencia      DATE            NOT NULL COMMENT 'Primeiro dia do mês de referência',
    data_atualizacao    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_diversidade_instituicao
        FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_diversidade_inst_cat_mes (instituicao_id, categoria, mes_referencia),

    INDEX idx_diversidade_mes (mes_referencia)
) ENGINE=InnoDB COMMENT='Consumo mensal por categoria nutricional para análise de diversidade';


-- =============================================================================
-- 13. TRIGGERS DE AUDITORIA (HISTÓRICO DE STATUS)
-- -----------------------------------------------------------------------------
-- DIFERENCIAL: triggers que registram automaticamente toda mudança de status
-- na tabela historico_status, garantindo trilha de auditoria sem depender
-- da camada de aplicação.
-- =============================================================================

DELIMITER $$

CREATE TRIGGER trg_doacoes_status_update
AFTER UPDATE ON doacoes
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO historico_status (entidade, entidade_id, status_anterior, status_novo)
        VALUES ('doacao', NEW.id, OLD.status, NEW.status);
    END IF;
END$$

CREATE TRIGGER trg_solicitacoes_status_update
AFTER UPDATE ON solicitacoes
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO historico_status (entidade, entidade_id, status_anterior, status_novo)
        VALUES ('solicitacao', NEW.id, OLD.status, NEW.status);
    END IF;
END$$

CREATE TRIGGER trg_entregas_status_update
AFTER UPDATE ON entregas
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO historico_status (entidade, entidade_id, status_anterior, status_novo)
        VALUES ('entrega', NEW.id, OLD.status, NEW.status);
    END IF;
END$$

DELIMITER ;


-- =============================================================================
-- 14. VIEW: DOACOES_DISPONIVEIS
-- -----------------------------------------------------------------------------
-- View consolidada para a tela de "Doações Disponíveis" (instituições).
-- Junta dados da doação, da empresa doadora e da localização.
-- =============================================================================
CREATE OR REPLACE VIEW vw_doacoes_disponiveis AS
SELECT
    d.id,
    d.codigo_rastreio,
    d.tipo_alimento,
    d.categoria,
    d.quantidade_kg,
    d.data_validade,
    d.condicao_armazenamento,
    d.destino,
    d.descricao,
    d.data_criacao,
    e.id           AS empresa_id,
    e.nome_empresa,
    e.cidade       AS empresa_cidade,
    e.estado       AS empresa_estado,
    e.selo_doador,
    e.nivel_selo,
    DATEDIFF(d.data_validade, CURDATE()) AS dias_para_vencer
FROM doacoes d
INNER JOIN empresas e ON e.id = d.empresa_id
WHERE d.status = 'disponivel'
  AND d.data_validade >= CURDATE();


-- =============================================================================
-- 15. VIEW: IMPACTO_GLOBAL
-- -----------------------------------------------------------------------------
-- View de impacto agregado, usada na página pública de impacto social.
-- =============================================================================
CREATE OR REPLACE VIEW vw_impacto_global AS
SELECT
    COALESCE(SUM(r.quantidade_recebida_kg), 0)        AS total_kg_redistribuidos,
    COUNT(DISTINCT r.id)                              AS total_doacoes_entregues,
    COUNT(DISTINCT r.instituicao_id)                  AS total_instituicoes_atendidas,
    (SELECT COUNT(*) FROM empresas)                   AS total_empresas_cadastradas,
    COALESCE(SUM(r.pessoas_beneficiadas), 0)          AS total_pessoas_beneficiadas,
    COALESCE(ROUND(SUM(r.quantidade_recebida_kg) * 4), 0) AS total_refeicoes_estimadas
FROM registros r
WHERE r.recebido = TRUE;


-- =============================================================================
-- 16. DADOS DE EXEMPLO (SEED) — opcional, útil para testes
-- =============================================================================

-- Usuários
INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES
('Admin Sistema',         'admin@fomezero.org',     '$2y$10$exemplo_hash_admin',    'admin',         '(11) 0000-0000'),
('Supermercado Vida',     'contato@svida.com.br',   '$2y$10$exemplo_hash_empresa1', 'empresa',       '(11) 1111-1111'),
('Padaria Pão Quente',    'contato@paoquente.com',  '$2y$10$exemplo_hash_empresa2', 'empresa',       '(11) 2222-2222'),
('ONG Mãos Solidárias',   'contato@maossolidarias.org','$2y$10$exemplo_hash_inst1', 'instituicao',   '(11) 3333-3333'),
('Abrigo Esperança',      'contato@abrigoesp.org',  '$2y$10$exemplo_hash_inst2',   'instituicao',   '(11) 4444-4444'),
('Banco de Alimentos SP', 'contato@bancoalimentos.org','$2y$10$exemplo_hash_int1', 'intermediario', '(11) 5555-5555');

-- Empresas
INSERT INTO empresas (usuario_id, cnpj, nome_empresa, ramo_atividade, endereco, cidade, estado, selo_doador, nivel_selo, data_validade_selo) VALUES
(2, '11.111.111/0001-11', 'Supermercado Vida',  'Mercado',  'Av. Brasil, 1000', 'São Paulo', 'SP', TRUE, 'ouro',  '2026-12-31'),
(3, '22.222.222/0001-22', 'Padaria Pão Quente', 'Padaria',  'Rua das Flores, 250', 'São Paulo', 'SP', TRUE, 'prata', '2026-06-30');

-- Instituições
INSERT INTO instituicoes (usuario_id, nome_instituicao, tipo, capacidade_atendimento, endereco, cidade, estado, responsavel) VALUES
(4, 'ONG Mãos Solidárias', 'ong',     250, 'Rua da Solidariedade, 100', 'São Paulo', 'SP', 'Maria Silva'),
(5, 'Abrigo Esperança',    'abrigo',  120, 'Rua Esperança, 50',         'São Paulo', 'SP', 'João Santos');

-- Intermediário
INSERT INTO intermediarios (usuario_id, cnpj, nome, tipo, endereco, cidade, estado, raio_atuacao_km) VALUES
(6, '33.333.333/0001-33', 'Banco de Alimentos SP', 'banco_alimentos', 'Av. Logística, 500', 'São Paulo', 'SP', 50);

-- Doações
INSERT INTO doacoes (codigo_rastreio, empresa_id, tipo_alimento, categoria, quantidade_kg, data_validade, condicao_armazenamento, destino, descricao, termo_aceite, status) VALUES
('FZ-2025-000001', 1, 'Arroz integral 5kg',   'graos_cereais', 50.00, '2026-08-15', 'ambiente',     'humano', 'Pacotes lacrados, próximos do vencimento', TRUE, 'disponivel'),
('FZ-2025-000002', 1, 'Maçã Gala',            'fruta',         30.50, '2026-05-10', 'ambiente',     'humano', 'Frutas levemente amassadas, próprias para consumo', TRUE, 'disponivel'),
('FZ-2025-000003', 2, 'Pão francês do dia',   'graos_cereais', 12.00, '2026-05-02', 'ambiente',     'humano', 'Sobras do dia anterior',                  TRUE, 'reservado'),
('FZ-2025-000004', 1, 'Iogurte natural',      'laticinio',      8.75, '2026-05-08', 'refrigerado',  'humano', 'Caixas próximas do vencimento',          TRUE, 'em_transporte');

-- Solicitação
INSERT INTO solicitacoes (instituicao_id, doacao_id, status, mensagem, data_resposta) VALUES
(1, 3, 'aprovado', 'Atendemos 150 pessoas no café da manhã', NOW());

-- Entrega
INSERT INTO entregas (doacao_id, intermediario_id, solicitacao_id, data_envio, data_prevista, status, temperatura_envio) VALUES
(4, 1, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), 'em_transporte', 5.50);

-- Registro de recebimento
INSERT INTO registros (doacao_id, instituicao_id, recebido, quantidade_recebida_kg, condicao_recebimento, pessoas_beneficiadas, observacoes) VALUES
(3, 1, TRUE, 12.00, 'boa', 150, 'Recebido em ótimas condições, distribuído no mesmo dia');

-- Snapshot de métricas
INSERT INTO metricas (total_kg, total_doacoes, total_empresas, total_instituicoes, total_intermediarios, total_refeicoes, kg_humano, kg_animal, kg_compostagem) VALUES
(101.25, 4, 2, 2, 1, 405, 101.25, 0.00, 0.00);


-- =============================================================================
-- FIM DO SCRIPT
-- =============================================================================
-- Para verificar a estrutura criada:
--   SHOW TABLES;
--   SELECT * FROM vw_doacoes_disponiveis;
--   SELECT * FROM vw_impacto_global;
-- =============================================================================
