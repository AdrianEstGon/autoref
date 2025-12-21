using AutoRef_API.Database;
using AutoRef_API.Enum;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Services;

public class ImportacionService
{
    private readonly AppDataBase _db;
    private readonly ILogger<ImportacionService> _logger;
    
    // Mapeos de IDs antiguos a nuevos
    private Dictionary<long, Guid> _temporadasMap = new();
    private Dictionary<long, Guid> _categoriasMap = new();
    private Dictionary<long, Guid> _clubsMap = new();
    private Dictionary<long, Guid> _competicionesMap = new();
    private Dictionary<long, Guid> _polideportivosMap = new();
    private Dictionary<long, Guid> _personasMap = new();
    private Dictionary<long, Guid> _equiposMap = new();
    private Dictionary<long, Guid> _partidosMap = new();
    
    public ImportacionService(AppDataBase db, ILogger<ImportacionService> logger)
    {
        _db = db;
        _logger = logger;
    }
    
    public async Task<ImportacionResult> ImportarTodoAsync(string carpetaDatos, Guid federacionId)
    {
        var result = new ImportacionResult();
        
        try
        {
            // Cargar mapeos existentes de la BD (por si ya hay datos importados)
            await CargarMapeosExistentes();
            
            // Orden de importación según dependencias
            result.Temporadas = await ImportarTemporadas(Path.Combine(carpetaDatos, "temporadas.xlsx"));
            result.Categorias = await ImportarCategorias(Path.Combine(carpetaDatos, "categorias.xlsx"));
            result.Clubs = await ImportarClubs(Path.Combine(carpetaDatos, "clubs.xlsx"), federacionId);
            result.Polideportivos = await ImportarPolideportivos(Path.Combine(carpetaDatos, "campos de juego.xlsx"));
            result.Personas = await ImportarPersonas(Path.Combine(carpetaDatos, "personas.xlsx"));
            result.Competiciones = await ImportarCompeticiones(Path.Combine(carpetaDatos, "competiciones.xlsx"), federacionId);
            result.Equipos = await ImportarEquipos(Path.Combine(carpetaDatos, "equipos.xlsx"));
            result.Licencias = await ImportarLicencias(Path.Combine(carpetaDatos, "licencias.xlsx"));
            
            // Partidos (divididos en varios archivos)
            result.Partidos = await ImportarPartidos(carpetaDatos);
            
            result.Success = true;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.Error = ex.Message;
            _logger.LogError(ex, "Error durante la importación");
        }
        
        return result;
    }
    
    private async Task CargarMapeosExistentes()
    {
        _temporadasMap = await _db.Temporadas
            .Where(t => t.ImportId != null)
            .ToDictionaryAsync(t => t.ImportId!.Value, t => t.Id);
            
        _categoriasMap = await _db.Categorias
            .Where(c => c.ImportId != null)
            .ToDictionaryAsync(c => c.ImportId!.Value, c => c.Id);
            
        _clubsMap = await _db.Clubs
            .Where(c => c.ImportId != null)
            .ToDictionaryAsync(c => c.ImportId!.Value, c => c.Id);
            
        _competicionesMap = await _db.Competiciones
            .Where(c => c.ImportId != null)
            .ToDictionaryAsync(c => c.ImportId!.Value, c => c.Id);
            
        _polideportivosMap = await _db.Polideportivos
            .Where(p => p.ImportId != null)
            .ToDictionaryAsync(p => p.ImportId!.Value, p => p.Id);
            
        _personasMap = await _db.Personas
            .Where(p => p.ImportId != null)
            .ToDictionaryAsync(p => p.ImportId!.Value, p => p.Id);
            
        _equiposMap = await _db.Equipos
            .Where(e => e.ImportId != null)
            .ToDictionaryAsync(e => e.ImportId!.Value, e => e.Id);
            
        _partidosMap = await _db.Partidos
            .Where(p => p.ImportId != null)
            .ToDictionaryAsync(p => p.ImportId!.Value, p => p.Id);
    }
    
