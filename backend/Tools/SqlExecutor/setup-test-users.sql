-- ====================================
-- Script para:
-- 1. Eliminar tabla 'usuarios' (minúscula incorrecta)
-- 2. Crear usuarios de prueba para cada rol
-- ====================================

-- Eliminar tabla incorrecta
DROP TABLE IF EXISTS `usuarios`;

-- Asegurar que los roles existen
INSERT IGNORE INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
VALUES 
    (UUID(), 'Admin', 'ADMIN', UUID()),
    (UUID(), 'Arbitro', 'ARBITRO', UUID()),
    (UUID(), 'Club', 'CLUB', UUID()),
    (UUID(), 'Federacion', 'FEDERACION', UUID()),
    (UUID(), 'ComiteArbitros', 'COMITEARBITROS', UUID()),
    (UUID(), 'Publico', 'PUBLICO', UUID());

-- Hash para contraseña: Test123!
-- Generado con ASP.NET Core Identity PasswordHasher
SET @passwordHash = 'AQAAAAIAAYagAAAAEKxZxF8vBqBWl7yVvTnJ3YJvR8c3P+8gZF2dQC5xN9mK4lH7W2jT6pR9yS8vX1aQ2w==';

-- =====================================
-- USUARIO 1: ADMIN
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'admin@test.com', 'ADMIN@TEST.COM', 'admin@test.com', 'ADMIN@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'Admin', 'Test', 'User', '1990-01-01', 'Nacional', 'ADM001',
    'Calle Admin 1', 'España', 'Asturias', 'Oviedo', '33001', 43.3614, -5.8493,
    0, 0, 0, 0
);

SET @adminUserId = (SELECT Id FROM Usuarios WHERE Email = 'admin@test.com' LIMIT 1);
SET @adminRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Admin' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@adminUserId, @adminRoleId);

-- =====================================
-- USUARIO 2: ARBITRO
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'arbitro@test.com', 'ARBITRO@TEST.COM', 'arbitro@test.com', 'ARBITRO@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'Juan', 'Árbitro', 'Pérez', '1985-05-15', 'Provincial', 'ARB001',
    'Calle Árbitro 1', 'España', 'Asturias', 'Gijón', '33200', 43.5322, -5.6611,
    0, 0, 0, 0
);

SET @arbitroUserId = (SELECT Id FROM Usuarios WHERE Email = 'arbitro@test.com' LIMIT 1);
SET @arbitroRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Arbitro' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@arbitroUserId, @arbitroRoleId);

-- =====================================
-- USUARIO 3: CLUB
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'club@test.com', 'CLUB@TEST.COM', 'club@test.com', 'CLUB@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'María', 'Club', 'García', '1988-03-20', NULL, 'CLB001',
    'Calle Club 1', 'España', 'Asturias', 'Avilés', '33400', 43.5596, -5.9249,
    0, 0, 0, 0
);

SET @clubUserId = (SELECT Id FROM Usuarios WHERE Email = 'club@test.com' LIMIT 1);
SET @clubRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Club' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@clubUserId, @clubRoleId);

-- =====================================
-- USUARIO 4: FEDERACION
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'federacion@test.com', 'FEDERACION@TEST.COM', 'federacion@test.com', 'FEDERACION@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'Carlos', 'Federación', 'López', '1982-07-10', NULL, 'FED001',
    'Calle Federación 1', 'España', 'Asturias', 'Oviedo', '33003', 43.3647, -5.8482,
    0, 0, 0, 0
);

SET @federacionUserId = (SELECT Id FROM Usuarios WHERE Email = 'federacion@test.com' LIMIT 1);
SET @federacionRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Federacion' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@federacionUserId, @federacionRoleId);

-- =====================================
-- USUARIO 5: COMITE ARBITROS
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'comite@test.com', 'COMITE@TEST.COM', 'comite@test.com', 'COMITE@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'Ana', 'Comité', 'Martínez', '1980-11-25', 'Nacional', 'COM001',
    'Calle Comité 1', 'España', 'Asturias', 'Oviedo', '33005', 43.3625, -5.8505,
    0, 0, 0, 0
);

SET @comiteUserId = (SELECT Id FROM Usuarios WHERE Email = 'comite@test.com' LIMIT 1);
SET @comiteRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'ComiteArbitros' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@comiteUserId, @comiteRoleId);

-- =====================================
-- USUARIO 6: PUBLICO
-- =====================================
INSERT IGNORE INTO Usuarios (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp,
    Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud,
    TwoFactorEnabled, PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
) VALUES (
    UUID(), 'publico@test.com', 'PUBLICO@TEST.COM', 'publico@test.com', 'PUBLICO@TEST.COM', 1,
    @passwordHash, UUID(), UUID(),
    'Luis', 'Público', 'Fernández', '1995-09-30', NULL, 'PUB001',
    'Calle Público 1', 'España', 'Asturias', 'Gijón', '33201', 43.5350, -5.6630,
    0, 0, 0, 0
);

SET @publicoUserId = (SELECT Id FROM Usuarios WHERE Email = 'publico@test.com' LIMIT 1);
SET @publicoRoleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Publico' LIMIT 1);
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId) VALUES (@publicoUserId, @publicoRoleId);

-- =====================================
-- RESUMEN
-- =====================================
SELECT '✅ Usuarios de prueba creados exitosamente' AS Resultado;
SELECT 
    'CREDENCIALES DE PRUEBA' AS '═══════════════════════',
    '' AS Email,
    '' AS Contraseña,
    '' AS Rol
UNION ALL
SELECT '', 'admin@test.com', 'Test123!', 'Admin'
UNION ALL
SELECT '', 'arbitro@test.com', 'Test123!', 'Arbitro'
UNION ALL
SELECT '', 'club@test.com', 'Test123!', 'Club'
UNION ALL
SELECT '', 'federacion@test.com', 'Test123!', 'Federacion'
UNION ALL
SELECT '', 'comite@test.com', 'Test123!', 'ComiteArbitros'
UNION ALL
SELECT '', 'publico@test.com', 'Test123!', 'Publico';
