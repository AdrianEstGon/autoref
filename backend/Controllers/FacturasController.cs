using AutoRef_API.Database;
using AutoRef_API.Enum;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AutoRef_API.Controllers;

[Authorize(Roles = "Admin,Federacion")]
[Route("api/[controller]")]
[ApiController]
public class FacturasController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public FacturasController(AppDataBase context, UserManager<Usuario> userManager)
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

    private static decimal Round2(decimal v) => Math.Round(v, 2, MidpointRounding.AwayFromZero);

    private async Task<string> GenerateNumeroAsync(DateTime fechaEmision)
    {
        var year = fechaEmision.Year;
        var prefix = $"FAC-{year}-";

        var last = await _context.Facturas
            .Where(f => f.Numero.StartsWith(prefix))
            .OrderByDescending(f => f.Numero)
            .Select(f => f.Numero)
            .FirstOrDefaultAsync();

        var next = 1;
        if (!string.IsNullOrWhiteSpace(last))
        {
            var parts = last.Split('-', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 3 && int.TryParse(parts[2], out var n)) next = n + 1;
        }
        return $"{prefix}{next:D4}";
    }

    [HttpGet]
    public async Task<IActionResult> GetFacturas()
    {
        var list = await _context.Facturas
            .Include(f => f.Club)
            .OrderByDescending(f => f.FechaEmision)
            .Select(f => new
            {
                f.Id,
                f.Numero,
                club = new { f.ClubId, f.Club.Nombre },
                f.FechaEmision,
                f.FechaVencimiento,
                estado = f.Estado.ToString(),
                f.BaseImponible,
                f.Iva,
                f.Total,
                f.ReferenciaPago
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetFactura(Guid id)
    {
        var f = await _context.Facturas
            .Include(x => x.Club)
            .Include(x => x.Lineas)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return NotFound(new { message = "Factura no encontrada" });

        return Ok(new
        {
            f.Id,
            f.Numero,
            club = new
            {
                f.ClubId,
                f.Club.Nombre,
                f.Club.RazonSocial,
                f.Club.CIF,
                f.Club.DireccionFiscal,
                f.Club.CodigoPostalFiscal,
                f.Club.ProvinciaFiscal,
                f.Club.CiudadFiscal,
                f.Club.EmailFacturacion
            },
            f.FechaEmision,
            f.FechaVencimiento,
            estado = f.Estado.ToString(),
            f.BaseImponible,
            f.Iva,
            f.Total,
            f.Observaciones,
            f.ReferenciaPago,
            lineas = f.Lineas.Select(l => new { l.Id, l.Concepto, l.Cantidad, l.PrecioUnitario, l.Importe, l.IvaPorcentaje })
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearFacturaModel model)
    {
        if (model.ClubId == Guid.Empty) return BadRequest(new { message = "ClubId obligatorio" });
        if (model.FechaEmision == default) return BadRequest(new { message = "FechaEmision obligatoria" });
        if (model.FechaVencimiento == default) return BadRequest(new { message = "FechaVencimiento obligatoria" });
        if (model.FechaVencimiento.Date < model.FechaEmision.Date) return BadRequest(new { message = "FechaVencimiento debe ser >= FechaEmision" });

        var club = await _context.Clubs.FindAsync(model.ClubId);
        if (club == null) return BadRequest(new { message = "Club no encontrado" });

        var numero = await GenerateNumeroAsync(model.FechaEmision);

        var factura = new Factura
        {
            ClubId = model.ClubId,
            Numero = numero,
            FechaEmision = model.FechaEmision.Date,
            FechaVencimiento = model.FechaVencimiento.Date,
            Estado = EstadoFactura.Emitida,
            Observaciones = string.IsNullOrWhiteSpace(model.Observaciones) ? null : model.Observaciones.Trim(),
        };

        foreach (var l in (model.Lineas ?? new List<FacturaLineaModel>()).Where(x => !string.IsNullOrWhiteSpace(x.Concepto)))
        {
            var importe = Round2(l.Cantidad * l.PrecioUnitario);
            factura.Lineas.Add(new FacturaLinea
            {
                Concepto = l.Concepto.Trim(),
                Cantidad = l.Cantidad,
                PrecioUnitario = l.PrecioUnitario,
                Importe = importe,
                IvaPorcentaje = l.IvaPorcentaje
            });
        }

        factura.BaseImponible = Round2(factura.Lineas.Sum(x => x.Importe));
        factura.Iva = Round2(factura.Lineas.Sum(x => x.Importe * (x.IvaPorcentaje / 100m)));
        factura.Total = Round2(factura.BaseImponible + factura.Iva);

        _context.Facturas.Add(factura);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Factura creada", id = factura.Id, numero = factura.Numero });
    }

    [HttpPost("{id:guid}/marcar-pagada")]
    public async Task<IActionResult> MarcarPagada(Guid id, [FromBody] MarcarFacturaPagadaModel model)
    {
        var factura = await _context.Facturas.FirstOrDefaultAsync(f => f.Id == id);
        if (factura == null) return NotFound(new { message = "Factura no encontrada" });

        factura.Estado = EstadoFactura.Pagada;
        factura.FechaPagoUtc = DateTime.UtcNow;
        factura.ReferenciaPago = string.IsNullOrWhiteSpace(model.ReferenciaPago) ? factura.ReferenciaPago : model.ReferenciaPago.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Factura marcada como pagada" });
    }

    [HttpGet("{id:guid}/html")]
    public async Task<IActionResult> Html(Guid id)
    {
        var f = await _context.Facturas
            .Include(x => x.Club)
            .Include(x => x.Lineas)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return NotFound(new { message = "Factura no encontrada" });

        var html = $@"
<!doctype html>
<html lang=""es"">
<head>
  <meta charset=""utf-8""/>
  <meta name=""viewport"" content=""width=device-width, initial-scale=1""/>
  <title>Factura {System.Net.WebUtility.HtmlEncode(f.Numero)}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 24px; color: #111; }}
    h1 {{ margin: 0 0 8px; }}
    .row {{ display:flex; justify-content: space-between; gap: 16px; }}
    .box {{ border: 1px solid #ddd; padding: 12px; border-radius: 8px; flex: 1; }}
    table {{ border-collapse: collapse; width: 100%; margin-top: 12px; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; }}
    th {{ background: #f6f7f9; text-align:left; }}
    .right {{ text-align:right; }}
  </style>
</head>
<body>
  <h1>Factura {System.Net.WebUtility.HtmlEncode(f.Numero)}</h1>
  <div class=""row"">
    <div class=""box"">
      <h3>Emisor</h3>
      <div><strong>Federación:</strong> Federación Asturiana</div>
    </div>
    <div class=""box"">
      <h3>Cliente</h3>
      <div><strong>Club:</strong> {System.Net.WebUtility.HtmlEncode(f.Club.Nombre)}</div>
      <div><strong>Razón social:</strong> {System.Net.WebUtility.HtmlEncode(f.Club.RazonSocial ?? "")}</div>
      <div><strong>CIF:</strong> {System.Net.WebUtility.HtmlEncode(f.Club.CIF ?? "")}</div>
      <div><strong>Dirección:</strong> {System.Net.WebUtility.HtmlEncode(f.Club.DireccionFiscal ?? "")}</div>
      <div><strong>Email facturación:</strong> {System.Net.WebUtility.HtmlEncode(f.Club.EmailFacturacion ?? "")}</div>
    </div>
  </div>

  <div style=""margin-top:12px"">
    <strong>Fecha emisión:</strong> {f.FechaEmision:yyyy-MM-dd} — <strong>Vencimiento:</strong> {f.FechaVencimiento:yyyy-MM-dd} — <strong>Estado:</strong> {f.Estado}
  </div>

  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th class=""right"">Cantidad</th>
        <th class=""right"">P. Unit</th>
        <th class=""right"">IVA %</th>
        <th class=""right"">Importe</th>
      </tr>
    </thead>
    <tbody>
      {string.Join("", f.Lineas.Select(l => $"<tr><td>{System.Net.WebUtility.HtmlEncode(l.Concepto)}</td><td class='right'>{l.Cantidad:0.##}</td><td class='right'>{l.PrecioUnitario:0.00}</td><td class='right'>{l.IvaPorcentaje:0.##}</td><td class='right'>{l.Importe:0.00}</td></tr>"))}
    </tbody>
  </table>

  <table style=""max-width: 420px; margin-left:auto"">
    <tbody>
      <tr><th>Base</th><td class=""right"">{f.BaseImponible:0.00}</td></tr>
      <tr><th>IVA</th><td class=""right"">{f.Iva:0.00}</td></tr>
      <tr><th>Total</th><td class=""right""><strong>{f.Total:0.00}</strong></td></tr>
    </tbody>
  </table>

  <div style=""margin-top:12px""><strong>Observaciones:</strong> {System.Net.WebUtility.HtmlEncode(f.Observaciones ?? "")}</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>";

        return Content(html, "text/html");
    }
}


