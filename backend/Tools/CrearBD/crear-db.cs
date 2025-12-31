using MySqlConnector;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();

Console.WriteLine("=== ANALISIS DE COLUMNAS EN BASE DE DATOS ===\n");

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

foreach (var table in tables.OrderBy(t => t))
{
    var getColumns = conn.CreateCommand();
    getColumns.CommandText = $"DESCRIBE {table}";
    
    Console.WriteLine($"\n### {table.ToUpper()} ###");
    
    using var colReader = await getColumns.ExecuteReaderAsync();
    while (await colReader.ReadAsync())
    {
        var colName = colReader.GetString(0);
        var colType = colReader.GetString(1);
        Console.WriteLine($"  - {colName} ({colType})");
    }
}

Console.WriteLine("\n=== FIN DEL ANALISIS ===");
