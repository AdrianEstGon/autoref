namespace AutoRef_API.Models;

public class EquipoUpsertModel
{
    public string Nombre { get; set; } = string.Empty;
    public Guid ClubId { get; set; }
    public Guid CompeticionId { get; set; }
    public Guid CategoriaId { get; set; }
}


