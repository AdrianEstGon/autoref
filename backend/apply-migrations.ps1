# ============================================
# Script para Aplicar Migraciones a Railway
# ============================================

Write-Host "🚀 AutoRef - Script de Migraciones" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar password de Railway
$dbPassword = Read-Host "Ingresa el password de Railway" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Configurar connection string
$connectionString = "Server=centerbeam.proxy.rlwy.net,44269;Database=railway;User Id=root;Password=$plainPassword;TrustServerCertificate=True;Encrypt=False;"

Write-Host "📦 Configurando variables de entorno..." -ForegroundColor Yellow
$env:DB_CONNECTION_STRING = $connectionString

Write-Host "✅ Connection string configurado" -ForegroundColor Green
Write-Host ""

# Preguntar qué hacer
Write-Host "Selecciona una opción:" -ForegroundColor Cyan
Write-Host "1. Aplicar migraciones existentes"
Write-Host "2. Crear nueva migración"
Write-Host "3. Recrear todas las migraciones (PELIGRO: Borra datos)"
Write-Host ""

$option = Read-Host "Opción (1-3)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "🔄 Aplicando migraciones existentes..." -ForegroundColor Yellow
        dotnet ef database update
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migraciones aplicadas correctamente" -ForegroundColor Green
        } else {
            Write-Host "❌ Error al aplicar migraciones" -ForegroundColor Red
        }
    }
    
    "2" {
        $migrationName = Read-Host "Nombre de la migración"
        Write-Host ""
        Write-Host "📝 Creando migración: $migrationName..." -ForegroundColor Yellow
        dotnet ef migrations add $migrationName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migración creada" -ForegroundColor Green
            Write-Host ""
            $apply = Read-Host "¿Aplicar migración ahora? (s/n)"
            
            if ($apply -eq "s") {
                Write-Host "🔄 Aplicando migración..." -ForegroundColor Yellow
                dotnet ef database update
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Migración aplicada correctamente" -ForegroundColor Green
                } else {
                    Write-Host "❌ Error al aplicar migración" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "❌ Error al crear migración" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "⚠️  ADVERTENCIA: Esto eliminará TODAS las migraciones y recreará la base de datos" -ForegroundColor Red
        Write-Host "⚠️  Se perderán TODOS los datos existentes" -ForegroundColor Red
        Write-Host ""
        $confirm = Read-Host "¿Estás SEGURO? Escribe 'SI ESTOY SEGURO' para continuar"
        
        if ($confirm -eq "SI ESTOY SEGURO") {
            Write-Host ""
            Write-Host "🗑️  Eliminando carpeta Migrations..." -ForegroundColor Yellow
            
            if (Test-Path "Migrations") {
                Remove-Item -Path "Migrations" -Recurse -Force
                Write-Host "✅ Carpeta eliminada" -ForegroundColor Green
            }
            
            Write-Host "📝 Creando migración inicial..." -ForegroundColor Yellow
            dotnet ef migrations add InitialCreate
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Migración inicial creada" -ForegroundColor Green
                Write-Host ""
                Write-Host "🔄 Aplicando migración..." -ForegroundColor Yellow
                dotnet ef database update
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Base de datos creada correctamente" -ForegroundColor Green
                } else {
                    Write-Host "❌ Error al crear base de datos" -ForegroundColor Red
                }
            } else {
                Write-Host "❌ Error al crear migración" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Operación cancelada" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "❌ Opción inválida" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🔒 Limpiando variables de entorno..." -ForegroundColor Yellow
$env:DB_CONNECTION_STRING = $null

Write-Host "✅ Proceso completado" -ForegroundColor Green
Write-Host ""

