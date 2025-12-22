using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers;

/// <summary>
/// Gestión de noticias y comunicaciones de la federación.
/// Requisito 5.9: Espacio de noticias y comunicaciones oficiales de la federación.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class NoticiasController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public NoticiasController(AppDataBase context, UserManager<Usuario> userManager)
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

    // --- Endpoints públicos ---

    /// <summary>
    /// Obtiene las noticias publicadas para el portal público.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("publicas")]
    public async Task<IActionResult> GetPublicas([FromQuery] int? limite, [FromQuery] bool? soloDestacadas)
    {
        var q = _context.Noticias
            .Where(n => n.Publicada && n.FechaPublicacion <= DateTime.UtcNow);

        if (soloDestacadas == true)
        {
            q = q.Where(n => n.Destacada);
        }

        var query = q
            .OrderByDescending(n => n.Destacada)
            .ThenByDescending(n => n.FechaPublicacion)
            .Select(n => new
            {
                n.Id,
                n.Titulo,
                n.Resumen,
                n.ImagenUrl,
                n.Destacada,
                fechaPublicacion = n.FechaPublicacion.ToString("yyyy-MM-dd"),
            });

        if (limite.HasValue && limite.Value > 0)
        {
            var items = await query.Take(limite.Value).ToListAsync();
            return Ok(items);
        }

        var allItems = await query.ToListAsync();
        return Ok(allItems);
    }

    /// <summary>
    /// Obtiene el detalle de una noticia publicada.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("publicas/{id:guid}")]
    public async Task<IActionResult> GetPublicaById(Guid id)
    {
        var noticia = await _context.Noticias
            .Where(n => n.Id == id && n.Publicada && n.FechaPublicacion <= DateTime.UtcNow)
            .Select(n => new
            {
                n.Id,
                n.Titulo,
                n.Resumen,
                n.Contenido,
                n.ImagenUrl,
                n.Destacada,
                fechaPublicacion = n.FechaPublicacion.ToString("yyyy-MM-dd"),
            })
            .FirstOrDefaultAsync();

        if (noticia == null) return NotFound(new { message = "Noticia no encontrada" });
        return Ok(noticia);
    }

    // --- Endpoints de administración (Federación/Admin) ---

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Noticias
            .OrderByDescending(n => n.FechaCreacionUtc)
            .Select(n => new
            {
                n.Id,
                n.Titulo,
                n.Resumen,
                n.Publicada,
                n.Destacada,
                fechaPublicacion = n.FechaPublicacion.ToString("yyyy-MM-dd"),
                fechaCreacion = n.FechaCreacionUtc.ToString("yyyy-MM-dd HH:mm"),
            })
            .ToListAsync();

        return Ok(items);
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var noticia = await _context.Noticias.FindAsync(id);
        if (noticia == null) return NotFound(new { message = "Noticia no encontrada" });

        return Ok(new
        {
            noticia.Id,
            noticia.Titulo,
            noticia.Resumen,
            noticia.Contenido,
            noticia.ImagenUrl,
            noticia.Publicada,
            noticia.Destacada,
            fechaPublicacion = noticia.FechaPublicacion.ToString("yyyy-MM-dd"),
            noticia.FederacionId,
        });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NoticiaUpsertModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Titulo))
            return BadRequest(new { message = "Título es obligatorio" });
        if (string.IsNullOrWhiteSpace(model.Contenido))
            return BadRequest(new { message = "Contenido es obligatorio" });

        var user = await GetCurrentUserAsync();

        var noticia = new Noticia
        {
            Titulo = model.Titulo.Trim(),
            Resumen = string.IsNullOrWhiteSpace(model.Resumen) ? null : model.Resumen.Trim(),
            Contenido = model.Contenido.Trim(),
            ImagenUrl = string.IsNullOrWhiteSpace(model.ImagenUrl) ? null : model.ImagenUrl.Trim(),
            Publicada = model.Publicada,
            Destacada = model.Destacada,
            FechaPublicacion = model.FechaPublicacion?.Date ?? DateTime.UtcNow.Date,
            FechaCreacionUtc = DateTime.UtcNow,
            AutorUsuarioId = user?.Id,
            FederacionId = SeedIds.FederacionAsturianaId, // Por ahora solo hay una federación
        };

        _context.Noticias.Add(noticia);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Noticia creada", id = noticia.Id });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] NoticiaUpsertModel model)
    {
        var noticia = await _context.Noticias.FindAsync(id);
        if (noticia == null) return NotFound(new { message = "Noticia no encontrada" });

        if (string.IsNullOrWhiteSpace(model.Titulo))
            return BadRequest(new { message = "Título es obligatorio" });
        if (string.IsNullOrWhiteSpace(model.Contenido))
            return BadRequest(new { message = "Contenido es obligatorio" });

        noticia.Titulo = model.Titulo.Trim();
        noticia.Resumen = string.IsNullOrWhiteSpace(model.Resumen) ? null : model.Resumen.Trim();
        noticia.Contenido = model.Contenido.Trim();
        noticia.ImagenUrl = string.IsNullOrWhiteSpace(model.ImagenUrl) ? null : model.ImagenUrl.Trim();
        noticia.Publicada = model.Publicada;
        noticia.Destacada = model.Destacada;
        noticia.FechaPublicacion = model.FechaPublicacion?.Date ?? noticia.FechaPublicacion;
        noticia.FechaModificacionUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Noticia actualizada" });
    }

    [Authorize(Roles = "Admin,Federacion")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var noticia = await _context.Noticias.FindAsync(id);
        if (noticia == null) return NotFound(new { message = "Noticia no encontrada" });

        _context.Noticias.Remove(noticia);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Noticia eliminada" });
    }
}

// Modelo para crear/actualizar noticias
public class NoticiaUpsertModel
{
    public string Titulo { get; set; } = string.Empty;
    public string? Resumen { get; set; }
    public string Contenido { get; set; } = string.Empty;
    public string? ImagenUrl { get; set; }
    public bool Publicada { get; set; }
    public bool Destacada { get; set; }
    public DateTime? FechaPublicacion { get; set; }
}
