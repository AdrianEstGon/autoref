namespace AutoRef_API.Database;

public class FacturaLinea
{
    public Guid Id { get; set; }

    public Guid FacturaId { get; set; }
    public Factura Factura { get; set; } = null!;

    public string Concepto { get; set; } = string.Empty;
    public decimal Cantidad { get; set; } = 1m;
    public decimal PrecioUnitario { get; set; } = 0m;
    public decimal Importe { get; set; }

    public decimal IvaPorcentaje { get; set; } = 0m; // 0..100
}


