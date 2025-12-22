using MySqlConnector;
using OfficeOpenXml;

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";
var datosPath = @"C:\Users\ruben\Desktop\autoref\Datos";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!\n");

Console.WriteLine("=== Importando datos desde archivos Excel ===\n");

var archivosExcel = new[]
{
    "temporadas.xlsx",
    "zonasarbitraje.xlsx",
    "categorias.xlsx",
    "campos de juego.xlsx",
    "clubs.xlsx",
    "personas.xlsx",
    "usuarios.xlsx",
    "competiciones.xlsx",
    "torneos.xlsx",
    "ediciones.xlsx",
    "equipos.xlsx",
    "fasestorneo.xlsx",
    "gruposedicion.xlsx",
    "jugadores.xlsx",
    "licencias.xlsx",
    "designaciones.xlsx",
    "pagos.xlsx",
    "liquidaciones.xlsx",
    "plantillas.xlsx",
    "cursos.xlsx",
    "fechas.xlsx"
};

string NormalizarNombreTabla(string nombreArchivo)
{
    return Path.GetFileNameWithoutExtension(nombreArchivo).Replace(" ", "_").Replace("-", "_");
}

foreach (var archivoExcel in archivosExcel)
{
    var archivoPath = Path.Combine(datosPath, archivoExcel);
    if (!File.Exists(archivoPath))
    {
        Console.WriteLine($"  ⚠ {archivoExcel} no encontrado");
        continue;
    }
    
    try
    {
        using var package = new ExcelPackage(new FileInfo(archivoPath));
        var sheet = package.Workbook.Worksheets[0];
        var rowCount = sheet.Dimension?.Rows ?? 0;
        var colCount = sheet.Dimension?.Columns ?? 0;
        
        if (rowCount < 2) // Necesitamos al menos header + 1 fila de datos
        {
            Console.WriteLine($"  ⚠ {archivoExcel}: Sin datos para importar");
            continue;
        }
        
        // Leer nombres de columnas de la fila 1
        var columnas = new List<(string Nombre, int Index)>();
        var nombresVistos = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        
        for (int col = 1; col <= colCount; col++)
        {
            var nombreColumna = sheet.Cells[1, col].Text?.Trim();
            if (string.IsNullOrWhiteSpace(nombreColumna)) continue;
            
            // Manejar duplicados igual que en la creación
            var nombreFinal = nombreColumna;
            if (nombresVistos.ContainsKey(nombreColumna))
            {
                nombresVistos[nombreColumna]++;
                nombreFinal = $"{nombreColumna}{nombresVistos[nombreColumna]}";
            }
            else
            {
                nombresVistos[nombreColumna] = 1;
            }
            
            columnas.Add((nombreFinal, col));
        }
        
        if (columnas.Count == 0)
        {
            Console.WriteLine($"  ⚠ {archivoExcel}: Sin columnas válidas");
            continue;
        }
        
        var nombreTabla = NormalizarNombreTabla(archivoExcel);
        int importados = 0;
        int errores = 0;
        
        // Importar cada fila de datos
        for (int row = 2; row <= rowCount; row++)
        {
            var valores = new List<object?>();
            
            foreach (var (_, colIndex) in columnas)
            {
                var cellValue = sheet.Cells[row, colIndex].Value;
                
                // Si es una fecha de Excel (número), convertirla
                if (cellValue is double excelDate)
                {
                    try
                    {
                        valores.Add(DateTime.FromOADate(excelDate));
                        continue;
                    }
                    catch { }
                }
                
                // Intentar obtener como texto
                var texto = sheet.Cells[row, colIndex].Text?.Trim();
                
                if (string.IsNullOrWhiteSpace(texto))
                {
                    valores.Add(null);
                    continue;
                }
                
                // Intentar parsear como fecha en formato dd/MM/yyyy HH:mm
                if (DateTime.TryParseExact(texto, new[] { 
                    "dd/MM/yyyy HH:mm", 
                    "dd/MM/yyyy", 
                    "d/M/yyyy HH:mm",
                    "d/M/yyyy"
                }, null, System.Globalization.DateTimeStyles.None, out DateTime fecha))
                {
                    // Validar que la fecha sea razonable (no años futuros absurdos)
                    if (fecha.Year >= 1900 && fecha.Year <= 2100)
                    {
                        valores.Add(fecha);
                    }
                    else
                    {
                        valores.Add(null); // Fecha inválida, guardar NULL
                    }
                }
                // Convertir Sí/No a 1/0
                else if (texto.Equals("Sí", StringComparison.OrdinalIgnoreCase) || 
                         texto.Equals("Si", StringComparison.OrdinalIgnoreCase))
                {
                    valores.Add(1);
                }
                else if (texto.Equals("No", StringComparison.OrdinalIgnoreCase))
                {
                    valores.Add(0);
                }
                else
                {
                    valores.Add(texto);
                }
            }
            
            // Crear INSERT statement
            var columnasSQL = string.Join(", ", columnas.Select(c => $"`{c.Nombre}`"));
            var placeholders = string.Join(", ", columnas.Select((_, i) => $"@p{i}"));
            
            var insertSQL = $"INSERT INTO `{nombreTabla}` ({columnasSQL}) VALUES ({placeholders})";
            
            var cmd = conn.CreateCommand();
            cmd.CommandText = insertSQL;
            
            for (int i = 0; i < valores.Count; i++)
            {
                cmd.Parameters.AddWithValue($"@p{i}", valores[i] ?? (object)DBNull.Value);
            }
            
            try
            {
                await cmd.ExecuteNonQueryAsync();
                importados++;
                
                if (importados % 1000 == 0)
                {
                    Console.WriteLine($"  ... {nombreTabla}: {importados} filas importadas");
                }
            }
            catch (Exception ex)
            {
                errores++;
                if (errores <= 5) // Mostrar solo los primeros 5 errores
                {
                    Console.WriteLine($"  ✗ {nombreTabla} fila {row}: {ex.Message}");
                }
            }
        }
        
        Console.WriteLine($"  ✓ {nombreTabla}: {importados} filas importadas" + (errores > 0 ? $" ({errores} errores)" : ""));
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ {archivoExcel}: {ex.Message}");
    }
}

Console.WriteLine("\n✅ Importación completada");
