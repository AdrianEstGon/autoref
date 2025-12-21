namespace AutoRef_API.Database;

using System;

public class FaseTorneo
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    // Relaciones
    public Guid? EdicionId { get; set; }
    public Guid? TorneoId { get; set; }

    // Configuración de fase
    public int NumeroFase { get; set; }
    public string? TipoFase { get; set; }

    // Horarios
    public string? Dia { get; set; }
    public TimeSpan? HoraInicio { get; set; }
    public TimeSpan? HoraObjetivoFin { get; set; }

    // Pista
    public string? TamanoPista { get; set; }
    public bool EspecificarNumPista { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
