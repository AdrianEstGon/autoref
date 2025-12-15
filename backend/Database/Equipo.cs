namespace AutoRef_API.Database;


using System;

public class Equipo
{
    public Guid Id { get; set; }
    public Guid? ClubId { get; set; }
    public Guid? CategoriaId { get; set; }
    public string Nombre { get; set; }
    

    public virtual Club Club { get; set; }
    public virtual Categoria Categoria { get; set; }

}

