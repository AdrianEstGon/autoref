using System;
using MySqlConnector;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!\n");

Console.WriteLine("=== Ajustando tipos de columnas ===\n");

// Cambiar columnas de lat/lng a DOUBLE (para coordenadas geográficas)
// Y columnas con decimales que no caben en DECIMAL(10,2)
// Y columnas de texto que fueron incorrectamente detectadas como numéricas
var ajustes = new[]
{
    // Coordenadas geográficas
    ("campos_de_juego", "lat", "DOUBLE"),
    ("campos_de_juego", "lng", "DOUBLE"),
    ("personas", "Lat", "DOUBLE"),
    ("personas", "Lng", "DOUBLE"),
    ("designaciones", "referee_lat", "DOUBLE"),
    ("designaciones", "referee_lng", "DOUBLE"),
    ("licencias", "Lat", "DOUBLE"),
    ("licencias", "Lng", "DOUBLE"),
    
    // Precios con mayor precisión
    ("temporadas", "Precio KM", "DOUBLE"),
    ("ediciones", "Precio KM", "DOUBLE"),
    
    // Importes que pueden tener valores grandes
    ("licencias", "Importe", "DECIMAL(18, 2)"),
    ("pagos", "Importe", "DECIMAL(18, 2)"),
    ("liquidaciones", "Importe", "DECIMAL(18, 2)"),
    
    // Campos que contienen listas de números separados por coma (ej: "10,11")
    ("fasestorneo", "Especificar num pista", "TEXT"),
};

foreach (var (tabla, columna, tipo) in ajustes)
{
    try
    {
        var cmd = conn.CreateCommand();
        cmd.CommandText = $"ALTER TABLE `{tabla}` MODIFY COLUMN `{columna}` {tipo} NULL";
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine($"  ✓ {tabla}.{columna} → {tipo}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ {tabla}.{columna}: {ex.Message}");
    }
}

Console.WriteLine("\n✅ Ajustes completados");
