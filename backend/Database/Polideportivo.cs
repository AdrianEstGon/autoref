namespace AutoRef_API.Database;
using Microsoft.SqlServer.Types;


public class Polideportivo
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    
    // Ubicación
    public double? Latitud { get; set; }
    public double? Longitud { get; set; }
    public string? Direccion { get; set; }
    public string? Poblacion { get; set; }
    public string? Zona { get; set; }

    // Servicios (JSON o texto)
    public string? Servicios { get; set; }

    // Clubs asociados (relación muchos a muchos, por ahora JSON de IDs)
    public string? ClubesIds { get; set; }

    // Propiedad para la ubicación (tipo GEOGRAPHY)
    public SqlGeography? Ubicacion
    {
        get
        {
            if (Latitud.HasValue && Longitud.HasValue)
                return SqlGeography.Point(Latitud.Value, Longitud.Value, 4326);
            return null;
        }
    }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}

