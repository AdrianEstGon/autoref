namespace AutoRef_API.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoRef_API.Database;
    using AutoRef_API.Enum;
    using AutoRef_API.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using System.Security.Claims;

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EquiposController : ControllerBase
    {
        private readonly AppDataBase _context;
        private readonly UserManager<Usuario> _userManager;

        public EquiposController(AppDataBase context, UserManager<Usuario> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpGet]
        public async Task<IActionResult> GetEquipos([FromQuery] Guid? competicionId, [FromQuery] Guid? clubId, [FromQuery] Guid? categoriaId)
        {
            var query = _context.Equipos.AsQueryable();
            if (competicionId.HasValue) query = query.Where(e => e.CompeticionId == competicionId.Value);
            if (clubId.HasValue) query = query.Where(e => e.ClubId == clubId.Value);
            if (categoriaId.HasValue) query = query.Where(e => e.CategoriaId == categoriaId.Value);

            var equipos = await query
                .OrderBy(e => e.Nombre)
                .Select(e => new
                {
                    e.Id,
                    e.Nombre,
                    e.ClubId,
                    e.CompeticionId,
                    e.CategoriaId
                })
                .ToListAsync();

            return Ok(equipos);
        }

        [Authorize(Roles = "Club,Admin,Federacion")]
        [HttpGet("mis")]
        public async Task<IActionResult> GetMisEquipos([FromQuery] Guid? competicionId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();
            if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

            var query = _context.Equipos.Where(e => e.ClubId == user.ClubVinculadoId);
            if (competicionId.HasValue) query = query.Where(e => e.CompeticionId == competicionId.Value);

            var equipos = await query
                .OrderBy(e => e.Nombre)
                .Select(e => new
                {
                    e.Id,
                    e.Nombre,
                    e.ClubId,
                    e.CompeticionId,
                    e.CategoriaId
                }).ToListAsync();

            return Ok(equipos);
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpGet("club/{clubId:guid}")]
        public async Task<IActionResult> GetEquiposByClub(Guid clubId)
        {
            var equipos = await _context.Equipos
                .Where(e => e.ClubId == clubId)
                .ToListAsync();

            var equiposList = equipos.Select(e => new
            {
                e.Id,
                e.Nombre,
                e.ClubId,
                e.CompeticionId,
                e.CategoriaId
            }).ToList();

            return Ok(equiposList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipo>> GetEquipo(Guid id)
        {
            var equipo = await _context.Equipos.FindAsync(id);

            if (equipo == null)
            {
                return NotFound();
            }

            return equipo;
        }

        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetEquipoByName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("El nombre no puede estar vacío.");
            }

            var equipo = await _context.Equipos
                .Where(e => e.Nombre.ToLower() == name.ToLower())
                .FirstOrDefaultAsync();

            if (equipo == null)
            {
                return Ok(new { }); // Devuelve un objeto JSON vacío
            }

            return Ok(new { equipo.Id, equipo.Nombre, equipo.ClubId, equipo.CompeticionId, equipo.CategoriaId });
        }



        [HttpGet("categoria/{categoriaId}")]
        public async Task<IActionResult> GetEquiposByCategoria(Guid categoriaId)
        {
            var equipos = await _context.Equipos
                .Where(e => e.CategoriaId == categoriaId)
                .ToListAsync();

            var equiposList = equipos.Select(e => new
            {
                e.Id,
                e.Nombre,
                e.ClubId,
                e.CompeticionId,
                e.CategoriaId
            }).ToList();

            return Ok(equiposList); 
        }

        [HttpGet("name/{name}/categoria/{categoria}")]
        public async Task<IActionResult> GetEquipoByNameAndCategoria(string name, string categoria)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(categoria))
            {
                return BadRequest("El nombre y la categoría no pueden estar vacíos.");
            }

            var equipo = await _context.Equipos
                .Include(e => e.Categoria) 
                .Where(e => e.Nombre.ToLower() == name.ToLower() && e.Categoria.Nombre.ToLower() == categoria.ToLower())
                .FirstOrDefaultAsync();

            if (equipo == null)
            {
                return Ok(new { });
            }

            return Ok(new
            {
                equipo.Id,
                equipo.Nombre,
                equipo.ClubId,
                equipo.CompeticionId,
                equipo.CategoriaId
            });
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipo(Guid id, Equipo equipo)
        {
            if (id != equipo.Id)
            {
                return BadRequest();
            }

            _context.Entry(equipo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpPost]
        public async Task<IActionResult> PostEquipo([FromBody] EquipoUpsertModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Nombre))
                return BadRequest(new { message = "El nombre es obligatorio" });
            if (model.ClubId == Guid.Empty) return BadRequest(new { message = "ClubId es obligatorio" });
            if (model.CompeticionId == Guid.Empty) return BadRequest(new { message = "CompeticionId es obligatorio" });
            if (model.CategoriaId == Guid.Empty) return BadRequest(new { message = "CategoriaId es obligatorio" });

            var clubExists = await _context.Clubs.AnyAsync(c => c.Id == model.ClubId);
            if (!clubExists) return BadRequest(new { message = "Club no encontrado" });
            var compExists = await _context.Competiciones.AnyAsync(c => c.Id == model.CompeticionId);
            if (!compExists) return BadRequest(new { message = "Competición no encontrada" });
            var catExists = await _context.Categorias.AnyAsync(c => c.Id == model.CategoriaId);
            if (!catExists) return BadRequest(new { message = "Categoría no encontrada" });

            var entidad = new Equipo
            {
                Nombre = model.Nombre.Trim(),
                ClubId = model.ClubId,
                CompeticionId = model.CompeticionId,
                CategoriaId = model.CategoriaId
            };

            _context.Equipos.Add(entidad);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Equipo creado con éxito", id = entidad.Id });
        }

        [Authorize(Roles = "Club,Admin,Federacion")]
        [HttpGet("{equipoId:guid}/cupos")]
        public async Task<IActionResult> GetCuposEquipo(Guid equipoId, [FromQuery] Guid competicionId)
        {
            if (competicionId == Guid.Empty) return BadRequest(new { message = "competicionId es obligatorio" });

            var equipo = await _context.Equipos.Include(e => e.Categoria).FirstOrDefaultAsync(e => e.Id == equipoId);
            if (equipo == null) return NotFound(new { message = "Equipo no encontrado" });

            // Club: solo puede consultar cupos de sus equipos
            if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();
                var user = await _userManager.FindByIdAsync(userId);
                if (user?.ClubVinculadoId == null) return Forbid();
                if (equipo.ClubId != user.ClubVinculadoId) return Forbid();
            }

            var jugadores = await _context.Inscripciones
                .Include(i => i.Persona)
                .Where(i => i.Activa && i.EquipoId == equipoId && i.CompeticionId == competicionId && i.Persona.Tipo == TipoPersona.Jugador)
                .CountAsync();

            var staff = await _context.Inscripciones
                .Include(i => i.Persona)
                .Where(i => i.Activa && i.EquipoId == equipoId && i.CompeticionId == competicionId && i.Persona.Tipo != TipoPersona.Jugador)
                .CountAsync();

            return Ok(new
            {
                equipoId,
                competicionId,
                minJugadores = equipo.Categoria?.MinJugadores,
                maxJugadores = equipo.Categoria?.MaxJugadores,
                jugadores,
                staff
            });
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipo(Guid id)
        {
            var equipo = await _context.Equipos.FindAsync(id);
            if (equipo == null)
            {
                return NotFound();
            }

            _context.Equipos.Remove(equipo);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool EquipoExists(Guid id)
        {
            return _context.Equipos.Any(e => e.Id == id);
        }
    }
}
