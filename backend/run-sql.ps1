# Script simple para ejecutar SQL via dotnet

Write-Host "Ejecutando SQL en Railway..." -ForegroundColor Cyan

# Leer SQL
$sql = Get-Content "create-admin.sql" -Raw -Encoding UTF8

# Datos de conexion
$connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG"

Write-Host "Conectando a base de datos..." -ForegroundColor Yellow

# Usar EF Core tools para ejecutar SQL
$env:DB_CONNECTION_STRING = $connectionString
cd C:\Users\ruben\Desktop\autoref\backend

# Ejecutar via dotnet ef
$sqlEscaped = $sql -replace '"', '""' -replace "'", "''"

Write-Host "SQL listo para ejecutar" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE: Copia este SQL y ejecutalo en Railway Dashboard:" -ForegroundColor Yellow
Write-Host "https://railway.app -> Tu DB -> Query" -ForegroundColor Cyan
Write-Host ""
Get-Content "create-admin.sql"

