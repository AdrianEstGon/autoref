namespace AutoRef_API.Database
{
    public class Club
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;

        public Guid FederacionId { get; set; }
        public virtual Federacion? Federacion { get; set; }
    }
}
