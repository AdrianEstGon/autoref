namespace AutoRef_API.Database;

public class LicenciaCategoriaHabilitada
{
    public Guid Id { get; set; }

    public Guid LicenciaPersonaId { get; set; }
    public Guid CategoriaId { get; set; }

    public DateTime FechaAlta { get; set; } = DateTime.UtcNow;

    public LicenciaPersona LicenciaPersona { get; set; } = null!;
    public Categoria Categoria { get; set; } = null!;
}


