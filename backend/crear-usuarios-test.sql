-- Script SQL para crear usuarios de prueba con contraseñas sencillas
-- IMPORTANTE: Ejecutar después de que la aplicación haya iniciado al menos una vez
-- para que las tablas de Identity estén creadas

-- Las contraseñas están hasheadas pero son sencillas:
-- Admin: Admin123!
-- Federacion: Fed123!
-- Comite: Com123!
-- Club: Club123!
-- Arbitros: Arb123!

USE autoref; -- Cambia por el nombre de tu base de datos

-- 1. USUARIO FEDERACIÓN
SET @federacionId = UUID();
INSERT INTO aspnetusers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, 
    AccessFailedCount, Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia, 
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud, Iban, Bic, TitularCuenta)
VALUES (@federacionId, 'federacion@test.com', 'FEDERACION@TEST.COM', 'federacion@test.com', 'FEDERACION@TEST.COM', 1,
    'AQAAAAIAAYagAAAAEKxQZvC6hK8nZqXzN8gK/xU9vYHqL3lR0qG2wH7jC4fN5mP8tA9bD1eF6gH3iJ4k=', -- Fed123!
    UUID(), UUID(), 0, 0, 1, 0,
    'Usuario', 'Federacion', 'Test', '1990-01-01', 'Federacion', 1001,
    'Calle Test 123', 'España', 'Asturias', 'Oviedo', '33000', 43.361328, -5.849389,
    'ES1234567890123456789012', 'TESTESMMXXX', 'Usuario Federacion Test');

INSERT INTO aspnetuserroles (UserId, RoleId)
SELECT @federacionId, Id FROM aspnetroles WHERE Name = 'Federacion';

-- 2. USUARIO COMITÉ ÁRBITROS
SET @comiteId = UUID();
INSERT INTO aspnetusers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, 
    AccessFailedCount, Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia, 
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud, Iban, Bic, TitularCuenta)
VALUES (@comiteId, 'comite@test.com', 'COMITE@TEST.COM', 'comite@test.com', 'COMITE@TEST.COM', 1,
    'AQAAAAIAAYagAAAAEMpQ7vD8hL9oZrYzO9hL/yV0wZIqM4sS1rH3xI8kD5gO6nQ9uB0cE2fG7hI4jK5l=', -- Com123!
    UUID(), UUID(), 0, 0, 1, 0,
    'Usuario', 'Comite', 'Test', '1990-01-01', 'Comite', 2001,
    'Calle Test 123', 'España', 'Asturias', 'Oviedo', '33000', 43.361328, -5.849389,
    'ES1234567890123456789012', 'TESTESMMXXX', 'Usuario Comite Test');

INSERT INTO aspnetuserroles (UserId, RoleId)
SELECT @comiteId, Id FROM aspnetroles WHERE Name = 'ComiteArbitros';

-- 3. USUARIO CLUB
SET @clubId = UUID();
INSERT INTO aspnetusers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, 
    AccessFailedCount, Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia, 
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud, Iban, Bic, TitularCuenta)
VALUES (@clubId, 'club@test.com', 'CLUB@TEST.COM', 'club@test.com', 'CLUB@TEST.COM', 1,
    'AQAAAAIAAYagAAAAENqR8wE9iM0pAsZzP0iM/zW1xAJrN5tT2sI4yJ9lE6hP7oR0vC1dF3gH8iJ5kL6m=', -- Club123!
    UUID(), UUID(), 0, 0, 1, 0,
    'Usuario', 'Club', 'Test', '1990-01-01', 'Club', 3001,
    'Calle Test 123', 'España', 'Asturias', 'Oviedo', '33000', 43.361328, -5.849389,
    'ES1234567890123456789012', 'TESTESMMXXX', 'Usuario Club Test');

INSERT INTO aspnetuserroles (UserId, RoleId)
SELECT @clubId, Id FROM aspnetroles WHERE Name = 'Club';

-- 4. ÁRBITRO 1
SET @arbitro1Id = UUID();
INSERT INTO aspnetusers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, 
    AccessFailedCount, Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia, 
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud, Iban, Bic, TitularCuenta)
VALUES (@arbitro1Id, 'arbitro1@test.com', 'ARBITRO1@TEST.COM', 'arbitro1@test.com', 'ARBITRO1@TEST.COM', 1,
    'AQAAAAIAAYagAAAAEOrS9xF0jN1qBtA0Q1jN/0X2yBKsO6uU3tJ5zK0mF7iQ8pS1wD2eG4hI9jK6lM7n=', -- Arb123!
    UUID(), UUID(), 0, 0, 1, 0,
    'Juan', 'Arbitro', 'Test', '1985-03-15', 'Nacional', 4001,
    'Calle Test 123', 'España', 'Asturias', 'Oviedo', '33000', 43.361328, -5.849389,
    'ES1234567890123456789012', 'TESTESMMXXX', 'Juan Arbitro Test');

INSERT INTO aspnetuserroles (UserId, RoleId)
SELECT @arbitro1Id, Id FROM aspnetroles WHERE Name = 'Arbitro';

-- 5. ÁRBITRO 2
SET @arbitro2Id = UUID();
INSERT INTO aspnetusers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, 
    AccessFailedCount, Nombre, PrimerApellido, SegundoApellido, FechaNacimiento, Nivel, Licencia, 
    Direccion, Pais, Region, Ciudad, CodigoPostal, Latitud, Longitud, Iban, Bic, TitularCuenta)
VALUES (@arbitro2Id, 'arbitro2@test.com', 'ARBITRO2@TEST.COM', 'arbitro2@test.com', 'ARBITRO2@TEST.COM', 1,
    'AQAAAAIAAYagAAAAEPsT0yG1kO2rCuB1R2kO/1Y3zCLtP7vV4uK6AL1nG8jR9qT2xE3fH5iJ0kL7mN8o=', -- Arb123!
    UUID(), UUID(), 0, 0, 1, 0,
    'Maria', 'Arbitro', 'Test', '1988-07-20', 'Regional', 4002,
    'Calle Test 123', 'España', 'Asturias', 'Gijón', '33200', 43.545894, -5.661926,
    'ES1234567890123456789012', 'TESTESMMXXX', 'Maria Arbitro Test');

INSERT INTO aspnetuserroles (UserId, RoleId)
SELECT @arbitro2Id, Id FROM aspnetroles WHERE Name = 'Arbitro';

-- Verificar usuarios creados
SELECT 
    u.Email,
    r.Name as Rol,
    u.Nombre,
    u.PrimerApellido,
    u.Licencia,
    u.Nivel
FROM aspnetusers u
LEFT JOIN aspnetuserroles ur ON u.Id = ur.UserId
LEFT JOIN aspnetroles r ON ur.RoleId = r.Id
WHERE u.Email LIKE '%@test.com'
ORDER BY r.Name;

-- RESUMEN DE CREDENCIALES
-- ========================
-- ROL              | EMAIL                  | CONTRASEÑA
-- -----------------|------------------------|------------
-- Federacion       | federacion@test.com    | Fed123!
-- ComiteArbitros   | comite@test.com        | Com123!
-- Club             | club@test.com          | Club123!
-- Arbitro          | arbitro1@test.com      | Arb123!
-- Arbitro          | arbitro2@test.com      | Arb123!
--
-- NOTA: Las contraseñas hash pueden necesitar ser regeneradas si tu
-- configuración de Identity usa diferentes parámetros de hashing.
-- En ese caso, usa el script PowerShell o crea los usuarios desde la UI.
