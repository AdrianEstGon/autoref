namespace AutoRef_API.Database
{
    public class Categoria
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? NombrePlaya { get; set; }
        public string? Token { get; set; }
        public string? Descripcion { get; set; }
        public string? Color { get; set; }
        
        public int Posicion { get; set; }
        public int Prioridad { get; set; }

        // Rango de edad
        public int? EdadInicio { get; set; }
        public int? NumeroAnios { get; set; }
        public DateTime? BornFrom { get; set; }
        public DateTime? BornTo { get; set; }

        // Dimensiones pista/playa por género
        public string? DimensionesPistaMasculino { get; set; }
        public string? DimensionesPlayaMasculino { get; set; }
        public string? DimensionesPistaFemenino { get; set; }
        public string? DimensionesPlayaFemenino { get; set; }

        // Federado
        public bool Federado { get; set; }

        // Categorías que pueden jugar en esta (IDs separados por coma o JSON)
        public string? CategoriasPermitidas { get; set; }

        // Arbitraje
        public string? PrimerArbitro { get; set; }
        public string? SegundoArbitro { get; set; }
        public string? Anotador { get; set; }
        public int MinArbitros { get; set; }

        // Control de plantilla (jugadores)
        public int? MinJugadores { get; set; }
        public int? MaxJugadores { get; set; }

        // Importación
        public long? ImportId { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaDestruccion { get; set; }
    }
}
