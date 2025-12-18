namespace AutoRef_API.Database;

using System;
using System.Collections.Generic;

public class EnvioMutua
{
    public Guid Id { get; set; }

    public DateTime FechaEnvioMutua { get; set; } = DateTime.UtcNow;

    // Usuario federación que genera el envío (opcional)
    public Guid? GeneradoPorUsuarioId { get; set; }
    public Usuario? GeneradoPorUsuario { get; set; }

    public ICollection<EnvioMutuaItem> Items { get; set; } = new List<EnvioMutuaItem>();
}


