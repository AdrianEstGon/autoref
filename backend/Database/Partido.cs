namespace AutoRef_API.Database;


using System;

public class Partido
{
    public Guid Id { get; private set; }
    public Guid? LugarId { get; set; }
    public Guid? Arbitro1Id { get; set; }
    public Guid? Arbitro2Id { get; set; }
    public Guid? AnotadorId { get; set; }
    public DateTime Fecha { get; set; }
    public TimeSpan Hora { get; set; }
    public Guid? EquipoLocalId { get; set; }
    public Guid? EquipoVisitanteId { get; set; }
    public Guid? CategoriaId { get; set; }
    public int Jornada { get; set; }
    public int NumeroPartido { get; set; }

    public int EstadoArbitro1 { get; set; }
    public int EstadoArbitro2 { get; set; }
    public int EstadoAnotador { get; set; }




    public virtual Polideportivo Lugar { get; set; }

    public virtual Usuario Arbitro1 { get; set; }
    public virtual Usuario Arbitro2 { get; set; }
    public virtual Usuario Anotador { get; set; }
    public virtual Equipo EquipoLocal { get; set; }
    public virtual Equipo EquipoVisitante { get; set; }

    public virtual Categoria Categoria { get; set; }

}

