namespace AutoRef_API.Database;

using System;

public class Jugador
{
    public Guid Id { get; set; }

    // Relaciones principales
    public Guid? PersonaId { get; set; }
    public virtual Persona? Persona { get; set; }

    public Guid? EquipoId { get; set; }
    public virtual Equipo? Equipo { get; set; }

    public Guid? EdicionId { get; set; }

    // Rol en el equipo
    public string? Rol { get; set; }
    public int? Numero { get; set; }

    // Licencia
    public bool TieneLicencia { get; set; }
    public string? Nacionalidad { get; set; }

    // Habilitaciones
    public bool HabilitadoCategoriaSuperior { get; set; }
    public bool HabilitadoCategoriaNacional { get; set; }

    // Entrenador
    public string? CategoriaEntrenador { get; set; }

    // Creación
    public bool CreadoPorArbitro { get; set; }

    // Seguro médico
    public bool? TieneSeguroMedico { get; set; }
    public bool? PermitidoMayor { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
