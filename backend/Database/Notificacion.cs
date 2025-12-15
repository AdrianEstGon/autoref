namespace AutoRef_API.Database
{
    public class Notificacion
    {
        public Guid Id { get; set; }
        public Guid? UsuarioId { get; set; }
        public string Mensaje { get; set; }
        public DateTime Fecha { get; set; }
        public bool Leida { get; set; }

        public virtual Usuario Usuario { get; set; }
    }
}
