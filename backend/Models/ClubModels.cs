namespace AutoRef_API.Models;

public class ClubUpsertModel
{
    public string Nombre { get; set; } = string.Empty;

    public string? RazonSocial { get; set; }
    public string? CIF { get; set; }
    public string? DireccionFiscal { get; set; }
    public string? CodigoPostalFiscal { get; set; }
    public string? ProvinciaFiscal { get; set; }
    public string? CiudadFiscal { get; set; }
    public string? EmailFacturacion { get; set; }
    public string? Telefono { get; set; }

    public string? ResponsableNombre { get; set; }
    public string? ResponsableEmail { get; set; }
    public string? ResponsableTelefono { get; set; }
}


