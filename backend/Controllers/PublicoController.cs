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
                fecha = p.Fecha.ToString("yyyy-MM-dd"),
                hora = p.Hora.ToString(@"hh\:mm"),
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


