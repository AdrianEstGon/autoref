namespace AutoRef_API.Database;

using System;

public class Designacion
{
    public Guid Id { get; set; }

    // Árbitro
    public Guid? ArbitroId { get; set; }
    public virtual Usuario? Arbitro { get; set; }
    public int? ArbitroNumero { get; set; }

    // Partido
    public Guid? PartidoId { get; set; }
    public virtual Partido? Partido { get; set; }

    // Pista/Lugar
    public Guid? PistaId { get; set; }
    public virtual Polideportivo? Pista { get; set; }

    // Periodo de disponibilidad
    public DateTime? Desde { get; set; }
    public DateTime? Hasta { get; set; }
    public string? Dia { get; set; }

    // Estado y workflow
    public string? Estado { get; set; }
    public string? MotivoRechazo { get; set; }
    public DateTime? FechaDesignacion { get; set; }
    public DateTime? FechaRespuesta { get; set; }
    public DateTime? FechaCancelacion { get; set; }

    // Aceptación/Rechazo por árbitro (5.5)
    public bool? Aceptada { get; set; } // null = pendiente, true = aceptada, false = rechazada
    public DateTime? FechaNotificacionUtc { get; set; }
    public bool NotificacionEnviada { get; set; } = false;

    // Coordenadas
    public double? CourtLat { get; set; }
    public double? CourtLng { get; set; }
    public double? RefereeLat { get; set; }
    public double? RefereeLng { get; set; }

    // Cache de datos
    public string? Partidos { get; set; }
    public string? Equipos { get; set; }
    public string? Clubes { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
