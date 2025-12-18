namespace AutoRef_API.Database;

public static class SeedIds
{
    // Actualmente solo existe una federación (Asturiana) y todo cuelga de ella
    public static readonly Guid FederacionAsturianaId = Guid.Parse("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375");

    // Temporada/Modalidad por defecto (para arrancar el sistema sin configuración previa)
    public static readonly Guid TemporadaDefaultId = Guid.Parse("b1a7f4c6-41f2-4d3d-9ab5-5a8e3fd5c2d1");
    public static readonly Guid ModalidadDefaultId = Guid.Parse("7a6a2a2f-6136-4c38-9b25-3a6a2a7e4e1b");
}


