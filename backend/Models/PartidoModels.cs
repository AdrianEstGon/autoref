namespace AutoRef_API.Models
{
    public class PartidoModel
    {
        public Guid? EquipoLocalId { get; set; } 
        public Guid? EquipoVisitanteId { get; set; } 
        public DateTime Fecha { get; set; }     
        public string Hora { get; set; }         
        public Guid? LugarId { get; set; }           
        public Guid? CategoriaId { get; set; }                                                
        public int Jornada { get; set; }          
        public int NumeroPartido { get; set; }   

    }

    public class UpdatePartidoModel
    {
        public Guid Id { get; set; }
        public Guid? EquipoLocalId { get; set; }   
        public Guid? EquipoVisitanteId { get; set; } 
        public DateTime Fecha { get; set; }
        public string Hora { get; set; }         
        public Guid? LugarId { get; set; }          
        public Guid? CategoriaId { get; set; }                                          
        public int Jornada { get; set; }           
        public int NumeroPartido { get; set; }      

        public Guid? Arbitro1Id { get; set; }
        public Guid? Arbitro2Id { get; set; }
        public Guid? AnotadorId {  get; set; }
        public int EstadoArbitro1 { get; set; }

        public int EstadoArbitro2 { get; set; }
        public int EstadoAnotador { get; set; }

    }
}
