namespace AutoRef_API.Models;

using AutoRef_API.Enum;

public class FacturaLineaModel
{
    public string Concepto { get; set; } = string.Empty;
    public decimal Cantidad { get; set; } = 1m;
    public decimal PrecioUnitario { get; set; } = 0m;
    public decimal IvaPorcentaje { get; set; } = 0m;
}

public class CrearFacturaModel
{
    public Guid ClubId { get; set; }
    public DateTime FechaEmision { get; set; } // date
    public DateTime FechaVencimiento { get; set; } // date
    public string? Observaciones { get; set; }
    public List<FacturaLineaModel> Lineas { get; set; } = new();
}

public class MarcarFacturaPagadaModel
{
    public string? ReferenciaPago { get; set; }
}


