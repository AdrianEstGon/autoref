using AutoRef_API.Database;
using AutoRef_API.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers;

[Authorize(Roles = "Admin,Federacion")]
[Route("api/[controller]")]
[ApiController]
public class MutuaController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public MutuaController(AppDataBase context, UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    private string BuildFileName(DateTime fechaUtc)
    {
        return $"EnvioMutua_{fechaUtc:yyyyMMdd_HHmm}.xlsx";
    }

    [HttpGet("pendientes")]
    public async Task<IActionResult> GetPendientes()
    {
        var pendientes = await _context.Inscripciones
            .Include(i => i.Persona)
            .Include(i => i.Competicion)
            .Include(i => i.Equipo).ThenInclude(e => e.Club)
            .Include(i => i.Equipo).ThenInclude(e => e.Categoria)
            .Where(i => i.Activa && !i.Persona.MutuaEnviada)
            .OrderBy(i => i.Equipo.Club.Nombre)
            .ThenBy(i => i.Equipo.Nombre)
            .ThenBy(i => i.Persona.Apellidos)
            .Select(i => new MutuaPendienteDto
            {
                InscripcionId = i.Id,
                PersonaId = i.Persona.Id,
                Nombre = i.Persona.Nombre,
                Apellidos = i.Persona.Apellidos,
                Documento = i.Persona.Documento,
                FechaNacimiento = i.Persona.FechaNacimiento,
                Tipo = i.Persona.Tipo,
                Categoria = i.Equipo.Categoria.Nombre,
                Equipo = i.Equipo.Nombre,
                Club = i.Equipo.Club.Nombre,
                Competicion = i.Competicion.Nombre,
                CompeticionFederada = i.Competicion.EsFederada,
                MutuaSolicitadaPorClub = i.MutuaSolicitada,
                FechaSolicitud = i.FechaSolicitud,
                CheckDefaultEnviar = i.MutuaSolicitada || i.Competicion.EsFederada
            })
            .ToListAsync();

        return Ok(pendientes);
    }

    [HttpGet("envios")]
    public async Task<IActionResult> GetEnvios()
    {
        var envios = await _context.EnviosMutua
            .Include(e => e.Items)
            .OrderByDescending(e => e.FechaEnvioMutua)
            .Select(e => new EnvioMutuaResumenDto
            {
                EnvioId = e.Id,
                FechaEnvioMutua = e.FechaEnvioMutua,
                TotalItems = e.Items.Count
            })
            .ToListAsync();

        return Ok(envios);
    }

    [HttpGet("envios/{envioId:guid}/excel")]
    public async Task<IActionResult> DescargarExcelEnvio(Guid envioId)
    {
        var envio = await _context.EnviosMutua
            .Include(e => e.Items)
                .ThenInclude(it => it.Inscripcion)
                    .ThenInclude(i => i.Persona)
            .Include(e => e.Items)
                .ThenInclude(it => it.Inscripcion)
                    .ThenInclude(i => i.Competicion)
            .Include(e => e.Items)
                .ThenInclude(it => it.Inscripcion)
                    .ThenInclude(i => i.Equipo)
                        .ThenInclude(eq => eq.Club)
            .Include(e => e.Items)
                .ThenInclude(it => it.Inscripcion)
                    .ThenInclude(i => i.Equipo)
                        .ThenInclude(eq => eq.Categoria)
            .FirstOrDefaultAsync(e => e.Id == envioId);

        if (envio == null) return NotFound(new { message = "Envío no encontrado" });

        var bytes = BuildExcel(envio.Items.Select(i => i.Inscripcion).ToList(), envio.FechaEnvioMutua);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", BuildFileName(envio.FechaEnvioMutua));
    }

    [HttpPost("enviar")]
    public async Task<IActionResult> EnviarMutua([FromBody] MutuaEnviarRequest request)
    {
        if (request.InscripcionIds == null || request.InscripcionIds.Count == 0)
            return BadRequest(new { message = "Debe seleccionar al menos una persona" });

        var inscripciones = await _context.Inscripciones
            .Include(i => i.Persona)
            .Include(i => i.Competicion)
            .Include(i => i.Equipo).ThenInclude(e => e.Club)
            .Include(i => i.Equipo).ThenInclude(e => e.Categoria)
            .Where(i => request.InscripcionIds.Contains(i.Id))
            .ToListAsync();

        if (inscripciones.Count == 0)
            return BadRequest(new { message = "No se encontraron inscripciones para enviar" });

        // Crear envío
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? generadoPor = null;
        if (Guid.TryParse(userId, out var parsed)) generadoPor = parsed;

        var envio = new EnvioMutua
        {
            FechaEnvioMutua = DateTime.UtcNow,
            GeneradoPorUsuarioId = generadoPor
        };
        _context.EnviosMutua.Add(envio);
        await _context.SaveChangesAsync();

        // Crear items del envío (guardamos cada inscripción seleccionada)
        foreach (var ins in inscripciones)
        {
            _context.EnviosMutuaItems.Add(new EnvioMutuaItem
            {
                EnvioMutuaId = envio.Id,
                InscripcionId = ins.Id
            });
        }

        // Marcar personas como enviadas (una sola vez por persona)
        var personas = inscripciones.Select(i => i.Persona).DistinctBy(p => p.Id).ToList();
        foreach (var p in personas)
        {
            p.MutuaEnviada = true;
            p.FechaEnvioMutua = envio.FechaEnvioMutua;
            p.UltimoEnvioMutuaId = envio.Id;
        }

        await _context.SaveChangesAsync();

        var bytes = BuildExcel(inscripciones, envio.FechaEnvioMutua);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", BuildFileName(envio.FechaEnvioMutua));
    }

    private byte[] BuildExcel(List<Inscripcion> inscripciones, DateTime fechaEnvioUtc)
    {
        // Deduplicar por persona (una fila por persona)
        var filas = inscripciones
            .GroupBy(i => i.PersonaId)
            .Select(g => g.First())
            .OrderBy(i => i.Equipo.Club.Nombre)
            .ThenBy(i => i.Equipo.Nombre)
            .ThenBy(i => i.Persona.Apellidos)
            .ToList();

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("EnvioMutua");

        // Cabecera (según requisitos)
        var headers = new[]
        {
            "Nombre",
            "Apellidos",
            "Documento",
            "Fecha de Nacimiento",
            "Tipo",
            "Categoría",
            "Equipo",
            "Club",
            "Competición",
            "Fecha Solicitud",
            "Fecha Envío Mutua"
        };

        for (int c = 0; c < headers.Length; c++)
        {
            ws.Cell(1, c + 1).Value = headers[c];
            ws.Cell(1, c + 1).Style.Font.Bold = true;
            ws.Cell(1, c + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#E2E8F0");
        }

        for (int r = 0; r < filas.Count; r++)
        {
            var i = filas[r];
            ws.Cell(r + 2, 1).Value = i.Persona.Nombre;
            ws.Cell(r + 2, 2).Value = i.Persona.Apellidos;
            ws.Cell(r + 2, 3).Value = i.Persona.Documento;
            ws.Cell(r + 2, 4).Value = i.Persona.FechaNacimiento.ToString("yyyy-MM-dd");
            ws.Cell(r + 2, 5).Value = i.Persona.Tipo.ToString();
            ws.Cell(r + 2, 6).Value = i.Equipo.Categoria.Nombre;
            ws.Cell(r + 2, 7).Value = i.Equipo.Nombre;
            ws.Cell(r + 2, 8).Value = i.Equipo.Club.Nombre;
            ws.Cell(r + 2, 9).Value = i.Competicion.Nombre;
            ws.Cell(r + 2, 10).Value = i.FechaSolicitud?.ToString("yyyy-MM-dd") ?? "";
            ws.Cell(r + 2, 11).Value = fechaEnvioUtc.ToString("yyyy-MM-dd");
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}


