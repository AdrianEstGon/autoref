namespace AutoRef_API.Database
{
    public class Notificacion
    {
        public Guid Id { get; set; }
        public Guid? UsuarioId { get; set; }
        public string Mensaje { get; set; }
        public DateTime Fecha { get; set; }
        public bool Leida { get; set; }

        // Tipo de notificación para alertas automáticas (5.4, 5.5)
        public string? Tipo { get; set; } // CambioPartido, Designacion, Licencia, etc.
        public Guid? ReferenciaId { get; set; } // ID del objeto relacionado
        public string? Url { get; set; } // URL para navegar directamente

        public virtual Usuario Usuario { get; set; }
    }
}
