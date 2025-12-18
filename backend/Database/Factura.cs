namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class Factura
{
    public Guid Id { get; set; }

    public Guid ClubId { get; set; }
    public Club Club { get; set; } = null!;

    public string Numero { get; set; } = string.Empty; // FAC-YYYY-0001
    public DateTime FechaEmision { get; set; } // date
    public DateTime FechaVencimiento { get; set; } // date

    public EstadoFactura Estado { get; set; } = EstadoFactura.Emitida;

    public decimal BaseImponible { get; set; }
    public decimal Iva { get; set; }
    public decimal Total { get; set; }

    public string? Observaciones { get; set; }

    public DateTime FechaCreacionUtc { get; set; } = DateTime.UtcNow;
    public DateTime? FechaPagoUtc { get; set; }
    public string? ReferenciaPago { get; set; }

    public List<FacturaLinea> Lineas { get; set; } = new();
}


