namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class Liquidacion
{
    public Guid Id { get; set; }

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public TipoLiquidacion Tipo { get; set; } = TipoLiquidacion.PorPartido;
    public Guid? PartidoId { get; set; }
    public Partido? Partido { get; set; }

    public DateTime Fecha { get; set; } // fecha del gasto / del partido (date)

    public EstadoLiquidacion Estado { get; set; } = EstadoLiquidacion.Borrador;
    public string? Observaciones { get; set; }

    // Totales
    public decimal Total { get; set; }

    // Auditoría
    public DateTime FechaCreacionUtc { get; set; } = DateTime.UtcNow;
    public DateTime? FechaEnvioUtc { get; set; }
    public DateTime? FechaResolucionUtc { get; set; }
    public Guid? ResueltaPorUsuarioId { get; set; }
    public string? MotivoRechazo { get; set; }

    public List<LiquidacionItem> Items { get; set; } = new();
}


