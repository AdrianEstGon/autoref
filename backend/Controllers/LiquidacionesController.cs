using AutoRef_API.Database;
using AutoRef_API.Enum;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class LiquidacionesController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public LiquidacionesController(AppDataBase context, UserManager<Usuario> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    private async Task<Usuario?> GetCurrentUserAsync()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return null;
        return await _userManager.FindByIdAsync(userId);
    }

    private static decimal Round2(decimal v) => Math.Round(v, 2, MidpointRounding.AwayFromZero);

    private static decimal ComputeItemImporte(LiquidacionItemModel i)
    {
        return Round2(i.Cantidad * i.PrecioUnitario);
    }

    [Authorize(Roles = "Arbitro,Admin,ComiteArbitros")]
    [HttpGet("mis")]
    public async Task<IActionResult> GetMis([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        var q = _context.Liquidaciones
            .Include(l => l.Items)
            .Include(l => l.Partido).ThenInclude(p => p.EquipoLocal)
            .Include(l => l.Partido).ThenInclude(p => p.EquipoVisitante)
            .Where(l => l.UsuarioId == user.Id);

        if (desde != null) q = q.Where(l => l.Fecha >= desde.Value.Date);
        if (hasta != null) q = q.Where(l => l.Fecha <= hasta.Value.Date);

        var list = await q
            .OrderByDescending(l => l.Fecha)
            .Select(l => new
            {
                l.Id,
                l.UsuarioId,
                tipo = l.Tipo.ToString(),
                l.PartidoId,
                partido = l.PartidoId == null ? null : new
                {
                    local = l.Partido!.EquipoLocal != null ? l.Partido!.EquipoLocal.Nombre : "Sin definir",
                    visitante = l.Partido!.EquipoVisitante != null ? l.Partido!.EquipoVisitante.Nombre : "Sin definir",
                    fecha = l.Partido!.Fecha.ToString("yyyy-MM-dd"),
                    hora = l.Partido!.Hora.ToString(@"hh\:mm")
                },
                fecha = l.Fecha.ToString("yyyy-MM-dd"),
                estado = l.Estado.ToString(),
                l.Observaciones,
                l.Total,
                l.FechaEnvioUtc,
                l.FechaResolucionUtc,
                l.MotivoRechazo,
                items = l.Items.Select(i => new
                {
                    i.Id,
                    tipo = i.Tipo.ToString(),
                    i.Descripcion,
                    i.Cantidad,
                    i.PrecioUnitario,
                    i.Km,
                    i.Importe
                })
            })
            .ToListAsync();

        return Ok(list);
    }

    [Authorize(Roles = "Arbitro,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LiquidacionUpsertModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        if (model.Fecha == default) return BadRequest(new { message = "Fecha obligatoria" });

        // Si viene partidoId, validar que el usuario está asignado
        if (model.PartidoId != null)
        {
            var partido = await _context.Partidos.FirstOrDefaultAsync(p => p.Id == model.PartidoId.Value);
            if (partido == null) return BadRequest(new { message = "Partido no encontrado" });
            if (User.IsInRole("Arbitro") && partido.Arbitro1Id != user.Id && partido.Arbitro2Id != user.Id && partido.AnotadorId != user.Id)
                return Forbid();
        }

        var items = (model.Items ?? new List<LiquidacionItemModel>())
            .Where(i => !string.IsNullOrWhiteSpace(i.Descripcion))
            .ToList();

        var entity = new Liquidacion
        {
            UsuarioId = user.Id,
            Tipo = model.Tipo,
            PartidoId = model.PartidoId,
            Fecha = model.Fecha.Date,
            Estado = EstadoLiquidacion.Borrador,
            Observaciones = string.IsNullOrWhiteSpace(model.Observaciones) ? null : model.Observaciones.Trim(),
        };

        foreach (var i in items)
        {
            var imp = ComputeItemImporte(i);
            entity.Items.Add(new LiquidacionItem
            {
                Tipo = i.Tipo,
                Descripcion = i.Descripcion.Trim(),
                Cantidad = i.Cantidad,
                PrecioUnitario = i.PrecioUnitario,
                Km = i.Km,
                Importe = imp
            });
        }

        entity.Total = Round2(entity.Items.Sum(x => x.Importe));
        _context.Liquidaciones.Add(entity);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Liquidación creada", id = entity.Id });
    }

    [Authorize(Roles = "Arbitro,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LiquidacionUpsertModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        var entity = await _context.Liquidaciones
            .Include(l => l.Items)
            .FirstOrDefaultAsync(l => l.Id == id);
        if (entity == null) return NotFound(new { message = "Liquidación no encontrada" });

        if (!User.IsInRole("Admin") && entity.UsuarioId != user.Id) return Forbid();
        if (entity.Estado != EstadoLiquidacion.Borrador) return BadRequest(new { message = "Solo se puede editar en estado Borrador" });

        entity.Tipo = model.Tipo;
        entity.PartidoId = model.PartidoId;
        entity.Fecha = model.Fecha.Date;
        entity.Observaciones = string.IsNullOrWhiteSpace(model.Observaciones) ? null : model.Observaciones.Trim();

        // Reemplazar items (v1)
        _context.LiquidacionItems.RemoveRange(entity.Items);
        entity.Items.Clear();

        var items = (model.Items ?? new List<LiquidacionItemModel>())
            .Where(i => !string.IsNullOrWhiteSpace(i.Descripcion))
            .ToList();

        foreach (var i in items)
        {
            var imp = ComputeItemImporte(i);
            entity.Items.Add(new LiquidacionItem
            {
                Tipo = i.Tipo,
                Descripcion = i.Descripcion.Trim(),
                Cantidad = i.Cantidad,
                PrecioUnitario = i.PrecioUnitario,
                Km = i.Km,
                Importe = imp
            });
        }

        entity.Total = Round2(entity.Items.Sum(x => x.Importe));
        await _context.SaveChangesAsync();
        return Ok(new { message = "Liquidación actualizada" });
    }

    [Authorize(Roles = "Arbitro,Admin")]
    [HttpPost("{id:guid}/enviar")]
    public async Task<IActionResult> Enviar(Guid id)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        var entity = await _context.Liquidaciones.Include(l => l.Items).FirstOrDefaultAsync(l => l.Id == id);
        if (entity == null) return NotFound(new { message = "Liquidación no encontrada" });
        if (!User.IsInRole("Admin") && entity.UsuarioId != user.Id) return Forbid();
        if (entity.Estado != EstadoLiquidacion.Borrador) return BadRequest(new { message = "Solo se puede enviar desde Borrador" });
        if (entity.Items.Count == 0) return BadRequest(new { message = "Añade al menos un concepto" });

        entity.Estado = EstadoLiquidacion.Enviada;
        entity.FechaEnvioUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Liquidación enviada" });
    }

    [Authorize(Roles = "ComiteArbitros,Admin")]
    [HttpGet("pendientes")]
    public async Task<IActionResult> GetPendientes()
    {
        var list = await _context.Liquidaciones
            .Include(l => l.Usuario)
            .Include(l => l.Items)
            .Where(l => l.Estado == EstadoLiquidacion.Enviada)
            .OrderByDescending(l => l.FechaEnvioUtc)
            .Select(l => new
            {
                l.Id,
                arbitro = new { l.UsuarioId, nombre = $"{l.Usuario.Nombre} {l.Usuario.PrimerApellido} {l.Usuario.SegundoApellido}".Trim(), l.Usuario.Email },
                fecha = l.Fecha.ToString("yyyy-MM-dd"),
                tipo = l.Tipo.ToString(),
                l.Total,
                l.Observaciones,
                items = l.Items.Select(i => new { tipo = i.Tipo.ToString(), i.Descripcion, i.Cantidad, i.PrecioUnitario, i.Importe })
            })
            .ToListAsync();

        return Ok(list);
    }

    public class ResolverLiquidacionModel
    {
        public bool Aprobar { get; set; }
        public string? MotivoRechazo { get; set; }
    }

    [Authorize(Roles = "ComiteArbitros,Admin")]
    [HttpPost("{id:guid}/resolver")]
    public async Task<IActionResult> Resolver(Guid id, [FromBody] ResolverLiquidacionModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        var entity = await _context.Liquidaciones.FirstOrDefaultAsync(l => l.Id == id);
        if (entity == null) return NotFound(new { message = "Liquidación no encontrada" });
        if (entity.Estado != EstadoLiquidacion.Enviada) return BadRequest(new { message = "Solo se pueden resolver liquidaciones enviadas" });

        if (model.Aprobar)
        {
            entity.Estado = EstadoLiquidacion.Aprobada;
            entity.MotivoRechazo = null;
        }
        else
        {
            if (string.IsNullOrWhiteSpace(model.MotivoRechazo))
                return BadRequest(new { message = "MotivoRechazo obligatorio al rechazar" });
            entity.Estado = EstadoLiquidacion.Rechazada;
            entity.MotivoRechazo = model.MotivoRechazo.Trim();
        }

        entity.FechaResolucionUtc = DateTime.UtcNow;
        entity.ResueltaPorUsuarioId = user.Id;
        await _context.SaveChangesAsync();
        return Ok(new { message = model.Aprobar ? "Aprobada" : "Rechazada" });
    }
}


