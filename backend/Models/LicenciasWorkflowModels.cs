namespace AutoRef_API.Models;

using AutoRef_API.Enum;

public class SolicitarLicenciaModel
{
    public Guid PersonaId { get; set; }
    public Guid TemporadaId { get; set; }
    public Guid ModalidadId { get; set; }
    public Guid? CategoriaBaseId { get; set; }
    public string? Observaciones { get; set; }
}

public class ValidarLicenciaModel
{
    public bool Aprobar { get; set; }
    public string? NumeroLicencia { get; set; }
    public string? MotivoRechazo { get; set; }
}


