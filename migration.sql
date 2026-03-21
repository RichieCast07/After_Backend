  -- =============================================================
  -- AFTER App — Database Migration Script
  -- Generated: 2026-03-12
  -- =============================================================
  -- USAGE:
  --   • FRESH INSTALL  → Run Section 1 only (creates everything from scratch)
  --   • UPGRADE        → Run Section 2 only (alters your existing tables)
  -- =============================================================


  -- =============================================================
  -- SECTION 1: FRESH SCHEMA  (for new / empty databases)
  -- =============================================================

  CREATE DATABASE IF NOT EXISTS after_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  USE after_db;

  -- ── Roles ────────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS roles (
    id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
  ) ENGINE = InnoDB;

  INSERT IGNORE INTO roles (id, nombre) VALUES
    (1, 'ADMIN'),
    (2, 'RP'),
    (3, 'MANAGER');

  -- ── Usuarios ─────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS usuarios (
    id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(120)  NOT NULL,
    telefono        VARCHAR(20)   NOT NULL,
    username        VARCHAR(60)   NOT NULL UNIQUE,
    password_hash   VARCHAR(255)  NOT NULL,
    rol_id          INT UNSIGNED  NOT NULL,
    comision_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    activo          TINYINT(1)    NOT NULL DEFAULT 1,
    fecha_creacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles (id)
  ) ENGINE = InnoDB;

  -- ── Eventos ──────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS eventos (
    id              INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(120)   NOT NULL,
    codigo_evento   VARCHAR(32)    NOT NULL UNIQUE,
    precio_inicial  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    fecha_evento    DATETIME       NOT NULL,
    lugar           VARCHAR(200)   NOT NULL,
    maps_url        VARCHAR(500)   NULL,
    activo          TINYINT(1)     NOT NULL DEFAULT 1,
    fecha_creacion  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE = InnoDB;

  -- ── Fases ────────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS fases (
    id           INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    evento_id    INT UNSIGNED   NOT NULL,
    nombre       VARCHAR(80)    NOT NULL,
    precio       DECIMAL(10, 2) NOT NULL,
    fecha_inicio DATETIME       NOT NULL,
    fecha_fin    DATETIME       NOT NULL,
    activa       TINYINT(1)     NOT NULL DEFAULT 1,
    FOREIGN KEY (evento_id) REFERENCES eventos (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  -- ── Tipos de boleto por evento ─────────────────────────────
  CREATE TABLE IF NOT EXISTS ticket_types (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT UNSIGNED NOT NULL,
    nombre         VARCHAR(50)  NOT NULL,
    activo         TINYINT(1)   NOT NULL DEFAULT 1,
    fecha_creacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ticket_type_event_name (evento_id, nombre),
    FOREIGN KEY (evento_id) REFERENCES eventos (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  -- ── Precio por tipo en cada fase ───────────────────────────
  CREATE TABLE IF NOT EXISTS phase_ticket_type_prices (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fase_id        INT UNSIGNED NOT NULL,
    ticket_type_id INT UNSIGNED NOT NULL,
    precio         DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY uq_phase_ticket_type (fase_id, ticket_type_id),
    FOREIGN KEY (fase_id) REFERENCES fases (id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  -- ── Clientes ─────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS clientes (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    telefono        VARCHAR(20)  NOT NULL UNIQUE,
    fecha_registro  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE = InnoDB;

  -- ── Boletos ──────────────────────────────────────────────────
  -- codigo  : UUID string that is also the QR code payload
  -- estado  : ACTIVO = ticket valid / USADO = already scanned at door
  CREATE TABLE IF NOT EXISTS boletos (
    id          INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    codigo      VARCHAR(36)    NOT NULL UNIQUE,          -- QR / barcode value
    cliente_id  INT UNSIGNED   NOT NULL,
    rp_id       INT UNSIGNED   NOT NULL,
    evento_id   INT UNSIGNED   NOT NULL,
    fase_id     INT UNSIGNED   NOT NULL,
    tipo_boleto VARCHAR(50)    NOT NULL DEFAULT 'GENERAL',
    precio      DECIMAL(10, 2) NOT NULL,
    comision_rp DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estado      ENUM('ACTIVO', 'USADO') NOT NULL DEFAULT 'ACTIVO',
    qr_payload  TEXT           NULL,
    fecha_venta DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_uso   DATETIME       NULL     DEFAULT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes  (id),
    FOREIGN KEY (rp_id)      REFERENCES usuarios  (id),
    FOREIGN KEY (evento_id)  REFERENCES eventos   (id),
    FOREIGN KEY (fase_id)    REFERENCES fases     (id),
    UNIQUE KEY uq_boletos_cliente_evento (cliente_id, evento_id)
  ) ENGINE = InnoDB;


  -- ── Default Admin user ───────────────────────────────────────
  -- Generate a real bcrypt hash by running this command in a terminal
  -- (inside After_Backend, where bcryptjs is installed):
  --
  --   node -e "import('bcryptjs').then(m => m.default.hash('Admin1234!', 10).then(h => console.log(h)))"
  --
  -- Then replace the placeholder hash below with the output.
  --
  INSERT IGNORE INTO usuarios
    (nombre_completo, telefono, username, password_hash, rol_id, activo)
  VALUES
    ('Admin', '0000000000', 'admin', '$2b$10$Ip5AMJHegg4CKRzbno3C3uSJRAgk.DwL3oLwRRgDnsyRYB9FjmN0q', 1, 1);


  -- =============================================================
  -- SECTION 2: UPGRADE (for existing databases with old schema)
  -- Run each block independently; skip any that don't apply.
  -- =============================================================

  -- 2.1  Add MANAGER role (safe even if already present)
  INSERT IGNORE INTO roles (id, nombre) VALUES (3, 'MANAGER');

  -- 2.2  Add precio_inicial column to eventos (if upgrading from old schema)
  ALTER TABLE eventos ADD COLUMN IF NOT EXISTS precio_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER codigo_evento;

  -- 2.3  Backfill precio_inicial from first phase for existing events
  UPDATE eventos e
    INNER JOIN fases f ON f.evento_id = e.id
  SET e.precio_inicial = f.precio
  WHERE e.precio_inicial = 0
    AND f.id = (SELECT MIN(fi.id) FROM fases fi WHERE fi.evento_id = e.id);

  -- 2.2  Add 'codigo' column to boletos (old schema lacked it)
  ALTER TABLE boletos
    ADD COLUMN IF NOT EXISTS codigo VARCHAR(36) NULL
    AFTER id;

  -- 2.3  Add 'comision_rp' column
  ALTER TABLE boletos
    ADD COLUMN IF NOT EXISTS comision_rp DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

  -- 2.3b Add qr payload snapshot column
  ALTER TABLE boletos
    ADD COLUMN IF NOT EXISTS qr_payload TEXT NULL;

  -- 2.4  Add 'fecha_uso' column
  ALTER TABLE boletos
    ADD COLUMN IF NOT EXISTS fecha_uso DATETIME NULL DEFAULT NULL;

  -- 2.4b Add event code column
  ALTER TABLE eventos
    ADD COLUMN IF NOT EXISTS codigo_evento VARCHAR(32) NULL;

  ALTER TABLE eventos
    ADD COLUMN IF NOT EXISTS maps_url VARCHAR(500) NULL;

  ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS comision_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 10.00;

  ALTER TABLE boletos
    ADD COLUMN IF NOT EXISTS tipo_boleto VARCHAR(50) NOT NULL DEFAULT 'GENERAL';

  CREATE TABLE IF NOT EXISTS ticket_types (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    evento_id      INT UNSIGNED NOT NULL,
    nombre         VARCHAR(50)  NOT NULL,
    activo         TINYINT(1)   NOT NULL DEFAULT 1,
    fecha_creacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ticket_type_event_name (evento_id, nombre),
    FOREIGN KEY (evento_id) REFERENCES eventos (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  CREATE TABLE IF NOT EXISTS phase_ticket_type_prices (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fase_id        INT UNSIGNED NOT NULL,
    ticket_type_id INT UNSIGNED NOT NULL,
    precio         DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY uq_phase_ticket_type (fase_id, ticket_type_id),
    FOREIGN KEY (fase_id) REFERENCES fases (id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  INSERT IGNORE INTO ticket_types (evento_id, nombre, activo)
  SELECT e.id, 'GENERAL', 1
  FROM eventos e;

  INSERT IGNORE INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
  SELECT f.id, tt.id, f.precio
  FROM fases f
  INNER JOIN ticket_types tt ON tt.evento_id = f.evento_id AND tt.nombre = 'GENERAL';

  -- 2.4c Backfill event code and enforce unique constraint
  UPDATE eventos
  SET codigo_evento = CONCAT('EVT-', UPPER(HEX(RANDOM_BYTES(4))))
  WHERE codigo_evento IS NULL OR codigo_evento = '';

  ALTER TABLE eventos
    MODIFY COLUMN codigo_evento VARCHAR(32) NOT NULL,
    ADD UNIQUE KEY uq_eventos_codigo_evento (codigo_evento);

  -- 2.5  Rename precio_pagado → precio
  --      Only run this if your table has 'precio_pagado' instead of 'precio':
  -- ALTER TABLE boletos RENAME COLUMN precio_pagado TO precio;

  -- 2.6  Migrate ENUM values from old set (VENDIDO/CANCELADO) to new set (ACTIVO/USADO)
  --      Only run if your estado column currently uses VENDIDO/CANCELADO:
  -- UPDATE boletos SET estado = 'ACTIVO' WHERE estado = 'VENDIDO';
  -- UPDATE boletos SET estado = 'USADO'  WHERE estado = 'CANCELADO';
  -- ALTER TABLE boletos MODIFY COLUMN estado ENUM('ACTIVO', 'USADO') NOT NULL DEFAULT 'ACTIVO';

  -- 2.7  Backfill UUID codes for any existing rows that have NULL codigo,
  --      then enforce the NOT NULL + UNIQUE constraints:
  -- UPDATE boletos SET codigo = UUID() WHERE codigo IS NULL OR codigo = '';
  -- ALTER TABLE boletos
  --   MODIFY COLUMN codigo VARCHAR(36) NOT NULL,
  --   ADD UNIQUE KEY uq_boletos_codigo (codigo);

  -- 2.8  Enforce one ticket per client per event (remove duplicates first if needed)
  -- ALTER TABLE boletos
  --   ADD UNIQUE KEY uq_boletos_cliente_evento (cliente_id, evento_id);

  -- =============================================================
  -- END OF SCRIPT
  -- =============================================================
