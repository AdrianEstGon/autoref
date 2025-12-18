namespace AutoRef_API.Database;

using AutoRef_API.Enum;

public class PartidoCambioSolicitud
{
    public Guid Id { get; set; }

    public Guid PartidoId { get; set; }
    public Partido Partido { get; set; } = null!;

    // Clubs implicados
    public Guid ClubSolicitanteId { get; set; }
    public Guid ClubReceptorId { get; set; }

    // Snapshot de valores originales (para histórico)
    public DateTime FechaOriginal { get; set; }
    public TimeSpan HoraOriginal { get; set; }
    public Guid? LugarOriginalId { get; set; }

    // Propuesta
    public DateTime FechaPropuesta { get; set; }
    public TimeSpan HoraPropuesta { get; set; }
    public Guid? LugarPropuestoId { get; set; }
    public string? Motivo { get; set; }

    public EstadoCambioPartido Estado { get; set; } = EstadoCambioPartido.PendienteRespuestaClub;

    // Auditoría
    public DateTime FechaSolicitudUtc { get; set; } = DateTime.UtcNow;
    public DateTime? FechaRespuestaClubUtc { get; set; }
    public bool? AceptadoPorClub { get; set; }
    public DateTime? FechaValidacionFederacionUtc { get; set; }
    public bool? AprobadoPorFederacion { get; set; }

    public Polideportivo? LugarOriginal { get; set; }
    public Polideportivo? LugarPropuesto { get; set; }
}


