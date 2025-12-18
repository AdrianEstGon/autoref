namespace AutoRef_API.Database;

using System;
using AutoRef_API.Enum;

public class Persona
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public TipoPersona Tipo { get; set; }

    // Mutua (estado global: si ya fue enviada, no se vuelve a gestionar en nuevas inscripciones)
    public bool MutuaEnviada { get; set; }
    public DateTime? FechaEnvioMutua { get; set; }
    public Guid? UltimoEnvioMutuaId { get; set; }

    public EnvioMutua? UltimoEnvioMutua { get; set; }
}


