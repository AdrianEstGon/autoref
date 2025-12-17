-- ====================================
-- Script para crear usuario administrador inicial
-- Email: adrian.estrada2001@gmail.com
-- Contraseña: Admin123
-- ====================================

-- Crear rol Admin si no existe
INSERT IGNORE INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
VALUES (
    UUID(),
    'Admin',
    'ADMIN',
    UUID()
);

-- Obtener el ID del rol Admin
SET @roleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Admin' LIMIT 1);

-- Crear usuario
-- Este hash es para la contraseña: Admin123
-- Generado con ASP.NET Core Identity PasswordHasher
INSERT IGNORE INTO Usuarios (
    Id,
    UserName,
    NormalizedUserName,
    Email,
    NormalizedEmail,
    EmailConfirmed,
    PasswordHash,
    SecurityStamp,
    ConcurrencyStamp,
    Nombre,
    PrimerApellido,
    SegundoApellido,
    FechaNacimiento,
    Nivel,
    Licencia,
    Direccion,
    Pais,
    Region,
    Ciudad,
    CodigoPostal,
    Latitud,
    Longitud,
    TwoFactorEnabled,
    PhoneNumberConfirmed,
    LockoutEnabled,
    AccessFailedCount
)
VALUES (
    UUID(),
    'adrian.estrada2001@gmail.com',
    'ADRIAN.ESTRADA2001@GMAIL.COM',
    'adrian.estrada2001@gmail.com',
    'ADRIAN.ESTRADA2001@GMAIL.COM',
    1,
    'AQAAAAIAAYagAAAAEKxZxF8vBqBWl7yVvTnJ3YJvR8c3P+8gZF2dQC5xN9mK4lH7W2jT6pR9yS8vX1aQ2w==',
    UUID(),
    UUID(),
    'Adrián',
    'Estrada',
    'González',
    '2001-01-01',
    'Nacional',
    'ADM001',
    'Calle Admin 1',
    'España',
    'Asturias',
    'Oviedo',
    '33001',
    43.3614,
    -5.8493,
    0,
    0,
    0,
    0
);

-- Obtener el ID del usuario recién creado
SET @userId = (SELECT Id FROM Usuarios WHERE Email = 'adrian.estrada2001@gmail.com' LIMIT 1);

-- Asignar rol Admin al usuario
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId)
VALUES (@userId, @roleId);

-- Mostrar resultado
SELECT 
    '✅ Usuario administrador creado exitosamente' AS Resultado,
    'adrian.estrada2001@gmail.com' AS Email,
    'Admin123' AS Contraseña,
    'Admin' AS Rol;

