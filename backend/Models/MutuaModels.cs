namespace AutoRef_API.Models;

using System;
using System.Collections.Generic;
using AutoRef_API.Enum;

public class CompeticionCreateUpdateModel
{
    public string Nombre { get; set; } = string.Empty;
    public bool EsFederada { get; set; }
    public bool Activa { get; set; } = true;

    // 5.3: por temporada y modalidad
    public Guid? TemporadaId { get; set; }
    public Guid? ModalidadId { get; set; }
}

public class InscripcionCreateModel
{
    // Persona
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public TipoPersona Tipo { get; set; }

    // Contacto (opcional)
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Provincia { get; set; }
    public string? Ciudad { get; set; }

    // Inscripción
    public Guid EquipoId { get; set; }
    public Guid CompeticionId { get; set; }
    public bool MutuaSolicitada { get; set; }
}

public class InscripcionUpdateModel
{
    public bool MutuaSolicitada { get; set; }
}

public class MutuaPendienteDto
{
    public Guid InscripcionId { get; set; }
    public Guid PersonaId { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public TipoPersona Tipo { get; set; }

    public string Categoria { get; set; } = string.Empty;
    public string Equipo { get; set; } = string.Empty;
    public string Club { get; set; } = string.Empty;
    public string Competicion { get; set; } = string.Empty;
    public bool CompeticionFederada { get; set; }

    public bool MutuaSolicitadaPorClub { get; set; }
    public DateTime? FechaSolicitud { get; set; }

    // UI: check por defecto (club solicitó o es competición federada)
    public bool CheckDefaultEnviar { get; set; }
}

public class MutuaEnviarRequest
{
    public List<Guid> InscripcionIds { get; set; } = new();
}

public class EnvioMutuaResumenDto
{
    public Guid EnvioId { get; set; }
    public DateTime FechaEnvioMutua { get; set; }
    public int TotalItems { get; set; }
}


