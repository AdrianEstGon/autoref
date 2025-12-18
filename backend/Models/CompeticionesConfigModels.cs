namespace AutoRef_API.Models;

public class CompeticionCategoriaConfigDto
{
    public Guid CategoriaId { get; set; }
    public bool Activa { get; set; } = true;
    public DateTime? InscripcionDesde { get; set; }
    public DateTime? InscripcionHasta { get; set; }
    public decimal? Cuota { get; set; }
}

public class CompeticionCategoriasSetModel
{
    public List<CompeticionCategoriaConfigDto> Items { get; set; } = new();
}

public class CompeticionReglasDto
{
    public int PuntosVictoria { get; set; } = 3;
    public int PuntosEmpate { get; set; } = 1;
    public int PuntosDerrota { get; set; } = 0;
    public List<string> OrdenDesempate { get; set; } = new();
}

public class GenerarCalendarioRequest
{
    public Guid CategoriaId { get; set; }
    public DateTime FechaInicio { get; set; } // date
    public int DiasEntreJornadas { get; set; } = 7;
    public string Hora { get; set; } = "10:00";
    public bool DobleVuelta { get; set; } = false;
}


