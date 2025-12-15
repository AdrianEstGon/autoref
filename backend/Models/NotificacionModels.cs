namespace AutoRef_API.Models
{
    public class NotificacionModel
    {
        public Guid? UsuarioId { get; set; }
        public string Mensaje { get; set; }

        public DateTime Fecha { get; set; }
    }

    public class UpdateNotificacionModel
    {
        public Guid? UsuarioId { get; set; }
        public string Mensaje { get; set; }

        public DateTime Fecha { get; set; }
        public bool Leida { get; set; }
    }
}
