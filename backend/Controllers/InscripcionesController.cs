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
public class InscripcionesController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public InscripcionesController(AppDataBase context, UserManager<Usuario> userManager)
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

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpGet("mis")]
    public async Task<IActionResult> GetMisInscripciones()
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        var clubId = user.ClubVinculadoId.Value;

        var ins = await _context.Inscripciones
            .Include(i => i.Persona)
            .Include(i => i.Competicion)
            .Include(i => i.Equipo).ThenInclude(e => e.Club)
            .Include(i => i.Equipo).ThenInclude(e => e.Categoria)
            .Where(i => i.Activa && i.Equipo.ClubId == clubId)
            .OrderByDescending(i => i.FechaInscripcion)
            .Select(i => new
            {
                i.Id,
                persona = new
                {
                    i.Persona.Id,
                    i.Persona.Nombre,
                    i.Persona.Apellidos,
                    i.Persona.Documento,
                    i.Persona.FechaNacimiento,
                    i.Persona.Tipo,
                    i.Persona.Email,
                    i.Persona.Telefono,
                    i.Persona.Direccion,
                    i.Persona.CodigoPostal,
                    i.Persona.Provincia,
                    i.Persona.Ciudad,
                    i.Persona.MutuaEnviada,
                    i.Persona.FechaEnvioMutua
                },
                i.MutuaSolicitada,
                i.FechaSolicitud,
                i.FechaInscripcion,
                equipo = new
                {
                    i.Equipo.Id,
                    i.Equipo.Nombre,
                    club = i.Equipo.Club.Nombre,
                    categoria = i.Equipo.Categoria.Nombre
                },
                competicion = new
                {
                    i.Competicion.Id,
                    i.Competicion.Nombre,
                    i.Competicion.EsFederada
                }
            })
            .ToListAsync();

        return Ok(ins);
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> CreateInscripcion([FromBody] InscripcionCreateModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        if (string.IsNullOrWhiteSpace(model.Documento))
            return BadRequest(new { message = "El documento es obligatorio" });
        if (string.IsNullOrWhiteSpace(model.Nombre) || string.IsNullOrWhiteSpace(model.Apellidos))
            return BadRequest(new { message = "Nombre y apellidos son obligatorios" });

        var equipo = await _context.Equipos.Include(e => e.Club).FirstOrDefaultAsync(e => e.Id == model.EquipoId);
        if (equipo == null) return BadRequest(new { message = "Equipo no encontrado" });
        if (equipo.ClubId != user.ClubVinculadoId) return Forbid();

        var competicion = await _context.Competiciones.FindAsync(model.CompeticionId);
        if (competicion == null) return BadRequest(new { message = "Competición no encontrada" });

        // Si el equipo está asociado a una competición concreta, debe coincidir
        if (equipo.CompeticionId != null && equipo.CompeticionId.Value != model.CompeticionId)
            return BadRequest(new { message = "El equipo no pertenece a la competición seleccionada" });

        var documentoNorm = model.Documento.Trim();
        var persona = await _context.Personas.FirstOrDefaultAsync(p => p.Documento == documentoNorm);
        if (persona == null)
        {
            persona = new Persona
            {
                Nombre = model.Nombre.Trim(),
                Apellidos = model.Apellidos.Trim(),
                Documento = documentoNorm,
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
        }
        else
        {
            // Actualizar datos básicos si vinieron diferentes (sin ser destructivo)
            persona.Nombre = string.IsNullOrWhiteSpace(model.Nombre) ? persona.Nombre : model.Nombre.Trim();
            persona.Apellidos = string.IsNullOrWhiteSpace(model.Apellidos) ? persona.Apellidos : model.Apellidos.Trim();
            persona.FechaNacimiento = model.FechaNacimiento == default ? persona.FechaNacimiento : model.FechaNacimiento;
            persona.Tipo = model.Tipo;

            // Contacto (solo si viene informado)
            if (!string.IsNullOrWhiteSpace(model.Email)) persona.Email = model.Email.Trim();
            if (!string.IsNullOrWhiteSpace(model.Telefono)) persona.Telefono = model.Telefono.Trim();
            if (!string.IsNullOrWhiteSpace(model.Direccion)) persona.Direccion = model.Direccion.Trim();
            if (!string.IsNullOrWhiteSpace(model.CodigoPostal)) persona.CodigoPostal = model.CodigoPostal.Trim();
            if (!string.IsNullOrWhiteSpace(model.Provincia)) persona.Provincia = model.Provincia.Trim();
            if (!string.IsNullOrWhiteSpace(model.Ciudad)) persona.Ciudad = model.Ciudad.Trim();
        }

        // Control de max jugadores por categoría (solo Jugadores)
        if (persona.Tipo == AutoRef_API.Enum.TipoPersona.Jugador && equipo.CategoriaId != null)
        {
            var categoria = await _context.Categorias.FindAsync(equipo.CategoriaId.Value);
            if (categoria?.MaxJugadores != null && categoria.MaxJugadores.Value > 0)
            {
                var countJugadores = await _context.Inscripciones
                    .Include(i => i.Persona)
                    .Where(i =>
                        i.Activa &&
                        i.EquipoId == model.EquipoId &&
                        i.CompeticionId == model.CompeticionId &&
                        i.Persona.Tipo == AutoRef_API.Enum.TipoPersona.Jugador)
                    .CountAsync();

                if (countJugadores >= categoria.MaxJugadores.Value)
                    return BadRequest(new { message = $"El equipo ya tiene el máximo de jugadores ({categoria.MaxJugadores.Value})." });
            }
        }

        // Si ya está enviada a mutua globalmente, el club no puede gestionar la solicitud
        var mutuaSolicitada = persona.MutuaEnviada ? false : model.MutuaSolicitada;
        var fechaSolicitud = (mutuaSolicitada ? DateTime.UtcNow : (DateTime?)null);

        var inscripcion = new Inscripcion
        {
            PersonaId = persona.Id,
            EquipoId = model.EquipoId,
            CompeticionId = model.CompeticionId,
            MutuaSolicitada = mutuaSolicitada,
            FechaSolicitud = fechaSolicitud,
            Activa = true,
            FechaInscripcion = DateTime.UtcNow
        };

        _context.Inscripciones.Add(inscripcion);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Esta persona ya está inscrita en ese equipo y competición" });
        }

        return Ok(new { message = "Inscripción creada con éxito", id = inscripcion.Id });
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateInscripcion(Guid id, [FromBody] InscripcionUpdateModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();
        if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

        var inscripcion = await _context.Inscripciones
            .Include(i => i.Persona)
            .Include(i => i.Equipo)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (inscripcion == null) return NotFound(new { message = "Inscripción no encontrada" });
        if (inscripcion.Equipo.ClubId != user.ClubVinculadoId) return Forbid();

        if (inscripcion.Persona.MutuaEnviada)
        {
            return BadRequest(new { message = "No se puede modificar Mutua Sí/No cuando la persona ya está enviada a la mutua" });
        }

        inscripcion.MutuaSolicitada = model.MutuaSolicitada;
        inscripcion.FechaSolicitud = model.MutuaSolicitada ? (inscripcion.FechaSolicitud ?? DateTime.UtcNow) : null;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Inscripción actualizada con éxito" });
    }
}


