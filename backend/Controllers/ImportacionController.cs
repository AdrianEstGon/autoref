using AutoRef_API.Database;
using AutoRef_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportacionController : ControllerBase
{
    private readonly AppDataBase _db;
    private readonly ILogger<ImportacionController> _logger;
    private readonly IServiceProvider _serviceProvider;
    
    public ImportacionController(AppDataBase db, ILogger<ImportacionController> logger, IServiceProvider serviceProvider)
    {
        _db = db;
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    
    /// <summary>
    /// Crear la federación por defecto si no existe
    /// </summary>
    [HttpPost("crear-federacion")]
    public async Task<ActionResult<object>> CrearFederacion()
    {
        var fedId = SeedIds.FederacionAsturianaId;
        var existe = await _db.Federaciones.AnyAsync(f => f.Id == fedId);
        
        if (existe)
        {
            return Ok(new { mensaje = "La federación ya existe", federacionId = fedId });
        }
        
        var federacion = new Federacion
        {
            Id = fedId,
            Nombre = "Federación Asturiana de Balonmano"
        };
        
        _db.Federaciones.Add(federacion);
        await _db.SaveChangesAsync();
        
        _logger.LogInformation("Federación creada: {Id} - {Nombre}", federacion.Id, federacion.Nombre);
        
        return Ok(new { mensaje = "Federación creada correctamente", federacionId = fedId });
    }
    
    /// <summary>
    /// Importar todos los datos desde archivos Excel
    /// </summary>
    /// <param name="carpetaDatos">Ruta a la carpeta con los archivos Excel (por defecto: ./Datos)</param>
    /// <param name="federacionId">ID de la federación donde importar</param>
    [HttpPost("ejecutar")]
    public async Task<ActionResult<ImportacionResult>> EjecutarImportacion(
        [FromQuery] string? carpetaDatos = null,
        [FromQuery] Guid? federacionId = null)
    {
        try
        {
            // Determinar carpeta de datos
            var carpeta = carpetaDatos ?? Path.Combine(Directory.GetCurrentDirectory(), "..", "Datos");
            if (!Directory.Exists(carpeta))
            {
                return BadRequest(new { error = $"La carpeta {carpeta} no existe" });
            }
            
            // Determinar federación
            Guid fedId;
            if (federacionId.HasValue)
            {
                fedId = federacionId.Value;
            }
            else
            {
                var federacion = await _db.Federaciones.FirstOrDefaultAsync();
                if (federacion == null)
                {
                    return BadRequest(new { error = "No hay federaciones configuradas. Cree una federación primero." });
                }
                fedId = federacion.Id;
            }
            
            // Verificar que la federación existe
            var fedExiste = await _db.Federaciones.AnyAsync(f => f.Id == fedId);
            if (!fedExiste)
            {
                return BadRequest(new { error = $"La federación con ID {fedId} no existe" });
            }
            
            // Crear el servicio de importación
            var logger = _serviceProvider.GetRequiredService<ILogger<ImportacionService>>();
            var importService = new ImportacionService(_db, logger);
            
            _logger.LogInformation("Iniciando importación desde {Carpeta} para federación {FederacionId}", carpeta, fedId);
            
            var result = await importService.ImportarTodoAsync(carpeta, fedId);
            
            _logger.LogInformation("Importación completada: Success={Success}", result.Success);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante la importación");
            return StatusCode(500, new { error = ex.Message });
        }
    }
    
    /// <summary>
    /// Listar archivos disponibles para importar
    /// </summary>
    [HttpGet("archivos")]
    public ActionResult<object> ListarArchivos([FromQuery] string? carpetaDatos = null)
    {
        var carpeta = carpetaDatos ?? Path.Combine(Directory.GetCurrentDirectory(), "..", "Datos");
        
        if (!Directory.Exists(carpeta))
        {
            return BadRequest(new { error = $"La carpeta {carpeta} no existe" });
        }
        
        var archivos = Directory.GetFiles(carpeta, "*.xlsx")
            .Select(f => new
            {
                nombre = Path.GetFileName(f),
                tamano = new FileInfo(f).Length,
                fechaModificacion = new FileInfo(f).LastWriteTime
            })
            .OrderBy(f => f.nombre)
            .ToList();
        
        return Ok(new
        {
            carpeta,
            totalArchivos = archivos.Count,
            archivos
        });
    }
    
    /// <summary>
    /// Ver estadísticas de datos importados
    /// </summary>
    [HttpGet("estadisticas")]
    public async Task<ActionResult<object>> ObtenerEstadisticas()
    {
        var stats = new
        {
            temporadas = new
            {
                total = await _db.Temporadas.CountAsync(),
                importadas = await _db.Temporadas.CountAsync(t => t.ImportId != null)
            },
            categorias = new
            {
                total = await _db.Categorias.CountAsync(),
                importadas = await _db.Categorias.CountAsync(c => c.ImportId != null)
            },
            clubs = new
            {
                total = await _db.Clubs.CountAsync(),
                importados = await _db.Clubs.CountAsync(c => c.ImportId != null)
            },
            polideportivos = new
            {
                total = await _db.Polideportivos.CountAsync(),
                importados = await _db.Polideportivos.CountAsync(p => p.ImportId != null)
            },
            personas = new
            {
                total = await _db.Personas.CountAsync(),
                importadas = await _db.Personas.CountAsync(p => p.ImportId != null)
            },
            competiciones = new
            {
                total = await _db.Competiciones.CountAsync(),
                importadas = await _db.Competiciones.CountAsync(c => c.ImportId != null)
            },
            equipos = new
            {
                total = await _db.Equipos.CountAsync(),
                importados = await _db.Equipos.CountAsync(e => e.ImportId != null)
            },
            licencias = new
            {
                total = await _db.LicenciasPersonas.CountAsync(),
                importadas = await _db.LicenciasPersonas.CountAsync(l => l.ImportId != null)
            },
            partidos = new
            {
                total = await _db.Partidos.CountAsync(),
                importados = await _db.Partidos.CountAsync(p => p.ImportId != null)
            }
        };
        
        return Ok(stats);
    }
    
    /// <summary>
    /// Limpiar todos los datos importados (PELIGRO: elimina datos!)
    /// </summary>
    [HttpDelete("limpiar-importados")]
    public async Task<ActionResult<object>> LimpiarDatosImportados()
    {
        try
        {
            // Eliminar en orden inverso de dependencias
            var partidosEliminados = await _db.Partidos.Where(p => p.ImportId != null).ExecuteDeleteAsync();
            var licenciasEliminadas = await _db.LicenciasPersonas.Where(l => l.ImportId != null).ExecuteDeleteAsync();
            var equiposEliminados = await _db.Equipos.Where(e => e.ImportId != null).ExecuteDeleteAsync();
            var competicionesEliminadas = await _db.Competiciones.Where(c => c.ImportId != null).ExecuteDeleteAsync();
            var personasEliminadas = await _db.Personas.Where(p => p.ImportId != null).ExecuteDeleteAsync();
            var polideportivosEliminados = await _db.Polideportivos.Where(p => p.ImportId != null).ExecuteDeleteAsync();
            var clubsEliminados = await _db.Clubs.Where(c => c.ImportId != null).ExecuteDeleteAsync();
            var categoriasEliminadas = await _db.Categorias.Where(c => c.ImportId != null).ExecuteDeleteAsync();
            var temporadasEliminadas = await _db.Temporadas.Where(t => t.ImportId != null).ExecuteDeleteAsync();
            
            return Ok(new
            {
                mensaje = "Datos importados eliminados correctamente",
                eliminados = new
                {
                    partidos = partidosEliminados,
                    licencias = licenciasEliminadas,
                    equipos = equiposEliminados,
                    competiciones = competicionesEliminadas,
                    personas = personasEliminadas,
                    polideportivos = polideportivosEliminados,
                    clubs = clubsEliminados,
                    categorias = categoriasEliminadas,
                    temporadas = temporadasEliminadas
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error limpiando datos importados");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
