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
public class CambiosPartidoController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public CambiosPartidoController(AppDataBase context, UserManager<Usuario> userManager)
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

    private async Task NotifyClubAsync(Guid clubId, string mensaje, DateTime fecha)
    {
        var users = await _context.Users.Where(u => u.ClubVinculadoId == clubId).Select(u => u.Id).ToListAsync();
        foreach (var uid in users)
        {
            _context.Notificaciones.Add(new Notificacion
            {
                UsuarioId = uid,
                Mensaje = mensaje,
                Fecha = fecha,
                Leida = false
            });
        }
    }

    private void NotifyUser(Guid userId, string mensaje, DateTime fecha)
    {
        _context.Notificaciones.Add(new Notificacion
        {
            UsuarioId = userId,
            Mensaje = mensaje,
            Fecha = fecha,
            Leida = false
        });
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpGet("partido/{partidoId:guid}")]
    public async Task<IActionResult> GetCambiosByPartido(Guid partidoId)
    {
        var partido = await _context.Partidos
            .Include(p => p.EquipoLocal).ThenInclude(e => e.Club)
            .Include(p => p.EquipoVisitante).ThenInclude(e => e.Club)
            .FirstOrDefaultAsync(p => p.Id == partidoId);
        if (partido == null) return NotFound(new { message = "Partido no encontrado" });

        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();
            var clubId = user.ClubVinculadoId.Value;
            var localClub = partido.EquipoLocal?.ClubId;
            var visitClub = partido.EquipoVisitante?.ClubId;
            if (localClub != clubId && visitClub != clubId) return Forbid();
        }

        var cambios = await _context.PartidosCambiosSolicitudes
            .Include(c => c.LugarOriginal)
            .Include(c => c.LugarPropuesto)
            .Where(c => c.PartidoId == partidoId)
            .OrderByDescending(c => c.FechaSolicitudUtc)
            .Select(c => new
            {
                c.Id,
                c.PartidoId,
                c.ClubSolicitanteId,
                c.ClubReceptorId,
                c.FechaSolicitudUtc,
                c.Estado,
                c.AceptadoPorClub,
                c.AprobadoPorFederacion,
                c.FechaRespuestaClubUtc,
                c.FechaValidacionFederacionUtc,
                c.Motivo,
                fechaOriginal = c.FechaOriginal.ToString("yyyy-MM-dd"),
                horaOriginal = c.HoraOriginal.ToString(@"hh\:mm"),
                lugarOriginal = c.LugarOriginal == null ? null : new { c.LugarOriginal.Id, c.LugarOriginal.Nombre },
                fechaPropuesta = c.FechaPropuesta.ToString("yyyy-MM-dd"),
                horaPropuesta = c.HoraPropuesta.ToString(@"hh\:mm"),
                lugarPropuesto = c.LugarPropuesto == null ? null : new { c.LugarPropuesto.Id, c.LugarPropuesto.Nombre },
            })
            .ToListAsync();

        return Ok(cambios);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet("pendientes-validacion")]
    public async Task<IActionResult> GetPendientesValidacion()
    {
        var cambios = await _context.PartidosCambiosSolicitudes
            .Include(c => c.Partido).ThenInclude(p => p.EquipoLocal).ThenInclude(e => e.Club)
            .Include(c => c.Partido).ThenInclude(p => p.EquipoVisitante).ThenInclude(e => e.Club)
            .Include(c => c.LugarPropuesto)
            .Where(c => c.Estado == EstadoCambioPartido.AceptadoPorClub)
            .OrderBy(c => c.FechaSolicitudUtc)
            .Select(c => new
            {
                c.Id,
                c.PartidoId,
                local = c.Partido.EquipoLocal.Nombre,
                visitante = c.Partido.EquipoVisitante.Nombre,
                clubLocal = c.Partido.EquipoLocal.Club.Nombre,
                clubVisitante = c.Partido.EquipoVisitante.Club.Nombre,
                fechaPropuesta = c.FechaPropuesta.ToString("yyyy-MM-dd"),
                horaPropuesta = c.HoraPropuesta.ToString(@"hh\:mm"),
                lugarPropuesto = c.LugarPropuesto == null ? null : c.LugarPropuesto.Nombre,
                c.Motivo,
                c.FechaSolicitudUtc
            })
            .ToListAsync();

        return Ok(cambios);
    }

    [Authorize(Roles = "Club")]
    [HttpPost("partido/{partidoId:guid}")]
    public async Task<IActionResult> CrearCambio(Guid partidoId, [FromBody] CrearCambioPartidoModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        var partido = await _context.Partidos
            .Include(p => p.EquipoLocal).ThenInclude(e => e.Club)
            .Include(p => p.EquipoVisitante).ThenInclude(e => e.Club)
            .Include(p => p.Lugar)
            .FirstOrDefaultAsync(p => p.Id == partidoId);
        if (partido == null) return NotFound(new { message = "Partido no encontrado" });

        var clubId = user.ClubVinculadoId.Value;
        var localClubId = partido.EquipoLocal?.ClubId;
        var visitClubId = partido.EquipoVisitante?.ClubId;
        if (localClubId == null || visitClubId == null) return BadRequest(new { message = "El partido no tiene equipos/clubes configurados" });
        if (clubId != localClubId && clubId != visitClubId) return Forbid();

        if (!TimeSpan.TryParse(model.HoraPropuesta, out var hora)) return BadRequest(new { message = "Hora inválida (ej: 10:00)" });

        var fechaPropuesta = model.FechaPropuesta.Date;
        var horaPropuesta = hora;

        var clubReceptorId = clubId == localClubId ? visitClubId.Value : localClubId.Value;

        var cambio = new PartidoCambioSolicitud
        {
            PartidoId = partido.Id,
            ClubSolicitanteId = clubId,
            ClubReceptorId = clubReceptorId,
            FechaOriginal = partido.Fecha.Date,
            HoraOriginal = partido.Hora,
            LugarOriginalId = partido.LugarId,
            FechaPropuesta = fechaPropuesta,
            HoraPropuesta = horaPropuesta,
            LugarPropuestoId = model.LugarPropuestoId,
            Motivo = string.IsNullOrWhiteSpace(model.Motivo) ? null : model.Motivo.Trim(),
            Estado = EstadoCambioPartido.PendienteRespuestaClub,
            FechaSolicitudUtc = DateTime.UtcNow
        };

        _context.PartidosCambiosSolicitudes.Add(cambio);

        // Notificar al otro club de que hay una solicitud pendiente
        await NotifyClubAsync(clubReceptorId, $"Solicitud de cambio de partido pendiente ({partido.EquipoLocal.Nombre} vs {partido.EquipoVisitante.Nombre}).", DateTime.UtcNow);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Solicitud creada", id = cambio.Id });
    }

    [Authorize(Roles = "Club")]
    [HttpPost("{cambioId:guid}/respuesta-club")]
    public async Task<IActionResult> ResponderClub(Guid cambioId, [FromBody] ResponderCambioClubModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        var cambio = await _context.PartidosCambiosSolicitudes
            .Include(c => c.Partido).ThenInclude(p => p.EquipoLocal).ThenInclude(e => e.Club)
            .Include(c => c.Partido).ThenInclude(p => p.EquipoVisitante).ThenInclude(e => e.Club)
            .FirstOrDefaultAsync(c => c.Id == cambioId);
        if (cambio == null) return NotFound(new { message = "Solicitud no encontrada" });

        if (cambio.Estado != EstadoCambioPartido.PendienteRespuestaClub)
            return BadRequest(new { message = "La solicitud ya no está pendiente de respuesta" });

        var clubId = user.ClubVinculadoId.Value;
        if (cambio.ClubReceptorId != clubId) return Forbid();

        cambio.FechaRespuestaClubUtc = DateTime.UtcNow;
        cambio.AceptadoPorClub = model.Aceptar;
        cambio.Estado = model.Aceptar ? EstadoCambioPartido.AceptadoPorClub : EstadoCambioPartido.RechazadoPorClub;

        // Notificar al solicitante
        await NotifyClubAsync(cambio.ClubSolicitanteId,
            model.Aceptar
                ? $"Solicitud de cambio aceptada por el otro club ({cambio.Partido.EquipoLocal.Nombre} vs {cambio.Partido.EquipoVisitante.Nombre}). Pendiente de validación por Federación."
                : $"Solicitud de cambio rechazada por el otro club ({cambio.Partido.EquipoLocal.Nombre} vs {cambio.Partido.EquipoVisitante.Nombre}).",
            DateTime.UtcNow);

        await _context.SaveChangesAsync();
        return Ok(new { message = model.Aceptar ? "Aceptada" : "Rechazada" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost("{cambioId:guid}/validacion")]
    public async Task<IActionResult> ValidarFederacion(Guid cambioId, [FromBody] ValidarCambioFederacionModel model)
    {
        var cambio = await _context.PartidosCambiosSolicitudes
            .Include(c => c.Partido).ThenInclude(p => p.EquipoLocal).ThenInclude(e => e.Club)
            .Include(c => c.Partido).ThenInclude(p => p.EquipoVisitante).ThenInclude(e => e.Club)
            .Include(c => c.Partido).ThenInclude(p => p.Lugar)
            .Include(c => c.LugarPropuesto)
            .FirstOrDefaultAsync(c => c.Id == cambioId);
        if (cambio == null) return NotFound(new { message = "Solicitud no encontrada" });

        if (cambio.Estado != EstadoCambioPartido.AceptadoPorClub)
            return BadRequest(new { message = "La solicitud no está pendiente de validación" });

        cambio.FechaValidacionFederacionUtc = DateTime.UtcNow;
        cambio.AprobadoPorFederacion = model.Aprobar;
        cambio.Estado = model.Aprobar ? EstadoCambioPartido.ValidadoPorFederacion : EstadoCambioPartido.RechazadoPorFederacion;

        if (model.Aprobar)
        {
            // Aplicar cambio al partido
            var hora = cambio.HoraPropuesta;
            cambio.Partido.Hora = hora;
            cambio.Partido.Fecha = cambio.FechaPropuesta.Date.Add(hora);
            cambio.Partido.LugarId = cambio.LugarPropuestoId;

            var msg = $"Cambio confirmado: {cambio.Partido.EquipoLocal.Nombre} vs {cambio.Partido.EquipoVisitante.Nombre} — {cambio.Partido.Fecha:yyyy-MM-dd} {cambio.Partido.Hora} — {cambio.LugarPropuesto?.Nombre ?? "Sin lugar"}.";
            await NotifyClubAsync(cambio.Partido.EquipoLocal.ClubId!.Value, msg, DateTime.UtcNow);
            await NotifyClubAsync(cambio.Partido.EquipoVisitante.ClubId!.Value, msg, DateTime.UtcNow);

            // Notificar árbitros/anotador asignados
            if (cambio.Partido.Arbitro1Id != null) NotifyUser(cambio.Partido.Arbitro1Id.Value, msg, DateTime.UtcNow);
            if (cambio.Partido.Arbitro2Id != null) NotifyUser(cambio.Partido.Arbitro2Id.Value, msg, DateTime.UtcNow);
            if (cambio.Partido.AnotadorId != null) NotifyUser(cambio.Partido.AnotadorId.Value, msg, DateTime.UtcNow);
        }
        else
        {
            var msg = $"Federación rechazó el cambio solicitado ({cambio.Partido.EquipoLocal.Nombre} vs {cambio.Partido.EquipoVisitante.Nombre}).";
            await NotifyClubAsync(cambio.ClubSolicitanteId, msg, DateTime.UtcNow);
            await NotifyClubAsync(cambio.ClubReceptorId, msg, DateTime.UtcNow);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = model.Aprobar ? "Validado y aplicado" : "Rechazado" });
    }
}


