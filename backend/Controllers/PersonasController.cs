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
public class PersonasController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public PersonasController(AppDataBase context, UserManager<Usuario> userManager)
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

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet]
    public async Task<IActionResult> GetPersonas([FromQuery] string? q)
    {
        var query = _context.Personas.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(p =>
                p.Documento.Contains(term) ||
                p.Nombre.Contains(term) ||
                p.Apellidos.Contains(term));
        }

        var personas = await query
            .OrderBy(p => p.Apellidos).ThenBy(p => p.Nombre)
            .Select(p => new
            {
                p.Id,
                p.Nombre,
                p.Apellidos,
                p.Documento,
                p.FechaNacimiento,
                p.Tipo,
                p.Email,
                p.Telefono,
                p.Direccion,
                p.CodigoPostal,
                p.Provincia,
                p.Ciudad,
                p.MutuaEnviada,
                p.FechaEnvioMutua
            })
            .ToListAsync();

        return Ok(personas);
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpGet("mis")]
    public async Task<IActionResult> GetMisPersonas()
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        var clubId = user.ClubVinculadoId.Value;

        var personaIds = await _context.Inscripciones
            .Include(i => i.Equipo)
            .Where(i => i.Activa && i.Equipo.ClubId == clubId)
            .Select(i => i.PersonaId)
            .Distinct()
            .ToListAsync();

        var personas = await _context.Personas
            .Where(p => personaIds.Contains(p.Id))
            .OrderBy(p => p.Apellidos).ThenBy(p => p.Nombre)
            .Select(p => new
            {
                p.Id,
                p.Nombre,
                p.Apellidos,
                p.Documento,
                p.FechaNacimiento,
                p.Tipo,
                p.Email,
                p.Telefono,
                p.Direccion,
                p.CodigoPostal,
                p.Provincia,
                p.Ciudad,
                p.MutuaEnviada,
                p.FechaEnvioMutua
            })
            .ToListAsync();

        return Ok(personas);
    }

    [Authorize(Roles = "Admin,Federacion,Club")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPersona(Guid id)
    {
        var persona = await _context.Personas
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.Nombre,
                p.Apellidos,
                p.Documento,
                p.FechaNacimiento,
                p.Tipo,
                p.Email,
                p.Telefono,
                p.Direccion,
                p.CodigoPostal,
                p.Provincia,
                p.Ciudad,
                p.MutuaEnviada,
                p.FechaEnvioMutua
            })
            .FirstOrDefaultAsync();

        if (persona == null) return NotFound(new { message = "Persona no encontrada" });

        // Si es Club, validamos pertenencia a través de inscripciones activas
        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();

            var clubId = user.ClubVinculadoId.Value;
            var tiene = await _context.Inscripciones
                .Include(i => i.Equipo)
                .AnyAsync(i => i.Activa && i.PersonaId == id && i.Equipo.ClubId == clubId);

            if (!tiene) return Forbid();
        }

        return Ok(persona);
    }

    [Authorize(Roles = "Admin,Federacion,Club")]
    [HttpPost]
    public async Task<IActionResult> UpsertPersona([FromBody] PersonaUpsertModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Documento))
            return BadRequest(new { message = "El documento es obligatorio" });
        if (string.IsNullOrWhiteSpace(model.Nombre) || string.IsNullOrWhiteSpace(model.Apellidos))
            return BadRequest(new { message = "Nombre y apellidos son obligatorios" });

        var documentoNorm = model.Documento.Trim();
        var persona = await _context.Personas.FirstOrDefaultAsync(p => p.Documento == documentoNorm);

        if (persona == null)
        {
            persona = new Persona
            {
                Documento = documentoNorm,
                Nombre = model.Nombre.Trim(),
                Apellidos = model.Apellidos.Trim(),
                FechaNacimiento = model.FechaNacimiento,
                Tipo = model.Tipo,
                Email = string.IsNullOrWhiteSpace(model.Email) ? null : model.Email.Trim(),
                Telefono = string.IsNullOrWhiteSpace(model.Telefono) ? null : model.Telefono.Trim(),
                Direccion = string.IsNullOrWhiteSpace(model.Direccion) ? null : model.Direccion.Trim(),
                CodigoPostal = string.IsNullOrWhiteSpace(model.CodigoPostal) ? null : model.CodigoPostal.Trim(),
                Provincia = string.IsNullOrWhiteSpace(model.Provincia) ? null : model.Provincia.Trim(),
                Ciudad = string.IsNullOrWhiteSpace(model.Ciudad) ? null : model.Ciudad.Trim(),
            };
            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Persona creada con éxito", id = persona.Id });
        }

        // Club: solo puede editar personas que tenga en su club (por inscripciones activas)
        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();

            var clubId = user.ClubVinculadoId.Value;

            var tieneAlgunaActiva = await _context.Inscripciones.AnyAsync(i => i.Activa && i.PersonaId == persona.Id);
            if (tieneAlgunaActiva)
            {
                var tieneEnSuClub = await _context.Inscripciones
                    .Include(i => i.Equipo)
                    .AnyAsync(i => i.Activa && i.PersonaId == persona.Id && i.Equipo.ClubId == clubId);
                if (!tieneEnSuClub) return Forbid();
            }
        }

        persona.Nombre = model.Nombre.Trim();
        persona.Apellidos = model.Apellidos.Trim();
        persona.FechaNacimiento = model.FechaNacimiento;
        persona.Tipo = model.Tipo;

        // Contacto: si la propiedad viene informada:
        // - "" => limpiar (null)
        // - "algo" => setear valor
        // - null/undefined (no viene) => no tocar
        if (model.Email != null) persona.Email = string.IsNullOrWhiteSpace(model.Email) ? null : model.Email.Trim();
        if (model.Telefono != null) persona.Telefono = string.IsNullOrWhiteSpace(model.Telefono) ? null : model.Telefono.Trim();
        if (model.Direccion != null) persona.Direccion = string.IsNullOrWhiteSpace(model.Direccion) ? null : model.Direccion.Trim();
        if (model.CodigoPostal != null) persona.CodigoPostal = string.IsNullOrWhiteSpace(model.CodigoPostal) ? null : model.CodigoPostal.Trim();
        if (model.Provincia != null) persona.Provincia = string.IsNullOrWhiteSpace(model.Provincia) ? null : model.Provincia.Trim();
        if (model.Ciudad != null) persona.Ciudad = string.IsNullOrWhiteSpace(model.Ciudad) ? null : model.Ciudad.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Persona actualizada con éxito", id = persona.Id });
    }
}


