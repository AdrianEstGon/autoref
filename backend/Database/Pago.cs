namespace AutoRef_API.Database;

using System;

public class Pago
{
    public Guid Id { get; set; }
    public string? Ref { get; set; }
    public DateTime? Fecha { get; set; }

    // Tipo de pago
    public string? Tipo { get; set; }
    public decimal Importe { get; set; }
    public string? Descripcion { get; set; }

    // Relaciones opcionales según el tipo
    public Guid? ClubId { get; set; }
    public virtual Club? Club { get; set; }

    public Guid? PersonaId { get; set; }
    public virtual Persona? Persona { get; set; }

    public Guid? EquipoId { get; set; }
    public virtual Equipo? Equipo { get; set; }

    public Guid? JugadorId { get; set; }
    public virtual Jugador? Jugador { get; set; }

    public Guid? PartidoId { get; set; }
    public virtual Partido? Partido { get; set; }

    public Guid? FacturaId { get; set; }
    public virtual Factura? Factura { get; set; }

    public Guid? LicenciaId { get; set; }
    public virtual LicenciaPersona? Licencia { get; set; }

    // Cliente y token (para pagos externos)
    public string? Cliente { get; set; }
    public string? Token { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}
