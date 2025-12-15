using AutoRef_API.Database;
using AutoRef_API.Enum;

namespace AutoRef_API.Models
{
    public class DisponibilidadModel
    {
        public Guid? UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public FranjaDisponibilidad Franja1 { get; set; }
        public FranjaDisponibilidad Franja2 { get; set; }
        public FranjaDisponibilidad Franja3 { get; set; }
        public FranjaDisponibilidad Franja4 { get; set; }
        public string Comentarios { get; set; }
    }
}
