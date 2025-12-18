using AutoRef_API.Database;
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
public class LicenciasController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public LicenciasController(AppDataBase context, UserManager<Usuario> userManager)
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

    [Authorize(Roles = "Admin,Federacion,Club")]
    [HttpGet("persona/{personaId:guid}")]
    public async Task<IActionResult> GetLicenciasByPersona(Guid personaId)
    {
        // Club: solo puede ver licencias de personas de su club (por inscripciones activas)
        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();

            var clubId = user.ClubVinculadoId.Value;
            var tiene = await _context.Inscripciones
                .Include(i => i.Equipo)
                .AnyAsync(i => i.Activa && i.PersonaId == personaId && i.Equipo.ClubId == clubId);
            if (!tiene) return Forbid();
        }

        var licencias = await _context.LicenciasPersonas
            .Include(l => l.Temporada)
            .Include(l => l.Modalidad)
            .Include(l => l.CategoriaBase)
            .Include(l => l.CategoriasHabilitadas).ThenInclude(x => x.Categoria)
            .Where(l => l.PersonaId == personaId)
            .OrderByDescending(l => l.Activa)
            .ThenByDescending(l => l.FechaAlta)
            .Select(l => new
            {
                l.Id,
                l.PersonaId,
                temporada = new { l.Temporada.Id, l.Temporada.Nombre, l.Temporada.Activa },
                modalidad = new { l.Modalidad.Id, l.Modalidad.Nombre, l.Modalidad.Activa },
                categoriaBase = l.CategoriaBaseId == null ? null : new { l.CategoriaBase!.Id, l.CategoriaBase!.Nombre },
                l.NumeroLicencia,
                l.Activa,
                l.FechaAlta,
                l.Observaciones,
                categoriasHabilitadas = l.CategoriasHabilitadas.Select(c => new { c.CategoriaId, c.Categoria.Nombre, c.FechaAlta })
            })
            .ToListAsync();

        return Ok(licencias);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> UpsertLicencia([FromBody] LicenciaUpsertModel model)
    {
        if (model.PersonaId == Guid.Empty) return BadRequest(new { message = "PersonaId es obligatorio" });
        if (model.TemporadaId == Guid.Empty) return BadRequest(new { message = "TemporadaId es obligatorio" });
        if (model.ModalidadId == Guid.Empty) return BadRequest(new { message = "ModalidadId es obligatorio" });

        var personaExists = await _context.Personas.AnyAsync(p => p.Id == model.PersonaId);
        if (!personaExists) return BadRequest(new { message = "Persona no encontrada" });

        var temporadaExists = await _context.Temporadas.AnyAsync(t => t.Id == model.TemporadaId);
        if (!temporadaExists) return BadRequest(new { message = "Temporada no encontrada" });

        var modalidadExists = await _context.Modalidades.AnyAsync(m => m.Id == model.ModalidadId);
        if (!modalidadExists) return BadRequest(new { message = "Modalidad no encontrada" });

        if (model.CategoriaBaseId != null)
        {
            var catExists = await _context.Categorias.AnyAsync(c => c.Id == model.CategoriaBaseId.Value);
            if (!catExists) return BadRequest(new { message = "Categoría base no encontrada" });
        }

        var licencia = await _context.LicenciasPersonas
            .FirstOrDefaultAsync(l => l.PersonaId == model.PersonaId && l.TemporadaId == model.TemporadaId && l.ModalidadId == model.ModalidadId);

        if (licencia == null)
        {
            licencia = new LicenciaPersona
            {
                PersonaId = model.PersonaId,
                TemporadaId = model.TemporadaId,
                ModalidadId = model.ModalidadId,
                CategoriaBaseId = model.CategoriaBaseId,
                NumeroLicencia = string.IsNullOrWhiteSpace(model.NumeroLicencia) ? null : model.NumeroLicencia.Trim(),
                Activa = model.Activa,
                Observaciones = string.IsNullOrWhiteSpace(model.Observaciones) ? null : model.Observaciones.Trim(),
                FechaAlta = DateTime.UtcNow
            };
            _context.LicenciasPersonas.Add(licencia);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Licencia creada con éxito", id = licencia.Id });
        }

        licencia.CategoriaBaseId = model.CategoriaBaseId;
        licencia.NumeroLicencia = string.IsNullOrWhiteSpace(model.NumeroLicencia) ? licencia.NumeroLicencia : model.NumeroLicencia.Trim();
        licencia.Activa = model.Activa;
        licencia.Observaciones = string.IsNullOrWhiteSpace(model.Observaciones) ? licencia.Observaciones : model.Observaciones.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Licencia actualizada con éxito", id = licencia.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost("{licenciaId:guid}/habilitaciones")]
    public async Task<IActionResult> SetHabilitaciones(Guid licenciaId, [FromBody] LicenciaHabilitacionesModel model)
    {
        var licencia = await _context.LicenciasPersonas
            .Include(l => l.CategoriasHabilitadas)
            .FirstOrDefaultAsync(l => l.Id == licenciaId);
        if (licencia == null) return NotFound(new { message = "Licencia no encontrada" });

        var categoriaIds = (model?.CategoriaIds ?? new List<Guid>()).Where(id => id != Guid.Empty).Distinct().ToList();

        // Validar categorías existentes
        if (categoriaIds.Count > 0)
        {
            var existentes = await _context.Categorias.Where(c => categoriaIds.Contains(c.Id)).Select(c => c.Id).ToListAsync();
            var missing = categoriaIds.Except(existentes).ToList();
            if (missing.Count > 0) return BadRequest(new { message = "Hay categorías no válidas", missing });
        }

        var actuales = licencia.CategoriasHabilitadas.Select(x => x.CategoriaId).ToHashSet();
        var deseadas = categoriaIds.ToHashSet();

        var toAdd = deseadas.Except(actuales).ToList();
        var toRemove = actuales.Except(deseadas).ToList();

        if (toRemove.Count > 0)
        {
            var removeEntities = licencia.CategoriasHabilitadas.Where(x => toRemove.Contains(x.CategoriaId)).ToList();
            _context.LicenciasCategoriasHabilitadas.RemoveRange(removeEntities);
        }

        foreach (var catId in toAdd)
        {
            _context.LicenciasCategoriasHabilitadas.Add(new LicenciaCategoriaHabilitada
            {
                LicenciaPersonaId = licencia.Id,
                CategoriaId = catId,
                FechaAlta = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Habilitaciones actualizadas con éxito" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{licenciaId:guid}/habilitaciones/{categoriaId:guid}")]
    public async Task<IActionResult> RemoveHabilitacion(Guid licenciaId, Guid categoriaId)
    {
        var entity = await _context.LicenciasCategoriasHabilitadas
            .FirstOrDefaultAsync(x => x.LicenciaPersonaId == licenciaId && x.CategoriaId == categoriaId);
        if (entity == null) return NotFound(new { message = "Habilitación no encontrada" });

        _context.LicenciasCategoriasHabilitadas.Remove(entity);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Habilitación eliminada con éxito" });
    }
}


