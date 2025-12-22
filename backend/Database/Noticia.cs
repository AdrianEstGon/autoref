namespace AutoRef_API.Database;

/// <summary>
/// Noticias y comunicaciones oficiales de la federación para el portal web público.
/// Requisito 5.9: Espacio de noticias y comunicaciones oficiales de la federación.
/// </summary>
public class Noticia
{
    public Guid Id { get; set; }

    public string Titulo { get; set; } = string.Empty;
    public string? Resumen { get; set; }
    public string Contenido { get; set; } = string.Empty;

    public string? ImagenUrl { get; set; }

    public bool Publicada { get; set; } = false;
    public bool Destacada { get; set; } = false;

    public DateTime FechaPublicacion { get; set; }
    public DateTime FechaCreacionUtc { get; set; } = DateTime.UtcNow;
    public DateTime? FechaModificacionUtc { get; set; }

    public Guid? AutorUsuarioId { get; set; }
    public Usuario? AutorUsuario { get; set; }

    public Guid FederacionId { get; set; }
    public Federacion? Federacion { get; set; }

    // Importación
    public long? ImportId { get; set; }
}
