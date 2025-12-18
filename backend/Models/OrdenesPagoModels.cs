namespace AutoRef_API.Models;

public class GenerarOrdenPagoModel
{
    public DateTime PeriodoDesde { get; set; } // date
    public DateTime PeriodoHasta { get; set; } // date
    public string? Referencia { get; set; }
}


