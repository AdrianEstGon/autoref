namespace AutoRef_API.Database;

public class ActaPartido
{
    public Guid Id { get; set; }

    public Guid PartidoId { get; set; }
    public Partido Partido { get; set; } = null!;

    // Datos del acta (JSON)
    public string DataJson { get; set; } = "{}";

    public Guid? CreadaPorUsuarioId { get; set; }
    public DateTime FechaActualizacionUtc { get; set; } = DateTime.UtcNow;
}


