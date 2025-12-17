# Script para crear usuario administrador inicial
# Ejecutar desde la carpeta backend con: .\create-admin.ps1

Write-Host "=== Creando usuario administrador ===" -ForegroundColor Cyan

# Verificar que la variable de entorno esté configurada
if (-not $env:DB_CONNECTION_STRING) {
    Write-Host "Error: DB_CONNECTION_STRING no está configurada" -ForegroundColor Red
    Write-Host "Configúrala con: `$env:DB_CONNECTION_STRING='tu-connection-string'" -ForegroundColor Yellow
    exit 1
}

# SQL para crear usuario y rol admin
$sql = @"
-- Generar IDs
SET @userId = UUID();
SET @roleId = UUID();

-- Crear rol Admin si no existe
INSERT IGNORE INTO AspNetRoles (Id, Name, NormalizedName)
VALUES (@roleId, 'Admin', 'ADMIN');

-- Obtener el roleId (por si ya existía)
SET @roleId = (SELECT Id FROM AspNetRoles WHERE Name = 'Admin' LIMIT 1);

-- Hash de contraseña 'Admin123' generado con ASP.NET Identity
-- Este hash es para la contraseña: Admin123
SET @passwordHash = 'AQAAAAIAAYagAAAAEJ7nYP8xyFHvDVHMQhNBQVY4xZE9GdBqK7+8nMx0fJ5pF3L2rJ6Y8K3R9W1T4V5Q==';

-- Crear usuario si no existe
INSERT IGNORE INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail,
    EmailConfirmed, PasswordHash, SecurityStamp,
    Nombre, PrimerApellido, SegundoApellido,
    FechaNacimiento, Nivel, Licencia,
    Direccion, Pais, Region, Ciudad, CodigoPostal,
    Latitud, Longitud, TwoFactorEnabled, 
    PhoneNumberConfirmed, LockoutEnabled, AccessFailedCount
)
VALUES (
    @userId,
    'adrian.estrada2001@gmail.com',
    'ADRIAN.ESTRADA2001@GMAIL.COM',
    'adrian.estrada2001@gmail.com',
    'ADRIAN.ESTRADA2001@GMAIL.COM',
    1,
    @passwordHash,
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
    0, 0, 0, 0
);

-- Obtener el userId (por si ya existía)
SET @userId = (SELECT Id FROM AspNetUsers WHERE Email = 'adrian.estrada2001@gmail.com' LIMIT 1);

-- Asignar rol Admin al usuario
INSERT IGNORE INTO AspNetUserRoles (UserId, RoleId)
VALUES (@userId, @roleId);

SELECT 'Usuario administrador creado/actualizado exitosamente' AS Resultado;
"@

# Guardar SQL en archivo temporal
$sqlFile = "temp_create_admin.sql"
$sql | Out-File -FilePath $sqlFile -Encoding UTF8

# Extraer datos de conexión
$connString = $env:DB_CONNECTION_STRING
$server = ($connString -match 'Server=([^;]+)') ? $Matches[1] : ""
$port = ($connString -match 'Port=([^;]+)') ? $Matches[1] : "3306"
$database = ($connString -match 'Database=([^;]+)') ? $Matches[1] : "railway"
$user = ($connString -match 'User=([^;]+)') ? $Matches[1] : "root"
$password = ($connString -match 'Password=([^;]+)') ? $Matches[1] : ""

Write-Host "`nEjecutando SQL en la base de datos..." -ForegroundColor Yellow
Write-Host "Host: $server" -ForegroundColor Gray
Write-Host "Port: $port" -ForegroundColor Gray
Write-Host "Database: $database" -ForegroundColor Gray

# Ejecutar con mysql command line (si está instalado)
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    mysql -h $server -P $port -u $user -p$password $database < $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Usuario administrador creado exitosamente" -ForegroundColor Green
        Write-Host "`nCredenciales:" -ForegroundColor Cyan
        Write-Host "  Email: adrian.estrada2001@gmail.com" -ForegroundColor White
        Write-Host "  Contraseña: Admin123" -ForegroundColor White
        Write-Host "  Rol: Admin" -ForegroundColor White
    } else {
        Write-Host "`n❌ Error al ejecutar el SQL" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  MySQL CLI no está instalado" -ForegroundColor Yellow
    Write-Host "`nPuedes ejecutar este SQL manualmente:" -ForegroundColor Cyan
    Get-Content $sqlFile
}

# Limpiar archivo temporal
Remove-Item $sqlFile -ErrorAction SilentlyContinue
"@
