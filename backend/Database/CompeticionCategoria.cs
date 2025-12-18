namespace AutoRef_API.Database;

public class CompeticionCategoria
{
    public Guid Id { get; set; }

    public Guid CompeticionId { get; set; }
    public Guid CategoriaId { get; set; }

    // Apertura de inscripciones (para clubes) + cuota definida por federación
    public DateTime? InscripcionDesde { get; set; }
    public DateTime? InscripcionHasta { get; set; }
    public decimal? Cuota { get; set; } // € por inscripción/equipo (primera versión)
    public bool Activa { get; set; } = true;

    public Competicion Competicion { get; set; } = null!;
    public Categoria Categoria { get; set; } = null!;
}


