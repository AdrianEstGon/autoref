namespace AutoRef_API.Database;

public class OrdenPagoItem
{
    public Guid Id { get; set; }

    public Guid OrdenPagoId { get; set; }
    public OrdenPago OrdenPago { get; set; } = null!;

    public Guid LiquidacionId { get; set; }
    public Liquidacion Liquidacion { get; set; } = null!;

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public decimal Importe { get; set; }
}


