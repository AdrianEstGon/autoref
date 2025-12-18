namespace AutoRef_API.Database;

using System;

public class EnvioMutuaItem
{
    public Guid Id { get; set; }

    public Guid EnvioMutuaId { get; set; }
    public Guid InscripcionId { get; set; }

    public EnvioMutua EnvioMutua { get; set; } = null!;
    public Inscripcion Inscripcion { get; set; } = null!;
}


