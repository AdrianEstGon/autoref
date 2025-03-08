namespace AutoRef_API.Database;
using Microsoft.SqlServer.Types;


public class Polideportivo
{
    public Guid Id { get; private set; }    
    public string Nombre { get; set; }
    public double Latitud { get; set; }
    public double Longitud { get; set; }

    // Propiedad para la ubicación (tipo GEOGRAPHY)
    public SqlGeography Ubicacion
    {
        get
        {
            // Convertimos las coordenadas en un objeto SqlGeography
            return SqlGeography.Point(Latitud, Longitud, 4326); // SRID 4326 es el sistema de coordenadas geográficas WGS 84
        }
    }
}

