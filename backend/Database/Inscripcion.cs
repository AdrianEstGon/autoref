namespace AutoRef_API.Database;

using System;

public class Inscripcion
{
    public Guid Id { get; set; }

    public Guid PersonaId { get; set; }
    public Guid EquipoId { get; set; }
    public Guid CompeticionId { get; set; }

    // Solicitud desde Club
    public bool MutuaSolicitada { get; set; }
    public DateTime? FechaSolicitud { get; set; }

    public DateTime FechaInscripcion { get; set; } = DateTime.UtcNow;
    public bool Activa { get; set; } = true;

    public Persona Persona { get; set; } = null!;
    public Equipo Equipo { get; set; } = null!;
    public Competicion Competicion { get; set; } = null!;
}
