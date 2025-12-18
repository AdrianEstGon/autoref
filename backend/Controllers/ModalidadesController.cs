using AutoRef_API.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ModalidadesController : ControllerBase
{
    private readonly AppDataBase _context;

    public ModalidadesController(AppDataBase context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetModalidades()
    {
        var modalidades = await _context.Modalidades
            .OrderByDescending(m => m.Activa)
            .ThenBy(m => m.Nombre)
            .Select(m => new
            {
                m.Id,
                m.Nombre,
                m.Activa
            })
            .ToListAsync();

        return Ok(modalidades);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> CreateModalidad([FromBody] Modalidad model)
    {
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        var entidad = new Modalidad
        {
            Nombre = model.Nombre.Trim(),
            Activa = model.Activa
        };

        _context.Modalidades.Add(entidad);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Modalidad creada con éxito", id = entidad.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateModalidad(Guid id, [FromBody] Modalidad model)
    {
        var entidad = await _context.Modalidades.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Modalidad no encontrada" });
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        entidad.Nombre = model.Nombre.Trim();
        entidad.Activa = model.Activa;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Modalidad actualizada con éxito" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteModalidad(Guid id)
    {
        var entidad = await _context.Modalidades.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Modalidad no encontrada" });

        _context.Modalidades.Remove(entidad);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Modalidad eliminada con éxito" });
    }
}


