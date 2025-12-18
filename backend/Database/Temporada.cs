namespace AutoRef_API.Database;

public class Temporada
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty; // Ej: "2025/2026"
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Activa { get; set; } = true;
}


