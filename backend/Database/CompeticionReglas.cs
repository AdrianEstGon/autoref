namespace AutoRef_API.Database;

public class CompeticionReglas
{
    public Guid Id { get; set; }

    public Guid CompeticionId { get; set; }
    public Competicion Competicion { get; set; } = null!;

    // Reglas de puntos (genérico)
    public int PuntosVictoria { get; set; } = 3;
    public int PuntosEmpate { get; set; } = 1;
    public int PuntosDerrota { get; set; } = 0;

    // Orden de criterios de desempate (JSON array de strings)
    public string? OrdenDesempateJson { get; set; }

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}


