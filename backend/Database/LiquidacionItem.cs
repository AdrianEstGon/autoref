namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class LiquidacionItem
{
    public Guid Id { get; set; }

    public Guid LiquidacionId { get; set; }
    public Liquidacion Liquidacion { get; set; } = null!;

    public TipoConceptoLiquidacion Tipo { get; set; } = TipoConceptoLiquidacion.Otro;

    public string Descripcion { get; set; } = string.Empty;

    // Para dietas/arbitraje/otros
    public decimal Cantidad { get; set; } = 1m;
    public decimal PrecioUnitario { get; set; } = 0m;

    // Para desplazamiento (km opcional)
    public decimal? Km { get; set; }

    // Importe calculado (Cantidad * PrecioUnitario) o introducido (v1: siempre calculado)
    public decimal Importe { get; set; }
}


