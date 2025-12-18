using AutoRef_API.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TemporadasController : ControllerBase
{
    private readonly AppDataBase _context;

    public TemporadasController(AppDataBase context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTemporadas()
    {
        var temporadas = await _context.Temporadas
            .OrderByDescending(t => t.Activa)
            .ThenByDescending(t => t.FechaInicio)
            .Select(t => new
            {
                t.Id,
                t.Nombre,
                t.FechaInicio,
                t.FechaFin,
                t.Activa
            })
            .ToListAsync();

        return Ok(temporadas);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> CreateTemporada([FromBody] Temporada model)
    {
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        var entidad = new Temporada
        {
            Nombre = model.Nombre.Trim(),
            FechaInicio = model.FechaInicio,
            FechaFin = model.FechaFin,
            Activa = model.Activa
        };

        _context.Temporadas.Add(entidad);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Temporada creada con éxito", id = entidad.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTemporada(Guid id, [FromBody] Temporada model)
    {
        var entidad = await _context.Temporadas.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Temporada no encontrada" });
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        entidad.Nombre = model.Nombre.Trim();
        entidad.FechaInicio = model.FechaInicio;
        entidad.FechaFin = model.FechaFin;
        entidad.Activa = model.Activa;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Temporada actualizada con éxito" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTemporada(Guid id)
    {
        var entidad = await _context.Temporadas.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Temporada no encontrada" });

        _context.Temporadas.Remove(entidad);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Temporada eliminada con éxito" });
    }
}


