namespace AutoRef_API.Database;

using System;

public class Competicion
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool EsFederada { get; set; }
    public bool Activa { get; set; } = true;
}


