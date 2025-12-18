using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CompeticionesController : ControllerBase
{
    private readonly AppDataBase _context;

    public CompeticionesController(AppDataBase context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCompeticiones()
    {
        var comps = await _context.Competiciones
            .OrderByDescending(c => c.Activa)
            .ThenBy(c => c.Nombre)
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.EsFederada,
                c.Activa
            })
            .ToListAsync();

        return Ok(comps);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> CreateCompeticion([FromBody] CompeticionCreateUpdateModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        var entidad = new Competicion
        {
            Nombre = model.Nombre.Trim(),
            EsFederada = model.EsFederada,
            Activa = model.Activa
        };

        _context.Competiciones.Add(entidad);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Competición creada con éxito", id = entidad.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCompeticion(Guid id, [FromBody] CompeticionCreateUpdateModel model)
    {
        var entidad = await _context.Competiciones.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Competición no encontrada" });

        if (string.IsNullOrWhiteSpace(model.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio" });

        entidad.Nombre = model.Nombre.Trim();
        entidad.EsFederada = model.EsFederada;
        entidad.Activa = model.Activa;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Competición actualizada con éxito" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCompeticion(Guid id)
    {
        var entidad = await _context.Competiciones.FindAsync(id);
        if (entidad == null) return NotFound(new { message = "Competición no encontrada" });

        _context.Competiciones.Remove(entidad);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Competición eliminada con éxito" });
    }
}


