using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoRef_API.Database;

namespace AutoRef_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisponibilidadController : ControllerBase
    {
        private readonly AppDataBase _context;

        public DisponibilidadController(AppDataBase context)
        {
            _context = context;
        }

        // GET: api/Disponibilidad
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Disponibilidad>>> GetDisponibilidades()
        {
            return await _context.Disponibilidades.ToListAsync();
        }

        // GET: api/Disponibilidad/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Disponibilidad>> GetDisponibilidad(Guid id)
        {
            var disponibilidad = await _context.Disponibilidades.FindAsync(id);

            if (disponibilidad == null)
            {
                return NotFound();
            }

            return disponibilidad;
        }

        // PUT: api/Disponibilidad/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisponibilidad(Guid id, Disponibilidad disponibilidad)
        {
            if (id != disponibilidad.Id)
            {
                return BadRequest();
            }

            _context.Entry(disponibilidad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DisponibilidadExists(id))
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

        // POST: api/Disponibilidad
        [HttpPost]
        public async Task<ActionResult<Disponibilidad>> PostDisponibilidad(Disponibilidad disponibilidad)
        {
            _context.Disponibilidades.Add(disponibilidad);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDisponibilidad", new { id = disponibilidad.Id }, disponibilidad);
        }

        // DELETE: api/Disponibilidad/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDisponibilidad(Guid id)
        {
            var disponibilidad = await _context.Disponibilidades.FindAsync(id);
            if (disponibilidad == null)
            {
                return NotFound();
            }

            _context.Disponibilidades.Remove(disponibilidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DisponibilidadExists(Guid id)
        {
            return _context.Disponibilidades.Any(e => e.Id == id);
        }
    }
}

