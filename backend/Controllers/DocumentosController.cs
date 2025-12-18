using AutoRef_API.Database;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DocumentosController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public DocumentosController(AppDataBase context, UserManager<Usuario> userManager)
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

    private static byte[] ToBytes(XLWorkbook wb)
    {
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    private static string SanitizeFileName(string input)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
            input = input.Replace(c, '_');
        return input;
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpGet("autorizacion/{inscripcionId:guid}/excel")]
    public async Task<IActionResult> DescargarAutorizacionExcel(Guid inscripcionId)
    {
        var ins = await _context.Inscripciones
            .Include(i => i.Persona)
            .Include(i => i.Competicion)
            .Include(i => i.Equipo).ThenInclude(e => e.Club)
            .Include(i => i.Equipo).ThenInclude(e => e.Categoria)
            .FirstOrDefaultAsync(i => i.Id == inscripcionId);

        if (ins == null) return NotFound(new { message = "Inscripción no encontrada" });

        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();
            if (ins.Equipo.ClubId != user.ClubVinculadoId) return Forbid();
        }

        var club = ins.Equipo.Club;
        var persona = ins.Persona;

        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Autorización");

        ws.Column(1).Width = 28;
        ws.Column(2).Width = 65;

        ws.Cell(1, 1).Value = "Federación";
        ws.Cell(1, 2).Value = "Federación Asturiana";
        ws.Cell(2, 1).Value = "Club";
        ws.Cell(2, 2).Value = club.Nombre;
        ws.Cell(3, 1).Value = "CIF";
        ws.Cell(3, 2).Value = club.CIF ?? "";
        ws.Cell(4, 1).Value = "Razón social";
        ws.Cell(4, 2).Value = club.RazonSocial ?? "";
        ws.Cell(5, 1).Value = "Dirección fiscal";
        ws.Cell(5, 2).Value = club.DireccionFiscal ?? "";
        ws.Cell(6, 1).Value = "CP / Provincia / Ciudad";
        ws.Cell(6, 2).Value = $"{club.CodigoPostalFiscal ?? ""} {club.ProvinciaFiscal ?? ""} {club.CiudadFiscal ?? ""}".Trim();
        ws.Cell(7, 1).Value = "Responsable";
        ws.Cell(7, 2).Value = $"{club.ResponsableNombre ?? ""} ({club.ResponsableEmail ?? ""} {club.ResponsableTelefono ?? ""})".Trim();

        ws.Range(1, 1, 7, 1).Style.Font.Bold = true;

        ws.Cell(9, 1).Value = "PERSONA";
        ws.Cell(9, 1).Style.Font.Bold = true;
        ws.Cell(10, 1).Value = "Nombre y apellidos";
        ws.Cell(10, 2).Value = $"{persona.Nombre} {persona.Apellidos}".Trim();
        ws.Cell(11, 1).Value = "Documento";
        ws.Cell(11, 2).Value = persona.Documento;
        ws.Cell(12, 1).Value = "Fecha nacimiento";
        ws.Cell(12, 2).Value = persona.FechaNacimiento.ToString("yyyy-MM-dd");
        ws.Cell(13, 1).Value = "Tipo";
        ws.Cell(13, 2).Value = persona.Tipo.ToString();
        ws.Range(10, 1, 13, 1).Style.Font.Bold = true;

        ws.Cell(15, 1).Value = "COMPETICIÓN / EQUIPO";
        ws.Cell(15, 1).Style.Font.Bold = true;
        ws.Cell(16, 1).Value = "Competición";
        ws.Cell(16, 2).Value = ins.Competicion.Nombre;
        ws.Cell(17, 1).Value = "Equipo";
        ws.Cell(17, 2).Value = ins.Equipo.Nombre;
        ws.Cell(18, 1).Value = "Categoría";
        ws.Cell(18, 2).Value = ins.Equipo.Categoria?.Nombre ?? "";
        ws.Range(16, 1, 18, 1).Style.Font.Bold = true;

        ws.Cell(20, 1).Value = "AUTORIZACIÓN";
        ws.Cell(20, 1).Style.Font.Bold = true;
        ws.Cell(21, 1).Value = "Texto";
        ws.Cell(21, 2).Value =
            "El club autoriza la participación de la persona arriba indicada en la competición/equipo detallado, de acuerdo con la normativa vigente.";
        ws.Cell(21, 2).Style.Alignment.WrapText = true;
        ws.Row(21).Height = 45;

        ws.Cell(23, 1).Value = "Fecha";
        ws.Cell(23, 2).Value = DateTime.UtcNow.ToString("yyyy-MM-dd");
        ws.Cell(24, 1).Value = "Firma club";
        ws.Cell(24, 2).Value = "______________________________";
        ws.Cell(25, 1).Value = "Firma interesado/tutor";
        ws.Cell(25, 2).Value = "______________________________";
        ws.Range(23, 1, 25, 1).Style.Font.Bold = true;

        var fileName = SanitizeFileName($"Autorizacion_{persona.Documento}_{club.Nombre}_{ins.Equipo.Nombre}.xlsx");
        return File(ToBytes(wb), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }

    [Authorize(Roles = "Club,Admin,Federacion")]
    [HttpGet("licencia/{licenciaId:guid}/excel")]
    public async Task<IActionResult> DescargarLicenciaExcel(Guid licenciaId)
    {
        var lic = await _context.LicenciasPersonas
            .Include(l => l.Persona)
            .Include(l => l.Temporada)
            .Include(l => l.Modalidad)
            .Include(l => l.CategoriaBase)
            .Include(l => l.CategoriasHabilitadas).ThenInclude(h => h.Categoria)
            .FirstOrDefaultAsync(l => l.Id == licenciaId);

        if (lic == null) return NotFound(new { message = "Licencia no encontrada" });

        if (User.IsInRole("Club") && !User.IsInRole("Admin") && !User.IsInRole("Federacion"))
        {
            var user = await GetCurrentUserAsync();
            if (user?.ClubVinculadoId == null) return Forbid();

            var clubId = user.ClubVinculadoId.Value;
            var tiene = await _context.Inscripciones
                .Include(i => i.Equipo)
                .AnyAsync(i => i.Activa && i.PersonaId == lic.PersonaId && i.Equipo.ClubId == clubId);
            if (!tiene) return Forbid();
        }

        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Licencia");
        ws.Column(1).Width = 28;
        ws.Column(2).Width = 65;

        ws.Cell(1, 1).Value = "Federación";
        ws.Cell(1, 2).Value = "Federación Asturiana";
        ws.Cell(2, 1).Value = "Temporada";
        ws.Cell(2, 2).Value = lic.Temporada.Nombre;
        ws.Cell(3, 1).Value = "Modalidad";
        ws.Cell(3, 2).Value = lic.Modalidad.Nombre;
        ws.Cell(4, 1).Value = "Nº licencia";
        ws.Cell(4, 2).Value = lic.NumeroLicencia ?? "";
        ws.Cell(5, 1).Value = "Activa";
        ws.Cell(5, 2).Value = lic.Activa ? "Sí" : "No";
        ws.Range(1, 1, 5, 1).Style.Font.Bold = true;

        ws.Cell(7, 1).Value = "PERSONA";
        ws.Cell(7, 1).Style.Font.Bold = true;
        ws.Cell(8, 1).Value = "Nombre y apellidos";
        ws.Cell(8, 2).Value = $"{lic.Persona.Nombre} {lic.Persona.Apellidos}".Trim();
        ws.Cell(9, 1).Value = "Documento";
        ws.Cell(9, 2).Value = lic.Persona.Documento;
        ws.Cell(10, 1).Value = "Fecha nacimiento";
        ws.Cell(10, 2).Value = lic.Persona.FechaNacimiento.ToString("yyyy-MM-dd");
        ws.Cell(11, 1).Value = "Tipo";
        ws.Cell(11, 2).Value = lic.Persona.Tipo.ToString();
        ws.Range(8, 1, 11, 1).Style.Font.Bold = true;

        ws.Cell(13, 1).Value = "Categoría base";
        ws.Cell(13, 2).Value = lic.CategoriaBase?.Nombre ?? "";
        ws.Cell(14, 1).Value = "Categorías habilitadas";
        ws.Cell(14, 2).Value = string.Join(", ", lic.CategoriasHabilitadas.Select(h => h.Categoria.Nombre));
        ws.Range(13, 1, 14, 1).Style.Font.Bold = true;

        ws.Cell(16, 1).Value = "Observaciones";
        ws.Cell(16, 2).Value = lic.Observaciones ?? "";
        ws.Cell(16, 2).Style.Alignment.WrapText = true;
        ws.Row(16).Height = 40;
        ws.Cell(16, 1).Style.Font.Bold = true;

        var fileName = SanitizeFileName($"Licencia_{lic.Persona.Documento}_{lic.Temporada.Nombre}_{lic.Modalidad.Nombre}.xlsx");
        return File(ToBytes(wb), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}


