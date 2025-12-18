using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly AppDataBase _context;
        private readonly UserManager<Usuario> _userManager;

        public ClubsController(AppDataBase context, UserManager<Usuario> userManager)
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

        // Listado básico (id + nombre) para selects
        [HttpGet]
        public async Task<IActionResult> GetClubs()
        {
            var clubs = await _context.Clubs
                .OrderBy(c => c.Nombre)
                .Select(c => new { c.Id, c.Nombre })
                .ToListAsync();

            return Ok(clubs);
        }

        // Listado detallado para gestión (Federación/Admin)
        [Authorize(Roles = "Admin,Federacion")]
        [HttpGet("detalle")]
        public async Task<IActionResult> GetClubsDetalle()
        {
            var clubs = await _context.Clubs
                .OrderBy(c => c.Nombre)
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.RazonSocial,
                    c.CIF,
                    c.DireccionFiscal,
                    c.CodigoPostalFiscal,
                    c.ProvinciaFiscal,
                    c.CiudadFiscal,
                    c.EmailFacturacion,
                    c.Telefono,
                    c.ResponsableNombre,
                    c.ResponsableEmail,
                    c.ResponsableTelefono
                })
                .ToListAsync();

            return Ok(clubs);
        }

        // Club: ver su propio club
        [Authorize(Roles = "Club,Admin,Federacion")]
        [HttpGet("mio")]
        public async Task<IActionResult> GetMiClub()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) return Unauthorized();
            if (user.ClubVinculadoId == null) return BadRequest(new { message = "El usuario no tiene un club vinculado" });

            var club = await _context.Clubs.FirstOrDefaultAsync(c => c.Id == user.ClubVinculadoId);
            if (club == null) return NotFound(new { message = "Club no encontrado" });

            return Ok(club);
        }

        [Authorize(Roles = "Admin,Federacion,Club")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetClub(Guid id)
        {
            // Si es Club, solo puede ver el suyo
            if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
            {
                var user = await GetCurrentUserAsync();
                if (user?.ClubVinculadoId == null) return Forbid();
                if (user.ClubVinculadoId.Value != id) return Forbid();
            }

            var club = await _context.Clubs.FirstOrDefaultAsync(c => c.Id == id);
            if (club == null) return NotFound(new { message = "Club no encontrado" });
            return Ok(club);
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpPost]
        public async Task<IActionResult> CreateClub([FromBody] ClubUpsertModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Nombre)) return BadRequest(new { message = "El nombre es obligatorio" });

            var entidad = new Club
            {
                FederacionId = SeedIds.FederacionAsturianaId,
                Nombre = model.Nombre.Trim(),
                RazonSocial = string.IsNullOrWhiteSpace(model.RazonSocial) ? null : model.RazonSocial.Trim(),
                CIF = string.IsNullOrWhiteSpace(model.CIF) ? null : model.CIF.Trim(),
                DireccionFiscal = string.IsNullOrWhiteSpace(model.DireccionFiscal) ? null : model.DireccionFiscal.Trim(),
                CodigoPostalFiscal = string.IsNullOrWhiteSpace(model.CodigoPostalFiscal) ? null : model.CodigoPostalFiscal.Trim(),
                ProvinciaFiscal = string.IsNullOrWhiteSpace(model.ProvinciaFiscal) ? null : model.ProvinciaFiscal.Trim(),
                CiudadFiscal = string.IsNullOrWhiteSpace(model.CiudadFiscal) ? null : model.CiudadFiscal.Trim(),
                EmailFacturacion = string.IsNullOrWhiteSpace(model.EmailFacturacion) ? null : model.EmailFacturacion.Trim(),
                Telefono = string.IsNullOrWhiteSpace(model.Telefono) ? null : model.Telefono.Trim(),
                ResponsableNombre = string.IsNullOrWhiteSpace(model.ResponsableNombre) ? null : model.ResponsableNombre.Trim(),
                ResponsableEmail = string.IsNullOrWhiteSpace(model.ResponsableEmail) ? null : model.ResponsableEmail.Trim(),
                ResponsableTelefono = string.IsNullOrWhiteSpace(model.ResponsableTelefono) ? null : model.ResponsableTelefono.Trim(),
            };

            _context.Clubs.Add(entidad);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Club creado con éxito", id = entidad.Id });
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateClub(Guid id, [FromBody] ClubUpsertModel model)
        {
            var entidad = await _context.Clubs.FindAsync(id);
            if (entidad == null) return NotFound(new { message = "Club no encontrado" });
            if (string.IsNullOrWhiteSpace(model.Nombre)) return BadRequest(new { message = "El nombre es obligatorio" });

            entidad.Nombre = model.Nombre.Trim();
            entidad.RazonSocial = string.IsNullOrWhiteSpace(model.RazonSocial) ? null : model.RazonSocial.Trim();
            entidad.CIF = string.IsNullOrWhiteSpace(model.CIF) ? null : model.CIF.Trim();
            entidad.DireccionFiscal = string.IsNullOrWhiteSpace(model.DireccionFiscal) ? null : model.DireccionFiscal.Trim();
            entidad.CodigoPostalFiscal = string.IsNullOrWhiteSpace(model.CodigoPostalFiscal) ? null : model.CodigoPostalFiscal.Trim();
            entidad.ProvinciaFiscal = string.IsNullOrWhiteSpace(model.ProvinciaFiscal) ? null : model.ProvinciaFiscal.Trim();
            entidad.CiudadFiscal = string.IsNullOrWhiteSpace(model.CiudadFiscal) ? null : model.CiudadFiscal.Trim();
            entidad.EmailFacturacion = string.IsNullOrWhiteSpace(model.EmailFacturacion) ? null : model.EmailFacturacion.Trim();
            entidad.Telefono = string.IsNullOrWhiteSpace(model.Telefono) ? null : model.Telefono.Trim();
            entidad.ResponsableNombre = string.IsNullOrWhiteSpace(model.ResponsableNombre) ? null : model.ResponsableNombre.Trim();
            entidad.ResponsableEmail = string.IsNullOrWhiteSpace(model.ResponsableEmail) ? null : model.ResponsableEmail.Trim();
            entidad.ResponsableTelefono = string.IsNullOrWhiteSpace(model.ResponsableTelefono) ? null : model.ResponsableTelefono.Trim();

            await _context.SaveChangesAsync();
            return Ok(new { message = "Club actualizado con éxito" });
        }

        [Authorize(Roles = "Admin,Federacion")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteClub(Guid id)
        {
            var entidad = await _context.Clubs.FindAsync(id);
            if (entidad == null) return NotFound(new { message = "Club no encontrado" });

            _context.Clubs.Remove(entidad);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Club eliminado con éxito" });
        }
    }
}
