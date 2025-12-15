using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoRef_API.Database;
using Microsoft.AspNetCore.Authorization;

namespace AutoRef_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDataBase _context;

        public CategoriasController(AppDataBase context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategorias()
        {
            var categorias = await _context.Categorias.ToListAsync();
            var categoriasList = new List<object>();

            foreach (var categoria in categorias)
            {
                categoriasList.Add(new
                {
                    categoria.Id,
                    categoria.Nombre,
                    categoria.PrimerArbitro,
                    categoria.SegundoArbitro,
                    categoria.Anotador,
                    categoria.MinArbitros,
                    categoria.Prioridad
                });
            }

            return Ok(categoriasList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(Guid id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return categoria;
        }

        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetCategoriaByName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("El nombre no puede estar vacío.");
            }

            var categoria = await _context.Categorias
                .Where(c => c.Nombre.ToLower() == name.ToLower())
                .FirstOrDefaultAsync();


            var result = new
            {
                categoria.Id,
                categoria.Nombre,
                categoria.MinArbitros,
                categoria.PrimerArbitro,
                categoria.SegundoArbitro,
                categoria.Anotador,
                categoria.Prioridad
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(Guid id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
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
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategoria", new { id = categoria.Id }, categoria);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(Guid id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoriaExists(Guid id)
        {
            return _context.Categorias.Any(c => c.Id == id);
        }
    }
}