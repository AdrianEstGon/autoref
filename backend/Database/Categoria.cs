namespace AutoRef_API.Database
{
    public class Categoria
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string? PrimerArbitro { get; set; }
        public string? SegundoArbitro { get; set; }
        public string? Anotador { get; set; }
        public int MinArbitros { get; set; }

        public int Prioridad { get; set; }


    }
}
