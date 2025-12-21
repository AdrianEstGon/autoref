namespace AutoRef_API.Database;

using System;

public class FechaEntrenamiento
{
    public Guid Id { get; set; }

    // Relación con entrenamiento/training
    public Guid? TrainingId { get; set; }

    // Fecha y horario
    public string? Dia { get; set; }
    public string? Horario { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
