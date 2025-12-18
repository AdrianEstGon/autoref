namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class OrdenPago
{
    public Guid Id { get; set; }

    public EstadoOrdenPago Estado { get; set; } = EstadoOrdenPago.Borrador;
    public DateTime FechaCreacionUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ExportadaUtc { get; set; }
    public DateTime? EjecutadaUtc { get; set; }

    public DateTime PeriodoDesde { get; set; } // date
    public DateTime PeriodoHasta { get; set; } // date

    public Guid? GeneradaPorUsuarioId { get; set; }
    public string? Referencia { get; set; }

    public decimal Total { get; set; }

    public List<OrdenPagoItem> Items { get; set; } = new();
}


