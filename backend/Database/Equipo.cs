namespace AutoRef_API.Database;


using System;

public class Equipo
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    
    // Relaciones
    public Guid? ClubId { get; set; }
    public virtual Club? Club { get; set; }

    public Guid? CompeticionId { get; set; }
    public virtual Competicion? Competicion { get; set; }

    public Guid? CategoriaId { get; set; }
    public virtual Categoria? Categoria { get; set; }

    public Guid? CampoJuegoId { get; set; }
    public virtual Polideportivo? CampoJuego { get; set; }

    public Guid? TorneoId { get; set; }
    public Guid? EdicionId { get; set; }
    public Guid? InscritoPorId { get; set; }

    // Datos adicionales
    public string? Comentarios { get; set; }
    public string? Sexo { get; set; }
    public string? Estado { get; set; }
    
    // Ranking
    public int? PosicionRanking { get; set; }
    public decimal? PuntosRanking { get; set; }
    public int? IndiceCategoría { get; set; }
    public decimal? ValorAleatorioEmpates { get; set; }

    // Inscripción circuito
    public bool InscripcionCircuitoCompleto { get; set; }

    // Datos de jugadores (JSON)
    public string? PlayerData { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}

