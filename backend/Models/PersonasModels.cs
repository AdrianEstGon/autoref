namespace AutoRef_API.Models;

using System;
using AutoRef_API.Enum;

public class PersonaUpsertModel
{
    public string Documento { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public TipoPersona Tipo { get; set; }

    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Provincia { get; set; }
    public string? Ciudad { get; set; }
}


