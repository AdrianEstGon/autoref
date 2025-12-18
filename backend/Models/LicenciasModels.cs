namespace AutoRef_API.Models;

using System;
using System.Collections.Generic;

public class LicenciaUpsertModel
{
    public Guid PersonaId { get; set; }
    public Guid TemporadaId { get; set; }
    public Guid ModalidadId { get; set; }
    public Guid? CategoriaBaseId { get; set; }

    public string? NumeroLicencia { get; set; }
    public bool Activa { get; set; } = true;
    public string? Observaciones { get; set; }
}

public class LicenciaHabilitacionesModel
{
    public List<Guid> CategoriaIds { get; set; } = new();
}


