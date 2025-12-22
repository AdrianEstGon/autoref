using MySqlConnector;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!");

Console.WriteLine("\n=== Obteniendo lista de tablas ===");

// Obtener todas las tablas de la base de datos
var getTables = conn.CreateCommand();
getTables.CommandText = "SHOW TABLES";
var tables = new List<string>();

using (var reader = await getTables.ExecuteReaderAsync())
{
    while (await reader.ReadAsync())
    {
        tables.Add(reader.GetString(0));
    }
}

Console.WriteLine($"Se encontraron {tables.Count} tablas");

Console.WriteLine("\n=== Eliminando todas las tablas ===");

// Deshabilitar foreign keys
var disableFk = conn.CreateCommand();
disableFk.CommandText = "SET FOREIGN_KEY_CHECKS = 0";
await disableFk.ExecuteNonQueryAsync();

foreach (var table in tables)
{
    var dropCmd = conn.CreateCommand();
    dropCmd.CommandText = $"DROP TABLE IF EXISTS `{table}`";
    try
    {
        await dropCmd.ExecuteNonQueryAsync();
        Console.WriteLine($"  ✓ {table} eliminada");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ {table}: {ex.Message}");
    }
}

// Rehabilitar foreign keys
var enableFk = conn.CreateCommand();
enableFk.CommandText = "SET FOREIGN_KEY_CHECKS = 1";
await enableFk.ExecuteNonQueryAsync();

Console.WriteLine("\n✅ Base de datos limpiada completamente");

