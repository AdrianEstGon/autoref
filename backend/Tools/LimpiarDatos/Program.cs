using System;
using MySqlConnector;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!\n");

Console.WriteLine("=== Borrando datos de todas las tablas ===\n");

// Lista de tablas en orden inverso de dependencias (primero las que tienen FK)
var tablas = new[]
{
    "fechas",
    "cursos",
    "plantillas",
    "liquidaciones",
    "pagos",
    "designaciones",
    "licencias",
    "jugadores",
    "gruposedicion",
    "fasestorneo",
    "equipos",
    "ediciones",
    "torneos",
    "competiciones",
    "usuarios",
    "personas",
    "clubs",
    "campos_de_juego",
    "categorias",
    "zonasarbitraje",
    "temporadas"
};

// Desactivar chequeo de FK temporalmente
var cmdFK = conn.CreateCommand();
cmdFK.CommandText = "SET FOREIGN_KEY_CHECKS = 0";
await cmdFK.ExecuteNonQueryAsync();
Console.WriteLine("  ⚠ Foreign key checks desactivados\n");

foreach (var tabla in tablas)
{
    try
    {
        var cmd = conn.CreateCommand();
        cmd.CommandText = $"TRUNCATE TABLE `{tabla}`";
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine($"  ✓ {tabla} limpiada");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ {tabla}: {ex.Message}");
    }
}

// Reactivar chequeo de FK
cmdFK = conn.CreateCommand();
cmdFK.CommandText = "SET FOREIGN_KEY_CHECKS = 1";
await cmdFK.ExecuteNonQueryAsync();
Console.WriteLine("\n  ⚠ Foreign key checks reactivados");

Console.WriteLine("\n✅ Limpieza completada");
