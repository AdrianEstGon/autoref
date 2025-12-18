namespace AutoRef_API.Models;

public class ActaSetModel
{
    public int Local { get; set; }
    public int Visitante { get; set; }
}

public class ActaIncidenciaModel
{
    public string Tipo { get; set; } = "Incidencia";
    public string? Momento { get; set; } // "min 12", "set 2", etc.
    public string Descripcion { get; set; } = string.Empty;
}

public class ActaPartidoUpsertModel
{
    public List<Guid> ParticipantesLocal { get; set; } = new();
    public List<Guid> ParticipantesVisitante { get; set; } = new();
    public List<ActaSetModel> Sets { get; set; } = new();
    public List<ActaIncidenciaModel> Incidencias { get; set; } = new();
    public string? Observaciones { get; set; }

    // Alternativa a sets (deporte sin periodos/sets)
    public int? ResultadoLocal { get; set; }
    public int? ResultadoVisitante { get; set; }
}

public class RosterPersonaDto
{
    public Guid PersonaId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
}

public class ActaPartidoDto
{
    public Guid PartidoId { get; set; }
    public bool Cerrado { get; set; }
    public DateTime? FechaCierreUtc { get; set; }
    public int? ResultadoLocal { get; set; }
    public int? ResultadoVisitante { get; set; }

    public object Partido { get; set; } = null!;
    public List<RosterPersonaDto> RosterLocal { get; set; } = new();
    public List<RosterPersonaDto> RosterVisitante { get; set; } = new();
    public ActaPartidoUpsertModel Acta { get; set; } = new();
}


