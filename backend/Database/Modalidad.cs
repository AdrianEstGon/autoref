namespace AutoRef_API.Database;

public class Modalidad
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty; // Ej: "Voleibol"
    public bool Activa { get; set; } = true;
}


