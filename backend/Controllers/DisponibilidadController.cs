using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoRef_API.Database;
using Microsoft.AspNetCore.Authorization;
using AutoRef_API.Models;

namespace AutoRef_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DisponibilidadController : ControllerBase
    {
        private readonly AppDataBase _context;

        public DisponibilidadController(AppDataBase context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetDisponibilidades()
        {
            var disponibilidades = await _context.Disponibilidades
                .Include(d => d.Usuario)
                .ToListAsync();

            var disponibilidadList = disponibilidades.Select(d => new
            {
                d.Id,
                d.UsuarioId,
                d.Fecha,
                d.Franja1,
                d.Franja2,
                d.Franja3,
                d.Franja4,
                d.Comentarios
            }).ToList();

            return Ok(disponibilidadList);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDisponibilidad(Guid id)
        {
            var disponibilidad = await _context.Disponibilidades
                .Include(d => d.Usuario)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (disponibilidad == null)
            {
                return Ok(new { disponibilidad, message = "Disponibilidad no encontrada." });
            }

            var result = new
            {
                disponibilidad.Id,
                disponibilidad.UsuarioId,
                disponibilidad.Fecha,
                disponibilidad.Franja1,
                disponibilidad.Franja2,
                disponibilidad.Franja3,
                disponibilidad.Franja4,
                disponibilidad.Comentarios
            };

            return Ok(result);
        }

        [HttpGet("{usuarioId}/{fecha}")]
        public async Task<IActionResult> GetDisponibilidadByUserAndDate(Guid usuarioId, DateTime fecha)
        {
            var disponibilidad = await _context.Disponibilidades
                .FirstOrDefaultAsync(d => d.UsuarioId == usuarioId && d.Fecha.Date == fecha.Date);

            if (disponibilidad == null)
            {
                return Ok(new { disponibilidad, message = "No hay disponibilidad registrada para este usuario y fecha." });
            }

            return Ok(disponibilidad);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostDisponibilidad([FromBody] DisponibilidadModel disponibilidadModel)
        {
            if (disponibilidadModel == null)
            {
                return BadRequest(new { message = "Datos de disponibilidad inválidos." });
            }

            var disponibilidad = new Disponibilidad
            {
                UsuarioId = disponibilidadModel.UsuarioId,
                Fecha = disponibilidadModel.Fecha,
                Franja1 = disponibilidadModel.Franja1,
                Franja2 = disponibilidadModel.Franja2,
                Franja3 = disponibilidadModel.Franja3,
                Franja4 = disponibilidadModel.Franja4,
                Comentarios = disponibilidadModel.Comentarios
            };

            _context.Disponibilidades.Add(disponibilidad);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Disponibilidad creada con éxito.", disponibilidad });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisponibilidad(Guid id, [FromBody] DisponibilidadModel disponibilidadModel)
        {
            if (disponibilidadModel == null)
            {
                return BadRequest(new { message = "Datos de disponibilidad inválidos o ID incorrecto." });
            }

            var disponibilidadExistente = await _context.Disponibilidades.FindAsync(id);
            if (disponibilidadExistente == null)
            {
                return NotFound(new { message = "Disponibilidad no encontrada." });
            }

            disponibilidadExistente.Fecha = disponibilidadModel.Fecha;
            disponibilidadExistente.Franja1 = disponibilidadModel.Franja1;
            disponibilidadExistente.Franja2 = disponibilidadModel.Franja2;
            disponibilidadExistente.Franja3 = disponibilidadModel.Franja3;
            disponibilidadExistente.Franja4 = disponibilidadModel.Franja4;
            disponibilidadExistente.Comentarios = disponibilidadModel.Comentarios;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Disponibilidad actualizada con éxito.", disponibilidadExistente });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { message = "Error al actualizar la disponibilidad." });
            }
        }

    }
}
