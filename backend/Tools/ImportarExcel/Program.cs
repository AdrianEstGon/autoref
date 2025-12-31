using MySqlConnector;
using OfficeOpenXml;

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

var connectionString = "Server=centerbeam.proxy.rlwy.net;Port=44269;Database=railway;User=root;Password=GRxhnJrlYUHUSIinGubqglouatNvvWBG;";
var datosPath = @"c:\Users\ruben\Desktop\autoref\Datos";
var federacionId = "4169b3fa-aada-4b43-9544-31984aaa8c84"; // ID de la federación existente

using var conn = new MySqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("✓ Conectado a la base de datos!\n");

// Importar Categorías
Console.WriteLine("=== Importando Categorías ===");
var categoriaFile = Path.Combine(datosPath, "categorias.xlsx");
if (File.Exists(categoriaFile))
{
    using var package = new ExcelPackage(new FileInfo(categoriaFile));
    var sheet = package.Workbook.Worksheets[0];
    var rowCount = sheet.Dimension?.Rows ?? 0;
    var colCount = sheet.Dimension?.Columns ?? 0;
    
    // Leer encabezados
    var headers = new Dictionary<string, int>();
    for (int col = 1; col <= colCount; col++)
    {
        var header = sheet.Cells[1, col].Text;
        if (!string.IsNullOrWhiteSpace(header))
        {
            headers[header] = col;
        }
    }
    
    for (int row = 2; row <= rowCount; row++)
    {
        var nombre = headers.ContainsKey("Nombre") ? sheet.Cells[row, headers["Nombre"]].Text : "";
        if (string.IsNullOrWhiteSpace(nombre)) continue;
        
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO categorias (Id, Nombre, Color, Posicion, Prioridad, Federado, MinArbitros)
            VALUES (@id, @nombre, @color, @pos, @prio, @fed, @minArb)";
        cmd.Parameters.AddWithValue("@id", Guid.NewGuid().ToString());
        cmd.Parameters.AddWithValue("@nombre", nombre);
        cmd.Parameters.AddWithValue("@color", headers.ContainsKey("Color") ? sheet.Cells[row, headers["Color"]].Text ?? "#999999" : "#999999");
        cmd.Parameters.AddWithValue("@pos", row - 2);
        cmd.Parameters.AddWithValue("@prio", 1);
        cmd.Parameters.AddWithValue("@fed", true);
        cmd.Parameters.AddWithValue("@minArb", 0);
        
        try
        {
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine($"  ✓ {nombre}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  ✗ {nombre}: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine($"  ⚠ Archivo no encontrado: {categoriaFile}");
}

// Importar Clubs
Console.WriteLine("\n=== Importando Clubs ===");
var clubFile = Path.Combine(datosPath, "clubs.xlsx");
var clubsMap = new Dictionary<string, string>(); // Mapa de Nombre -> GUID

if (File.Exists(clubFile))
{
    using var package = new ExcelPackage(new FileInfo(clubFile));
    var sheet = package.Workbook.Worksheets[0];
    var rowCount = sheet.Dimension?.Rows ?? 0;
    var colCount = sheet.Dimension?.Columns ?? 0;
    
    // Leer encabezados
    var headers = new Dictionary<string, int>();
    for (int col = 1; col <= colCount; col++)
    {
        var header = sheet.Cells[1, col].Text;
        if (!string.IsNullOrWhiteSpace(header))
        {
            headers[header] = col;
        }
    }
    
    for (int row = 2; row <= rowCount; row++)
    {
        var nombre = headers.ContainsKey("Nombre") ? sheet.Cells[row, headers["Nombre"]].Text : "";
        if (string.IsNullOrWhiteSpace(nombre)) continue;
        
        var clubId = Guid.NewGuid().ToString();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO clubs (Id, FederacionId, Nombre, Telefono, Email)
            VALUES (@id, @fedId, @nombre, @tel, @email)";
        cmd.Parameters.AddWithValue("@id", clubId);
        cmd.Parameters.AddWithValue("@fedId", federacionId);
        cmd.Parameters.AddWithValue("@nombre", nombre);
        cmd.Parameters.AddWithValue("@tel", headers.ContainsKey("Telefono") ? sheet.Cells[row, headers["Telefono"]].Text ?? "" : "");
        cmd.Parameters.AddWithValue("@email", headers.ContainsKey("Email") ? sheet.Cells[row, headers["Email"]].Text ?? "" : "");
        
        try
        {
            await cmd.ExecuteNonQueryAsync();
            clubsMap[nombre] = clubId; // Guardar por nombre
            Console.WriteLine($"  ✓ {nombre}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  ✗ {nombre}: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine($"  ⚠ Archivo no encontrado: {clubFile}");
}

// Obtener IDs de categorías
var categoriasMap = new Dictionary<string, string>();
var catQueryCmd = conn.CreateCommand();
catQueryCmd.CommandText = "SELECT Id, Nombre FROM categorias";
using (var reader = await catQueryCmd.ExecuteReaderAsync())
{
    while (await reader.ReadAsync())
    {
        categoriasMap[reader.GetString(1)] = reader.GetString(0);
    }
}

// Importar Equipos
Console.WriteLine("\n=== Importando Equipos ===");
var equipoFile = Path.Combine(datosPath, "equipos.xlsx");

if (File.Exists(equipoFile))
{
    using var package = new ExcelPackage(new FileInfo(equipoFile));
    var sheet = package.Workbook.Worksheets[0];
    var rowCount = sheet.Dimension?.Rows ?? 0;
    var colCount = sheet.Dimension?.Columns ?? 0;
    
    // Leer encabezados
    var headers = new Dictionary<string, int>();
    for (int col = 1; col <= colCount; col++)
    {
        var header = sheet.Cells[1, col].Text;
        if (!string.IsNullOrWhiteSpace(header))
        {
            headers[header] = col;
        }
    }
    
    for (int row = 2; row <= rowCount; row++)
    {
        var nombre = headers.ContainsKey("Nombre") ? sheet.Cells[row, headers["Nombre"]].Text : "";
        if (string.IsNullOrWhiteSpace(nombre)) continue;
        
        var clubNombre = headers.ContainsKey("Club") ? sheet.Cells[row, headers["Club"]].Text : "";
        var categoriaNombre = headers.ContainsKey("Categoria") ? sheet.Cells[row, headers["Categoria"]].Text : "";
        
        string? clubId = null;
        if (!string.IsNullOrWhiteSpace(clubNombre) && clubsMap.ContainsKey(clubNombre))
        {
            clubId = clubsMap[clubNombre];
        }
        
        string? categoriaId = null;
        if (!string.IsNullOrWhiteSpace(categoriaNombre) && categoriasMap.ContainsKey(categoriaNombre))
        {
            categoriaId = categoriasMap[categoriaNombre];
        }
        
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO equipos (Id, ClubId, CategoriaId, Nombre, Sexo)
            VALUES (@id, @clubId, @catId, @nombre, @sexo)";
        cmd.Parameters.AddWithValue("@id", Guid.NewGuid().ToString());
        cmd.Parameters.AddWithValue("@clubId", clubId != null ? (object)clubId : DBNull.Value);
        cmd.Parameters.AddWithValue("@catId", categoriaId != null ? (object)categoriaId : DBNull.Value);
        cmd.Parameters.AddWithValue("@nombre", nombre);
        cmd.Parameters.AddWithValue("@sexo", headers.ContainsKey("Sexo") ? sheet.Cells[row, headers["Sexo"]].Text ?? "Mixto" : "Mixto");
        
        try
        {
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine($"  ✓ {nombre}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  ✗ {nombre}: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine($"  ⚠ Archivo no encontrado: {equipoFile}");
}

// Importar Usuarios
Console.WriteLine("\n=== Importando Usuarios ===");
var usuarioFile = Path.Combine(datosPath, "usuarios.xlsx");

if (File.Exists(usuarioFile))
{
    using var package = new ExcelPackage(new FileInfo(usuarioFile));
    var sheet = package.Workbook.Worksheets[0];
    var rowCount = sheet.Dimension?.Rows ?? 0;
    var colCount = sheet.Dimension?.Columns ?? 0;
    
    // Leer encabezados
    var headers = new Dictionary<string, int>();
    for (int col = 1; col <= colCount; col++)
    {
        var header = sheet.Cells[1, col].Text;
        if (!string.IsNullOrWhiteSpace(header))
        {
            headers[header] = col;
        }
    }
    
    for (int row = 2; row <= rowCount; row++)
    {
        var email = headers.ContainsKey("Email") ? sheet.Cells[row, headers["Email"]].Text : "";
        var userName = headers.ContainsKey("UserName") ? sheet.Cells[row, headers["UserName"]].Text : email;
        
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(userName)) continue;
        
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO usuarios (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
                                 PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount,
                                 Nombre, PrimerApellido, SegundoApellido)
            VALUES (@id, @username, @normalizedUsername, @email, @normalizedEmail, @emailConfirmed,
                    @phone, @phoneConfirmed, @twoFactor, @lockoutEnabled, @accessFailed,
                    @nombre, @apellido1, @apellido2)";
        
        var userId = Guid.NewGuid().ToString();
        var nombre = headers.ContainsKey("Nombre") ? sheet.Cells[row, headers["Nombre"]].Text : "";
        var apellido1 = headers.ContainsKey("PrimerApellido") ? sheet.Cells[row, headers["PrimerApellido"]].Text : "";
        var apellido2 = headers.ContainsKey("SegundoApellido") ? sheet.Cells[row, headers["SegundoApellido"]].Text : "";
        
        cmd.Parameters.AddWithValue("@id", userId);
        cmd.Parameters.AddWithValue("@username", string.IsNullOrWhiteSpace(userName) ? email : userName);
        cmd.Parameters.AddWithValue("@normalizedUsername", (string.IsNullOrWhiteSpace(userName) ? email : userName).ToUpper());
        cmd.Parameters.AddWithValue("@email", email);
        cmd.Parameters.AddWithValue("@normalizedEmail", email.ToUpper());
        cmd.Parameters.AddWithValue("@emailConfirmed", false);
        cmd.Parameters.AddWithValue("@phone", headers.ContainsKey("PhoneNumber") ? sheet.Cells[row, headers["PhoneNumber"]].Text ?? "" : "");
        cmd.Parameters.AddWithValue("@phoneConfirmed", false);
        cmd.Parameters.AddWithValue("@twoFactor", false);
        cmd.Parameters.AddWithValue("@lockoutEnabled", true);
        cmd.Parameters.AddWithValue("@accessFailed", 0);
        cmd.Parameters.AddWithValue("@nombre", nombre);
        cmd.Parameters.AddWithValue("@apellido1", apellido1);
        cmd.Parameters.AddWithValue("@apellido2", apellido2);
        
        try
        {
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine($"  ✓ {email}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  ✗ {email}: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine($"  ⚠ Archivo no encontrado: {usuarioFile}");
}

Console.WriteLine("\n✅ Importación completada\n");
