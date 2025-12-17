using MySqlConnector;
using Microsoft.AspNetCore.Identity;
using AutoRef_API.Database;

Console.WriteLine("=== Actualizando usuario administrador ===\n");

// Leer SQL
var sqlFile = "../../create-admin.sql";
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

    // Verificar si el usuario ya existe
    Console.WriteLine("\nVerificando usuario en base de datos...");
    await using var checkCommand = connection.CreateCommand();
    checkCommand.CommandText = "SELECT UserName, Email, Nombre, PasswordHash FROM Usuarios WHERE Email = 'adrian.estrada2001@gmail.com' LIMIT 1;";
    await using var checkReader = await checkCommand.ExecuteReaderAsync();
    
    if (await checkReader.ReadAsync())
    {
        Console.WriteLine("✓ Usuario encontrado:");
        Console.WriteLine($"  UserName: {checkReader.GetString(0)}");
        Console.WriteLine($"  Email: {checkReader.GetString(1)}");
        Console.WriteLine($"  Nombre: {checkReader.GetString(2)}");
        var oldHash = checkReader.GetString(3);
        Console.WriteLine($"  PasswordHash actual: {oldHash.Substring(0, 50)}...");
        
        await checkReader.CloseAsync();
        
        // Generar nuevo hash correcto
        Console.WriteLine("\nGenerando nuevo hash de contraseña...");
        var hasher = new PasswordHasher<Usuario>();
        var tempUser = new Usuario { UserName = "adrian.estrada2001@gmail.com" };
        var newHash = hasher.HashPassword(tempUser, "Admin123");
        Console.WriteLine($"Nuevo hash: {newHash.Substring(0, 50)}...");
        
        // Actualizar contraseña
        Console.WriteLine("\nActualizando contraseña en base de datos...");
        await using var updateCommand = connection.CreateCommand();
        updateCommand.CommandText = "UPDATE Usuarios SET PasswordHash = @newHash WHERE Email = 'adrian.estrada2001@gmail.com';";
        updateCommand.Parameters.AddWithValue("@newHash", newHash);
        var rows = await updateCommand.ExecuteNonQueryAsync();
        Console.WriteLine($"✓ Contraseña actualizada ({rows} filas afectadas)");
    }
    else
    {
        Console.WriteLine("⚠️ Usuario NO encontrado - ejecutando SQL...");
        await checkReader.CloseAsync();
        
        await using var command = connection.CreateCommand();
        command.CommandText = sql;
        await command.ExecuteNonQueryAsync();
        Console.WriteLine("✓ SQL ejecutado exitosamente");
    }
    
    Console.WriteLine("========================================");
    Console.WriteLine("✅ Usuario administrador creado");
    Console.WriteLine("========================================\n");
    Console.WriteLine("Credenciales:");
    Console.WriteLine("  📧 Email: adrian.estrada2001@gmail.com");
    Console.WriteLine("  🔐 Contraseña: Admin123");
    Console.WriteLine("  👤 Rol: Admin");
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
