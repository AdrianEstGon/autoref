namespace AutoRef_API.Database;


using System;

public class Partido
{
    public Guid Id { get; private set; }
    public Guid LugarId { get; set; }
    public string Arbitro1Id { get; set; }
    public string Arbitro2Id { get; set; }
    public string AnotadorId { get; set; }
    public DateTime Fecha { get; set; }
    public TimeSpan Hora { get; set; }
    public string EquipoLocal { get; set; }
    public string EquipoVisitante { get; set; }
    public string Categoria { get; set; }
    public string Competicion { get; set; }



    public virtual Polideportivo Lugar { get; set; }

    public virtual Usuario Arbitro1 { get; set; }
    public virtual Usuario Arbitro2 { get; set; }
    public virtual Usuario Anotador { get; set; }

}

