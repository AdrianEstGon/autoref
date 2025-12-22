using MySqlConnector;
using OfficeOpenXml;

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";
var datosPath = @"C:\Users\ruben\Desktop\autoref\Datos";

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!\n");

Console.WriteLine("=== Creando tablas desde archivos Excel ===\n");

// Archivos Excel a procesar
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

string InferirTipoDato(string columnaNombre, ExcelWorksheet sheet, int columnaIndex, int totalFilas)
{
    // Columnas especiales que sabemos que tipo son
    var columnaLower = columnaNombre.ToLowerInvariant();
    
    // Coordenadas geográficas - siempre DOUBLE
    if (columnaLower.Contains("lat") || columnaLower.Contains("lng") || 
        columnaLower.EndsWith("_lat") || columnaLower.EndsWith("_lng"))
    {
        return "DOUBLE";
    }
    
    // Precios - usar DOUBLE para evitar overflow
    if (columnaLower.Contains("precio"))
    {
        return "DOUBLE";
    }
    
    // Importes - usar DECIMAL con mayor precisión
    if (columnaLower.Contains("importe") || columnaLower.Contains("total"))
    {
        return "DECIMAL(18, 2)";
    }
    
    bool todosNumerosEnteros = true;
    bool todosNumerosDecimales = true;
    bool todasFechas = true;
    bool todosBooleanos = true;
    bool tieneComaComoSeparador = false;
    int valoresCheckeados = 0;
    
    for (int row = 2; row <= Math.Min(totalFilas, 100); row++)
    {
        var valor = sheet.Cells[row, columnaIndex].Text?.Trim();
        if (string.IsNullOrWhiteSpace(valor)) continue;
        
        valoresCheckeados++;
        
        // Detectar si tiene comas que podrían ser listas de valores
        if (valor.Contains(",") && valor.Split(',').All(p => int.TryParse(p.Trim(), out _)))
        {
            tieneComaComoSeparador = true;
        }
        
        if (!int.TryParse(valor, out _)) todosNumerosEnteros = false;
        if (!decimal.TryParse(valor.Replace(",", "."), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out _)) 
            todosNumerosDecimales = false;
        if (!DateTime.TryParse(valor, out _)) todasFechas = false;
        if (valor != "Sí" && valor != "No" && valor != "true" && valor != "false") todosBooleanos = false;
    }
    
    if (valoresCheckeados == 0) return "TEXT";
    
    // Si tiene comas como separador de listas, es TEXT
    if (tieneComaComoSeparador) return "TEXT";
    
    if (todosBooleanos) return "TINYINT(1)";
    if (todasFechas) return "DATETIME(6)";
    if (todosNumerosEnteros) return "BIGINT";
    if (todosNumerosDecimales) return "DOUBLE"; // Usar DOUBLE en vez de DECIMAL(10,2) para mayor rango
    
    return "TEXT";
}

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
        
        if (rowCount < 1)
        {
            Console.WriteLine($"  ⚠ {archivoExcel}: Sin datos");
            continue;
        }
        
        // Leer columnas de la fila 1 del Excel
        var columnas = new List<(string Nombre, string Tipo)>();
        var nombresVistos = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        
        for (int col = 1; col <= colCount; col++)
        {
            var nombreColumna = sheet.Cells[1, col].Text?.Trim();
            
            // Si no hay valor en la fila 1, no contar esta columna
            if (string.IsNullOrWhiteSpace(nombreColumna)) continue;
            
            // Manejar columnas duplicadas agregando sufijo
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
            
            var tipo = InferirTipoDato(nombreColumna, sheet, col, rowCount);
            columnas.Add((nombreFinal, tipo));
        }
        
        if (columnas.Count == 0)
        {
            Console.WriteLine($"  ⚠ {archivoExcel}: Sin columnas válidas");
            continue;
        }
        
        // Crear tabla con el nombre del archivo Excel
        var nombreTabla = NormalizarNombreTabla(archivoExcel);
        var columnasSQL = string.Join(",\n            ", 
            columnas.Select(c => $"`{c.Nombre}` {c.Tipo} NULL"));
        
        var createTableSQL = $@"
            CREATE TABLE `{nombreTabla}` (
            {columnasSQL}
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        var cmd = conn.CreateCommand();
        cmd.CommandText = createTableSQL;
        await cmd.ExecuteNonQueryAsync();
        
        Console.WriteLine($"  ✓ {nombreTabla} creada ({columnas.Count} columnas, {rowCount - 1} filas de datos)");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ {archivoExcel}: {ex.Message}");
    }
}

Console.WriteLine("\n✅ Estructura de tablas creada desde archivos Excel");
