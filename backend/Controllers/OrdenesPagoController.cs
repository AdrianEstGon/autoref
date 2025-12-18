using AutoRef_API.Database;
using AutoRef_API.Enum;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Xml.Linq;

namespace AutoRef_API.Controllers;

[Authorize(Roles = "ComiteArbitros,Admin")]
[Route("api/[controller]")]
[ApiController]
public class OrdenesPagoController : ControllerBase
{
    private readonly AppDataBase _context;
    private readonly UserManager<Usuario> _userManager;

    public OrdenesPagoController(AppDataBase context, UserManager<Usuario> userManager)
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

    [HttpGet]
    public async Task<IActionResult> GetOrdenes()
    {
        var items = await _context.OrdenesPago
            .Include(o => o.Items)
            .OrderByDescending(o => o.FechaCreacionUtc)
            .Select(o => new
            {
                o.Id,
                estado = o.Estado.ToString(),
                o.FechaCreacionUtc,
                o.PeriodoDesde,
                o.PeriodoHasta,
                o.Referencia,
                o.Total,
                totalLiquidaciones = o.Items.Count
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost("generar")]
    public async Task<IActionResult> Generar([FromBody] GenerarOrdenPagoModel model)
    {
        var user = await GetCurrentUserAsync();
        if (user == null) return Unauthorized();

        if (model.PeriodoDesde == default || model.PeriodoHasta == default)
            return BadRequest(new { message = "PeriodoDesde/PeriodoHasta obligatorios" });

        var desde = model.PeriodoDesde.Date;
        var hasta = model.PeriodoHasta.Date;
        if (hasta < desde) return BadRequest(new { message = "PeriodoHasta debe ser >= PeriodoDesde" });

        // Selecciona liquidaciones aprobadas no incluidas todavía en orden de pago
        var liquidaciones = await _context.Liquidaciones
            .Include(l => l.Usuario)
            .Where(l =>
                l.Estado == EstadoLiquidacion.Aprobada &&
                l.Fecha >= desde && l.Fecha <= hasta)
            .ToListAsync();

        if (liquidaciones.Count == 0)
            return BadRequest(new { message = "No hay liquidaciones aprobadas en el periodo" });

        var liqIds = liquidaciones.Select(l => l.Id).ToList();
        var yaIncluidas = await _context.OrdenesPagoItems.Where(i => liqIds.Contains(i.LiquidacionId)).Select(i => i.LiquidacionId).ToListAsync();
        liquidaciones = liquidaciones.Where(l => !yaIncluidas.Contains(l.Id)).ToList();

        if (liquidaciones.Count == 0)
            return BadRequest(new { message = "Las liquidaciones del periodo ya están incluidas en órdenes de pago" });

        var orden = new OrdenPago
        {
            Estado = EstadoOrdenPago.Borrador,
            FechaCreacionUtc = DateTime.UtcNow,
            PeriodoDesde = desde,
            PeriodoHasta = hasta,
            GeneradaPorUsuarioId = user.Id,
            Referencia = string.IsNullOrWhiteSpace(model.Referencia) ? null : model.Referencia.Trim(),
        };

        foreach (var l in liquidaciones)
        {
            orden.Items.Add(new OrdenPagoItem
            {
                LiquidacionId = l.Id,
                UsuarioId = l.UsuarioId,
                Importe = l.Total
            });
            l.Estado = EstadoLiquidacion.IncluidaEnOrdenPago;
        }

        orden.Total = Math.Round(orden.Items.Sum(i => i.Importe), 2, MidpointRounding.AwayFromZero);
        _context.OrdenesPago.Add(orden);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Orden de pago generada", id = orden.Id, total = orden.Total, items = orden.Items.Count });
    }

    [HttpGet("{id:guid}/sepa")]
    public async Task<IActionResult> ExportSepa(Guid id)
    {
        var orden = await _context.OrdenesPago
            .Include(o => o.Items)
            .ThenInclude(i => i.Usuario)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (orden == null) return NotFound(new { message = "Orden no encontrada" });

        // Datos del ordenante (payer) - configurar en env
        var debtorName = Environment.GetEnvironmentVariable("SEPA_DEBTOR_NAME") ?? "Federación";
        var debtorIban = Environment.GetEnvironmentVariable("SEPA_DEBTOR_IBAN") ?? "";
        var debtorBic = Environment.GetEnvironmentVariable("SEPA_DEBTOR_BIC") ?? "";

        if (string.IsNullOrWhiteSpace(debtorIban))
            return BadRequest(new { message = "Configura SEPA_DEBTOR_IBAN en el servidor" });

        var missing = orden.Items
            .Where(i => string.IsNullOrWhiteSpace(i.Usuario.Iban))
            .Select(i => new { i.UsuarioId, nombre = $"{i.Usuario.Nombre} {i.Usuario.PrimerApellido} {i.Usuario.SegundoApellido}".Trim() })
            .Distinct()
            .ToList();

        if (missing.Count > 0)
            return BadRequest(new { message = "Hay árbitros sin IBAN configurado", missing });

        var msgId = $"AUTREF-{DateTime.UtcNow:yyyyMMddHHmmss}";
        var pmtInfId = $"PMT-{orden.Id.ToString()[..8]}";
        var ctrlSum = orden.Items.Sum(i => i.Importe);
        var nbOfTxs = orden.Items.Count;

        XNamespace ns = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";

        var doc = new XDocument(
            new XDeclaration("1.0", "utf-8", "yes"),
            new XElement(ns + "Document",
                new XElement(ns + "CstmrCdtTrfInitn",
                    new XElement(ns + "GrpHdr",
                        new XElement(ns + "MsgId", msgId),
                        new XElement(ns + "CreDtTm", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")),
                        new XElement(ns + "NbOfTxs", nbOfTxs.ToString()),
                        new XElement(ns + "CtrlSum", ctrlSum.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)),
                        new XElement(ns + "InitgPty",
                            new XElement(ns + "Nm", debtorName)
                        )
                    ),
                    new XElement(ns + "PmtInf",
                        new XElement(ns + "PmtInfId", pmtInfId),
                        new XElement(ns + "PmtMtd", "TRF"),
                        new XElement(ns + "BtchBookg", "true"),
                        new XElement(ns + "NbOfTxs", nbOfTxs.ToString()),
                        new XElement(ns + "CtrlSum", ctrlSum.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)),
                        new XElement(ns + "PmtTpInf",
                            new XElement(ns + "SvcLvl", new XElement(ns + "Cd", "SEPA"))
                        ),
                        new XElement(ns + "ReqdExctnDt", DateTime.UtcNow.ToString("yyyy-MM-dd")),
                        new XElement(ns + "Dbtr", new XElement(ns + "Nm", debtorName)),
                        new XElement(ns + "DbtrAcct",
                            new XElement(ns + "Id", new XElement(ns + "IBAN", debtorIban.Replace(" ", "").ToUpperInvariant()))
                        ),
                        string.IsNullOrWhiteSpace(debtorBic)
                            ? null
                            : new XElement(ns + "DbtrAgt", new XElement(ns + "FinInstnId", new XElement(ns + "BIC", debtorBic.Replace(" ", "").ToUpperInvariant()))),
                        new XElement(ns + "ChrgBr", "SLEV"),
                        orden.Items.Select((it, idx) =>
                        {
                            var endToEnd = $"E2E-{orden.Id.ToString()[..8]}-{idx + 1}";
                            var creditorName = string.IsNullOrWhiteSpace(it.Usuario.TitularCuenta)
                                ? $"{it.Usuario.Nombre} {it.Usuario.PrimerApellido} {it.Usuario.SegundoApellido}".Trim()
                                : it.Usuario.TitularCuenta.Trim();
                            var iban = it.Usuario.Iban!.Replace(" ", "").ToUpperInvariant();
                            var bic = it.Usuario.Bic?.Replace(" ", "").ToUpperInvariant();

                            return new XElement(ns + "CdtTrfTxInf",
                                new XElement(ns + "PmtId", new XElement(ns + "EndToEndId", endToEnd)),
                                new XElement(ns + "Amt",
                                    new XElement(ns + "InstdAmt",
                                        new XAttribute("Ccy", "EUR"),
                                        it.Importe.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)
                                    )
                                ),
                                string.IsNullOrWhiteSpace(bic)
                                    ? null
                                    : new XElement(ns + "CdtrAgt", new XElement(ns + "FinInstnId", new XElement(ns + "BIC", bic))),
                                new XElement(ns + "Cdtr", new XElement(ns + "Nm", creditorName)),
                                new XElement(ns + "CdtrAcct", new XElement(ns + "Id", new XElement(ns + "IBAN", iban))),
                                new XElement(ns + "RmtInf", new XElement(ns + "Ustrd", orden.Referencia ?? $"Liquidaciones {orden.PeriodoDesde:yyyy-MM-dd} a {orden.PeriodoHasta:yyyy-MM-dd}"))
                            );
                        })
                    )
                )
            )
        );

        var xml = doc.ToString(SaveOptions.DisableFormatting);

        orden.Estado = EstadoOrdenPago.Exportada;
        orden.ExportadaUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var filename = $"SEPA_OrdenPago_{orden.Id}_{DateTime.UtcNow:yyyyMMdd_HHmm}.xml";
        return File(System.Text.Encoding.UTF8.GetBytes(xml), "application/xml", filename);
    }
}


