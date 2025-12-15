namespace AutoRef_API.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoRef_API.Database;
    using Microsoft.AspNetCore.Authorization;

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EquiposController : ControllerBase
    {
        private readonly AppDataBase _context;

        public EquiposController(AppDataBase context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetEquipos()
        {
            var equipos = await _context.Equipos.ToListAsync();
            var equiposList = new List<object>();

            foreach (var equipo in equipos)
            {
                equiposList.Add(new
                {
                    equipo.Id,
                    equipo.Nombre,
                    equipo.ClubId,
                    equipo.CategoriaId
                });
            }

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

            return Ok(new { equipo.Id, equipo.Nombre, equipo.ClubId, equipo.CategoriaId });
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
                equipo.CategoriaId
            });
        }

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

        [HttpPost]
        public async Task<ActionResult<Equipo>> PostEquipo(Equipo equipo)
        {
            _context.Equipos.Add(equipo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquipo", new { id = equipo.Id }, equipo);
        }

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
