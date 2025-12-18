using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CompeticionesController : ControllerBase
{
    private readonly AppDataBase _context;

    public CompeticionesController(AppDataBase context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCompeticiones()
    {
        var comps = await _context.Competiciones
            .OrderByDescending(c => c.Activa)
            .ThenBy(c => c.Nombre)
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.EsFederada,
                c.Activa,
                c.TemporadaId,
                c.ModalidadId
            })
            .ToListAsync();

        return Ok(comps);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> CreateCompeticion([FromBody] CompeticionCreateUpdateModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });
        if (model.TemporadaId == null || model.TemporadaId == Guid.Empty)
            return BadRequest(new { message = "TemporadaId es obligatorio" });

        var temporadaExists = await _context.Temporadas.AnyAsync(t => t.Id == model.TemporadaId.Value);
        if (!temporadaExists) return BadRequest(new { message = "Temporada no encontrada" });

        if (model.ModalidadId != null && model.ModalidadId != Guid.Empty)
        {
            var modalidadExists = await _context.Modalidades.AnyAsync(m => m.Id == model.ModalidadId.Value);
            if (!modalidadExists) return BadRequest(new { message = "Modalidad no encontrada" });
        }

        var entidad = new Competicion
        {
            FederacionId = SeedIds.FederacionAsturianaId,
            Nombre = model.Nombre.Trim(),
            EsFederada = model.EsFederada,
            Activa = model.Activa,
            TemporadaId = model.TemporadaId,
            ModalidadId = (model.ModalidadId == Guid.Empty ? null : model.ModalidadId)
        };

        _context.Competiciones.Add(entidad);
        await _context.SaveChangesAsync();

        // Reglas por defecto
        _context.CompeticionesReglas.Add(new CompeticionReglas
        {
            CompeticionId = entidad.Id,
            PuntosVictoria = 3,
            PuntosEmpate = 1,
            PuntosDerrota = 0,
            OrdenDesempateJson = JsonSerializer.Serialize(new[] { "Puntos", "Diferencia", "EnfrentamientoDirecto" }),
            UpdatedAtUtc = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Competición creada con éxito", id = entidad.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCompeticion(Guid id, [FromBody] CompeticionCreateUpdateModel model)
    {
        var entidad = await _context.Competiciones.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Competición no encontrada" });

        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });
        if (model.TemporadaId == null || model.TemporadaId == Guid.Empty)
            return BadRequest(new { message = "TemporadaId es obligatorio" });

        var temporadaExists = await _context.Temporadas.AnyAsync(t => t.Id == model.TemporadaId.Value);
        if (!temporadaExists) return BadRequest(new { message = "Temporada no encontrada" });

        if (model.ModalidadId != null && model.ModalidadId != Guid.Empty)
        {
            var modalidadExists = await _context.Modalidades.AnyAsync(m => m.Id == model.ModalidadId.Value);
            if (!modalidadExists) return BadRequest(new { message = "Modalidad no encontrada" });
        }

        entidad.Nombre = model.Nombre.Trim();
        entidad.EsFederada = model.EsFederada;
        entidad.Activa = model.Activa;
        entidad.TemporadaId = model.TemporadaId;
        entidad.ModalidadId = (model.ModalidadId == Guid.Empty ? null : model.ModalidadId);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Competición actualizada con éxito" });
    }

    // ==================== Configuración por categoría (inscripciones + cuota) ====================

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet("{id:guid}/categorias")]
    public async Task<IActionResult> GetCategoriasConfig(Guid id)
    {
        var exists = await _context.Competiciones.AnyAsync(c => c.Id == id);
        if (!exists) return NotFound(new { message = "Competición no encontrada" });

        var items = await _context.CompeticionesCategorias
            .Include(cc => cc.Categoria)
            .Where(cc => cc.CompeticionId == id)
            .OrderBy(cc => cc.Categoria.Nombre)
            .Select(cc => new
            {
                cc.CategoriaId,
                categoriaNombre = cc.Categoria.Nombre,
                cc.Activa,
                cc.InscripcionDesde,
                cc.InscripcionHasta,
                cc.Cuota
            })
            .ToListAsync();

        return Ok(items);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}/categorias")]
    public async Task<IActionResult> SetCategoriasConfig(Guid id, [FromBody] CompeticionCategoriasSetModel model)
    {
        var exists = await _context.Competiciones.AnyAsync(c => c.Id == id);
        if (!exists) return NotFound(new { message = "Competición no encontrada" });

        var desired = (model?.Items ?? new List<CompeticionCategoriaConfigDto>())
            .Where(x => x.CategoriaId != Guid.Empty)
            .GroupBy(x => x.CategoriaId)
            .Select(g => g.First())
            .ToList();

        if (desired.Count > 0)
        {
            var catIds = desired.Select(x => x.CategoriaId).ToList();
            var existingCatIds = await _context.Categorias.Where(c => catIds.Contains(c.Id)).Select(c => c.Id).ToListAsync();
            var missing = catIds.Except(existingCatIds).ToList();
            if (missing.Count > 0) return BadRequest(new { message = "Hay categorías no válidas", missing });
        }

        var current = await _context.CompeticionesCategorias.Where(cc => cc.CompeticionId == id).ToListAsync();
        var currentMap = current.ToDictionary(x => x.CategoriaId, x => x);
        var desiredIds = desired.Select(x => x.CategoriaId).ToHashSet();

        // Remove
        var toRemove = current.Where(x => !desiredIds.Contains(x.CategoriaId)).ToList();
        if (toRemove.Count > 0) _context.CompeticionesCategorias.RemoveRange(toRemove);

        // Upsert
        foreach (var item in desired)
        {
            if (!currentMap.TryGetValue(item.CategoriaId, out var entity))
            {
                entity = new CompeticionCategoria
                {
                    CompeticionId = id,
                    CategoriaId = item.CategoriaId
                };
                _context.CompeticionesCategorias.Add(entity);
            }

            entity.Activa = item.Activa;
            entity.InscripcionDesde = item.InscripcionDesde;
            entity.InscripcionHasta = item.InscripcionHasta;
            entity.Cuota = item.Cuota;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Categorías de la competición actualizadas" });
    }

    // ==================== Reglas de puntos y desempates ====================

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet("{id:guid}/reglas")]
    public async Task<IActionResult> GetReglas(Guid id)
    {
        var reglas = await _context.CompeticionesReglas.FirstOrDefaultAsync(r => r.CompeticionId == id);
        if (reglas == null)
        {
            return Ok(new CompeticionReglasDto());
        }

        List<string> orden;
        try
        {
            orden = string.IsNullOrWhiteSpace(reglas.OrdenDesempateJson)
                ? new List<string>()
                : (JsonSerializer.Deserialize<List<string>>(reglas.OrdenDesempateJson) ?? new List<string>());
        }
        catch
        {
            orden = new List<string>();
        }

        return Ok(new CompeticionReglasDto
        {
            PuntosVictoria = reglas.PuntosVictoria,
            PuntosEmpate = reglas.PuntosEmpate,
            PuntosDerrota = reglas.PuntosDerrota,
            OrdenDesempate = orden
        });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}/reglas")]
    public async Task<IActionResult> SetReglas(Guid id, [FromBody] CompeticionReglasDto model)
    {
        var exists = await _context.Competiciones.AnyAsync(c => c.Id == id);
        if (!exists) return NotFound(new { message = "Competición no encontrada" });

        if (model == null) return BadRequest(new { message = "Datos inválidos" });
        if (model.PuntosVictoria < 0 || model.PuntosEmpate < 0 || model.PuntosDerrota < 0)
            return BadRequest(new { message = "Los puntos no pueden ser negativos" });

        var reglas = await _context.CompeticionesReglas.FirstOrDefaultAsync(r => r.CompeticionId == id);
        if (reglas == null)
        {
            reglas = new CompeticionReglas { CompeticionId = id };
            _context.CompeticionesReglas.Add(reglas);
        }

        reglas.PuntosVictoria = model.PuntosVictoria;
        reglas.PuntosEmpate = model.PuntosEmpate;
        reglas.PuntosDerrota = model.PuntosDerrota;
        reglas.OrdenDesempateJson = JsonSerializer.Serialize(model.OrdenDesempate ?? new List<string>());
        reglas.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Reglas actualizadas" });
    }

    // ==================== Generación de calendario/jornadas (liga regular) ====================

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost("{id:guid}/generar-calendario")]
    public async Task<IActionResult> GenerarCalendario(Guid id, [FromBody] GenerarCalendarioRequest req)
    {
        if (req == null) return BadRequest(new { message = "Datos inválidos" });
        if (req.CategoriaId == Guid.Empty) return BadRequest(new { message = "CategoriaId es obligatorio" });
        if (req.DiasEntreJornadas <= 0 || req.DiasEntreJornadas > 60) return BadRequest(new { message = "DiasEntreJornadas inválido" });
        if (!TimeSpan.TryParse(req.Hora, out var hora)) return BadRequest(new { message = "Hora inválida (ej: 10:00)" });

        var exists = await _context.Competiciones.AnyAsync(c => c.Id == id);
        if (!exists) return NotFound(new { message = "Competición no encontrada" });

        var categoriaExists = await _context.Categorias.AnyAsync(c => c.Id == req.CategoriaId);
        if (!categoriaExists) return BadRequest(new { message = "Categoría no encontrada" });

        // Si existe config, debe estar activa
        var cfg = await _context.CompeticionesCategorias.FirstOrDefaultAsync(x => x.CompeticionId == id && x.CategoriaId == req.CategoriaId);
        if (cfg != null && !cfg.Activa) return BadRequest(new { message = "La categoría no está activa para esta competición" });

        var equipos = await _context.Equipos
            .Where(e => e.CompeticionId == id && e.CategoriaId == req.CategoriaId)
            .OrderBy(e => e.Nombre)
            .Select(e => e.Id)
            .ToListAsync();

        if (equipos.Count < 2) return BadRequest(new { message = "Se necesitan al menos 2 equipos en la competición/categoría para generar calendario" });

        // Reemplazar partidos existentes para esa competición+categoría
        var existentes = await _context.Partidos.Where(p => p.CompeticionId == id && p.CategoriaId == req.CategoriaId).ToListAsync();
        if (existentes.Count > 0) _context.Partidos.RemoveRange(existentes);

        var calendario = BuildRoundRobin(equipos, req.DobleVuelta);
        var fechaBase = req.FechaInicio.Date;

        var partidosToCreate = new List<Partido>();
        foreach (var jornada in calendario.Keys.OrderBy(x => x))
        {
            var fechaJornada = fechaBase.AddDays((jornada - 1) * req.DiasEntreJornadas);
            var num = 1;
            foreach (var (local, visitante) in calendario[jornada])
            {
                partidosToCreate.Add(new Partido
                {
                    CompeticionId = id,
                    CategoriaId = req.CategoriaId,
                    EquipoLocalId = local,
                    EquipoVisitanteId = visitante,
                    Fecha = fechaJornada.Add(hora),
                    Hora = hora,
                    Jornada = jornada,
                    NumeroPartido = num++,
                    EstadoArbitro1 = 0,
                    EstadoArbitro2 = 0,
                    EstadoAnotador = 0
                });
            }
        }

        _context.Partidos.AddRange(partidosToCreate);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Calendario generado", totalPartidos = partidosToCreate.Count, jornadas = calendario.Count });
    }

    private static Dictionary<int, List<(Guid local, Guid visitante)>> BuildRoundRobin(List<Guid> teamIds, bool doubleRound)
    {
        // Circle method. If odd, add bye.
        var teams = new List<Guid?>(teamIds.Select(x => (Guid?)x));
        if (teams.Count % 2 == 1) teams.Add(null);

        var n = teams.Count;
        var rounds = n - 1;
        var half = n / 2;

        var schedule = new Dictionary<int, List<(Guid local, Guid visitante)>>();
        var arr = new List<Guid?>(teams);

        for (int round = 1; round <= rounds; round++)
        {
            var matches = new List<(Guid local, Guid visitante)>();
            for (int i = 0; i < half; i++)
            {
                var t1 = arr[i];
                var t2 = arr[n - 1 - i];
                if (t1 == null || t2 == null) continue;

                // Alternar local/visitante para balancear
                var isEven = (round % 2 == 0);
                if (i == 0)
                {
                    matches.Add(isEven ? (t2.Value, t1.Value) : (t1.Value, t2.Value));
                }
                else
                {
                    matches.Add(isEven ? (t1.Value, t2.Value) : (t2.Value, t1.Value));
                }
            }

            schedule[round] = matches;

            // Rotate (keep first fixed)
            var fixedTeam = arr[0];
            var rest = arr.Skip(1).ToList();
            var last = rest[^1];
            rest.RemoveAt(rest.Count - 1);
            rest.Insert(0, last);
            arr = new List<Guid?> { fixedTeam };
            arr.AddRange(rest);
        }

        if (!doubleRound) return schedule;

        var secondLeg = new Dictionary<int, List<(Guid local, Guid visitante)>>();
        foreach (var kv in schedule)
        {
            secondLeg[kv.Key + rounds] = kv.Value.Select(m => (m.visitante, m.local)).ToList();
        }

        foreach (var kv in secondLeg) schedule[kv.Key] = kv.Value;
        return schedule;
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCompeticion(Guid id)
    {
        var entidad = await _context.Competiciones.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Competición no encontrada" });

        _context.Competiciones.Remove(entidad);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Competición eliminada con éxito" });
    }
}


