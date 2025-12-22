# Script para crear usuarios de prueba en AutoRef
# Requiere que la API este corriendo en http://localhost:10000

$apiUrl = "http://localhost:10000/api"

function Login {
    param(
        [string]$username,
        [string]$password
    )
    
    $loginUrl = "$apiUrl/usuarios/login"
    $body = @{
        Email = $username
        Password = $password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json"
        return $response.token
    }
    catch {
        Write-Host "Error al autenticar: $_" -ForegroundColor Red
        return $null
    }
}

function Crear-Usuario {
    param(
        [string]$token,
        [string]$username,
        [string]$email,
        [string]$password,
        [string]$rol,
        [string]$nombre,
        [string]$primerApellido,
        [int]$licencia,
        [string]$nivel
    )
    
    $createUrl = "$apiUrl/usuarios/register"
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        Username = $username
        Email = $email
        Password = $password
        Rol = $rol
        Nombre = $nombre
        PrimerApellido = $primerApellido
        SegundoApellido = "Test"
        FechaNacimiento = "1990-01-01"
        Nivel = $nivel
        Licencia = $licencia
        Direccion = "Calle Test 123"
        Pais = "Espana"
        Region = "Asturias"
        Ciudad = "Oviedo"
        CodigoPostal = "33000"
        Iban = "ES1234567890123456789012"
        Bic = "TESTESMMXXX"
        TitularCuenta = "$nombre $primerApellido"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $createUrl -Method Post -Headers $headers -Body $body
        Write-Host "[OK] Usuario $username creado con rol $rol" -ForegroundColor Green
    }
    catch {
        $errorDetail = $_.ErrorDetails.Message
        if ($errorDetail -like "*already exists*" -or $errorDetail -like "*ya existe*") {
            Write-Host "[SKIP] Usuario $username ya existe" -ForegroundColor Yellow
        }
        else {
            Write-Host "[ERROR] No se pudo crear $username : $errorDetail" -ForegroundColor Red
        }
    }
}

# Main Script
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  CREAR USUARIOS DE PRUEBA - AutoRef  " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTA: Este script requiere que:" -ForegroundColor Yellow
Write-Host "  1. La API este corriendo en http://localhost:10000" -ForegroundColor Yellow
Write-Host "  2. Ya exista un usuario Admin para autenticar" -ForegroundColor Yellow
Write-Host ""

$adminUser = Read-Host "Usuario Admin existente (ej: admin@autoref.com)"
$adminPass = Read-Host "Contrasena del Admin" -AsSecureString
$adminPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPass))

Write-Host ""
Write-Host "Obteniendo token de autenticacion..." -ForegroundColor Cyan

$token = Login -username $adminUser -password $adminPassPlain

if (-not $token) {
    Write-Host ""
    Write-Host "No se pudo autenticar. Verifica que:" -ForegroundColor Red
    Write-Host "  - La API este corriendo" -ForegroundColor Red
    Write-Host "  - Las credenciales sean correctas" -ForegroundColor Red
    exit 1
}

Write-Host "Autenticado correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Creando usuarios de prueba..." -ForegroundColor Cyan
Write-Host ""

# Crear usuarios para cada rol
$usuarios = @(
    @{
        Username = "federacion@test.com"
        Email = "federacion@test.com"
        Password = "Fed123!"
        Rol = "Federacion"
        Nombre = "Usuario"
        PrimerApellido = "Federacion"
        Licencia = 1001
        Nivel = "Federacion"
    },
    @{
        Username = "comite@test.com"
        Email = "comite@test.com"
        Password = "Com123!"
        Rol = "ComiteArbitros"
        Nombre = "Usuario"
        PrimerApellido = "Comite"
        Licencia = 2001
        Nivel = "Comite"
    },
    @{
        Username = "club@test.com"
        Email = "club@test.com"
        Password = "Club123!"
        Rol = "Club"
        Nombre = "Usuario"
        PrimerApellido = "Club"
        Licencia = 3001
        Nivel = "Club"
    },
    @{
        Username = "arbitro1@test.com"
        Email = "arbitro1@test.com"
        Password = "Arb123!"
        Rol = "Arbitro"
        Nombre = "Juan"
        PrimerApellido = "Arbitro"
        Licencia = 4001
        Nivel = "Nacional"
    },
    @{
        Username = "arbitro2@test.com"
        Email = "arbitro2@test.com"
        Password = "Arb123!"
        Rol = "Arbitro"
        Nombre = "Maria"
        PrimerApellido = "Arbitro"
        Licencia = 4002
        Nivel = "Regional"
    }
)

foreach ($u in $usuarios) {
    Crear-Usuario -token $token `
        -username $u.Username `
        -email $u.Email `
        -password $u.Password `
        -rol $u.Rol `
        -nombre $u.Nombre `
        -primerApellido $u.PrimerApellido `
        -licencia $u.Licencia `
        -nivel $u.Nivel
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=== RESUMEN DE USUARIOS CREADOS ===" -ForegroundColor Green
Write-Host ""
Write-Host "ROL              | EMAIL                  | CONTRASENA" -ForegroundColor Cyan
Write-Host "-----------------|------------------------|------------" -ForegroundColor Cyan
Write-Host "Admin (existente)| $adminUser             | [tu contrasena]" -ForegroundColor White
Write-Host "Federacion       | federacion@test.com    | Fed123!" -ForegroundColor White
Write-Host "ComiteArbitros   | comite@test.com        | Com123!" -ForegroundColor White
Write-Host "Club             | club@test.com          | Club123!" -ForegroundColor White
Write-Host "Arbitro 1        | arbitro1@test.com      | Arb123!" -ForegroundColor White
Write-Host "Arbitro 2        | arbitro2@test.com      | Arb123!" -ForegroundColor White
Write-Host ""
Write-Host "Nota: El rol 'Publico' no requiere autenticacion" -ForegroundColor Yellow
Write-Host ""
Write-Host "Listo! Puedes usar estos usuarios para testear la aplicacion" -ForegroundColor Green
