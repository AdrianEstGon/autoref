using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ActasPartidoController : ControllerBase
{
    private readonly AppDataBase _context;

    public ActasPartidoController(AppDataBase context)
    {
        _context = context;
    }

    private bool IsAdminLike() => User.IsInRole("Admin") || User.IsInRole("Federacion") || User.IsInRole("ComiteArbitros");

    private Guid? GetUserId()
    {
        var userIdString = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId)) return null;
        return userId;
    }

    private (int? local, int? visitante) ComputeResultado(ActaPartidoUpsertModel model)
    {
        if (model.Sets != null && model.Sets.Count > 0)
        {
            var l = 0;
            var v = 0;
            foreach (var s in model.Sets)
            {
                if (s.Local > s.Visitante) l++;
                else if (s.Visitante > s.Local) v++;
            }
            return (l, v);
        }
        return (model.ResultadoLocal, model.ResultadoVisitante);
    }

    [Authorize(Roles = "Arbitro,ComiteArbitros,Federacion,Admin")]
    [HttpGet("{partidoId:guid}")]
    public async Task<IActionResult> Get(Guid partidoId)
    {
        var partido = await _context.Partidos
            .Include(p => p.Lugar)
            .Include(p => p.Categoria)
            .Include(p => p.Competicion)
            .Include(p => p.EquipoLocal)
            .Include(p => p.EquipoVisitante)
            .Include(p => p.Acta)
            .FirstOrDefaultAsync(p => p.Id == partidoId);
        if (partido == null) return NotFound(new { message = "Partido no encontrado" });

        // Solo árbitros/asignados o admin-like
        if (!IsAdminLike())
        {
            var uid = GetUserId();
            if (uid == null) return Unauthorized();
            if (partido.Arbitro1Id != uid && partido.Arbitro2Id != uid && partido.AnotadorId != uid)
                return Forbid();
        }

        // Roster por equipo (v1: por inscripciones activas del equipo en la competición)
        var rosterLocal = new List<RosterPersonaDto>();
        var rosterVisit = new List<RosterPersonaDto>();

        if (partido.EquipoLocalId != null && partido.CompeticionId != null)
        {
            rosterLocal = await _context.Inscripciones
                .Include(i => i.Persona)
                .Where(i => i.Activa && i.EquipoId == partido.EquipoLocalId.Value && i.CompeticionId == partido.CompeticionId.Value)
                .OrderBy(i => i.Persona.Apellidos).ThenBy(i => i.Persona.Nombre)
                .Select(i => new RosterPersonaDto
                {
                    PersonaId = i.PersonaId,
                    Nombre = i.Persona.Nombre,
                    Apellidos = i.Persona.Apellidos,
                    Documento = i.Persona.Documento,
                    Tipo = i.Persona.Tipo.ToString()
                })
                .ToListAsync();
        }

        if (partido.EquipoVisitanteId != null && partido.CompeticionId != null)
        {
            rosterVisit = await _context.Inscripciones
                .Include(i => i.Persona)
                .Where(i => i.Activa && i.EquipoId == partido.EquipoVisitanteId.Value && i.CompeticionId == partido.CompeticionId.Value)
                .OrderBy(i => i.Persona.Apellidos).ThenBy(i => i.Persona.Nombre)
                .Select(i => new RosterPersonaDto
                {
                    PersonaId = i.PersonaId,
                    Nombre = i.Persona.Nombre,
                    Apellidos = i.Persona.Apellidos,
                    Documento = i.Persona.Documento,
                    Tipo = i.Persona.Tipo.ToString()
                })
                .ToListAsync();
        }

        ActaPartidoUpsertModel acta;
        try
        {
            acta = partido.Acta == null
                ? new ActaPartidoUpsertModel()
                : (JsonSerializer.Deserialize<ActaPartidoUpsertModel>(partido.Acta.DataJson) ?? new ActaPartidoUpsertModel());
        }
        catch
        {
            acta = new ActaPartidoUpsertModel();
        }

        var dto = new ActaPartidoDto
        {
            PartidoId = partido.Id,
            Cerrado = partido.Cerrado,
            FechaCierreUtc = partido.FechaCierreUtc,
            ResultadoLocal = partido.ResultadoLocal,
            ResultadoVisitante = partido.ResultadoVisitante,
            Partido = new
            {
                partido.Id,
                equipoLocal = partido.EquipoLocal?.Nombre,
                equipoVisitante = partido.EquipoVisitante?.Nombre,
                partido.EquipoLocalId,
                partido.EquipoVisitanteId,
                competicion = partido.Competicion?.Nombre,
                partido.CompeticionId,
                categoria = partido.Categoria?.Nombre,
                partido.CategoriaId,
                fecha = partido.Fecha.ToString("yyyy-MM-dd"),
                hora = partido.Hora.ToString(@"hh\:mm"),
                lugar = partido.Lugar?.Nombre,
                partido.LugarId
            },
            RosterLocal = rosterLocal,
            RosterVisitante = rosterVisit,
            Acta = acta
        };

        return Ok(dto);
    }

    [Authorize(Roles = "Arbitro,ComiteArbitros,Federacion,Admin")]
    [HttpPut("{partidoId:guid}")]
    public async Task<IActionResult> Upsert(Guid partidoId, [FromBody] ActaPartidoUpsertModel model)
    {
        var partido = await _context.Partidos
            .Include(p => p.Acta)
            .FirstOrDefaultAsync(p => p.Id == partidoId);
        if (partido == null) return NotFound(new { message = "Partido no encontrado" });

        if (partido.Cerrado && !IsAdminLike())
            return BadRequest(new { message = "El partido está cerrado. No se puede modificar el acta." });

        if (!IsAdminLike())
        {
            var uid = GetUserId();
            if (uid == null) return Unauthorized();
            if (partido.Arbitro1Id != uid && partido.Arbitro2Id != uid && partido.AnotadorId != uid)
                return Forbid();
        }

        var uidCreator = GetUserId();
        var json = JsonSerializer.Serialize(model ?? new ActaPartidoUpsertModel());

        if (partido.Acta == null)
        {
            partido.Acta = new ActaPartido
            {
                PartidoId = partido.Id,
                DataJson = json,
                CreadaPorUsuarioId = uidCreator,
                FechaActualizacionUtc = DateTime.UtcNow
            };
        }
        else
        {
            partido.Acta.DataJson = json;
            partido.Acta.FechaActualizacionUtc = DateTime.UtcNow;
        }

        // Guardar resultado provisional (sin cerrar)
        var (rl, rv) = ComputeResultado(model);
        partido.ResultadoLocal = rl;
        partido.ResultadoVisitante = rv;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Acta guardada" });
    }

    [Authorize(Roles = "Arbitro,ComiteArbitros,Federacion,Admin")]
    [HttpPost("{partidoId:guid}/cerrar")]
    public async Task<IActionResult> Cerrar(Guid partidoId, [FromBody] ActaPartidoUpsertModel model)
    {
        var partido = await _context.Partidos
            .Include(p => p.Acta)
            .FirstOrDefaultAsync(p => p.Id == partidoId);
        if (partido == null) return NotFound(new { message = "Partido no encontrado" });

        if (partido.Cerrado && !IsAdminLike())
            return BadRequest(new { message = "El partido ya está cerrado." });

        // Validaciones mínimas para cierre
        var (rl, rv) = ComputeResultado(model);
        if (rl == null || rv == null)
            return BadRequest(new { message = "Indica un resultado final (sets o marcador)." });

        // Upsert acta
        await Upsert(partidoId, model);

        // Marcar cerrado
        partido.Cerrado = true;
        partido.FechaCierreUtc = DateTime.UtcNow;
        partido.ResultadoLocal = rl;
        partido.ResultadoVisitante = rv;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Partido cerrado y acta finalizada." });
    }

    [Authorize(Roles = "Arbitro,ComiteArbitros,Federacion,Admin")]
    [HttpGet("{partidoId:guid}/informe")]
    public async Task<IActionResult> Informe(Guid partidoId)
    {
        var dtoResult = await Get(partidoId);
        if (dtoResult is not OkObjectResult ok) return dtoResult;

        var dto = (ActaPartidoDto)ok.Value!;
        var acta = dto.Acta;

        string NombrePersona(Guid id, List<RosterPersonaDto> roster) =>
            roster.FirstOrDefault(x => x.PersonaId == id) is { } p ? $"{p.Apellidos}, {p.Nombre}" : id.ToString();

        var html = $@"
<!doctype html>
<html lang=""es"">
<head>
  <meta charset=""utf-8""/>
  <meta name=""viewport"" content=""width=device-width, initial-scale=1""/>
  <title>Informe de partido</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 24px; color: #111; }}
    h1 {{ margin: 0 0 8px; }}
    .meta {{ margin-bottom: 16px; }}
    table {{ border-collapse: collapse; width: 100%; margin: 12px 0; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
    th {{ background: #f6f7f9; }}
    .cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }}
    .box {{ border: 1px solid #ddd; padding: 12px; border-radius: 8px; }}
  </style>
</head>
<body>
  <h1>Informe de partido</h1>
  <div class=""meta"">
    <div><strong>Partido:</strong> {((dynamic)dto.Partido).equipoLocal} vs {((dynamic)dto.Partido).equipoVisitante}</div>
    <div><strong>Competición:</strong> {((dynamic)dto.Partido).competicion} — <strong>Categoría:</strong> {((dynamic)dto.Partido).categoria}</div>
    <div><strong>Fecha/Hora:</strong> {((dynamic)dto.Partido).fecha} {((dynamic)dto.Partido).hora} — <strong>Lugar:</strong> {((dynamic)dto.Partido).lugar}</div>
    <div><strong>Resultado:</strong> {dto.ResultadoLocal} - {dto.ResultadoVisitante}</div>
  </div>

  <div class=""cols"">
    <div class=""box"">
      <h3>Participantes (Local)</h3>
      <ul>
        {string.Join("", acta.ParticipantesLocal.Select(x => $"<li>{System.Net.WebUtility.HtmlEncode(NombrePersona(x, dto.RosterLocal))}</li>"))}
      </ul>
    </div>
    <div class=""box"">
      <h3>Participantes (Visitante)</h3>
      <ul>
        {string.Join("", acta.ParticipantesVisitante.Select(x => $"<li>{System.Net.WebUtility.HtmlEncode(NombrePersona(x, dto.RosterVisitante))}</li>"))}
      </ul>
    </div>
  </div>

  <h3>Sets / Periodos</h3>
  <table>
    <thead><tr><th>#</th><th>Local</th><th>Visitante</th></tr></thead>
    <tbody>
      {string.Join("", acta.Sets.Select((s, idx) => $"<tr><td>{idx + 1}</td><td>{s.Local}</td><td>{s.Visitante}</td></tr>"))}
    </tbody>
  </table>

  <h3>Incidencias</h3>
  <table>
    <thead><tr><th>Tipo</th><th>Momento</th><th>Descripción</th></tr></thead>
    <tbody>
      {string.Join("", acta.Incidencias.Select(i => $"<tr><td>{System.Net.WebUtility.HtmlEncode(i.Tipo)}</td><td>{System.Net.WebUtility.HtmlEncode(i.Momento ?? "")}</td><td>{System.Net.WebUtility.HtmlEncode(i.Descripcion)}</td></tr>"))}
    </tbody>
  </table>

  <h3>Observaciones</h3>
  <div class=""box"">{System.Net.WebUtility.HtmlEncode(acta.Observaciones ?? "")}</div>

  <script>window.onload = () => window.print();</script>
</body>
</html>";

        return Content(html, "text/html");
    }
}