    private async Task<ImportItemResult> ImportarTemporadas(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Temporadas" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _temporadasMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                // Verificar si ya existe por nombre
                var existente = await _db.Temporadas.FirstOrDefaultAsync(t => t.Nombre == nombre);
                if (existente != null)
                {
                    _temporadasMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var temporada = new Temporada
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    FechaInicio = GetDateTime(row, 3) ?? DateTime.UtcNow,
                    FechaFin = GetDateTime(row, 4) ?? DateTime.UtcNow.AddYears(1),
                    Activa = GetBool(row, 5) ?? true,
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 6),
                    FechaDestruccion = GetDateTime(row, 7)
                };
                
                _db.Temporadas.Add(temporada);
                _temporadasMap[importId.Value] = temporada.Id;
                result.Insertados++;
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando temporada en fila {Fila}", row.RowNumber());
            }
        }
        
        await _db.SaveChangesAsync();
        return result;
    }
    
    private async Task<ImportItemResult> ImportarCategorias(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Categorías" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _categoriasMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                // Verificar si ya existe por nombre
                var existente = await _db.Categorias.FirstOrDefaultAsync(c => c.Nombre == nombre);
                if (existente != null)
                {
                    _categoriasMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var categoria = new Categoria
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    NombrePlaya = GetString(row, 3),
                    Token = GetString(row, 4),
                    Descripcion = GetString(row, 5),
                    Color = GetString(row, 6),
                    Posicion = GetInt(row, 7) ?? 0,
                    EdadInicio = GetInt(row, 8),
                    NumeroAnios = GetInt(row, 9),
                    BornFrom = GetDateTime(row, 10),
                    BornTo = GetDateTime(row, 11),
                    Federado = GetBool(row, 12) ?? false,
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 13),
                    FechaDestruccion = GetDateTime(row, 14)
                };
                
                _db.Categorias.Add(categoria);
                _categoriasMap[importId.Value] = categoria.Id;
                result.Insertados++;
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando categoría en fila {Fila}", row.RowNumber());
            }
        }
        
        await _db.SaveChangesAsync();
        return result;
    }
    
    private async Task<ImportItemResult> ImportarClubs(string filePath, Guid federacionId)
    {
        var result = new ImportItemResult { Nombre = "Clubs" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _clubsMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                var cif = GetString(row, 3) ?? $"IMPORT-{importId}";
                
                // Verificar si ya existe
                var existente = await _db.Clubs.FirstOrDefaultAsync(c => c.Nombre == nombre && c.FederacionId == federacionId);
                if (existente != null)
                {
                    _clubsMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var club = new Club
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    CIF = cif,
                    RazonSocial = GetString(row, 4),
                    Email = GetString(row, 5),
                    Escudo = GetString(row, 6),
                    ClientId = GetLong(row, 7),
                    FederacionId = federacionId,
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 8),
                    FechaDestruccion = GetDateTime(row, 9)
                };
                
                _db.Clubs.Add(club);
                _clubsMap[importId.Value] = club.Id;
                result.Insertados++;
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando club en fila {Fila}", row.RowNumber());
            }
        }
        
        await _db.SaveChangesAsync();
        return result;
    }
    
    private async Task<ImportItemResult> ImportarPolideportivos(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Polideportivos" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _polideportivosMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                // Verificar si ya existe
                var existente = await _db.Polideportivos.FirstOrDefaultAsync(p => p.Nombre == nombre);
                if (existente != null)
                {
                    _polideportivosMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var polideportivo = new Polideportivo
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    Direccion = GetString(row, 3),
                    Poblacion = GetString(row, 4),
                    Zona = GetString(row, 5),
                    Latitud = GetDouble(row, 6),
                    Longitud = GetDouble(row, 7),
                    Servicios = GetString(row, 8),
                    ClubesIds = GetString(row, 9),
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 10),
                    FechaDestruccion = GetDateTime(row, 11)
                };
                
                _db.Polideportivos.Add(polideportivo);
                _polideportivosMap[importId.Value] = polideportivo.Id;
                result.Insertados++;
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando polideportivo en fila {Fila}", row.RowNumber());
            }
        }
        
        await _db.SaveChangesAsync();
        return result;
    }
    
    private async Task<ImportItemResult> ImportarPersonas(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Personas" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        var batch = new List<Persona>();
        var batchSize = 100;
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _personasMap.ContainsKey(importId.Value)) continue;
                
                var documento = GetString(row, 2) ?? $"IMP-{importId}";
                var nombre = GetString(row, 3) ?? "Sin nombre";
                var apellidos = GetString(row, 4) ?? "";
                
                // Verificar si ya existe por documento
                var existente = await _db.Personas.FirstOrDefaultAsync(p => p.Documento == documento);
                if (existente != null)
                {
                    _personasMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var persona = new Persona
                {
                    Id = Guid.NewGuid(),
                    Documento = documento,
                    TipoDocumento = GetString(row, 5),
                    Nombre = nombre,
                    Apellidos = apellidos,
                    FechaNacimiento = GetDateTime(row, 6),
                    Sexo = GetString(row, 7),
                    Email = GetString(row, 8),
                    Telefono = GetString(row, 9),
                    Direccion = GetString(row, 10),
                    CodigoPostal = GetString(row, 11),
                    Provincia = GetString(row, 12),
                    Ciudad = GetString(row, 13),
                    Poblacion = GetString(row, 14),
                    Lat = GetDouble(row, 15),
                    Lng = GetDouble(row, 16),
                    Nacionalidad = GetString(row, 17),
                    Comentarios = GetString(row, 18),
                    Tipo = (TipoPersona)(GetInt(row, 19) ?? 0),
                    NivelArbitro = GetString(row, 20),
                    NivelEntrenador = GetString(row, 21),
                    NumeroCuenta = GetString(row, 22),
                    CertificadoAusenciaDelitos = GetBool(row, 23),
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 24),
                    FechaDestruccion = GetDateTime(row, 25)
                };
                
                batch.Add(persona);
                _personasMap[importId.Value] = persona.Id;
                result.Insertados++;
                
                if (batch.Count >= batchSize)
                {
                    _db.Personas.AddRange(batch);
                    await _db.SaveChangesAsync();
                    batch.Clear();
                }
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando persona en fila {Fila}", row.RowNumber());
            }
        }
        
        if (batch.Count > 0)
        {
            _db.Personas.AddRange(batch);
            await _db.SaveChangesAsync();
        }
        
        return result;
    }
    
    private async Task<ImportItemResult> ImportarCompeticiones(string filePath, Guid federacionId)
    {
        var result = new ImportItemResult { Nombre = "Competiciones" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        // Obtener modalidad por defecto (voley)
        var modalidadVoley = await _db.Modalidades.FirstOrDefaultAsync(m => m.Nombre.ToLower().Contains("voley"));
        var modalidadId = modalidadVoley?.Id;
        
        // Obtener temporada activa
        var temporadaActiva = await _db.Temporadas.FirstOrDefaultAsync(t => t.Activa);
        var temporadaId = temporadaActiva?.Id;
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _competicionesMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                // Verificar si ya existe
                var existente = await _db.Competiciones.FirstOrDefaultAsync(c => c.Nombre == nombre && c.FederacionId == federacionId);
                if (existente != null)
                {
                    _competicionesMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                // Mapear temporada si viene en el Excel
                var temporadaImportId = GetLong(row, 3);
                var compTemporadaId = temporadaImportId.HasValue && _temporadasMap.TryGetValue(temporadaImportId.Value, out var tempId) 
                    ? tempId 
                    : temporadaId;
                
                // Mapear categoría si viene en el Excel
                var categoriaImportId = GetLong(row, 4);
                var compCategoriaId = categoriaImportId.HasValue && _categoriasMap.TryGetValue(categoriaImportId.Value, out var catId) 
                    ? catId 
                    : (Guid?)null;
                
                var competicion = new Competicion
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    EsFederada = GetBool(row, 5) ?? true,
                    Activa = GetBool(row, 6) ?? true,
                    TipoCompeticion = GetString(row, 7),
                    Sexo = GetString(row, 8),
                    EsMixto = GetBool(row, 9),
                    Posicion = GetInt(row, 10) ?? 0,
                    TemporadaId = compTemporadaId,
                    ModalidadId = modalidadId,
                    CategoriaId = compCategoriaId,
                    FederacionId = federacionId,
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 11),
                    FechaDestruccion = GetDateTime(row, 12)
                };
                
                _db.Competiciones.Add(competicion);
                _competicionesMap[importId.Value] = competicion.Id;
                result.Insertados++;
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando competición en fila {Fila}", row.RowNumber());
            }
        }
        
        await _db.SaveChangesAsync();
        return result;
    }
    
    private async Task<ImportItemResult> ImportarEquipos(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Equipos" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        var batch = new List<Equipo>();
        var batchSize = 100;
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _equiposMap.ContainsKey(importId.Value)) continue;
                
                var nombre = GetString(row, 2); // name
                if (string.IsNullOrEmpty(nombre)) continue;
                
                // Mapear club
                var clubImportId = GetLong(row, 3);
                Guid? clubId = null;
                if (clubImportId.HasValue && _clubsMap.TryGetValue(clubImportId.Value, out var cId))
                {
                    clubId = cId;
                }
                
                // Mapear categoría
                var categoriaImportId = GetLong(row, 4);
                Guid? categoriaId = null;
                if (categoriaImportId.HasValue && _categoriasMap.TryGetValue(categoriaImportId.Value, out var catId))
                {
                    categoriaId = catId;
                }
                
                // Mapear competición
                var competicionImportId = GetLong(row, 5);
                Guid? competicionId = null;
                if (competicionImportId.HasValue && _competicionesMap.TryGetValue(competicionImportId.Value, out var compId))
                {
                    competicionId = compId;
                }
                
                // Verificar si ya existe
                var existente = await _db.Equipos.FirstOrDefaultAsync(e => 
                    e.Nombre == nombre && 
                    e.ClubId == clubId && 
                    e.CategoriaId == categoriaId &&
                    e.CompeticionId == competicionId);
                    
                if (existente != null)
                {
                    _equiposMap[importId.Value] = existente.Id;
                    result.Existentes++;
                    continue;
                }
                
                var equipo = new Equipo
                {
                    Id = Guid.NewGuid(),
                    Nombre = nombre,
                    ClubId = clubId,
                    CategoriaId = categoriaId,
                    CompeticionId = competicionId,
                    Sexo = GetString(row, 6),
                    Estado = GetString(row, 7),
                    Comentarios = GetString(row, 8),
                    PosicionRanking = GetInt(row, 9),
                    PuntosRanking = GetDecimal(row, 10),
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 11),
                    FechaDestruccion = GetDateTime(row, 12)
                };
                
                batch.Add(equipo);
                _equiposMap[importId.Value] = equipo.Id;
                result.Insertados++;
                
                if (batch.Count >= batchSize)
                {
                    _db.Equipos.AddRange(batch);
                    await _db.SaveChangesAsync();
                    batch.Clear();
                }
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando equipo en fila {Fila}", row.RowNumber());
            }
        }
        
        if (batch.Count > 0)
        {
            _db.Equipos.AddRange(batch);
            await _db.SaveChangesAsync();
        }
        
        return result;
    }
    
    private async Task<ImportItemResult> ImportarLicencias(string filePath)
    {
        var result = new ImportItemResult { Nombre = "Licencias" };
        
        if (!File.Exists(filePath))
        {
            result.Omitido = true;
            result.Mensaje = "Archivo no encontrado";
            return result;
        }
        
        // Obtener temporada activa
        var temporadaActiva = await _db.Temporadas.FirstOrDefaultAsync(t => t.Activa);
        if (temporadaActiva == null)
        {
            result.Omitido = true;
            result.Mensaje = "No hay temporada activa";
            return result;
        }
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        var batch = new List<LicenciaPersona>();
        var batchSize = 100;
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null) continue;
                
                // Verificar si ya existe por ImportId
                var existente = await _db.LicenciasPersonas.AnyAsync(l => l.ImportId == importId);
                if (existente)
                {
                    result.Existentes++;
                    continue;
                }
                
                // Mapear persona
                var personaImportId = GetLong(row, 2);
                if (!personaImportId.HasValue || !_personasMap.TryGetValue(personaImportId.Value, out var personaId))
                {
                    result.Errores++;
                    continue;
                }
                
                // Mapear temporada
                var temporadaImportId = GetLong(row, 3);
                var licTemporadaId = temporadaImportId.HasValue && _temporadasMap.TryGetValue(temporadaImportId.Value, out var tempId) 
                    ? tempId 
                    : temporadaActiva.Id;
                
                // Mapear club si existe
                var clubImportId = GetLong(row, 4);
                Guid? clubId = null;
                if (clubImportId.HasValue && _clubsMap.TryGetValue(clubImportId.Value, out var cId))
                {
                    clubId = cId;
                }
                
                // Mapear categoría si existe
                var categoriaImportId = GetLong(row, 5);
                Guid? categoriaId = null;
                if (categoriaImportId.HasValue && _categoriasMap.TryGetValue(categoriaImportId.Value, out var catId))
                {
                    categoriaId = catId;
                }
                
                var licencia = new LicenciaPersona
                {
                    Id = Guid.NewGuid(),
                    PersonaId = personaId,
                    TemporadaId = licTemporadaId,
                    ClubId = clubId,
                    CategoriaBaseId = categoriaId,
                    NumeroLicencia = GetString(row, 6),
                    Tipo = GetString(row, 7),
                    Activa = GetBool(row, 8) ?? true,
                    FechaAlta = GetDateTime(row, 9),
                    FechaFin = GetDateTime(row, 10),
                    Genero = GetString(row, 11),
                    CategoriaEntrenador = GetString(row, 12),
                    CategoriaArbitro = GetString(row, 13),
                    Observaciones = GetString(row, 14),
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 15),
                    FechaDestruccion = GetDateTime(row, 16)
                };
                
                batch.Add(licencia);
                result.Insertados++;
                
                if (batch.Count >= batchSize)
                {
                    _db.LicenciasPersonas.AddRange(batch);
                    await _db.SaveChangesAsync();
                    batch.Clear();
                }
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando licencia en fila {Fila}", row.RowNumber());
            }
        }
        
        if (batch.Count > 0)
        {
            _db.LicenciasPersonas.AddRange(batch);
            await _db.SaveChangesAsync();
        }
        
        return result;
    }
    
    private async Task<ImportItemResult> ImportarPartidos(string carpetaDatos)
    {
        var result = new ImportItemResult { Nombre = "Partidos" };
        
        // Buscar todos los archivos de partidos
        var archivosPartidos = Directory.GetFiles(carpetaDatos, "partidos*.xlsx");
        
        if (archivosPartidos.Length == 0)
        {
            result.Omitido = true;
            result.Mensaje = "No se encontraron archivos de partidos";
            return result;
        }
        
        foreach (var archivo in archivosPartidos.OrderBy(f => f))
        {
            var subResult = await ImportarPartidosArchivo(archivo);
            result.Insertados += subResult.Insertados;
            result.Existentes += subResult.Existentes;
            result.Errores += subResult.Errores;
        }
        
        return result;
    }
    
    private async Task<ImportItemResult> ImportarPartidosArchivo(string filePath)
    {
        var result = new ImportItemResult { Nombre = Path.GetFileName(filePath) };
        
        using var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed()?.RowsUsed().Skip(1) ?? Enumerable.Empty<IXLRangeRow>();
        
        var batch = new List<Partido>();
        var batchSize = 100;
        
        foreach (var row in rows)
        {
            try
            {
                var importId = GetLong(row, 1); // id
                if (importId == null || _partidosMap.ContainsKey(importId.Value)) continue;
                
                // Verificar si ya existe por ImportId
                var existente = await _db.Partidos.AnyAsync(p => p.ImportId == importId);
                if (existente)
                {
                    result.Existentes++;
                    continue;
                }
                
                // Mapear competición
                var competicionImportId = GetLong(row, 2);
                Guid? competicionId = null;
                if (competicionImportId.HasValue && _competicionesMap.TryGetValue(competicionImportId.Value, out var compId))
                {
                    competicionId = compId;
                }
                
                // Mapear equipo local
                var equipoLocalImportId = GetLong(row, 3);
                Guid? equipoLocalId = null;
                if (equipoLocalImportId.HasValue && _equiposMap.TryGetValue(equipoLocalImportId.Value, out var eLocalId))
                {
                    equipoLocalId = eLocalId;
                }
                
                // Mapear equipo visitante
                var equipoVisitanteImportId = GetLong(row, 4);
                Guid? equipoVisitanteId = null;
                if (equipoVisitanteImportId.HasValue && _equiposMap.TryGetValue(equipoVisitanteImportId.Value, out var eVisitId))
                {
                    equipoVisitanteId = eVisitId;
                }
                
                // Mapear polideportivo (lugar)
                var polideportivoImportId = GetLong(row, 5);
                Guid? lugarId = null;
                if (polideportivoImportId.HasValue && _polideportivosMap.TryGetValue(polideportivoImportId.Value, out var poliId))
                {
                    lugarId = poliId;
                }
                
                // Mapear categoría
                var categoriaImportId = GetLong(row, 6);
                Guid? categoriaId = null;
                if (categoriaImportId.HasValue && _categoriasMap.TryGetValue(categoriaImportId.Value, out var catId))
                {
                    categoriaId = catId;
                }
                
                var partido = new Partido
                {
                    Id = Guid.NewGuid(),
                    CompeticionId = competicionId,
                    EquipoLocalId = equipoLocalId,
                    EquipoVisitanteId = equipoVisitanteId,
                    LugarId = lugarId,
                    CategoriaId = categoriaId,
                    Fecha = GetDateTime(row, 7),
                    Hora = GetTimeSpan(row, 8),
                    Jornada = GetInt(row, 9) ?? 0,
                    ResultadoLocal = GetInt(row, 10),
                    ResultadoVisitante = GetInt(row, 11),
                    NombreLocal = GetString(row, 12),
                    NombreVisitante = GetString(row, 13),
                    NombrePabellon = GetString(row, 14),
                    Comentarios = GetString(row, 15),
                    ImportId = importId,
                    FechaCreacion = GetDateTime(row, 16),
                    FechaDestruccion = GetDateTime(row, 17)
                };
                
                batch.Add(partido);
                _partidosMap[importId.Value] = partido.Id;
                result.Insertados++;
                
                if (batch.Count >= batchSize)
                {
                    _db.Partidos.AddRange(batch);
                    await _db.SaveChangesAsync();
                    batch.Clear();
                }
            }
            catch (Exception ex)
            {
                result.Errores++;
                _logger.LogWarning(ex, "Error importando partido en fila {Fila}", row.RowNumber());
            }
        }
        
        if (batch.Count > 0)
        {
            _db.Partidos.AddRange(batch);
            await _db.SaveChangesAsync();
        }
        
        return result;
    }
    
    #region Helpers
    
    private static string? GetString(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        return cell.GetString()?.Trim();
    }
    
    private static int? GetInt(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.Number)
            return (int)cell.GetDouble();
        if (int.TryParse(cell.GetString(), out var val))
            return val;
        return null;
    }
    
    private static long? GetLong(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.Number)
            return (long)cell.GetDouble();
        if (long.TryParse(cell.GetString(), out var val))
            return val;
        return null;
    }
    
    private static double? GetDouble(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble();
        if (double.TryParse(cell.GetString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var val))
            return val;
        return null;
    }
    
    private static decimal? GetDecimal(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.Number)
            return (decimal)cell.GetDouble();
        if (decimal.TryParse(cell.GetString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var val))
            return val;
        return null;
    }
    
    private static bool? GetBool(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.Boolean)
            return cell.GetBoolean();
        var str = cell.GetString()?.ToLower();
        return str == "true" || str == "1" || str == "si" || str == "sí" || str == "yes";
    }
    
    private static DateTime? GetDateTime(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.DateTime)
            return cell.GetDateTime();
        if (DateTime.TryParse(cell.GetString(), out var val))
            return val;
        return null;
    }
    
    private static TimeSpan? GetTimeSpan(IXLRangeRow row, int col)
    {
        var cell = row.Cell(col);
        if (cell.IsEmpty()) return null;
        if (cell.DataType == XLDataType.DateTime)
            return cell.GetDateTime().TimeOfDay;
        if (cell.DataType == XLDataType.TimeSpan)
            return cell.GetTimeSpan();
        if (TimeSpan.TryParse(cell.GetString(), out var val))
            return val;
        return null;
    }
    
    #endregion
}

public class ImportacionResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }
    
    public ImportItemResult Temporadas { get; set; } = new();
    public ImportItemResult Categorias { get; set; } = new();
    public ImportItemResult Clubs { get; set; } = new();
    public ImportItemResult Polideportivos { get; set; } = new();
    public ImportItemResult Personas { get; set; } = new();
    public ImportItemResult Competiciones { get; set; } = new();
    public ImportItemResult Equipos { get; set; } = new();
    public ImportItemResult Licencias { get; set; } = new();
    public ImportItemResult Partidos { get; set; } = new();
}

public class ImportItemResult
{
    public string Nombre { get; set; } = "";
    public int Insertados { get; set; }
    public int Existentes { get; set; }
    public int Errores { get; set; }
    public bool Omitido { get; set; }
    public string? Mensaje { get; set; }
}
