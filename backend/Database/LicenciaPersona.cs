namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class LicenciaPersona
{
    public Guid Id { get; set; }

    public Guid PersonaId { get; set; }
    public Guid TemporadaId { get; set; }
    public Guid ModalidadId { get; set; }

    // Puede ser nulo para técnicos/staff si no aplica
    public Guid? CategoriaBaseId { get; set; }

    // Identificador administrativo (si existe). No forzamos unicidad global porque puede depender de modalidad/temporada.
    public string? NumeroLicencia { get; set; }

    public bool Activa { get; set; } = true;
    public DateTime FechaAlta { get; set; } = DateTime.UtcNow;
    public string? Observaciones { get; set; }

    // 5.7: workflow de solicitud/validación de licencias
    public EstadoLicencia Estado { get; set; } = EstadoLicencia.Validada;
    public DateTime? FechaSolicitudUtc { get; set; }
    public Guid? ClubSolicitanteId { get; set; }
    public DateTime? FechaValidacionUtc { get; set; }
    public Guid? ValidadaPorUsuarioId { get; set; }
    public string? MotivoRechazo { get; set; }

    public Persona Persona { get; set; } = null!;
    public Temporada Temporada { get; set; } = null!;
    public Modalidad Modalidad { get; set; } = null!;
    public Categoria? CategoriaBase { get; set; }

    public List<LicenciaCategoriaHabilitada> CategoriasHabilitadas { get; set; } = new();
}


