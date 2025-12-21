namespace AutoRef_API.Database;

using System;

public class GrupoEdicion
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    // Relaciones
    public Guid? FaseEdicionId { get; set; }
    public Guid? EdicionId { get; set; }

    public Guid? CampoJuegoId { get; set; }
    public virtual Polideportivo? CampoJuego { get; set; }

    // Configuración
    public string? TipoCompeticion { get; set; }
    public string? AsignacionEquipos { get; set; }
    public string? Estado { get; set; }
    public string? FechasJuego { get; set; }
    public string? CriteriosClasificacion { get; set; }

    // Pista
    public int? NumeroPista { get; set; }

    // Pago arbitraje
    public string? PagoArbitraje { get; set; }
    public Guid? PagadorFijoId { get; set; }

    // Cache clasificación
    public string? CacheClasificacion { get; set; }
    public string? CacheHtmlClasificacion { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
