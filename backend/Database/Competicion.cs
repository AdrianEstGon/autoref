namespace AutoRef_API.Database;

using System;

public class Competicion
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool EsFederada { get; set; }
    public bool Activa { get; set; } = true;
    public int Posicion { get; set; }

    public Guid FederacionId { get; set; }
    public virtual Federacion? Federacion { get; set; }

    // Relaciones
    public Guid? TemporadaId { get; set; }
    public virtual Temporada? Temporada { get; set; }

    public Guid? ModalidadId { get; set; }
    public virtual Modalidad? Modalidad { get; set; }

    public Guid? CategoriaId { get; set; }
    public virtual Categoria? Categoria { get; set; }

    public Guid? CompetitionGroupId { get; set; }

    // Tipo y configuración
    public string? TipoCompeticion { get; set; }
    public string? Sexo { get; set; }
    public bool? EsMixto { get; set; }

    // Control de jugadores
    public int? MinJugadoresPorEquipo { get; set; }
    public int? MaxJugadoresPorEquipo { get; set; }
    public int? NumeroJugadoresEnPista { get; set; }
    public bool? ControlJugadores { get; set; }
    public bool? HayLibero { get; set; }

    // Control de staff
    public int? MinStaffPorEquipo { get; set; }
    public int? MaxStaffPorEquipo { get; set; }

    // Sets y puntuación
    public int? Sets { get; set; }
    public int? SetPoints { get; set; }
    public int? ChangePoints { get; set; }
    public string? ConfiguracionSets { get; set; }
    public string? ResolucionEmpate { get; set; }
    public string? PuntuacionClasificacion { get; set; }
    public string? PuntuacionPlaya { get; set; }
    public string? CriteriosClasificacion { get; set; }

    // Precios
    public string? Precios { get; set; }

    // Inscripciones (5.3)
    public DateTime? FechaInicioInscripciones { get; set; }
    public DateTime? FechaFinInscripciones { get; set; }
    public decimal? CuotaInscripcionEquipo { get; set; }
    public decimal? CuotaInscripcionJugador { get; set; }
    public bool InscripcionesAbiertas { get; set; } = false;

    // Ventana horaria para que clubes fijen horarios (5.4)
    public TimeSpan? HoraMinPartidos { get; set; } // Ej: 09:00
    public TimeSpan? HoraMaxPartidos { get; set; } // Ej: 21:00
    public int? DiasAntelacionFijarHorario { get; set; } // Días mínimos antes del partido

    // Visibilidad
    public bool VisibleClub { get; set; }
    public bool VisibleWeb { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}


