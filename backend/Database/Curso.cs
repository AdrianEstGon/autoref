namespace AutoRef_API.Database;

using System;

public class Curso
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Permalink { get; set; }

    // Fechas de inscripción
    public DateTime? InicioInscripcion { get; set; }
    public DateTime? FinInscripcion { get; set; }

    // Información
    public string? Requisitos { get; set; }
    public string? Formato { get; set; }
    public decimal? Precio { get; set; }
    public string? InformacionAdicional { get; set; }
    public string? ImagenCabecera { get; set; }

    // Entidad organizadora
    public string? Entidad { get; set; }
    public Guid? FederacionId { get; set; }
    public virtual Federacion? Federacion { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
