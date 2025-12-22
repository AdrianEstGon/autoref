using AutoRef_API.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers;

[AllowAnonymous]
[Route("api/[controller]")]
[ApiController]
public class PublicoController : ControllerBase
{
    private readonly AppDataBase _context;

    public PublicoController(AppDataBase context)
    {
        _context = context;
    }

    [HttpGet("competiciones")]
    public async Task<IActionResult> GetCompeticiones()
    {
        var items = await _context.Competiciones
            .Where(c => c.Activa)
            .OrderBy(c => c.Nombre)
            .Select(c => new { c.Id, c.Nombre, c.EsFederada })
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("categorias")]
    public async Task<IActionResult> GetCategorias([FromQuery] Guid competicionId)
    {
        if (competicionId == Guid.Empty) return BadRequest(new { message = "competicionId requerido" });

        var items = await _context.CompeticionesCategorias
            .Include(cc => cc.Categoria)
            .Where(cc => cc.CompeticionId == competicionId && cc.Activa)
            .OrderBy(cc => cc.Categoria.Nombre)
            .Select(cc => new { cc.CategoriaId, nombre = cc.Categoria.Nombre })
            .ToListAsync();
        return Ok(items);
    }

    /// <summary>
    /// Búsqueda de partidos entre fechas y por categorías (5.9).
    /// </summary>
    [HttpGet("partidos/buscar")]
    public async Task<IActionResult> BuscarPartidos(
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] Guid? competicionId,
        [FromQuery] Guid? categoriaId)
    {
        var q = _context.Partidos
            .Include(p => p.EquipoLocal).ThenInclude(e => e!.Club)
            .Include(p => p.EquipoVisitante).ThenInclude(e => e!.Club)
            .Include(p => p.Lugar)
            .Include(p => p.Categoria)
            .Include(p => p.Competicion)
            .AsQueryable();

        if (fechaDesde.HasValue)
            q = q.Where(p => p.Fecha >= fechaDesde.Value.Date);
        if (fechaHasta.HasValue)
            q = q.Where(p => p.Fecha <= fechaHasta.Value.Date);
        if (competicionId.HasValue && competicionId.Value != Guid.Empty)
            q = q.Where(p => p.CompeticionId == competicionId.Value);
        if (categoriaId.HasValue && categoriaId.Value != Guid.Empty)
            q = q.Where(p => p.CategoriaId == categoriaId.Value);

        var partidos = await q
            .OrderBy(p => p.Fecha)
            .ThenBy(p => p.Hora)
            .Take(100) // Limitar resultados
            .Select(p => new
            {
                p.Id,
                fecha = p.Fecha.HasValue ? p.Fecha.Value.ToString("yyyy-MM-dd") : null,
                hora = p.Hora.HasValue ? p.Hora.Value.ToString(@"hh\:mm") : null,
                equipoLocal = p.EquipoLocal != null ? p.EquipoLocal.Nombre : "Sin definir",
                clubLocal = p.EquipoLocal != null && p.EquipoLocal.Club != null ? p.EquipoLocal.Club.Nombre : null,
                equipoVisitante = p.EquipoVisitante != null ? p.EquipoVisitante.Nombre : "Sin definir",
                clubVisitante = p.EquipoVisitante != null && p.EquipoVisitante.Club != null ? p.EquipoVisitante.Club.Nombre : null,
                lugar = p.Lugar != null ? p.Lugar.Nombre : null,
                categoria = p.Categoria != null ? p.Categoria.Nombre : null,
                competicion = p.Competicion != null ? p.Competicion.Nombre : null,
                p.Cerrado,
                p.ResultadoLocal,
                p.ResultadoVisitante,
                p.Jornada
            })
            .ToListAsync();

        return Ok(partidos);
    }

    [HttpGet("calendario")]
    public async Task<IActionResult> GetCalendario([FromQuery] Guid competicionId, [FromQuery] Guid categoriaId)
    {
        if (competicionId == Guid.Empty) return BadRequest(new { message = "competicionId requerido" });
        if (categoriaId == Guid.Empty) return BadRequest(new { message = "categoriaId requerido" });

        var partidos = await _context.Partidos
            .Include(p => p.EquipoLocal)
            .Include(p => p.EquipoVisitante)
            .Include(p => p.Lugar)
            .Where(p => p.CompeticionId == competicionId && p.CategoriaId == categoriaId)
            .OrderBy(p => p.Fecha)
            .Select(p => new
            {
                p.Id,
                fecha = p.Fecha.HasValue ? p.Fecha.Value.ToString("yyyy-MM-dd") : null,
                hora = p.Hora.HasValue ? p.Hora.Value.ToString(@"hh\:mm") : null,
                equipoLocal = p.EquipoLocal != null ? p.EquipoLocal.Nombre : "Sin definir",
                equipoVisitante = p.EquipoVisitante != null ? p.EquipoVisitante.Nombre : "Sin definir",
                lugar = p.Lugar != null ? p.Lugar.Nombre : null,
                p.Cerrado,
                p.ResultadoLocal,
                p.ResultadoVisitante,
                p.Jornada,
                p.NumeroPartido
            })
            .ToListAsync();

        return Ok(partidos);
    }

    [HttpGet("clasificacion")]
    public async Task<IActionResult> GetClasificacion([FromQuery] Guid competicionId, [FromQuery] Guid categoriaId)
    {
        if (competicionId == Guid.Empty) return BadRequest(new { message = "competicionId requerido" });
        if (categoriaId == Guid.Empty) return BadRequest(new { message = "categoriaId requerido" });

        var reglas = await _context.CompeticionesReglas.FirstOrDefaultAsync(r => r.CompeticionId == competicionId);
        var puntosVictoria = reglas?.PuntosVictoria ?? 3;
        var puntosEmpate = reglas?.PuntosEmpate ?? 1;
        var puntosDerrota = reglas?.PuntosDerrota ?? 0;

        var partidos = await _context.Partidos
            .Include(p => p.EquipoLocal)
            .Include(p => p.EquipoVisitante)
            .Where(p => p.CompeticionId == competicionId && p.CategoriaId == categoriaId && p.Cerrado && p.ResultadoLocal != null && p.ResultadoVisitante != null)
            .Select(p => new
            {
                p.EquipoLocalId,
                p.EquipoVisitanteId,
                local = p.EquipoLocal != null ? p.EquipoLocal.Nombre : "Sin definir",
                visitante = p.EquipoVisitante != null ? p.EquipoVisitante.Nombre : "Sin definir",
                rl = p.ResultadoLocal!.Value,
                rv = p.ResultadoVisitante!.Value
            })
            .ToListAsync();

        var table = new Dictionary<string, (string nombre, int pj, int pg, int pe, int pp, int pf, int pc, int pts)>();

        void Ensure(string key, string nombre)
        {
            if (!table.ContainsKey(key))
                table[key] = (nombre, 0, 0, 0, 0, 0, 0, 0);
        }

        foreach (var p in partidos)
        {
            var keyL = (p.EquipoLocalId ?? Guid.Empty).ToString();
            var keyV = (p.EquipoVisitanteId ?? Guid.Empty).ToString();
            Ensure(keyL, p.local);
            Ensure(keyV, p.visitante);

            var l = table[keyL];
            var v = table[keyV];

            l.pj++; v.pj++;
            l.pf += p.rl; l.pc += p.rv;
            v.pf += p.rv; v.pc += p.rl;

            if (p.rl > p.rv)
            {
                l.pg++; v.pp++;
                l.pts += puntosVictoria;
                v.pts += puntosDerrota;
            }
            else if (p.rv > p.rl)
            {
                v.pg++; l.pp++;
                v.pts += puntosVictoria;
                l.pts += puntosDerrota;
            }
            else
            {
                l.pe++; v.pe++;
                l.pts += puntosEmpate;
                v.pts += puntosEmpate;
            }

            table[keyL] = l;
            table[keyV] = v;
        }

        var result = table
            .Select(kvp => new
            {
                equipoId = kvp.Key,
                equipo = kvp.Value.nombre,
                pj = kvp.Value.pj,
                pg = kvp.Value.pg,
                pe = kvp.Value.pe,
                pp = kvp.Value.pp,
                pf = kvp.Value.pf,
                pc = kvp.Value.pc,
                dif = kvp.Value.pf - kvp.Value.pc,
                pts = kvp.Value.pts
            })
            .OrderByDescending(x => x.pts)
            .ThenByDescending(x => x.dif)
            .ThenByDescending(x => x.pf)
            .ThenBy(x => x.equipo)
            .ToList();

        return Ok(new
        {
            puntosVictoria,
            puntosEmpate,
            puntosDerrota,
            items = result
        });
    }
}


