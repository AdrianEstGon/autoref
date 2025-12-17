# Script para ejecutar SQL en Railway usando MySqlConnector
Write-Host "=== Ejecutando SQL en Railway ===" -ForegroundColor Cyan

# Buscar MySqlConnector.dll
$mysqlDll = Get-ChildItem -Path "$env:USERPROFILE\.nuget\packages\mysqlconnector" -Recurse -Filter "MySqlConnector.dll" -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -like "*net8.0*" -or $_.FullName -like "*netstandard2.1*" } | 
    Select-Object -First 1

if (-not $mysqlDll) {
    Write-Host "Error: MySqlConnector no encontrado" -ForegroundColor Red
    Write-Host "Instalando MySqlConnector..." -ForegroundColor Yellow
    dotnet add package MySqlConnector
    
    $mysqlDll = Get-ChildItem -Path "$env:USERPROFILE\.nuget\packages\mysqlconnector" -Recurse -Filter "MySqlConnector.dll" -ErrorAction SilentlyContinue | 
        Where-Object { $_.FullName -like "*net8.0*" -or $_.FullName -like "*netstandard2.1*" } | 
        Select-Object -First 1
}

if (-not $mysqlDll) {
    Write-Host "No se pudo encontrar MySqlConnector.dll" -ForegroundColor Red
    exit 1
}

Write-Host "Cargando MySqlConnector desde: $($mysqlDll.FullName)" -ForegroundColor Gray

try {
    # Cargar el ensamblado
    Add-Type -Path $mysqlDll.FullName
    Write-Host "MySqlConnector cargado correctamente" -ForegroundColor Green
    
    # Leer SQL
    $sql = Get-Content "create-admin.sql" -Raw -Encoding UTF8
    Write-Host "Archivo SQL leido" -ForegroundColor Green
    
    # Conexión
    $connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;SSL Mode=Required"
    
    Write-Host "`nConectando a Railway..." -ForegroundColor Yellow
    $connection = New-Object MySqlConnector.MySqlConnection($connectionString)
    $connection.Open()
    Write-Host "Conexion establecida" -ForegroundColor Green
    
    # Ejecutar SQL
    Write-Host "`nEjecutando SQL..." -ForegroundColor Yellow
    $command = $connection.CreateCommand()
    $command.CommandText = $sql
    $result = $command.ExecuteNonQuery()
    
    Write-Host "SQL ejecutado exitosamente" -ForegroundColor Green
    
    # Cerrar conexión
    $connection.Close()
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Usuario administrador creado" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nCredenciales:" -ForegroundColor White
    Write-Host "  Email: adrian.estrada2001@gmail.com" -ForegroundColor White
    Write-Host "  Contraseña: Admin123" -ForegroundColor White
    Write-Host "  Rol: Admin" -ForegroundColor White
    Write-Host "`nPrueba en: http://localhost:3000`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "`nError al ejecutar SQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nDetalles completos:" -ForegroundColor Yellow
    Write-Host $_.Exception.ToString() -ForegroundColor Gray
}

