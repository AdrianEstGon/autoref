using System;
using Microsoft.SqlServer.Types;  

namespace AutoRef_API.Database;

using Microsoft.AspNetCore.Identity;

public class ApplicationRole : IdentityRole<Guid>
{
}

public class Usuario : IdentityUser<Guid>
{

    public override Guid Id { get; set; }
    public override string? Email { get; set; }
    public string? Nombre { get; set; }
    public string? PrimerApellido { get; set; }
    public string? SegundoApellido { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? Nivel { get; set; }
    public Guid? ClubVinculadoId { get; set; }
    public int Licencia { get; set; }
    public string? Direccion { get; set; }
    public string? Pais { get; set; }
    public string? Region { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public double Latitud { get; set; }  
    public double Longitud { get; set; }

    public string? FotoPerfil { get; set; }

    public SqlGeography Ubicacion
    {
        get
        {
            return SqlGeography.Point(Latitud, Longitud, 4326); // SRID 4326 es el sistema de coordenadas geográficas WGS 84
        }
    }
    public Club? ClubVinculado { get; set; }
}
