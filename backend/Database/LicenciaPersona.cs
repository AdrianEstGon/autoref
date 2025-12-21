namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class LicenciaPersona
{
    public Guid Id { get; set; }

    public Guid PersonaId { get; set; }
    public Guid TemporadaId { get; set; }
    public Guid? ModalidadId { get; set; }

    // Puede ser nulo para técnicos/staff si no aplica
    public Guid? CategoriaBaseId { get; set; }
    public Guid? ClubId { get; set; }

    // Identificador administrativo
    public string? NumeroLicencia { get; set; }
    public string? Tipo { get; set; }

    public bool Activa { get; set; } = true;
    public DateTime? FechaAlta { get; set; }
    public DateTime? FechaFin { get; set; }
    public string? Observaciones { get; set; }

    // Dirección (puede diferir de la persona)
    public string? Direccion { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Poblacion { get; set; }
    public string? Provincia { get; set; }
    public double? Lat { get; set; }
    public double? Lng { get; set; }

    // Facturación
    public decimal? Importe { get; set; }
    public Guid? FacturaId { get; set; }
    public virtual Factura? Factura { get; set; }

    // Categorías especiales
    public string? CategoriaEntrenador { get; set; }
    public string? CategoriaArbitro { get; set; }
    public string? Genero { get; set; }

    // Habilitaciones
    public bool HabilitadoNacional { get; set; }
    public bool HabilitadoCategoriaSuperior { get; set; }

    // Mutua
    public DateTime? FechaMutua { get; set; }

    // Equipos asociados (JSON de IDs)
    public string? EquiposIds { get; set; }

    // Workflow de solicitud/validación
    public EstadoLicencia Estado { get; set; } = EstadoLicencia.Validada;
    public DateTime? FechaSolicitudUtc { get; set; }
    public Guid? ClubSolicitanteId { get; set; }
    public DateTime? FechaValidacionUtc { get; set; }
    public Guid? ValidadaPorUsuarioId { get; set; }
    public string? MotivoRechazo { get; set; }

    // Nombre cacheado
    public string? Nombre { get; set; }

    // Navegación
    public Persona Persona { get; set; } = null!;
    public Temporada Temporada { get; set; } = null!;
    public Modalidad? Modalidad { get; set; }
    public Categoria? CategoriaBase { get; set; }
    public Club? Club { get; set; }

    public List<LicenciaCategoriaHabilitada> CategoriasHabilitadas { get; set; } = new();

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}


