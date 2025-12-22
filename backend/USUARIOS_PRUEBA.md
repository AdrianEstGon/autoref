# Usuarios de Prueba para Testing

Este documento describe cómo crear usuarios de prueba para cada rol de la aplicación.

## Métodos Disponibles

### Opción 1: Automático al iniciar la aplicación (RECOMENDADO)

La forma más sencilla es usar la variable de entorno `CREATE_TEST_USERS`:

#### Windows (PowerShell):
```powershell
$env:CREATE_TEST_USERS="true"
cd backend
dotnet run
```

#### Linux/Mac:
```bash
export CREATE_TEST_USERS=true
cd backend
dotnet run
```

Los usuarios se crearán automáticamente al iniciar la aplicación.

### Opción 2: Script PowerShell (Windows)

Si la API ya está corriendo:

```powershell
cd backend
.\crear-usuarios-test.ps1
```

Te pedirá las credenciales de un usuario Admin existente y creará los demás usuarios.

### Opción 3: Script SQL Directo

Si prefieres insertar directamente en la base de datos:

```bash
mysql -u root -p autoref < backend/crear-usuarios-test.sql
```

**NOTA:** Las contraseñas hasheadas en el SQL pueden no funcionar si tu configuración de Identity es diferente. En ese caso, usa la Opción 1 o 2.

## Usuarios Creados

| ROL              | EMAIL                  | CONTRASEÑA | DESCRIPCIÓN |
|------------------|------------------------|------------|-------------|
| **Federacion**   | federacion@test.com    | `Fed123!`  | Configura temporadas, competiciones, valida licencias |
| **ComiteArbitros** | comite@test.com      | `Com123!`  | Gestiona designaciones y aprueba liquidaciones |
| **Club**         | club@test.com          | `Club123!` | Inscribe equipos/jugadores, fija horarios |
| **Arbitro**      | arbitro1@test.com      | `Arb123!`  | Juan Arbitro - Nivel Nacional |
| **Arbitro**      | arbitro2@test.com      | `Arb123!`  | Maria Arbitro - Nivel Regional |

**Nota:** El rol **Publico** no requiere autenticación. Accede directamente a los endpoints públicos.

## Funcionalidades por Rol

### 🏛️ Federación (`federacion@test.com`)
- Crear y configurar temporadas
- Crear competiciones con fechas de inscripción y cuotas
- Validar licencias y equipos
- Gestionar facturas a clubes
- Crear noticias para el portal público
- Supervisar todos los partidos y resultados

### 👥 Comité de Árbitros (`comite@test.com`)
- Ver disponibilidad de árbitros
- Asignar árbitros a partidos
- Aprobar/rechazar liquidaciones de árbitros
- Generar órdenes de pago
- Exportar remesas bancarias

### 🏀 Club (`club@test.com`)
- Inscribir equipos en competiciones
- Registrar jugadores y staff técnico
- Fijar horarios como equipo local
- Solicitar cambios de partido
- Ver facturas pendientes
- Descargar documentos oficiales (autorizaciones, licencias)

### 🟨 Árbitro (`arbitro1@test.com` / `arbitro2@test.com`)
- Marcar disponibilidad por días
- Ver partidos asignados
- Aceptar/rechazar designaciones
- Cumplimentar acta del partido
- Registrar liquidaciones (arbitrajes, desplazamientos, dietas)
- Ver estado de liquidaciones

### 🌐 Público (sin autenticación)
Acceso a:
- `GET /api/publico/competiciones` - Competiciones activas
- `GET /api/publico/calendario` - Calendario de partidos
- `GET /api/publico/clasificacion` - Clasificaciones
- `GET /api/publico/partidos/buscar` - Búsqueda avanzada
- `GET /api/noticias/publicas` - Noticias y comunicaciones

## Testing de Flujos Completos

### Flujo 1: Inscripción de Equipo
1. **Federación** crea competición con fechas de inscripción
2. **Club** inscribe equipo y jugadores
3. **Federación** valida las licencias
4. **Club** ve el equipo inscrito

### Flujo 2: Partido Completo
1. **Federación** crea el partido sin hora fija
2. **Club local** fija fecha, hora y lugar (dentro de ventana permitida)
3. **Comité** asigna árbitros al partido
4. **Árbitros** aceptan la designación
5. **Árbitro** cumplimenta el acta durante el partido
6. **Árbitro** cierra el partido
7. **Público** ve el resultado en el calendario

### Flujo 3: Liquidación de Árbitro
1. **Árbitro** crea liquidación por partido
2. **Árbitro** añade conceptos (arbitraje, km, dietas)
3. **Árbitro** envía la liquidación
4. **Comité** revisa y aprueba
5. **Comité** genera orden de pago mensual
6. **Comité** exporta remesa bancaria SEPA

### Flujo 4: Cambio de Horario
1. **Club visitante** solicita cambio de fecha/hora/lugar
2. **Club local** recibe notificación
3. **Club local** acepta o rechaza
4. Si acepta: **Federación** valida el cambio
5. Todos los implicados reciben notificación

## Troubleshooting

### Error: "El correo electrónico ya está registrado"
Los usuarios ya existen. Puedes:
- Eliminarlos de la BD: `DELETE FROM aspnetusers WHERE Email LIKE '%@test.com'`
- Usar otros emails modificando los scripts

### Error: "El número de licencia ya está registrado"  
Similar al anterior, elimina los usuarios existentes primero.

### No recibo emails de notificación
Configura las variables de entorno SMTP en `appsettings.json` o como variables de entorno:
```json
"SMTP_HOST": "smtp.gmail.com",
"SMTP_PORT": "587",
"SMTP_USER": "tu-email@gmail.com",
"SMTP_PASSWORD": "tu-app-password"
```

## Limpieza

Para eliminar los usuarios de prueba:

```sql
DELETE ur FROM aspnetuserroles ur
INNER JOIN aspnetusers u ON ur.UserId = u.Id
WHERE u.Email LIKE '%@test.com';

DELETE FROM aspnetusers WHERE Email LIKE '%@test.com';
```

O desde la UI con el rol Admin.
