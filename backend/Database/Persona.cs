namespace AutoRef_API.Database;

using System;
using AutoRef_API.Enum;

public class Persona
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public string? TipoDocumento { get; set; }
    public DateTime? FechaNacimiento { get; set; }
    public string? Sexo { get; set; }
    public TipoPersona Tipo { get; set; }

    // Contacto
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Provincia { get; set; }
    public string? Ciudad { get; set; }
    public string? Poblacion { get; set; }
    public double? Lat { get; set; }
    public double? Lng { get; set; }

    // Comentarios y notas
    public string? Comentarios { get; set; }

    // Usuario de aplicación (relación)
    public Guid? AppUserId { get; set; }

    // Disponibilidad y vacaciones (JSON o texto)
    public string? Disponibilidad { get; set; }
    public string? Vacaciones { get; set; }

    // Datos bancarios
    public string? NumeroCuenta { get; set; }

    // Nacionalidad
    public string? Nacionalidad { get; set; }

    // Arbitraje
    public string? ZonaArbitraje { get; set; }
    public string? NivelArbitro { get; set; }

    // Entrenador
    public string? NivelEntrenador { get; set; }

    // Certificados
    public bool? CertificadoAusenciaDelitos { get; set; }

    // Licencias antiguas
    public string? NumeroLicenciaAntiguo { get; set; }

    // Mutua (estado global)
    public bool MutuaEnviada { get; set; }
    public DateTime? FechaEnvioMutua { get; set; }
    public Guid? UltimoEnvioMutuaId { get; set; }
    public EnvioMutua? UltimoEnvioMutua { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public long? OldId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}


