namespace AutoRef_API.Models;

public class CrearCambioPartidoModel
{
    public DateTime FechaPropuesta { get; set; } // date
    public string HoraPropuesta { get; set; } = "10:00";
    public Guid? LugarPropuestoId { get; set; }
    public string? Motivo { get; set; }
}

public class ResponderCambioClubModel
{
    public bool Aceptar { get; set; }
    public string? Comentario { get; set; }
}

public class ValidarCambioFederacionModel
{
    public bool Aprobar { get; set; }
    public string? Comentario { get; set; }
}

public class FijarHorarioLocalModel
{
    public DateTime Fecha { get; set; } // date
    public string Hora { get; set; } = "10:00";
    public Guid? LugarId { get; set; }
}


