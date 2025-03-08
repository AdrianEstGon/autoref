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
    public class PolideportivosController : ControllerBase
    {
        private readonly AppDataBase _context;

        public PolideportivosController(AppDataBase context)
        {
            _context = context;
        }

        // GET: api/Polideportivos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Polideportivo>>> GetPolideportivos()
        {
            return await _context.Polideportivos.ToListAsync();
        }

        // GET: api/Polideportivos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Polideportivo>> GetPolideportivo(Guid id)
        {
            var polideportivo = await _context.Polideportivos.FindAsync(id);

            if (polideportivo == null)
            {
                return NotFound();
            }

            return polideportivo;
        }

        // PUT: api/Polideportivos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPolideportivo(Guid id, Polideportivo polideportivo)
        {
            if (id != polideportivo.Id)
            {
                return BadRequest();
            }

            _context.Entry(polideportivo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PolideportivoExists(id))
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

        // POST: api/Polideportivos
        [HttpPost]
        public async Task<ActionResult<Polideportivo>> PostPolideportivo(Polideportivo polideportivo)
        {
            _context.Polideportivos.Add(polideportivo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPolideportivo", new { id = polideportivo.Id }, polideportivo);
        }

        // DELETE: api/Polideportivos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePolideportivo(Guid id)
        {
            var polideportivo = await _context.Polideportivos.FindAsync(id);
            if (polideportivo == null)
            {
                return NotFound();
            }

            _context.Polideportivos.Remove(polideportivo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PolideportivoExists(Guid id)
        {
            return _context.Polideportivos.Any(e => e.Id == id);
        }
    }
}

