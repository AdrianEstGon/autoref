namespace AutoRef_API.Models;

using AutoRef_API.Enum;

public class LiquidacionItemModel
{
    public TipoConceptoLiquidacion Tipo { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal Cantidad { get; set; } = 1m;
    public decimal PrecioUnitario { get; set; } = 0m;
    public decimal? Km { get; set; }
}

public class LiquidacionUpsertModel
{
    public Guid? PartidoId { get; set; }
    public TipoLiquidacion Tipo { get; set; } = TipoLiquidacion.PorPartido;
    public DateTime Fecha { get; set; }
    public string? Observaciones { get; set; }
    public List<LiquidacionItemModel> Items { get; set; } = new();
}


