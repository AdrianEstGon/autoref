using MySqlConnector;
using Microsoft.AspNetCore.Identity;
using AutoRef_API.Database;

Console.WriteLine("=== Configurando usuarios de prueba ===\n");

// Leer SQL
var sqlFile = "../../setup-test-users.sql";
if (!File.Exists(sqlFile))
{
    Console.WriteLine($"❌ Error: No se encuentra {sqlFile}");
    return 1;
}

var sql = File.ReadAllText(sqlFile);
Console.WriteLine("✓ Archivo SQL leído\n");

// Conexión a Railway
var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;SSL Mode=Required;Allow User Variables=true";

try
{
    Console.WriteLine("Conectando a Railway...");
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();
    Console.WriteLine("✓ Conexión establecida\n");

    // Primero verificar qué tablas existen
    Console.WriteLine("Verificando tablas existentes...");
    await using var showCommand = connection.CreateCommand();
    showCommand.CommandText = "SHOW TABLES;";
    await using var reader = await showCommand.ExecuteReaderAsync();
    var tableCount = 0;
    Console.WriteLine("Tablas en la base de datos:");
    while (await reader.ReadAsync())
    {
        Console.WriteLine($"  - {reader.GetString(0)}");
        tableCount++;
    }
    if (tableCount == 0)
    {
        Console.WriteLine("  ⚠️  (vacía - no hay tablas)");
        Console.WriteLine("\n❌ ERROR: Las migraciones NO se han aplicado correctamente.");
        Console.WriteLine("Ejecuta primero: dotnet ef database update");
        return 1;
    }
    await reader.CloseAsync();
    Console.WriteLine($"Total: {tableCount} tablas\n");

    // Ejecutar SQL para crear usuarios de prueba
    Console.WriteLine("Eliminando tabla 'usuarios' (minúscula)...");
    Console.WriteLine("Creando usuarios de prueba para cada rol...\n");
    
    await using var command = connection.CreateCommand();
    command.CommandText = sql;
    await command.ExecuteNonQueryAsync();
    
    Console.WriteLine("========================================");
    Console.WriteLine("✅ Usuarios de prueba creados");
    Console.WriteLine("========================================\n");
    Console.WriteLine("╔══════════════════════════════════════════════╗");
    Console.WriteLine("║        CREDENCIALES DE PRUEBA                ║");
    Console.WriteLine("╠══════════════════════════════════════════════╣");
    Console.WriteLine("║ admin@test.com      | Test123! | Admin       ║");
    Console.WriteLine("║ arbitro@test.com    | Test123! | Arbitro     ║");
    Console.WriteLine("║ club@test.com       | Test123! | Club        ║");
    Console.WriteLine("║ federacion@test.com | Test123! | Federacion  ║");
    Console.WriteLine("║ comite@test.com     | Test123! | ComiteArb.. ║");
    Console.WriteLine("║ publico@test.com    | Test123! | Publico     ║");
    Console.WriteLine("╚══════════════════════════════════════════════╝");
    Console.WriteLine("\n🌐 Prueba en: http://localhost:3000\n");
    
    return 0;
}
catch (Exception ex)
{
    Console.WriteLine($"\n❌ Error: {ex.Message}\n");
    Console.WriteLine("Detalles:");
    Console.WriteLine(ex.ToString());
    return 1;
}
