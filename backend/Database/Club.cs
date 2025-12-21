namespace AutoRef_API.Database
{
    public class Club
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;

        public Guid FederacionId { get; set; }
        public virtual Federacion? Federacion { get; set; }

        // Datos de contacto
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Escudo { get; set; }

        // Datos fiscales
        public string? RazonSocial { get; set; }
        public string? CIF { get; set; }
        public string? DireccionFiscal { get; set; }
        public string? CodigoPostalFiscal { get; set; }
        public string? ProvinciaFiscal { get; set; }
        public string? CiudadFiscal { get; set; }
        public string? EmailFacturacion { get; set; }

        // Responsables
        public string? ResponsableNombre { get; set; }
        public string? ResponsableEmail { get; set; }
        public string? ResponsableTelefono { get; set; }

        // IDs externos (importación)
        public long? ClientId { get; set; }
        public long? AppUserId { get; set; }
        public Guid? AdministracionAsociadaId { get; set; }

        // Importación
        public long? ImportId { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaDestruccion { get; set; }
    }
}
